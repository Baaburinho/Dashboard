import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Calendar,
  Sparkles,
  Menu
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

interface MobileNavProps {
  onOpenMobileMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenMobileMenu }) => {
  const { activeTab, setActiveTab } = useAcademic();

  const primaryTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'memories', label: 'Memories', icon: Sparkles },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 dark:bg-[#171714]/95 border-t border-[#E8E1CF] dark:border-[#383428] backdrop-blur-xl px-2 pt-2 pb-[max(env(safe-area-inset-bottom),16px)] flex items-center justify-around select-none shadow-[0_-10px_30px_rgba(23,23,20,0.12)] transition-all">
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#C9A227] dark:text-[#F4E7A1] bg-[#F4E7A1]/25 dark:bg-[#C9A227]/18 font-bold shadow-2xs'
                : 'text-[#66645C] dark:text-[#E8E1CF]/70 hover:text-[#171714] dark:hover:text-[#FFFDF5] font-medium'
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 transition-transform ${isActive ? 'scale-110 text-[#C9A227] dark:text-[#F4E7A1]' : ''}`} />
            <span className="text-[10px] tracking-tight whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMobileMenu}
        aria-label="Open More options"
        className="flex flex-col items-center justify-center min-w-[52px] py-1 px-2 rounded-2xl text-[#66645C] dark:text-[#E8E1CF]/70 hover:text-[#171714] dark:hover:text-[#FFFDF5] font-medium transition-all cursor-pointer"
      >
        <Menu className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap">More</span>
      </button>
    </nav>
  );
};
