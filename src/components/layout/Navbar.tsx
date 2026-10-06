import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Cloud,
  RefreshCw,
  Sparkles,
  CheckCheck,
  X,
  GraduationCap,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const {
    student,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    setIsSearchOpen,
    setIsQuickAddOpen,
    isDarkMode,
    setIsDarkMode,
    logout,
    setActiveTab,
    firebaseStatus,
    lastCloudSyncTime,
    syncWithFirebaseCloud,
  } = useAcademic();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManualSync = async () => {
    setIsSyncingLocal(true);
    setSyncFeedback('Syncing...');
    const res = await syncWithFirebaseCloud();
    setIsSyncingLocal(false);
    setSyncFeedback(res.success ? 'Synced!' : 'Failed');
    setTimeout(() => setSyncFeedback(null), res.success ? 2500 : 3000);
  };

  const isSynced = firebaseStatus === 'synced' || syncFeedback === 'Synced!';
  const isSyncing = firebaseStatus === 'syncing' || isSyncingLocal;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E8E1CF] dark:border-[#383428] bg-[#FFFDF5]/95 dark:bg-[#171714]/95 backdrop-blur-xl transition-colors duration-200 select-none">
      <div className="flex h-16 sm:h-[72px] w-full items-center gap-2.5 sm:gap-3 px-3.5 sm:px-6 lg:px-8">
        {/* Mobile brand */}
        <div className="flex shrink-0 items-center md:hidden">
          <Logo showSubtitle={false} />
        </div>

        {/* Desktop semester context */}
        <div className="hidden md:flex w-[218px] shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4E7A1] text-[#171714] dark:bg-[#F4E7A1]/12 dark:text-[#F4E7A1]">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#66645C] dark:text-[#E8E1CF]/55">
              Active semester
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-[#171714] dark:text-[#FFFDF5]">
              S{student.currentSemesterNumber} <span className="text-[#E8E1CF] dark:text-[#E8E1CF]/35">·</span> {student.academicYear || '2025/2026'}
            </p>
          </div>
        </div>

        {/* Global search */}
        <div className="hidden min-w-0 flex-1 sm:flex">
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search courses, assignments, and memories"
            className="group flex h-10 min-w-0 w-full items-center justify-between gap-3 rounded-xl border border-[#E8E1CF] bg-[#FFFFFF]/76 px-3.5 text-left text-xs text-[#66645C] shadow-[0_4px_16px_rgba(23,23,20,0.04)] transition-all hover:border-[#C9A227] hover:bg-[#FFFFFF] dark:border-[#E8E1CF]/18 dark:bg-[#F4E7A1]/8 dark:text-[#E8E1CF]/70 dark:hover:border-[#C9A227] dark:hover:bg-[#F4E7A1]/12"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-[#66645C] transition-colors group-hover:text-[#C9A227] dark:text-[#E8E1CF]/65 dark:group-hover:text-[#F4E7A1]" />
              <span className="truncate">Search courses, assignments, memories...</span>
            </span>
            <kbd className="hidden shrink-0 rounded-md border border-[#E8E1CF] bg-[#FBF7E8] px-1.5 py-0.5 font-mono text-[10px] text-[#66645C] lg:inline-block dark:border-[#E8E1CF]/18 dark:bg-[#F4E7A1]/8 dark:text-[#E8E1CF]/55">
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Right command cluster */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Mobile search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#66645C] transition-colors hover:bg-[#FBF7E8] hover:text-[#171714] sm:hidden dark:text-[#E8E1CF]/70 dark:hover:bg-[#F4E7A1]/8 dark:hover:text-[#FFFDF5]"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Cloud sync: full label only where there is room */}
          <button
            onClick={handleManualSync}
            disabled={isSyncingLocal}
            title={lastCloudSyncTime ? `Last synced with Firebase: ${lastCloudSyncTime}. Click to re-sync.` : 'Click to sync with Firebase Cloud'}
            aria-label={syncFeedback || (isSynced ? 'Firebase synced' : 'Sync Firebase cloud')}
            className={`hidden xl:inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-[11px] font-semibold transition-all cursor-pointer ${
              isSynced
                ? 'border-[#E8E1CF] bg-[#FBF7E8] text-[#6B7D45] dark:border-[#E8E1CF]/18 dark:bg-[#F4E7A1]/8 dark:text-[#F4E7A1]'
                : isSyncing
                ? 'border-[#E8E1CF] bg-[#F4E7A1] text-[#171714] dark:border-[#E8E1CF]/18 dark:bg-[#F4E7A1]/12 dark:text-[#F4E7A1]'
                : firebaseStatus === 'error'
                ? 'border-[#E8E1CF] bg-[#F4E7A1] text-[#9B3D32] dark:border-[#E8E1CF]/18 dark:bg-[#9B3D32]/15 dark:text-[#E8E1CF]'
                : 'border-[#E8E1CF] bg-[#FFFFFF] text-[#66645C] dark:border-[#E8E1CF]/18 dark:bg-[#F4E7A1]/8 dark:text-[#E8E1CF]/70'
            }`}
          >
            {isSyncingLocal ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#C9A227]" />
            ) : isSynced ? (
              <span className="h-2 w-2 rounded-full bg-[#6B7D45] ring-2 ring-[#E8E1CF] dark:ring-[#F4E7A1]/18" />
            ) : firebaseStatus === 'error' ? (
              <ShieldAlert className="h-3.5 w-3.5 text-[#9B3D32]" />
            ) : (
              <Cloud className="h-3.5 w-3.5 text-[#C9A227]" />
            )}
            <span>{syncFeedback || (isSynced ? 'Firebase synced' : 'Cloud sync')}</span>
          </button>

          {/* Compact utility group */}
          <div className="flex items-center rounded-xl border border-[#E8E1CF] bg-[#FBF7E8]/80 p-0.5 dark:border-[#E8E1CF]/18 dark:bg-[#F4E7A1]/8">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#66645C] transition-colors hover:bg-[#FFFFFF] hover:text-[#171714] dark:text-[#E8E1CF]/70 dark:hover:bg-[#F4E7A1]/12 dark:hover:text-[#FFFDF5]"
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5 text-[#C9A227]" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifDropdownOpen((open) => !open)}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                aria-expanded={isNotifDropdownOpen}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#66645C] transition-colors hover:bg-[#FFFFFF] hover:text-[#171714] dark:text-[#E8E1CF]/70 dark:hover:bg-[#F4E7A1]/12 dark:hover:text-[#FFFDF5]"
              >
                <Bell className="h-4 w-4 text-[#C9A227]" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A227] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C9A227] ring-2 ring-[#FFFDF5] dark:ring-[#171714]" />
                  </span>
                )}
              </button>

              {/* Mobile Backdrop */}
              {isNotifDropdownOpen && (
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden"
                  onClick={() => setIsNotifDropdownOpen(false)}
                />
              )}

              {isNotifDropdownOpen && (
                <div className="fixed inset-x-3 top-16 z-50 mx-auto max-w-[340px] overflow-hidden rounded-2xl border border-[#C9A227]/30 bg-[#FFFDF5] shadow-[0_20px_50px_rgba(23,23,20,0.28)] animate-in fade-in zoom-in-95 duration-150 sm:absolute sm:inset-auto sm:right-0 sm:top-11 sm:w-80 dark:border-[#C9A227]/25 dark:bg-[#1C1B16]">
                  {/* Luxury Header */}
                  <div className="flex items-center justify-between border-b border-[#C9A227]/20 bg-gradient-to-r from-[#171714] to-[#25241D] px-4 py-3 text-[#FFFDF5]">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-[#C9A227]/20 text-[#F4E7A1]">
                        <Bell className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold tracking-tight">Academic Alerts</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-[#C9A227] px-2 py-0.5 text-[10px] font-extrabold text-[#171714]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#F4E7A1] hover:text-white transition-colors cursor-pointer"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        <span>All read</span>
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-72 divide-y divide-[#E8E1CF]/70 overflow-y-auto dark:divide-[#383428]">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-[#171714] dark:text-[#FFFDF5]">No active notifications</p>
                        <p className="mt-0.5 text-[11px] text-[#66645C] dark:text-[#E8E1CF]/60">Your academic feed is up to date!</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.actionLink) {
                              setActiveTab(n.actionLink);
                              setIsNotifDropdownOpen(false);
                            }
                          }}
                          className={`flex cursor-pointer items-start gap-3 p-3.5 text-left transition-colors hover:bg-[#FBF7E8] dark:hover:bg-[#25241D] ${
                            !n.isRead ? 'bg-[#FBF7E8]/80 dark:bg-[#2A2820]/90' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-[#C9A227]/15 text-[#C9A227]">
                            {n.category === 'Achievement' || n.category === 'Memory' ? (
                              <Sparkles className="h-3.5 w-3.5" />
                            ) : n.category === 'Deadline' ? (
                              <span className="inline-block h-2 w-2 rounded-full bg-[#B7791F]" />
                            ) : (
                              <GraduationCap className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-xs font-bold text-[#171714] dark:text-[#FFFDF5]">{n.title}</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(n.id);
                                }}
                                aria-label={`Dismiss ${n.title}`}
                                className="shrink-0 p-1 text-[#66645C] hover:text-[#9B3D32] dark:text-[#E8E1CF]/60 dark:hover:text-[#FFFDF5]"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="mt-0.5 text-[11px] text-[#66645C] dark:text-[#E8E1CF]/75 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] font-mono text-[#8C826D] dark:text-[#E8E1CF]/50 mt-1 inline-block">
                              {new Date(n.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer Link to Settings */}
                  <div className="border-t border-[#E8E1CF]/80 bg-[#FBF7E8]/70 px-4 py-2.5 text-center dark:border-[#383428] dark:bg-[#171714]">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setIsNotifDropdownOpen(false);
                      }}
                      className="text-[11px] font-bold text-[#C9A227] hover:underline cursor-pointer"
                    >
                      Notification Preferences in Settings →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary action */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            aria-label="Add a new record"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#C9A227] px-3 text-xs font-bold text-[#171714] shadow-[0_8px_18px_rgba(201,162,39,0.18)] transition-all hover:bg-[#9B7A1D] hover:shadow-[0_10px_22px_rgba(201,162,39,0.26)] sm:px-3.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">New record</span>
          </button>

          {/* Profile */}
          <div className="ml-1 flex items-center gap-1 border-l border-[#E8E1CF] pl-2 dark:border-[#E8E1CF]/18">
            <button
              onClick={() => setActiveTab('settings')}
              aria-label={`Open settings for ${student.fullName}`}
              className="flex h-9 items-center gap-2 rounded-xl px-1.5 text-left transition-colors hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden bg-[#171714] text-xs font-bold text-[#F4E7A1] shadow-[0_6px_14px_rgba(201,162,39,0.22)] dark:bg-[#C9A227] dark:text-[#171714] border border-[#C9A227]/40 shrink-0">
                {student.avatarUrl ? (
                  <img src={student.avatarUrl} alt={student.fullName} className="w-full h-full object-cover object-top" />
                ) : (
                  student.fullName.charAt(0)
                )}
              </span>
              <span className="hidden max-w-[9rem] leading-tight xl:block">
                <span className="block truncate text-xs font-bold text-[#171714] dark:text-[#FFFDF5]">{student.fullName}</span>
                <span className="mt-0.5 block text-[10px] font-mono text-[#66645C] dark:text-[#E8E1CF]/70">
                  {student.studentId} · S{student.currentSemesterNumber}
                </span>
              </span>
            </button>
            <button
              onClick={logout}
              title="Exit to Gateway"
              aria-label="Exit to Gateway"
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-[#66645C] transition-colors hover:bg-[#F4E7A1] hover:text-[#9B3D32] lg:inline-flex dark:text-[#E8E1CF]/70 dark:hover:bg-[#9B3D32]/15 dark:hover:text-[#E8E1CF]"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
