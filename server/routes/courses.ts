import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db';

const CreateCourseSchema = z.object({
  semesterId: z.string(),
  code: z.string().min(1),
  name: z.string().min(1),
  creditHours: z.number().default(3),
  lecturer: z.string().default('Faculty Lecturer'),
  room: z.string().optional(),
  schedule: z.string().optional(),
  status: z.string().default('Active'),
  provenance: z.enum(['Verified', 'Personal_Record', 'Seeded', 'Unverified']).default('Personal_Record'),
  sourceNote: z.string().optional(),
});

const UpdateResultSchema = z.object({
  totalScore: z.number().optional(),
  grade: z.string().optional(),
  gradePoint: z.number().optional(),
  provenance: z.enum(['Verified', 'Personal_Record', 'Seeded', 'Unverified']).default('Verified'),
  sourceNote: z.string().optional(),
});

export async function courseRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/courses
  fastify.get('/courses', async (request, reply) => {
    const courses = await prisma.course.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      orderBy: { code: 'asc' },
    });
    return reply.send(courses);
  });

  // POST /api/courses (Student / Admin adds personal course)
  fastify.post('/courses', async (request, reply) => {
    const parse = CreateCourseSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid course payload' });
    }

    const created = await prisma.course.create({
      data: {
        studentId: 'CIS231475',
        ...parse.data,
      },
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'CREATE',
        entity: 'Course',
        entityId: created.id,
        entityName: `${created.code} - ${created.name}`,
        newValue: JSON.stringify(created),
        reason: 'Course created in academic ledger',
      },
    });

    return reply.status(201).send(created);
  });

  // PUT /api/courses/:id
  fastify.put('/courses/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Course not found' });
    }

    const updated = await prisma.course.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'UPDATE',
        entity: 'Course',
        entityId: id,
        entityName: updated.name,
        oldValue: JSON.stringify(existing),
        newValue: JSON.stringify(updated),
        reason: 'Course details updated',
      },
    });

    return reply.send(updated);
  });

  // PUT /api/courses/:id/results (Admin official result management)
  fastify.put('/courses/:id/results', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parse = UpdateResultSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid result payload' });
    }

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Course not found' });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        totalScore: parse.data.totalScore,
        grade: parse.data.grade,
        gradePoint: parse.data.gradePoint,
        provenance: parse.data.provenance,
        sourceNote: parse.data.sourceNote || 'Official result updated via Admin Console',
      },
    });

    // Mandatory append-only audit entry
    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'UPDATE',
        entity: 'Grade',
        entityId: id,
        entityName: `${existing.code} - ${existing.name}`,
        oldValue: `Score: ${existing.totalScore || 'None'}, Grade: ${existing.grade || 'None'}, GP: ${existing.gradePoint || 'None'}`,
        newValue: `Score: ${updated.totalScore || 'None'}, Grade: ${updated.grade || 'None'}, GP: ${updated.gradePoint || 'None'}`,
        reason: `Admin modified official course results for ${existing.code}`,
      },
    });

    return reply.send(updated);
  });
}
