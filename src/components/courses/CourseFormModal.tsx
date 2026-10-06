import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Award,
  User,
  MapPin,
  Clock,
  Sparkles,
  Calculator,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Course } from '../../types';
import { Button } from '../ui/Button';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: Course | null;
  defaultSemesterId?: string;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  courseToEdit,
  defaultSemesterId,
}) => {
  const { semesters, addCourse, updateCourse, currentSemester } = useAcademic();

  const isEditing = !!courseToEdit;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [creditHours, setCreditHours] = useState(3);
  const [semesterId, setSemesterId] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [room, setRoom] = useState('');
  const [schedule, setSchedule] = useState('');
  const [status, setStatus] = useState<Course['status']>('Active');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [totalScore, setTotalScore] = useState<number | ''>('');
  const [grade, setGrade] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (courseToEdit) {
      setCode(courseToEdit.code || '');
      setName(courseToEdit.name || '');
      setCreditHours(courseToEdit.creditHours || 3);
      setSemesterId(courseToEdit.semesterId || defaultSemesterId || currentSemester?.id || 'sem-7');
      setLecturer(courseToEdit.lecturer || '');
      setRoom(courseToEdit.room || '');
      setSchedule(courseToEdit.schedule || '');
      setStatus(courseToEdit.status || 'Active');
      setProgressPercentage(courseToEdit.progressPercentage || 0);
      setTotalScore(courseToEdit.totalScore ?? '');
      setGrade(courseToEdit.grade || '');
    } else {
      setCode('');
      setName('');
      setCreditHours(3);
      setSemesterId(defaultSemesterId || currentSemester?.id || semesters[0]?.id || 'sem-7');
      setLecturer('');
      setRoom('');
      setSchedule('');
      setStatus('Active');
      setProgressPercentage(0);
      setTotalScore('');
      setGrade('');
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [courseToEdit, defaultSemesterId, currentSemester, semesters, isOpen]);

  if (!isOpen) return null;

  // Auto-suggest grade based on total score
  const handleScoreChange = (scoreVal: number | '') => {
    setTotalScore(scoreVal);
    if (typeof scoreVal === 'number') {
      if (scoreVal >= 90) setGrade('A+');
      else if (scoreVal >= 85) setGrade('A');
      else if (scoreVal >= 80) setGrade('B+');
      else if (scoreVal >= 75) setGrade('B');
      else if (scoreVal >= 70) setGrade('C+');
      else if (scoreVal >= 65) setGrade('C');
      else if (scoreVal >= 60) setGrade('D');
      else if (scoreVal >= 0) setGrade('F');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMsg('Course Code is required (e.g. IT 401).');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Course Name is required.');
      return;
    }
    if (!semesterId) {
      setErrorMsg('Please select a valid Semester.');
      return;
    }

    try {
      const payload: Partial<Course> = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        creditHours: Number(creditHours) || 3,
        semesterId,
        lecturer: lecturer.trim() || 'Faculty Department',
        room: room.trim() || undefined,
        schedule: schedule.trim() || undefined,
        status,
        progressPercentage: Number(progressPercentage) || 0,
        grade: grade.trim() || undefined,
        totalScore: totalScore !== '' ? Number(totalScore) : undefined,
      };

      if (isEditing && courseToEdit) {
        updateCourse(courseToEdit.id, payload);
        setSuccessMsg('Course successfully updated!');
      } else {
        addCourse({
          ...payload,
          semesterId: payload.semesterId!,
          code: payload.code!,
          name: payload.name!,
          creditHours: payload.creditHours!,
          lecturer: payload.lecturer!,
          status: payload.status!,
          progressPercentage: payload.progressPercentage!,
          provenance: 'Personal Record',
          sourceNote: 'Direct student workspace entry',
        } as Omit<Course, 'id'>);
        setSuccessMsg('New course registered successfully!');
      }

      setTimeout(() => {
        onClose();
      }, 400);
    } catch (err) {
      setErrorMsg('An error occurred while saving the course.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-xl my-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] shadow-2xl p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E1CF] dark:border-[#3A372E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#C9A227]/15 dark:bg-[#C9A227]/20 text-[#C9A227] dark:text-[#F4E7A1]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-editorial text-[#171714] dark:text-[#F7F3E8]">
                {isEditing ? `Edit Course — ${courseToEdit.code}` : 'Register New University Course'}
              </h3>
              <p className="text-xs text-[#66645C] dark:text-[#B9B3A4]">
                {isEditing
                  ? 'Update syllabus, lecturer, schedule, credits, or performance score.'
                  : 'Add a new academic course workspace to your degree program.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#66645C] hover:text-[#171714] dark:hover:text-[#F7F3E8] hover:bg-[#FBF7E8] dark:hover:bg-[#25241D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Course Code & Credit Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. IT 401"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FBF7E8]/60 dark:bg-[#171714] text-[#171714] dark:text-[#F7F3E8] font-mono font-bold focus:border-[#C9A227] outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                Course Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Advanced Artificial Intelligence"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FBF7E8]/60 dark:bg-[#171714] text-[#171714] dark:text-[#F7F3E8] font-medium focus:border-[#C9A227] outline-none"
              />
            </div>
          </div>

          {/* Row 2: Semester, Credits, & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                Academic Semester *
              </label>
              <select
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FBF7E8]/60 dark:bg-[#171714] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
              >
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                Credit Hours (CH)
              </label>
              <select
                value={creditHours}
                onChange={(e) => setCreditHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FBF7E8]/60 dark:bg-[#171714] text-[#171714] dark:text-[#F7F3E8] font-mono focus:border-[#C9A227] outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map((ch) => (
                  <option key={ch} value={ch}>
                    {ch} Credit Hours
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Course['status'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FBF7E8]/60 dark:bg-[#171714] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Planned">Planned</option>
                <option value="Registered">Registered</option>
              </select>
            </div>
          </div>

          {/* Row 3: Lecturer, Room, Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                Lecturer / Professor
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Abdirashid Nur"
                value={lecturer}
                onChange={(e) => setLecturer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FBF7E8]/60 dark:bg-[#171714] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                Room / Lab
              </label>
              <input
                type="text"
                placeholder="e.g. Hall B-204 / Lab 2"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FBF7E8]/60 dark:bg-[#171714] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                Weekly Schedule
              </label>
              <input
                type="text"
                placeholder="e.g. Sun & Tue · 08:30 AM"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FBF7E8]/60 dark:bg-[#171714] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
              />
            </div>
          </div>

          {/* Row 4: Performance & Scoring (Score, Grade, Progress) */}
          <div className="p-4 rounded-2xl bg-[#FBF7E8]/40 dark:bg-[#171714]/60 border border-[#E8E1CF]/80 dark:border-[#3A372E] space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227] block">
              Grading & Semester Progress
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                  Total Score / Marks (100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 88"
                  value={totalScore}
                  onChange={(e) => handleScoreChange(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFFFF] dark:bg-[#1E1D19] text-[#171714] dark:text-[#F7F3E8] font-mono font-bold focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                  Letter Grade
                </label>
                <input
                  type="text"
                  placeholder="e.g. A, B+, B, C+"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFFFF] dark:bg-[#1E1D19] text-[#171714] dark:text-[#F7F3E8] font-mono font-bold focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171714] dark:text-[#F7F3E8] mb-1">
                  Progress Percentage ({progressPercentage}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={(e) => setProgressPercentage(Number(e.target.value))}
                  className="w-full mt-2 accent-[#C9A227] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#E8E1CF] dark:border-[#3A372E] flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="indigo" type="submit" icon={<Save className="w-3.5 h-3.5" />}>
              {isEditing ? 'Save Course Updates' : 'Register Course Workspace'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
