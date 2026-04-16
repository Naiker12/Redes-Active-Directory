import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/api/axios';

/**
 * Contexto de Autenticación
 * Gestiona el ciclo de vida del usuario (Login, Logout, Persistencia).
 */
const AuthContext = createContext(null);

/**
 * Proveedor de Autenticación (AuthProvider)
 * Envuelve la aplicación para proveer acceso global a los datos del usuario.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Obtiene la información del usuario autenticado desde el backend.
   * Se utiliza useCallback para evitar recreaciones innecesarias del método.
   */
  const fetchUsuario = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      // Si falla, asumimos que no hay sesión activa
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto inicial para validar sesión al cargar la página
  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  /**
   * Inicia sesión en el portal corporativo.
   * @param {string} username - Nombre de usuario de dominio.
   * @param {string} password - Contraseña institucional.
   */
  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      setUser(res.data);
      return res.data;
    } catch (error) {
      // Propagar el error para que la UI lo maneje
      throw error;
    }
  };

  /**
   * Finaliza la sesión actual y limpia el estado local.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Fallo al cerrar sesión en el servidor:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      refetchUser: fetchUsuario 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para consumir el contexto de autenticación.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
