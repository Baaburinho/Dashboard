import React, { useState } from 'react';
import {
  GraduationCap,
  Shield,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  Quote as QuoteIcon,
  Sun,
  Moon,
  Compass,
  CheckCircle2,
  X,
  BookOpen,
  CloudCheck
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { getDailyQuote } from '../../utils/quoteEngine';
import { Logo } from '../layout/Logo';
import { Button } from '../ui/Button';

export const LandingGateway: React.FC = () => {
  const {
    quotes,
    student,
    loginAsStudent,
    loginAsAdmin,
    isDarkMode,
    setIsDarkMode,
  } = useAcademic();

  const dailyQuote = getDailyQuote(quotes);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Student form state
  const [studentIdInput, setStudentIdInput] = useState(student.studentId || 'CIS231475');
  const [studentPasswordInput, setStudentPasswordInput] = useState('academic2026');
  const [studentError, setStudentError] = useState('');

  // Admin form state
  const [adminIdInput, setAdminIdInput] = useState('admin');
  const [adminPasswordInput, setAdminPasswordInput] = useState('admin2026');
  const [adminError, setAdminError] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');
    const ok = loginAsStudent(studentIdInput, studentPasswordInput);
    if (!ok) {
      setStudentError('Invalid Student ID or password. Use CIS231475.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const ok = loginAsAdmin(adminIdInput, adminPasswordInput);
    if (!ok) {
      setAdminError('Invalid Admin credentials. Use admin / admin2026.');
    }
  };

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* 1. Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* 2. Main Entry Gateway Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16 max-w-4xl mx-auto w-full text-center space-y-8">
        {/* University Sub-Brand Mark */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 border border-[#E8E1CF] dark:border-[#E8E1CF]/18 text-xs font-semibold text-[#9B7A1D] dark:text-[#F4E7A1] shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>{student.university || 'Zamzam University of Science and Technology'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Personal Academic OS
          </h1>

          <p className="text-xs sm:text-sm text-[#66645C] dark:text-[#E8E1CF]/70 tracking-wider font-semibold uppercase">
            Personal Academic Operating System · Student Portal
          </p>
        </div>

        {/* Daily Motivation Quote Engine */}
        <div className="w-full max-w-2xl relative rounded-3xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] p-6 sm:p-8 shadow-xs text-left space-y-4 overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#C9A227]/5 dark:bg-[#C9A227]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#C9A227] dark:text-[#D4AF37] border border-[#C9A227]/30">
                Daily Motivation · {dailyQuote.category}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#66645C] dark:text-[#B9B3A4]">
              {todayDateFormatted}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#C9A227] dark:text-[#F4E7A1] shrink-0">
              <QuoteIcon className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <p className="text-lg sm:text-xl font-bold font-editorial text-[#171714] dark:text-[#F7F3E8] leading-snug">
                “{dailyQuote.quote}”
              </p>
              <p className="text-xs font-semibold text-[#C9A227] dark:text-[#D4AF37] font-mono">
                — {dailyQuote.author}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8E1CF] dark:border-[#3A372E] flex items-center justify-between text-[11px] text-[#66645C] dark:text-[#B9B3A4]">
            <span>Personal Scholarly Archive</span>
            <span className="flex items-center gap-1 text-[#6B7D45] dark:text-[#F4E7A1] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Local & Cloud Sync
            </span>
          </div>
        </div>

        {/* Focused Student Portal Card */}
        <div className="w-full max-w-2xl text-left">
          <div
            onClick={() => setIsStudentModalOpen(true)}
            className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4.5">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-[#C9A227] via-[#F4E7A1] to-[#9B7A1D] shadow-sm">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#171714]">
                    <img
                      src={student.avatarUrl || '/mohamud.jpg'}
                      alt={student.fullName}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#171714] text-[#C9A227] border border-[#C9A227]">
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-editorial text-[#171714] dark:text-[#F7F3E8]">
                    {student.fullName}
                  </h2>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#C9A227] dark:text-[#D4AF37] border border-[#C9A227]/30">
                    {student.studentId}
                  </span>
                </div>
                <p className="text-xs text-[#66645C] dark:text-[#B9B3A4]">
                  {student.university} · Semester {student.currentSemesterNumber} Candidate
                </p>
                <p className="text-[11px] text-[#6B7D45] dark:text-[#F4E7A1] font-medium flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B7D45] dark:bg-[#F4E7A1] animate-pulse" />
                  <span>{student.classBatch} · {student.academicStanding}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsStudentModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#171714] dark:bg-[#F7F3E8] text-[#FFFDF5] dark:text-[#171714] hover:bg-[#C9A227] dark:hover:bg-[#C9A227] hover:text-[#171714] dark:hover:text-[#171714] text-xs font-bold transition-all shadow-sm group-hover:shadow-md shrink-0 cursor-pointer"
            >
              <span>Enter Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-[#E8E1CF] dark:border-[#3A372E] py-6 px-4 text-center text-xs text-[#66645C] dark:text-[#B9B3A4] space-y-1">
        <p className="font-bold text-[#171714] dark:text-[#F7F3E8]">
          Zamzam University of Science and Technology
        </p>
        <p className="text-[11px]">
          Faculty of Computer Science & Information Technology · Department of IT (Batch 3)
        </p>
        <p className="text-[10px] font-mono text-[#66645C] dark:text-[#B9B3A4] pt-1">
          PAOS · Personal Academic Operating System
        </p>
      </footer>

      {/* Student Login Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#C9A227] dark:text-[#F4E7A1]" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Student Portal Sign In
                </h3>
              </div>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-3.5 text-xs">
              {studentError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  {studentError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student ID Number
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. CIS231475"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={studentPasswordInput}
                    onChange={(e) => setStudentPasswordInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
              </div>

              <Button
                variant="indigo"
                type="submit"
                className="w-full py-2.5 mt-2"
              >
                <span>Enter Personal Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Administration Access
                </h3>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-3.5 text-xs">
              {adminError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  {adminError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Identifier / Email
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={adminIdInput}
                    onChange={(e) => setAdminIdInput(e.target.value)}
                    placeholder="e.g. admin or admin@zamzam.edu.so"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <Button
                variant="success"
                type="submit"
                className="w-full py-2.5 mt-2"
              >
                <span>Unlock Management Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
