import React, { useState } from 'react';
import {
  User,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Plus,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Edit2,
  Trash2
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { CourseFormModal } from '../courses/CourseFormModal';
import { CourseDeleteModal } from '../courses/CourseDeleteModal';
import { Course } from '../../types';

interface CurrentCoursesGridProps {
  onEditCourse?: (course: Course) => void;
}

export const CurrentCoursesGrid: React.FC<CurrentCoursesGridProps> = ({ onEditCourse }) => {
  const {
    activeSemesterCourses,
    activities,
    setSelectedCourseId,
    setActiveTab,
    student,
    addCourse,
    deleteCourse,
    softDeleteCourse,
    currentSemester,
  } = useAcademic();

  const [isAddingSuggested, setIsAddingSuggested] = useState(false);
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [localCourseToEdit, setLocalCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const suggestedCourses = [
    { code: 'IT 401', name: 'Advanced Artificial Intelligence & Deep Learning', ch: 3, lecturer: 'Dr. Abdirashid Nur', room: 'Hall B-204' },
    { code: 'IT 402', name: 'Cloud Infrastructure & Enterprise Security', ch: 3, lecturer: 'Eng. Amina Sheikh', room: 'Lab 2' },
    { code: 'IT 403', name: 'Web Engineering & Scalable Microservices', ch: 3, lecturer: 'Prof. Hassan Warsame', room: 'Lab 1' },
    { code: 'IT 499', name: 'Senior Capstone Final Project — Phase I', ch: 3, lecturer: 'Faculty Capstone Committee', room: 'Seminar Room 1' },
  ];

  const handleQuickAddSuggested = (suggested: typeof suggestedCourses[0]) => {
    if (!currentSemester) return;
    setIsAddingSuggested(true);
    addCourse({
      semesterId: currentSemester.id,
      code: suggested.code,
      name: suggested.name,
      creditHours: suggested.ch,
      lecturer: suggested.lecturer,
      room: suggested.room,
      status: 'Active',
      progressPercentage: 0,
      provenance: 'Personal Record',
      sourceNote: 'Registered via Semester 7 course onboarding',
    });
    setTimeout(() => setIsAddingSuggested(false), 300);
  };

  const handleOpenCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab('course-detail');
  };

  const handleEditClick = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    if (onEditCourse) {
      onEditCourse(course);
    } else {
      setLocalCourseToEdit(course);
      setIsCustomFormOpen(true);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    setCourseToDelete(course);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#66645C] dark:text-[#B9B3A4] block">
            Current Academic Load
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#171714] dark:text-[#F7F3E8] mt-0.5">
            Semester {student.currentSemesterNumber} Course Workspaces{' '}
            <span className="font-mono text-base font-normal text-[#66645C] dark:text-[#B9B3A4]">
              ({activeSemesterCourses.length} Registered)
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLocalCourseToEdit(null);
              setIsCustomFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#171714] dark:text-[#F7F3E8] hover:text-[#C9A227] bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#C9A227] dark:text-[#D4AF37]" />
            <span>Add Course</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#171714] dark:text-[#F7F3E8] hover:text-[#C9A227] bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#C9A227] dark:text-[#D4AF37]" />
            <span className="hidden sm:inline">Manage All</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#66645C] dark:text-[#B9B3A4]" />
          </button>
        </div>
      </div>

      {/* 1. Empty State with Friendly Quick Registration Chips */}
      {activeSemesterCourses.length === 0 ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] shadow-2xs space-y-6">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 border border-[#C9A227]/30 text-[#C9A227] dark:text-[#D4AF37] flex items-center justify-center shadow-2xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#171714] dark:text-[#F7F3E8]">
              Ready for Semester 7 Course Registration
            </h3>
            <p className="text-xs text-[#66645C] dark:text-[#B9B3A4] leading-relaxed">
              Begin your active semester chapter by adding your registered courses. Select from common IT Batch 3 courses or create a custom one.
            </p>
          </div>

          {/* Quick Onboarding Chips */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66645C] dark:text-[#B9B3A4] block text-center">
              Suggested Semester 7 Curricular Modules
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {suggestedCourses.map((item) => (
                <div
                  key={item.code}
                  className="p-3.5 rounded-2xl bg-[#FBF7E8]/70 dark:bg-[#171714] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#C9A227] dark:text-[#D4AF37]">
                        {item.code}
                      </span>
                      <span className="text-[10px] font-mono text-[#66645C] dark:text-[#B9B3A4]">
                        {item.ch} CH
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#171714] dark:text-[#F7F3E8] line-clamp-2 leading-snug">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#66645C] dark:text-[#B9B3A4] truncate">
                      {item.lecturer}
                    </p>
                  </div>

                  <button
                    disabled={isAddingSuggested}
                    onClick={() => handleQuickAddSuggested(item)}
                    className="w-full py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#B79122] text-[#171714] text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Register Module</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                setLocalCourseToEdit(null);
                setIsCustomFormOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171714] dark:bg-[#F7F3E8] text-[#FFFDF5] dark:text-[#171714] hover:bg-[#C9A227] dark:hover:bg-[#C9A227] hover:text-[#171714] text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Register Custom Course Form</span>
            </button>
          </div>
        </div>
      ) : (
        /* 2. Registered Course Workspaces Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSemesterCourses.map((course) => {
            const nextTask = activities
              .filter((a) => a.courseId === course.id && a.status !== 'Completed' && !a.isArchived)
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

            return (
              <div
                key={course.id}
                onClick={() => handleOpenCourse(course.id)}
                className="group relative rounded-2xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] dark:hover:border-[#D4AF37] p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Top Code, CH, and Action Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#C9A227] dark:text-[#D4AF37] px-2.5 py-1 rounded-lg bg-[#F4E7A1]/30 dark:bg-[#756B35]/20 border border-[#C9A227]/30">
                      {course.code}
                    </span>
                    <span className="text-[11px] text-[#66645C] dark:text-[#B9B3A4] font-mono">
                      {course.creditHours} CH
                    </span>
                  </div>

                  {/* Quick Edit & Delete Buttons */}
                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditClick(e, course)}
                      title="Edit Course"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#C9A227] hover:bg-[#FBF7E8] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, course)}
                      title="Delete Course"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Course Name & Lecturer */}
                <div className="my-3 space-y-1.5">
                  <h3 className="font-editorial text-lg font-bold text-[#171714] dark:text-[#F7F3E8] group-hover:text-[#C9A227] dark:group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {course.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#66645C] dark:text-[#B9B3A4]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#66645C] dark:text-[#B9B3A4]" />
                      <span className="truncate">{course.lecturer || 'Faculty Lecturer'}</span>
                    </span>
                    {course.room && (
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <MapPin className="w-3 h-3 text-[#66645C] dark:text-[#B9B3A4]" />
                        <span>{course.room}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Next Deliverable indicator */}
                <div className="mb-3.5 p-2.5 rounded-xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF]/70 dark:border-[#3A372E]/70 text-xs">
                  {nextTask ? (
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#B7791F] dark:text-[#C28A2C] shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#66645C] dark:text-[#B9B3A4] block">
                          Next: {nextTask.type}
                        </span>
                        <p className="text-xs font-semibold text-[#171714] dark:text-[#F7F3E8] truncate mt-0.5">
                          {nextTask.title}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#6B7D45] dark:text-[#788B52]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">Deliverables on schedule</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="pt-3 border-t border-[#E8E1CF]/60 dark:border-[#3A372E]/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[11px] text-[#66645C] dark:text-[#B9B3A4]">Coursework Progress</span>
                    <span className="text-[11px] font-mono font-bold text-[#171714] dark:text-[#F7F3E8]">
                      {course.progressPercentage || 0}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#E8E1CF]/60 dark:bg-[#3A372E] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C9A227] dark:bg-[#D4AF37] transition-all duration-300"
                      style={{ width: `${course.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Local Modals for Add/Edit and Delete */}
      <CourseFormModal
        isOpen={isCustomFormOpen}
        onClose={() => {
          setIsCustomFormOpen(false);
          setLocalCourseToEdit(null);
        }}
        courseToEdit={localCourseToEdit}
        defaultSemesterId={currentSemester?.id}
      />

      <CourseDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setCourseToDelete(null);
        }}
        course={courseToDelete}
        onConfirmDelete={(id) => deleteCourse(id)}
        onConfirmArchive={(id) => softDeleteCourse(id)}
      />
    </div>
  );
};
