import React from 'react';
import {
  LayoutDashboard,
  Users,
  Compass,
  BookOpen,
  Award,
  CheckSquare,
  Calendar,
  FolderLock,
  DollarSign,
  Quote,
  Sparkles,
  Database,
  ShieldCheck,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { Logo } from '../layout/Logo';
import { useAcademic } from '../../context/AcademicContext';

interface AdminSidebarProps {
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeAdminTab,
  setActiveAdminTab,
}) => {
  const { logout, setCurrentRole } = useAcademic();

  const navSections = [
    {
      group: 'MANAGEMENT',
      items: [
        { id: 'overview', label: 'Console Overview', icon: LayoutDashboard },
        { id: 'students', label: 'Student Identity', icon: Users },
        { id: 'semesters', label: 'Semesters (S1–S8)', icon: Compass },
        { id: 'courses', label: 'Course Catalog', icon: BookOpen },
        { id: 'results', label: 'Results & Grades', icon: Award },
        { id: 'activities', label: 'Deliverables & Exams', icon: CheckSquare },
        { id: 'timetable', label: 'Timetable Schedule', icon: Calendar },
      ],
    },
    {
      group: 'RESOURCES & RECORDS',
      items: [
        { id: 'quotes', label: 'Daily Quotes Library', icon: Quote },
        { id: 'memories', label: 'Milestones & Memories', icon: Sparkles },
        { id: 'documents', label: 'Document Vault', icon: FolderLock },
        { id: 'fees', label: 'Tuition Ledgers', icon: DollarSign },
      ],
    },
    {
      group: 'GOVERNANCE & SYSTEM',
      items: [
        { id: 'audit', label: 'Audit Trail Ledger', icon: ShieldCheck },
        { id: 'backups', label: 'Snapshots & Backups', icon: Database },
        { id: 'settings', label: 'System Configuration', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">
            Administration Console
          </span>
        </div>
        <Logo showSubtitle={false} />
      </div>

      {/* Navigation Streams */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {navSections.map((section) => (
          <div key={section.group} className="space-y-1">
            <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
              {section.group}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left font-medium cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs">
        <button
          onClick={() => setCurrentRole('student')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 text-[#C9A227]" />
          <span>Switch to Student View</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Console</span>
        </button>
      </div>
    </aside>
  );
};
