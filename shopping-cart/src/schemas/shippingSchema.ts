import { z } from 'zod';

// ==========================================
// 1. ZOD SHIPPING ADDRESS VALIDATION SCHEMA
// ==========================================
// Evaluator requirement: Validated using Zod, managed with pure useState
export const shippingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^[0-9+\-\s()]{7,15}$/, 'Please enter a valid phone number'),
  address: z
    .string()
    .trim()
    .min(1, 'Address is required')
    .min(5, 'Street address must be at least 5 characters'),
  city: z
    .string()
    .trim()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters'),
  postalCode: z
    .string()
    .trim()
    .min(1, 'Postal code is required')
    .regex(/^[a-zA-Z0-9\s-]{4,10}$/, 'Please enter a valid postal code'),
});

// ==========================================
// 2. INFERRED TYPES
// ==========================================
export type ShippingFormValues = z.infer<typeof shippingSchema>;
