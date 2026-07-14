import { motion } from 'framer-motion';

export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Icon className="h-16 w-16 text-primary-200" />
        </motion.div>
      )}
      {title && <h3 className="font-display text-xl font-medium text-stone-900 mb-2">{title}</h3>}
      {description && <p className="text-stone-600 mb-4 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
