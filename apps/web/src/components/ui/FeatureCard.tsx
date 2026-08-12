import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-6 rounded-xl border bg-dhara-surface agri-card-hover space-y-4 border-dhara-surfaceBorder/60',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Icon className="h-5 w-5" />
        </div>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-semibold">
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
