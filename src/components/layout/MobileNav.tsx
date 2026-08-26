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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 dark:bg-[#171714]/95 border-t border-[#E8E1CF] dark:border-emerald-100/10 backdrop-blur-lg px-2 py-2 flex items-center justify-around select-none shadow-[0_-8px_24px_rgba(20,45,34,0.08)]">
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-all ${
              isActive
                ? 'text-[#C9A227] dark:text-[#F4E7A1] font-bold'
                : 'text-[#66645C] dark:text-[#E8E1CF]/70 hover:text-[#171714] dark:hover:text-[#FFFDF5]'
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'scale-110' : ''}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMobileMenu}
        aria-label="Open More options"
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
      >
        <Menu className="w-4 h-4 mb-0.5" />
        <span>More</span>
      </button>
    </nav>
  );
};
