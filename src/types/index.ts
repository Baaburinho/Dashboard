export type SemesterStatus = 'Planned' | 'Active' | 'Completed' | 'Archived';

export type ActivityType =
  | 'Assignment'
  | 'Quiz'
  | 'Midterm'
  | 'Final Exam'
  | 'Project'
  | 'Presentation'
  | 'Lab'
  | 'Attendance'
  | 'Other';

export type ActivityStatus = 'Planned' | 'In Progress' | 'Submitted' | 'Completed' | 'Overdue';

export type Priority = 'Critical' | 'High' | 'Normal' | 'Low';

export type MemoryCategory =
  | 'Achievement'
  | 'Milestone'
  | 'Course Completion'
  | 'Personal Reflection'
  | 'Event';

export type MemoryImportance = 'Low' | 'Normal' | 'Important' | 'Milestone';

export type RecordProvenance = 'Verified' | 'Personal Record' | 'Seeded' | 'Unverified';

export type QuoteCategory =
  | 'Discipline'
  | 'Consistency'
  | 'Learning'
  | 'Academic Excellence'
  | 'Resilience'
  | 'Focus'
  | 'Leadership'
  | 'Patience'
  | 'Growth'
  | 'Future';

export type UserRole = 'guest' | 'student' | 'admin';

export interface DailyQuote {
  id: string;
  quote: string;
  author: string;
  category: QuoteCategory;
  createdAt?: string;
  isArchived?: boolean;
}

export interface StudentProfile {
  studentId: string;
  fullName: string;
  avatarUrl: string;
  program: string;
  faculty: string;
  department: string;
  classBatch?: string;
  period?: string;
  university: string;
  currentSemesterNumber: number;
  academicYear: string;
  enrollmentYear: string;
  expectedGraduation: string;
  totalRequiredCredits: number;
  completedCredits: number;
  remainingCredits: number;
  email?: string;
  phone?: string;
  academicStanding?: string;
}

export interface GradeScaleItem {
  id?: string;
  grade: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
  description: string;
}

export interface Activity {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  semesterId: string;
  title: string;
  type: ActivityType;
  description?: string;
  deadline: string;
  status: ActivityStatus;
  priority: Priority;
  score?: number;
  maxScore?: number;
  weightPercentage?: number;
  notes?: string;
  submittedAt?: string;
  provenance?: RecordProvenance;
  sourceNote?: string;
  isArchived?: boolean;
  deletedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  topic?: string;
}

export interface CourseNote {
  id: string;
  courseId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  deletedAt?: string;
}

export interface AssessmentScheme {
  courseworkWeight: number;
  midtermWeight: number;
  finalWeight: number;
  labWeight: number;
  quizzesWeight?: number;
}

export interface Course {
  id: string;
  semesterId: string;
  code: string;
  name: string;
  creditHours: number;
  lecturer: string;
  room?: string;
  schedule?: string;
  status: 'Planned' | 'Registered' | 'Active' | 'Completed' | 'Archived';
  progressPercentage: number;
  grade?: string;
  gradePoint?: number;
  totalScore?: number;
  midtermScore?: number;
  activityScore?: number;
  finalScore?: number;
  syllabus?: string;
  attendancePresent?: number;
  attendanceTotal?: number;
  isEditableSample?: boolean;
  assessmentScheme?: AssessmentScheme;
  provenance?: RecordProvenance;
  sourceNote?: string;
  isArchived?: boolean;
  deletedAt?: string;
}

export interface Semester {
  id: string;
  number: number;
  name: string;
  academicYear: string;
  status: SemesterStatus;
  gpa?: number;
  academicRank?: string;
  totalCredits: number;
  completedCredits: number;
  totalMarks?: number;
  maxMarks?: number;
  marksAverage?: number;
  activitiesAverage?: number;
  attendancePresent?: number;
  attendanceTotal?: number;
  classRankDetail?: string;
  startDate: string;
  endDate: string;
  summaryNote?: string;
  reflectionQuote?: string;
  isEditableSample?: boolean;
  provenance?: RecordProvenance;
  sourceNote?: string;
  isArchived?: boolean;
  deletedAt?: string;
}

export interface AcademicMemory {
  id: string;
  studentId: string;
  title: string;
  description: string;
  category: MemoryCategory;
  importance: MemoryImportance;
  semesterNumber?: number;
  semesterName?: string;
  courseId?: string;
  courseName?: string;
  date: string;
  isHistoricalUserEntered?: boolean;
  isPinned?: boolean;
  tags?: string[];
  createdAt: string;
  provenance: RecordProvenance;
  sourceNote: string; // e.g. "Personal record", "Uploaded Certificate: doc-2", "Grade sheet"
  isArchived?: boolean;
  deletedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetSemester?: number;
  deadline?: string;
  progressPercentage: number;
  category: 'GPA' | 'Skill' | 'Project' | 'Attendance' | 'Career' | 'Personal';
  status: 'In Progress' | 'Achieved' | 'Deferred';
  createdAt: string;
  provenance?: RecordProvenance;
  isArchived?: boolean;
  deletedAt?: string;
}

export interface AcademicTask {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: Priority;
  category: 'CV' | 'Research' | 'Self Study' | 'University' | 'Other';
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
  isArchived?: boolean;
  deletedAt?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'Transcript' | 'Certificate' | 'Student ID' | 'Registration' | 'Syllabus' | 'Letter' | 'Project' | 'Other';
  semesterNumber?: number;
  courseName?: string;
  date: string;
  fileSize: string;
  fileUrl?: string;
  description?: string;
  isSelfArchived?: boolean;
  provenance?: RecordProvenance;
  sourceNote?: string;
  isArchived?: boolean;
  deletedAt?: string;
}

export interface FeeRecord {
  id: string;
  academicYear: string;
  semesterNumber: number;
  totalFee: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Upcoming';
  payments: PaymentItem[];
  isArchived?: boolean;
  deletedAt?: string;
}

export interface PaymentItem {
  id: string;
  date: string;
  amount: number;
  receiptNumber: string;
  method: string;
  notes?: string;
}

export interface TimetableSlot {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'CALCULATE' | 'SOFT_DELETE' | 'SCHEMA_MIGRATION' | 'SYNC' | 'CLOUD_SYNC';
  entity: 'Course' | 'Grade' | 'Semester' | 'Activity' | 'Memory' | 'Goal' | 'Profile' | 'Document' | 'Settings' | 'Schema' | 'Cloud';
  entityId: string;
  entityName: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Academic' | 'Deadline' | 'Exam' | 'Memory' | 'Achievement' | 'System';
  priority: Priority;
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
}

export interface BackupValidationResult {
  isValid: boolean;
  edition: string;
  schemaVersion: number;
  exportedAt: string;
  entityCounts: {
    semesters: number;
    courses: number;
    activities: number;
    memories: number;
    goals: number;
    tasks: number;
    documents: number;
    auditLogs: number;
  };
  errors: string[];
  warnings: string[];
}
