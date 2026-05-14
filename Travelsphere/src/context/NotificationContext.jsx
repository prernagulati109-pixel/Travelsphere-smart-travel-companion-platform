import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [{ id, message, type, read: false, time: new Date() }, ...prev]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll
    }}>
      {children}
      <ToastContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

const ToastContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="toast-container">
      {notifications.map(notif => (
        <div key={notif.id} className={`toast toast-${notif.type} slide-in-right`}>
          <div className="toast-content">{notif.message}</div>
          <button className="toast-close" onClick={() => removeNotification(notif.id)}>&times;</button>
        </div>
      ))}
    </div>
  );
};
