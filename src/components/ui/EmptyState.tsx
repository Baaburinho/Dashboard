import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] space-y-3 ${className}`}
    >
      {icon && (
        <div className="mx-auto w-10 h-10 rounded-full bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] flex items-center justify-center text-[#66645C] dark:text-[#B9B3A4]">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h4 className="font-editorial text-base font-bold text-[#171714] dark:text-[#F7F3E8]">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-[#66645C] dark:text-[#B9B3A4] max-w-sm mx-auto">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
