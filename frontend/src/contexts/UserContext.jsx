import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  
  // Cargar datos del usuario cuando cambia currentUser
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/users/me');
        setUserData(response.data);
        setError('');
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        setError('No se pudieron cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  // Función para actualizar datos del usuario
  const updateUserData = async (updatedData) => {
    try {
      setLoading(true);
      const response = await axios.put('http://localhost:5000/users/me', updatedData);
      setUserData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar datos');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Función para obtener estadísticas del usuario
  const getUserStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stats/user');
      return response.data;
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
      throw err;
    }
  };
  
  const value = {
    userData,
    loading,
    error,
    updateUserData,
    getUserStats
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};