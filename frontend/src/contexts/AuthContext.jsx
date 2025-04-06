import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurar axios para incluir el token en todas las solicitudes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isAuthenticated]);

  // Verificar si hay un token almacenado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verificar si el token ha expirado
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expirado
          logout();
          setLoading(false);
          return;
        }

        // Token válido, obtener información del usuario
        const response = await axios.get('http://localhost:5000/users/me');
        setCurrentUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      // Modificado para enviar username en lugar de email, según lo que espera el backend
      const response = await axios.post('http://localhost:5000/auth/login', { username, password });
      const { access_token, refresh_token } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Intentar obtener información del usuario después del login
      try {
        const userResponse = await axios.get('http://localhost:5000/users/me');
        setCurrentUser(userResponse.data);
      } catch (userError) {
        console.error('Error al obtener datos del usuario:', userError);
      }
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error de login:', error);
      setError(error.response?.data?.error || 'Error al iniciar sesión');
      return false;
    }
  };


  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/auth/register', userData);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrarse');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('http://localhost:5000/me', userData);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Error al actualizar perfil');
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.patch('http://localhost:5000/me/password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Error al cambiar contraseña');
      throw error;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};