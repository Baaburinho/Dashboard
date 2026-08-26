import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { prisma } from '../db';

export async function dashboardRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/dashboard
  fastify.get('/dashboard', async (request, reply) => {
    const student = await prisma.studentProfile.findFirst({
      where: { studentId: 'CIS231475' },
    });

    const semesters = await prisma.semester.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      orderBy: { number: 'asc' },
    });

    const courses = await prisma.course.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
    });

    const activities = await prisma.activity.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
    });

    // 1. Dynamic calculation of completed credits from database
    const completedCourses = courses.filter((c) => c.status === 'Completed');
    let totalCompletedCredits = completedCourses.reduce((sum, c) => sum + (c.creditHours || 0), 0);

    if (totalCompletedCredits === 0) {
      const completedSemesters = semesters.filter((s) => s.status === 'Completed');
      totalCompletedCredits = completedSemesters.reduce((sum, s) => sum + (s.completedCredits || s.totalCredits || 0), 0);
    }

    // 2. Dynamic CGPA calculation from weighted course grades / completed semesters
    let totalQualityPoints = 0;
    let totalGradedCredits = 0;

    for (const c of completedCourses) {
      if (c.gradePoint !== null && c.gradePoint !== undefined) {
        totalQualityPoints += c.gradePoint * c.creditHours;
        totalGradedCredits += c.creditHours;
      }
    }

    let cgpa = 0;
    if (totalGradedCredits > 0) {
      cgpa = parseFloat((totalQualityPoints / totalGradedCredits).toFixed(2));
    } else {
      const gradedSemesters = semesters.filter((s) => s.status === 'Completed' && s.gpa !== null && s.gpa !== undefined);
      let semPoints = 0;
      let semCredits = 0;
      for (const sem of gradedSemesters) {
        const credits = sem.completedCredits || sem.totalCredits || 0;
        semPoints += (sem.gpa || 0) * credits;
        semCredits += credits;
      }
      cgpa = semCredits > 0 ? parseFloat((semPoints / semCredits).toFixed(2)) : 0;
    }

    // 3. Degree credits and graduation progress
    const totalRequiredCredits = student?.totalRequiredCredits || 0;
    const remainingCredits = Math.max(0, totalRequiredCredits - totalCompletedCredits);
    const graduationProgress = totalRequiredCredits > 0 ? Math.min(100, Math.round((totalCompletedCredits / totalRequiredCredits) * 100)) : 0;

    // 4. Past Milestone (Most recently completed chapter)
    const lastCompletedSemester = semesters
      .filter((s) => s.status === 'Completed')
      .sort((a, b) => b.number - a.number)[0] || null;

    let pastChapterGpa = lastCompletedSemester?.gpa || null;
    let pastIntegrityConflict = false;

    if (lastCompletedSemester) {
      const pastCourses = courses.filter((c) => c.semesterId === lastCompletedSemester.id && c.status === 'Completed' && !c.isArchived);
      let pPoints = 0;
      let pCredits = 0;
      for (const pc of pastCourses) {
        if (pc.gradePoint !== null && pc.gradePoint !== undefined) {
          const ch = pc.creditHours || 3;
          pPoints += pc.gradePoint * ch;
          pCredits += ch;
        }
      }
      if (pCredits > 0) {
        const calcGpa = parseFloat((pPoints / pCredits).toFixed(2));
        if (lastCompletedSemester.gpa !== null && lastCompletedSemester.gpa !== undefined && Math.abs(lastCompletedSemester.gpa - calcGpa) > 0.01) {
          pastIntegrityConflict = true;
        }
        pastChapterGpa = calcGpa;
      }
    }

    // 5. Active semester & courses
    const currentSemester = semesters.find((s) => s.status === 'Active') || null;
    const activeCourses = currentSemester ? courses.filter((c) => c.semesterId === currentSemester.id) : [];

    // 6. Urgent Deadlines
    const urgentDeadlines = activities
      .filter((a) => a.status !== 'Completed')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);

    return reply.send({
      student,
      metrics: {
        cgpa,
        currentSemesterGpa: pastChapterGpa,
        totalRequiredCredits,
        completedCredits: totalCompletedCredits,
        remainingCredits,
        graduationProgress,
        activeSemesterNumber: currentSemester?.number || null,
        activeSemesterName: currentSemester?.name || 'No Active Chapter',
        activeCoursesCount: activeCourses.length,
      },
      past: lastCompletedSemester
        ? {
            semesterNumber: lastCompletedSemester.number,
            name: lastCompletedSemester.name,
            gpa: pastChapterGpa,
            academicRank: lastCompletedSemester.academicRank,
            provenance: lastCompletedSemester.provenance,
            summaryNote: lastCompletedSemester.summaryNote,
            hasIntegrityConflict: pastIntegrityConflict,
          }
        : null,
      today: {
        activeSemesterName: currentSemester?.name || 'No Active Chapter',
        academicYear: currentSemester?.academicYear || '',
        activeCourses,
        urgentDeadlines,
      },
      ahead: {
        remainingCredits,
        graduationTarget: student?.expectedGraduation || '',
        graduationProgress,
      },
    });
  });
}
