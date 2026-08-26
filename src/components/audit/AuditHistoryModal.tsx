import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  X,
  Clock,
  RotateCcw,
  FileCheck
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const AuditHistoryModal: React.FC = () => {
  const { isAuditModalOpen, setIsAuditModalOpen, auditLogs } = useAcademic();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  if (!isAuditModalOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Append-Only Audit Trail ({auditLogs.length} Events)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immutable historical event logging of all grade calculations, course modifications, and cloud sync events.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuditModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail by entity, reason, or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
          >
            <option value="all">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="SOFT_DELETE">SOFT_DELETE</option>
            <option value="RESTORE">RESTORE</option>
            <option value="CALCULATE">CALCULATE</option>
            <option value="CLOUD_SYNC">CLOUD_SYNC</option>
            <option value="SCHEMA_MIGRATION">SCHEMA_MIGRATION</option>
          </select>
        </div>

        {/* Log Stream */}
        <div className="flex-1 overflow-y-auto space-y-2 text-xs">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      log.action === 'CREATE'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : log.action === 'SOFT_DELETE' || log.action === 'DELETE'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : log.action === 'RESTORE' || log.action === 'CLOUD_SYNC'
                        ? 'bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#9B7A1D] dark:text-[#F4E7A1] border-[#E8E1CF] dark:border-[#E8E1CF]/18'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {log.entityName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">({log.entity})</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              {log.reason && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                  Reason: {log.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
