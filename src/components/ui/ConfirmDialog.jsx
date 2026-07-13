import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants, modalPanelVariants } from '@/lib/motion';
import { Button } from './Button';

export function useConfirm() {
  const [state, setState] = useState(null);
  const previousActiveElementRef = useRef(null);

  const confirm = ({ title, description, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'danger' }) => {
    return new Promise((resolve) => {
      setState({ title, description, confirmText, cancelText, variant, resolve });
    });
  };

  const handleConfirm = () => {
    if (state) {
      state.resolve(true);
      setState(null);
    }
  };

  const handleCancel = () => {
    if (state) {
      state.resolve(false);
      setState(null);
    }
  };

  const Dialog = () => {
    // Handle Escape key and focus restoration
    useEffect(() => {
      if (state) {
        // Store the currently focused element
        previousActiveElementRef.current = document.activeElement;

        // Handle Escape key
        const handleKeyDown = (e) => {
          if (e.key === 'Escape') {
            handleCancel();
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
    }, [state]);

    return (
      <AnimatePresence>
        {state && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" variants={modalVariants} initial="initial" animate="animate" exit="exit">
            <motion.div className="absolute inset-0 bg-stone-950/20 backdrop-blur-sm" onClick={handleCancel} />
            <motion.div
              className="relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4"
              variants={modalPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-dialog-title"
            >
              <h3 id="confirm-dialog-title" className="text-lg font-semibold text-stone-900 mb-2">{state.title}</h3>
              <p className="text-stone-600 mb-6">{state.description}</p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={handleCancel}>
                  {state.cancelText}
                </Button>
                <Button variant={state.variant} onClick={handleConfirm}>
                  {state.confirmText}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return { confirm, Dialog };
}
