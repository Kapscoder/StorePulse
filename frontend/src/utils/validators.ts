import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[^a-zA-Z0-9]/, 'Must include at least one special character'),
  address: z.string().max(400, 'Address must be at most 400 characters').optional().or(z.literal('')),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[^a-zA-Z0-9]/, 'Must include at least one special character'),
});

export const ratingSchema = z.object({
  rating: z.number().min(1, 'Rating min is 1').max(5, 'Rating max is 5'),
});

export const createUserSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z
    .string()
    .min(8).max(16)
    .regex(/[A-Z]/)
    .regex(/[^a-zA-Z0-9]/),
  address: z.string().max(400).optional().or(z.literal('')),
  role: z.enum(['admin', 'normal_user']),
});

export const createStoreSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  address: z.string().max(400).optional().or(z.literal('')),
  ownerName: z.string().min(2).max(60),
  ownerEmail: z.string().email(),
  ownerPassword: z
    .string()
    .min(8).max(16)
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[^a-zA-Z0-9]/, 'Must include at least one special character'),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type CreateUserForm = z.infer<typeof createUserSchema>;
export type CreateStoreForm = z.infer<typeof createStoreSchema>;
