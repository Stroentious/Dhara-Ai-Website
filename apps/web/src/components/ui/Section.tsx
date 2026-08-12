import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'bordered' | 'grid';
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'py-16 md:py-24 bg-dhara-dark',
    dark: 'py-16 md:py-24 bg-dhara-slate border-y border-dhara-surfaceBorder/40',
    bordered: 'py-16 md:py-24 bg-dhara-dark border-t border-dhara-surfaceBorder/30',
    grid: 'py-16 md:py-24 bg-dhara-dark bg-grid-pattern',
  };

  return (
    <section className={cn('relative overflow-hidden', variants[variant], className)} {...props}>
      {children}
    </section>
  );
};
