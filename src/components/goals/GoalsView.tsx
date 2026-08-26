import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  CheckSquare,
  Sparkles,
  X
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Goal, AcademicTask } from '../../types';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const GoalsView: React.FC = () => {
  const {
    goals,
    tasks,
    addGoal,
    updateGoal,
    deleteGoal,
    addTask,
    toggleTaskStatus,
    deleteTask,
  } = useAcademic();

  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<Goal['category']>('GPA');
  const [goalTarget, setGoalTarget] = useState<number>(7);
  const [goalProgress, setGoalProgress] = useState<number>(50);
  const [goalDesc, setGoalDesc] = useState('');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<AcademicTask['category']>('CV');
  const [taskPriority, setTaskPriority] = useState<AcademicTask['priority']>('Normal');
  const [taskDeadline, setTaskDeadline] = useState('2026-09-10');
  const [taskDesc, setTaskDesc] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    addGoal({
      title: goalTitle,
      description: goalDesc,
      targetSemester: goalTarget,
      progressPercentage: goalProgress,
      category: goalCategory,
      status: 'In Progress',
    });

    setGoalTitle('');
    setGoalDesc('');
    setIsAddGoalModalOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle,
      description: taskDesc,
      deadline: taskDeadline,
      priority: taskPriority,
      category: taskCategory,
      status: 'Pending',
    });

    setTaskTitle('');
    setTaskDesc('');
    setIsAddTaskModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="Personal Goals & Productivity Tasks"
        eyebrowIcon={<Target className="w-4 h-4 text-[#C9A227]" />}
        title="Academic Ambitions & Personal Action Items"
        description="Independent from standard course deliverables — manage career preparation, skills portfolio, and academic benchmarks."
        actions={
          <>
            <Button
              variant="secondary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddTaskModalOpen(true)}
            >
              New Task
            </Button>
            <Button
              variant="indigo"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddGoalModalOpen(true)}
            >
              New Academic Goal
            </Button>
          </>
        }
      />

      {/* 2. Top Goals Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Academic Goals ({goals.filter(g => !g.isArchived).length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.filter(g => !g.isArchived).map((goal) => (
            <div
              key={goal.id}
              className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs space-y-3.5 relative group hover:border-[#C9A227]/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border border-[#E8E1CF] dark:border-[#E8E1CF]/18">
                  {goal.category} · Semester {goal.targetSemester}
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-[#C9A227] dark:text-[#F4E7A1]">
                    {goal.progressPercentage}%
                  </span>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {goal.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {goal.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#9B7A1D] transition-all duration-300"
                    style={{ width: `${goal.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Action Tasks */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Action Tasks ({tasks.filter(t => !t.isArchived).length})
        </h2>

        <div className="space-y-2.5">
          {tasks.filter(t => !t.isArchived).map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-[#C9A227]/50 dark:hover:border-[#C9A227]/50 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    task.status === 'Completed'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-[#C9A227]'
                  }`}
                >
                  {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div className="min-w-0">
                  <span
                    className={`text-xs font-bold text-slate-900 dark:text-slate-100 ${
                      task.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>{task.category}</span>
                    <span>·</span>
                    <span className="font-mono">Due {task.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                New Academic Goal
              </h3>
              <button
                onClick={() => setIsAddGoalModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Distributed Systems Architecture"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as Goal['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="GPA">Target GPA</option>
                    <option value="Research">Research & Papers</option>
                    <option value="Certification">Professional Certification</option>
                    <option value="Career">Career & Internships</option>
                    <option value="Skill">Technical Skill</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Semester
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(parseInt(e.target.value) || 7)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Goal Details & Milestones
                </label>
                <textarea
                  rows={3}
                  value={goalDesc}
                  onChange={(e) => setGoalDesc(e.target.value)}
                  placeholder="Specific learning objectives and action steps..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setIsAddGoalModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  Create Goal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                New Action Task
              </h3>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Polish GitHub repositories for portfolio"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as AcademicTask['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="CV">CV & Career</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Research">Research</option>
                    <option value="Application">Application</option>
                    <option value="Study">Study Routine</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setIsAddTaskModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  Save Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
