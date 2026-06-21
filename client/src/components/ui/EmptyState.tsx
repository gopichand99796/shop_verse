import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {Icon && (
        <div className="mb-4 rounded-full bg-neutral-100 p-6">
          <Icon className="h-12 w-12 text-neutral-400" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
      {description && <p className="text-neutral-500 mb-6 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-soft hover:shadow-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
