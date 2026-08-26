import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  Plus,
  CalendarCheck,
  Award,
  Sparkles,
  Trash2,
  Edit3,
  Sliders,
  Calculator,
  X
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Activity, CourseNote, AssessmentScheme } from '../../types';
import { Button } from '../ui/Button';

export const CourseWorkspace: React.FC = () => {
  const {
    courses,
    semesters,
    activities,
    courseNotes,
    selectedCourseId,
    setSelectedCourseId,
    setActiveTab,
    updateCourse,
    updateCourseAssessmentScheme,
    addActivity,
    toggleActivityComplete,
    deleteActivity,
    addCourseNote,
    updateCourseNote,
    deleteCourseNote,
  } = useAcademic();

  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'activities' | 'notes' | 'attendance' | 'grades'>('overview');

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const semester = semesters.find((s) => s.id === course?.semesterId);
  const courseActivities = activities.filter((a) => a.courseId === course?.id && !a.isArchived);
  const notes = courseNotes.filter((n) => n.courseId === course?.id);

  const defaultScheme: AssessmentScheme = course?.assessmentScheme || {
    courseworkWeight: 35,
    midtermWeight: 25,
    labWeight: 10,
    finalWeight: 30,
  };

  const [cwWeight, setCwWeight] = useState(defaultScheme.courseworkWeight);
  const [midWeight, setMidWeight] = useState(defaultScheme.midtermWeight);
  const [labWeight, setLabWeight] = useState(defaultScheme.labWeight);
  const [finalWeight, setFinalWeight] = useState(defaultScheme.finalWeight);
  const [schemeSaved, setSchemeSaved] = useState(false);

  // New activity modal
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actType, setActType] = useState<Activity['type']>('Assignment');
  const [actDeadline, setActDeadline] = useState('2026-09-05T23:59:00');
  const [actPriority, setActPriority] = useState<Activity['priority']>('Normal');
  const [actMaxScore, setActMaxScore] = useState(20);
  const [actWeight, setActWeight] = useState(10);
  const [actDesc, setActDesc] = useState('');

  // New Note modal
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('Lecture, Concept, Notes');

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p className="text-xs text-slate-500">Course not found.</p>
        <button
          onClick={() => setActiveTab('courses')}
          className="mt-3 text-xs text-[#C9A227] font-semibold"
        >
          Back to Course Directory
        </button>
      </div>
    );
  }

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    addActivity({
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      semesterId: course.semesterId,
      title: actTitle,
      type: actType,
      deadline: actDeadline,
      status: 'Planned',
      priority: actPriority,
      maxScore: actMaxScore,
      weightPercentage: actWeight,
      description: actDesc,
    });

    setActTitle('');
    setActDesc('');
    setIsAddActivityOpen(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    addCourseNote({
      courseId: course.id,
      title: noteTitle,
      content: noteContent,
      tags: noteTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNoteTitle('');
    setNoteContent('');
    setIsAddNoteOpen(false);
  };

  const handleSaveScheme = (e: React.FormEvent) => {
    e.preventDefault();
    const scheme: AssessmentScheme = {
      courseworkWeight: cwWeight,
      midtermWeight: midWeight,
      labWeight: labWeight,
      finalWeight: finalWeight,
    };
    updateCourseAssessmentScheme(course.id, scheme);
    setSchemeSaved(true);
    setTimeout(() => setSchemeSaved(false), 2500);
  };

  const attendancePercentage = course.attendanceTotal
    ? Math.round(((course.attendancePresent || 0) / course.attendanceTotal) * 100)
    : 92;

  const totalWeight = cwWeight + midWeight + labWeight + finalWeight;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('courses')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#C9A227] dark:hover:text-[#F4E7A1] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Courses</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border border-[#E8E1CF] dark:border-[#E8E1CF]/18">
            {semester?.name || 'Academic'}
          </span>
        </div>
      </div>

      {/* Course Hero Header */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C9A227]/5 dark:bg-[#C9A227]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C9A227] dark:text-[#F4E7A1] px-2.5 py-0.5 rounded-full bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 border border-[#E8E1CF] dark:border-[#E8E1CF]/18">
                {course.code}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {course.creditHours} Credit Hours
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {course.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {course.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {course.lecturer}
              </span>
              {course.room && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                  {course.room}
                </span>
              )}
              {course.schedule && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {course.schedule}
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 font-medium block">Progress</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {course.progressPercentage}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 font-medium block">Attendance</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {attendancePercentage}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 font-medium block">Grade</span>
              <span className="text-xl font-extrabold text-amber-500">
                {course.grade || 'A'}
              </span>
            </div>
          </div>
        </div>

        {/* Course Workspace Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Overview & Syllabus' },
            { id: 'activities', label: `Activities & Deliverables (${courseActivities.length})` },
            { id: 'notes', label: `Lecture Notes (${notes.length})` },
            { id: 'attendance', label: 'Attendance Log' },
            { id: 'grades', label: 'Assessment Scheme' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabSub(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
                activeTabSub === tab.id
                  ? 'bg-[#C9A227] text-[#171714] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview & Syllabus */}
      {activeTabSub === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Course Syllabus & Objectives
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {course.syllabus ||
                'Covers modern core concepts, architectural models, benchmark evaluations, practical implementations, and theoretical examination topics.'}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2.5">
                Key Learning Outcomes
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Master industry-standard design paradigms and formal analytical methods.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Implement full lifecycle lab assignments and present architectural evaluations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Perform rigorous testing, benchmarking, and maintain reproducible documentation.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Course Information
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Course Code</span>
                <span className="font-mono font-bold text-[#C9A227] dark:text-[#F4E7A1]">{course.code}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Credit Hours</span>
                <span className="font-semibold text-slate-900 dark:text-white">{course.creditHours} CH</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Lecturer</span>
                <span className="text-slate-900 dark:text-white font-medium">{course.lecturer}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Room</span>
                <span className="text-slate-900 dark:text-white">{course.room || 'Main Hall'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Schedule</span>
                <span className="text-slate-900 dark:text-white">{course.schedule || 'Scheduled'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Activities & Deliverables */}
      {activeTabSub === 'activities' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Assessments, Assignments & Exams ({courseActivities.length})
            </h3>
            <Button
              variant="indigo"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddActivityOpen(true)}
            >
              Add Activity
            </Button>
          </div>

          {courseActivities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No activities listed for this course yet.
            </div>
          ) : (
            <div className="space-y-3">
              {courseActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleActivityComplete(act.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        act.status === 'Completed'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-[#C9A227]'
                      }`}
                    >
                      {act.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {act.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {act.type}
                        </span>
                      </div>
                      {act.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {act.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span>Due: {new Date(act.deadline).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>Weight: {act.weightPercentage || 10}%</span>
                        {act.score !== undefined && (
                          <>
                            <span>·</span>
                            <span className="font-bold text-amber-500">
                              Score: {act.score} / {act.maxScore}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteActivity(act.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Lecture Notes */}
      {activeTabSub === 'notes' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Markdown Lecture Notes & Concepts ({notes.length})
            </h3>
            <Button
              variant="indigo"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddNoteOpen(true)}
            >
              Write Note
            </Button>
          </div>

          {notes.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No lecture notes written for this course yet. Capture lecture insights, algorithms, and formulas.
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteCourseNote(note.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono leading-relaxed bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {note.content}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Attendance Log */}
      {activeTabSub === 'attendance' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Attendance Tracker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current Attendance: <strong>{course.attendancePresent || 14}</strong> / {course.attendanceTotal || 15} sessions ({attendancePercentage}%)
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Eligible for Final Exam
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>

          <div className="pt-3 flex gap-2.5">
            <Button
              variant="success"
              size="sm"
              onClick={() => {
                updateCourse(course.id, {
                  attendancePresent: (course.attendancePresent || 14) + 1,
                  attendanceTotal: (course.attendanceTotal || 15) + 1,
                });
              }}
            >
              + Log Present Today
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                updateCourse(course.id, {
                  attendanceTotal: (course.attendanceTotal || 15) + 1,
                });
              }}
            >
              Log Absence
            </Button>
          </div>
        </div>
      )}

      {/* Tab 5: Custom Assessment Scheme */}
      {activeTabSub === 'grades' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Course Assessment Weighting Scheme
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure exact weights for this course (Coursework, Midterm, Labs, Final Exam).
              </p>
            </div>
            {schemeSaved && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Scheme Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSaveScheme} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Coursework (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={cwWeight}
                  onChange={(e) => setCwWeight(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-base font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Midterm Exam (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={midWeight}
                  onChange={(e) => setMidWeight(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-base font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Practical Labs (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={labWeight}
                  onChange={(e) => setLabWeight(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-base font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Final Exam (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={finalWeight}
                  onChange={(e) => setFinalWeight(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-base font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs">
                <span className="text-slate-500">Total Scheme Weight: </span>
                <span className={`font-mono font-bold ${totalWeight === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {totalWeight}% {totalWeight !== 100 && '(Must sum to 100%)'}
                </span>
              </div>

              <Button
                variant="indigo"
                type="submit"
              >
                Save Course Assessment Scheme
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Activity */}
      {isAddActivityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Activity for {course.code}
              </h3>
              <button onClick={() => setIsAddActivityOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab 3: Replication Benchmark"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={actType}
                    onChange={(e) => setActType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Project">Project</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={actPriority}
                    onChange={(e) => setActPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={actDeadline}
                    onChange={(e) => setActDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={actMaxScore}
                    onChange={(e) => setActMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setIsAddActivityOpen(false)}>
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  Add Activity
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Note */}
      {isAddNoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Write Lecture Note for {course.code}
              </h3>
              <button onClick={() => setIsAddNoteOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus & Raft Protocol"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content (Markdown & Formulas)
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write formulas, algorithms, lecture takeaways..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setIsAddNoteOpen(false)}>
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  Save Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
