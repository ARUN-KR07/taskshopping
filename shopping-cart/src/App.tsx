import { useState } from 'react';
import { Header } from './components/Header';
import { ProductsPage } from './pages/ProductsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { useTheme } from './hooks/useTheme';

export function App() {
  const [currentPage, setCurrentPage] = useState<'products' | 'checkout'>('products');
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-grow-1">
        {currentPage === 'products' ? (
          <ProductsPage />
        ) : (
          <CheckoutPage onContinueShopping={() => setCurrentPage('products')} />
        )}
      </main>

      <footer className="border-top py-4 mt-5 text-center text-muted small">
        <div className="container">
          <p className="mb-0">© {new Date().getFullYear()} THE STORE - Modern Shopping Cart</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
