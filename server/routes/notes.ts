import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { prisma } from '../db';

export async function timetableRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/timetable
  fastify.get('/timetable', async (request, reply) => {
    const slots = await prisma.timetableSlot.findMany({
      where: { studentId: 'CIS231475' },
      orderBy: { startTime: 'asc' },
    });
    return reply.send(slots);
  });
}

export async function noteRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/notes
  fastify.get('/notes', async (request, reply) => {
    const notes = await prisma.courseNote.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      orderBy: { updatedAt: 'desc' },
    });
    return reply.send(notes);
  });

  // POST /api/notes
  fastify.post('/notes', async (request, reply) => {
    const data = request.body as any;
    const created = await prisma.courseNote.create({
      data: {
        studentId: 'CIS231475',
        courseId: data.courseId,
        title: data.title,
        content: data.content,
        tagsJson: JSON.stringify(data.tags || ['Lecture']),
      },
    });
    return reply.status(201).send(created);
  });

  // PUT /api/notes/:id
  fastify.put('/notes/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    const updated = await prisma.courseNote.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        tagsJson: data.tags ? JSON.stringify(data.tags) : undefined,
      },
    });
    return reply.send(updated);
  });

  // DELETE /api/notes/:id
  fastify.delete('/notes/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = await prisma.courseNote.update({
      where: { id },
      data: { isArchived: true },
    });
    return reply.send({ success: true, id: deleted.id });
  });
}
