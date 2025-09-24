import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { storage, STORAGE_KEYS, handleApiError } from '../utils';
import {
  User,
  ClientCase,
  CaseNote,
  AuthResponse,
  ApiResponse,
  LoginCredentials,
  RegisterData,
  CreateCaseData,
  CreateNoteData
} from '../types';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';  // Cambiar según el entorno

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token de autenticación
    this.api.interceptors.request.use(
      async (config) => {
        const token = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar respuestas y errores
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido, limpiar almacenamiento
          await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          await storage.removeItem(STORAGE_KEYS.USER_DATA);
          // Aquí podrías disparar una acción para redirigir al login
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticación
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        // Guardar token y datos del usuario
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await storage.setItem(STORAGE_KEYS.USER_DATA, user);
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Error en el login');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/register', userData);
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        // Guardar token y datos del usuario
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await storage.setItem(STORAGE_KEYS.USER_DATA, user);
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Error en el registro');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      // Continuar con el logout local aunque falle el servidor
      console.warn('Error al hacer logout en el servidor:', error);
    } finally {
      // Limpiar almacenamiento local
      await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await storage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response: AxiosResponse<ApiResponse<{ token: string }>> = await this.api.post('/auth/refresh');
      
      if (response.data.success && response.data.data) {
        const { token } = response.data.data;
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        return token;
      }
      
      throw new Error('Error al refrescar el token');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Métodos para casos de clientes
  async getCases(): Promise<ClientCase[]> {
    try {
      const response: AxiosResponse<ApiResponse<ClientCase[]>> = await this.api.get('/client-cases');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Error al obtener los casos');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getCaseById(id: string): Promise<ClientCase> {
    try {
      const response: AxiosResponse<ApiResponse<ClientCase>> = await this.api.get(`/client-cases/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Error al obtener el caso');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createCase(caseData: CreateCaseData): Promise<ClientCase> {
    try {
      const response: AxiosResponse<ApiResponse<ClientCase>> = await this.api.post('/client-cases', caseData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Error al crear el caso');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateCase(id: string, caseData: Partial<CreateCaseData>): Promise<ClientCase> {
    try {
      const response: AxiosResponse<ApiResponse<ClientCase>> = await this.api.put(`/client-cases/${id}`, caseData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Error al actualizar el caso');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async deleteCase(id: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/client-cases/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al eliminar el caso');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Métodos para notas
  async getCaseNotes(caseId: string): Promise<CaseNote[]> {
    try {
      const response: AxiosResponse<ApiResponse<CaseNote[]>> = await this.api.get(`/case-notes?caseId=${caseId}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Error al obtener las notas');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createNote(noteData: CreateNoteData): Promise<CaseNote> {
    try {
      const response: AxiosResponse<ApiResponse<CaseNote>> = await this.api.post('/case-notes', noteData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Error al crear la nota');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateNote(id: string, content: string): Promise<CaseNote> {
    try {
      const response: AxiosResponse<ApiResponse<CaseNote>> = await this.api.put(`/case-notes/${id}`, { content });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Error al actualizar la nota');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async deleteNote(id: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/case-notes/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al eliminar la nota');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Instancia singleton del servicio de API
export const apiService = new ApiService();
export default apiService;