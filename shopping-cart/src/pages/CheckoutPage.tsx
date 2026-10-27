import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../components/CartItem';
import { shippingSchema, type ShippingFormValues } from '../schemas/shippingSchema';
import { MIN_CHECKOUT_VALUE, formatCurrency } from '../utils/cartCalculations';

interface CheckoutPageProps {
  onContinueShopping: () => void;
}

type CheckoutStep = 1 | 2 | 3;

// ==========================================
// 1. STATE & CHECKOUT STEP CONTROLS
// ==========================================
export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onContinueShopping }) => {
  // Global cart store values
  const { items, clearCart, getTotals } = useCartStore();
  const totals = getTotals();

  // Current checkout step: 1 (Cart Review) -> 2 (Shipping) -> 3 (Payment Summary)
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);

  // Step 2: Shipping form state (managed via React useState, no Formik/RHF)
  const [formData, setFormData] = useState<ShippingFormValues>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Validation errors map for inline input feedback
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormValues, string>>>({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Snapshot of order summary saved right before cart is emptied
  const [orderSummarySnapshot, setOrderSummarySnapshot] = useState<{
    totalPaid: number;
    subtotal: number;
    tax: number;
    discount: number;
    itemCount: number;
  } | null>(null);

  // ==========================================
  // 2. FORM HANDLERS & STEP TRANSITIONS
  // ==========================================
  // Handle form input change and clear field errors dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Step 1 -> Step 2 validation: requires cart items & subtotal >= $10
  const handleProceedToShipping = () => {
    if (items.length === 0 || !totals.isCheckoutAllowed) {
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 -> Step 3 validation: validate using Zod safeParse
  const handleProceedToPaymentSummary = (e: React.FormEvent) => {
    e.preventDefault();
    const result = shippingSchema.safeParse(formData);

    if (!result.success) {
      // Map Zod issues to individual field error messages
      const fieldErrors: Partial<Record<keyof ShippingFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof ShippingFormValues;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setCurrentStep(3);
  };

  // Step 3 -> Order Placement: Snapshot total paid, mark success, and clear cart
  const handlePlaceOrder = () => {
    setOrderSummarySnapshot({
      totalPaid: totals.finalTotal,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      itemCount: totals.itemCount,
    });
    setOrderSuccess(true);
    clearCart();
  };

  if (orderSuccess && orderSummarySnapshot) {
    return (
      <div className="container py-4 py-md-5 px-3 text-center">
        <div className="card border p-4 p-md-5 mx-auto shadow-sm" style={{ maxWidth: '580px' }}>
          <div className="display-4 text-success mb-2">✓</div>
          <h2 className="fw-bold mb-2 fs-3 fs-md-2">Order placed successfully!</h2>
          <p className="lead text-muted mb-3 fs-6">Thank you for your purchase.</p>

          <div className="bg-success-subtle border border-success-subtle text-success-emphasis p-3 rounded-3 mb-4">
            <span className="text-uppercase small fw-bold d-block mb-1">Total Paid</span>
            <span className="display-6 fw-bold">{formatCurrency(orderSummarySnapshot.totalPaid)}</span>
            <div className="small text-muted mt-1">
              Subtotal: {formatCurrency(orderSummarySnapshot.subtotal)} | Tax (5%): {formatCurrency(orderSummarySnapshot.tax)}
              {orderSummarySnapshot.discount > 0 && ` | Discount: -${formatCurrency(orderSummarySnapshot.discount)}`}
            </div>
          </div>

          <div className="p-3 bg-light rounded text-start mb-4 border">
            <h6 className="fw-bold mb-2">Delivery Details</h6>
            <div className="small text-secondary">
              <div><strong>Recipient:</strong> {formData.fullName} ({formData.phone})</div>
              <div><strong>Email:</strong> {formData.email}</div>
              <div><strong>Shipping To:</strong> {formData.address}, {formData.city}, {formData.postalCode}</div>
              <div className="mt-2 text-dark">
                <strong>Items Ordered:</strong> {orderSummarySnapshot.itemCount} unit(s)
              </div>
            </div>
          </div>

          <button className="btn btn-primary w-100 w-sm-auto px-4 py-2" onClick={onContinueShopping}>
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 px-3 text-center">
        <div className="card border p-4 p-md-5 mx-auto shadow-sm" style={{ maxWidth: '520px' }}>
          <div className="display-4 text-muted mb-3">🛒</div>
          <h3 className="fw-bold mb-2 fs-4 fs-md-3">Your Cart is Empty</h3>
          <p className="text-muted small mb-4">
            Your shopping cart currently contains no items. Add items from our catalog to proceed with checkout.
          </p>
          <div>
            <button className="btn btn-primary px-4 py-2 fw-semibold w-100 w-sm-auto" onClick={onContinueShopping}>
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4 px-3 px-sm-3">
      <div className="d-flex align-items-center justify-content-between mb-3 mb-md-4">
        <h2 className="fw-bold mb-0 fs-3 fs-md-2">Checkout</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={onContinueShopping}>
          ← Back
        </button>
      </div>

      <div className="card border mb-3 mb-md-4 bg-white shadow-sm">
        <div className="card-body p-2 p-md-3">
          <div className="checkout-steps-nav">
            <div className={`checkout-step-item ${currentStep === 1 ? 'fw-bold text-primary bg-light' : currentStep > 1 ? 'text-success' : 'text-muted'}`}>
              <span className={`badge rounded-pill step-badge me-1 me-md-2 ${currentStep === 1 ? 'bg-primary' : currentStep > 1 ? 'bg-success' : 'bg-secondary'}`}>
                1
              </span>
              <span className="step-title">Cart Review</span>
            </div>

            <div className={`checkout-step-item ${currentStep === 2 ? 'fw-bold text-primary bg-light' : currentStep > 2 ? 'text-success' : 'text-muted'}`}>
              <span className={`badge rounded-pill step-badge me-1 me-md-2 ${currentStep === 2 ? 'bg-primary' : currentStep > 2 ? 'bg-success' : 'bg-secondary'}`}>
                2
              </span>
              <span className="step-title">Shipping</span>
            </div>

            <div className={`checkout-step-item ${currentStep === 3 ? 'fw-bold text-primary bg-light' : 'text-muted'}`}>
              <span className={`badge rounded-pill step-badge me-1 me-md-2 ${currentStep === 3 ? 'bg-primary' : 'bg-secondary'}`}>
                3
              </span>
              <span className="step-title">Summary</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 g-md-4">
        <div className="col-12 col-lg-8 order-2 order-lg-1">
          {/* ==========================================
              STEP 1: CART REVIEW
              Selected products, quantities & live totals
              ========================================== */}
          {currentStep === 1 && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0 fs-6 fs-md-5">Step 1 — Review Your Cart Items</h5>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small">{items.length} items</span>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    style={{ fontSize: '0.8rem' }}
                    onClick={clearCart}
                    title="Remove all items from your cart"
                  >
                    Empty Cart
                  </button>
                </div>
              </div>

              <div className="mb-3 mb-md-4">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>

              {!totals.isCheckoutAllowed && (
                <div className="alert alert-warning py-2 px-3 small mb-3">
                  <strong>Cannot Continue to Shipping:</strong> Minimum checkout value is{' '}
                  <strong>{formatCurrency(MIN_CHECKOUT_VALUE)}</strong>. Current subtotal:{' '}
                  <strong>{formatCurrency(totals.subtotal)}</strong>. Add{' '}
                  <strong>{formatCurrency(totals.minCheckoutShortfall)}</strong> more to continue.
                </div>
              )}

              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-danger order-2 order-sm-1"
                  onClick={clearCart}
                >
                  Empty Cart
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 fw-semibold order-1 order-sm-2 ms-sm-auto"
                  disabled={items.length === 0 || !totals.isCheckoutAllowed}
                  onClick={handleProceedToShipping}
                >
                  Continue to Shipping →
                </button>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="card border p-3 p-md-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0 fs-6 fs-md-5">Step 2 — Shipping Address</h5>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  style={{ fontSize: '0.8rem' }}
                  onClick={clearCart}
                  title="Empty your cart"
                >
                  Empty Cart
                </button>
              </div>
              <p className="text-muted small mb-3">
                Please enter your delivery details. All fields are required.
              </p>

              <form onSubmit={handleProceedToPaymentSummary} noValidate>
                <div className="row g-2 g-md-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="e.g. +1 555-123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Street Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      placeholder="e.g. 742 Evergreen Terrace"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      placeholder="e.g. Springfield"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">
                      Postal Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                      placeholder="e.g. 97477"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                    {errors.postalCode && (
                      <div className="invalid-feedback">{errors.postalCode}</div>
                    )}
                  </div>

                  <div className="col-12 mt-3 d-flex flex-column flex-sm-row justify-content-between gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary order-2 order-sm-1"
                      onClick={() => setCurrentStep(1)}
                    >
                      ← Back to Cart
                    </button>
                    <button type="submit" className="btn btn-primary px-4 fw-semibold order-1 order-sm-2">
                      Continue to Payment Summary →
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ==========================================
              STEP 3: PAYMENT SUMMARY (READ-ONLY)
              Final review, address confirmation & order submission
              ========================================== */}
          {currentStep === 3 && (
            <div>
              <div className="card border p-3 p-md-4 mb-4 shadow-sm">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <h5 className="fw-bold mb-0 fs-6 fs-md-5">Step 3 — Payment Summary (Read-Only)</h5>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={clearCart}
                    >
                      Empty Cart
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setCurrentStep(2)}
                    >
                      Edit Shipping
                    </button>
                  </div>
                </div>

                <h6 className="fw-bold text-secondary mb-2 small text-uppercase">Shipping Information</h6>
                <div className="p-3 bg-light rounded border mb-3">
                  <div className="row g-2 small">
                    <div className="col-12 col-sm-6">
                      <span className="text-muted d-block">Full Name:</span>
                      <strong>{formData.fullName}</strong>
                    </div>
                    <div className="col-12 col-sm-6">
                      <span className="text-muted d-block">Email:</span>
                      <strong>{formData.email}</strong>
                    </div>
                    <div className="col-12 col-sm-6">
                      <span className="text-muted d-block">Phone:</span>
                      <strong>{formData.phone}</strong>
                    </div>
                    <div className="col-12 col-sm-6">
                      <span className="text-muted d-block">Address:</span>
                      <strong>{formData.address}</strong>
                    </div>
                    <div className="col-12 col-sm-6">
                      <span className="text-muted d-block">City:</span>
                      <strong>{formData.city}</strong>
                    </div>
                    <div className="col-12 col-sm-6">
                      <span className="text-muted d-block">Postal Code:</span>
                      <strong>{formData.postalCode}</strong>
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold text-secondary mb-2 small text-uppercase">Order Items</h6>
                <div className="table-responsive mb-3 border rounded">
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th className="text-center" style={{ width: '60px' }}>Qty</th>
                        <th className="text-end" style={{ width: '85px' }}>Price</th>
                        <th className="text-end" style={{ width: '85px' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.product.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                              />
                              <span className="small text-truncate" style={{ maxWidth: '180px' }}>
                                {item.product.title}
                              </span>
                            </div>
                          </td>
                          <td className="text-center fw-semibold">{item.quantity}</td>
                          <td className="text-end small">{formatCurrency(item.product.price)}</td>
                          <td className="text-end fw-semibold">
                            {formatCurrency(item.product.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary order-2 order-sm-1"
                    onClick={() => setCurrentStep(2)}
                  >
                    ← Back to Shipping
                  </button>
                  <button
                    type="button"
                    className="btn btn-success btn-lg px-4 fw-bold order-1 order-sm-2"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-12 col-lg-4 order-1 order-lg-2">
          <div className="position-sticky" style={{ top: '70px' }}>
            <div className="card border shadow-sm">
              <div className="card-header bg-white border-bottom py-2 py-md-3 d-flex justify-content-between align-items-center">
                <h6 className="card-title mb-0 fw-bold">Order Calculation</h6>
              </div>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">Subtotal ({totals.itemCount} items):</span>
                  <span className="fw-semibold">{formatCurrency(totals.subtotal)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">Tax (5%):</span>
                  <span className="fw-semibold">{formatCurrency(totals.tax)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">Discount (10% over $100):</span>
                  {totals.discount > 0 ? (
                    <span className="text-success fw-bold">-{formatCurrency(totals.discount)}</span>
                  ) : (
                    <span className="text-muted">$0.00</span>
                  )}
                </div>

                <hr className="my-2" />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fs-6 fw-bold">Final Total:</span>
                  <span className="fs-5 fw-bold text-primary">
                    {formatCurrency(totals.finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
