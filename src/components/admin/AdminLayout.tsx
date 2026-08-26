import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { AdminOverview } from './AdminOverview';
import { AdminResultsManager } from './AdminResultsManager';
import { AdminQuotesManager } from './AdminQuotesManager';
import { AdminStudentsManager } from './AdminStudentsManager';
import { SemesterView } from '../semesters/SemesterView';
import { CourseListView } from '../courses/CourseListView';
import { ActivityManager } from '../activities/ActivityManager';
import { AcademicCalendar } from '../calendar/AcademicCalendar';
import { DocumentsVault } from '../documents/DocumentsVault';
import { FeesVault } from '../financial/FeesVault';
import { MemoryCenter } from '../memories/MemoryCenter';
import { SettingsView } from '../settings/SettingsView';
import { AuditHistoryModal } from '../audit/AuditHistoryModal';
import { GlobalSearchModal } from '../search/GlobalSearchModal';

export const AdminLayout: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const { isSearchOpen, isAuditModalOpen, setIsAuditModalOpen, setIsSearchOpen } = useAcademic();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Dedicated Admin Sidebar */}
      <AdminSidebar
        activeAdminTab={activeAdminTab}
        setActiveAdminTab={setActiveAdminTab}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAudit={() => setIsAuditModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeAdminTab === 'overview' && (
            <AdminOverview setActiveAdminTab={setActiveAdminTab} />
          )}
          {activeAdminTab === 'students' && <AdminStudentsManager />}
          {activeAdminTab === 'results' && <AdminResultsManager />}
          {activeAdminTab === 'quotes' && <AdminQuotesManager />}
          {activeAdminTab === 'semesters' && <SemesterView />}
          {activeAdminTab === 'courses' && <CourseListView />}
          {activeAdminTab === 'activities' && <ActivityManager />}
          {activeAdminTab === 'timetable' && <AcademicCalendar />}
          {activeAdminTab === 'documents' && <DocumentsVault />}
          {activeAdminTab === 'fees' && <FeesVault />}
          {activeAdminTab === 'memories' && <MemoryCenter />}
          {activeAdminTab === 'backups' && <SettingsView />}
          {activeAdminTab === 'settings' && <SettingsView />}
          {activeAdminTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Append-Only Audit Trail
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Inspect the cryptographically sequenced immutable ledger of all system and GPA modifications.
                </p>
                <button
                  onClick={() => setIsAuditModalOpen(true)}
                  className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs transition-all"
                >
                  Open Full Audit Ledger Stream
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      {isSearchOpen && <GlobalSearchModal />}
      {isAuditModalOpen && <AuditHistoryModal />}
    </div>
  );
};
