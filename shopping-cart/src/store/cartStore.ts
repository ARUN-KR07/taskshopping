import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItemType } from '../types/product';
import { calculateCartTotals, type CartCalculationResult } from '../utils/cartCalculations';

// ==========================================
// 1. CONSTANTS & QUANTITY BOUNDS
// ==========================================
// Evaluator rule: Minimum 1 unit, maximum 5 units per product
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 5;

// ==========================================
// 2. STORE STATE & ACTION TYPES
// ==========================================
interface CartState {
  items: CartItemType[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => CartCalculationResult;
}

// ==========================================
// 3. ZUSTAND CART STORE WITH PERSISTENCE
// ==========================================
// Zustand manages global client state without boilerplate.
// The `persist` middleware automatically saves and rehydrates cart state from localStorage.
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial cart state
      items: [],

      // Action: Add product or increase quantity up to max boundary (5 or available stock)
      addToCart: (product: Product, quantity = 1) => {
        set((state) => {
          const productStock = product.stock ?? MAX_QUANTITY;
          const maxAvailable = Math.max(0, Math.min(MAX_QUANTITY, productStock));
          if (maxAvailable <= 0) return { items: state.items };

          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          // If product already in cart, increment quantity up to maxAvailable
          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingItemIndex];
            const itemMax = Math.min(MAX_QUANTITY, currentItem.product.stock ?? MAX_QUANTITY);
            const newQuantity = Math.min(
              itemMax,
              currentItem.quantity + quantity
            );

            updatedItems[existingItemIndex] = {
              ...currentItem,
              quantity: newQuantity,
            };
            return { items: updatedItems };
          }

          // If product is new to cart, clamp initial quantity between 1 and maxAvailable
          const initialQuantity = Math.min(maxAvailable, Math.max(MIN_QUANTITY, quantity));
          return {
            items: [...state.items, { product, quantity: initialQuantity }],
          };
        });
      },

      // Action: Remove an item entirely from the cart
      removeFromCart: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      // Action: Update quantity stepper with boundary clamping (1 to 5 or stock)
      updateQuantity: (productId: number, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id !== productId) return item;
            const maxForProduct = Math.min(MAX_QUANTITY, item.product.stock ?? MAX_QUANTITY);
            const clampedQuantity = Math.min(maxForProduct, Math.max(MIN_QUANTITY, quantity));
            return { ...item, quantity: clampedQuantity };
          }),
        }));
      },

      // Action: Empty all items from the cart
      clearCart: () => {
        set({ items: [] });
      },

      // Selector: Calculate live totals (subtotal, tax, discount, finalTotal)
      getTotals: () => {
        return calculateCartTotals(get().items);
      },
    }),
    {
      // localStorage key as required by specifications
      name: 'shopping-cart',
    }
  )
);
