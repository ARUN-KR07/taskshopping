import React from 'react';
import type { CartItemType } from '../types/product';
import { useCartStore, MIN_QUANTITY, MAX_QUANTITY } from '../store/cartStore';
import { formatCurrency } from '../utils/cartCalculations';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  const lineTotal = item.product.price * item.quantity;

  const stockCount = item.product.stock ?? 50;
  const maxAllowed = Math.min(MAX_QUANTITY, stockCount);
  const isMinReached = item.quantity <= MIN_QUANTITY;
  const isMaxReached = item.quantity >= maxAllowed;

  return (
    <div className="card mb-3 border shadow-sm">
      <div className="card-body p-3">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <div className="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
            <div
              className="d-flex align-items-center justify-content-center bg-white rounded border flex-shrink-0"
              style={{ width: '64px', height: '64px', padding: '4px' }}
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="img-fluid"
                style={{ maxHeight: '56px', objectFit: 'contain' }}
              />
            </div>

            <div className="min-w-0 flex-grow-1">
              <h6 className="mb-1 text-truncate fw-semibold" title={item.product.title}>
                {item.product.title}
              </h6>
              <div className="d-flex align-items-center gap-2 small flex-wrap">
                <span className="badge bg-light text-dark border text-capitalize">
                  {item.product.category}
                </span>
                <span className="text-muted">
                  {formatCurrency(item.product.price)} each
                </span>
                {stockCount !== undefined && (
                  <span
                    className={`badge ${
                      stockCount <= 5 ? 'bg-warning text-dark' : 'bg-light text-secondary border'
                    }`}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {stockCount} in stock
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-3 pt-2 pt-sm-0 border-top border-sm-0">
            <div className="d-flex flex-column align-items-start">
              <div className="input-group input-group-sm" style={{ width: '108px' }}>
                <button
                  className="btn btn-outline-secondary px-2"
                  type="button"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  disabled={isMinReached}
                  title={isMinReached ? 'Minimum 1' : 'Decrease'}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="form-control text-center bg-white px-1 fw-bold">
                  {item.quantity}
                </span>
                <button
                  className="btn btn-outline-secondary px-2"
                  type="button"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  disabled={isMaxReached}
                  title={isMaxReached ? `Max ${maxAllowed}` : 'Increase'}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {isMaxReached && (
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  Max {maxAllowed} limit
                </span>
              )}
            </div>

            <div className="text-end" style={{ minWidth: '70px' }}>
              <span className="fw-bold fs-6 text-dark d-block">
                {formatCurrency(lineTotal)}
              </span>
            </div>

            <button
              className="btn btn-sm btn-outline-danger p-1 lh-1"
              style={{ width: '28px', height: '28px' }}
              onClick={() => removeFromCart(item.product.id)}
              title="Remove product"
              aria-label="Remove product"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
