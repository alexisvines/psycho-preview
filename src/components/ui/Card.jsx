import { motion } from 'framer-motion';
import { cardHoverVariants } from '@/lib/motion';

export function Card({ children, className = '', hoverable = false, ...props }) {
  // surface (no white puro) + borde/sombra tintados con la tinta de la
  // paleta activa: sobre un papel ya entonado, esto es lo que hace que la
  // card "se despegue" en vez de fundirse con el fondo.
  const baseClasses = 'bg-surface border border-primary-900/10 rounded-xl shadow-card';

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
  return <div className={`px-6 py-4 border-b border-primary-900/10 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`px-6 py-4 border-t border-primary-900/10 flex gap-2 ${className}`}>{children}</div>;
}
