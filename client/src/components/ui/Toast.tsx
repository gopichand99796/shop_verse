import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export default function Toast({ type = 'info', message, onClose }: ToastProps) {
  const Icon = icons[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={cn(
          'fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-medium',
          colors[type]
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
