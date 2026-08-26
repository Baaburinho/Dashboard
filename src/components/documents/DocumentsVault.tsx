import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  FileText,
  Download,
  Trash2,
  Search,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { DocumentItem } from '../../types';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const DocumentsVault: React.FC = () => {
  const { documents, addDocument, deleteDocument, student } = useAcademic();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Document State
  const [name, setName] = useState('');
  const [type, setType] = useState<DocumentItem['type']>('Transcript');
  const [semesterNumber, setSemesterNumber] = useState<number>(7);
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [desc, setDesc] = useState('');

  const filteredDocuments = documents.filter((doc) => {
    if (doc.isArchived) return false;
    return (
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addDocument({
      name,
      type,
      semesterNumber,
      date: new Date().toISOString().split('T')[0],
      fileSize: fileSize || '500 KB',
      description: desc,
      provenance: 'Verified',
      sourceNote: 'User uploaded credential scan',
    });

    setName('');
    setDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Standardized Page Header */}
      <PageHeader
        eyebrow="Private Documents Vault"
        eyebrowIcon={<FolderLock className="w-4 h-4 text-[#C9A227]" />}
        title={`Academic Credentials & Transcripts (${documents.length})`}
        description="Secure personal archive for university grade sheets, letters, certificates, and student credentials."
        actions={
          <Button
            variant="indigo"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Upload Credential
          </Button>
        }
      />

      {/* 2. Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search documents by title, type, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none shadow-2xs"
        />
      </div>

      {/* 3. Documents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs hover:border-[#C9A227]/60 dark:hover:border-[#C9A227]/60 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#C9A227] dark:text-[#F4E7A1] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {doc.type}
                  </span>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                {doc.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {doc.description || `Verified document record for Semester ${doc.semesterNumber}.`}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">{doc.fileSize} · {doc.date}</span>
              <span className="text-[#C9A227] dark:text-[#F4E7A1] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Preserved
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Upload Credential Record
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official S6 Transcript Slip"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="Transcript">Transcript Slip</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Student ID">Student ID Copy</option>
                    <option value="Registration">Course Registration</option>
                    <option value="Syllabus">Curriculum Syllabus</option>
                    <option value="Letter">Academic Letter</option>
                    <option value="Project">Project Report</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester #
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

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Reference
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Official stamp, reference ID, issuing faculty..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  Save Document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
