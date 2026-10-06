import React from 'react';
import { Trash2, AlertTriangle, X, Archive } from 'lucide-react';
import { Course } from '../../types';
import { Button } from '../ui/Button';

interface CourseDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onConfirmDelete: (courseId: string) => void;
  onConfirmArchive?: (courseId: string) => void;
}

export const CourseDeleteModal: React.FC<CourseDeleteModalProps> = ({
  isOpen,
  onClose,
  course,
  onConfirmDelete,
  onConfirmArchive,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1CF] dark:border-[#3A372E]">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#171714] dark:text-[#F7F3E8]">
              Delete Course Workspace
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#66645C] hover:text-[#171714] dark:hover:text-[#F7F3E8] hover:bg-[#FBF7E8] dark:hover:bg-[#25241D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FBF7E8]/60 dark:bg-[#171714] border border-[#E8E1CF] dark:border-[#3A372E]">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#C9A227]">{course.code}</span>
              <span className="font-mono text-[11px] text-[#66645C] dark:text-[#B9B3A4]">{course.creditHours} CH</span>
            </div>
            <p className="font-bold text-sm text-[#171714] dark:text-[#F7F3E8] mt-1">{course.name}</p>
            <p className="text-[11px] text-[#66645C] dark:text-[#B9B3A4] mt-0.5">{course.lecturer}</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Deleting this course removes its credits and scores from your GPA calculations. You can also choose to archive it instead.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E8E1CF] dark:border-[#3A372E] flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          {onConfirmArchive && (
            <button
              onClick={() => {
                onConfirmArchive(course.id);
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-[#FBF7E8] dark:bg-[#25241D] text-[#171714] dark:text-[#F7F3E8] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Archive Only</span>
            </button>
          )}
          <button
            onClick={() => {
              onConfirmDelete(course.id);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};
