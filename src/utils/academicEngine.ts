import { Course, Semester } from '../types';

/**
 * PAOS Academic Calculation & Integrity Engine
 * 
 * Enforces strict mathematical cross-record consistency between
 * individual course results, credit hours, grade points, and semester/cumulative GPA.
 */

export interface SemesterIntegrityResult {
  hasConflict: boolean;
  storedGpa: number | null;
  calculatedGpa: number;
  totalCredits: number;
  qualityPoints: number;
  gradedCoursesCount: number;
  message?: string;
}

export function calculateSemesterGpa(courses: Course[]): {
  calculatedGpa: number;
  totalCredits: number;
  qualityPoints: number;
  gradedCoursesCount: number;
} {
  const activeAndCompleted = courses.filter((c) => !c.isArchived && c.status === 'Completed');

  let qualityPoints = 0;
  let totalCredits = 0;
  let gradedCoursesCount = 0;

  for (const course of activeAndCompleted) {
    if (course.gradePoint !== undefined && course.gradePoint !== null) {
      const ch = course.creditHours || 3;
      qualityPoints += course.gradePoint * ch;
      totalCredits += ch;
      gradedCoursesCount++;
    }
  }

  const calculatedGpa = totalCredits > 0 ? parseFloat((qualityPoints / totalCredits).toFixed(2)) : 0;

  return {
    calculatedGpa,
    totalCredits,
    qualityPoints,
    gradedCoursesCount,
  };
}

export function checkSemesterIntegrity(
  semester: Semester | null | undefined,
  courses: Course[]
): SemesterIntegrityResult {
  if (!semester) {
    return {
      hasConflict: false,
      storedGpa: null,
      calculatedGpa: 0,
      totalCredits: 0,
      qualityPoints: 0,
      gradedCoursesCount: 0,
    };
  }

  const semesterCourses = courses.filter((c) => c.semesterId === semester.id && !c.isArchived);
  const { calculatedGpa, totalCredits, qualityPoints, gradedCoursesCount } = calculateSemesterGpa(semesterCourses);

  const storedGpa = semester.gpa !== undefined && semester.gpa !== null ? semester.gpa : null;

  // Conflict exists if semester has graded courses AND stored GPA differs from calculated GPA by > 0.01
  const hasConflict =
    gradedCoursesCount > 0 &&
    storedGpa !== null &&
    Math.abs(storedGpa - calculatedGpa) > 0.01;

  const message = hasConflict
    ? `Data Integrity Conflict: Stored metadata recorded Term GPA ${storedGpa.toFixed(2)}, but mathematical calculation from ${gradedCoursesCount} course records yields ${calculatedGpa.toFixed(2)} (${qualityPoints} GP / ${totalCredits} CH).`
    : undefined;

  return {
    hasConflict,
    storedGpa,
    calculatedGpa,
    totalCredits,
    qualityPoints,
    gradedCoursesCount,
    message,
  };
}

export function calculateCgpaFromLedger(
  courses: Course[],
  semesters: Semester[]
): { cgpa: number; totalCompletedCredits: number } {
  const completedCourses = courses.filter((c) => !c.isArchived && c.status === 'Completed');

  let qualityPoints = 0;
  let totalCredits = 0;

  for (const course of completedCourses) {
    if (course.gradePoint !== undefined && course.gradePoint !== null) {
      const ch = course.creditHours || 3;
      qualityPoints += course.gradePoint * ch;
      totalCredits += ch;
    }
  }

  if (totalCredits > 0) {
    return {
      cgpa: parseFloat((qualityPoints / totalCredits).toFixed(2)),
      totalCompletedCredits: totalCredits,
    };
  }

  // Fallback to semester-level weighted calculation
  const completedSemesters = semesters.filter(
    (s) => !s.isArchived && s.status === 'Completed' && s.gpa !== undefined && s.gpa !== null
  );

  let semPoints = 0;
  let semCredits = 0;

  for (const sem of completedSemesters) {
    const ch = sem.completedCredits || sem.totalCredits || 18;
    semPoints += (sem.gpa || 0) * ch;
    semCredits += ch;
  }

  const cgpa = semCredits > 0 ? parseFloat((semPoints / semCredits).toFixed(2)) : 0;
  return {
    cgpa,
    totalCompletedCredits: semCredits,
  };
}
