import type { CartItemType } from '../types/product';

// ==========================================
// 1. FINANCIAL CONSTANTS & BUSINESS RULES
// ==========================================
// 5% Tax rate applied to subtotal
export const TAX_RATE = 0.05;
// 10% Discount applied only when subtotal strictly exceeds $100
export const DISCOUNT_RATE = 0.10;
export const DISCOUNT_THRESHOLD = 100;
// Minimum order requirement for checkout
export const MIN_CHECKOUT_VALUE = 10;

// ==========================================
// 2. CALCULATION RESULT INTERFACE
// ==========================================
export interface CartCalculationResult {
  itemCount: number;
  subtotal: number;
  tax: number;
  discount: number;
  finalTotal: number;
  isCheckoutAllowed: boolean;
  minCheckoutShortfall: number;
}

// ==========================================
// 3. CORE CALCULATION ENGINE
// ==========================================
// Calculates subtotal, 5% tax, 10% discount (> $100), and validates the $10 minimum checkout rule.
export function calculateCartTotals(items: CartItemType[]): CartCalculationResult {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Subtotal = sum of (price * quantity)
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Financial calculations
  const tax = subtotal * TAX_RATE;
  const discount = subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
  const finalTotal = subtotal + tax - discount;

  // Minimum checkout threshold validation
  const isCheckoutAllowed = subtotal >= MIN_CHECKOUT_VALUE;
  const minCheckoutShortfall = isCheckoutAllowed
    ? 0
    : Number((MIN_CHECKOUT_VALUE - subtotal).toFixed(2));

  return {
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2)),
    isCheckoutAllowed,
    minCheckoutShortfall,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
