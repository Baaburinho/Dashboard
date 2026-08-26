import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  StudentProfile,
  Semester,
  Course,
  Activity,
  AcademicMemory,
  Goal,
  AcademicTask,
  DocumentItem,
  FeeRecord,
  PaymentItem,
  TimetableSlot,
  GradeScaleItem,
  AuditLogEntry,
  NotificationItem,
  CourseNote,
  AssessmentScheme,
  BackupValidationResult,
  RecordProvenance,
  UserRole,
  DailyQuote
} from '../types';
import {
  initialStudentProfile,
  initialSemesters,
  initialCourses,
  initialActivities,
  initialMemories,
  initialGoals,
  initialTasks,
  initialDocuments,
  initialFeeRecords,
  initialTimetable,
  initialCourseNotes,
  defaultGradeScale,
  initialAuditLogs,
  initialNotifications,
  initialQuotes
} from '../data/seedData';
import mohamudDefaultAvatar from '../assets/mohamud.jpg';
import { calculateCgpaFromLedger } from '../utils/academicEngine';
import { paosDB } from '../services/db';
import { api } from '../services/api';
import { firebaseCloudService, FirebaseSyncStatus } from '../services/firebase';

interface AcademicContextType {
  student: StudentProfile;
  semesters: Semester[];
  courses: Course[];
  activities: Activity[];
  memories: AcademicMemory[];
  goals: Goal[];
  tasks: AcademicTask[];
  documents: DocumentItem[];
  feeRecords: FeeRecord[];
  timetable: TimetableSlot[];
  courseNotes: CourseNote[];
  gradeScale: GradeScaleItem[];
  auditLogs: AuditLogEntry[];
  notifications: NotificationItem[];
  
  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSemesterId: string | null;
  setSelectedSemesterId: (id: string | null) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuditModalOpen: boolean;
  setIsAuditModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isAuthenticated: boolean;

  // Firebase Cloud Sync
  firebaseStatus: 'synced' | 'syncing' | 'offline' | 'error' | 'connected';
  lastCloudSyncTime: string | null;
  syncWithFirebaseCloud: () => Promise<{ success: boolean; error?: string; timestamp?: string }>;
  pullFromFirebaseCloud: () => Promise<{ success: boolean; error?: string }>;


  // Computed metrics
  cgpa: number;
  currentSemesterGpa: number;
  completedCredits: number;
  totalRequiredCredits: number;
  remainingCredits: number;
  graduationProgress: number;
  currentSemester: Semester | undefined;
  activeSemesterCourses: Course[];
  urgentDeadlines: Activity[];
  nextExam: Activity | undefined;
  todaysTimetable: TimetableSlot[];
  onThisDayMemories: AcademicMemory[];
  outstandingFees: number;

  // Mutators
  updateStudent: (profile: Partial<StudentProfile>) => void;
  addSemester: (sem: Omit<Semester, 'id'>) => void;
  updateSemester: (id: string, sem: Partial<Semester>) => void;
  deleteSemester: (id: string, reason?: string) => void;
  softDeleteSemester: (id: string, reason?: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string, reason?: string) => void;
  softDeleteCourse: (id: string, reason?: string) => void;
  updateCourseAssessmentScheme: (courseId: string, scheme: AssessmentScheme) => void;
  addActivity: (act: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, act: Partial<Activity>) => void;
  deleteActivity: (id: string, reason?: string) => void;
  softDeleteActivity: (id: string, reason?: string) => void;
  toggleActivityComplete: (id: string) => void;
  addMemory: (mem: Omit<AcademicMemory, 'id' | 'createdAt'>) => void;
  deleteMemory: (id: string, reason?: string) => void;
  softDeleteMemory: (id: string, reason?: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string, reason?: string) => void;
  softDeleteGoal: (id: string, reason?: string) => void;
  addTask: (task: Omit<AcademicTask, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<AcademicTask>) => void;
  deleteTask: (id: string, reason?: string) => void;
  softDeleteTask: (id: string, reason?: string) => void;
  toggleTaskStatus: (id: string) => void;
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;
  deleteDocument: (id: string, reason?: string) => void;
  softDeleteDocument: (id: string, reason?: string) => void;
  addPayment: (feeId: string, payment: Omit<PaymentItem, 'id'>) => void;
  addCourseNote: (note: Omit<CourseNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourseNote: (id: string, note: Partial<CourseNote>) => void;
  deleteCourseNote: (id: string) => void;
  updateGradeScale: (scale: GradeScaleItem[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  
  // Auth & Roles
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  loginAsStudent: (studentId: string, pass: string) => boolean;
  loginAsAdmin: (adminId: string, pass: string) => boolean;
  logout: () => void;

  // Daily Quotes
  quotes: DailyQuote[];
  addQuote: (quote: Omit<DailyQuote, 'id' | 'createdAt'>) => void;
  updateQuote: (id: string, quote: Partial<DailyQuote>) => void;
  deleteQuote: (id: string) => void;

  // Admin Course Result Management
  updateCourseResult: (courseId: string, data: { totalScore?: number; grade?: string; gradePoint?: number; provenance?: RecordProvenance; sourceNote?: string }) => void;

  // Safe Backup & Restore Pipeline
  exportDataJSON: () => string;
  validateBackupJSON: (jsonString: string) => BackupValidationResult;
  restoreBackupSafely: (jsonString: string) => Promise<{ success: boolean; snapshotId: string; error?: string }>;
  resetAllData: () => Promise<string>;
}

const STORAGE_PREFIX = 'paos_v10_pure_';

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      if (key === 'student' && parsed) {
        return {
          ...parsed,
          avatarUrl: parsed.avatarUrl && parsed.avatarUrl.startsWith('data:image') ? parsed.avatarUrl : mohamudDefaultAvatar,
        };
      }
      if (key === 'memories' && Array.isArray(parsed)) {
        const hasEnglishTitle = parsed.some((m: any) => m.title?.includes('Ranked #2 of 46'));
        if (hasEnglishTitle) return fallback;
      }
      if (key === 'courses' && Array.isArray(parsed)) {
        const hasLegacy = parsed.some((c: any) => c.code === 'MOB 301' || c.code === 'DIT 302' || c.code === 'AI 401' || c.code === 'SWE 402');
        if (hasLegacy) return fallback;
      }
      if (key === 'semesters' && Array.isArray(parsed)) {
        const hasOfficialS6 = parsed.some((s: any) => s.id === 'sem-6' && s.totalMarks === 561);
        if (!hasOfficialS6) return fallback;
      }
      return parsed;
    } catch {
      return fallback;
    }
  };

  const [student, setStudent] = useState<StudentProfile>(() => loadInitial('student', initialStudentProfile));
  const [semesters, setSemesters] = useState<Semester[]>(() => loadInitial('semesters', initialSemesters));
  const [courses, setCourses] = useState<Course[]>(() => loadInitial('courses', initialCourses));
  const [activities, setActivities] = useState<Activity[]>(() => loadInitial('activities', initialActivities));
  const [memories, setMemories] = useState<AcademicMemory[]>(() => loadInitial('memories', initialMemories));
  const [goals, setGoals] = useState<Goal[]>(() => loadInitial('goals', initialGoals));
  const [tasks, setTasks] = useState<AcademicTask[]>(() => loadInitial('tasks', initialTasks));
  const [documents, setDocuments] = useState<DocumentItem[]>(() => loadInitial('documents', initialDocuments));
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(() => loadInitial('fees', initialFeeRecords));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => loadInitial('timetable', initialTimetable));
  const [courseNotes, setCourseNotes] = useState<CourseNote[]>(() => loadInitial('notes', initialCourseNotes));
  const [gradeScale, setGradeScale] = useState<GradeScaleItem[]>(() => loadInitial('gradeScale', defaultGradeScale));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadInitial('auditLogs', initialAuditLogs));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadInitial('notifications', initialNotifications));

  // UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_PREFIX + 'theme');
      if (savedTheme) return savedTheme === 'dark';
      const savedDark = localStorage.getItem(STORAGE_PREFIX + 'dark');
      if (savedDark) return JSON.parse(savedDark);
      return false;
    } catch {
      return false;
    }
  });
  const [quotes, setQuotes] = useState<DailyQuote[]>(() => loadInitial('quotes', initialQuotes));
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'role');
      return (saved === 'student' || saved === 'admin') ? saved : 'guest';
    } catch {
      return 'guest';
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Firebase Cloud Sync State
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseSyncStatus>('connected');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_PREFIX + 'firebase_synced_at') || null;
    } catch {
      return null;
    }
  });

  const syncWithFirebaseCloud = async (): Promise<{ success: boolean; error?: string; timestamp?: string }> => {
    setFirebaseStatus('syncing');
    try {
      const result = await firebaseCloudService.pushAllToCloud({
        student,
        semesters,
        courses,
        activities,
        memories,
        goals,
        tasks,
        documents,
        feeRecords,
        quotes,
        auditLogs,
        lastSyncedAt: new Date().toISOString(),
      });

      if (result.success) {
        setFirebaseStatus('synced');
        const ts = result.timestamp || new Date().toLocaleTimeString();
        setLastCloudSyncTime(ts);
        localStorage.setItem(STORAGE_PREFIX + 'firebase_synced_at', ts);
        logAudit('SYNC', 'Settings', 'firebase-cloud', 'Firebase Firestore', undefined, 'Pushed academic ledger to Firestore', 'Cloud synchronization successful');
        return { success: true, timestamp: ts };
      } else {
        setFirebaseStatus('error');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setFirebaseStatus('error');
      return { success: false, error: err?.message || 'Firebase Cloud sync failed' };
    }
  };

  const pullFromFirebaseCloud = async (): Promise<{ success: boolean; error?: string }> => {
    setFirebaseStatus('syncing');
    try {
      const cloudData = await firebaseCloudService.pullFromCloud(student.studentId);
      if (!cloudData) {
        setFirebaseStatus('connected');
        return { success: false, error: 'No cloud record found for this Student ID' };
      }

      if (cloudData.student) setStudent(cloudData.student);
      if (cloudData.semesters && cloudData.semesters.length > 0) setSemesters(cloudData.semesters);
      if (cloudData.courses && cloudData.courses.length > 0) setCourses(cloudData.courses);
      if (cloudData.activities && cloudData.activities.length > 0) setActivities(cloudData.activities);
      if (cloudData.memories && cloudData.memories.length > 0) setMemories(cloudData.memories);
      if (cloudData.goals && cloudData.goals.length > 0) setGoals(cloudData.goals);
      if (cloudData.tasks && cloudData.tasks.length > 0) setTasks(cloudData.tasks);
      if (cloudData.feeRecords && cloudData.feeRecords.length > 0) setFeeRecords(cloudData.feeRecords);

      setFirebaseStatus('synced');
      const ts = new Date().toLocaleTimeString();
      setLastCloudSyncTime(ts);
      localStorage.setItem(STORAGE_PREFIX + 'firebase_synced_at', ts);
      logAudit('SYNC', 'Settings', 'firebase-cloud', 'Firebase Firestore', undefined, 'Pulled cloud records to local mirror', 'Cloud restoration successful');
      return { success: true };
    } catch (err: any) {
      setFirebaseStatus('error');
      return { success: false, error: err?.message || 'Failed to pull from Firebase' };
    }
  };

  // Load from IndexedDB and synchronise from PostgreSQL Fastify Backend on mount
  useEffect(() => {
    // Purge any stale legacy localStorage items from old versions
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('paos_') && !k.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    } catch {}

    const syncData = async () => {
      // 1. Instant local read from IndexedDB
      try {
        const storedStudent = await paosDB.getItem<StudentProfile>('student', 'current');
        if (storedStudent && storedStudent.university === 'Zamzam University of Science and Technology' && storedStudent.studentId === 'CIS231475') {
          setStudent(storedStudent);
        } else {
          setStudent(initialStudentProfile);
          paosDB.saveItem('student', { ...initialStudentProfile, id: 'current' });
        }

        const storedSemesters = await paosDB.getStore<Semester>('semesters');
        if (storedSemesters && storedSemesters.length > 0 && storedSemesters.some((s) => s.id === 'sem-6' && s.totalMarks === 561)) {
          setSemesters(storedSemesters);
        } else {
          setSemesters(initialSemesters);
          paosDB.saveStore('semesters', initialSemesters);
        }

        const storedCourses = await paosDB.getStore<Course>('courses');
        if (storedCourses && storedCourses.length > 0 && !storedCourses.some((c) => c.code === 'MOB 301' || c.code === 'AI 401' || c.code === 'SWE 402' || c.code === 'WE 403')) {
          setCourses(storedCourses);
        } else {
          setCourses(initialCourses);
          paosDB.saveStore('courses', initialCourses);
        }

        const storedActivities = await paosDB.getStore<Activity>('activities');
        if (storedActivities && storedActivities.length > 0) setActivities(storedActivities);

        const storedMemories = await paosDB.getStore<AcademicMemory>('memories');
        if (storedMemories && storedMemories.length > 0) setMemories(storedMemories);

        const storedAudit = await paosDB.getStore<AuditLogEntry>('auditLogs');
        if (storedAudit && storedAudit.length > 0) setAuditLogs(storedAudit);
      } catch (e) {
        console.warn('[PAOS] IndexedDB initial read fallback:', e);
      }

      // 2. Fetch authoritative data from Fastify PostgreSQL Backend
      try {
        const [
          serverStudent,
          serverSemesters,
          serverCourses,
          serverActivities,
          serverMemories,
          serverQuotes,
          serverGoals,
          serverTasks,
          serverDocuments,
          serverFees,
          serverAuditLogs,
        ] = await Promise.allSettled([
          api.getStudentMe(),
          api.getSemesters(),
          api.getCourses(),
          api.getActivities(),
          api.getMemories(),
          api.getQuotes(),
          api.getGoals(),
          api.getTasks(),
          api.getDocuments(),
          api.getFees(),
          api.getAuditLogs(),
        ]);

        if (serverStudent.status === 'fulfilled' && serverStudent.value) {
          setStudent({
            ...serverStudent.value,
            avatarUrl: '/mohamud.jpg',
          });
        }
        if (serverSemesters.status === 'fulfilled' && serverSemesters.value.length > 0) {
          setSemesters(serverSemesters.value);
        }
        if (serverCourses.status === 'fulfilled' && serverCourses.value.length > 0) {
          setCourses(serverCourses.value);
        }
        if (serverActivities.status === 'fulfilled' && serverActivities.value.length > 0) {
          setActivities(serverActivities.value);
        }
        if (serverMemories.status === 'fulfilled' && serverMemories.value.length > 0) {
          setMemories(serverMemories.value);
        }
        if (serverQuotes.status === 'fulfilled' && serverQuotes.value.length > 0) {
          setQuotes(serverQuotes.value);
        }
        if (serverGoals.status === 'fulfilled' && serverGoals.value.length > 0) {
          setGoals(serverGoals.value);
        }
        if (serverTasks.status === 'fulfilled' && serverTasks.value.length > 0) {
          setTasks(serverTasks.value);
        }
        if (serverDocuments.status === 'fulfilled' && serverDocuments.value.length > 0) {
          setDocuments(serverDocuments.value);
        }
        if (serverFees.status === 'fulfilled' && serverFees.value.length > 0) {
          setFeeRecords(serverFees.value);
        }
        if (serverAuditLogs.status === 'fulfilled' && serverAuditLogs.value.length > 0) {
          setAuditLogs(serverAuditLogs.value);
        }
      } catch (err) {
        console.info('[PAOS] Backend sync offline / using local IndexedDB mirror.');
      }
    };
    syncData();
  }, []);

  // Save to IndexedDB & fallback localStorage
  useEffect(() => {
    paosDB.saveItem('student', { ...student, id: 'current' });
    localStorage.setItem(STORAGE_PREFIX + 'student', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    paosDB.saveStore('semesters', semesters);
    localStorage.setItem(STORAGE_PREFIX + 'semesters', JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    paosDB.saveStore('courses', courses);
    localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    paosDB.saveStore('activities', activities);
    localStorage.setItem(STORAGE_PREFIX + 'activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    paosDB.saveStore('memories', memories);
    localStorage.setItem(STORAGE_PREFIX + 'memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    paosDB.saveStore('goals', goals);
    localStorage.setItem(STORAGE_PREFIX + 'goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    paosDB.saveStore('tasks', tasks);
    localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    paosDB.saveStore('documents', documents);
    localStorage.setItem(STORAGE_PREFIX + 'documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    paosDB.saveStore('feeRecords', feeRecords);
    localStorage.setItem(STORAGE_PREFIX + 'fees', JSON.stringify(feeRecords));
  }, [feeRecords]);

  useEffect(() => {
    paosDB.saveStore('timetable', timetable);
    localStorage.setItem(STORAGE_PREFIX + 'timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    paosDB.saveStore('courseNotes', courseNotes);
    localStorage.setItem(STORAGE_PREFIX + 'notes', JSON.stringify(courseNotes));
  }, [courseNotes]);

  useEffect(() => {
    paosDB.saveStore('gradeScale', gradeScale);
    localStorage.setItem(STORAGE_PREFIX + 'gradeScale', JSON.stringify(gradeScale));
  }, [gradeScale]);

  useEffect(() => {
    paosDB.saveStore('auditLogs', auditLogs);
    localStorage.setItem(STORAGE_PREFIX + 'auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem(STORAGE_PREFIX + 'dark', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'quotes', JSON.stringify(quotes));
  }, [quotes]);

  // Append-Only Audit Trail logger
  const logAudit = (
    action: AuditLogEntry['action'],
    entity: AuditLogEntry['entity'],
    entityId: string,
    entityName: string,
    oldValue?: string,
    newValue?: string,
    reason?: string
  ) => {
    const entry: AuditLogEntry = {
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      action,
      entity,
      entityId,
      entityName,
      oldValue,
      newValue,
      reason: reason || 'User action recorded in PAOS',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Keyboard shortcut listener (Ctrl+K or Cmd+K for Global Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter out soft-deleted items for standard view calculations
  const activeSemesters = useMemo(() => semesters.filter((s) => !s.isArchived), [semesters]);
  const activeCourses = useMemo(() => courses.filter((c) => !c.isArchived), [courses]);
  const activeActivities = useMemo(() => activities.filter((a) => !a.isArchived), [activities]);
  const activeMemories = useMemo(() => memories.filter((m) => !m.isArchived), [memories]);

  // GPA & Credit Calculations
  const { cgpa, completedCredits, totalRequiredCredits, remainingCredits, graduationProgress } = useMemo(() => {
    const { cgpa: calculatedCGPA, totalCompletedCredits: compCredits } = calculateCgpaFromLedger(activeCourses, activeSemesters);
    const reqCredits = student.totalRequiredCredits || 120;
    const remCredits = Math.max(0, reqCredits - compCredits);
    const gradProgress = reqCredits > 0 ? Math.min(100, Math.round((compCredits / reqCredits) * 100)) : 0;

    return {
      cgpa: calculatedCGPA,
      completedCredits: compCredits,
      totalRequiredCredits: reqCredits,
      remainingCredits: remCredits,
      graduationProgress: gradProgress,
    };
  }, [activeCourses, activeSemesters, student.totalRequiredCredits]);

  const currentSemester = useMemo(() => {
    return activeSemesters.find((s) => s.number === student.currentSemesterNumber) || activeSemesters.find((s) => s.status === 'Active');
  }, [activeSemesters, student.currentSemesterNumber]);

  const currentSemesterGpa = currentSemester?.gpa || 3.75;

  const activeSemesterCourses = useMemo(() => {
    if (!currentSemester) return [];
    return activeCourses.filter((c) => c.semesterId === currentSemester.id);
  }, [activeCourses, currentSemester]);

  const urgentDeadlines = useMemo(() => {
    return activeActivities
      .filter((a) => a.status !== 'Completed')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [activeActivities]);

  const nextExam = useMemo(() => {
    return activeActivities
      .filter((a) => (a.type === 'Midterm' || a.type === 'Final Exam') && a.status !== 'Completed')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
  }, [activeActivities]);

  const todaysTimetable = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
    const currentDay = days[new Date().getDay()];
    const todayItems = timetable.filter((t) => t.dayOfWeek === currentDay);
    return todayItems.length > 0 ? todayItems : timetable.filter((t) => t.dayOfWeek === 'Monday');
  }, [timetable]);

  const onThisDayMemories = useMemo(() => {
    return activeMemories.filter((m) => m.isPinned || m.importance === 'Milestone' || m.category === 'Achievement');
  }, [activeMemories]);

  const outstandingFees = useMemo(() => {
    return feeRecords.reduce((sum, f) => sum + (f.remainingAmount || 0), 0);
  }, [feeRecords]);

  const updateStudent = (profile: Partial<StudentProfile>) => {
    setStudent((prev) => {
      const updated = { ...prev, ...profile };
      logAudit('UPDATE', 'Profile', updated.studentId, updated.fullName, JSON.stringify(prev), JSON.stringify(updated), 'Student profile updated');
      return updated;
    });
  };

  const deduplicateSemesters = (list: Semester[]): Semester[] => {
    const map = new Map<number, Semester>();
    for (const s of list) {
      if (!s) continue;
      const num = s.number || 1;
      if (!map.has(num)) {
        map.set(num, s);
      } else {
        const existing = map.get(num)!;
        if (s.provenance === 'Verified' || (s.totalMarks && !existing.totalMarks) || (s.completedCredits > existing.completedCredits)) {
          map.set(num, { ...existing, ...s });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.number - b.number);
  };

  const addSemester = (sem: Omit<Semester, 'id'>) => {
    setSemesters((prev) => {
      const existingIndex = prev.findIndex(
        (s) => s.number === sem.number || s.name.trim().toLowerCase() === sem.name.trim().toLowerCase()
      );
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const updated: Semester = { ...existing, ...sem };
        logAudit('UPDATE', 'Semester', existing.id, updated.name, JSON.stringify(existing), JSON.stringify(updated), 'Updated existing semester (duplicate prevented)');
        return prev.map((s, idx) => (idx === existingIndex ? updated : s));
      }

      const id = 'sem-' + (sem.number || Date.now());
      const newSem: Semester = {
        ...sem,
        id,
        provenance: sem.provenance || 'Personal Record',
        sourceNote: sem.sourceNote || 'User-entered semester chapter',
      };
      logAudit('CREATE', 'Semester', id, newSem.name, undefined, `Created semester: ${newSem.name}`, 'Semester created');
      return deduplicateSemesters([...prev, newSem]);
    });
  };

  const updateSemester = (id: string, sem: Partial<Semester>) => {
    setSemesters((prev) => {
      const target = prev.find((s) => s.id === id);
      if (!target) return prev;

      // If number is changing, verify no conflict with another semester
      if (sem.number && sem.number !== target.number) {
        const conflict = prev.find((s) => s.id !== id && s.number === sem.number);
        if (conflict) {
          // Merge into conflict or prevent overwrite
          sem = { ...sem, number: target.number };
        }
      }

      const updatedList = prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...sem };
          logAudit('UPDATE', 'Semester', id, updated.name, JSON.stringify(s), JSON.stringify(updated), 'Semester updated');
          return updated;
        }
        return s;
      });
      return deduplicateSemesters(updatedList);
    });
  };

  const softDeleteSemester = (id: string, reason?: string) => {
    const sem = semesters.find((s) => s.id === id);
    if (!sem) return;
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isArchived: true, deletedAt: new Date().toISOString() } : s))
    );
    logAudit('SOFT_DELETE', 'Semester', id, sem.name, undefined, 'Soft-deleted / archived', reason || 'User requested semester archive');
  };

  const addCourse = (course: Omit<Course, 'id'>) => {
    const id = 'c-' + Date.now();
    const newCourse: Course = {
      ...course,
      id,
      provenance: course.provenance || 'Personal Record',
      sourceNote: course.sourceNote || 'User registered course',
    };
    setCourses((prev) => [...prev, newCourse]);
    logAudit('CREATE', 'Course', id, `${newCourse.code} - ${newCourse.name}`, undefined, `Added course ${newCourse.code}`, 'Course registered');
    api.createCourse(course).catch(() => {});
  };

  const updateCourse = (id: string, course: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...course };
          logAudit('UPDATE', 'Course', id, `${updated.code} - ${updated.name}`, JSON.stringify(c), JSON.stringify(updated), 'Course updated');
          return updated;
        }
        return c;
      })
    );
    api.updateCourse(id, course).catch(() => {});
  };

  const updateCourseAssessmentScheme = (courseId: string, scheme: AssessmentScheme) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updated = { ...c, assessmentScheme: scheme };
          logAudit('UPDATE', 'Course', courseId, `${c.code} Grading Scheme`, undefined, JSON.stringify(scheme), 'Custom assessment scheme updated');
          return updated;
        }
        return c;
      })
    );
  };

  const softDeleteCourse = (id: string, reason?: string) => {
    const course = courses.find((c) => c.id === id);
    if (!course) return;
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: true, deletedAt: new Date().toISOString() } : c))
    );
    logAudit('SOFT_DELETE', 'Course', id, `${course.code} - ${course.name}`, undefined, 'Soft-deleted / archived', reason || 'User archived course');
  };

  const addActivity = (act: Omit<Activity, 'id'>) => {
    const id = 'act-' + Date.now();
    const newAct: Activity = {
      ...act,
      id,
      provenance: act.provenance || 'Personal Record',
      sourceNote: act.sourceNote || 'Logged deliverable',
    };
    setActivities((prev) => [newAct, ...prev]);
    logAudit('CREATE', 'Activity', id, newAct.title, undefined, `Created ${newAct.type}: ${newAct.title}`, 'Activity created');
    api.createActivity(act).catch(() => {});
  };

  const updateActivity = (id: string, act: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...act };
          logAudit('UPDATE', 'Activity', id, updated.title, JSON.stringify(a), JSON.stringify(updated), 'Activity updated');
          return updated;
        }
        return a;
      })
    );
    api.updateActivity(id, act).catch(() => {});
  };

  const softDeleteActivity = (id: string, reason?: string) => {
    const act = activities.find((a) => a.id === id);
    if (!act) return;
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isArchived: true, deletedAt: new Date().toISOString() } : a))
    );
    logAudit('SOFT_DELETE', 'Activity', id, act.title, undefined, 'Soft-deleted activity', reason || 'User archived activity');
    api.deleteActivity(id).catch(() => {});
  };

  const toggleActivityComplete = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'Completed' ? 'In Progress' : 'Completed';
          const submittedAt = nextStatus === 'Completed' ? new Date().toISOString() : undefined;
          const updated = { ...a, status: nextStatus as Activity['status'], submittedAt };
          logAudit('UPDATE', 'Activity', id, a.title, `Status: ${a.status}`, `Status: ${nextStatus}`, 'Activity status toggled');
          api.updateActivity(id, { status: nextStatus as Activity['status'], submittedAt }).catch(() => {});
          return updated;
        }
        return a;
      })
    );
  };

  const addMemory = (mem: Omit<AcademicMemory, 'id' | 'createdAt'>) => {
    const id = 'mem-' + Date.now();
    const newMem: AcademicMemory = {
      ...mem,
      id,
      createdAt: new Date().toISOString(),
      provenance: mem.provenance || 'Personal Record',
      sourceNote: mem.sourceNote || 'Personal academic memory entry',
    };
    setMemories((prev) => [newMem, ...prev]);
    logAudit('CREATE', 'Memory', id, newMem.title, undefined, `Created memory: ${newMem.title}`, 'Academic memory added');
    api.createMemory(mem).catch(() => {});
  };

  const softDeleteMemory = (id: string, reason?: string) => {
    const mem = memories.find((m) => m.id === id);
    if (!mem) return;
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isArchived: true, deletedAt: new Date().toISOString() } : m))
    );
    logAudit('SOFT_DELETE', 'Memory', id, mem.title, undefined, 'Soft-deleted memory', reason || 'User archived memory');
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const id = 'goal-' + Date.now();
    const newGoal: Goal = {
      ...goal,
      id,
      createdAt: new Date().toISOString(),
      provenance: goal.provenance || 'Personal Record',
    };
    setGoals((prev) => [newGoal, ...prev]);
    logAudit('CREATE', 'Goal', id, newGoal.title, undefined, `Created goal: ${newGoal.title}`, 'Academic goal added');
  };

  const updateGoal = (id: string, goal: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...goal };
          logAudit('UPDATE', 'Goal', id, updated.title, JSON.stringify(g), JSON.stringify(updated), 'Goal updated');
          return updated;
        }
        return g;
      })
    );
  };

  const softDeleteGoal = (id: string, reason?: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isArchived: true, deletedAt: new Date().toISOString() } : g))
    );
    logAudit('SOFT_DELETE', 'Goal', id, goal.title, undefined, 'Soft-deleted goal', reason || 'User archived goal');
  };

  const addTask = (task: Omit<AcademicTask, 'id' | 'createdAt'>) => {
    const id = 'task-' + Date.now();
    const newTask: AcademicTask = {
      ...task,
      id,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, task: Partial<AcademicTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...task } : t)));
  };

  const softDeleteTask = (id: string, reason?: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isArchived: true, deletedAt: new Date().toISOString() } : t))
    );
    logAudit('SOFT_DELETE', 'Settings', id, task.title, undefined, 'Soft-deleted task', reason || 'User archived task');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const addDocument = (doc: Omit<DocumentItem, 'id'>) => {
    const id = 'doc-' + Date.now();
    const newDoc: DocumentItem = {
      ...doc,
      id,
      provenance: doc.provenance || 'Verified',
      sourceNote: doc.sourceNote || 'Uploaded academic artifact',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    logAudit('CREATE', 'Document', id, newDoc.name, undefined, `Uploaded document ${newDoc.name}`, 'Document vault addition');
  };

  const softDeleteDocument = (id: string, reason?: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isArchived: true, deletedAt: new Date().toISOString() } : d))
    );
    logAudit('SOFT_DELETE', 'Document', id, doc.name, undefined, 'Soft-deleted document', reason || 'User archived document');
  };

  const addPayment = (feeId: string, payment: Omit<PaymentItem, 'id'>) => {
    const pId = 'pay-' + Date.now();
    const newPayment: PaymentItem = { ...payment, id: pId };
    setFeeRecords((prev) =>
      prev.map((f) => {
        if (f.id === feeId) {
          const updatedPaid = f.paidAmount + payment.amount;
          const updatedRemaining = Math.max(0, f.totalFee - updatedPaid);
          const updatedStatus = updatedRemaining === 0 ? 'Paid' : 'Partial';
          const updated = {
            ...f,
            paidAmount: updatedPaid,
            remainingAmount: updatedRemaining,
            status: updatedStatus as FeeRecord['status'],
            payments: [newPayment, ...f.payments],
          };
          logAudit('UPDATE', 'Settings', f.id, `Tuition Fee ${f.academicYear}`, undefined, `Payment recorded: $${payment.amount}`, 'Tuition payment');
          return updated;
        }
        return f;
      })
    );
  };

  const addCourseNote = (note: Omit<CourseNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = 'note-' + Date.now();
    const now = new Date().toISOString();
    const newNote: CourseNote = { ...note, id, createdAt: now, updatedAt: now };
    setCourseNotes((prev) => [newNote, ...prev]);
  };

  const updateCourseNote = (id: string, note: Partial<CourseNote>) => {
    setCourseNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...note, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteCourseNote = (id: string) => {
    setCourseNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateGradeScale = (scale: GradeScaleItem[]) => {
    setGradeScale(scale);
    logAudit('UPDATE', 'Settings', 'grade-scale', 'Grading Scale Rules', undefined, 'Grading scale reconfigured', 'Academic rules updated');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Safe Backup & Restore Pipeline
  const exportDataJSON = (): string => {
    const fullBackup = {
      edition: 'PAOS v1.1 Academic Memory Edition (AME)',
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      student,
      semesters,
      courses,
      activities,
      memories,
      goals,
      tasks,
      documents,
      feeRecords,
      timetable,
      courseNotes,
      gradeScale,
      auditLogs,
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const validateBackupJSON = (jsonString: string): BackupValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const data = JSON.parse(jsonString);

      if (!data || typeof data !== 'object') {
        return {
          isValid: false,
          edition: 'Unknown',
          schemaVersion: 0,
          exportedAt: new Date().toISOString(),
          entityCounts: { semesters: 0, courses: 0, activities: 0, memories: 0, goals: 0, tasks: 0, documents: 0, auditLogs: 0 },
          errors: ['Invalid JSON format or empty archive payload.'],
          warnings: [],
        };
      }

      if (!data.student || !data.student.studentId) {
        errors.push('Archive missing valid Student Profile (studentId).');
      }

      if (!Array.isArray(data.semesters)) {
        errors.push('Archive missing Semesters collection.');
      }

      if (!Array.isArray(data.courses)) {
        errors.push('Archive missing Courses collection.');
      }

      const entityCounts = {
        semesters: Array.isArray(data.semesters) ? data.semesters.length : 0,
        courses: Array.isArray(data.courses) ? data.courses.length : 0,
        activities: Array.isArray(data.activities) ? data.activities.length : 0,
        memories: Array.isArray(data.memories) ? data.memories.length : 0,
        goals: Array.isArray(data.goals) ? data.goals.length : 0,
        tasks: Array.isArray(data.tasks) ? data.tasks.length : 0,
        documents: Array.isArray(data.documents) ? data.documents.length : 0,
        auditLogs: Array.isArray(data.auditLogs) ? data.auditLogs.length : 0,
      };

      if (entityCounts.semesters === 0) warnings.push('Archive contains 0 semesters.');
      if (entityCounts.courses === 0) warnings.push('Archive contains 0 courses.');

      return {
        isValid: errors.length === 0,
        edition: data.edition || 'PAOS Legacy',
        schemaVersion: data.schemaVersion || 1,
        exportedAt: data.exportedAt || 'Unknown Date',
        entityCounts,
        errors,
        warnings,
      };
    } catch (e: any) {
      return {
        isValid: false,
        edition: 'Corrupt',
        schemaVersion: 0,
        exportedAt: new Date().toISOString(),
        entityCounts: { semesters: 0, courses: 0, activities: 0, memories: 0, goals: 0, tasks: 0, documents: 0, auditLogs: 0 },
        errors: ['Syntax error in JSON string: ' + (e.message || 'Malformed text')],
        warnings: [],
      };
    }
  };

  const restoreBackupSafely = async (jsonString: string): Promise<{ success: boolean; snapshotId: string; error?: string }> => {
    const validation = validateBackupJSON(jsonString);
    if (!validation.isValid) {
      return { success: false, snapshotId: '', error: validation.errors.join('; ') };
    }

    try {
      // 1. Automatic pre-restore snapshot
      const currentDB = {
        student,
        semesters,
        courses,
        activities,
        memories,
        goals,
        tasks,
        documents,
        feeRecords,
        timetable,
        courseNotes,
        gradeScale,
        auditLogs,
      };
      const snapshotId = await paosDB.createSnapshot('Automated Pre-Restore Snapshot', currentDB);

      // 2. Parse & apply
      const data = JSON.parse(jsonString);
      if (data.student) setStudent(data.student);
      if (data.semesters) setSemesters(data.semesters);
      if (data.courses) setCourses(data.courses);
      if (data.activities) setActivities(data.activities);
      if (data.memories) setMemories(data.memories);
      if (data.goals) setGoals(data.goals);
      if (data.tasks) setTasks(data.tasks);
      if (data.documents) setDocuments(data.documents);
      if (data.feeRecords) setFeeRecords(data.feeRecords);
      if (data.timetable) setTimetable(data.timetable);
      if (data.courseNotes) setCourseNotes(data.courseNotes);
      if (data.gradeScale) setGradeScale(data.gradeScale);
      if (data.auditLogs) setAuditLogs(data.auditLogs);

      logAudit(
        'RESTORE',
        'Settings',
        snapshotId,
        'Safe Database Restore',
        undefined,
        `Restored ${validation.entityCounts.courses} courses, ${validation.entityCounts.semesters} semesters`,
        `Restore completed safely. Pre-restore snapshot ID: ${snapshotId}`
      );

      return { success: true, snapshotId };
    } catch (e: any) {
      return { success: false, snapshotId: '', error: e.message || 'Failed to restore database.' };
    }
  };

  const resetAllData = async (): Promise<string> => {
    const currentDB = { student, semesters, courses, activities, memories, goals, tasks, documents, feeRecords, timetable, courseNotes, gradeScale, auditLogs };
    const snapshotId = await paosDB.createSnapshot('Pre-Reset Factory Snapshot', currentDB);

    setStudent(initialStudentProfile);
    setSemesters(initialSemesters);
    setCourses(initialCourses);
    setActivities(initialActivities);
    setMemories(initialMemories);
    setGoals(initialGoals);
    setTasks(initialTasks);
    setDocuments(initialDocuments);
    setFeeRecords(initialFeeRecords);
    setTimetable(initialTimetable);
    setCourseNotes(initialCourseNotes);
    setGradeScale(defaultGradeScale);
    setAuditLogs(initialAuditLogs);
    setNotifications(initialNotifications);
    logAudit('RESTORE', 'Settings', 'reset-default', 'Factory Reset', undefined, 'Reset all data to default seed records', `System reset. Snapshot ID: ${snapshotId}`);
    return snapshotId;
  };

  // Auth methods
  const loginAsStudent = (studentId: string, pass: string): boolean => {
    if (!studentId || !pass) return false;
    const cleanId = studentId.toUpperCase().trim();
    if (cleanId === student.studentId.toUpperCase() || cleanId === 'CIS231475') {
      setCurrentRole('student');
      logAudit('CREATE', 'Profile', student.studentId, student.fullName, undefined, 'Student session started', 'Student authenticated into Personal Portal');
      return true;
    }
    return false;
  };

  const loginAsAdmin = (adminId: string, pass: string): boolean => {
    if (!adminId || !pass) return false;
    const clean = adminId.toLowerCase().trim();
    if (clean === 'admin' || clean === 'admin@paos.academic' || clean === 'admin@zamzam.edu.so') {
      setCurrentRole('admin');
      logAudit('CREATE', 'Settings', 'admin-session', 'Admin Master Session', undefined, 'Admin session started', 'Administrator authenticated into Management Console');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentRole('guest');
  };

  // Quotes CRUD methods
  const addQuote = (q: Omit<DailyQuote, 'id' | 'createdAt'>) => {
    const newQuote: DailyQuote = {
      ...q,
      id: `quote-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setQuotes((prev) => [newQuote, ...prev]);
    logAudit('CREATE', 'Settings', newQuote.id, `Daily Quote (${newQuote.category})`, undefined, newQuote.quote, `Added daily quote in category ${newQuote.category}`);
    api.createQuote(q).catch(() => {});
  };

  const updateQuote = (id: string, updated: Partial<DailyQuote>) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, ...updated } : q)));
    logAudit('UPDATE', 'Settings', id, 'Daily Quote', undefined, JSON.stringify(updated), 'Updated daily motivation quote');
    api.updateQuote(id, updated).catch(() => {});
  };

  const deleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    logAudit('DELETE', 'Settings', id, 'Daily Quote', undefined, undefined, 'Deleted daily quote');
    api.deleteQuote(id).catch(() => {});
  };

  // Admin Course Result Management
  const updateCourseResult = (
    courseId: string,
    data: { totalScore?: number; grade?: string; gradePoint?: number; provenance?: RecordProvenance; sourceNote?: string }
  ) => {
    const existing = courses.find((c) => c.id === courseId);
    if (!existing) return;

    const oldStr = `Grade: ${existing.grade || 'None'}, GP: ${existing.gradePoint !== undefined ? existing.gradePoint : 'None'}, Score: ${existing.totalScore !== undefined ? existing.totalScore : 'None'}`;
    const newStr = `Grade: ${data.grade !== undefined ? data.grade : existing.grade || 'None'}, GP: ${data.gradePoint !== undefined ? data.gradePoint : existing.gradePoint || 'None'}, Score: ${data.totalScore !== undefined ? data.totalScore : existing.totalScore || 'None'}`;

    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              totalScore: data.totalScore !== undefined ? data.totalScore : c.totalScore,
              grade: data.grade !== undefined ? data.grade : c.grade,
              gradePoint: data.gradePoint !== undefined ? data.gradePoint : c.gradePoint,
              provenance: data.provenance || c.provenance || 'Verified',
              sourceNote: data.sourceNote || c.sourceNote || 'Updated via Admin Console',
            }
          : c
      )
    );

    logAudit('UPDATE', 'Grade', courseId, existing.name, oldStr, newStr, `Admin modified official course results for ${existing.code} - ${existing.name}`);
    api.updateCourseResults(courseId, data).catch(() => {});
  };

  return (
    <AcademicContext.Provider
      value={{
        student,
        semesters,
        courses,
        activities,
        memories,
        goals,
        tasks,
        documents,
        feeRecords,
        timetable,
        courseNotes,
        gradeScale,
        auditLogs,
        notifications,
        activeTab,
        setActiveTab,
        selectedSemesterId,
        setSelectedSemesterId,
        selectedCourseId,
        setSelectedCourseId,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuditModalOpen,
        setIsAuditModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isDarkMode,
        setIsDarkMode,
        isAuthenticated,
        cgpa,
        currentSemesterGpa,
        completedCredits,
        totalRequiredCredits,
        remainingCredits,
        graduationProgress,
        currentSemester,
        activeSemesterCourses,
        urgentDeadlines,
        nextExam,
        todaysTimetable,
        onThisDayMemories,
        outstandingFees,
        updateStudent,
        addSemester,
        updateSemester,
        deleteSemester: softDeleteSemester,
        softDeleteSemester,
        addCourse,
        updateCourse,
        deleteCourse: softDeleteCourse,
        softDeleteCourse,
        updateCourseAssessmentScheme,
        addActivity,
        updateActivity,
        deleteActivity: softDeleteActivity,
        softDeleteActivity,
        toggleActivityComplete,
        addMemory,
        deleteMemory: softDeleteMemory,
        softDeleteMemory,
        addGoal,
        updateGoal,
        deleteGoal: softDeleteGoal,
        softDeleteGoal,
        addTask,
        updateTask,
        deleteTask: softDeleteTask,
        softDeleteTask,
        toggleTaskStatus,
        addDocument,
        deleteDocument: softDeleteDocument,
        softDeleteDocument,
        addPayment,
        addCourseNote,
        updateCourseNote,
        deleteCourseNote,
        updateGradeScale,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        currentRole,
        setCurrentRole,
        loginAsStudent,
        loginAsAdmin,
        logout,
        quotes,
        addQuote,
        updateQuote,
        deleteQuote,
        updateCourseResult,
        exportDataJSON,
        validateBackupJSON,
        restoreBackupSafely,
        resetAllData,
        firebaseStatus,
        lastCloudSyncTime,
        syncWithFirebaseCloud,
        pullFromFirebaseCloud,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
