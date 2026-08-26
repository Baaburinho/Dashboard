import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db';

const UpdateProfileSchema = z.object({
  fullName: z.string().optional(),
  avatarUrl: z.string().optional(),
  program: z.string().optional(),
  faculty: z.string().optional(),
  department: z.string().optional(),
  classBatch: z.string().optional(),
  period: z.string().optional(),
  university: z.string().optional(),
  totalRequiredCredits: z.number().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export async function studentRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/student/me
  fastify.get('/student/me', async (request, reply) => {
    let student = await prisma.studentProfile.findFirst({
      where: { studentId: 'CIS231475' },
    });

    if (!student) {
      // Fallback create canonical record
      student = await prisma.studentProfile.create({
        data: {
          studentId: 'CIS231475',
          fullName: 'Mohamud Mukhtar Adow',
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
        },
      });
    }

    return reply.send(student);
  });

  // PUT /api/student/profile
  fastify.put('/student/profile', async (request, reply) => {
    const parse = UpdateProfileSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid profile update payload' });
    }

    const current = await prisma.studentProfile.findFirst({
      where: { studentId: 'CIS231475' },
    });

    const updated = await prisma.studentProfile.update({
      where: { studentId: 'CIS231475' },
      data: parse.data,
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'UPDATE',
        entity: 'Profile',
        entityId: 'CIS231475',
        entityName: updated.fullName,
        oldValue: JSON.stringify(current),
        newValue: JSON.stringify(updated),
        reason: 'Student profile updated via API',
      },
    });

    return reply.send(updated);
  });
}
