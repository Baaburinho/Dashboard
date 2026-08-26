import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Sparkles,
  CheckSquare,
  TrendingUp,
  GraduationCap,
  Calendar,
  FolderLock,
  Target,
  DollarSign,
  Settings,
  ShieldCheck,
  Download,
  LogOut,
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Logo } from './Logo';

interface SidebarProps {
  onAudit?: () => void;
  onExport?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAudit, onExport }) => {
  const { activeTab, setActiveTab, logout } = useAcademic();

  const navGroups = [
    {
      group: 'CORE ACADEMICS',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'journey', label: 'Academic Journey', icon: Compass },
        { id: 'courses', label: 'Courses & Hub', icon: BookOpen },
        { id: 'activities', label: 'Activities & Deadlines', icon: CheckSquare },
        { id: 'calendar', label: 'Lecture Schedule', icon: Calendar },
      ],
    },
    {
      group: 'SCHOLAR VAULT',
      items: [
        { id: 'memories', label: 'Memory Vault', icon: Sparkles },
        { id: 'analytics', label: 'GPA & Analytics', icon: TrendingUp },
        { id: 'graduation', label: 'Graduation Roadmap', icon: GraduationCap },
      ],
    },
    {
      group: 'PERSONAL & SYSTEM',
      items: [
        { id: 'goals', label: 'Goals & Targets', icon: Target },
        { id: 'documents', label: 'Documents Vault', icon: FolderLock },
        { id: 'financial', label: 'Finance & Fees', icon: DollarSign },
        { id: 'settings', label: 'Settings & Profile', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="hidden min-h-screen w-[260px] shrink-0 flex-col border-r border-[#E8E1CF] bg-[#FFFDF5] dark:border-[#E8E1CF]/18 dark:bg-[#171714] md:flex">
      <div className="flex h-[76px] items-center border-b border-[#E8E1CF] px-6 dark:border-[#E8E1CF]/18">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin" aria-label="Primary navigation">
        <div className="space-y-6">
          {navGroups.map((section) => (
            <div key={section.group} className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#66645C] dark:text-[#E8E1CF]/55">
                {section.group}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]/45 ${
                      isActive
                        ? 'bg-[#F4E7A1] font-bold text-[#171714] shadow-[0_5px_14px_rgba(201,162,39,0.10)] dark:bg-[#F4E7A1]/16 dark:text-[#FFFDF5]'
                        : 'font-medium text-[#66645C] hover:bg-white hover:text-[#171714] dark:text-[#E8E1CF]/70 dark:hover:bg-[#F4E7A1]/8 dark:hover:text-[#FFFDF5]'
                    }`}
                  >
                    {isActive && <span className="absolute -left-4 top-2 bottom-2 w-1 rounded-r-full bg-[#C9A227] dark:bg-[#F4E7A1]" />}
                    <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-[#C9A227] dark:text-[#F4E7A1]' : 'text-[#66645C] group-hover:text-[#C9A227] dark:text-[#E8E1CF]/55 dark:group-hover:text-[#F4E7A1]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </nav>

      <div className="space-y-1 border-t border-[#E8E1CF] px-4 py-4 dark:border-[#E8E1CF]/18">
        <button
          type="button"
          onClick={onAudit}
          className="flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left text-xs text-[#66645C] transition-colors hover:bg-[#FBF7E8] hover:text-[#171714] dark:text-[#E8E1CF]/70 dark:hover:bg-[#F4E7A1]/8 dark:hover:text-[#FFFDF5] cursor-pointer"
        >
          <ShieldCheck className="h-4 w-4 text-[#6B7D45]" />
          <span>Audit History</span>
        </button>
        <button
          type="button"
          onClick={onExport}
          className="flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left text-xs text-[#66645C] transition-colors hover:bg-[#FBF7E8] hover:text-[#171714] dark:text-[#E8E1CF]/70 dark:hover:bg-[#F4E7A1]/8 dark:hover:text-[#FFFDF5] cursor-pointer"
        >
          <Download className="h-4 w-4 text-[#C9A227]" />
          <span>Export Academic Report</span>
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left text-xs text-[#9B3D32] transition-colors hover:bg-[#F4E7A1]/30 dark:text-[#E8E1CF] dark:hover:bg-[#9B3D32]/15 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
