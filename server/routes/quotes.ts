import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db';

const CreateQuoteSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  category: z.enum(['Discipline', 'Consistency', 'Learning', 'Academic_Excellence', 'Resilience', 'Focus', 'Leadership', 'Patience', 'Growth', 'Future']).default('Discipline'),
});

export async function quoteRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/quotes/today (Deterministic daily quote from PostgreSQL)
  fastify.get('/quotes/today', async (request, reply) => {
    const activeQuotes = await prisma.motivationQuote.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: 'asc' },
    });

    if (activeQuotes.length === 0) {
      return reply.send({
        id: 'fallback-1',
        quote: 'Small progress, repeated consistently, becomes mastery.',
        author: 'PAOS Principle of Compounding',
        category: 'Consistency',
      });
    }

    // Deterministic calendar day hashing
    const date = new Date();
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
      const char = dateKey.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }

    const positiveIndex = Math.abs(hash) % activeQuotes.length;
    return reply.send(activeQuotes[positiveIndex]);
  });

  // GET /api/quotes
  fastify.get('/quotes', async (request, reply) => {
    const quotes = await prisma.motivationQuote.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send(quotes);
  });

  // POST /api/quotes (Admin only)
  fastify.post('/quotes', async (request, reply) => {
    const parse = CreateQuoteSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid quote payload' });
    }

    const created = await prisma.motivationQuote.create({
      data: parse.data,
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'CREATE',
        entity: 'Settings',
        entityId: created.id,
        entityName: `Daily Quote (${created.category})`,
        newValue: created.quote,
        reason: 'Added new daily motivation quote to PostgreSQL database',
      },
    });

    return reply.status(201).send(created);
  });

  // PUT /api/quotes/:id
  fastify.put('/quotes/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;

    const existing = await prisma.motivationQuote.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Quote not found' });
    }

    const updated = await prisma.motivationQuote.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'UPDATE',
        entity: 'Settings',
        entityId: id,
        entityName: 'Daily Quote',
        oldValue: existing.quote,
        newValue: updated.quote,
        reason: 'Updated daily motivation quote in database',
      },
    });

    return reply.send(updated);
  });

  // DELETE /api/quotes/:id
  fastify.delete('/quotes/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await prisma.motivationQuote.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: 'Quote not found' });
    }

    await prisma.motivationQuote.update({
      where: { id },
      data: { isArchived: true },
    });

    await prisma.auditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        action: 'DELETE',
        entity: 'Settings',
        entityId: id,
        entityName: 'Daily Quote',
        reason: 'Archived daily quote from database',
      },
    });

    return reply.send({ success: true, id });
  });
}
