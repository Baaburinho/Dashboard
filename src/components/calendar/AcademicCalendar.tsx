import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { PageHeader } from '../ui/PageHeader';
import { Card } from '../ui/Card';

export const AcademicCalendar: React.FC = () => {
  const { timetable, activities, setSelectedCourseId, setActiveTab } = useAcademic();
  const [activeView, setActiveView] = useState<'timetable' | 'deadlines'>('timetable');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

  const filteredTimetable = timetable.filter((t) => t.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Standardized Page Header */}
      <PageHeader
        eyebrow="Schedule & Academic Calendar"
        eyebrowIcon={<CalendarIcon className="w-4 h-4 text-[#C9A227]" />}
        title="Weekly Lectures & Deliverables Schedule"
        description="Synchronized schedule for active semester courses, lab consultations, and exams."
        actions={
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveView('timetable')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeView === 'timetable'
                  ? 'bg-[#C9A227] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Weekly Timetable
            </button>
            <button
              onClick={() => setActiveView('deadlines')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeView === 'deadlines'
                  ? 'bg-[#C9A227] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Deadlines Calendar
            </button>
          </div>
        }
      />

      {activeView === 'timetable' ? (
        <div className="space-y-4">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {daysOfWeek.map((day) => {
              const count = timetable.filter((t) => t.dayOfWeek === day).length;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 border cursor-pointer ${
                    selectedDay === day
                      ? 'bg-[#C9A227] text-white border-[#C9A227] shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-[#C9A227]/50'
                  }`}
                >
                  <span>{day}</span>
                  {count > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      selectedDay === day ? 'bg-[#9B7A1D] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Timetable List for Day */}
          <div className="space-y-3">
            {filteredTimetable.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500">
                No lectures scheduled for {selectedDay}. Ideal for independent study, projects, or lab prep.
              </div>
            ) : (
              filteredTimetable.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => {
                    setSelectedCourseId(slot.courseId);
                    setActiveTab('course-detail');
                  }}
                  className="group p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-[#C9A227]/60 dark:hover:border-[#C9A227]/60 shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex flex-col items-center justify-center w-16 py-2 rounded-xl bg-[#C9A227] dark:bg-[#2D2B24] text-white dark:text-[#E8E1CF] shrink-0 font-mono text-xs border border-[#9B7A1D] dark:border-[#E8E1CF]/18 shadow-xs">
                      <span className="font-bold">{slot.startTime}</span>
                      <span className="text-[9px] text-[#E8E1CF] dark:text-[#F4E7A1]">{slot.endTime}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#C9A227] dark:group-hover:text-[#F4E7A1] transition-colors">
                          {slot.courseName}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#C9A227] dark:text-[#F4E7A1] border border-slate-200 dark:border-slate-700">
                          {slot.courseCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {slot.room}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {slot.lecturer}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-[#C9A227] dark:text-[#F4E7A1] group-hover:translate-x-1 transition-transform">
                    <span>Course Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Deadlines List View */
        <div className="space-y-3">
          {activities.filter(a => !a.isArchived).map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                  {act.courseCode.slice(0, 3)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {act.courseName} · Due {new Date(act.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                act.status === 'Completed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700'
              }`}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
