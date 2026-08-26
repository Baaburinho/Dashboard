import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'subtle';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
  variant = 'default',
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantClasses = {
    default:
      'bg-[#FFFFFF] dark:bg-[#24231D]/90 border border-[#E8E1CF] dark:border-[#E8E1CF]/18 shadow-[0_8px_22px_rgba(23,23,20,0.04)]',
    glass:
      'bg-[#FFFFFF]/80 dark:bg-[#24231D]/70 backdrop-blur-md border border-[#E8E1CF]/70 dark:border-[#E8E1CF]/18 shadow-[0_8px_22px_rgba(23,23,20,0.04)]',
    subtle:
      'bg-[#FBF7E8] dark:bg-[#F4E7A1]/8 border border-[#E8E1CF] dark:border-[#E8E1CF]/18',
  };

  const isClickable = Boolean(onClick) || hoverable;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-220 ${variantClasses[variant]} ${paddingClasses[padding]} ${
        isClickable
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#C9A227]/55 hover:shadow-[0_14px_28px_rgba(23,23,20,0.10)] dark:hover:border-[#C9A227]/55 active:scale-[0.99]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
