import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type } = event.detail;
      const id = Date.now();

      setToasts((prev) => [...prev, { id, message, type }]);

      // Remove toast after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
