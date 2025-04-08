import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Configurar el token en los headers para todas las peticiones
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obtener información del usuario actual
          const response = await axios.get('http://localhost:5000/users/me');
          setCurrentUser(response.data);
        } catch (err) {
          console.error('Error al verificar la autenticación:', err);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);
  
  // Función para iniciar sesión
  const login = async (username, password) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await axios.post('http://localhost:5000/auth/login', {
        username,
        password
      });
      
      const { access_token, refresh_token } = response.data;
      
      // Guardar el token en localStorage
      localStorage.setItem('token', access_token);
      
      // Configurar el token en los headers para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Obtener información del usuario actual
      const userResponse = await axios.get('http://localhost:5000/users/me');
      setCurrentUser(userResponse.data);
      
      navigate('/dashboard');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Función para registrar un nuevo usuario
  const register = async (username, email, password) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await axios.post('http://localhost:5000/auth/register', {
        username,
        email,
        password
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    navigate('/login');
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};