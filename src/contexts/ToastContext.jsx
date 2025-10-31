import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    const bgMap = {
      success: 'success',
      error: 'danger',
      info: 'primary',
      notification: 'secondary'
    };
    const bg = bgMap[type] || 'info';

    setToasts(currentToasts => [...currentToasts, { id, message, bg }]);
  }, []);

  const removeToast = id => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="bottom-end" style={{ zIndex: 2000, marginRight: "1.5rem", maxWidth: "35%", marginBottom: "1.5rem" }}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            show={true}
            onClose={() => removeToast(toast.id)}
            delay={4000}
            animation={true}
            autohide
            bg={toast.bg}
          >
            <Toast.Body className="text-white fs-5">
              <strong>{toast.message}</strong>
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export default ToastProvider;