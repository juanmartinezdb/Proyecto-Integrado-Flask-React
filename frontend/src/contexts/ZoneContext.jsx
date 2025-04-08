import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ZoneContext = createContext();

export const useZone = () => useContext(ZoneContext);

export const ZoneProvider = ({ children }) => {
  const [zones, setZones] = useState([]);
  const [currentZone, setCurrentZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  
  // Cargar zonas del usuario cuando cambia currentUser
  useEffect(() => {
    const fetchZones = async () => {
      if (!currentUser) {
        setZones([]);
        setCurrentZone(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/zones');
        setZones(response.data);
        
        // Si hay zonas, establecer la zona general como predeterminada
        // o la primera zona si no hay una zona general
        if (response.data.length > 0) {
          const generalZone = response.data.find(zone => zone.name.toLowerCase() === 'general');
          setCurrentZone(generalZone || response.data[0]);
        }
        
        setError('');
      } catch (err) {
        console.error('Error al obtener zonas:', err);
        setError('No se pudieron cargar las zonas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchZones();
  }, [currentUser]);
  
  // Función para cambiar la zona actual
  const changeZone = (zoneId) => {
    const zone = zones.find(z => z.id === zoneId);
    if (zone) {
      setCurrentZone(zone);
    }
  };
  
  // Función para crear una nueva zona
  const createZone = async (zoneData) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/zones', zoneData);
      setZones([...zones, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear zona');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Función para actualizar una zona
  const updateZone = async (zoneId, zoneData) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/zones/${zoneId}`, zoneData);
      
      // Actualizar la lista de zonas
      const updatedZones = zones.map(zone => 
        zone.id === zoneId ? response.data : zone
      );
      setZones(updatedZones);
      
      // Si la zona actualizada es la actual, actualizar también currentZone
      if (currentZone && currentZone.id === zoneId) {
        setCurrentZone(response.data);
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar zona');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Función para eliminar una zona
  const deleteZone = async (zoneId) => {
    try {
      await axios.delete(`http://localhost:5000/zones/${zoneId}`);
      
      // Eliminar la zona de la lista
      const updatedZones = zones.filter(zone => zone.id !== zoneId);
      setZones(updatedZones);
      
      // Si la zona eliminada era la actual, cambiar a la zona general o la primera disponible
      if (currentZone && currentZone.id === zoneId) {
        const generalZone = updatedZones.find(zone => zone.name.toLowerCase() === 'general');
        setCurrentZone(generalZone || updatedZones[0] || null);
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar zona');
      throw err;
    }
  };
  
  const value = {
    zones,
    currentZone,
    loading,
    error,
    changeZone,
    createZone,
    updateZone,
    deleteZone
  };
  
  return (
    <ZoneContext.Provider value={value}>
      {children}
    </ZoneContext.Provider>
  );
};