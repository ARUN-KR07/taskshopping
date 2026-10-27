import { z } from 'zod';

export const dummyJsonProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number().optional(),
  rating: z.number().optional(),
  stock: z.number().optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  reviews: z
    .array(
      z.object({
        rating: z.number(),
        comment: z.string().optional(),
        date: z.string().optional(),
        reviewerName: z.string().optional(),
        reviewerEmail: z.string().optional(),
      })
    )
    .optional(),
});

export const dummyJsonResponseSchema = z.object({
  products: z.array(dummyJsonProductSchema),
  total: z.number().optional(),
  skip: z.number().optional(),
  limit: z.number().optional(),
});

export const productSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  price: z.number().nonnegative('Price must be greater than or equal to 0'),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  rating: z
    .object({
      rate: z.number(),
      count: z.number(),
    })
    .optional(),
  brand: z.string().optional(),
  stock: z.number().optional(),
  discountPercentage: z.number().optional(),
});

export const productsArraySchema = z.array(productSchema);

export type ProductSchemaType = z.infer<typeof productSchema>;
