import { z } from 'zod';

export const signUpSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const logInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
