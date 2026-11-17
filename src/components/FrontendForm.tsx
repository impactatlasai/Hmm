import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, CheckCircle2, Clock, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MANUAL_PAYMENT_NUMBER = '+8801601289683';

interface FrontendFormProps {
  mode: 'course-application' | 'free-masterclass' | 'contact';
  courseCode?: string;
  courseTitle?: string;
  courseFee?: string;
  courseFeeNote?: string;
  isFree?: boolean;
  isCourseFull?: boolean;
}

export function FrontendForm({
  mode,
  courseCode,
  courseTitle,
  courseFee,
  courseFeeNote,
  isFree,
  isCourseFull = false,
}: FrontendFormProps) {
  const { isAuthenticated, user, recordFreeMasterclassRegistration } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [background, setBackground] = useState(user?.educationalBackground || user?.profession || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const formLoadedAt = useRef(Date.now());

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName((prev) => prev || user.name);
      setEmail((prev) => prev || user.email);
      setPhone((prev) => prev || user.phone);
      setBackground((prev) => prev || user.educationalBackground || user.profession);
    }
  }, [user]);

  const requiresPayment = mode === 'course-application' && !isFree;

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(MANUAL_PAYMENT_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.trim().length < 2) {
      setError('দয়া করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('দয়া করে একটি সঠিক Email address লিখুন।');
      return;
    }

    if (mode === 'free-masterclass' || mode === 'course-application') {
      if (phone.trim().length < 6) {
        setError('দয়া করে একটি সচল Phone / WhatsApp নম্বর লিখুন।');
        return;
      }
    }

    if (mode === 'course-application' && background.trim().length < 2) {
      setError('দয়া করে আপনার বর্তমান শিক্ষাগত বা পেশাগত পরিচয় লিখুন।');
      return;
    }

    if (requiresPayment) {
      if (transactionId.trim().length < 4) {
        setError(
          `দয়া করে ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Send Money-র সঠিক Transaction ID (TrxID) লিখুন।`
        );
        return;
      }
    }

    if (mode === 'contact') {
      if (subject.trim().length < 3) {
        setError('দয়া করে Message-এর Subject লিখুন।');
        return;
      }
      if (message.trim().length < 10) {
        setError('দয়া করে আপনার Message কমপক্ষে ১০ অক্ষরে লিখুন।');
        return;
      }
    }

    if (!accepted) {
      setError('এগিয়ে যাওয়ার আগে Privacy ও Terms সম্মতি বক্সে টিক দিন।');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = mode === 'contact' ? '/api/contact' : '/api/applications';
      const payload =
        mode === 'contact'
          ? {
              name: name.trim(),
              email: email.trim(),
              subject: subject.trim(),
              message: message.trim(),
              website_url: honeypot,
            }
          : {
              fullName: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              country: 'Bangladesh',
              educationalBackground: background.trim() || 'General Learner',
              selectedProgramme: courseCode || (mode === 'free-masterclass' ? 'FREE' : 'AL-101'),
              isFree: Boolean(isFree || mode === 'free-masterclass'),
              amount: courseFee || 'BDT 0',
              ...(requiresPayment
                ? {
                    paymentMethod,
                    paymentNumber: MANUAL_PAYMENT_NUMBER,
                    senderNumber: senderNumber.trim() || phone.trim(),
                    transactionId: transactionId.trim().toUpperCase(),
                  }
                : {}),
              motivation: message.trim(),
              privacyConsent: accepted,
              mode,
              website_url: honeypot,
              submittedAfterMs: Math.max(850, Date.now() - formLoadedAt.current),
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        referenceId?: string;
        verificationStatus?: string;
        message?: string;
      };

      if (!res.ok) {
        setError(data.error || 'তথ্য পাঠাতে সমস্যা হয়েছে। একটু পর আবার চেষ্টা করুন।');
        return;
      }

      if (mode === 'free-masterclass') {
        recordFreeMasterclassRegistration();
      }
      setReferenceId(data.referenceId || null);
      setVerificationStatus(data.verificationStatus || null);
      setServerMessage(data.message || null);
      setSubmitted(true);
    } catch {
      setError('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setBackground('');
    setSubject('');
    setMessage('');
    setPaymentMethod('bkash');
    setSenderNumber('');
    setTransactionId('');
    setAccepted(false);
    setHoneypot('');
    setReferenceId(null);
    setVerificationStatus(null);
    setServerMessage(null);
    setError(null);
    formLoadedAt.current = Date.now();
  };

  if (submitted) {
    const isPendingVerification = verificationStatus === 'Pending Verification';

    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8"
      >
        <div className="flex items-start gap-3">
          {isPendingVerification ? (
            <Clock
              className="mt-0.5 h-6 w-6 shrink-0 text-amber-600"
              aria-hidden="true"
            />
          ) : (
            <CheckCircle2
              className="mt-0.5 h-6 w-6 shrink-0 text-[var(--color-free)]"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-xl font-bold text-[var(--color-heading)]">
                {isPendingVerification
                  ? 'আবেদন ও পেমেন্ট তথ্য জমা হয়েছে'
                  : 'আপনার তথ্য জমা হয়েছে'}
              </h3>
              {verificationStatus && (
                <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-0.5 font-en text-xs font-bold text-amber-800">
                  {verificationStatus}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
              {serverMessage
                ? serverMessage
                : mode === 'free-masterclass'
                ? 'Free Masterclass-এর তারিখ চূড়ান্ত হলে নিবন্ধিত সবাইকে জানানো হবে।'
                : mode === 'course-application'
                ? `${courseTitle || 'এই programme'}${
                    courseCode ? ` (${courseCode})` : ''
                  }-এর জন্য আপনার আবেদন গ্রহণ করা হয়েছে।`
                : 'আপনার বার্তাটি গ্রহণ করা হয়েছে। কোনো ব্যক্তিগত তথ্য জনসমক্ষে প্রকাশ করা হয় না।'}
            </p>

            {referenceId && (
              <div className="mt-3 inline-block rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2">
                <span className="font-en text-xs font-semibold text-[var(--color-body)]">
                  Reference ID:{' '}
                </span>
                <span className="font-en text-sm font-bold text-[var(--color-primary)]">
                  {referenceId}
                </span>
              </div>
            )}

            {isPendingVerification && (
              <div className="mt-4 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4 text-xs text-[var(--color-heading)]">
                <p className="font-en font-bold">Manual Payment Summary</p>
                <dl className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  <div>
                    <dt className="inline text-[var(--color-body)]">Method: </dt>
                    <dd className="inline font-en font-semibold">
                      {paymentMethod === 'bkash' ? 'bKash Send Money' : 'Nagad Send Money'}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-[var(--color-body)]">Amount: </dt>
                    <dd className="inline font-en font-semibold">{courseFee}</dd>
                  </div>
                  <div>
                    <dt className="inline text-[var(--color-body)]">Payment Number: </dt>
                    <dd className="inline font-en font-semibold">{MANUAL_PAYMENT_NUMBER}</dd>
                  </div>
                  <div>
                    <dt className="inline text-[var(--color-body)]">Transaction ID: </dt>
                    <dd className="inline font-en font-bold text-[var(--color-primary)]">
                      {transactionId.trim().toUpperCase()}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <p className="mt-3 text-xs text-[var(--color-body)]">
              এই form-এ কোনো ব্যাংক কার্ড নম্বর, CVV, PIN বা OTP সংগ্রহ করা হয় না।
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {isAuthenticated && mode !== 'contact' && (
                <Link
                  to="/dashboard/courses"
                  className="inline-flex min-h-[44px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  Open Learner Dashboard →
                </Link>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-[44px] items-center rounded-[8px] border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-tint)] cursor-pointer"
              >
                নতুন করে তথ্য দিন
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCourseFull && mode !== 'contact') {
    return (
      <div className="rounded-[12px] border border-amber-300 bg-amber-50 p-6 font-en text-sm text-amber-950">
        <p className="font-bold">Course Enrolment Full</p>
        <p className="mt-1 text-xs leading-relaxed">
          All seats for <strong>{courseTitle || courseCode}</strong> are currently filled. Check back for future cohort announcements or explore other active programmes.
        </p>
        <Link
          to="/programmes"
          className="mt-4 inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white"
        >
          Browse Other Programmes →
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8"
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${mode}-website-url`}>Website URL</label>
        <input
          id={`${mode}-website-url`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {mode !== 'contact' && courseCode && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-4 py-3">
          <div className="min-w-0">
            <span className="font-en text-xs font-bold text-[var(--color-primary)]">
              {courseCode}
            </span>
            {courseTitle && (
              <p className="font-en text-sm font-bold text-[var(--color-heading)]">
                {courseTitle}
              </p>
            )}
          </div>
          {courseFee && (
            <div className="shrink-0">
              {isFree ? (
                <span className="inline-flex items-center rounded-[6px] border border-[var(--color-free)] bg-[#EAF7EE] px-2.5 py-0.5 font-en text-xs font-bold text-[var(--color-free)]">
                  FREE · {courseFee}
                </span>
              ) : (
                <span className="font-en text-sm font-bold text-[var(--color-heading)] tabular-nums">
                  {courseFee}{' '}
                  {courseFeeNote && (
                    <span className="text-xs font-normal text-[var(--color-body)]">
                      · {courseFeeNote}
                    </span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2 rounded-[8px] border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${mode}-name`} className="block text-sm font-semibold text-[var(--color-heading)]">
            পূর্ণ নাম *
          </label>
          <input
            id={`${mode}-name`}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার নাম"
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor={`${mode}-email`} className="block text-sm font-semibold text-[var(--color-heading)]">
            Email Address *
          </label>
          <input
            id={`${mode}-email`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          />
        </div>

        {(mode === 'free-masterclass' || mode === 'course-application') && (
          <div>
            <label htmlFor={`${mode}-phone`} className="block text-sm font-semibold text-[var(--color-heading)]">
              Phone / WhatsApp *
            </label>
            <input
              id={`${mode}-phone`}
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1XXX-XXXXXX"
              className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            />
          </div>
        )}

        {mode === 'course-application' && (
          <div>
            <label htmlFor={`${mode}-bg`} className="block text-sm font-semibold text-[var(--color-heading)]">
              শিক্ষাগত বা পেশাগত পরিচয় *
            </label>
            <input
              id={`${mode}-bg`}
              type="text"
              required
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="যেমন: University Student / Analyst"
              className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            />
          </div>
        )}

        {mode === 'free-masterclass' && (
          <div>
            <label htmlFor={`${mode}-bg`} className="block text-sm font-semibold text-[var(--color-heading)]">
              পেশা বা শিক্ষাস্তর (ঐচ্ছিক)
            </label>
            <input
              id={`${mode}-bg`}
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="যেমন: শিক্ষার্থী, শিক্ষক, চাকরিজীবী"
              className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            />
          </div>
        )}

        {mode === 'contact' && (
          <>
            <div className="sm:col-span-2">
              <label htmlFor={`${mode}-subject`} className="block text-sm font-semibold text-[var(--color-heading)]">
                বিষয় (Subject) *
              </label>
              <input
                id={`${mode}-subject`}
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="আপনার প্রশ্নের বিষয়"
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${mode}-msg`} className="block text-sm font-semibold text-[var(--color-heading)]">
                বার্তা (Message) *
              </label>
              <textarea
                id={`${mode}-msg`}
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="আপনার জিজ্ঞাসা বিস্তারিত লিখুন..."
                className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2.5 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>
          </>
        )}

        {mode === 'course-application' && (
          <div className="sm:col-span-2">
            <label htmlFor={`${mode}-note`} className="block text-sm font-semibold text-[var(--color-heading)]">
              শেখার লক্ষ্য (ঐচ্ছিক)
            </label>
            <textarea
              id={`${mode}-note`}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="এই programme থেকে কী শিখতে চান তা সংক্ষেপে লিখতে পারেন..."
              className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2.5 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Manual Payment Section for Paid Programmes (bKash / Nagad Send Money) */}
      {requiresPayment && (
        <div className="mt-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-en text-base font-bold text-[var(--color-heading)]">
              Manual Payment — Send Money
            </h3>
            <span className="rounded-full bg-[var(--color-tint)] px-3 py-0.5 font-en text-xs font-bold text-[var(--color-primary)]">
              Payable: {courseFee || '৳999'}
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-[var(--color-body)]">
            নিচের নম্বরে <strong>Send Money</strong>-র মাধ্যমে নির্ধারিত ফি (<strong>{courseFee}</strong>) পাঠিয়ে <strong>Transaction ID (TrxID)</strong> জমা দিন। যাচাই সম্পন্ন না হওয়া পর্যন্ত আপনার আবেদন <strong>Pending Verification</strong> অবস্থায় থাকবে।
          </p>

          {/* Payment Number Box */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-3">
            <div>
              <p className="font-en text-[11px] font-semibold uppercase tracking-wide text-[var(--color-body)]">
                bKash / Nagad Send Money Number
              </p>
              <p className="font-en text-base font-bold text-[var(--color-heading)] tabular-nums">
                {MANUAL_PAYMENT_NUMBER}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyNumber}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[8px] border border-[var(--color-primary)] bg-white px-3 py-1.5 font-en text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-tint)] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[var(--color-free)]" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copy Number</span>
                </>
              )}
            </button>
          </div>

          {/* Payment Method Selector */}
          <div className="mt-4">
            <span className="block text-sm font-semibold text-[var(--color-heading)]">
              Payment Method *
            </span>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <label
                className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-[8px] border px-3.5 py-2.5 transition-colors ${
                  paymentMethod === 'bkash'
                    ? 'border-[var(--color-primary)] bg-[var(--color-tint)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-heading)] hover:border-[var(--color-primary)]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bkash"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="h-4 w-4 text-[var(--color-primary)]"
                />
                <span className="font-en text-sm font-semibold">bKash Send Money</span>
              </label>

              <label
                className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-[8px] border px-3.5 py-2.5 transition-colors ${
                  paymentMethod === 'nagad'
                    ? 'border-[var(--color-primary)] bg-[var(--color-tint)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-heading)] hover:border-[var(--color-primary)]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="nagad"
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="h-4 w-4 text-[var(--color-primary)]"
                />
                <span className="font-en text-sm font-semibold">Nagad Send Money</span>
              </label>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${mode}-sender`} className="block text-sm font-semibold text-[var(--color-heading)]">
                Sender Mobile Number (ঐচ্ছিক)
              </label>
              <input
                id={`${mode}-sender`}
                type="tel"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor={`${mode}-trxid`} className="block text-sm font-semibold text-[var(--color-heading)]">
                Transaction ID (TrxID) *
              </label>
              <input
                id={`${mode}-trxid`}
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="যেমন: BGH7X9K2M1"
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3.5 py-2 font-en text-sm uppercase text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-start gap-2.5">
        <input
          id={`${mode}-consent`}
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />
        <label htmlFor={`${mode}-consent`} className="text-xs leading-relaxed text-[var(--color-body)]">
          {requiresPayment
            ? 'আমি বুঝেছি এটি একটি non-accredited শিক্ষামূলক প্রোগ্রাম; bKash/Nagad Send Money (+8801601289683) পেমেন্টের Transaction ID যাচাই না হওয়া পর্যন্ত আবেদনটি Pending Verification অবস্থায় থাকবে। এখানে কোনো ব্যাংক কার্ড বা PIN/OTP চাওয়া হচ্ছে না।'
            : 'আমি বুঝেছি এটি একটি non-accredited শিক্ষামূলক প্রোগ্রাম; এখানে কোনো ব্যাংক/পেমেন্ট নথি চাওয়া হচ্ছে না এবং আবেদন করলেই চাকরি বা আয়ের কোনো গ্যারান্টি দেওয়া হয় না।'}
        </label>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
        >
          {submitting
            ? 'জমা হচ্ছে...'
            : mode === 'free-masterclass'
            ? 'Free Session-এ Register করুন'
            : requiresPayment
            ? 'পেমেন্ট ও আবেদন জমা দিন'
            : mode === 'course-application'
            ? 'বিনামূল্যে নিবন্ধন সম্পন্ন করুন'
            : 'বার্তা পাঠান'}
        </button>
      </div>
    </form>
  );
}
