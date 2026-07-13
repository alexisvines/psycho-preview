import { motion } from 'framer-motion';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { toastVariants } from '@/lib/motion';

export function Toast({ message, type = 'info', onDismiss }) {
  const typeConfig = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-600/20',
      text: 'text-emerald-800',
      icon: Check,
      iconColor: 'text-emerald-600',
    },
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-600/20',
      text: 'text-rose-800',
      icon: X,
      iconColor: 'text-rose-600',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-600/20',
      text: 'text-amber-800',
      icon: AlertCircle,
      iconColor: 'text-amber-600',
    },
    info: {
      bg: 'bg-primary-50',
      border: 'border-primary-600/20',
      text: 'text-primary-800',
      icon: Info,
      iconColor: 'text-primary-600',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${config.bg} ${config.border} ${config.text} pointer-events-auto`}
    >
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-lg font-semibold leading-none hover:opacity-60 transition-opacity"
      >
        ×
      </button>
    </motion.div>
  );
}
