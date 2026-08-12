import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
  isDemo?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  description,
  icon: Icon,
  trend,
  className,
  isDemo = false,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-xl border bg-dhara-surface agri-card-hover space-y-3 border-dhara-surfaceBorder/60',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wide">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-emerald-400" />}
      </div>

      <div className="flex items-baseline space-x-1.5 font-mono">
        <span className="text-2xl font-bold text-slate-100">{value}</span>
        {unit && <span className="text-xs font-semibold text-emerald-400">{unit}</span>}
      </div>

      {(description || trend || isDemo) && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <span>{description || trend}</span>
          {isDemo && (
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              DEMO DATA
            </span>
          )}
        </div>
      )}
    </div>
  );
};
