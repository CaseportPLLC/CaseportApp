import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes de almacenamiento
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@caseport/auth_token',
  USER_DATA: '@caseport/user_data',
} as const;

// Utilidades para AsyncStorage
export const storage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from AsyncStorage:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }
};

// Utilidades de formateo
export const formatters = {
  date: (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  dateTime: (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  priority: (priority: string) => {
    const priorityMap = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      URGENT: 'Urgente'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  },

  status: (status: string) => {
    const statusMap = {
      PENDING: 'Pendiente',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }
};

// Utilidades de validación
export const validators = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  password: (password: string) => {
    return password.length >= 6;
  },

  required: (value: string) => {
    return value.trim().length > 0;
  }
};

// Utilidades de colores para estilos
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  light: '#F8F9FA',
  dark: '#343A40',
  gray: {
    50: '#F9FAFB',
    100: '#F8F9FA',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529'
  }
};

// Utilidad para manejar errores de API
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado';
};