import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  
  // Cargar notificaciones cuando cambia el usuario actual
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get('/notifications');
        setNotifications(response.data);
        
        // Contar notificaciones no leídas
        const unread = response.data.filter(notif => !notif.read).length;
        setUnreadCount(unread);
        
        setError('');
      } catch (err) {
        console.error('Error al obtener notificaciones:', err);
        setError('No se pudieron cargar las notificaciones');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchNotifications();
      
      // Configurar un intervalo para actualizar las notificaciones cada cierto tiempo
      const interval = setInterval(fetchNotifications, 60000); // Cada minuto
      
      return () => clearInterval(interval);
    }
  }, [currentUser]);
  
  // Función para marcar una notificación como leída
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      
      // Actualizar el estado local
      const updatedNotifications = notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      
      setNotifications(updatedNotifications);
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
      throw err;
    }
  };
  
  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      
      // Actualizar el estado local
      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
      
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      console.error('Error al marcar todas las notificaciones como leídas:', err);
      throw err;
    }
  };
  
  // Función para eliminar una notificación
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      
      // Actualizar el estado local
      const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
      const wasUnread = notifications.find(notif => notif.id === notificationId && !notif.read);
      
      setNotifications(updatedNotifications);
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return true;
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
      throw err;
    }
  };
  
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};