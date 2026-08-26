import React, { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  actions,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 ${className}`}>
      <div className="space-y-1.5">
        {eyebrow && (
          <div className="flex items-center gap-2">
            {eyebrowIcon && <span className="text-[#C9A227] dark:text-[#F4E7A1]">{eyebrowIcon}</span>}
            <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#66645C] dark:text-[#E8E1CF]/70">
              {eyebrow}
            </span>
            {badge && <span className="ml-1">{badge}</span>}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.035em] text-[#171714] dark:text-[#FFFDF5]">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-[#66645C] dark:text-[#E8E1CF]/70 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
