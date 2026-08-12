import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusIndicatorProps {
  label: string;
  status?: 'success' | 'warning' | 'info' | 'demo' | 'offline';
  className?: string;
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  status = 'demo',
  className,
  pulse = true,
}) => {
  const dots = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-cyan-500',
    demo: 'bg-amber-400',
    offline: 'bg-rose-500',
  };

  const textColors = {
    success: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    warning: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    info: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    demo: 'text-amber-300 border-amber-500/40 bg-amber-500/10 font-mono',
    offline: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
        textColors[status],
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dots[status],
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', dots[status])} />
      </span>
      <span>{label}</span>
    </span>
  );
};
