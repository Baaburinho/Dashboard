import React from 'react';
import { GraduationCap } from 'lucide-react';

interface LogoProps {
  className?: string;
  collapsed?: boolean;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', collapsed = false, showSubtitle = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Modern Radiant Academic Badge */}
      <div className="relative w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#171714] to-[#C9A227] text-white shadow-[0_8px_18px_rgba(201,162,39,0.22)] group">
        <GraduationCap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F4E7A1] ring-2 ring-[#FFFDF5] dark:ring-[#171714]" />
      </div>

      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-[#171714] via-[#C9A227] to-[#171714] dark:from-white dark:via-[#F4E7A1] dark:to-[#FFFDF5]/80 bg-clip-text text-transparent">
              PAOS
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#66645C] dark:text-[#E8E1CF]/70">
              Academic OS
            </span>
          )}
        </div>
      )}
    </div>
  );
};
