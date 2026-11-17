import { useEffect, useState } from 'react';
import { CreditCard, FileText, Loader2, Printer, X } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { apiRequest } from '../../services/api';

interface PaymentRow {
  id: string;
  reference_id: string;
  course_code: string;
  course_title: string;
  category_name: string;
  amount_display: string;
  amount_bdt: number;
  payment_method: 'free' | 'bkash' | 'nagad';
  payment_number: string;
  sender_phone: string;
  transaction_id: string;
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  enrolment_status: 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled';
  verified_at: string | null;
  created_at: string;
}

interface ReceiptData {
  reference_id: string;
  course_code: string;
  course_title: string;
  category_name: string;
  amount_display: string;
  payment_method: string;
  transaction_id: string;
  payment_status: string;
  verified_at: string | null;
  created_at: string;
  applicant_name: string;
  applicant_email: string;
  issuer: string;
  disclosure: string;
}

export function DashboardPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest<{ payments: PaymentRow[] }>('/api/dashboard/payments');
        if (!cancelled) setPayments(res.payments);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleViewReceipt = async (referenceId: string) => {
    try {
      const res = await apiRequest<{ receipt: ReceiptData }>(
        `/api/dashboard/payments/${encodeURIComponent(referenceId)}/receipt`
      );
      setReceipt(res.receipt);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <DashboardLayout
      title="Payments & Enrolment History"
      subtitle="View your course applications, manual bKash/Nagad verification records, and confirmed receipts."
    >
      {loading ? (
        <div className="flex items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-white p-12 font-en text-sm text-[var(--color-body)]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden="true" />
          Loading payment history...
        </div>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="rounded-[12px] border border-red-200 bg-red-50 p-4 font-en text-sm text-red-700">
              {error}
            </div>
          )}

          {payments.length === 0 ? (
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-10 text-center font-en">
              <CreditCard className="mx-auto h-10 w-10 text-[var(--color-primary)]" aria-hidden="true" />
              <p className="mt-3 text-base font-bold text-[var(--color-heading)]">
                No payment or enrolment records yet
              </p>
              <p className="mt-1 text-xs text-[var(--color-body)]">
                Submitted free and paid programme applications while signed in will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-en text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-soft-bg)] text-[var(--color-body)]">
                      <th className="px-4 py-3 font-semibold">Course</th>
                      <th className="px-4 py-3 font-semibold">Reference ID</th>
                      <th className="px-4 py-3 font-semibold">Fee / Method</th>
                      <th className="px-4 py-3 font-semibold">Transaction ID</th>
                      <th className="px-4 py-3 font-semibold">Payment Status</th>
                      <th className="px-4 py-3 font-semibold">Enrolment</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {payments.map((p) => {
                      const isFree = p.payment_method === 'free';
                      const canPrintReceipt = p.payment_status === 'Paid' || isFree;
                      return (
                        <tr key={p.id}>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-[var(--color-heading)]">
                              {p.course_code} — {p.course_title}
                            </p>
                            <p className="text-[11px] text-[var(--color-body)]">{p.category_name}</p>
                          </td>
                          <td className="px-4 py-3.5 font-mono-tabular font-semibold text-[var(--color-primary)]">
                            {p.reference_id}
                          </td>
                          <td className="px-4 py-3.5">
                            {isFree ? (
                              <span className="font-semibold text-[var(--color-free)]">
                                Free Enrolment
                              </span>
                            ) : (
                              <div>
                                <p className="font-mono-tabular font-bold text-[var(--color-heading)]">
                                  {p.amount_display}
                                </p>
                                <p className="text-[11px] uppercase text-[var(--color-body)]">
                                  {p.payment_method}
                                </p>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-mono-tabular text-[var(--color-heading)]">
                            {isFree ? '—' : p.transaction_id || '—'}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-block rounded-[6px] border px-2 py-0.5 text-[11px] font-bold ${
                                p.payment_status === 'Paid'
                                  ? 'border-[var(--color-free)] bg-[#EAF7EE] text-[var(--color-free)]'
                                  : p.payment_status === 'Pending'
                                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                                  : 'border-red-300 bg-red-50 text-red-700'
                              }`}
                            >
                              {isFree ? 'Free Enrolment' : p.payment_status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-[var(--color-heading)]">
                            {p.enrolment_status}
                          </td>
                          <td className="px-4 py-3.5 text-[var(--color-body)]">
                            {new Date(p.created_at).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-4 py-3.5">
                            {canPrintReceipt ? (
                              <button
                                type="button"
                                onClick={() => handleViewReceipt(p.reference_id)}
                                className="inline-flex items-center gap-1 font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                              >
                                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Receipt</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-[var(--color-body)]">Pending</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setReceipt(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[12px] border border-[var(--color-border)] bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 print:hidden">
              <h3 className="font-en text-base font-bold text-[var(--color-heading)]">
                Enrolment Receipt / Invoice
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 rounded-[8px] bg-[var(--color-primary)] px-3 py-1.5 font-en text-xs font-semibold text-white cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--color-border)] cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3 font-en text-xs">
              <div>
                <p className="font-bold text-[var(--color-primary)]">{receipt.issuer}</p>
                <p className="text-[var(--color-body)]">Reference: {receipt.reference_id}</p>
              </div>
              <dl className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                <div className="flex justify-between py-2">
                  <dt className="text-[var(--color-body)]">Learner</dt>
                  <dd className="font-semibold text-[var(--color-heading)]">
                    {receipt.applicant_name} ({receipt.applicant_email})
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-[var(--color-body)]">Programme</dt>
                  <dd className="font-semibold text-[var(--color-heading)]">
                    {receipt.course_code} — {receipt.course_title}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-[var(--color-body)]">Method</dt>
                  <dd className="uppercase font-semibold text-[var(--color-heading)]">
                    {receipt.payment_method === 'free' ? 'Free Enrolment' : receipt.payment_method}
                  </dd>
                </div>
                {receipt.transaction_id && (
                  <div className="flex justify-between py-2">
                    <dt className="text-[var(--color-body)]">Transaction ID</dt>
                    <dd className="font-mono-tabular font-bold text-[var(--color-heading)]">
                      {receipt.transaction_id}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <dt className="text-[var(--color-body)]">Amount</dt>
                  <dd className="font-mono-tabular font-bold text-[var(--color-heading)]">
                    {receipt.amount_display}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-[var(--color-body)]">Status</dt>
                  <dd className="font-bold text-[var(--color-free)]">{receipt.payment_status}</dd>
                </div>
              </dl>
              <p className="text-[11px] text-[var(--color-body)]">{receipt.disclosure}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
