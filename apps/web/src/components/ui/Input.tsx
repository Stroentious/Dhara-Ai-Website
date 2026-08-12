import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && <label className="text-xs font-semibold text-slate-300 block">{label}</label>}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-dhara-surfaceBorder bg-dhara-surface px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-rose-500/50 focus-visible:ring-rose-500',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-400 font-mono">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && <label className="text-xs font-semibold text-slate-300 block">{label}</label>}
        <textarea
          className={cn(
            'flex min-h-[100px] w-full rounded-md border border-dhara-surfaceBorder bg-dhara-surface px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-rose-500/50 focus-visible:ring-rose-500',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-400 font-mono">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
