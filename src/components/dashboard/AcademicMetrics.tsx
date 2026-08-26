import React from 'react';
import { TrendingUp, BookCheck, Award, Flag, ArrowUpRight } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const AcademicMetrics: React.FC = () => {
  const {
    cgpa,
    completedCredits,
    totalRequiredCredits,
    remainingCredits,
    graduationProgress,
    setActiveTab,
  } = useAcademic();

  const cards = [
    {
      title: 'Cumulative CGPA',
      value: cgpa.toFixed(2),
      unit: '/ 4.00',
      description: 'Official Academic Standing',
      badge: 'Distinction Status',
      badgeType: 'gold',
      icon: TrendingUp,
      accentColor: 'from-[#C9A227]/15 to-transparent',
      borderColor: 'hover:border-[#C9A227]',
      iconColor: 'text-[#C9A227] dark:text-[#D4AF37]',
      onClick: () => setActiveTab('analytics'),
    },
    {
      title: 'Class Rank (S6)',
      value: 'Rank #2',
      unit: '🥈',
      description: 'Cohort of 46 Students',
      badge: '3.83 Term GPA',
      badgeType: 'warning',
      icon: Award,
      accentColor: 'from-[#B7791F]/15 to-transparent',
      borderColor: 'hover:border-[#C9A227]',
      iconColor: 'text-[#B7791F] dark:text-[#D4AF37]',
      onClick: () => setActiveTab('journey'),
    },
    {
      title: 'Cleared Credits',
      value: `${completedCredits}`,
      unit: `/ ${totalRequiredCredits}`,
      description: `${remainingCredits || 12} credits to completion`,
      badge: `${graduationProgress}% Degree Progress`,
      badgeType: 'neutral',
      icon: BookCheck,
      accentColor: 'from-[#6B7D45]/15 to-transparent',
      borderColor: 'hover:border-[#6B7D45]',
      iconColor: 'text-[#6B7D45] dark:text-[#788B52]',
      onClick: () => setActiveTab('graduation'),
    },
    {
      title: 'Attendance Record',
      value: '91%',
      unit: '',
      description: '69 / 76 Lectures Attended',
      badge: 'Exemplary Presence',
      badgeType: 'success',
      icon: Flag,
      accentColor: 'from-[#6B7D45]/15 to-transparent',
      borderColor: 'hover:border-[#6B7D45]',
      iconColor: 'text-[#6B7D45] dark:text-[#788B52]',
      onClick: () => setActiveTab('journey'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.onClick}
            className={`group relative rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] p-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${card.borderColor}`}
          >
            <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${card.accentColor} rounded-full blur-xl pointer-events-none transition-transform duration-500 group-hover:scale-125`} />

            <div className="relative z-10 flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold tracking-widest text-[#66645C] dark:text-[#B9B3A4] uppercase">
                {card.title}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    card.badgeType === 'gold'
                      ? 'bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#171714] dark:text-[#F7F3E8] border-[#C9A227]/30'
                      : card.badgeType === 'success'
                      ? 'bg-[#6B7D45]/12 dark:bg-[#6B7D45]/20 text-[#6B7D45] dark:text-[#788B52] border-[#6B7D45]/30'
                      : card.badgeType === 'warning'
                      ? 'bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#171714] dark:text-[#F7F3E8] border-[#C9A227]/30'
                      : 'bg-[#FFFDF5] dark:bg-[#151513] text-[#66645C] dark:text-[#B9B3A4] border-[#E8E1CF] dark:border-[#3A372E]'
                  }`}
                >
                  {card.badge}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#66645C] opacity-0 group-hover:opacity-100 group-hover:text-[#C9A227] dark:group-hover:text-[#D4AF37] transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            <div className="relative z-10 my-3 flex items-baseline gap-1.5">
              <span className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#171714] dark:text-[#F7F3E8]">
                {card.value}
              </span>
              {card.unit && (
                <span className="text-sm font-semibold text-[#66645C] dark:text-[#B9B3A4]">
                  {card.unit}
                </span>
              )}
            </div>

            <div className="relative z-10 pt-3 border-t border-[#E8E1CF]/60 dark:border-[#3A372E]/60 flex items-center justify-between text-xs text-[#66645C] dark:text-[#B9B3A4]">
              <span className="truncate">{card.description}</span>
              <Icon className={`w-4 h-4 ${card.iconColor} shrink-0 ml-2 transition-transform duration-200 group-hover:scale-110`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
