import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Tooltip({ text, children, side = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-flex items-center">
      <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positionClasses[side]} z-50 px-3 py-1.5 bg-stone-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg`}
            role="tooltip"
          >
            {text}
            <div className="absolute w-2 h-2 bg-stone-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
