import { Award, GraduationCap, ChevronRight } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const AcademicJourneyTimeline: React.FC = () => {
  const {
    semesters,
    student,
    setSelectedSemesterId,
    setActiveTab,
  } = useAcademic();

  const handleSemesterClick = (semesterId: string) => {
    setSelectedSemesterId(semesterId);
    setActiveTab('journey');
  };

  return (
    <div className="dashboard-surface rounded-2xl p-5 sm:p-6 shadow-[0_8px_22px_rgba(23,23,20,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#66645C] dark:text-[#E8E1CF]/55">
              Academic Journey Timeline
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
          </div>
          <h2 className="text-xl font-extrabold text-[#171714] dark:text-[#FFFDF5] mt-0.5">
            The 8 Semesters Roadmap
          </h2>
        </div>

        <button
          onClick={() => setActiveTab('journey')}
          className="text-xs font-semibold text-[#C9A227] dark:text-[#F4E7A1] hover:text-[#9B7A1D] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>All Semesters</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex items-center min-w-[720px] relative py-2">
          <div className="absolute top-1/2 left-6 right-16 h-[2px] -translate-y-1/2 bg-[#E8E1CF] dark:bg-[#F4E7A1]/12 z-0" />

          {semesters.map((sem) => {
            const isCompleted = sem.status === 'Completed';
            const isActive = sem.status === 'Active' || sem.number === student.currentSemesterNumber;
            const isS6Achievement = sem.number === 6;

            return (
              <div
                key={sem.id}
                onClick={() => handleSemesterClick(sem.id)}
                className="relative z-10 flex-1 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-[0_4px_12px_rgba(23,23,20,0.06)] ${
                    isActive
                      ? 'bg-[#FFFFFF] dark:bg-[#24231D] border-2 border-[#C9A227] text-[#C9A227] dark:text-[#F4E7A1] ring-4 ring-[#F4E7A1]/35 scale-105'
                      : isS6Achievement
                      ? 'bg-[#C9A227] text-[#171714] border-2 border-[#F4E7A1] font-extrabold shadow-[0_6px_14px_rgba(201,162,39,0.18)] group-hover:scale-105'
                      : isCompleted
                      ? 'bg-[#171714] dark:bg-[#2D2B24] text-[#FFFDF5] border border-[#171714] dark:border-[#E8E1CF]/18 group-hover:scale-105'
                      : 'bg-[#FBF7E8] dark:bg-[#F4E7A1]/8 border border-[#E8E1CF] dark:border-[#E8E1CF]/18 text-[#66645C] dark:text-[#E8E1CF]/60 group-hover:border-[#C9A227]'
                  }`}
                >
                  {isS6Achievement ? (
                    <span className="flex items-center gap-0.5 text-xs font-bold">🥈</span>
                  ) : (
                    <span>S{sem.number}</span>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <div
                    className={`text-[11px] font-bold tracking-tight ${
                      isActive
                        ? 'text-[#C9A227] dark:text-[#F4E7A1]'
                        : isS6Achievement
                        ? 'text-[#B7791F] dark:text-[#F4E7A1]'
                        : 'text-[#171714] dark:text-[#FFFDF5]'
                    }`}
                  >
                    {sem.name}
                  </div>

                  <div className="text-[10px] text-[#66645C] dark:text-[#E8E1CF]/55 mt-0.5 font-mono">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#C9A227] dark:text-[#F4E7A1]">
                        ● Active
                      </span>
                    ) : isS6Achievement ? (
                      <span className="font-bold text-[#B7791F] dark:text-[#F4E7A1] inline-flex items-center gap-0.5">
                        <Award className="w-2.5 h-2.5" /> Rank #2
                      </span>
                    ) : isCompleted ? (
                      <span>{sem.gpa?.toFixed(2)} GPA</span>
                    ) : (
                      <span>Planned</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div
            onClick={() => setActiveTab('graduation')}
            className="relative z-10 flex flex-col items-center pl-2 group cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-[#FFFFFF] dark:bg-[#24231D] border-2 border-dashed border-[#C9A227] group-hover:border-[#9B7A1D] flex items-center justify-center text-xs text-[#C9A227] dark:text-[#F4E7A1] group-hover:scale-105 transition-transform shadow-[0_4px_12px_rgba(23,23,20,0.06)]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="mt-2 text-center">
              <div className="text-[11px] font-bold text-[#171714] dark:text-[#FFFDF5]">Graduation</div>
              <div className="text-[10px] font-mono text-[#66645C] dark:text-[#E8E1CF]/55 mt-0.5">Target 2027</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
