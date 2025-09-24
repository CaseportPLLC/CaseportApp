import { z } from 'zod';
import { CasePriority, CaseStatus } from '../types';

// Esquemas de validación para autenticación
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmar contraseña es requerido')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

// Esquemas de validación para casos
export const createCaseSchema = z.object({
  clientName: z
    .string()
    .min(1, 'El nombre del cliente es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  clientEmail: z
    .string()
    .email('Formato de email inválido')
    .optional()
    .or(z.literal('')),
  clientPhone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]{10,}$/, 'Formato de teléfono inválido')
    .optional()
    .or(z.literal('')),
  caseType: z
    .string()
    .min(1, 'El tipo de caso es requerido'),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
  priority: z.nativeEnum(CasePriority, {
    message: 'Prioridad inválida'
  })
});

export const updateCaseSchema = createCaseSchema.extend({
  status: z.nativeEnum(CaseStatus, {
    message: 'Estado inválido'
  }).optional()
});

// Esquemas de validación para notas
export const createNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'El contenido de la nota es requerido')
    .min(5, 'La nota debe tener al menos 5 caracteres'),
  caseId: z
    .string()
    .min(1, 'ID del caso es requerido')
});

export const updateNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'El contenido de la nota es requerido')
    .min(5, 'La nota debe tener al menos 5 caracteres')
});

// Tipos inferidos de los esquemas
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type CreateCaseData = z.infer<typeof createCaseSchema>;
export type UpdateCaseData = z.infer<typeof updateCaseSchema>;
export type CreateNoteData = z.infer<typeof createNoteSchema>;
export type UpdateNoteData = z.infer<typeof updateNoteSchema>;