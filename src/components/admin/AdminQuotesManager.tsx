import React, { useState } from 'react';
import {
  Quote,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  X,
  Compass
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { DailyQuote, QuoteCategory } from '../../types';
import { getDailyQuote } from '../../utils/quoteEngine';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const CATEGORIES: QuoteCategory[] = [
  'Discipline',
  'Consistency',
  'Learning',
  'Academic Excellence',
  'Resilience',
  'Focus',
  'Leadership',
  'Patience',
  'Growth',
  'Future',
];

export const AdminQuotesManager: React.FC = () => {
  const { quotes, addQuote, updateQuote, deleteQuote } = useAcademic();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<DailyQuote | null>(null);

  // Form state
  const [quoteText, setQuoteText] = useState('');
  const [authorText, setAuthorText] = useState('');
  const [categoryInput, setCategoryInput] = useState<QuoteCategory>('Discipline');

  const todayQuote = getDailyQuote(quotes);

  const filteredQuotes = quotes.filter((q) => {
    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch =
      q.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingQuote(null);
    setQuoteText('');
    setAuthorText('');
    setCategoryInput('Discipline');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (q: DailyQuote) => {
    setEditingQuote(q);
    setQuoteText(q.quote);
    setAuthorText(q.author);
    setCategoryInput(q.category);
    setIsAddModalOpen(true);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim() || !authorText.trim()) return;

    if (editingQuote) {
      updateQuote(editingQuote.id, {
        quote: quoteText,
        author: authorText,
        category: categoryInput,
      });
    } else {
      addQuote({
        quote: quoteText,
        author: authorText,
        category: categoryInput,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        eyebrow="Daily Motivation Engine & Wisdom Repository"
        eyebrowIcon={<Quote className="w-4 h-4 text-[#C9A227] dark:text-[#D4AF37]" />}
        title="Daily Motivation Quote Library"
        description="Manage the 100% offline, deterministic daily quote repository shown on the PAOS entry gateway. No external AI APIs required."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleOpenAdd}
          >
            Add Daily Quote
          </Button>
        }
      />

      {/* Today's Active Quote Spotlight */}
      <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#C9A227]/40 dark:border-[#D4AF37]/40 p-5 sm:p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#171714] dark:text-[#F7F3E8] border border-[#C9A227]/40">
            Active Today on Gateway · {todayQuote.category}
          </span>
          <span className="text-xs font-mono text-[#66645C] dark:text-[#B9B3A4]">
            Deterministic Day Selection
          </span>
        </div>

        <p className="font-editorial text-xl sm:text-2xl font-bold text-[#171714] dark:text-[#F7F3E8]">
          “{todayQuote.quote}”
        </p>

        <p className="text-xs font-mono text-[#66645C] dark:text-[#B9B3A4]">
          — {todayQuote.author}
        </p>
      </div>

      {/* Filters & Category Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#66645C] dark:text-[#B9B3A4]" />
            <input
              type="text"
              placeholder="Search quotes by wisdom keyword or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFFFF] dark:bg-[#1E1D19] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFFFF] dark:bg-[#1E1D19] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
            >
              <option value="all">All Categories ({quotes.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({quotes.filter((q) => q.category === cat).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredQuotes.map((q) => (
          <div
            key={q.id}
            className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] dark:hover:border-[#D4AF37] shadow-2xs transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] text-[#66645C] dark:text-[#B9B3A4] font-medium">
                  {q.category}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-1 rounded text-[#66645C] hover:text-[#171714] dark:hover:text-[#F7F3E8]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteQuote(q.id)}
                    className="p-1 rounded text-[#66645C] hover:text-[#9B3D32] dark:hover:text-[#B85246]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="font-editorial text-base font-bold text-[#171714] dark:text-[#F7F3E8] mt-2.5 leading-relaxed">
                “{q.quote}”
              </p>
            </div>

            <div className="pt-2 border-t border-[#E8E1CF]/50 dark:border-[#3A372E]/50 flex items-center justify-between text-[11px] font-mono text-[#66645C] dark:text-[#B9B3A4]">
              <span>— {q.author}</span>
              {todayQuote.id === q.id && (
                <span className="text-[9px] font-bold text-[#C9A227] dark:text-[#D4AF37]">
                  ★ Today's Active
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Quote Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1CF] dark:border-[#3A372E]">
              <h3 className="font-editorial text-xl font-bold text-[#171714] dark:text-[#F7F3E8]">
                {editingQuote ? 'Edit Daily Quote' : 'Add New Daily Quote'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#66645C] dark:text-[#B9B3A4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                  Category
                </label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value as QuoteCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                  Motivation Quote
                </label>
                <textarea
                  rows={3}
                  required
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="e.g. Small progress, repeated consistently, becomes mastery."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none font-editorial text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-[#66645C] dark:text-[#B9B3A4] mb-1">
                  Author / Source Attribution
                </label>
                <input
                  type="text"
                  required
                  value={authorText}
                  onChange={(e) => setAuthorText(e.target.value)}
                  placeholder="e.g. Will Durant or Academic Principle"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#3A372E] bg-[#FFFDF5] dark:bg-[#151513] text-[#171714] dark:text-[#F7F3E8] focus:border-[#C9A227] outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E1CF] dark:border-[#3A372E]">
                <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingQuote ? 'Update Quote' : 'Add to Repository'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
