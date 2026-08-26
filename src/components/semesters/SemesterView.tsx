import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Edit2,
  BookOpen,
  Award,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Quote,
  X
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Semester, SemesterStatus, Course } from '../../types';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { checkSemesterIntegrity } from '../../utils/academicEngine';

export const SemesterView: React.FC = () => {
  const {
    semesters,
    courses,
    activities,
    memories,
    selectedSemesterId,
    setSelectedSemesterId,
    setSelectedCourseId,
    setActiveTab,
    addSemester,
    updateSemester,
    addCourse,
  } = useAcademic();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Active' | 'Planned'>('All');
  const [chapterTab, setChapterTab] = useState<'results' | 'activities' | 'memories'>('results');

  // Semester Modal state
  const [isNewSemesterModalOpen, setIsNewSemesterModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [newName, setNewName] = useState('Semester 8 (Electives & Final Capstone)');
  const [newNumber, setNewNumber] = useState(8);
  const [newYear, setNewYear] = useState('2026 / 2027');
  const [newStatus, setNewStatus] = useState<SemesterStatus>('Planned');
  const [newCredits, setNewCredits] = useState(12);
  const [newGpa, setNewGpa] = useState<number | undefined>(undefined);
  const [newRank, setNewRank] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newReflection, setNewReflection] = useState('');

  // Course Modal state
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [newCourseLecturer, setNewCourseLecturer] = useState('');
  const [newCourseRoom, setNewCourseRoom] = useState('');

  // Deduplicate and sort semesters
  const uniqueSemesters = React.useMemo(() => {
    const map = new Map<number, Semester>();
    semesters.forEach((s) => {
      if (!map.has(s.number) || (s.gpa !== undefined && !map.get(s.number)?.gpa)) {
        map.set(s.number, s);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.number - b.number);
  }, [semesters]);

  const filteredSemesters = uniqueSemesters.filter(
    (s) => statusFilter === 'All' || s.status === statusFilter
  );

  const activeSemesterDetail =
    uniqueSemesters.find((s) => s.id === selectedSemesterId) ||
    uniqueSemesters.find((s) => s.number === 7) ||
    uniqueSemesters[0];

  const semesterCourses = activeSemesterDetail
    ? courses.filter((c) => c.semesterId === activeSemesterDetail.id && !c.isArchived)
    : [];

  const semesterActivities = activeSemesterDetail
    ? activities.filter((a) => a.semesterId === activeSemesterDetail.id && !a.isArchived)
    : [];

  const semesterMemories = activeSemesterDetail
    ? memories.filter((m) => m.semesterNumber === activeSemesterDetail.number && !m.isArchived)
    : [];

  const integrity = checkSemesterIntegrity(activeSemesterDetail, courses);
  const displayTermGpa = integrity.gradedCoursesCount > 0
    ? integrity.calculatedGpa
    : (activeSemesterDetail?.gpa !== undefined ? activeSemesterDetail.gpa : undefined);

  // Calculate cumulative GPA up to this semester directly from course results
  const calculateCumulativeGpaUpTo = (semNum: number) => {
    const relevantCourses = courses.filter((c) => {
      if (c.isArchived || c.status !== 'Completed') return false;
      const sem = uniqueSemesters.find((s) => s.id === c.semesterId);
      return sem && sem.number <= semNum && c.gradePoint !== undefined && c.gradePoint !== null;
    });

    if (relevantCourses.length > 0) {
      let qPoints = 0;
      let totalCH = 0;
      for (const rc of relevantCourses) {
        const ch = rc.creditHours || 3;
        qPoints += (rc.gradePoint || 0) * ch;
        totalCH += ch;
      }
      if (totalCH > 0) {
        return (qPoints / totalCH).toFixed(2);
      }
    }

    const priorSems = uniqueSemesters.filter((s) => s.number <= semNum && s.status === 'Completed' && s.gpa !== undefined);
    if (priorSems.length === 0) return displayTermGpa ? displayTermGpa.toFixed(2) : '—';
    const totalCredits = priorSems.reduce((sum, s) => sum + (s.completedCredits || s.totalCredits), 0);
    const totalPoints = priorSems.reduce((sum, s) => sum + (s.gpa || 0) * (s.completedCredits || s.totalCredits), 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '—';
  };

  const handleSaveSemester = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSemester) {
      updateSemester(editingSemester.id, {
        name: newName.trim(),
        number: newNumber,
        academicYear: newYear,
        status: newStatus,
        totalCredits: newCredits,
        gpa: newGpa,
        academicRank: newRank || undefined,
        summaryNote: newSummary || undefined,
        reflectionQuote: newReflection || undefined,
      });
      setEditingSemester(null);
      setIsNewSemesterModalOpen(false);
    } else {
      const existing = semesters.find((s) => s.number === newNumber || s.name.trim().toLowerCase() === newName.trim().toLowerCase());
      if (existing) {
        updateSemester(existing.id, {
          name: newName.trim(),
          number: newNumber,
          academicYear: newYear,
          status: newStatus,
          totalCredits: newCredits,
          gpa: newGpa,
          academicRank: newRank || undefined,
          summaryNote: newSummary || undefined,
          reflectionQuote: newReflection || undefined,
        });
      } else {
        addSemester({
          number: newNumber,
          name: newName.trim(),
          academicYear: newYear,
          status: newStatus,
          totalCredits: newCredits,
          completedCredits: newStatus === 'Completed' ? newCredits : 0,
          gpa: newGpa,
          academicRank: newRank || undefined,
          summaryNote: newSummary || undefined,
          reflectionQuote: newReflection || undefined,
          startDate: '2027-02-01',
          endDate: '2027-06-30',
          isEditableSample: true,
        });
      }
      setIsNewSemesterModalOpen(false);
    }
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSemesterDetail || !newCourseCode.trim() || !newCourseName.trim()) return;

    addCourse({
      code: newCourseCode.trim().toUpperCase(),
      name: newCourseName.trim(),
      creditHours: newCourseCredits,
      lecturer: newCourseLecturer.trim() || 'Faculty Lecturer',
      semesterId: activeSemesterDetail.id,
      status: activeSemesterDetail.status === 'Completed' ? 'Completed' : 'Active',
      progressPercentage: 0,
      provenance: 'Personal Record',
      sourceNote: 'Course registered by student in Semester View',
    });

    setNewCourseCode('');
    setNewCourseName('');
    setNewCourseCredits(3);
    setNewCourseLecturer('');
    setNewCourseRoom('');
    setIsAddCourseModalOpen(false);
  };

  const handleEditClick = (sem: Semester) => {
    setEditingSemester(sem);
    setNewName(sem.name);
    setNewNumber(sem.number);
    setNewYear(sem.academicYear);
    setNewStatus(sem.status);
    setNewCredits(sem.totalCredits);
    setNewGpa(sem.gpa);
    setNewRank(sem.academicRank || '');
    setNewSummary(sem.summaryNote || '');
    setNewReflection(sem.reflectionQuote || '');
    setIsNewSemesterModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="Academic Journey & Chapter Archive"
        eyebrowIcon={<Compass className="w-4 h-4 text-[#C9A227]" />}
        title="The 8 Academic Chapters"
        description="Every semester is preserved as an immutable digital chapter complete with course results, GPA, honors, deliverables, and personal reflections."
        actions={
          <Button
            variant="indigo"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setEditingSemester(null);
              setIsNewSemesterModalOpen(true);
            }}
          >
            Add Chapter
          </Button>
        }
      />

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        {(['All', 'Completed', 'Active', 'Planned'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-[#C9A227] text-[#171714] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 3. 8 Semesters Roadmap Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSemesters.map((sem) => {
          const isSelected = activeSemesterDetail?.id === sem.id;
          const isS6Achievement = sem.number === 6;

          return (
            <div
              key={sem.id}
              onClick={() => setSelectedSemesterId(sem.id)}
              className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between relative shadow-2xs group ${
                isSelected
                  ? 'bg-[#FFFFFF] dark:bg-[#24231D] border-[#C9A227] dark:border-[#C9A227] ring-2 ring-[#C9A227]/20'
                  : 'bg-[#FFFFFF] dark:bg-[#24231D]/90 border-[#E8E1CF] dark:border-[#E8E1CF]/18 hover:border-[#C9A227]/50'
              }`}
            >
              {isS6Achievement && (
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold tracking-wide uppercase shadow-xs flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>Rank #2 Distinction</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                    Chapter {sem.number}
                  </span>
                  <span
                    className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                      sem.status === 'Completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : sem.status === 'Active'
                        ? 'bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border-[#E8E1CF] dark:border-[#E8E1CF]/18 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {sem.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2 group-hover:text-[#C9A227] dark:group-hover:text-[#F4E7A1] transition-colors">
                  {sem.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {sem.academicYear}
                </p>

                {sem.summaryNote && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {sem.summaryNote}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    Term GPA
                  </span>
                  <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                    {sem.gpa !== undefined ? sem.gpa.toFixed(2) : 'Active'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    Credits
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {sem.completedCredits || sem.totalCredits} CH
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Active Chapter Full Record */}
      {activeSemesterDetail && (
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
          {/* Chapter Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Academic Chapter {activeSemesterDetail.number}
                </span>
                {activeSemesterDetail.academicRank && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 flex items-center gap-1 shadow-2xs">
                    <Award className="w-3 h-3 text-amber-500" />
                    <span>Cohort {activeSemesterDetail.academicRank}</span>
                  </span>
                )}
                {activeSemesterDetail.provenance && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    <ShieldCheck className="w-3 h-3" />
                    {activeSemesterDetail.provenance}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5">
                {activeSemesterDetail.name} — Full Chapter Ledger
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeSemesterDetail.academicYear} · Status: <strong className="text-slate-900 dark:text-white">{activeSemesterDetail.status}</strong> · Term GPA:{' '}
                <strong className="text-[#C9A227] dark:text-[#F4E7A1] font-mono">
                  {displayTermGpa !== undefined ? displayTermGpa.toFixed(2) : 'In Progress'}
                </strong>
                {activeSemesterDetail.status === 'Completed' && (
                  <>
                    {' '}· Cumulative CGPA after this term:{' '}
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {calculateCumulativeGpaUpTo(activeSemesterDetail.number)}
                    </strong>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="indigo"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setNewCourseCode('');
                  setNewCourseName('');
                  setNewCourseCredits(3);
                  setNewCourseLecturer('');
                  setIsAddCourseModalOpen(true);
                }}
              >
                Add Course
              </Button>
              <Button
                variant="secondary"
                icon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => handleEditClick(activeSemesterDetail)}
              >
                Edit Chapter
              </Button>
            </div>
          </div>

          {/* Academic Integrity Cross-Record Validation Banner */}
          {integrity.hasConflict && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block text-sm">Academic Ledger Verification Note</span>
                <p className="leading-relaxed">{integrity.message}</p>
                <p className="text-[11px] font-mono">
                  Calculated GPA: <strong>{integrity.calculatedGpa.toFixed(2)} Term GPA</strong> derived from {integrity.gradedCoursesCount} examination grades.
                </p>
              </div>
            </div>
          )}

          {/* Chapter Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card padding="md">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                Chapter Courses
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white block mt-1">
                {semesterCourses.length} Subjects
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {activeSemesterDetail.completedCredits || activeSemesterDetail.totalCredits} Credit Hours
              </span>
            </Card>

            <Card padding="md">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                Semester GPA
              </span>
              <span className="text-2xl font-extrabold text-[#C9A227] dark:text-[#F4E7A1] block mt-1">
                {displayTermGpa !== undefined ? displayTermGpa.toFixed(2) : 'Active'}
              </span>
              <span className="text-[11px] text-slate-400">
                Scale: 4.0 Max
              </span>
            </Card>

            <Card padding="md">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                Cohort Ranking
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white block mt-1">
                {activeSemesterDetail.academicRank || 'Degree Candidate'}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {activeSemesterDetail.provenance === 'Verified' ? 'Official Faculty Award' : 'Personal Record'}
              </span>
            </Card>

            <Card padding="md">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                Preserved Memories
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">
                {semesterMemories.length} Entries
              </span>
              <span className="text-[11px] text-slate-400">
                In Memory Vault
              </span>
            </Card>
          </div>

          {/* Chapter Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
            <button
              onClick={() => setChapterTab('results')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                chapterTab === 'results'
                  ? 'bg-[#C9A227] text-[#171714] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Course Results ({semesterCourses.length})</span>
            </button>

            <button
              onClick={() => setChapterTab('activities')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                chapterTab === 'activities'
                  ? 'bg-[#C9A227] text-[#171714] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Activities & Deliverables ({semesterActivities.length})</span>
            </button>

            <button
              onClick={() => setChapterTab('memories')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                chapterTab === 'memories'
                  ? 'bg-[#C9A227] text-[#171714] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chapter Memories ({semesterMemories.length})</span>
            </button>
          </div>

          {/* TAB 1: Official Course Results Ledger */}
          {chapterTab === 'results' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Course Ledger & Examination Grades
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Official Academic Record
                </span>
              </div>

              {semesterCourses.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                  No courses registered for this chapter.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                      <tr>
                        <th className="py-3.5 px-4">Code</th>
                        <th className="py-3.5 px-4">Course Title</th>
                        <th className="py-3.5 px-3">Credit</th>
                        <th className="py-3.5 px-3">Midterm</th>
                        <th className="py-3.5 px-3">Activity</th>
                        <th className="py-3.5 px-3">Final</th>
                        <th className="py-3.5 px-3">Total</th>
                        <th className="py-3.5 px-3">Grade</th>
                        <th className="py-3.5 px-3">GP</th>
                        <th className="py-3.5 px-4 text-right">Workspace</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {semesterCourses.map((c) => (
                        <tr
                          key={c.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[#C9A227] dark:text-[#F4E7A1]">
                            {c.code}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                            <div>{c.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{c.lecturer}</div>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-500">
                            {c.creditHours} CH
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {c.midtermScore !== undefined ? `${c.midtermScore}/30` : '—'}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {c.activityScore !== undefined ? `${c.activityScore}/20` : '—'}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {c.finalScore !== undefined ? `${c.finalScore}/50` : '—'}
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                            {c.totalScore ? `${c.totalScore}/100` : '—'}
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-xs border ${
                                c.grade === 'A+' || c.grade === 'A'
                                  ? 'bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border-[#E8E1CF] dark:border-[#E8E1CF]/18'
                                  : c.grade === 'B+' || c.grade === 'B'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {c.grade || 'Active'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                            {c.gradePoint !== undefined ? c.gradePoint.toFixed(1) : '—'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedCourseId(c.id);
                                setActiveTab('course-detail');
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#C9A227] dark:text-[#F4E7A1] hover:underline cursor-pointer"
                            >
                              <span>Workspace</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Activities & Deliverables */}
          {chapterTab === 'activities' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Chapter Deliverables & Assessments
              </h3>

              {semesterActivities.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                  No activities recorded specifically for this chapter.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {semesterActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#C9A227] dark:text-[#F4E7A1]">
                          {act.courseCode}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                            {act.title}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Type: {act.type} · Due {act.deadline.split('T')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {act.score !== undefined && (
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {act.score} / {act.maxScore} pts
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                            act.status === 'Completed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700/60'
                          }`}
                        >
                          {act.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Chapter Memories */}
          {chapterTab === 'memories' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Preserved Reflections & Milestones
              </h3>

              {semesterMemories.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                  No memories recorded for this semester yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {semesterMemories.map((mem) => (
                    <div
                      key={mem.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border border-[#E8E1CF] dark:border-[#E8E1CF]/18">
                          {mem.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {mem.date}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {mem.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {mem.description}
                      </p>

                      {mem.sourceNote && (
                        <div className="pt-2 text-[10px] text-slate-400 italic border-t border-slate-200/60 dark:border-slate-700/60">
                          Source: {mem.sourceNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Semester Modal */}
      {isNewSemesterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingSemester ? 'Edit Chapter Record' : 'Add New Semester Chapter'}
              </h3>
              <button
                onClick={() => setIsNewSemesterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSemester} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester Number (1..10)
                  </label>
                  <input
                    type="number"
                    required
                    value={newNumber}
                    onChange={(e) => setNewNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025 / 2026"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as SemesterStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Active">Active</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Credits
                  </label>
                  <input
                    type="number"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Term GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.65"
                    value={newGpa !== undefined ? newGpa : ''}
                    onChange={(e) => setNewGpa(e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Rank
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rank #2"
                    value={newRank}
                    onChange={(e) => setNewRank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setIsNewSemesterModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  {editingSemester ? 'Save Changes' : 'Create Chapter'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-Context Add Course Modal */}
      {isAddCourseModalOpen && activeSemesterDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Course to {activeSemesterDetail.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {activeSemesterDetail.academicYear} · Personal Academic Ledger
                </p>
              </div>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT 402"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono uppercase font-bold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Security Architecture"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credits (CH)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={newCourseCredits}
                    onChange={(e) => setNewCourseCredits(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lecturer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ahmed"
                    value={newCourseLecturer}
                    onChange={(e) => setNewCourseLecturer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setIsAddCourseModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  Add Course to Chapter
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
