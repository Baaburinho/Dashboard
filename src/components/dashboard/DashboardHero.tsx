import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Plus,
  History,
  CheckCircle2,
  Target,
  Sparkles,
  Compass,
  Quote,
  Shuffle,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { getDailyQuote } from '../../utils/quoteEngine';

export const DashboardHero: React.FC = () => {
  const {
    student,
    semesters,
    currentSemester,
    urgentDeadlines,
    remainingCredits,
    setActiveTab,
    setIsQuickAddOpen,
    setSelectedSemesterId,
    quotes = [],
  } = useAcademic();

  const previousCompletedSemester = useMemo(() => {
    return semesters
      .filter((s) => s.status === 'Completed')
      .sort((a, b) => b.number - a.number)[0];
  }, [semesters]);

  const defaultQuote = useMemo(() => getDailyQuote(quotes), [quotes]);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState<number | null>(null);

  const currentDisplayQuote = useMemo(() => {
    if (activeQuoteIndex !== null && quotes.length > 0) {
      return quotes[activeQuoteIndex % quotes.length];
    }
    return defaultQuote;
  }, [activeQuoteIndex, quotes, defaultQuote]);

  const handleShuffleQuote = () => {
    if (quotes.length <= 1) return;
    const nextIdx = activeQuoteIndex === null
      ? Math.floor(Math.random() * quotes.length)
      : (activeQuoteIndex + 1) % quotes.length;
    setActiveQuoteIndex(nextIdx);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] p-6 sm:p-8 lg:p-9 shadow-sm space-y-6 overflow-hidden transition-all">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute -top-24 -right-16 w-80 h-80 bg-[#F4E7A1]/20 dark:bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-12 w-72 h-72 bg-[#C9A227]/10 dark:bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Row: Friendly Greeting & University Badges */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="space-y-3">
          {/* Top Pill Strip */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] text-xs font-semibold border border-[#E8E1CF] dark:border-[#3A372E] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#6B7D45] animate-pulse" />
              <span>Semester {student.currentSemesterNumber} · Active</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E7A1]/30 dark:bg-[#756B35]/30 text-[#171714] dark:text-[#F7F3E8] text-xs font-semibold border border-[#C9A227]/30">
              <Sparkles className="w-3 h-3 text-[#C9A227] dark:text-[#D4AF37]" />
              <span>Personal Academic Operating System</span>
            </span>

            <span className="text-xs text-[#66645C] dark:text-[#B9B3A4] font-mono hidden sm:inline">
              {currentDateFormatted}
            </span>
          </div>

          {/* Large Friendly Heading */}
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#171714] dark:text-[#F7F3E8] leading-tight tracking-tight">
              {getGreeting()}, <span className="text-[#C9A227] dark:text-[#D4AF37]">{student.fullName}</span>.
            </h1>
            <div className="text-xs sm:text-sm text-[#66645C] dark:text-[#B9B3A4] mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              {/* Bounded Loop Sliding University Name (strictly clipped between Z and y) */}
              <span
                className="relative inline-flex items-center overflow-hidden max-w-[280px] sm:max-w-[330px] md:max-w-[360px] align-middle py-0.5 [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]"
                title={student.university}
              >
                <span className="animate-university-marquee gap-6 font-bold text-[#171714] dark:text-[#F7F3E8] whitespace-nowrap">
                  <span className="shrink-0 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                    <span>{student.university}</span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                    <span>{student.university}</span>
                  </span>
                </span>
              </span>
              <span>·</span>
              <span>{student.faculty || 'Faculty of CS & IT'}</span>
              <span>·</span>
              <span>{student.classBatch || student.department}</span>
              <span>·</span>
              <span className="font-mono font-medium px-1.5 py-0.2 rounded bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E]">
                ID: {student.studentId}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 lg:pt-2">
          <button
            onClick={() => {
              if (currentSemester) {
                setSelectedSemesterId(currentSemester.id);
                setActiveTab('journey');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#171714] dark:text-[#F7F3E8] bg-[#FFFDF5] dark:bg-[#151513] hover:bg-[#F4E7A1]/30 dark:hover:bg-[#3A372E] border border-[#E8E1CF] dark:border-[#3A372E] rounded-xl transition-all cursor-pointer shadow-2xs hover:border-[#C9A227]"
          >
            <Compass className="w-3.5 h-3.5 text-[#C9A227] dark:text-[#D4AF37]" />
            <span>Curriculum Journey</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#66645C] dark:text-[#B9B3A4]" />
          </button>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#171714] dark:bg-[#F7F3E8] text-[#FFFDF5] dark:text-[#171714] hover:bg-[#C9A227] dark:hover:bg-[#C9A227] hover:text-[#171714] dark:hover:text-[#171714] rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Record</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Personal Academic Motivation & Wisdom Bar with Framed Scholar Portrait */}
      {currentDisplayQuote && (
        <div className="relative z-10 p-5 sm:p-6 rounded-3xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] flex flex-col md:flex-row items-center justify-between gap-5 group transition-all shadow-2xs">
          
          {/* Framed Photo & Motivational Directive */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 min-w-0 w-full md:w-auto flex-1">
            
            {/* Prestigious Scholar Frame */}
            <div className="relative shrink-0">
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl p-[3px] bg-gradient-to-tr from-[#C9A227] via-[#F4E7A1] to-[#B7791F] shadow-[0_8px_20px_rgba(201,162,39,0.22)] overflow-hidden">
                <div className="w-full h-full rounded-[13px] overflow-hidden bg-[#171714] border border-[#FFFFFF]/40">
                  <img
                    src={student.avatarUrl || '/mohamud.jpg'}
                    alt={student.fullName}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Scholar Honor Badge */}
              <div
                className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#171714] dark:bg-[#F7F3E8] text-[#C9A227] dark:text-[#171714] border border-[#C9A227] shadow-sm"
                title="Verified Scholar"
              >
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            {/* Motivational message directed personally to Mohamud */}
            <div className="space-y-1.5 min-w-0 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#C9A227] dark:text-[#D4AF37] px-2.5 py-0.5 rounded-full bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 border border-[#C9A227]/30">
                  <Quote className="w-3 h-3" />
                  <span>Personal Directive · {currentDisplayQuote.category}</span>
                </span>
                <span className="text-[11px] font-semibold text-[#171714] dark:text-[#F7F3E8] hidden sm:inline">
                  Daily Drive for Mohamud
                </span>
              </div>

              <p className="font-editorial text-base sm:text-lg font-bold text-[#171714] dark:text-[#F7F3E8] italic leading-snug">
                "{currentDisplayQuote.quote}"
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#66645C] dark:text-[#B9B3A4]">
                <span className="font-semibold text-[#171714] dark:text-[#F7F3E8]">— {currentDisplayQuote.author}</span>
                <span>·</span>
                <span className="text-[11px] text-[#C9A227] dark:text-[#D4AF37] font-medium">Focus & Academic Mastery</span>
              </div>
            </div>
          </div>

          {/* Shuffle Next Insight Action */}
          <button
            onClick={handleShuffleQuote}
            title="Discover another inspiring thought"
            className="self-center md:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#66645C] dark:text-[#B9B3A4] hover:text-[#171714] dark:hover:text-[#F7F3E8] bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#C9A227] dark:text-[#D4AF37]" />
            <span>Next Insight</span>
          </button>
        </div>
      )}

      {/* 3. Signature Interconnected Academic Strip (Past → Today → Ahead) */}
      <div className="relative z-10 rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8E1CF] dark:divide-[#3A372E]">
          {/* PAST: Semester 6 Milestone */}
          <div
            onClick={() => {
              if (previousCompletedSemester) {
                setSelectedSemesterId(previousCompletedSemester.id);
                setActiveTab('journey');
              }
            }}
            className="p-5 sm:p-6 hover:bg-[#FFFFFF] dark:hover:bg-[#1E1D19] transition-colors cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#66645C] dark:text-[#B9B3A4] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#C9A227] dark:text-[#D4AF37]" />
                <span>PAST · PREVIOUS CHAPTER</span>
              </span>
              <span className="text-[11px] font-bold text-[#C9A227] dark:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                Review Ledger →
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-editorial text-lg font-bold text-[#171714] dark:text-[#F7F3E8]">
                {previousCompletedSemester ? previousCompletedSemester.name : 'Semester 6'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#171714] dark:text-[#F7F3E8] border border-[#C9A227]/40 flex items-center gap-1">
                <Award className="w-3 h-3 text-[#C9A227] dark:text-[#D4AF37]" />
                <span>Rank #2 of 46 (Top Performer)</span>
              </span>
            </div>

            <p className="text-xs text-[#66645C] dark:text-[#B9B3A4] leading-relaxed">
              Term GPA: <strong className="text-[#C9A227] dark:text-[#D4AF37] font-mono">3.83</strong> · Total: <strong className="text-[#171714] dark:text-[#F7F3E8] font-mono">561/600 (94% avg)</strong> · 6/6 Passed
            </p>
          </div>

          {/* TODAY: Semester 7 Focus */}
          <div
            onClick={() => setActiveTab('activities')}
            className="p-5 sm:p-6 hover:bg-[#FFFFFF] dark:hover:bg-[#1E1D19] transition-colors cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#66645C] dark:text-[#B9B3A4] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7D45] dark:text-[#788B52]" />
                <span>TODAY · CURRENT FOCUS</span>
              </span>
              <span className="text-[11px] font-bold text-[#6B7D45] dark:text-[#788B52] opacity-0 group-hover:opacity-100 transition-opacity">
                Manage Activities →
              </span>
            </div>

            <div className="font-editorial text-lg font-bold text-[#171714] dark:text-[#F7F3E8]">
              {urgentDeadlines.length === 0 ? 'Semester 7 in Progress' : `${urgentDeadlines.length} Upcoming Deliverables`}
            </div>

            <p className="text-xs text-[#66645C] dark:text-[#B9B3A4] leading-relaxed truncate">
              {urgentDeadlines[0]
                ? `Next: ${urgentDeadlines[0].title}`
                : 'All coursework deliverables on schedule. Register your semester courses.'}
            </p>
          </div>

          {/* AHEAD: Graduation Roadmap */}
          <div
            onClick={() => setActiveTab('graduation')}
            className="p-5 sm:p-6 hover:bg-[#FFFFFF] dark:hover:bg-[#1E1D19] transition-colors cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#66645C] dark:text-[#B9B3A4] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#B7791F] dark:text-[#C28A2C]" />
                <span>AHEAD · DEGREE GOAL</span>
              </span>
              <span className="text-[11px] font-bold text-[#B7791F] dark:text-[#C28A2C] opacity-0 group-hover:opacity-100 transition-opacity">
                Roadmap →
              </span>
            </div>

            <div className="font-editorial text-lg font-bold text-[#171714] dark:text-[#F7F3E8]">
              {remainingCredits || 12} Credits to Degree Clearance
            </div>

            <p className="text-xs text-[#66645C] dark:text-[#B9B3A4] leading-relaxed">
              Target graduation in <strong className="text-[#171714] dark:text-[#F7F3E8] font-mono">{student.expectedGraduation || '2027'}</strong> · Active Candidate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
