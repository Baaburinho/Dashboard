import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  User,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { CurrentCoursesGrid } from '../dashboard/CurrentCoursesGrid';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';

export const CourseListView: React.FC = () => {
  const {
    courses,
    semesters,
    setSelectedCourseId,
    setActiveTab,
    setIsQuickAddOpen,
  } = useAcademic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCourses = courses.filter((c) => {
    if (c.isArchived) return false;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSem = selectedSemesterFilter === 'all' || c.semesterId === selectedSemesterFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesSem && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Standardized Page Header */}
      <PageHeader
        eyebrow="Courses & Academic Hub"
        eyebrowIcon={<BookOpen className="w-4 h-4 text-[#C9A227]" />}
        title={`All University Courses (${courses.length})`}
        description="Access dedicated lecture notes, course benchmarks, assessment weighting breakdown, and attendance logs."
        actions={
          <Button
            variant="indigo"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsQuickAddOpen(true)}
          >
            New Course
          </Button>
        }
      />

      {/* 2. Active Semester Workspaces & Registration */}
      <CurrentCoursesGrid />

      {/* 3. Search & Full University Course Catalog */}
      <div className="pt-4 border-t border-[#E8E1CF] dark:border-[#3A372E] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-editorial text-[#171714] dark:text-[#F7F3E8]">
            Course Catalog & Historical Records
          </h3>
          <span className="text-xs text-[#66645C] dark:text-[#B9B3A4] font-mono">
            {filteredCourses.length} Courses Found
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter courses by code, title, or lecturer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedSemesterFilter}
            onChange={(e) => setSelectedSemesterFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
          >
            <option value="all">All Semesters</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.academicYear})
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Planned">Planned</option>
          </select>
        </div>
      </div>

      {/* 3. Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((c) => {
          const sem = semesters.find((s) => s.id === c.semesterId);

          return (
            <div
              key={c.id}
              onClick={() => {
                setSelectedCourseId(c.id);
                setActiveTab('course-detail');
              }}
              className="group rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs hover:border-[#C9A227]/60 dark:hover:border-[#C9A227]/60 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top: Code, Semester & Grade */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#C9A227] dark:text-[#F4E7A1] px-2.5 py-0.5 rounded-full bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 border border-[#E8E1CF] dark:border-[#E8E1CF]/18">
                    {c.code}
                  </span>
                  <div className="flex items-center gap-2">
                    {c.grade && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 border border-slate-700">
                        Grade {c.grade}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                      {c.creditHours} CH
                    </span>
                  </div>
                </div>

                {/* Course Name */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#C9A227] dark:group-hover:text-[#F4E7A1] transition-colors mt-3 line-clamp-1">
                  {c.name}
                </h3>

                {/* Lecturer & Semester Tag */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {c.lecturer}
                  </span>
                  <span className="font-mono text-[11px] shrink-0 ml-2">
                    {sem?.name || 'Academic'}
                  </span>
                </div>
              </div>

              {/* Bottom Progress & Action */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {c.status === 'Completed' ? 'Completed 100%' : `Progress ${c.progressPercentage}%`}
                  </span>
                  <span className="text-xs text-[#C9A227] dark:text-[#F4E7A1] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Hub</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#C9A227] dark:bg-[#2D2B24] transition-all duration-300"
                    style={{ width: `${c.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};
