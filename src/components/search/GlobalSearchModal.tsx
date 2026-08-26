import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  CheckSquare,
  FileText,
  Compass,
  ArrowRight,
  X
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    courses,
    semesters,
    memories,
    activities,
    documents,
    setSelectedCourseId,
    setSelectedSemesterId,
    setActiveTab,
  } = useAcademic();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search matches
  const matchedCourses = courses.filter(
    (c) =>
      !c.isArchived &&
      (c.name.toLowerCase().includes(cleanQuery) ||
        c.code.toLowerCase().includes(cleanQuery) ||
        c.lecturer.toLowerCase().includes(cleanQuery))
  );

  const matchedSemesters = semesters.filter(
    (s) =>
      !s.isArchived &&
      (s.name.toLowerCase().includes(cleanQuery) ||
        (s.academicRank && s.academicRank.toLowerCase().includes(cleanQuery)) ||
        (s.summaryNote && s.summaryNote.toLowerCase().includes(cleanQuery)))
  );

  const matchedMemories = memories.filter(
    (m) =>
      !m.isArchived &&
      (m.title.toLowerCase().includes(cleanQuery) ||
        m.description.toLowerCase().includes(cleanQuery) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(cleanQuery))))
  );

  const matchedActivities = activities.filter(
    (a) =>
      !a.isArchived &&
      (a.title.toLowerCase().includes(cleanQuery) ||
        a.courseCode.toLowerCase().includes(cleanQuery) ||
        (a.description && a.description.toLowerCase().includes(cleanQuery)))
  );

  const matchedDocuments = documents.filter(
    (d) =>
      !d.isArchived &&
      (d.name.toLowerCase().includes(cleanQuery) ||
        d.type.toLowerCase().includes(cleanQuery))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-[#C9A227] dark:text-[#F4E7A1] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search academic records, chapters, courses, memories... (e.g. S6, AI, Database, Rank)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {!cleanQuery ? (
            <div className="text-center py-10 space-y-2">
              <Compass className="w-8 h-8 mx-auto text-[#C9A227] opacity-60" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Type to search across your academic vault
              </p>
              <p className="text-[11px] text-slate-400">
                Courses, Semesters, Milestones, Exams, Notes, and Receipts
              </p>
            </div>
          ) : (
            <>
              {/* Courses Matches */}
              {matchedCourses.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Courses ({matchedCourses.length})
                  </span>
                  {matchedCourses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCourseId(c.id);
                        setActiveTab('course-detail');
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-[#C9A227]" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono ml-2">({c.code})</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              )}

              {/* Semesters Matches */}
              {matchedSemesters.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Semesters ({matchedSemesters.length})
                  </span>
                  {matchedSemesters.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedSemesterId(s.id);
                        setActiveTab('journey');
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-emerald-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono ml-2">GPA: {s.gpa?.toFixed(2) || 'Active'}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              )}

              {/* Memories Matches */}
              {matchedMemories.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Memories & Milestones ({matchedMemories.length})
                  </span>
                  {matchedMemories.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setActiveTab('memories');
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{m.title}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{m.description}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              )}

              {/* Activities Matches */}
              {matchedActivities.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Assessments & Deliverables ({matchedActivities.length})
                  </span>
                  {matchedActivities.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setActiveTab('activities');
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckSquare className="w-4 h-4 text-rose-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{a.title}</span>
                          <span className="text-[10px] text-slate-400 ml-2 font-mono">{a.courseCode}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
