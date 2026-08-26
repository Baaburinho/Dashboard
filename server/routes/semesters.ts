import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db';

const CreateSemesterSchema = z.object({
  number: z.number(),
  name: z.string().min(1),
  academicYear: z.string().min(1),
  status: z.enum(['Planned', 'Active', 'Completed', 'Archived']).default('Planned'),
  totalCredits: z.number().default(18),
  completedCredits: z.number().default(0),
  gpa: z.number().optional(),
  academicRank: z.string().optional(),
  summaryNote: z.string().optional(),
  reflectionQuote: z.string().optional(),
  provenance: z.enum(['Verified', 'Personal_Record', 'Seeded', 'Unverified']).default('Personal_Record'),
});

export async function semesterRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/semesters
  fastify.get('/semesters', async (request, reply) => {
    const semesters = await prisma.semester.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      orderBy: { number: 'asc' },
    });
    return reply.send(semesters);
  });

  // POST /api/semesters
  fastify.post('/semesters', async (request, reply) => {
    const parse = CreateSemesterSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid semester payload' });
    }

    const created = await prisma.semester.create({
      data: {
        studentId: 'CIS231475',
        ...parse.data,
      },
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'CREATE',
        entity: 'Semester',
        entityId: created.id,
        entityName: created.name,
        newValue: JSON.stringify(created),
        reason: 'Added new semester chapter',
      },
    });

    return reply.status(201).send(created);
  });

  // PUT /api/semesters/:id
  fastify.put('/semesters/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;

    const existing = await prisma.semester.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Semester not found' });
    }

    const updated = await prisma.semester.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'UPDATE',
        entity: 'Semester',
        entityId: id,
        entityName: updated.name,
        oldValue: JSON.stringify(existing),
        newValue: JSON.stringify(updated),
        reason: 'Updated semester chapter',
      },
    });

    return reply.send(updated);
  });
}
