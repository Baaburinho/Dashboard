import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth';
import { studentRoutes } from './routes/student';
import { dashboardRoutes } from './routes/dashboard';
import { semesterRoutes } from './routes/semesters';
import { courseRoutes } from './routes/courses';
import { activityRoutes } from './routes/activities';
import { memoryRoutes } from './routes/memories';
import { quoteRoutes } from './routes/quotes';
import { goalRoutes } from './routes/goals';
import { documentRoutes } from './routes/documents';
import { feeRoutes } from './routes/fees';
import { timetableRoutes, noteRoutes } from './routes/notes';
import { auditRoutes, systemRoutes } from './routes/system';

dotenv.config();

const server = Fastify({
  logger: {
    level: 'info',
  },
});

// Enable CORS
await server.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Register API Routes under /api prefix
await server.register(authRoutes, { prefix: '/api' });
await server.register(studentRoutes, { prefix: '/api' });
await server.register(dashboardRoutes, { prefix: '/api' });
await server.register(semesterRoutes, { prefix: '/api' });
await server.register(courseRoutes, { prefix: '/api' });
await server.register(activityRoutes, { prefix: '/api' });
await server.register(memoryRoutes, { prefix: '/api' });
await server.register(quoteRoutes, { prefix: '/api' });
await server.register(goalRoutes, { prefix: '/api' });
await server.register(documentRoutes, { prefix: '/api' });
await server.register(feeRoutes, { prefix: '/api' });
await server.register(timetableRoutes, { prefix: '/api' });
await server.register(noteRoutes, { prefix: '/api' });
await server.register(auditRoutes, { prefix: '/api' });
await server.register(systemRoutes, { prefix: '/api' });

import { prisma } from './db';

// Health and Readiness checks
server.get('/api/health', async () => {
  return { status: 'ok', service: 'PAOS Fastify API', version: '1.1.0', timestamp: new Date().toISOString() };
});

server.get('/api/health/readiness', async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ready', database: 'connected', timestamp: new Date().toISOString() };
  } catch (error) {
    return reply.status(503).send({ status: 'unready', database: 'disconnected', error: String(error) });
  }
});

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = '0.0.0.0';

async function start() {
  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`PAOS Fastify Backend running at http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
