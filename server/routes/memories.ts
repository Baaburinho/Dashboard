import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db';

const CreateMemorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['Achievement', 'Milestone', 'Course_Completion', 'Personal_Reflection', 'Event']).default('Achievement'),
  importance: z.enum(['Low', 'Normal', 'Important', 'Milestone']).default('Normal'),
  semesterNumber: z.number().default(7),
  semesterName: z.string().optional(),
  date: z.string(),
  isPinned: z.boolean().default(false),
  tagsJson: z.string().optional(),
  provenance: z.enum(['Verified', 'Personal_Record', 'Seeded', 'Unverified']).default('Personal_Record'),
  sourceNote: z.string().optional(),
});

export async function memoryRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/memories
  fastify.get('/memories', async (request, reply) => {
    const memories = await prisma.academicMemory.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      orderBy: { date: 'desc' },
    });
    return reply.send(memories);
  });

  // POST /api/memories
  fastify.post('/memories', async (request, reply) => {
    const parse = CreateMemorySchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid memory payload' });
    }

    const created = await prisma.academicMemory.create({
      data: {
        studentId: 'CIS231475',
        ...parse.data,
      },
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'CREATE',
        entity: 'Memory',
        entityId: created.id,
        entityName: created.title,
        newValue: JSON.stringify(created),
        reason: 'Added academic memory entry',
      },
    });

    return reply.status(201).send(created);
  });

  // DELETE /api/memories/:id
  fastify.delete('/memories/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await prisma.academicMemory.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Memory not found' });
    }

    await prisma.academicMemory.update({
      where: { id },
      data: { isArchived: true },
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'DELETE',
        entity: 'Memory',
        entityId: id,
        entityName: existing.title,
        reason: 'Memory archived / soft-deleted',
      },
    });

    return reply.send({ success: true, id });
  });
}
