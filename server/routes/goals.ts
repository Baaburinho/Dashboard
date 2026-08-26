import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { prisma } from '../db';

export async function goalRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/goals
  fastify.get('/goals', async (request, reply) => {
    const goals = await prisma.goal.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send(goals);
  });

  // POST /api/goals
  fastify.post('/goals', async (request, reply) => {
    const data = request.body as any;
    const created = await prisma.goal.create({
      data: {
        studentId: 'CIS231475',
        title: data.title,
        category: data.category || 'GPA',
        targetSemester: data.targetSemester || 7,
        progressPercentage: data.progressPercentage || 0,
        status: data.status || 'In Progress',
        notes: data.notes,
      },
    });
    return reply.status(201).send(created);
  });

  // GET /api/tasks
  fastify.get('/tasks', async (request, reply) => {
    const tasks = await prisma.academicTask.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send(tasks);
  });

  // POST /api/tasks
  fastify.post('/tasks', async (request, reply) => {
    const data = request.body as any;
    const created = await prisma.academicTask.create({
      data: {
        studentId: 'CIS231475',
        title: data.title,
        priority: data.priority || 'Normal',
        category: data.category || 'Self Study',
        status: data.status || 'Pending',
        dueDate: data.dueDate,
        courseId: data.courseId,
      },
    });
    return reply.status(201).send(created);
  });

  // PUT /api/tasks/:id
  fastify.put('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    const updated = await prisma.academicTask.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  });
}
