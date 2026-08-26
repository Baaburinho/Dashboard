import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { prisma } from '../db';

export async function feeRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  // GET /api/fees
  fastify.get('/fees', async (request, reply) => {
    const feeRecords = await prisma.feeRecord.findMany({
      where: { studentId: 'CIS231475', isArchived: false },
      include: { payments: true },
      orderBy: { semesterNumber: 'asc' },
    });
    return reply.send(feeRecords);
  });

  // POST /api/fees/:id/payments
  fastify.post('/fees/:id/payments', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;

    const payment = await prisma.paymentItem.create({
      data: {
        feeRecordId: id,
        amount: data.amount,
        date: data.date || new Date().toISOString().split('T')[0],
        method: data.method || 'Bank Transfer',
        receiptNumber: data.receiptNumber || `RCP-${Date.now()}`,
        note: data.note,
      },
    });

    // Update fee record paid and remaining amounts
    const feeRecord = await prisma.feeRecord.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (feeRecord) {
      const newPaid = feeRecord.payments.reduce((sum, p) => sum + p.amount, 0);
      const newRemaining = Math.max(0, feeRecord.totalFee - newPaid);
      const newStatus = newRemaining === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Overdue';

      await prisma.feeRecord.update({
        where: { id },
        data: {
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          status: newStatus,
        },
      });
    }

    return reply.status(201).send(payment);
  });
}
