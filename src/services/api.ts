import {
  StudentProfile,
  Semester,
  Course,
  Activity,
  AcademicMemory,
  DailyQuote,
  Goal,
  AcademicTask,
  DocumentItem,
  FeeRecord,
  TimetableSlot,
  CourseNote,
  AuditLogEntry,
  RecordProvenance
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: 'API Error' }));
    throw new Error(errorBody.error || `HTTP error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth & Student
  login: async (identifier: string, pass: string) => {
    return fetchJSON<{ success: boolean; role: 'student' | 'admin'; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password: pass }),
    });
  },

  getStudentMe: async (): Promise<StudentProfile> => {
    return fetchJSON<StudentProfile>('/student/me');
  },

  updateStudentProfile: async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    return fetchJSON<StudentProfile>('/student/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Dashboard calculations
  getDashboard: async () => {
    return fetchJSON<any>('/dashboard');
  },

  // Semesters (S1–S8)
  getSemesters: async (): Promise<Semester[]> => {
    return fetchJSON<Semester[]>('/semesters');
  },

  createSemester: async (data: Omit<Semester, 'id'>): Promise<Semester> => {
    return fetchJSON<Semester>('/semesters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateSemester: async (id: string, data: Partial<Semester>): Promise<Semester> => {
    return fetchJSON<Semester>(`/semesters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Courses & Results
  getCourses: async (): Promise<Course[]> => {
    return fetchJSON<Course[]>('/courses');
  },

  createCourse: async (data: Omit<Course, 'id'>): Promise<Course> => {
    return fetchJSON<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCourse: async (id: string, data: Partial<Course>): Promise<Course> => {
    return fetchJSON<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateCourseResults: async (
    id: string,
    data: { totalScore?: number; grade?: string; gradePoint?: number; provenance?: RecordProvenance; sourceNote?: string }
  ): Promise<Course> => {
    return fetchJSON<Course>(`/courses/${id}/results`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Activities / Deliverables
  getActivities: async (): Promise<Activity[]> => {
    return fetchJSON<Activity[]>('/activities');
  },

  createActivity: async (data: Omit<Activity, 'id'>): Promise<Activity> => {
    return fetchJSON<Activity>('/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateActivity: async (id: string, data: Partial<Activity>): Promise<Activity> => {
    return fetchJSON<Activity>(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteActivity: async (id: string): Promise<{ success: boolean; id: string }> => {
    return fetchJSON<{ success: boolean; id: string }>(`/activities/${id}`, {
      method: 'DELETE',
    });
  },

  // Memories
  getMemories: async (): Promise<AcademicMemory[]> => {
    return fetchJSON<AcademicMemory[]>('/memories');
  },

  createMemory: async (data: Omit<AcademicMemory, 'id' | 'createdAt'>): Promise<AcademicMemory> => {
    return fetchJSON<AcademicMemory>('/memories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteMemory: async (id: string): Promise<{ success: boolean; id: string }> => {
    return fetchJSON<{ success: boolean; id: string }>(`/memories/${id}`, {
      method: 'DELETE',
    });
  },

  // Daily Motivation Quotes
  getTodayQuote: async (): Promise<DailyQuote> => {
    return fetchJSON<DailyQuote>('/quotes/today');
  },

  getQuotes: async (): Promise<DailyQuote[]> => {
    return fetchJSON<DailyQuote[]>('/quotes');
  },

  createQuote: async (data: Omit<DailyQuote, 'id' | 'createdAt'>): Promise<DailyQuote> => {
    return fetchJSON<DailyQuote>('/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateQuote: async (id: string, data: Partial<DailyQuote>): Promise<DailyQuote> => {
    return fetchJSON<DailyQuote>(`/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteQuote: async (id: string): Promise<{ success: boolean; id: string }> => {
    return fetchJSON<{ success: boolean; id: string }>(`/quotes/${id}`, {
      method: 'DELETE',
    });
  },

  // Goals & Tasks
  getGoals: async (): Promise<Goal[]> => {
    return fetchJSON<Goal[]>('/goals');
  },

  createGoal: async (data: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> => {
    return fetchJSON<Goal>('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getTasks: async (): Promise<AcademicTask[]> => {
    return fetchJSON<AcademicTask[]>('/tasks');
  },

  createTask: async (data: Omit<AcademicTask, 'id' | 'createdAt'>): Promise<AcademicTask> => {
    return fetchJSON<AcademicTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTask: async (id: string, data: Partial<AcademicTask>): Promise<AcademicTask> => {
    return fetchJSON<AcademicTask>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Documents
  getDocuments: async (): Promise<DocumentItem[]> => {
    return fetchJSON<DocumentItem[]>('/documents');
  },

  createDocument: async (data: Omit<DocumentItem, 'id'>): Promise<DocumentItem> => {
    return fetchJSON<DocumentItem>('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteDocument: async (id: string): Promise<{ success: boolean; id: string }> => {
    return fetchJSON<{ success: boolean; id: string }>(`/documents/${id}`, {
      method: 'DELETE',
    });
  },

  // Fees
  getFees: async (): Promise<FeeRecord[]> => {
    return fetchJSON<FeeRecord[]>('/fees');
  },

  recordPayment: async (feeId: string, data: { amount: number; method?: string; note?: string }): Promise<any> => {
    return fetchJSON(`/fees/${feeId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Timetable & Notes
  getTimetable: async (): Promise<TimetableSlot[]> => {
    return fetchJSON<TimetableSlot[]>('/timetable');
  },

  getNotes: async (): Promise<CourseNote[]> => {
    return fetchJSON<CourseNote[]>('/notes');
  },

  createNote: async (data: Omit<CourseNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<CourseNote> => {
    return fetchJSON<CourseNote>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Audit logs
  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    return fetchJSON<AuditLogEntry[]>('/audit-logs');
  },

  createAuditLog: async (data: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> => {
    return fetchJSON<AuditLogEntry>('/audit-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // System
  exportSystemData: async (): Promise<any> => {
    return fetchJSON('/system/export');
  },

  restoreSystemData: async (data: any): Promise<{ success: boolean; snapshotId: string }> => {
    return fetchJSON('/system/restore', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
