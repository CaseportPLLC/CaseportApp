// Tipos principales de la aplicación
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface ClientCase {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  caseType: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  notes: CaseNote[];
}

export interface CaseNote {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  caseId: string;
  userId: string;
}

export enum CaseStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum CasePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateCaseData {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  caseType: string;
  description: string;
  priority: CasePriority;
}

export interface CreateNoteData {
  content: string;
  caseId: string;
}

// Tipos para navegación
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CaseDetails: { caseId: string };
  CreateCase: undefined;
  EditCase: { caseId: string };
};

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}