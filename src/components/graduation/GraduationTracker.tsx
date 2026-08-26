import React from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  BookCheck,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { PageHeader } from '../ui/PageHeader';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const GraduationTracker: React.FC = () => {
  const {
    student,
    completedCredits,
    totalRequiredCredits,
    remainingCredits,
    graduationProgress,
    cgpa,
  } = useAcademic();

  const graduationChecklist = [
    {
      id: 'req-1',
      title: 'General University Core Requirements',
      credits: '36 / 36 Credits',
      status: 'Completed',
      description: 'Calculus I & II, Physics, Academic Writing, Islamic Ethics, Statistics.',
    },
    {
      id: 'req-2',
      title: 'Departmental Software Engineering Major',
      credits: '54 / 54 Credits',
      status: 'Completed',
      description: 'Data Structures, OOP, Database Systems (Grade A), Software Architecture, Operating Systems.',
    },
    {
      id: 'req-3',
      title: 'Semester 7 Advanced Core & Electives',
      credits: '18 / 18 Credits (Active)',
      status: 'In Progress',
      description: 'AI & ML, Software Architecture, Web Engineering, Database Systems & Engineering, NetSec.',
    },
    {
      id: 'req-4',
      title: 'Senior Capstone Project (Phase I & II)',
      credits: '6 Credits Required',
      status: 'In Progress',
      description: 'Phase I Proposal Defense (S7) and Phase II Final System Defense (S8).',
    },
    {
      id: 'req-5',
      title: 'Semester 8 Final Electives & IT Law',
      credits: '6 Credits Required',
      status: 'Planned',
      description: 'Enterprise Cloud Systems, Professional IT Law & Standards.',
    },
    {
      id: 'req-6',
      title: 'Minimum Degree CGPA Threshold (≥ 2.00)',
      credits: `Current: ${cgpa.toFixed(2)} CGPA`,
      status: 'Completed',
      description: `Academic standing: ${student.academicStanding || 'Good Standing · Active Degree Candidate'}.`,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Standardized Page Header */}
      <PageHeader
        eyebrow="Degree Audit & Requirements Checklist"
        eyebrowIcon={<GraduationCap className="w-4 h-4 text-[#C9A227]" />}
        title="Graduation Roadmap & Degree Clearance"
        description={`Tracking degree credit fulfillment from freshman enrollment toward ${student.expectedGraduation || 'June 2027'} graduation.`}
      />

      {/* 2. Hero Progress Card */}
      <Card padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A227]/5 dark:bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overall Degree Completion
            </span>
            <div className="my-2 flex items-baseline gap-2.5">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {graduationProgress}%
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                Status: On Track
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedCredits} credits completed of {totalRequiredCredits} total required credits.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                {remainingCredits} Credits
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Remaining to graduate</div>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="text-right">
              <div className="text-sm font-mono font-bold text-[#C9A227] dark:text-[#F4E7A1]">
                {student.expectedGraduation || 'June 2027'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Target Graduation</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 pt-6 space-y-2.5">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Degree Progression</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {completedCredits} / {totalRequiredCredits} CH
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#9B7A1D] transition-all duration-500 shadow-sm"
              style={{ width: `${graduationProgress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* 3. Degree Checklist Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Curriculum Requirements Audit
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {graduationChecklist.map((req) => {
            const isCompleted = req.status === 'Completed';
            const isInProgress = req.status === 'In Progress';

            return (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {req.title}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                          : isInProgress
                          ? 'bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border-[#E8E1CF] dark:border-[#E8E1CF]/18'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 dark:text-slate-400">{req.credits}</span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Clear
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[#C9A227] dark:text-[#F4E7A1] font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
