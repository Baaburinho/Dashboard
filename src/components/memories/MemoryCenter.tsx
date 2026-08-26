import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Award,
  BookOpen,
  Tag,
  Plus,
  Search,
  Bookmark,
  Trash2,
  Clock,
  CheckCircle2,
  Quote,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { AcademicMemory, MemoryCategory, MemoryImportance, RecordProvenance } from '../../types';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const MemoryCenter: React.FC = () => {
  const { memories, addMemory, softDeleteMemory, student } = useAcademic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('Achievement');
  const [importance, setImportance] = useState<MemoryImportance>('Important');
  const [semesterNumber, setSemesterNumber] = useState<number>(student.currentSemesterNumber || 7);
  const [memoryDate, setMemoryDate] = useState<string>('2026-08-24');
  const [provenance, setProvenance] = useState<RecordProvenance>('Personal Record');
  const [sourceNote, setSourceNote] = useState('Personal academic memory entry');
  const [isPinned, setIsPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Active memories
  const activeMemories = memories.filter((m) => !m.isArchived);

  // Featured Milestone
  const featuredMemory =
    activeMemories.find((m) => m.isPinned && m.category === 'Achievement') ||
    activeMemories.find((m) => m.importance === 'Milestone') ||
    activeMemories[0];

  const filteredMemories = activeMemories.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.tags && m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesImportance = selectedImportance === 'all' || m.importance === selectedImportance;

    return matchesSearch && matchesCategory && matchesImportance;
  });

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addMemory({
      studentId: student.studentId,
      title,
      description,
      category,
      importance,
      semesterNumber,
      semesterName: `Semester ${semesterNumber}`,
      date: memoryDate,
      isPinned,
      provenance,
      sourceNote: sourceNote || 'Personal academic memory entry',
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setTitle('');
    setDescription('');
    setTagsInput('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="Kaydka Xusuusta Aqooneed · Memory Vault"
        eyebrowIcon={<Sparkles className="w-4 h-4 text-[#C9A227]" />}
        title="Xusuusaha Guulaha & Qoraallada Safarka Waxbarasho"
        description="“Xusuuso halkaad ka timid iyo halkaad higsanayso.” Diiwaan ma-guurto ah oo lagu xafido guulahaaga, kaalmahaaga sare, iyo marxaladaha xusuusta mudan ee safarkaaga jaamacadda."
        actions={
          <Button
            variant="indigo"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Qor Xusuus Cusub
          </Button>
        }
      />

      {/* 2. Featured Milestone Spotlight */}
      {featuredMemory && (
        <div className="relative rounded-3xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] p-6 sm:p-8 shadow-xs overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A227]/5 dark:bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#171714] dark:text-[#F7F3E8] border border-[#C9A227]/30 shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-[#C9A227] dark:text-[#D4AF37]" />
                  Guul Taariikhi ah · Semester {featuredMemory.semesterNumber}
                </span>
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#FFFFFF] dark:bg-[#1E1D19] text-[#C9A227] dark:text-[#D4AF37] border border-[#E8E1CF] dark:border-[#3A372E]">
                  {featuredMemory.category}
                </span>
                <span className="text-xs font-mono text-[#66645C] dark:text-[#B9B3A4]">{featuredMemory.date}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#171714] dark:text-[#F7F3E8]">
                {featuredMemory.title}
              </h2>

              <p className="text-sm sm:text-base text-[#171714]/90 dark:text-[#F7F3E8]/90 leading-relaxed max-w-4xl">
                {featuredMemory.description}
              </p>

              {featuredMemory.sourceNote && (
                <div className="pt-3 text-xs text-[#66645C] dark:text-[#B9B3A4] italic border-t border-[#E8E1CF] dark:border-[#3A372E] flex items-center gap-2">
                  <span className="font-semibold text-[#171714] dark:text-[#F7F3E8]">Xigashada:</span>
                  <span>{featuredMemory.sourceNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Raadi xusuus, maadooyin, guulo ama qoraallo safar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFFFF] dark:bg-[#1E1D19] text-[#171714] dark:text-[#F7F3E8] placeholder:text-[#66645C]/60 focus:border-[#C9A227] outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFFFF] dark:bg-[#1E1D19] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
          >
            <option value="all">Dhammaan Qaybaha (All)</option>
            <option value="Achievement">Guulo (Achievement)</option>
            <option value="Milestone">Marxalado (Milestones)</option>
            <option value="Course Completion">Maadooyin (Course Memories)</option>
            <option value="Personal Reflection">Aragtiyo & Dhiirrigelin (Reflections)</option>
            <option value="Event">Dhacdooyin Aqooneed (Events)</option>
          </select>
        </div>
      </div>

      {/* 4. Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs hover:border-[#C9A227]/60 dark:hover:border-[#C9A227]/60 transition-all duration-200 flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Semester {mem.semesterNumber}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border border-[#E8E1CF] dark:border-[#E8E1CF]/18">
                    {mem.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">{mem.date}</span>
                  <button
                    onClick={() => softDeleteMemory(mem.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2.5">
                {mem.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {mem.description}
              </p>

              {mem.sourceNote && (
                <div className="mt-2 text-[10px] text-slate-400 italic">
                  Source: {mem.sourceNote}
                </div>
              )}
            </div>

            {mem.tags && mem.tags.length > 0 && (
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                {mem.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Record Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Preserve Academic Memory
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Memory / Milestone Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Completed Compiler Construction Project Ahead of Schedule"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Achievement">Achievement</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Course Completion">Course Completion</option>
                    <option value="Personal Reflection">Personal Reflection</option>
                    <option value="Event">Academic Event</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Semester
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={semesterNumber}
                    onChange={(e) => setSemesterNumber(parseInt(e.target.value) || 7)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date Recorded
                  </label>
                  <input
                    type="date"
                    value={memoryDate}
                    onChange={(e) => setMemoryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Provenance
                  </label>
                  <select
                    value={provenance}
                    onChange={(e) => setProvenance(e.target.value as RecordProvenance)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Personal Record">Personal Record</option>
                    <option value="Verified">Verified (Official Source)</option>
                    <option value="Seeded">Seeded Template</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Reflection & Memory Narrative
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Capture what happened, why it mattered, what you learned..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. database, project, ranking, honors"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  Save to Vault
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
