import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';

const LoginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export async function authRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // POST /api/auth/login
  fastify.post('/auth/login', async (request, reply) => {
    const parse = LoginSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid identifier or password format' });
    }

    const { identifier, password } = parse.data;
    const cleanId = identifier.trim();

    // 1. Query user from PostgreSQL by identifier (case-insensitive search)
    const user = await prisma.user.findFirst({
      where: {
        identifier: {
          equals: cleanId,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      return reply.status(401).send({ error: 'Invalid identifier or credentials.' });
    }

    // 2. Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ error: 'Invalid identifier or credentials.' });
    }

    // 3. Resolve role and profile
    if (user.role === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.findFirst({
        where: { studentId: user.identifier },
      });

      await prisma.auditLog.create({
        data: {
          timestamp: new Date().toISOString(),
          actorRole: 'STUDENT',
          actorId: user.identifier,
          action: 'LOGIN',
          entity: 'Profile',
          entityId: user.identifier,
          entityName: studentProfile?.fullName || user.identifier,
          newValue: 'Student authenticated successfully.',
          reason: 'Student authenticated into Personal Academic OS.',
        },
      });

      return reply.send({
        success: true,
        role: 'student',
        user: {
          identifier: user.identifier,
          role: 'STUDENT',
          studentProfile,
        },
      });
    }

    if (user.role === 'ADMIN') {
      await prisma.auditLog.create({
        data: {
          timestamp: new Date().toISOString(),
          actorRole: 'ADMIN',
          actorId: user.identifier,
          action: 'LOGIN',
          entity: 'Settings',
          entityId: 'admin-console',
          entityName: 'Administrator Master Session',
          newValue: 'Admin session authenticated.',
          reason: 'Administrator authenticated into Management Console.',
        },
      });

      return reply.send({
        success: true,
        role: 'admin',
        user: {
          identifier: user.identifier,
          role: 'ADMIN',
        },
      });
    }

    return reply.status(401).send({ error: 'Unauthorized role.' });
  });

  // GET /api/auth/me
  fastify.get('/auth/me', async (request, reply) => {
    const student = await prisma.studentProfile.findFirst({
      where: { studentId: 'CIS231475' },
    });

    return reply.send({
      authenticated: true,
      student,
    });
  });
}
