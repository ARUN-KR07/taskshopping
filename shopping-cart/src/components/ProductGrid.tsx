import React from 'react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onResetFilters }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-5 my-3 bg-white rounded-3 p-4 p-md-5 border shadow-sm">
        <div className="display-6 text-muted mb-3">🔍</div>
        <h5 className="fw-semibold text-secondary">No products match your filters</h5>
        <p className="text-muted small mb-3">Try adjusting your keyword, category, or price range.</p>
        {onResetFilters && (
          <button className="btn btn-outline-primary btn-sm px-3" onClick={onResetFilters}>
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-3 g-md-4">
      {products.map((product) => (
        <div key={product.id} className="col">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};
