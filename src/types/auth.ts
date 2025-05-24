import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface GoogleLoginResponse {
  token: string;
  user: {
    email: string;
    name: string;
    picture?: string;
  };
} 