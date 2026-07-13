import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { Card } from './Card';

/**
 * GlowCard: A Card wrapper that animates a glowing shadow on hover.
 * Respects prefers-reduced-motion.
 */
export function GlowCard({ children, className = '', ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              boxShadow:
                '0 0 32px rgb(var(--color-primary-500) / 0.25), 0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.05)',
            }
      }
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card hoverable className="relative" {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
