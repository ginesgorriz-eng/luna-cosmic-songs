"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, showToast };
}

export default function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
  const borderColors = {
    success: 'rgba(34,197,94,.5)',
    error: 'rgba(239,68,68,.5)',
    info: 'rgba(59,130,246,.5)',
  };
  const bgColors = {
    success: 'rgba(34,197,94,.1)',
    error: 'rgba(239,68,68,.1)',
    info: 'rgba(59,130,246,.1)',
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[200]">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="px-4 py-3 rounded-xl text-sm text-white/90 backdrop-blur-xl max-w-sm"
            style={{
              background: bgColors[toast.type],
              border: `1px solid ${borderColors[toast.type]}`,
              boxShadow: '0 5px 15px rgba(0,0,0,.3)',
            }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
