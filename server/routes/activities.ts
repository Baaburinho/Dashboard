import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db';

const CreateActivitySchema = z.object({
  courseId: z.string(),
  semesterId: z.string(),
  courseCode: z.string(),
  courseName: z.string(),
  title: z.string().min(1),
  type: z.enum(['Assignment', 'Quiz', 'Midterm', 'Final_Exam', 'Project', 'Presentation', 'Lab', 'Attendance', 'Other']).default('Assignment'),
  description: z.string().optional(),
  deadline: z.string(),
  status: z.enum(['Planned', 'In_Progress', 'Submitted', 'Completed', 'Overdue']).default('Planned'),
  priority: z.enum(['Critical', 'High', 'Normal', 'Low']).default('Normal'),
  maxScore: z.number().default(20),
  weightPercentage: z.number().default(10),
  notes: z.string().optional(),
  provenance: z.enum(['Verified', 'Personal_Record', 'Seeded', 'Unverified']).default('Personal_Record'),
  sourceNote: z.string().optional(),
});

export async function activityRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/activities
  fastify.get('/activities', async (request, reply) => {
    const activities = await prisma.activity.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      orderBy: { deadline: 'asc' },
    });
    return reply.send(activities);
  });

  // POST /api/activities
  fastify.post('/activities', async (request, reply) => {
    const parse = CreateActivitySchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid activity payload' });
    }

    const created = await prisma.activity.create({
      data: {
        studentId: 'CIS231475',
        ...parse.data,
      },
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'CREATE',
        entity: 'Activity',
        entityId: created.id,
        entityName: created.title,
        newValue: JSON.stringify(created),
        reason: 'Activity created in personal workspace',
      },
    });

    return reply.status(201).send(created);
  });

  // PUT /api/activities/:id
  fastify.put('/activities/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;

    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Activity not found' });
    }

    const updated = await prisma.activity.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'UPDATE',
        entity: 'Activity',
        entityId: id,
        entityName: updated.title,
        oldValue: JSON.stringify(existing),
        newValue: JSON.stringify(updated),
        reason: 'Activity updated',
      },
    });

    return reply.send(updated);
  });

  // DELETE /api/activities/:id (Soft-delete)
  fastify.delete('/activities/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Activity not found' });
    }

    const updated = await prisma.activity.update({
      where: { id },
      data: { isArchived: true },
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'DELETE',
        entity: 'Activity',
        entityId: id,
        entityName: existing.title,
        reason: 'Activity archived / soft-deleted',
      },
    });

    return reply.send({ success: true, id });
  });
}
