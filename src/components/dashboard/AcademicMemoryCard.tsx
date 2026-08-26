import React from 'react';
import { Sparkles, ArrowRight, BookmarkCheck, BookOpen, Plus, Award } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const AcademicMemoryCard: React.FC = () => {
  const { memories, semesters, setActiveTab, setIsQuickAddOpen } = useAcademic();

  const primaryMilestone = memories.find((m) => m.semesterNumber === 6 && m.isPinned) || memories[0];
  const secondaryMemory = memories.find((m) => m.id === 'mem-2') || memories[1];

  const milestoneSemester = primaryMilestone?.semesterNumber
    ? semesters.find((s) => s.number === primaryMilestone.semesterNumber)
    : null;

  return (
    <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E8E1CF] dark:border-[#3A372E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#C9A227] dark:text-[#D4AF37] border border-[#C9A227]/30 flex items-center justify-center shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-editorial text-lg font-bold text-[#171714] dark:text-[#F7F3E8]">
              Kaydka Xusuusta Aqooneed
            </h3>
            <span className="text-[11px] text-[#66645C] dark:text-[#B9B3A4]">
              Diiwaanka guulaha & dhacdooyinka taariikhiga ah
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] hover:text-[#C9A227] border border-[#E8E1CF] dark:border-[#3A372E] text-xs font-semibold cursor-pointer transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Qor Xusuus</span>
        </button>
      </div>

      {/* Featured Milestone Box */}
      {primaryMilestone ? (
        <div
          onClick={() => setActiveTab('memories')}
          className="relative p-4 sm:p-5 rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] space-y-3 cursor-pointer hover:border-[#C9A227] dark:hover:border-[#D4AF37] transition-all group overflow-hidden shadow-2xs"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#F4E7A1]/30 dark:bg-[#756B35]/20 blur-xl pointer-events-none" />
          
          <div className="relative flex items-center justify-between">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#171714] dark:text-[#F7F3E8] border border-[#C9A227]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C9A227] dark:text-[#D4AF37]" />
              <span>Guul Taariikhi ah</span>
            </span>
            <span className="text-[10px] text-[#66645C] dark:text-[#B9B3A4] font-mono">
              {primaryMilestone.date}
            </span>
          </div>

          <h4 className="relative font-editorial text-base font-bold text-[#171714] dark:text-[#F7F3E8] group-hover:text-[#C9A227] dark:group-hover:text-[#D4AF37] transition-colors leading-snug">
            {primaryMilestone.title}
          </h4>

          <p className="relative text-xs text-[#66645C] dark:text-[#B9B3A4] leading-relaxed line-clamp-3">
            {primaryMilestone.description}
          </p>

          <div className="relative pt-2.5 border-t border-[#E8E1CF]/70 dark:border-[#3A372E]/70 flex items-center justify-between text-[11px]">
            <span className="text-[#6B7D45] dark:text-[#788B52] font-semibold flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Guul La Xaqiijiyay</span>
            </span>
            {milestoneSemester && (
              <span className="font-mono font-bold text-[#C9A227] dark:text-[#D4AF37]">
                GPA: {milestoneSemester.gpa !== undefined ? milestoneSemester.gpa.toFixed(2) : '3.83'}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="p-5 text-center rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] text-xs text-[#66645C] dark:text-[#B9B3A4]">
          Wali wax xusuus ah laguma darin. Halkan ku qor guulahaaga, natiijooyinka imtixaannada, iyo xusuusta jaamacadda.
        </div>
      )}

      {/* Secondary Memory or Empty Reflection Note */}
      {secondaryMemory && (
        <div
          onClick={() => setActiveTab('memories')}
          className="p-3.5 rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] flex items-start gap-2.5 text-xs cursor-pointer transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#C9A227] dark:text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-editorial font-bold text-[#171714] dark:text-[#F7F3E8] truncate">
              {secondaryMemory.title}
            </div>
            <div className="text-[11px] text-[#66645C] dark:text-[#B9B3A4] line-clamp-1 mt-0.5">
              {secondaryMemory.description}
            </div>
          </div>
        </div>
      )}

      {/* Footer Link */}
      <button
        onClick={() => setActiveTab('memories')}
        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#171714] dark:text-[#F7F3E8] hover:text-[#C9A227] bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] rounded-xl transition-all cursor-pointer shadow-2xs"
      >
        <span>Fur Kaydka Xusuusta (Memory Vault)</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
