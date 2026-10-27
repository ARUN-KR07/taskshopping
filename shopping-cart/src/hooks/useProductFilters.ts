import { useMemo, useState } from 'react';
import type { Product } from '../types/product';

// ==========================================
// 1. FILTERING & SORTING TYPES
// ==========================================
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';

export interface PriceFilter {
  min: string;
  max: string;
}

// ==========================================
// 2. PRODUCT FILTERS CUSTOM HOOK
// ==========================================
// Centralizes search, category filtering, min/max price range, and sorting.
export function useProductFilters(products: Product[] = []) {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>({
    min: '',
    max: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Derive unique categories from products list
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['all', ...list];
  }, [products]);

  // Compute filtered & sorted products with useMemo for performance
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query matching title, description, or category
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Min price filter
    if (priceFilter.min !== '') {
      const min = parseFloat(priceFilter.min);
      if (!isNaN(min)) {
        result = result.filter((p) => p.price >= min);
      }
    }

    // Max price filter
    if (priceFilter.max !== '') {
      const max = parseFloat(priceFilter.max);
      if (!isNaN(max)) {
        result = result.filter((p) => p.price <= max);
      }
    }

    // Sort order
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
        break;
      case 'featured':
      default:
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, priceFilter, sortBy]);

  // Check if any filter is active (used to conditionally show 'Clear Filters')
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCategory !== 'all' ||
    priceFilter.min !== '' ||
    priceFilter.max !== '' ||
    sortBy !== 'featured';

  // Helper setters for price bounds
  const setMinPrice = (min: string) => {
    setPriceFilter((prev) => ({ ...prev, min }));
  };

  const setMaxPrice = (max: string) => {
    setPriceFilter((prev) => ({ ...prev, max }));
  };

  // Reset all filters to default state
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceFilter({ min: '', max: '' });
    setSortBy('featured');
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    priceFilter,
    setPriceFilter,
    setMinPrice,
    setMaxPrice,
    minPrice: priceFilter.min,
    maxPrice: priceFilter.max,
    sortBy,
    setSortBy,
    categories,
    filteredProducts,
    totalCount: filteredProducts.length,
    hasActiveFilters,
    clearFilters,
    resetFilters: clearFilters,
  };
}
