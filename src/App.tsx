import React, { useState } from 'react';
import { AcademicProvider, useAcademic } from './context/AcademicContext';
import { LandingGateway } from './components/landing/LandingGateway';
import { AdminLayout } from './components/admin/AdminLayout';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { SemesterView } from './components/semesters/SemesterView';
import { CourseListView } from './components/courses/CourseListView';
import { CourseWorkspace } from './components/courses/CourseWorkspace';
import { MemoryCenter } from './components/memories/MemoryCenter';
import { ActivityManager } from './components/activities/ActivityManager';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { GraduationTracker } from './components/graduation/GraduationTracker';
import { AcademicCalendar } from './components/calendar/AcademicCalendar';
import { DocumentsVault } from './components/documents/DocumentsVault';
import { GoalsView } from './components/goals/GoalsView';
import { FeesVault } from './components/financial/FeesVault';
import { SettingsView } from './components/settings/SettingsView';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { QuickAddModal } from './components/quickadd/QuickAddModal';
import { AcademicExportModal } from './components/export/AcademicExportModal';
import { AuditHistoryModal } from './components/audit/AuditHistoryModal';
import {
  X,
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
  LogOut
} from 'lucide-react';
import { Logo } from './components/layout/Logo';

const StudentPortalContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsSearchOpen,
    setIsAuditModalOpen,
    setIsExportModalOpen,
    logout,
  } = useAcademic();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileNavGroups = [
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
    <div className="dashboard-canvas min-h-screen text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#171714]/35 dark:bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-150">
          <div className="w-4/5 max-w-xs bg-[#FFFFFF] dark:bg-[#24231D] h-full p-5 border-r border-[#E8E1CF] dark:border-[#E8E1CF]/18 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E1CF] dark:border-[#E8E1CF]/18">
                <Logo />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#66645C] hover:text-[#171714] dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {mobileNavGroups.map((section) => (
                  <div key={section.group} className="space-y-1">
                    <div className="px-3 pb-2 text-[10px] uppercase tracking-[0.18em] font-bold text-[#66645C] dark:text-[#E8E1CF]/55">
                      {section.group}
                    </div>

                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                            isActive
                              ? 'bg-[#F4E7A1] text-[#171714] dark:bg-[#F4E7A1]/16 dark:text-[#F4E7A1] font-semibold'
                              : 'text-[#617269] dark:text-[#E8E1CF]/70 hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A227] dark:text-[#F4E7A1]' : ''}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E1CF] dark:border-[#E8E1CF]/18 space-y-1">
              <button
                onClick={() => {
                  setIsAuditModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 text-xs text-[#617269] dark:text-[#E8E1CF]/70 p-2.5 hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8 rounded-xl"
              >
                <ShieldCheck className="w-4 h-4 text-[#6B7D45]" />
                <span>Audit Trail Ledger</span>
              </button>
              <button
                onClick={() => {
                  setIsExportModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 text-xs text-[#617269] dark:text-[#E8E1CF]/70 p-2.5 hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8 rounded-xl"
              >
                <Download className="w-4 h-4 text-[#C9A227]" />
                <span>Export Journey Report</span>
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 text-xs text-[#9B3D32] dark:text-[#E8E1CF] p-2.5 hover:bg-[#F4E7A1] dark:hover:bg-[#9B3D32]/15 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit to Gateway</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'journey' && <SemesterView />}
          {activeTab === 'courses' && <CourseListView />}
          {activeTab === 'course-detail' && <CourseWorkspace />}
          {activeTab === 'memories' && <MemoryCenter />}
          {activeTab === 'activities' && <ActivityManager />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'graduation' && <GraduationTracker />}
          {activeTab === 'calendar' && <AcademicCalendar />}
          {activeTab === 'documents' && <DocumentsVault />}
          {activeTab === 'goals' && <GoalsView />}
          {activeTab === 'financial' && <FeesVault />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Global Modals */}
      <GlobalSearchModal />
      <QuickAddModal />
      <AcademicExportModal />
      <AuditHistoryModal />
    </div>
  );
};

const AppRouter: React.FC = () => {
  const { currentRole } = useAcademic();

  if (currentRole === 'guest') {
    return <LandingGateway />;
  }

  if (currentRole === 'admin') {
    return <AdminLayout />;
  }

  return <StudentPortalContent />;
};

export function App() {
  return (
    <AcademicProvider>
      <AppRouter />
    </AcademicProvider>
  );
}

export default App;
