const statusMap = {
  PENDING: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'ring-1 ring-amber-600/20',
    label: 'Pendiente',
  },
  CONFIRMED: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'ring-1 ring-emerald-600/20',
    label: 'Confirmado',
  },
  CANCELLED: {
    bg: 'bg-stone-100',
    text: 'text-stone-600',
    border: 'ring-1 ring-stone-300/50',
    label: 'Cancelado',
  },
  COMPLETED: {
    bg: 'bg-primary-50',
    text: 'text-primary-700',
    border: 'ring-1 ring-primary-600/20',
    label: 'Completado',
  },
  PAID: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'ring-1 ring-emerald-600/20',
    label: 'Pagado',
  },
  UNPAID: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'ring-1 ring-rose-600/20',
    label: 'Pendiente de Pago',
  },
  ACTIVE: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'ring-1 ring-emerald-600/20',
    label: 'Activo',
  },
  INACTIVE: {
    bg: 'bg-stone-100',
    text: 'text-stone-600',
    border: 'ring-1 ring-stone-300/50',
    label: 'Inactivo',
  },
};

export function Badge({ status, label, className = '' }) {
  const config = statusMap[status];

  if (!config) {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-stone-100 text-stone-700 ${className}`}>
        {label || status}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${config.bg} ${config.text} ${config.border} ${className}`}>
      {label || config.label}
    </span>
  );
}
