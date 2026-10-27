import React from 'react';
import { useCartStore } from '../store/cartStore';

interface HeaderProps {
  currentPage: 'products' | 'checkout';
  onNavigate: (page: 'products' | 'checkout') => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  const items = useCartStore((state) => state.items);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar navbar-dark bg-dark sticky-top shadow-sm px-2 px-sm-3 py-2">
      <div className="container">
        <button
          className="navbar-brand btn btn-link text-white text-decoration-none fw-bold fs-5 fs-sm-4 d-flex align-items-center gap-2 p-0"
          onClick={() => onNavigate('products')}
        >
          <span>THE</span>
          <span className="badge bg-primary rounded-circle p-1 p-sm-2">🛒</span>
          <span>STORE</span>
        </button>

        <div className="d-flex align-items-center gap-2 gap-sm-3 ms-auto">
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            <span>{isDark ? '☀️' : '🌙'}</span>
            <span className="d-none d-sm-inline small">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            type="button"
            className={`btn btn-sm ${
              currentPage === 'products' ? 'btn-primary' : 'btn-outline-light'
            }`}
            onClick={() => onNavigate('products')}
          >
            Catalog
          </button>

          <button
            type="button"
            className={`btn btn-sm position-relative ${
              currentPage === 'checkout' ? 'btn-primary' : 'btn-outline-light'
            }`}
            onClick={() => onNavigate('checkout')}
          >
            <span>Cart</span>
            {totalItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalItemCount}
                <span className="visually-hidden">items in cart</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
