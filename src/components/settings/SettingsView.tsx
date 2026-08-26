import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Lock,
  FileCheck,
  RotateCcw,
  Sparkles,
  Database,
  Cloud,
  CloudCheck,
  RefreshCw,
  Server,
  Key,
  ExternalLink,
  History,
  X,
  Camera,
  ArrowRight
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { GradeScaleItem, BackupValidationResult } from '../../types';
import { getDefaultFirebaseConfig, saveCustomFirebaseConfig, FirebaseConfig } from '../../services/firebase';
import { processAvatarFile } from '../../utils/imageUtils';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const SettingsView: React.FC = () => {
  const {
    student,
    updateStudent,
    gradeScale,
    updateGradeScale,
    exportDataJSON,
    validateBackupJSON,
    restoreBackupSafely,
    resetAllData,
    firebaseStatus,
    lastCloudSyncTime,
    syncWithFirebaseCloud,
    pullFromFirebaseCloud,
    setCurrentRole,
    loginAsAdmin,
  } = useAcademic();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'firebase' | 'backups' | 'admin' | 'danger'>('profile');
  const [adminPass, setAdminPass] = useState('admin2026');
  const [adminError, setAdminError] = useState('');

  // Student Profile state
  const [fullName, setFullName] = useState(student.fullName);
  const [program, setProgram] = useState(student.program);
  const [faculty, setFaculty] = useState(student.faculty);
  const [university, setUniversity] = useState(student.university);
  const [academicYear, setAcademicYear] = useState(student.academicYear);
  const [totalRequiredCredits, setTotalRequiredCredits] = useState(student.totalRequiredCredits);
  const [standing, setStanding] = useState(student.academicStanding || 'Good Standing · Active Degree Candidate');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Firebase Config State
  const [fbConfig, setFbConfig] = useState<FirebaseConfig>(() => getDefaultFirebaseConfig());
  const [fbSaveSuccess, setFbSaveSuccess] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncMsg, setCloudSyncMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Restore pipeline states
  const [restoreJSON, setRestoreJSON] = useState('');
  const [validationResult, setValidationResult] = useState<BackupValidationResult | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState('');
  const [restoreErrorMsg, setRestoreErrorMsg] = useState('');

  // Factory reset modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      fullName,
      program,
      faculty,
      university,
      academicYear,
      totalRequiredCredits,
      academicStanding: standing,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomFirebaseConfig(fbConfig);
    setFbSaveSuccess(true);
    setTimeout(() => setFbSaveSuccess(false), 2500);
  };

  const handleCloudPush = async () => {
    setIsCloudSyncing(true);
    setCloudSyncMsg(null);
    const res = await syncWithFirebaseCloud();
    setIsCloudSyncing(false);
    if (res.success) {
      setCloudSyncMsg({ text: `Successfully pushed all records to Firebase Cloud at ${res.timestamp || new Date().toLocaleTimeString()}!`, type: 'success' });
    } else {
      setCloudSyncMsg({ text: res.error || 'Failed to sync with Firebase Cloud', type: 'error' });
    }
  };

  const handleCloudPull = async () => {
    setIsCloudSyncing(true);
    setCloudSyncMsg(null);
    const res = await pullFromFirebaseCloud();
    setIsCloudSyncing(false);
    if (res.success) {
      setCloudSyncMsg({ text: 'Successfully pulled latest records from Firebase Cloud!', type: 'success' });
    } else {
      setCloudSyncMsg({ text: res.error || 'Failed to pull from Firebase Cloud', type: 'error' });
    }
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PAOS_Academic_Archive_v2_${student.studentId}.json`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setRestoreJSON(content);
      const validation = validateBackupJSON(content);
      setValidationResult(validation);
      setIsRestoreModalOpen(true);
      setRestoreErrorMsg('');
      setRestoreSuccessMsg('');
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = async () => {
    if (!restoreJSON) return;
    const result = await restoreBackupSafely(restoreJSON);
    if (result.success) {
      setRestoreSuccessMsg(`Database successfully restored! Pre-restore snapshot created (${result.snapshotId}).`);
      setTimeout(() => {
        setIsRestoreModalOpen(false);
        setRestoreSuccessMsg('');
      }, 2000);
    } else {
      setRestoreErrorMsg(result.error || 'Failed to restore database archive.');
    }
  };

  const handleFactoryReset = async () => {
    await resetAllData();
    setIsResetConfirmOpen(false);
    setResetSuccessMsg('Application reset to clean initial state. Automated pre-reset snapshot preserved.');
    setTimeout(() => setResetSuccessMsg(''), 4000);
  };

  return (
    <div className="dashboard-enter dashboard-stagger space-y-7 max-w-6xl mx-auto">
      {/* 1. Standardized Page Header */}
      <PageHeader
        eyebrow="System Configuration & Cloud Engine"
        eyebrowIcon={<Settings className="w-4 h-4" />}
        title="Settings & Firebase Cloud Sync"
        description="Manage your verified student profile, configure Firebase Firestore cloud synchronization, and handle zero-data-loss database backups."
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#E8E1CF] bg-[#FBF7E8]/75 p-1.5 text-xs font-semibold dark:border-[#E8E1CF]/18 dark:bg-[#F4E7A1]/8">
        <button
          onClick={() => setActiveSettingsTab('profile')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSettingsTab === 'profile'
              ? 'bg-[#C9A227] text-[#171714] shadow-[0_6px_16px_rgba(201,162,39,0.18)]'
              : 'text-[#66645C] dark:text-[#E8E1CF]/70 hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8'
          }`}
        >
          Student Profile
        </button>
        <button
          onClick={() => setActiveSettingsTab('firebase')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSettingsTab === 'firebase'
              ? 'bg-[#C9A227] text-[#171714] shadow-[0_6px_16px_rgba(201,162,39,0.18)]'
              : 'text-[#66645C] dark:text-[#E8E1CF]/70 hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8'
          }`}
        >
          <Cloud className="w-3.5 h-3.5" />
          <span>Firebase Cloud</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B7D45]" />
        </button>
        <button
          onClick={() => setActiveSettingsTab('backups')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSettingsTab === 'backups'
              ? 'bg-[#C9A227] text-[#171714] shadow-[0_6px_16px_rgba(201,162,39,0.18)]'
              : 'text-[#66645C] dark:text-[#E8E1CF]/70 hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8'
          }`}
        >
          Backups & Export
        </button>
        <button
          onClick={() => setActiveSettingsTab('admin')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSettingsTab === 'admin'
              ? 'bg-[#171714] text-[#FFFDF5] dark:bg-[#F7F3E8] dark:text-[#171714] shadow-[0_6px_16px_rgba(23,23,20,0.18)]'
              : 'text-[#66645C] dark:text-[#E8E1CF]/70 hover:bg-[#FBF7E8] dark:hover:bg-[#F4E7A1]/8'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Admin Portal</span>
        </button>
        <button
          onClick={() => setActiveSettingsTab('danger')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer text-[#9B3D32] dark:text-[#E8E1CF] ${
            activeSettingsTab === 'danger'
              ? 'bg-[#9B3D32] text-[#FFFDF5] shadow-[0_6px_16px_rgba(155,61,50,0.18)]'
              : 'hover:bg-[#F4E7A1] dark:hover:bg-[#9B3D32]/15'
          }`}
        >
          Danger Zone
        </button>
      </div>

      {resetSuccessMsg && (
        <div className="p-4 rounded-xl bg-[#6B7D45]/12 dark:bg-[#6B7D45]/18 text-[#6B7D45] dark:text-[#F4E7A1] border border-[#6B7D45]/30 dark:border-[#E8E1CF]/18 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetSuccessMsg}</span>
        </div>
      )}

      {/* 1. Student Identity Configuration */}
      {activeSettingsTab === 'profile' && (
        <div className="dashboard-surface rounded-[24px] bg-[#FFFFFF] dark:bg-[#24231D]/90 border border-[#E8E1CF]/80 dark:border-[#E8E1CF]/18 p-5 sm:p-6 shadow-[0_14px_34px_rgba(23,23,20,0.06)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E1CF] dark:border-[#E8E1CF]/18">
            <div>
              <h3 className="text-lg font-bold text-[#171714] dark:text-[#FFFDF5]">
                Student Profile & University Metadata
              </h3>
              <p className="text-xs text-[#66645C] dark:text-[#E8E1CF]/70 mt-0.5">
                Official enrollment data reflected on your GPA ledger and Journey Reports.
              </p>
            </div>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#6B7D45] dark:text-[#F4E7A1] font-semibold bg-[#6B7D45]/12 dark:bg-[#6B7D45]/18 px-3 py-1 rounded-full border border-[#6B7D45]/30 dark:border-[#E8E1CF]/18">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Changes Saved
              </span>
            )}
          </div>

          {/* Photo & Identity Banner with Instant Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-[#C9A227] to-[#F4E7A1] shrink-0 shadow-sm">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#171714]">
                  <img
                    src={student.avatarUrl || '/mohamud.jpg'}
                    alt={student.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-editorial text-base font-bold text-[#171714] dark:text-[#F7F3E8] truncate">
                  {student.fullName}
                </h4>
                <p className="text-xs text-[#66645C] dark:text-[#B9B3A4] truncate">
                  {student.university} · {student.department}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-[#C9A227] dark:text-[#D4AF37]">
                  <span className="px-1.5 py-0.5 rounded bg-[#F4E7A1]/30 dark:bg-[#756B35]/20 border border-[#C9A227]/30">
                    {student.studentId}
                  </span>
                  <span>·</span>
                  <span>Active Semester {student.currentSemesterNumber} Candidate</span>
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <div className="shrink-0">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FFFFFF] dark:bg-[#1E1D19] border border-[#E8E1CF] dark:border-[#3A372E] hover:border-[#C9A227] text-[#171714] dark:text-[#F7F3E8] cursor-pointer transition-all shadow-2xs hover:shadow-xs">
                <Camera className="w-3.5 h-3.5 text-[#C9A227] dark:text-[#D4AF37]" />
                <span>Upload New Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const dataUrl = await processAvatarFile(file);
                      updateStudent({ avatarUrl: dataUrl });
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 3000);
                    } catch (err) {
                      console.error('Failed to upload image:', err);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none transition-colors focus:ring-2 focus:ring-[#F4E7A1]/70"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  disabled
                  value={student.studentId}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#F4E7A1]/8 text-[#66645C] dark:text-[#E8E1CF]/70 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  Degree Program
                </label>
                <input
                  type="text"
                  required
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none transition-colors focus:ring-2 focus:ring-[#F4E7A1]/70"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  Faculty / Department
                </label>
                <input
                  type="text"
                  required
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none transition-colors focus:ring-2 focus:ring-[#F4E7A1]/70"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  University Name
                </label>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none transition-colors focus:ring-2 focus:ring-[#F4E7A1]/70"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                  Degree Credit Requirement
                </label>
                <input
                  type="number"
                  required
                  value={totalRequiredCredits}
                  onChange={(e) => setTotalRequiredCredits(parseInt(e.target.value) || 120)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="indigo" type="submit">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Firebase Cloud Sync Center */}
      {activeSettingsTab === 'firebase' && (
        <div className="space-y-5">
          {/* Status Banner */}
          <div className="dashboard-surface rounded-[24px] bg-[#FFFFFF] dark:bg-[#24231D]/90 border border-[#E8E1CF]/80 dark:border-[#E8E1CF]/18 p-5 sm:p-6 shadow-[0_14px_34px_rgba(23,23,20,0.06)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1CF] dark:border-[#E8E1CF]/18">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#F4E7A1] dark:bg-[#F4E7A1]/12 text-[#C9A227] dark:text-[#F4E7A1]">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#171714] dark:text-[#FFFDF5]">
                    Firebase Cloud Sync Status
                  </h3>
                  <p className="text-xs text-[#66645C] dark:text-[#E8E1CF]/70">
                    Real-time cloud database mirroring powered by Firebase Firestore.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B7D45]/12 dark:bg-[#6B7D45]/18 text-[#6B7D45] dark:text-[#F4E7A1] border border-[#6B7D45]/30 dark:border-[#E8E1CF]/18 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#6B7D45]/120" />
                  {firebaseStatus === 'synced' ? 'Firebase Synced' : 'Ready & Connected'}
                </span>
              </div>
            </div>

            {cloudSyncMsg && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                cloudSyncMsg.type === 'success'
                  ? 'bg-[#6B7D45]/12 dark:bg-[#6B7D45]/18 text-[#6B7D45] dark:text-[#F4E7A1] border border-[#6B7D45]/30 dark:border-[#E8E1CF]/18'
                  : 'bg-[#F4E7A1] dark:bg-[#9B3D32]/15 text-[#9B3D32] dark:text-[#E8E1CF] border border-[#E8E1CF] dark:border-[#E8E1CF]/18'
              }`}>
                {cloudSyncMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{cloudSyncMsg.text}</span>
              </div>
            )}

            {/* Cloud Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-[#FBF7E8] dark:bg-[#F4E7A1]/8 border border-[#E8E1CF]/80 dark:border-[#E8E1CF]/60 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#171714] dark:text-[#FFFDF5] flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#C9A227]" />
                    Push Local Records to Firebase
                  </h4>
                  <p className="text-[11px] text-[#66645C] dark:text-[#E8E1CF]/70 mt-1">
                    Uploads all student transcripts, semesters, assignments, goals, and fee ledgers to Firestore cloud.
                  </p>
                </div>
                <Button
                  variant="indigo"
                  disabled={isCloudSyncing}
                  onClick={handleCloudPush}
                  className="w-full"
                >
                  {isCloudSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
                  <span>Push All to Firebase</span>
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF7E8] dark:bg-[#F4E7A1]/8 border border-[#E8E1CF]/80 dark:border-[#E8E1CF]/60 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#171714] dark:text-[#FFFDF5] flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-[#6B7D45]" />
                    Pull Cloud Records from Firebase
                  </h4>
                  <p className="text-[11px] text-[#66645C] dark:text-[#E8E1CF]/70 mt-1">
                    Fetches and updates your local database with records previously stored on Firebase Firestore.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  disabled={isCloudSyncing}
                  onClick={handleCloudPull}
                  className="w-full"
                >
                  {isCloudSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CloudCheck className="w-3.5 h-3.5" />}
                  <span>Pull from Firebase Cloud</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Firebase Project Configuration Form */}
          <div className="dashboard-surface rounded-[24px] bg-[#FFFFFF] dark:bg-[#24231D]/90 border border-[#E8E1CF]/80 dark:border-[#E8E1CF]/18 p-5 sm:p-6 shadow-[0_14px_34px_rgba(23,23,20,0.06)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1CF] dark:border-[#E8E1CF]/18">
              <div>
                <h3 className="text-lg font-bold text-[#171714] dark:text-[#FFFDF5] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#C9A227]" />
                  Custom Firebase Project Credentials
                </h3>
                <p className="text-xs text-[#66645C] dark:text-[#E8E1CF]/70 mt-0.5">
                  Connect your own Firebase project or leave defaults for local & offline operation.
                </p>
              </div>
              {fbSaveSuccess && (
                <span className="text-xs font-semibold text-[#6B7D45] dark:text-[#F4E7A1] bg-[#6B7D45]/12 dark:bg-[#6B7D45]/18 px-3 py-1 rounded-full border border-[#6B7D45]/30 dark:border-[#E8E1CF]/18">
                  Config Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveFirebaseConfig} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                    Firebase API Key
                  </label>
                  <input
                    type="text"
                    required
                    value={fbConfig.apiKey}
                    onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                    Project ID
                  </label>
                  <input
                    type="text"
                    required
                    value={fbConfig.projectId}
                    onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                    Auth Domain
                  </label>
                  <input
                    type="text"
                    value={fbConfig.authDomain}
                    onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#171714] dark:text-[#E8E1CF]/85 mb-1">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={fbConfig.appId || ''}
                    onChange={(e) => setFbConfig({ ...fbConfig, appId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FBF7E8] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="indigo" type="submit">
                  Save Firebase Project Config
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Zero-Data-Loss Backups */}
      {activeSettingsTab === 'backups' && (
        <div className="dashboard-surface rounded-[24px] bg-[#FFFFFF] dark:bg-[#24231D]/90 border border-[#E8E1CF]/80 dark:border-[#E8E1CF]/18 p-5 sm:p-6 shadow-[0_14px_34px_rgba(23,23,20,0.06)] space-y-5">
          <div className="pb-3 border-b border-[#E8E1CF] dark:border-[#E8E1CF]/18">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#C9A227]" />
              <h3 className="text-lg font-bold text-[#171714] dark:text-[#FFFDF5]">
                JSON Database Backups & Safe Restore
              </h3>
            </div>
            <p className="text-xs text-[#66645C] dark:text-[#E8E1CF]/70 mt-0.5">
              Export encrypted JSON snapshots or restore with automated pre-mutation backups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#FBF7E8] dark:bg-[#F4E7A1]/8 border border-[#E8E1CF]/80 dark:border-[#E8E1CF]/60 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#171714] dark:text-[#FFFDF5] flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#C9A227]" />
                  Export Full JSON Archive
                </h4>
                <p className="text-[11px] text-[#66645C] dark:text-[#E8E1CF]/70">
                  Contains all semesters, courses, assignments, reflections, memories, and audit events.
                </p>
              </div>
              <Button
                variant="secondary"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={handleDownloadBackup}
              >
                Download Encrypted Backup JSON
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-[#FBF7E8] dark:bg-[#F4E7A1]/8 border border-[#E8E1CF]/80 dark:border-[#E8E1CF]/60 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#171714] dark:text-[#FFFDF5] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#6B7D45]" />
                  Safe Restore (Preview & Validate)
                </h4>
                <p className="text-[11px] text-[#66645C] dark:text-[#E8E1CF]/70">
                  Validates schema compatibility and automatically takes a pre-restore backup.
                </p>
              </div>
              <div>
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-medium rounded-xl border border-[#E8E1CF] dark:border-[#E8E1CF] bg-[#FFFFFF] dark:bg-[#2D2B24] text-[#171714] dark:text-[#FFFDF5] hover:border-[#C9A227] transition-all">
                    <FileCheck className="w-3.5 h-3.5 text-[#6B7D45]" />
                    <span>Select JSON Backup File</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Executive Admin Portal Entry */}
      {activeSettingsTab === 'admin' && (
        <div className="dashboard-surface rounded-[24px] bg-[#FFFFFF] dark:bg-[#24231D]/90 border border-[#E8E1CF]/80 dark:border-[#E8E1CF]/18 p-6 sm:p-7 shadow-[0_14px_34px_rgba(23,23,20,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1CF] dark:border-[#E8E1CF]/18">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#171714] text-[#F4E7A1] dark:bg-[#C9A227] dark:text-[#171714] flex items-center justify-center shadow-md shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-editorial text-[#171714] dark:text-[#FFFDF5]">
                  Central Administration & Governance Console
                </h3>
                <p className="text-xs text-[#66645C] dark:text-[#E8E1CF]/70 mt-0.5">
                  Direct management portal for official examination results, quotes, curriculum schemas, and audit logs.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Quick Launch Card */}
            <div className="p-5 rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4E7A1]/40 dark:bg-[#756B35]/30 text-[#C9A227] dark:text-[#D4AF37] border border-[#C9A227]/30">
                    Master Console
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#171714] dark:text-[#F7F3E8]">
                  Launch Full Admin Dashboard
                </h4>
                <p className="text-xs text-[#66645C] dark:text-[#B9B3A4] leading-relaxed">
                  Switch instantly into full management mode with the complete sidebar for Results, Quotes, Semesters, Fees, and System Audits.
                </p>
              </div>

              <button
                onClick={() => setCurrentRole('admin')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#171714] dark:bg-[#F7F3E8] text-[#FFFDF5] dark:text-[#171714] hover:bg-[#C9A227] dark:hover:bg-[#C9A227] hover:text-[#171714] dark:hover:text-[#171714] text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Credentials Info */}
            <div className="p-5 rounded-2xl bg-[#FFFDF5] dark:bg-[#151513] border border-[#E8E1CF] dark:border-[#3A372E] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6B7D45]/20 text-[#6B7D45] dark:text-[#F4E7A1] border border-[#6B7D45]/30">
                    Verified Access
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#171714] dark:text-[#F7F3E8]">
                  Administrator Credentials
                </h4>
                <div className="space-y-1.5 text-xs text-[#66645C] dark:text-[#B9B3A4]">
                  <p>
                    <strong className="text-[#171714] dark:text-[#F7F3E8]">Master ID:</strong> <code className="font-mono text-[#C9A227]">admin</code> or <code className="font-mono text-[#C9A227]">admin@zamzam.edu.so</code>
                  </p>
                  <p>
                    <strong className="text-[#171714] dark:text-[#F7F3E8]">Default Key:</strong> <code className="font-mono text-[#C9A227]">admin2026</code>
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#66645C] dark:text-[#B9B3A4] italic border-t border-[#E8E1CF] dark:border-[#3A372E]">
                Waxaad mar kasta dib ugu noqon kartaa Student View adigoo riixaya badhanka kore ee "Student View".
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Danger Zone */}
      {activeSettingsTab === 'danger' && (
        <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#24231D]/90 border border-[#E8E1CF] dark:border-[#9B3D32]/35 p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#9B3D32] dark:text-[#E8E1CF] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Danger Zone: Database Reset</span>
              </h3>
              <p className="text-xs text-[#66645C] dark:text-[#E8E1CF]/70 max-w-xl leading-relaxed">
                Purges local IndexedDB cache and restores default semester schemas. An automated pre-reset snapshot will be saved in IndexedDB snapshots.
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setIsResetConfirmOpen(true)}
            >
              Reset Database
            </Button>
          </div>
        </div>
      )}

      {/* Restore Validation & Confirmation Modal */}
      {isRestoreModalOpen && validationResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] dark:bg-[#24231D] border border-[#E8E1CF] dark:border-[#E8E1CF]/18 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1CF] dark:border-[#E8E1CF]/18">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#C9A227]" />
                <h3 className="text-lg font-bold text-[#171714] dark:text-[#FFFDF5]">
                  Backup Validation & Preview
                </h3>
              </div>
              <button
                onClick={() => setIsRestoreModalOpen(false)}
                className="p-1 rounded-lg text-[#66645C] hover:text-[#171714] dark:hover:text-[#FFFDF5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {restoreSuccessMsg ? (
              <div className="p-4 rounded-xl bg-[#6B7D45]/12 dark:bg-[#6B7D45]/18 text-[#6B7D45] dark:text-[#F4E7A1] border border-[#6B7D45]/30 dark:border-[#E8E1CF]/18 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{restoreSuccessMsg}</span>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-[#FBF7E8] dark:bg-[#F4E7A1]/8 border border-[#E8E1CF] dark:border-[#E8E1CF] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#66645C] dark:text-[#E8E1CF]/70">Validation Status:</span>
                    <span className={`font-semibold ${validationResult.isValid ? 'text-[#6B7D45] dark:text-[#F4E7A1]' : 'text-[#9B3D32]'}`}>
                      {validationResult.isValid ? 'Valid PAOS Archive' : 'Invalid Archive Format'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#66645C] dark:text-[#E8E1CF]/70">Edition:</span>
                    <span className="font-mono text-[#171714] dark:text-[#FFFDF5]">{validationResult.edition}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E8E1CF] dark:border-[#E8E1CF] grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="font-mono font-bold text-[#171714] dark:text-[#FFFDF5]">{validationResult.entityCounts?.semesters || 0}</div>
                      <div className="text-[10px] text-[#66645C]">Semesters</div>
                    </div>
                    <div>
                      <div className="font-mono font-bold text-[#171714] dark:text-[#FFFDF5]">{validationResult.entityCounts?.courses || 0}</div>
                      <div className="text-[10px] text-[#66645C]">Courses</div>
                    </div>
                    <div>
                      <div className="font-mono font-bold text-[#171714] dark:text-[#FFFDF5]">{validationResult.entityCounts?.memories || 0}</div>
                      <div className="text-[10px] text-[#66645C]">Memories</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F4E7A1] dark:bg-[#B7791F]/18 border border-[#E8E1CF] dark:border-[#E8E1CF]/18 text-xs text-[#B7791F] dark:text-[#F4E7A1] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>An automated snapshot will be preserved before restore.</span>
                </div>

                {restoreErrorMsg && (
                  <div className="text-xs text-[#9B3D32] dark:text-[#E8E1CF] font-semibold">{restoreErrorMsg}</div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E1CF] dark:border-[#E8E1CF]/18">
                  <Button variant="secondary" onClick={() => setIsRestoreModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="indigo"
                    disabled={!validationResult.isValid}
                    onClick={handleConfirmRestore}
                  >
                    Confirm & Restore Database
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#FFFFFF] dark:bg-[#24231D] border border-[#E8E1CF] dark:border-[#E8E1CF]/18 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1CF] dark:border-[#E8E1CF]/18">
              <div className="flex items-center gap-2 text-[#9B3D32] dark:text-[#E8E1CF]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-lg font-bold">
                  Confirm Database Reset
                </h3>
              </div>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="p-1 rounded-lg text-[#66645C] hover:text-[#171714] dark:hover:text-[#FFFDF5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#66645C] dark:text-[#E8E1CF]/70 leading-relaxed">
              Are you sure you want to reset the PAOS database? A complete snapshot of your current state will be preserved in the IndexedDB snapshots store.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E1CF] dark:border-[#E8E1CF]/18">
              <Button variant="secondary" onClick={() => setIsResetConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleFactoryReset}>
                Reset Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
