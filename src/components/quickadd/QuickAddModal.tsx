import React, { useState } from 'react';
import {
  Plus,
  BookOpen,
  Sparkles,
  CheckSquare,
  Target,
  FolderLock,
  X,
  Clock,
  Award,
  FileText
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { ActivityType, Priority, MemoryCategory, MemoryImportance } from '../../types';
import { Button } from '../ui/Button';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    student,
    courses,
    semesters,
    addCourse,
    addActivity,
    addMemory,
    addGoal,
    addTask,
    addDocument,
    addCourseNote,
  } = useAcademic();

  const [activeType, setActiveType] = useState<'activity' | 'memory' | 'course' | 'goal' | 'task' | 'note' | 'document'>('activity');

  // Activity fields
  const [actTitle, setActTitle] = useState('');
  const [actCourseId, setActCourseId] = useState(courses[0]?.id || '');
  const [actType, setActType] = useState<ActivityType>('Assignment');
  const [actDeadline, setActDeadline] = useState('2026-09-02T23:59:00');
  const [actPriority, setActPriority] = useState<Priority>('High');

  // Memory fields
  const [memTitle, setMemTitle] = useState('');
  const [memCategory, setMemCategory] = useState<MemoryCategory>('Achievement');
  const [memImportance, setMemImportance] = useState<MemoryImportance>('Milestone');
  const [memDesc, setMemDesc] = useState('');

  // Course fields
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseLecturer, setCourseLecturer] = useState('');
  const [courseCredits, setCourseCredits] = useState(3);
  const [courseSemesterId, setCourseSemesterId] = useState(semesters.find((s) => s.status === 'Active')?.id || semesters[0]?.id || '');

  // Goal fields
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<'GPA' | 'Skill' | 'Project' | 'Attendance' | 'Career' | 'Personal'>('GPA');

  // Task fields
  const [taskTitle, setTaskTitle] = useState('');

  // Note fields
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCourseId, setNoteCourseId] = useState(courses[0]?.id || '');
  const [noteContent, setNoteContent] = useState('');

  // Document fields
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'Transcript' | 'Certificate' | 'Student ID' | 'Registration' | 'Syllabus' | 'Letter' | 'Project' | 'Other'>('Certificate');

  if (!isQuickAddOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeType === 'activity') {
      const selectedCourse = courses.find((c) => c.id === actCourseId);
      if (!selectedCourse) return;

      addActivity({
        courseId: selectedCourse.id,
        courseCode: selectedCourse.code,
        courseName: selectedCourse.name,
        semesterId: selectedCourse.semesterId,
        title: actTitle,
        type: actType,
        deadline: actDeadline,
        priority: actPriority,
        maxScore: 20,
        weightPercentage: 10,
        status: 'Planned',
      });
    } else if (activeType === 'memory') {
      addMemory({
        studentId: student.studentId,
        title: memTitle,
        description: memDesc,
        category: memCategory,
        importance: memImportance,
        date: new Date().toISOString().split('T')[0],
        semesterNumber: student.currentSemesterNumber || 7,
        provenance: 'Personal Record',
        sourceNote: 'Quick added memory entry',
      });
    } else if (activeType === 'course') {
      addCourse({
        code: courseCode.toUpperCase(),
        name: courseName,
        creditHours: courseCredits,
        lecturer: courseLecturer || 'Faculty Lecturer',
        semesterId: courseSemesterId,
        status: 'Active',
        progressPercentage: 0,
        provenance: 'Personal Record',
        sourceNote: 'Quick added student course',
      });
    } else if (activeType === 'goal') {
      addGoal({
        title: goalTitle,
        category: goalCategory,
        targetSemester: student.currentSemesterNumber || 7,
        progressPercentage: 0,
        status: 'In Progress',
      });
    } else if (activeType === 'task') {
      addTask({
        title: taskTitle,
        priority: 'Normal',
        category: 'Self Study',
        status: 'Pending',
      });
    } else if (activeType === 'note') {
      const selCourse = courses.find((c) => c.id === noteCourseId) || courses[0];
      if (selCourse) {
        addCourseNote({
          courseId: selCourse.id,
          title: noteTitle,
          content: noteContent,
          tags: ['Lecture', 'Quick Note'],
        });
      }
    } else if (activeType === 'document') {
      addDocument({
        name: docName,
        type: docType,
        semesterNumber: student.currentSemesterNumber || 7,
        date: new Date().toISOString().split('T')[0],
        fileSize: '500 KB',
        provenance: 'Personal Record',
        sourceNote: 'Quick uploaded document',
      });
    }

    setIsQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#C9A227] dark:text-[#F4E7A1]" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Quick Add Record
            </h3>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'activity', label: 'Activity / Exam', icon: CheckSquare },
            { id: 'memory', label: 'Memory', icon: Sparkles },
            { id: 'course', label: 'Course', icon: BookOpen },
            { id: 'note', label: 'Course Note', icon: FileText },
            { id: 'goal', label: 'Goal', icon: Target },
            { id: 'task', label: 'Task', icon: Clock },
            { id: 'document', label: 'Document', icon: FolderLock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeType === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap border cursor-pointer ${
                  isActive
                    ? 'bg-[#C9A227] text-[#171714] border-[#C9A227] shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {activeType === 'activity' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course
                </label>
                <select
                  value={actCourseId}
                  onChange={(e) => setActCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assignment 4 or Midterm Review"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={actType}
                    onChange={(e) => setActType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Midterm">Midterm Exam</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Project">Project</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Lab">Lab</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={actPriority}
                    onChange={(e) => setActPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={actDeadline}
                  onChange={(e) => setActDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                />
              </div>
            </>
          )}

          {activeType === 'memory' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Completed Compiler Lab"
                  value={memTitle}
                  onChange={(e) => setMemTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={memCategory}
                    onChange={(e) => setMemCategory(e.target.value as MemoryCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Achievement">Achievement</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Course Completion">Course Memory</option>
                    <option value="Personal Reflection">Personal Reflection</option>
                    <option value="Event">Academic Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Significance
                  </label>
                  <select
                    value={memImportance}
                    onChange={(e) => setMemImportance(e.target.value as MemoryImportance)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Milestone">Milestone</option>
                    <option value="Important">Important</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Narrative
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Capture details..."
                  value={memDesc}
                  onChange={(e) => setMemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>
            </>
          )}

          {activeType === 'course' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT 401"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono uppercase"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lecturer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ahmed"
                    value={courseLecturer}
                    onChange={(e) => setCourseLecturer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credit Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {activeType === 'goal' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Score 3.80+ GPA in Semester 7"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                >
                  <option value="GPA">Target GPA</option>
                  <option value="Skill">Technical Skill</option>
                  <option value="Project">Capstone / Project</option>
                  <option value="Attendance">Attendance</option>
                  <option value="Career">Career & Internships</option>
                  <option value="Personal">Personal Milestone</option>
                </select>
              </div>
            </>
          )}

          {activeType === 'task' && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Task Description
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Revise algorithm notes for quiz"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
              />
            </div>
          )}

          {activeType === 'note' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course
                </label>
                <select
                  value={noteCourseId}
                  onChange={(e) => setNoteCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Transactions & 2PC"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Markdown Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Key concepts, definitions, formulas..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono text-xs"
                />
              </div>
            </>
          )}

          {activeType === 'document' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S6 Official Transcript Slip"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                >
                  <option value="Transcript">Transcript Slip</option>
                  <option value="Certificate">Certificate of Distinction</option>
                  <option value="Student ID">Student ID Copy</option>
                  <option value="Registration">Course Registration Card</option>
                  <option value="Syllabus">Curriculum Syllabus</option>
                  <option value="Letter">Academic Letter</option>
                  <option value="Project">Project Report</option>
                  <option value="Other">Other Document</option>
                </select>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="indigo" type="submit">
              Save Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
