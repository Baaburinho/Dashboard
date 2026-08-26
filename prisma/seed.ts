import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/paos_db?schema=public';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding PAOS v1.1 Academic Memory Edition database...');

  // 1. Users with hashed passwords
  const studentInitialPass = process.env.STUDENT_INITIAL_PASSWORD || 'Zamzam_IT2026!';
  const adminInitialPass = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe_Admin2026!';

  const studentPassHash = await bcrypt.hash(studentInitialPass, 10);
  const adminPassHash = await bcrypt.hash(adminInitialPass, 10);

  await prisma.user.upsert({
    where: { identifier: 'CIS231475' },
    update: { password: studentPassHash },
    create: {
      identifier: 'CIS231475',
      password: studentPassHash,
      role: 'STUDENT',
    },
  });

  await prisma.user.upsert({
    where: { identifier: process.env.ADMIN_EMAIL || 'admin@zamzam.edu.so' },
    update: { password: adminPassHash },
    create: {
      identifier: process.env.ADMIN_EMAIL || 'admin@zamzam.edu.so',
      password: adminPassHash,
      role: 'ADMIN',
    },
  });

  // 2. Canonical University Identity (Frozen)
  await prisma.university.create({
    data: {
      name: 'Zamzam University of Science and Technology',
      faculty: 'Faculty of Computer Science & Information Technology',
      department: 'IT',
    },
  });

  // 3. Student Profile
  await prisma.studentProfile.upsert({
    where: { studentId: 'CIS231475' },
    update: {
      fullName: 'Mohamud Mukhtar Adow',
      avatarUrl: '/mohamud.jpg',
      university: 'Zamzam University of Science and Technology',
      faculty: 'Faculty of Computer Science & Information Technology',
      department: 'IT',
      classBatch: 'Information Technology Batch 3',
      period: 'Second · 2025–2026',
      program: 'Bachelor of Science in Information Technology',
      currentSemesterNumber: 7,
      academicYear: '2025 / 2026',
      totalRequiredCredits: 120,
      completedCredits: 108,
      remainingCredits: 12,
      academicStanding: 'Good Standing · Active Degree Candidate',
      email: 'mohamud.adow@zamzam.edu.so',
      phone: '+252 61 500 0000',
    },
    create: {
      studentId: 'CIS231475',
      fullName: 'Mohamud Mukhtar Adow',
      avatarUrl: '/mohamud.jpg',
      university: 'Zamzam University of Science and Technology',
      faculty: 'Faculty of Computer Science & Information Technology',
      department: 'IT',
      classBatch: 'Information Technology Batch 3',
      period: 'Second · 2025–2026',
      program: 'Bachelor of Science in Information Technology',
      currentSemesterNumber: 7,
      academicYear: '2025 / 2026',
      enrollmentYear: '2023',
      expectedGraduation: '2027',
      totalRequiredCredits: 120,
      completedCredits: 108,
      remainingCredits: 12,
      academicStanding: 'Good Standing · Active Degree Candidate',
      email: 'mohamud.adow@zamzam.edu.so',
      phone: '+252 61 500 0000',
    },
  });

  // 4. Semesters (S1–S8)
  const semesterSeeds = [
    { id: 'sem-1', number: 1, name: 'Semester 1', academicYear: '2023 / 2024', status: 'Completed', gpa: 3.20, academicRank: 'Top 15%', totalCredits: 18, completedCredits: 18, provenance: 'Verified' },
    { id: 'sem-2', number: 2, name: 'Semester 2', academicYear: '2023 / 2024', status: 'Completed', gpa: 3.35, academicRank: 'Top 12%', totalCredits: 18, completedCredits: 18, provenance: 'Verified' },
    { id: 'sem-3', number: 3, name: 'Semester 3', academicYear: '2024 / 2025', status: 'Completed', gpa: 3.40, academicRank: 'Top 10%', totalCredits: 18, completedCredits: 18, provenance: 'Verified' },
    { id: 'sem-4', number: 4, name: 'Semester 4', academicYear: '2024 / 2025', status: 'Completed', gpa: 3.45, academicRank: 'Top 8%', totalCredits: 18, completedCredits: 18, provenance: 'Verified' },
    { id: 'sem-5', number: 5, name: 'Semester 5', academicYear: '2025 / 2026', status: 'Completed', gpa: 3.50, academicRank: 'Top 5%', totalCredits: 18, completedCredits: 18, provenance: 'Verified' },
    {
      id: 'sem-6',
      number: 6,
      name: 'Semester 6',
      academicYear: '2025 / 2026',
      status: 'Completed',
      gpa: 3.83,
      academicRank: 'Cohort Rank #2',
      totalCredits: 18,
      completedCredits: 18,
      provenance: 'Verified',
      summaryNote: 'Exceptional academic chapter concluding with Cohort Rank #2 standing with mathematically verified 3.83 GPA across 6 subjects.',
      reflectionQuote: 'Consistent focus and mastery over testing and distributed systems led to Cohort Rank #2 standing.',
    },
    { id: 'sem-7', number: 7, name: 'Semester 7', academicYear: '2025 / 2026', status: 'Active', gpa: undefined, academicRank: undefined, totalCredits: 18, completedCredits: 0, provenance: 'Personal_Record' },
    { id: 'sem-8', number: 8, name: 'Semester 8', academicYear: '2026 / 2027', status: 'Planned', gpa: undefined, academicRank: undefined, totalCredits: 12, completedCredits: 0, provenance: 'Personal_Record' },
  ];

  for (const s of semesterSeeds) {
    await prisma.semester.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        studentId: 'CIS231475',
        number: s.number,
        name: s.name,
        academicYear: s.academicYear,
        status: s.status as any,
        gpa: s.gpa,
        academicRank: s.academicRank,
        totalCredits: s.totalCredits,
        completedCredits: s.completedCredits,
        summaryNote: (s as any).summaryNote,
        reflectionQuote: (s as any).reflectionQuote,
        provenance: s.provenance as any,
      },
    });
  }

  // 5. Semester 6 Verified Courses (ASP 301, ECM 302, SWE 303, AI 304, WEB 305, CSO 306)
  const s6Courses = [
    { id: 'c-s6-1', semesterId: 'sem-6', code: 'ASP 301', name: 'ASP.NET', creditHours: 3, lecturer: 'Eng. Amina Sheikh', score: 96, grade: 'A+', gradePoint: 4.0 },
    { id: 'c-s6-2', semesterId: 'sem-6', code: 'ECM 302', name: 'E-commerce', creditHours: 3, lecturer: 'Dr. Mohamed Elmi', score: 100, grade: 'A+', gradePoint: 4.0 },
    { id: 'c-s6-3', semesterId: 'sem-6', code: 'SWE 303', name: 'Software Engineering', creditHours: 3, lecturer: 'Prof. Hassan Warsame', score: 89, grade: 'A', gradePoint: 3.5 },
    { id: 'c-s6-4', semesterId: 'sem-6', code: 'AI 304', name: 'Artificial Intelligence', creditHours: 3, lecturer: 'Dr. Abdirashid Nur', score: 95, grade: 'A+', gradePoint: 4.0 },
    { id: 'c-s6-5', semesterId: 'sem-6', code: 'WEB 305', name: 'Web Development 2 (PHP)', creditHours: 3, lecturer: 'Eng. Sahra Gedi', score: 93, grade: 'A', gradePoint: 4.0 },
    { id: 'c-s6-6', semesterId: 'sem-6', code: 'CSO 306', name: 'Computer Systems & Organization', creditHours: 3, lecturer: 'Dr. Abdirashid Nur', score: 88, grade: 'A', gradePoint: 3.5 },
  ];

  for (const c of s6Courses) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {
        totalScore: c.score,
        grade: c.grade,
        gradePoint: c.gradePoint,
      },
      create: {
        id: c.id,
        semesterId: c.semesterId,
        studentId: 'CIS231475',
        code: c.code,
        name: c.name,
        creditHours: c.creditHours,
        lecturer: c.lecturer,
        totalScore: c.score,
        grade: c.grade,
        gradePoint: c.gradePoint,
        status: 'Completed',
        progressPercentage: 100,
        provenance: 'Verified',
        sourceNote: 'Official Semester 6 Examination Transcript Record (Zamzam University)',
      },
    });
  }

  // 6. Semester 7 Active (Clean slate for student's real courses)

  // 7. Motivation Quotes (20+ database-backed quotes)
  const quotesSeed = [
    { id: 'quote-1', quote: 'Small progress, repeated consistently, becomes mastery.', author: 'PAOS Principle of Compounding', category: 'Consistency' },
    { id: 'quote-2', quote: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln', category: 'Discipline' },
    { id: 'quote-3', quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Will Durant', category: 'Academic_Excellence' },
    { id: 'quote-4', quote: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.', author: 'Brian Herbert', category: 'Learning' },
    { id: 'quote-5', quote: 'Do not pray for an easy life, pray for the strength to endure a difficult one.', author: 'Bruce Lee', category: 'Resilience' },
    { id: 'quote-6', quote: 'Starve your distractions, feed your focus.', author: 'Anonymous Scholar', category: 'Focus' },
    { id: 'quote-7', quote: 'Leadership and learning are indispensable to each other.', author: 'John F. Kennedy', category: 'Leadership' },
    { id: 'quote-8', quote: 'Patience is not the ability to wait, but how you act while you are waiting.', author: 'Joyce Meyer', category: 'Patience' },
    { id: 'quote-9', quote: 'The mind is not a vessel to be filled, but a fire to be kindled.', author: 'Plutarch', category: 'Growth' },
    { id: 'quote-10', quote: 'The future belongs to those who prepare for it today.', author: 'Malcolm X', category: 'Future' },
  ];

  for (const q of quotesSeed) {
    await prisma.motivationQuote.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        quote: q.quote,
        author: q.author,
        category: q.category as any,
      },
    });
  }

  // 8. Academic Memories
  await prisma.academicMemory.create({
    data: {
      studentId: 'CIS231475',
      title: 'Concluded Semester 6 with Cohort Rank #2',
      description: 'Achieved mathematically verified 3.83 Term GPA with high marks across Distributed Systems, Software Testing, and Mobile Application Development.',
      category: 'Achievement',
      importance: 'Milestone',
      semesterNumber: 6,
      semesterName: 'Semester 6',
      date: '2026-06-25',
      isPinned: true,
      provenance: 'Verified',
      sourceNote: 'Official faculty grade publication transcript',
    },
  });

  // 9. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      timestamp: new Date().toISOString(),
      actorRole: 'SYSTEM',
      actorId: 'system-seed',
      action: 'CREATE',
      entity: 'Profile',
      entityId: 'CIS231475',
      entityName: 'Mohamud Mukhtar Adow',
      newValue: 'Canonical student record initialized in PostgreSQL database.',
      reason: 'Initial system seeding for Zamzam University of Science and Technology.',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
