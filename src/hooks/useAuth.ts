import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '../utils';
import { apiService } from '../services/api';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';

// Contexto de autenticación
interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Hook personalizado para manejar la autenticación
export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Verificar el estado de autenticación al cargar la app
  const checkAuthStatus = async () => {
    try {
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: true }));
      
      const token = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      const user = await storage.getItem<User>(STORAGE_KEYS.USER_DATA);

      if (token && user) {
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  // Función de login
  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: true }));
      
      const { user, token } = await apiService.login(credentials);
      
      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState((prev: AuthState) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
      throw error;
    }
  };

  // Función de registro
  const register = async (userData: RegisterData) => {
    try {
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: true }));
      
      const { user, token } = await apiService.register(userData);
      
      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState((prev: AuthState) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    authState,
    login,
    register,
    logout,
    checkAuthStatus,
  };
};