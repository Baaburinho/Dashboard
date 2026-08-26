import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Receipt,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Lock,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { PaymentItem } from '../../types';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const FeesVault: React.FC = () => {
  const { feeRecords, addPayment, outstandingFees } = useAcademic();
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(feeRecords[0]?.id || '');

  // Payment form state
  const [payAmount, setPayAmount] = useState(120);
  const [receiptNumber, setReceiptNumber] = useState(`RCP-${Date.now().toString().slice(-6)}`);
  const [method, setMethod] = useState('Direct Bank Transfer / EVC Plus');
  const [payNotes, setPayNotes] = useState('Semester 7 installment clearance');

  const totalTuitionPaid = feeRecords.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalTuitionBilled = feeRecords.reduce((sum, f) => sum + f.totalFee, 0);
  const paidPercentage = totalTuitionBilled > 0 ? Math.round((totalTuitionPaid / totalTuitionBilled) * 100) : 100;

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeId || payAmount <= 0) return;

    addPayment(selectedFeeId, {
      date: new Date().toISOString().split('T')[0],
      amount: payAmount,
      receiptNumber,
      method,
      notes: payNotes,
    });

    setIsAddPaymentOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Standardized Page Header */}
      <PageHeader
        eyebrow="Private Financial Vault"
        eyebrowIcon={<DollarSign className="w-4 h-4 text-emerald-500" />}
        title="Tuition Ledgers & Payment History"
        description="Private financial record keeping for university fee installments, official receipts, and semester clearance vouchers."
        badge={
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full font-mono border border-slate-200 dark:border-slate-700">
            <Lock className="w-3 h-3 text-emerald-500" /> Confidential
          </span>
        }
        actions={
          <Button
            variant="indigo"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddPaymentOpen(true)}
          >
            Record Payment
          </Button>
        }
      />

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Tuition Billed
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              ${totalTuitionBilled}
            </span>
            <span className="text-xs font-semibold text-slate-400">USD</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Across 7 Academic Semesters
          </span>
        </Card>

        <Card padding="md">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Paid to Date
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${totalTuitionPaid}
            </span>
            <span className="text-xs font-semibold text-slate-400">USD</span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {paidPercentage}% Tuition Cleared
          </span>
        </Card>

        <Card padding="md">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Outstanding Balance
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              ${outstandingFees}
            </span>
            <span className="text-xs font-semibold text-slate-400">USD</span>
          </div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            Semester 7 Installment Due
          </span>
        </Card>
      </div>

      {/* 3. Fee Records Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Semester Fee Ledgers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official payment installments tracked by semester
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {feeRecords.length} Semesters Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Semester</th>
                <th className="px-5 py-3.5">Academic Year</th>
                <th className="px-5 py-3.5">Total Fee</th>
                <th className="px-5 py-3.5">Paid Amount</th>
                <th className="px-5 py-3.5">Balance</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {feeRecords.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                    Semester {fee.semesterNumber}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-mono">
                    {fee.academicYear}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-medium">${fee.totalFee}</td>
                  <td className="px-5 py-3.5 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    ${fee.paidAmount}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    ${fee.remainingAmount}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-mono">
                    {fee.dueDate}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        fee.status === 'Paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                          : fee.status === 'Partial'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Record Fee Payment
              </h3>
              <button
                onClick={() => setIsAddPaymentOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Semester Ledger
                </label>
                <select
                  value={selectedFeeId}
                  onChange={(e) => setSelectedFeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                >
                  {feeRecords.map((f) => (
                    <option key={f.id} value={f.id}>
                      Semester {f.semesterNumber} (Remaining Due: ${f.remainingAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Receipt #
                  </label>
                  <input
                    type="text"
                    required
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Method
                </label>
                <input
                  type="text"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#C9A227] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setIsAddPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button variant="indigo" type="submit">
                  Record Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
