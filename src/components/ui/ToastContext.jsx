import { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from './Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, options = {}) => {
    const id = Math.random();
    const type = options.type || 'info';

    setToasts((prev) => [...prev, { id, message, type }]);

    // Errors get 6000ms, others get 4000ms
    const duration = options.duration || (type === 'error' ? 6000 : 4000);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const api = {
    success: (message) => toast(message, { type: 'success' }),
    error: (message) => toast(message, { type: 'error' }),
    info: (message) => toast(message, { type: 'info' }),
    warning: (message) => toast(message, { type: 'warning' }),
    dismiss: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
        role="status"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onDismiss={() => api.dismiss(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
