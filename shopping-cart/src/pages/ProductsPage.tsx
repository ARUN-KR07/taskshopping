import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useProductFilters } from '../hooks/useProductFilters';
import { ProductGrid } from '../components/ProductGrid';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';

export const ProductsPage: React.FC = () => {
  const {
    data: products,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useProducts();

  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    categories,
    filteredProducts,
    totalCount,
    hasActiveFilters,
    clearFilters,
  } = useProductFilters(products || []);

  if (isLoading) {
    return (
      <div className="container py-5 px-3">
        <Loading message="Loading products..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-5 px-3">
        <ErrorMessage
          title="Unable to load products"
          message={error?.message || 'An error occurred while communicating with the products API.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container py-5 px-3 text-center">
        <div className="card border p-4 p-md-5 mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="fw-semibold mb-2">No Products Available</h4>
          <p className="text-muted mb-3">The store inventory is currently empty.</p>
          <button className="btn btn-primary" onClick={() => refetch()}>
            Refresh Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4 px-3 px-sm-3">
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3 mb-md-4">
        <div>
          <h2 className="fw-bold mb-0 fs-3 fs-md-2">Products</h2>
          <p className="text-muted small mb-0 d-none d-sm-block">Browse our latest collection</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {isFetching && (
            <span className="text-muted small d-none d-sm-inline">Updating...</span>
          )}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? '...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="card border mb-3 mb-md-4 p-3 bg-white shadow-sm">
        <div className="row g-2 g-md-3 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group input-group-sm input-group-md-default">
              <span className="input-group-text bg-light border-end-0 text-muted">🔍</span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => setSearchTerm('')}
                  title="Clear search text"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm text-capitalize"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light text-muted px-1 px-sm-2">$</span>
              <input
                type="number"
                min="0"
                step="1"
                className="form-control px-1 px-sm-2"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                aria-label="Minimum price"
              />
              <span className="input-group-text bg-light text-muted px-1">-</span>
              <span className="input-group-text bg-light text-muted px-1 px-sm-2">$</span>
              <input
                type="number"
                min="0"
                step="1"
                className="form-control px-1 px-sm-2"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                aria-label="Maximum price"
              />
            </div>
          </div>

          <div className="col-12 col-md-2">
            <select
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
          <div className="filter-pills-scroll flex-grow-1 min-w-0">
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm text-capitalize flex-shrink-0 ${
                  selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                style={{ fontSize: '0.8rem' }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-auto">
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                style={{ fontSize: '0.8rem' }}
                onClick={clearFilters}
              >
                ✕ Clear
              </button>
            )}

            <span className="text-muted small">
              {totalCount} item{totalCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      <ProductGrid products={filteredProducts} onResetFilters={clearFilters} />
    </div>
  );
};
