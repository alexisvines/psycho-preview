import { motion } from 'framer-motion';
import { cardHoverVariants } from '@/lib/motion';

export function Card({ children, className = '', hoverable = false, ...props }) {
  const baseClasses = 'bg-white border border-stone-200/70 rounded-xl shadow-card';

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      whileHover={hoverable ? cardHoverVariants.hover : undefined}
      whileTap={hoverable ? cardHoverVariants.tap : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-stone-200/50 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`px-6 py-4 border-t border-stone-200/50 flex gap-2 ${className}`}>{children}</div>;
}
