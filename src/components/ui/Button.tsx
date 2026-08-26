import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'indigo' | 'amber';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-xs rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm rounded-xl gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-[#C9A227] hover:bg-[#9B7A1D] text-[#171714] font-semibold shadow-[0_8px_18px_rgba(201,162,39,0.18)] hover:shadow-[0_10px_22px_rgba(201,162,39,0.26)] active:scale-98 transition-all',
    indigo:
      'bg-[#C9A227] hover:bg-[#9B7A1D] text-[#171714] font-semibold shadow-[0_8px_18px_rgba(201,162,39,0.18)] hover:shadow-[0_10px_22px_rgba(201,162,39,0.26)] active:scale-98 transition-all',
    amber:
      'bg-[#B7791F] hover:bg-[#9B3D32] text-[#FFFDF5] font-semibold shadow-sm active:scale-98 transition-all',
    secondary:
      'bg-[#FFFFFF] dark:bg-[#2D2B24] border border-[#E8E1CF] dark:border-[#E8E1CF]/18 text-[#171714] dark:text-[#FFFDF5] hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8 hover:border-[#C9A227] dark:hover:border-[#C9A227]/55 shadow-[0_4px_14px_rgba(23,23,20,0.04)] active:scale-98 transition-all',
    tertiary:
      'bg-transparent text-[#66645C] dark:text-[#E8E1CF]/70 hover:text-[#171714] dark:hover:text-[#FFFDF5] hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8 font-medium transition-colors',
    success:
      'bg-[#6B7D45] hover:bg-[#596A38] text-[#FFFDF5] font-medium shadow-sm active:scale-98 transition-all',
    danger:
      'bg-[#9B3D32] hover:bg-[#7F3028] text-[#FFFDF5] font-medium shadow-sm hover:shadow-[0_8px_18px_rgba(155,61,50,0.18)] active:scale-98 transition-all',
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
