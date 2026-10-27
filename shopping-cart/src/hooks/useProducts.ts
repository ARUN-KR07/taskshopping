import { useQuery } from '@tanstack/react-query';
import type { Product } from '../types/product';
import { dummyJsonResponseSchema } from '../schemas/productSchema';

// ==========================================
// 1. DUMMYJSON PRODUCT FETCHER
// ==========================================
// Fetches 100 products from DummyJSON and normalizes them into our standard Product interface.
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('https://dummyjson.com/products?limit=100');
  if (!response.ok) {
    throw new Error(`Failed to fetch products from DummyJSON (${response.status}: ${response.statusText})`);
  }

  const rawData = await response.json();
  const parsed = dummyJsonResponseSchema.safeParse(rawData);
  const rawProducts = parsed.success ? parsed.data.products : rawData.products || [];

  // Transform DummyJSON structure to match standard e-commerce Product type
  return rawProducts.map((p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail || (p.images && p.images[0]) || '',
    rating: {
      rate: typeof p.rating === 'number' ? p.rating : 4.5,
      count: Array.isArray(p.reviews) ? p.reviews.length : (p.stock ?? 20),
    },
    brand: p.brand,
    stock: p.stock,
    discountPercentage: p.discountPercentage,
  }));
}

// ==========================================
// 2. TANSTACK REACT QUERY HOOK
// ==========================================
// Handles caching, background refetching, retry logic, and loading/error states.
export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Unused cache garbage collected after 30 minutes
    retry: 2, // Auto-retry up to 2 times on network failures
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: true, // Keep catalog synchronized when user returns to tab
  });
}
