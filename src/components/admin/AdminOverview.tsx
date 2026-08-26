import React from 'react';
import {
  LayoutDashboard,
  Users,
  Compass,
  BookOpen,
  Award,
  Quote,
  ShieldCheck,
  Database,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { PageHeader } from '../ui/PageHeader';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface AdminOverviewProps {
  setActiveAdminTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  setActiveAdminTab,
}) => {
  const {
    student,
    semesters,
    courses,
    quotes,
    auditLogs,
    feeRecords,
    activities
  } = useAcademic();

  const totalFeeBilled = feeRecords.reduce((sum, f) => sum + f.totalFee, 0);
  const totalFeePaid = feeRecords.reduce((sum, f) => sum + f.paidAmount, 0);
  const currentSemObj = semesters.find((s) => s.status === 'Active') || semesters.find((s) => s.number === 7);
  const s6SemObj = semesters.find((s) => s.number === 6);
  const activeS7Courses = courses.filter((c) => c.semesterId === currentSemObj?.id && !c.isArchived);
  const s6Courses = courses.filter((c) => c.semesterId === s6SemObj?.id && !c.isArchived);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Admin Page Header */}
      <PageHeader
        eyebrow="Central Administration & Governance"
        eyebrowIcon={<LayoutDashboard className="w-4 h-4 text-emerald-500" />}
        title="PAOS Academic Management Console"
        description="Full governance of student records, curriculum chapters (S1–S8), official examination grades, daily motivation quotes, and append-only audit trail."
        actions={
          <>
            <Button
              variant="secondary"
              icon={<Quote className="w-3.5 h-3.5" />}
              onClick={() => setActiveAdminTab('quotes')}
            >
              Quotes Library ({quotes.length})
            </Button>
            <Button
              variant="indigo"
              icon={<Award className="w-3.5 h-3.5" />}
              onClick={() => setActiveAdminTab('results')}
            >
              Official Results Ledger
            </Button>
          </>
        }
      />

      {/* 2. System KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Active Student
            </span>
            <Users className="w-4 h-4 text-[#C9A227]" />
          </div>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white block mt-1">
            {student.fullName}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            ID: {student.studentId} · {student.department}
          </span>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Curriculum Chapters
            </span>
            <Compass className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-1">
            {semesters.length} Semesters (S1–S8)
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            6 Completed · 1 Active · 1 Planned
          </span>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Course Catalog
            </span>
            <BookOpen className="w-4 h-4 text-[#C9A227]" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-1">
            {courses.length} Registered Courses
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {courses.filter(c => c.status === 'Completed').length} Cleared Courses
          </span>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Audit Events
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">
            {auditLogs.length} Verified Logs
          </span>
          <span className="text-[11px] text-slate-400">
            Zero integrity conflicts
          </span>
        </Card>
      </div>

      {/* 3. Quick Administration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Manage Semester 6 Official Result */}
        <div
          onClick={() => setActiveAdminTab('results')}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-[#C9A227]/60 dark:hover:border-[#C9A227]/60 transition-all cursor-pointer shadow-xs group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60">
                Official Result Verification
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">3.65 Term GPA</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Semester 6 Official Results & Rank #2 Milestone
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Verify course examination scores (Total 561/600 marks, 94% average) and official cohort ranking distinctions.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#C9A227] dark:text-[#F4E7A1]">
            <span>Open Results Verification Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Manage Daily Quotes */}
        <div
          onClick={() => setActiveAdminTab('quotes')}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-[#C9A227]/60 transition-all cursor-pointer shadow-xs group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Wisdom Rotation
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{quotes.length} Quotes</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Daily Motivation & Quote Rotation Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Add and curate inspirational quotes for students, categorized into Wisdom, Determination, Knowledge, and Discipline.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Manage Daily Wisdom Library</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
