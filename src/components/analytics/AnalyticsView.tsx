import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  BookCheck,
  Calculator,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { useAcademic } from '../../context/AcademicContext';
import { PageHeader } from '../ui/PageHeader';
import { Card } from '../ui/Card';

export const AnalyticsView: React.FC = () => {
  const {
    semesters,
    courses,
    cgpa,
    completedCredits,
    totalRequiredCredits,
    remainingCredits,
    student,
    isDarkMode,
  } = useAcademic();

  // What-If Simulator state
  const [simulatedS7Gpa, setSimulatedS7Gpa] = useState<number>(3.80);
  const [simulatedS8Gpa, setSimulatedS8Gpa] = useState<number>(3.85);

  // Prepare chart data from completed & active semesters
  const gpaData = semesters
    .filter((s) => s.gpa !== undefined)
    .map((s) => ({
      name: `S${s.number}`,
      fullName: s.name,
      termGpa: s.gpa,
      rank: s.academicRank,
    }));

  // Grade count distribution
  const gradeCounts: Record<string, number> = {};
  courses.forEach((c) => {
    if (c.grade && !c.isArchived) {
      gradeCounts[c.grade] = (gradeCounts[c.grade] || 0) + 1;
    }
  });

  const gradeDistributionData = [
    { grade: 'A (4.0)', count: gradeCounts['A'] || 8, color: '#C9A227' },
    { grade: 'B+ (3.5)', count: gradeCounts['B+'] || 4, color: '#10B981' },
    { grade: 'B (3.0)', count: gradeCounts['B'] || 2, color: '#F59E0B' },
    { grade: 'C+ / C', count: (gradeCounts['C+'] || 0) + (gradeCounts['C'] || 0), color: '#66645C' },
  ];

  // Calculate simulated final graduation CGPA
  const s7Credits = semesters.find((s) => s.number === 7)?.totalCredits || 18;
  const s8Credits = semesters.find((s) => s.number === 8)?.totalCredits || 12;
  const currentTotalPoints = cgpa * completedCredits;
  const simTotalPoints = currentTotalPoints + (simulatedS7Gpa * s7Credits) + (simulatedS8Gpa * s8Credits);
  const totalGradCredits = completedCredits + s7Credits + s8Credits;
  const projectedFinalCgpa = totalGradCredits > 0 ? (simTotalPoints / totalGradCredits).toFixed(2) : cgpa.toFixed(2);

  const chartGridColor = isDarkMode ? '#3A372E' : '#E8E1CF';
  const chartTextColor = isDarkMode ? '#66645C' : '#66645C';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="Academic Analytics & GPA Engine"
        eyebrowIcon={<TrendingUp className="w-4 h-4 text-[#C9A227]" />}
        title="Performance Trends & GPA Trajectory"
        description="Data-first academic progression across all semesters with interactive What-If scenario simulations."
      />

      {/* 2. Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Cumulative CGPA
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {cgpa.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 4.00</span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            ↑ Consistent upward trend
          </span>
        </Card>

        <Card padding="md">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Historical Peak Term
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-500">
              3.65 GPA
            </span>
            <span className="text-xs font-semibold text-slate-400">🥈 S6</span>
          </div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            Rank #2 in Software Engineering
          </span>
        </Card>

        <Card padding="md">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Credit Completion
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {completedCredits}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ {totalRequiredCredits} CH</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {remainingCredits} CH remaining to graduate
          </span>
        </Card>

        <Card padding="md">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Academic Standing
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Good Standing
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Active Degree Candidate
          </span>
        </Card>
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* GPA Progression Curve */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Term GPA Progression (Semesters 1 — 7)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Trajectory curve across completed and active semesters.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#C9A227] dark:text-[#F4E7A1] border border-[#E8E1CF] dark:border-[#E8E1CF]/18">
              Peak: 3.65 GPA
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpaData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A227" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C9A227" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} opacity={0.6} />
                <XAxis dataKey="name" stroke={chartTextColor} fontSize={11} tickLine={false} />
                <YAxis domain={[2.5, 4.0]} stroke={chartTextColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#24231D' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#66645C' : '#E8E1CF'}`,
                    borderRadius: '12px',
                    color: isDarkMode ? '#FFFDF5' : '#24231D',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: any) => [`${value} GPA`, 'Term GPA']}
                />
                <Area
                  type="monotone"
                  dataKey="termGpa"
                  stroke="#C9A227"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#gpaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Bar */}
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="pb-3.5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Grade Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Course performance breakdown
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} opacity={0.6} />
                <XAxis dataKey="grade" stroke={chartTextColor} fontSize={10} tickLine={false} />
                <YAxis stroke={chartTextColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#24231D' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#66645C' : '#E8E1CF'}`,
                    borderRadius: '12px',
                    color: isDarkMode ? '#FFFDF5' : '#24231D',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value} Courses`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. What-If GPA Simulator */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#C9A227] dark:text-[#F4E7A1]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                What-If GPA Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate potential final graduation CGPA based on expected outcomes in remaining terms.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Interactive Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Semester 7 Target GPA</span>
              <span className="font-mono font-bold text-[#C9A227] dark:text-[#F4E7A1]">{simulatedS7Gpa.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="2.00"
              max="4.00"
              step="0.05"
              value={simulatedS7Gpa}
              onChange={(e) => setSimulatedS7Gpa(parseFloat(e.target.value))}
              className="w-full accent-[#C9A227] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>2.00</span>
              <span>3.00</span>
              <span>4.00</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Semester 8 Target GPA (Final Term)</span>
              <span className="font-mono font-bold text-[#C9A227] dark:text-[#F4E7A1]">{simulatedS8Gpa.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="2.00"
              max="4.00"
              step="0.05"
              value={simulatedS8Gpa}
              onChange={(e) => setSimulatedS8Gpa(parseFloat(e.target.value))}
              className="w-full accent-[#C9A227] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>2.00</span>
              <span>3.00</span>
              <span>4.00</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F4E7A1]/35 dark:bg-[#F4E7A1]/8 border border-[#E8E1CF] dark:border-[#E8E1CF]/18 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#C9A227] dark:text-[#F4E7A1] uppercase tracking-wider">
              Projected Graduation CGPA
            </span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#C9A227] dark:text-[#F4E7A1]">
                {projectedFinalCgpa}
              </span>
              <span className="text-xs font-semibold text-slate-500">/ 4.00</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Hypothetical projection (Record unchanged)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
