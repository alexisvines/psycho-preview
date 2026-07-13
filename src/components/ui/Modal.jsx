import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants, modalPanelVariants } from '@/lib/motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function Modal({ isOpen, onClose, title, children, size = 'sm' }) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const previousActiveElementRef = useRef(null);

  // Handle Escape key and focus restoration
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElementRef.current = document.activeElement;

      // Handle Escape key
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElementRef.current && previousActiveElementRef.current.focus) {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 bg-stone-950/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className={`relative bg-white rounded-xl shadow-lg w-full ${sizeClasses[size]} p-6`}
            variants={modalPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-stone-900">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-600 transition-colors p-1"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
