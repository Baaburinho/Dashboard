import React, { useState } from 'react';
import {
  Award,
  Edit3,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Course, RecordProvenance } from '../../types';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';

export const AdminResultsManager: React.FC = () => {
  const { semesters, courses, updateCourseResult } = useAcademic();

  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('sem-6');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Edit form state
  const [scoreInput, setScoreInput] = useState<number>(90);
  const [gradeInput, setGradeInput] = useState('A');
  const [gradePointInput, setGradePointInput] = useState<number>(4.0);
  const [provenanceInput, setProvenanceInput] = useState<RecordProvenance>('Verified');
  const [notesInput, setNotesInput] = useState('Verified Official Examination Result');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activeSemester = semesters.find((s) => s.id === selectedSemesterId) || semesters[0];
  const semesterCourses = courses.filter((c) => c.semesterId === selectedSemesterId && !c.isArchived);

  const filteredCourses = semesterCourses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setScoreInput(c.totalScore !== undefined ? c.totalScore : 85);
    setGradeInput(c.grade || 'A');
    setGradePointInput(c.gradePoint !== undefined ? c.gradePoint : 4.0);
    setProvenanceInput(c.provenance || 'Verified');
    setNotesInput(c.sourceNote || 'Official Semester Record Entry');
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    updateCourseResult(editingCourse.id, {
      totalScore: scoreInput,
      grade: gradeInput,
      gradePoint: gradePointInput,
      provenance: provenanceInput,
      sourceNote: notesInput,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditingCourse(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        eyebrow="Academic Gradebook & Results Registry"
        eyebrowIcon={<Award className="w-4 h-4 text-[#C9A227] dark:text-[#D4AF37]" />}
        title="Official Examination Results & Grade Registry"
        description="Review and publish verified academic grades, credit points, and examination scores across all 8 semesters. All edits trigger immutable audit log entries."
      />

      {/* Semester Selector Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#E8E1CF] dark:border-[#3A372E] text-xs">
        {semesters.map((s) => {
          const isActive = s.id === selectedSemesterId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSemesterId(s.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-[#6B7D45]/15 dark:bg-[#788B52]/20 text-[#6B7D45] dark:text-[#788B52] border-[#6B7D45]/40 font-semibold'
                  : 'border-transparent text-[#66645C] dark:text-[#B9B3A4] hover:text-[#171714] dark:hover:text-[#F7F3E8]'
              }`}
            >
              <span>{s.name}</span>
              {s.academicRank && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#C9A227] text-[#171714]">
                  {s.academicRank}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Semester Overview Banner */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#66645C] dark:text-[#B9B3A4]">
            Active Register
          </span>
          <h2 className="font-editorial text-xl font-bold text-[#171714] dark:text-[#F7F3E8]">
            {activeSemester?.name} ({activeSemester?.academicYear}) — Results Registry
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E]">
            <span className="text-[#66645C] dark:text-[#B9B3A4]">Term GPA: </span>
            <strong className="text-[#C9A227] dark:text-[#D4AF37]">
              {activeSemester?.gpa !== undefined ? activeSemester.gpa.toFixed(2) : 'Active'}
            </strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E]">
            <span className="text-[#66645C] dark:text-[#B9B3A4]">Courses: </span>
            <strong className="text-[#171714] dark:text-[#F7F3E8]">{semesterCourses.length}</strong>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF5] dark:bg-[#151513] border-b border-[#E8E1CF] dark:border-[#3A372E] text-[10px] font-semibold uppercase text-[#66645C] dark:text-[#B9B3A4]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Lecturer</th>
                <th className="py-3 px-4">Score (%)</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">GP</th>
                <th className="py-3 px-4">Provenance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1CF]/50 dark:divide-[#3A372E]/50">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-[#FFFDF5] dark:hover:bg-[#151513] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#C9A227] dark:text-[#D4AF37]">
                    {c.code}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#171714] dark:text-[#F7F3E8]">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#66645C] dark:text-[#B9B3A4]">
                    {c.creditHours} CH
                  </td>
                  <td className="py-3 px-4 text-[#66645C] dark:text-[#B9B3A4]">
                    {c.lecturer}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#171714] dark:text-[#F7F3E8]">
                    {c.totalScore !== undefined ? `${c.totalScore}%` : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono font-bold border ${
                        c.grade === 'A'
                          ? 'bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#171714] dark:text-[#F7F3E8] border-[#C9A227]/40'
                          : 'bg-[#E8E1CF]/40 dark:bg-[#3A372E] text-[#171714] dark:text-[#F7F3E8] border-[#E8E1CF] dark:border-[#3A372E]'
                      }`}
                    >
                      {c.grade || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#171714] dark:text-[#F7F3E8]">
                    {c.gradePoint !== undefined ? c.gradePoint.toFixed(1) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6B7D45]/15 dark:bg-[#788B52]/20 text-[#6B7D45] dark:text-[#788B52] border border-[#6B7D45]/30">
                      <ShieldCheck className="w-3 h-3" />
                      {c.provenance || 'Verified'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#6B7D45] text-xs text-[#171714] dark:text-[#F7F3E8] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#6B7D45] dark:text-[#788B52]" />
                      <span>Edit Result</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Result Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1CF] dark:border-[#3A372E]">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#171714] dark:text-[#F7F3E8]">
                  Edit Official Course Result
                </h3>
                <p className="text-xs text-[#66645C] dark:text-[#B9B3A4] font-mono mt-0.5">
                  {editingCourse.code} — {editingCourse.name}
                </p>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-1 rounded-lg text-[#66645C] dark:text-[#B9B3A4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="p-4 rounded-xl bg-[#6B7D45]/15 text-[#6B7D45] dark:text-[#788B52] border border-[#6B7D45]/30 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Result saved successfully! Audit event logged.</span>
              </div>
            ) : (
              <form onSubmit={handleSaveResult} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                      Final Score (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={scoreInput}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setScoreInput(val);
                        if (val >= 90) { setGradeInput('A'); setGradePointInput(4.0); }
                        else if (val >= 85) { setGradeInput('B+'); setGradePointInput(3.5); }
                        else if (val >= 80) { setGradeInput('B'); setGradePointInput(3.0); }
                        else if (val >= 75) { setGradeInput('C+'); setGradePointInput(2.5); }
                        else if (val >= 70) { setGradeInput('C'); setGradePointInput(2.0); }
                        else { setGradeInput('F'); setGradePointInput(0.0); }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                      Letter Grade
                    </label>
                    <select
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none font-mono font-bold"
                    >
                      <option value="A">A (Excellent)</option>
                      <option value="B+">B+ (Very Good)</option>
                      <option value="B">B (Good)</option>
                      <option value="C+">C+ (Satisfactory)</option>
                      <option value="C">C (Pass)</option>
                      <option value="D">D (Marginal Pass)</option>
                      <option value="F">F (Fail)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                      Grade Point
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4.0"
                      required
                      value={gradePointInput}
                      onChange={(e) => setGradePointInput(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                    Provenance / Verification State
                  </label>
                  <select
                    value={provenanceInput}
                    onChange={(e) => setProvenanceInput(e.target.value as RecordProvenance)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
                  >
                    <option value="Verified">Verified (Official Faculty Record)</option>
                    <option value="Personal Record">Personal Record</option>
                    <option value="Seeded">Seeded Template</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                    Source Note / Verification Details
                  </label>
                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="e.g. Official semester transcript sheet"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E1CF] dark:border-[#3A372E]">
                  <Button variant="secondary" type="button" onClick={() => setEditingCourse(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Publish Official Grade
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
