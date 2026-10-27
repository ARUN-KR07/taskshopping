import React from 'react';
import { useCartStore } from '../store/cartStore';
import {
  formatCurrency,
  MIN_CHECKOUT_VALUE,
  DISCOUNT_THRESHOLD,
} from '../utils/cartCalculations';

interface CartSummaryProps {
  onCheckout?: () => void;
  isCheckoutPage?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  onCheckout,
  isCheckoutPage = false,
}) => {
  const { getTotals, clearCart, items } = useCartStore();
  const totals = getTotals();

  return (
    <div className="card border shadow-sm">
      <div className="card-header bg-white border-bottom py-3">
        <h5 className="card-title mb-0 fw-bold">Order Summary</h5>
      </div>

      <div className="card-body p-4">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Subtotal ({totals.itemCount} items):</span>
          <span className="fw-semibold">{formatCurrency(totals.subtotal)}</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Tax (5%):</span>
          <span className="fw-semibold">{formatCurrency(totals.tax)}</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Discount (10% over $100):</span>
          {totals.discount > 0 ? (
            <span className="text-success fw-bold">-{formatCurrency(totals.discount)}</span>
          ) : (
            <span className="text-muted">$0.00</span>
          )}
        </div>

        {totals.subtotal > 0 && totals.subtotal <= DISCOUNT_THRESHOLD && (
          <div className="alert alert-light border py-1 px-2 small text-muted mb-3">
            Add <strong>{formatCurrency(DISCOUNT_THRESHOLD - totals.subtotal)}</strong> more to unlock a 10% discount!
          </div>
        )}

        <hr />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fs-5 fw-bold">Final Total:</span>
          <span className="fs-4 fw-bold text-primary">
            {formatCurrency(totals.finalTotal)}
          </span>
        </div>

        {items.length > 0 && !totals.isCheckoutAllowed && (
          <div className="alert alert-warning py-2 px-3 small mb-3">
            <strong>Minimum order required:</strong> Minimum checkout value is{' '}
            <strong>{formatCurrency(MIN_CHECKOUT_VALUE)}</strong>. Please add{' '}
            <strong>{formatCurrency(totals.minCheckoutShortfall)}</strong> more of items to proceed.
          </div>
        )}

        {!isCheckoutPage && onCheckout && (
          <button
            className="btn btn-primary w-100 py-2 fw-semibold mb-2"
            disabled={items.length === 0 || !totals.isCheckoutAllowed}
            onClick={onCheckout}
          >
            {items.length === 0
              ? 'Cart is Empty'
              : !totals.isCheckoutAllowed
              ? `Min Order ${formatCurrency(MIN_CHECKOUT_VALUE)} Required`
              : 'Proceed to Checkout'}
          </button>
        )}

        {items.length > 0 && (
          <button
            className="btn btn-outline-secondary btn-sm w-100"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </div>
    </div>
  );
};
