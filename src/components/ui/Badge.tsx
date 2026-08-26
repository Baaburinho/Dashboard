import React, { ReactNode } from 'react';

export type BadgeVariant =
  | 'indigo'
  | 'gold'
  | 'highlight'
  | 'success'
  | 'warning'
  | 'critical'
  | 'info'
  | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  icon,
  className = '',
  size = 'sm',
  dot = false,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-medium',
  };

  const variantClasses = {
    indigo:
      'bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#171714] dark:text-[#F4E7A1] border border-[#E8E1CF] dark:border-[#E8E1CF]/18',
    gold:
      'bg-[#F4E7A1] dark:bg-[#B7791F]/18 text-[#B7791F] dark:text-[#F4E7A1] border border-[#E8E1CF] dark:border-[#E8E1CF]/18 font-semibold',
    highlight:
      'bg-[#C9A227]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border border-[#C9A227]/25',
    success:
      'bg-[#6B7D45]/12 dark:bg-[#6B7D45]/18 text-[#6B7D45] dark:text-[#F4E7A1] border border-[#6B7D45]/30 dark:border-[#E8E1CF]/18',
    warning:
      'bg-[#F4E7A1] dark:bg-[#B7791F]/18 text-[#B7791F] dark:text-[#F4E7A1] border border-[#E8E1CF] dark:border-[#E8E1CF]/18',
    critical:
      'bg-[#F4E7A1] dark:bg-[#9B3D32]/15 text-[#9B3D32] dark:text-[#E8E1CF] border border-[#E8E1CF] dark:border-[#9B3D32]/35',
    info:
      'bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border border-[#E8E1CF] dark:border-[#E8E1CF]/18',
    neutral:
      'bg-[#FBF7E8] dark:bg-[#F4E7A1]/8 text-[#66645C] dark:text-[#E8E1CF]/70 border border-[#E8E1CF] dark:border-[#E8E1CF]/18',
  };

  const dotColors = {
    indigo: 'bg-[#C9A227]',
    gold: 'bg-[#B7791F]',
    highlight: 'bg-[#C9A227]',
    success: 'bg-[#6B7D45]',
    warning: 'bg-[#B7791F]',
    critical: 'bg-[#9B3D32]',
    info: 'bg-[#C9A227]',
    neutral: 'bg-[#66645C]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full whitespace-nowrap tracking-wide transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
