import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { prisma } from '../db';

export async function documentRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/documents
  fastify.get('/documents', async (request, reply) => {
    const docs = await prisma.document.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      orderBy: { date: 'desc' },
    });
    return reply.send(docs);
  });

  // POST /api/documents
  fastify.post('/documents', async (request, reply) => {
    const data = request.body as any;
    const created = await prisma.document.create({
      data: {
        studentId: 'CIS231475',
        name: data.name,
        type: data.type || 'Certificate',
        semesterNumber: data.semesterNumber || 7,
        courseName: data.courseName,
        date: data.date || new Date().toISOString().split('T')[0],
        fileSize: data.fileSize || '500 KB',
        fileUrl: data.fileUrl,
        description: data.description,
        provenance: data.provenance || 'Personal_Record',
        sourceNote: data.sourceNote || 'Document vault entry',
      },
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'CREATE',
        entity: 'Document',
        entityId: created.id,
        entityName: created.name,
        reason: 'Document saved to academic credentials vault',
      },
    });

    return reply.status(201).send(created);
  });

  // DELETE /api/documents/:id
  fastify.delete('/documents/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const doc = await prisma.document.update({
      where: { id },
      data: { isArchived: true },
    });
    return reply.send({ success: true, id: doc.id });
  });
}
