import React from 'react';
import type { Product } from '../types/product';
import { useCartStore, MAX_QUANTITY } from '../store/cartStore';
import { formatCurrency } from '../utils/cartCalculations';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);

  const existingInCart = cartItems.find((item) => item.product.id === product.id);
  const currentQuantity = existingInCart ? existingInCart.quantity : 0;
  const stockCount = product.stock ?? 50;
  const isOutOfStock = stockCount <= 0;
  const effectiveMax = Math.min(MAX_QUANTITY, stockCount);
  const isMaxReached = currentQuantity >= effectiveMax;

  const ratingRate = product.rating?.rate ?? 0;
  const ratingCount = product.rating?.count;

  return (
    <div className="card h-100 product-card shadow-sm">
      <div className="product-image-container position-relative">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
        {stockCount !== undefined && (
          <span
            className={`position-absolute top-0 end-0 m-2 badge ${
              isOutOfStock
                ? 'bg-danger'
                : stockCount <= 5
                ? 'bg-warning text-dark'
                : 'bg-success'
            }`}
            style={{ fontSize: '0.72rem' }}
          >
            {isOutOfStock ? 'Out of Stock' : `${stockCount} in stock`}
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <div className="mb-2">
            <span className="badge bg-light text-secondary border text-capitalize fw-normal">
              {product.category}
            </span>
          </div>

          <h6 className="card-title fw-semibold text-truncate mb-2" title={product.title}>
            {product.title}
          </h6>

          <div className="d-flex align-items-center justify-content-between small mb-3">
            <div className="d-flex align-items-center gap-1">
              <span className="text-warning fw-bold">★ {ratingRate.toFixed(1)}</span>
              {ratingCount !== undefined && (
                <span className="text-muted">({ratingCount})</span>
              )}
            </div>

            {stockCount > 0 && stockCount <= 5 && (
              <span className="text-danger fw-semibold" style={{ fontSize: '0.75rem' }}>
                Only {stockCount} left!
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-top d-flex align-items-center justify-content-between mt-auto">
          <div className="fs-5 fw-bold text-dark">{formatCurrency(product.price)}</div>

          <button
            type="button"
            className={`btn btn-sm ${
              isOutOfStock
                ? 'btn-secondary'
                : isMaxReached
                ? 'btn-secondary'
                : 'btn-primary'
            } px-3 fw-medium`}
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock || isMaxReached}
            title={
              isOutOfStock
                ? 'Out of stock'
                : isMaxReached
                ? `Limit reached (${effectiveMax})`
                : 'Add to cart'
            }
          >
            {isOutOfStock
              ? 'Out of Stock'
              : isMaxReached
              ? `Max Reached (${effectiveMax})`
              : currentQuantity > 0
              ? `Add More (${currentQuantity})`
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
