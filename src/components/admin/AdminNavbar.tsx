import React from 'react';
import {
  Sun,
  Moon,
  ShieldCheck,
  Search,
  Bell,
  GraduationCap,
  LogOut,
  Database,
  Cloud,
  CloudCheck
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

interface AdminNavbarProps {
  onOpenSearch?: () => void;
  onOpenAudit?: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onOpenSearch,
  onOpenAudit,
}) => {
  const {
    isDarkMode,
    setIsDarkMode,
    setCurrentRole,
    logout,
    student,
    auditLogs,
    firebaseStatus,
  } = useAcademic();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      {/* Left: Console Context & University */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
            Admin Master Session
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            {student.university || 'Zamzam University of Science and Technology'}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Firebase Cloud Live Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
          <Cloud className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Firebase Firestore</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Audit Log Shortcut */}
        <button
          onClick={onOpenAudit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Audit ({auditLogs.length})</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Direct Student Portal View Switcher */}
        <button
          onClick={() => setCurrentRole('student')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#C9A227] hover:bg-[#9B7A1D] text-[#171714] transition-all shadow-xs cursor-pointer"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Student View</span>
        </button>

        {/* Exit */}
        <button
          onClick={logout}
          title="Exit to Gateway"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
