import { useReducedMotion } from 'framer-motion';

// Helper hook to respect prefers-reduced-motion
export function useMotion() {
  const shouldReduceMotion = useReducedMotion();

  return {
    shouldReduceMotion,
    // Transition presets that respect reduced motion
    transitionFast: shouldReduceMotion ? { duration: 0 } : { duration: 0.15 },
    transitionBase: shouldReduceMotion ? { duration: 0 } : { duration: 0.2 },
    transitionSlow: shouldReduceMotion ? { duration: 0 } : { duration: 0.3 },
  };
}

// Page variants for route transitions
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

// Container for staggered items (lists, grids)
export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

// Individual staggered item
export const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

// Spring preset for modals, popovers, sidebar
export const springSm = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1,
};

// Modal/overlay animation
export const modalVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const modalPanelVariants = {
  initial: { scale: 0.96, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: springSm },
  exit: { scale: 0.96, opacity: 0, transition: { duration: 0.1 } },
};

// Toast animation (enter from bottom with spring, exit with fade+slide)
export const toastVariants = {
  initial: { y: 32, opacity: 0, scale: 0.9 },
  animate: { y: 0, opacity: 1, scale: 1, transition: springSm },
  exit: { y: 16, opacity: 0, scale: 0.9, transition: { duration: 0.1 } },
};

// Button tap animation
export const buttonTapVariants = {
  tap: { scale: 0.97 },
};

// Card hover animation
export const cardHoverVariants = {
  hover: { y: -2, transition: { duration: 0.15, ease: 'easeOut' } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

// Sidebar active indicator (layout animation with layoutId)
export const sidebarIndicatorVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
};

// Sidebar colapso/expansión
export const sidebarVariants = {
  expanded: { width: 240, transition: springSm },
  collapsed: { width: 80, transition: springSm },
};

export const sidebarLabelVariants = {
  expanded: { opacity: 1, transition: { delay: 0.1, duration: 0.2 } },
  collapsed: { opacity: 0, transition: { duration: 0.1 } },
};

// Animated number counter (for stats)
export const numberVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
};

// Bell notification shake
export const bellShakeVariants = {
  shake: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

// Reveal palabra-por-palabra para titulares (hero editorial): el container
// aplica staggerChildren a cada <span>-palabra, que entra con y + opacity +
// un blur sutil (efecto "enfocando" el texto). Respeta reduced-motion: sin
// stagger ni blur, aparece directo.
export function wordRevealContainer(shouldReduceMotion) {
  return {
    initial: { opacity: shouldReduceMotion ? 1 : 0 },
    animate: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };
}

// Sin blur: animar `filter` por palabra promueve cada span a su propia capa
// de composición y Safari puede pintar esas capas con un fondo claro visible
// ("recuadros" detrás de palabras sueltas del titular). Solo opacity + y.
export function wordRevealItem(shouldReduceMotion) {
  return {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

// Reveal transversal para secciones de landing/página larga: fade + rise
// sutil al entrar en viewport, una sola vez, con márgenes generosos para que
// dispare un poco antes de que la sección sea visible del todo. Pensado para
// spread directo sobre un <motion.section {...sectionReveal}>.
export const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  viewport: { once: true, margin: '-120px' },
};

// Dropdown animation
export const dropdownVariants = {
  initial: { opacity: 0, scale: 0.95, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.1 } },
};
