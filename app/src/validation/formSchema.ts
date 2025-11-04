import * as z from 'zod';
import { checkUsernameAvailibity } from '../features/auth/useUserApi.tsx';

const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

export const signUpSchema = z.object({
  username: z
    .string()
    .min(1, { error: 'Username is required' })
    .min(4, { error: 'Too short' })
    .max(10, { error: 'Too long' })
    .refine(
      async (username) => {
        try {
          return await checkUsernameAvailibity(username);
        } catch (err) {
          console.log('Username check failed', err);
          return false;
        }
      },
      { error: 'Username is already taken' }
    ),

  email: z
    .string()
    .min(1, { error: 'Email is required' })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { error: 'Please enter a valid email' }),

  password: z
    .string()
    .min(1, { error: 'Password is required' })
    .regex(/^(?=.*[A-Z])/, {
      error: 'Password must contain at least one uppercase letter.',
    }),
});

export const signInSchema = z.object({
  username: z.string().min(1, { error: 'Username is required' }),
  password: z.string().min(1, { error: 'Password is required' }),
});

export const postBaseSchema = {
  title: z.string().min(1, { error: 'Title is required' }).max(50, { error: 'Title is too long' }),
  content: z
    .string()
    .min(1, { error: 'required field' })
    .max(200, { error: 'Maximum is 200 characters' }),
  images: z
    .any()
    .optional()
    .refine((files) => !files || !files[0] || acceptedImageTypes.includes(files[0]?.type), {
      error: 'Only .jpg, .jpeg, .png is supported',
    }),
};

export const writeSchema = z.object(postBaseSchema);
export const updateSchema = z.object(postBaseSchema);

export type userRegister = z.infer<typeof signUpSchema>;
export type userLogin = z.infer<typeof signInSchema>;
