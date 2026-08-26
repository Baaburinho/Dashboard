import React, { useRef } from 'react';
import {
  Download,
  Printer,
  FileSpreadsheet,
  X,
  Award,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const AcademicExportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    student,
    semesters,
    courses,
    cgpa,
    completedCredits,
    totalRequiredCredits,
    exportDataJSON,
  } = useAcademic();

  const printRef = useRef<HTMLDivElement>(null);

  if (!isExportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'Course Code,Course Name,Semester,Credit Hours,Lecturer,Grade,Grade Point,Status\n';
    courses.forEach((c) => {
      const sem = semesters.find((s) => s.id === c.semesterId);
      csvContent += `"${c.code}","${c.name}","${sem?.name || ''}",${c.creditHours},"${c.lecturer}","${c.grade || ''}",${c.gradePoint || ''},"${c.status}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PAOS_Academic_Journey_${student.studentId}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PAOS_Academic_Archive_${student.studentId}.json`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#C9A227]" />
            <h3 className="text-xl font-extrabold text-slate-900">
              PAOS Academic Journey Report
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#C9A227] hover:bg-[#9B7A1D] text-[#171714] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>JSON Archive</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Printable Academic Journey Document */}
        <div ref={printRef} className="space-y-6 print:space-y-4">
          {/* Header & Crest */}
          <div className="text-center space-y-1 pb-4 border-b border-slate-200">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E7A1] border border-[#E8E1CF] text-xs font-bold text-[#9B7A1D] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Academic Record Summary</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 pt-2">
              {student.university}
            </h1>
            <p className="text-xs text-slate-500">
              {student.faculty} · {student.program} (Batch 3)
            </p>
          </div>

          {/* Student Identity Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Student ID</span>
              <span className="font-mono font-bold text-[#C9A227] text-sm">{student.studentId}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Cumulative CGPA</span>
              <span className="font-mono font-extrabold text-slate-900 text-sm">{cgpa.toFixed(2)} / 4.00</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Credits Cleared</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{completedCredits} / {totalRequiredCredits} CH</span>
            </div>
          </div>

          {/* Chapters & Course Grades Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Curriculum Semester Ledger
            </h3>

            <div className="space-y-4">
              {semesters.map((sem) => {
                const semCourses = courses.filter((c) => c.semesterId === sem.id && !c.isArchived);

                return (
                  <div key={sem.id} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sem.name}</span>
                        <span className="text-slate-400 font-mono">({sem.academicYear})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {sem.academicRank && (
                          <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px]">
                            {sem.academicRank}
                          </span>
                        )}
                        <span className="font-mono font-bold text-slate-900">
                          {sem.gpa !== undefined ? `GPA: ${sem.gpa.toFixed(2)}` : 'Active'}
                        </span>
                      </div>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/60 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-4">Code</th>
                          <th className="py-2 px-4">Course Name</th>
                          <th className="py-2 px-3">Credits</th>
                          <th className="py-2 px-3">Lecturer</th>
                          <th className="py-2 px-3">Grade</th>
                          <th className="py-2 px-3 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {semCourses.map((c) => (
                          <tr key={c.id}>
                            <td className="py-2 px-4 font-mono font-bold text-[#C9A227]">{c.code}</td>
                            <td className="py-2 px-4 font-medium text-slate-900">{c.name}</td>
                            <td className="py-2 px-3 font-mono">{c.creditHours} CH</td>
                            <td className="py-2 px-3 text-slate-500">{c.lecturer}</td>
                            <td className="py-2 px-3 font-mono font-bold">{c.grade || '—'}</td>
                            <td className="py-2 px-3 font-mono text-right font-bold">{c.gradePoint !== undefined ? c.gradePoint.toFixed(1) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Clearance */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Generated from Personal Academic OS (PAOS v2.0)</span>
            <span className="font-mono">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
