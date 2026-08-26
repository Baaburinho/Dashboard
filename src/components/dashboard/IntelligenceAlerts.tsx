import { Clock, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const IntelligenceAlerts: React.FC = () => {
  const { urgentDeadlines, nextExam, cgpa, graduationProgress, setActiveTab } = useAcademic();

  const alerts = [];

  if (nextExam) {
    alerts.push({
      id: 'alert-exam',
      type: 'critical',
      icon: Calendar,
      title: `Upcoming Assessment: ${nextExam.courseCode} ${nextExam.title}`,
      description: `Scheduled for ${new Date(nextExam.deadline).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })} at ${new Date(nextExam.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      actionLabel: 'Exam Details',
      actionTab: 'activities',
    });
  }

  if (urgentDeadlines.length > 0 && urgentDeadlines[0].id !== nextExam?.id) {
    const nextTask = urgentDeadlines[0];
    alerts.push({
      id: 'alert-task',
      type: 'warning',
      icon: Clock,
      title: `Upcoming Deadline: ${nextTask.courseCode} — ${nextTask.title}`,
      description: `Due on ${new Date(nextTask.deadline).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })}. Priority: ${nextTask.priority}.`,
      actionLabel: 'View Deliverables',
      actionTab: 'activities',
    });
  }

  alerts.push({
    id: 'alert-progress',
    type: 'success',
    icon: Sparkles,
    title: `Academic Standing: ${graduationProgress}% Degree Progress (108/120 Credits)`,
    description: `Cumulative CGPA of ${cgpa.toFixed(2)} with Semester 6 Rank #2 milestone preserved.`,
    actionLabel: 'Graduation Checklist',
    actionTab: 'graduation',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {alerts.map((alert) => {
        const Icon = alert.icon;
        const isCritical = alert.type === 'critical';
        const isWarning = alert.type === 'warning';

        return (
          <div
            key={alert.id}
            onClick={() => setActiveTab(alert.actionTab)}
            className={`dashboard-surface p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 shadow-[0_8px_20px_rgba(23,23,20,0.04)] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(23,23,20,0.08)] group ${
              isCritical
                ? 'border-[#E8E1CF] hover:border-[#9B3D32]'
                : isWarning
                ? 'border-[#E8E1CF] hover:border-[#B7791F]'
                : 'border-[#E8E1CF] hover:border-[#6B7D45]'
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                isCritical
                  ? 'bg-[#F4E7A1] dark:bg-[#9B3D32]/15 text-[#9B3D32] dark:text-[#E8E1CF]'
                  : isWarning
                  ? 'bg-[#F4E7A1] dark:bg-[#B7791F]/18 text-[#B7791F] dark:text-[#F4E7A1]'
                  : 'bg-[#6B7D45]/12 dark:bg-[#6B7D45]/18 text-[#6B7D45] dark:text-[#F4E7A1]'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#171714] dark:text-[#FFFDF5] truncate">
                {alert.title}
              </h4>
              <p className="text-[11px] text-[#66645C] dark:text-[#E8E1CF]/70 mt-0.5 line-clamp-2">
                {alert.description}
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[#C9A227] dark:text-[#F4E7A1] group-hover:translate-x-0.5 transition-transform">
                <span>{alert.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
