import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { prisma } from '../db';

export async function auditRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/audit-logs
  fastify.get('/audit-logs', async (request, reply) => {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return reply.send(logs);
  });

  // POST /api/audit-logs
  fastify.post('/audit-logs', async (request, reply) => {
    const data = request.body as any;
    const created = await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: data.action || 'UPDATE',
        entity: data.entity || 'General',
        entityId: data.entityId || 'system',
        entityName: data.entityName || 'System Event',
        oldValue: data.oldValue,
        newValue: data.newValue,
        reason: data.reason,
      },
    });
    return reply.status(201).send(created);
  });
}

export async function systemRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/system/export (Database JSON dump)
  fastify.get('/system/export', async (request, reply) => {
    const student = await prisma.studentProfile.findFirst({ where: { studentId: 'CIS231475' } });
    const semesters = await prisma.semester.findMany({ where: { studentId: 'CIS231475' } });
    const courses = await prisma.course.findMany({ where: { studentId: 'CIS231475' } });
    const activities = await prisma.activity.findMany({ where: { studentId: 'CIS231475' } });
    const memories = await prisma.academicMemory.findMany({ where: { studentId: 'CIS231475' } });
    const quotes = await prisma.motivationQuote.findMany();
    const goals = await prisma.goal.findMany({ where: { studentId: 'CIS231475' } });
    const tasks = await prisma.academicTask.findMany({ where: { studentId: 'CIS231475' } });
    const documents = await prisma.document.findMany({ where: { studentId: 'CIS231475' } });
    const feeRecords = await prisma.feeRecord.findMany({ where: { studentId: 'CIS231475' }, include: { payments: true } });
    const auditLogs = await prisma.auditLog.findMany();

    const dump = {
      meta: {
        edition: 'PAOS v1.1 Academic Memory Edition (AME)',
        schemaVersion: 2,
        exportedAt: new Date().toISOString(),
        studentId: 'CIS231475',
        university: 'Zamzam University of Science and Technology',
      },
      student,
      semesters,
      courses,
      activities,
      memories,
      quotes,
      goals,
      tasks,
      documents,
      feeRecords,
      auditLogs,
    };

    return reply.send(dump);
  });

  // POST /api/system/restore
  fastify.post('/system/restore', async (request, reply) => {
    const data = request.body as any;
    if (!data || !data.meta) {
      return reply.status(400).send({ error: 'Invalid backup file format' });
    }

    // 1. Create pre-restore snapshot
    const currentData = await prisma.studentProfile.findFirst({ where: { studentId: 'CIS231475' } });
    const snapshot = await prisma.backupSnapshot.create({
      data: {
        label: 'Automated Pre-Restore Snapshot',
        snapshotJson: JSON.stringify(currentData),
      },
    });

    // 2. Restore student
    if (data.student) {
      await prisma.studentProfile.upsert({
        where: { studentId: 'CIS231475' },
        update: data.student,
        create: data.student,
      });
    }

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'RESTORE',
        entity: 'Settings',
        entityId: snapshot.id,
        entityName: 'Database Restore',
        reason: `Restored database safely. Pre-restore snapshot ID: ${snapshot.id}`,
      },
    });

    return reply.send({ success: true, snapshotId: snapshot.id });
  });
}
