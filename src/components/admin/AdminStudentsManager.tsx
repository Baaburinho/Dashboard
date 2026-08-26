import React, { useState } from 'react';
import {
  Users,
  Edit2,
  CheckCircle2,
  Lock,
  Building,
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const AdminStudentsManager: React.FC = () => {
  const { student, updateStudent } = useAcademic();

  const [fullName, setFullName] = useState(student.fullName);
  const [studentId, setStudentId] = useState(student.studentId);
  const [program, setProgram] = useState(student.program);
  const [faculty, setFaculty] = useState(student.faculty);
  const [department, setDepartment] = useState(student.department || 'IT');
  const [classBatch, setClassBatch] = useState(student.classBatch || 'Information Technology Batch 3');
  const [period, setPeriod] = useState(student.period || 'Second · 2025–2026');
  const [university, setUniversity] = useState(student.university || 'Zamzam University of Science and Technology');
  const [totalCredits, setTotalCredits] = useState(student.totalRequiredCredits);
  const [email, setEmail] = useState(student.email || 'mohamud.adow@zamzam.edu.so');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      fullName,
      studentId,
      program,
      faculty,
      department,
      classBatch,
      period,
      university,
      totalRequiredCredits: totalCredits,
      email,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        eyebrow="Student Records Registry & Canonical Profile"
        eyebrowIcon={<Users className="w-4 h-4 text-[#6B7D45] dark:text-[#788B52]" />}
        title="Student Identity & University Enrollment"
        description="Canonical student enrollment profile for Zamzam University of Science and Technology. Governs academic transcript headers and degree clearance ownership."
      />

      {/* Profile Overview Card */}
      <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E8E1CF] dark:border-[#3A372E]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] dark:text-[#D4AF37] font-editorial text-2xl font-bold">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#C9A227] dark:text-[#D4AF37] px-2 py-0.5 rounded bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E]">
                  {student.studentId}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6B7D45]/15 dark:bg-[#788B52]/20 text-[#6B7D45] dark:text-[#788B52] border border-[#6B7D45]/30">
                  Active Scholar
                </span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#171714] dark:text-[#F7F3E8] mt-1">
                {student.fullName}
              </h2>
              <p className="text-xs text-[#66645C] dark:text-[#B9B3A4]">
                {student.university} · {student.department}
              </p>
            </div>
          </div>

          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-xs text-[#6B7D45] dark:text-[#788B52] font-semibold bg-[#6B7D45]/15 px-3 py-1 rounded-full border border-[#6B7D45]/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Profile Updated & Logged
            </span>
          )}
        </div>

        {/* Canonical Identity Details Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#6B7D45] outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                Student ID Number (Primary Key)
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#6B7D45] outline-none font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                University Name
              </label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#6B7D45] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                Degree Program
              </label>
              <input
                type="text"
                required
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#6B7D45] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                Department
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#6B7D45] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                Class / Batch
              </label>
              <input
                type="text"
                required
                value={classBatch}
                onChange={(e) => setClassBatch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#6B7D45] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                Academic Period
              </label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#6B7D45] outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                Faculty / School
              </label>
              <input
                type="text"
                required
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#6B7D45] outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                Required Graduation Credits
              </label>
              <input
                type="number"
                required
                value={totalCredits}
                onChange={(e) => setTotalCredits(parseInt(e.target.value) || 120)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#6B7D45] outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8E1CF]/50 dark:border-[#3A372E]/50 flex justify-end">
            <Button variant="primary" type="submit">
              Save Canonical Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
