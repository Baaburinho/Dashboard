import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Activity, ActivityStatus, ActivityType, Priority } from '../../types';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const ActivityManager: React.FC = () => {
  const {
    activities,
    courses,
    semesters,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleActivityComplete,
    setIsQuickAddOpen,
  } = useAcademic();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Form State
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('Assignment');
  const [deadline, setDeadline] = useState('2026-09-02T23:59:00');
  const [priority, setPriority] = useState<Priority>('High');
  const [maxScore, setMaxScore] = useState(20);
  const [weight, setWeight] = useState(15);
  const [desc, setDesc] = useState('');

  const filteredActivities = activities.filter((a) => {
    if (a.isArchived) return false;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCourse = courses.find((c) => c.id === courseId);
    if (!selectedCourse) return;

    if (editingActivity) {
      updateActivity(editingActivity.id, {
        courseId: selectedCourse.id,
        courseCode: selectedCourse.code,
        courseName: selectedCourse.name,
        semesterId: selectedCourse.semesterId,
        title,
        type,
        deadline,
        priority,
        maxScore,
        weightPercentage: weight,
        description: desc,
      });
      setEditingActivity(null);
    } else {
      addActivity({
        courseId: selectedCourse.id,
        courseCode: selectedCourse.code,
        courseName: selectedCourse.name,
        semesterId: selectedCourse.semesterId,
        title,
        type,
        deadline,
        priority,
        maxScore,
        weightPercentage: weight,
        description: desc,
        status: 'Planned',
      });
      setIsAddModalOpen(false);
    }
  };

  const handleEdit = (act: Activity) => {
    setEditingActivity(act);
    setCourseId(act.courseId);
    setTitle(act.title);
    setType(act.type);
    setDeadline(act.deadline);
    setPriority(act.priority);
    setMaxScore(act.maxScore || 20);
    setWeight(act.weightPercentage || 10);
    setDesc(act.description || '');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="Central Activity & Assessment Hub"
        eyebrowIcon={<CheckSquare className="w-4 h-4 text-[#C9A227]" />}
        title={`Assignments, Exams & Deliverables (${activities.length})`}
        description="Track coursework deadlines, examination dates, and submission statuses."
        actions={
          <Button
            variant="indigo"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setEditingActivity(null);
              setIsAddModalOpen(true);
            }}
          >
            New Deliverable
          </Button>
        }
      />

      {/* 2. Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#66645C]" />
          <input
            type="text"
            placeholder="Search activities by course or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FFFFFF] dark:bg-[#24231D] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FFFFFF] dark:bg-[#24231D] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FFFFFF] dark:bg-[#24231D] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none"
          >
            <option value="all">All Types</option>
            <option value="Assignment">Assignment</option>
            <option value="Midterm">Midterm Exam</option>
            <option value="Final Exam">Final Exam</option>
            <option value="Project">Project</option>
            <option value="Presentation">Presentation</option>
            <option value="Lab">Lab</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>
      </div>

      {/* 3. Activities List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#FFFFFF] dark:bg-[#24231D]/90 border border-[#E8E1CF] dark:border-[#E8E1CF]/18 text-xs text-[#66645C]">
            No activities matched your search or filters.
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isCompleted = act.status === 'Completed';
            const isExam = act.type === 'Midterm' || act.type === 'Final Exam';
            const deadlineDate = new Date(act.deadline);

            return (
              <div
                key={act.id}
                className={`p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#24231D]/90 border border-[#E8E1CF] dark:border-[#E8E1CF]/18 shadow-2xs hover:border-[#C9A227]/60 dark:hover:border-[#C9A227]/60 transition-all flex items-start justify-between gap-4 ${
                  isCompleted ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleActivityComplete(act.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                      isCompleted
                        ? 'bg-[#6B7D45] border-[#6B7D45] text-white'
                        : 'border-[#E8E1CF] dark:border-[#E8E1CF]/18 hover:border-[#C9A227]'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#C9A227] dark:text-[#F4E7A1] px-2 py-0.5 rounded-full bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 border border-[#E8E1CF] dark:border-[#E8E1CF]/18">
                        {act.courseCode}
                      </span>
                      <h3
                        className={`text-sm font-bold text-[#171714] dark:text-[#FFFDF5] ${
                          isCompleted ? 'line-through text-[#66645C] dark:text-[#E8E1CF]/55' : ''
                        }`}
                      >
                        {act.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#66645C] dark:text-[#E8E1CF]/70 mt-1 line-clamp-2 leading-relaxed">
                      {act.description || `Assessment item for ${act.courseName}.`}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#66645C] dark:text-[#E8E1CF]/70 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="font-mono">{deadlineDate.toLocaleDateString()} at {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                      <span>·</span>
                      <span>{act.type}</span>
                      <span>·</span>
                      <span>Max {act.maxScore || 20} pts ({act.weightPercentage || 10}% weight)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      isExam
                        ? 'bg-[#F4E7A1] dark:bg-[#B7791F]/18 text-[#B7791F] dark:text-[#F4E7A1] border-[#E8E1CF] dark:border-[#E8E1CF]/18 font-bold'
                        : act.priority === 'High' || act.priority === 'Critical'
                        ? 'bg-[#F4E7A1] dark:bg-[#9B3D32]/15 text-[#9B3D32] dark:text-[#E8E1CF] border-[#E8E1CF] dark:border-[#9B3D32]/35'
                        : 'bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#66645C] dark:text-[#E8E1CF]/70 border-[#E8E1CF] dark:border-[#E8E1CF]/18'
                    }`}
                  >
                    {act.priority}
                  </span>

                  <button
                    onClick={() => handleEdit(act)}
                    className="p-1.5 rounded-lg text-[#66645C] hover:text-[#C9A227] dark:hover:text-[#F4E7A1] hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteActivity(act.id)}
                    className="p-1.5 rounded-lg text-[#66645C] hover:text-rose-600 hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / Create Modal */}
      {(isAddModalOpen || editingActivity) && (
        <div className="fixed inset-0 z-50 bg-[#171714]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] dark:bg-[#24231D] border border-[#E8E1CF] dark:border-[#E8E1CF]/18 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1CF] dark:border-[#E8E1CF]/18">
              <h3 className="text-lg font-bold text-[#171714] dark:text-[#FFFDF5]">
                {editingActivity ? 'Edit Deliverable' : 'New Deliverable'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingActivity(null);
                }}
                className="p-1 rounded-lg text-[#66645C] hover:text-[#171714] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  Course
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus Lab Assignment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Midterm">Midterm Exam</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Project">Project</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Lab">Lab</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Task instructions and guidelines..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF]/18 bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E1CF] dark:border-[#E8E1CF]/18">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingActivity(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  {editingActivity ? 'Save Changes' : 'Create Deliverable'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
