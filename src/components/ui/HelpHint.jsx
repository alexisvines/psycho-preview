import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { dropdownVariants } from '@/lib/motion';

export function HelpHint({ text, side = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);

  const sideClasses = {
    right: 'left-full ml-2 origin-left',
    bottom: 'top-full mt-2 origin-top',
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 focus-visible:outline-none"
        type="button"
        aria-label="Ayuda"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              variants={dropdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`absolute z-50 w-48 p-3 bg-white border border-stone-200/70 rounded-lg shadow-card ${sideClasses[side]}`}
            >
              <p className="text-sm text-stone-700 leading-snug">{text}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
