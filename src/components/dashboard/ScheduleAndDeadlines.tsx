import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  User,
  Plus,
  Sparkles
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const ScheduleAndDeadlines: React.FC = () => {
  const {
    todaysTimetable,
    urgentDeadlines,
    toggleActivityComplete,
    setActiveTab,
    setSelectedCourseId,
    setIsQuickAddOpen,
  } = useAcademic();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Today's Lecture Schedule */}
      <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E8E1CF] dark:border-[#3A372E]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#C9A227] dark:text-[#D4AF37] border border-[#C9A227]/30 flex items-center justify-center shadow-2xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#171714] dark:text-[#F7F3E8]">
                  Today's Lecture Schedule
                </h3>
                <span className="text-[11px] text-[#66645C] dark:text-[#B9B3A4]">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#FFFDF5] dark:bg-[#151513] text-[#66645C] dark:text-[#B9B3A4] border border-[#E8E1CF] dark:border-[#3A372E]">
              {todaysTimetable.length} sessions
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {todaysTimetable.length === 0 ? (
              <div className="py-10 px-4 text-center rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-dashed border-[#E8E1CF] dark:border-[#3A372E] text-xs text-[#66645C] dark:text-[#B9B3A4]">
                <p className="font-medium text-[#171714] dark:text-[#F7F3E8] mb-1">No scheduled lectures today</p>
                <p className="text-[11px]">Ideal window for deep coursework focus, lab assignments, and project defense prep.</p>
              </div>
            ) : (
              todaysTimetable.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => {
                    setSelectedCourseId(slot.courseId);
                    setActiveTab('course-detail');
                  }}
                  className="p-3.5 rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] dark:hover:border-[#D4AF37] hover:bg-[#FFFFFF] dark:hover:bg-[#1E1D19] transition-all cursor-pointer flex items-start justify-between gap-3 group shadow-2xs"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex flex-col items-center justify-center w-14 py-1.5 rounded-xl bg-[#171714] dark:bg-[#24231D] text-[#FFFDF5] shrink-0 font-mono text-[10px] border border-[#E8E1CF]/40 dark:border-[#3A372E] shadow-2xs">
                      <span className="font-bold">{slot.startTime}</span>
                      <span className="text-[8px] text-[#F4E7A1]">{slot.endTime}</span>
                    </div>

                    <div className="min-w-0 pt-0.5">
                      <span className="font-editorial text-sm font-bold text-[#171714] dark:text-[#F7F3E8] group-hover:text-[#C9A227] dark:group-hover:text-[#D4AF37] transition-colors truncate block">
                        {slot.courseName}
                      </span>
                      <div className="flex items-center gap-3 text-[11px] text-[#66645C] dark:text-[#B9B3A4] mt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-[#C9A227] dark:text-[#D4AF37]" />
                          {slot.room}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 truncate">
                          <User className="w-3 h-3 text-[#66645C] dark:text-[#B9B3A4]" />
                          {slot.lecturer}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-[#FFFFFF] dark:bg-[#1E1D19] text-[#C9A227] dark:text-[#D4AF37] border border-[#E8E1CF] dark:border-[#3A372E] shrink-0">
                    {slot.courseCode}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#E8E1CF] dark:border-[#3A372E] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#66645C] dark:text-[#B9B3A4]">
            Official Zamzam IT Timetable
          </span>
          <button
            onClick={() => setActiveTab('calendar')}
            className="text-xs font-semibold text-[#C9A227] dark:text-[#D4AF37] hover:text-[#9B7A1D] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Full Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Upcoming Course Deliverables */}
      <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E8E1CF] dark:border-[#3A372E]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#B7791F] dark:text-[#C28A2C] border border-[#C9A227]/30 flex items-center justify-center shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#171714] dark:text-[#F7F3E8]">
                  Upcoming Course Deliverables
                </h3>
                <span className="text-[11px] text-[#66645C] dark:text-[#B9B3A4]">
                  Assignments, projects & assessments
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] hover:text-[#C9A227] border border-[#E8E1CF] dark:border-[#3A372E] text-xs font-semibold cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {urgentDeadlines.length === 0 ? (
              <div className="py-10 px-4 text-center rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-dashed border-[#E8E1CF] dark:border-[#3A372E] text-xs text-[#66645C] dark:text-[#B9B3A4]">
                <p className="font-medium text-[#171714] dark:text-[#F7F3E8] mb-1">Zero pending deliverables</p>
                <p className="text-[11px]">All assignments are up to date. You can add new tasks as professors assign them.</p>
              </div>
            ) : (
              urgentDeadlines.map((act) => {
                const deadlineDate = new Date(act.deadline);
                const isUrgent = deadlineDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

                return (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] dark:hover:border-[#D4AF37] transition-all flex items-start justify-between gap-3 group shadow-2xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActivityComplete(act.id);
                        }}
                        aria-label={`Mark ${act.title} complete`}
                        className={`w-4 h-4 rounded-md mt-0.5 border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          act.status === 'Completed'
                            ? 'bg-[#6B7D45] border-[#6B7D45] text-white'
                            : 'border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227]'
                        }`}
                      >
                        {act.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0">
                        <span className="font-editorial text-sm font-bold text-[#171714] dark:text-[#F7F3E8] group-hover:text-[#C9A227] dark:group-hover:text-[#D4AF37] transition-colors block truncate">
                          {act.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-[#66645C] dark:text-[#B9B3A4] mt-1">
                          <span className="font-semibold font-mono text-[#171714] dark:text-[#F7F3E8]">{act.courseCode}</span>
                          <span>·</span>
                          <span>{act.type}</span>
                          <span>·</span>
                          <span className={isUrgent ? 'font-semibold text-[#9B3D32]' : 'text-[#66645C] dark:text-[#B9B3A4]'}>
                            Due {deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                          act.priority === 'High' || act.priority === 'Critical'
                            ? 'bg-[#F4E7A1]/40 dark:bg-[#9B3D32]/20 text-[#9B3D32] dark:text-[#F7F3E8] border-[#9B3D32]/30'
                            : 'bg-[#FFFDF5] dark:bg-[#151513] text-[#66645C] dark:text-[#B9B3A4] border-[#E8E1CF] dark:border-[#3A372E]'
                        }`}
                      >
                        {act.priority || 'Normal'}
                      </span>
                      {act.weightPercentage && (
                        <span className="text-[9px] font-mono text-[#66645C] dark:text-[#B9B3A4]">
                          {act.weightPercentage}% Weight
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#E8E1CF] dark:border-[#3A372E] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#66645C] dark:text-[#B9B3A4]">
            Continuous academic tracking
          </span>
          <button
            onClick={() => setActiveTab('activities')}
            className="text-xs font-semibold text-[#C9A227] dark:text-[#D4AF37] hover:text-[#9B7A1D] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>All Activities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
