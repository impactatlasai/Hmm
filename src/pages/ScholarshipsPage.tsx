import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  GraduationCap,
  HelpCircle,
  Info,
  Loader2,
  Lock,
  Percent,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { COURSES, CourseItem } from '../data/coursesData';
import { useAuth } from '../context/AuthContext';

interface ScholarshipCourseAvailability {
  code: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  fee: string;
  feeNum: number;
  maxWaiverPercent: number;
  maxWaiverBdt: number;
  feeAfterWaiverBdt: number;
  approvedCount: number;
  maxScholarships: number;
  remainingScholarships: number;
  isOpen: boolean;
}

interface MyScholarshipApp {
  id: string;
  reference_id: string;
  course_code: string;
  course_title: string;
  requested_waiver_pct: number;
  approved_waiver_pct: number | null;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Waitlisted';
  admin_notes: string;
  created_at: string;
  fee: string;
  category_name: string;
}

export function ScholarshipsPage() {
  const { search } = useLocation();
  const { isAuthenticated, user } = useAuth();

  const [availabilities, setAvailabilities] = useState<ScholarshipCourseAvailability[]>([]);
  const [loadingAvail, setLoadingAvail] = useState(true);
  const [myApplications, setMyApplications] = useState<MyScholarshipApp[]>([]);

  // Form state
  const [selectedCourse, setSelectedCourse] = useState<string>('AL-101');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [educationOrProfession, setEducationOrProfession] = useState<string>('');
  const [learningMotivation, setLearningMotivation] = useState<string>('');
  const [financialNeedReason, setFinancialNeedReason] = useState<string>('');
  const [commitmentStatement, setCommitmentStatement] = useState<string>('');
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(false);
  const [honeypot, setHoneypot] = useState<string>('');
  const formLoadedAt = useRef<number>(Date.now());

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [submittedCourseTitle, setSubmittedCourseTitle] = useState<string>('');

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone && user.phone) setPhone(user.phone);
      if (!educationOrProfession) {
        const bg = [user.profession, user.educationalBackground].filter(Boolean).join(' · ');
        if (bg) setEducationOrProfession(bg);
      }
    }
  }, [user, fullName, email, phone, educationOrProfession]);

  // Read course query param if provided (e.g. /scholarships?course=PD-301)
  useEffect(() => {
    const params = new URLSearchParams(search);
    const courseParam = params.get('course');
    if (courseParam) {
      const match = COURSES.find(
        (c) =>
          !c.isFree &&
          (c.code.toLowerCase() === courseParam.toLowerCase() ||
            c.slug.toLowerCase() === courseParam.toLowerCase())
      );
      if (match) {
        setSelectedCourse(match.code);
        const formEl = document.getElementById('apply-scholarship');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [search]);

  // Load availability
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/scholarships/availability');
        if (res.ok) {
          const data = (await res.json()) as { courses: ScholarshipCourseAvailability[] };
          if (!cancelled && data.courses) {
            setAvailabilities(data.courses);
          }
        }
      } catch {
        // Fallback silently if offline
      } finally {
        if (!cancelled) setLoadingAvail(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load my applications if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/scholarships/my', { credentials: 'include' });
        if (res.ok) {
          const data = (await res.json()) as { applications: MyScholarshipApp[] };
          if (!cancelled && data.applications) {
            setMyApplications(data.applications);
          }
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const paidCourses = COURSES.filter((c) => !c.isFree);
  const selectedCourseItem = paidCourses.find((c) => c.code === selectedCourse);

  const calculateFeeBreakdown = (course?: CourseItem) => {
    if (!course) return { original: 0, waiver: 0, final: 0 };
    const num = parseInt(course.fee.replace(/[^\d]/g, ''), 10) || 0;
    const waiver = Math.round(num * 0.5);
    return { original: num, waiver, final: num - waiver };
  };

  const currentFeeCalc = calculateFeeBreakdown(selectedCourseItem);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (fullName.trim().length < 2) {
      setFormError('দয়া করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setFormError('দয়া করে একটি সঠিক Email Address দিন।');
      return;
    }
    if (phone.trim().length < 6) {
      setFormError('দয়া করে একটি সচল Phone / WhatsApp নম্বর দিন।');
      return;
    }
    if (educationOrProfession.trim().length < 2) {
      setFormError('দয়া করে আপনার শিক্ষাগত বা পেশাগত পরিচয় উল্লেখ করুন।');
      return;
    }
    if (learningMotivation.trim().length < 15) {
      setFormError('দয়া করে আপনার শেখার আগ্রহ ও উদ্দেশ্য সম্পর্কে অন্তত ১৫ অক্ষর লিখুন।');
      return;
    }
    if (financialNeedReason.trim().length < 15) {
      setFormError('দয়া করে আপনার আর্থিক সহায়তার প্রয়োজন সম্পর্কে অন্তত ১৫ অক্ষর লিখুন।');
      return;
    }
    if (commitmentStatement.trim().length < 10) {
      setFormError('কোর্সটি সম্পন্ন করার প্রতিশ্রুতি ও সময় দেওয়ার প্রস্তুতি সম্পর্কে লিখুন।');
      return;
    }
    if (!privacyConsent) {
      setFormError('এগিয়ে যেতে Privacy Policy ও তথ্যের সত্যতা নিশ্চয়ন বক্সে টিক দিন।');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/scholarships/apply', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: selectedCourse,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          educationOrProfession: educationOrProfession.trim(),
          learningMotivation: learningMotivation.trim(),
          financialNeedReason: financialNeedReason.trim(),
          commitmentStatement: commitmentStatement.trim(),
          privacyConsent,
          website_url: honeypot,
          submittedAfterMs: Math.max(850, Date.now() - formLoadedAt.current),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        referenceId?: string;
        courseTitle?: string;
      };

      if (!res.ok) {
        setFormError(data.error || 'আবেদন পাঠাতে সমস্যা হয়েছে। একটু পর আবার চেষ্টা করুন।');
        return;
      }

      setSubmittedReference(data.referenceId || 'AAE-SCH-SUBMITTED');
      setSubmittedCourseTitle(data.courseTitle || selectedCourseItem?.title || selectedCourse);
    } catch {
      setFormError('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedReference(null);
    setFormError(null);
    setLearningMotivation('');
    setFinancialNeedReason('');
    setCommitmentStatement('');
    setPrivacyConsent(false);
    formLoadedAt.current = Date.now();
  };

  return (
    <Layout>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Scholarships' }]}
        title="Scholarships & Financial Assistance"
        subtitle="যোগ্যতা ও আর্থিক সীমাবদ্ধতা যেন AI শেখার পথে বাধা না হয়।"
      />

      {/* 1. Programme Philosophy Intro */}
      <section className="border-b border-[var(--color-border)] bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-6 sm:p-8">
            <div className="flex items-start gap-3.5">
              <Sparkles className="mt-1 h-6 w-6 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
              <div className="space-y-3">
                <p className="font-en text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)]">
                  Course-Based Scholarship Programme
                </p>
                <p className="text-base sm:text-lg leading-relaxed font-medium text-[var(--color-heading)]">
                  Atlas AI Education বিশ্বাস করে, AI শিক্ষা ও দক্ষতা উন্নয়নের সুযোগ আরও বেশি মানুষের কাছে পৌঁছানো উচিত। এ লক্ষ্যকে সামনে রেখে আমরা আমাদের নির্বাচিত Learning Programmes-এর জন্য <strong>Course-Based Scholarship Programme</strong> চালু করছি।
                </p>
                <p className="text-sm leading-relaxed text-[var(--color-body)]">
                  আমরা মনে করি আর্থিক অসচ্ছলতা কারো প্রযুক্তিগত উৎকর্ষতা অর্জনের পথে অন্তরায় হওয়া উচিত নয়। মেধা, শেখার আগ্রহ এবং দায়বদ্ধতার সমন্বয়ে আমরা প্রতিটি কোর্সে সীমিত সংখ্যক আসনে ৫০% পর্যন্ত ফি মওকুফ সুবিধা প্রদান করি।
                </p>
                <div className="pt-2">
                  <a
                    href="#apply-scholarship"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                  >
                    <span>Apply for Scholarship</span>
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Scholarship Opportunities (4 Pillars) */}
      <section className="bg-[var(--color-soft-bg)] py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-en text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)]">
              Scholarship Allocation & Scope
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">
              Scholarship Opportunities
            </h2>
            <p className="mt-2 text-sm sm:text-base font-semibold text-[var(--color-primary)]">
              প্রতি কোর্সে সর্বোচ্চ ৫ জন শিক্ষার্থী Scholarship-এর জন্য নির্বাচিত হতে পারবেন।
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-blue-50 text-[var(--color-primary)]">
                <Percent className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-en text-base font-bold text-[var(--color-heading)]">
                Maximum Scholarship
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                Course Fee-এর <strong>সর্বোচ্চ ৫০% পর্যন্ত</strong> Fee Waiver সুবিধা প্রদান করা হয়।
              </p>
            </div>

            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-purple-50 text-[#4B3FD6]">
                <Users className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-en text-base font-bold text-[var(--color-heading)]">
                Scholarship Allocation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                মানসম্মত অংশগ্রহণ ও ব্যক্তিগত মেন্টরিং বজায় রাখতে <strong>সর্বোচ্চ ৫ জন শিক্ষার্থী</strong> প্রতি কোর্সে।
              </p>
            </div>

            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-emerald-50 text-[var(--color-free)]">
                <Award className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-en text-base font-bold text-[var(--color-heading)]">
                Selection Method
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                আবেদনের ক্ষেত্রে <strong>Merit-based</strong> এবং <strong>Need-based</strong> মানবিক ও মেধার দ্বিমুখী বিবেচনা।
              </p>
            </div>

            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-amber-50 text-amber-700">
                <Clock className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-en text-base font-bold text-[var(--color-heading)]">
                Availability
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                সংশ্লিষ্ট কোর্স ও ব্যাচের নির্দিষ্ট Scholarship Allocation এবং আবেদন পর্যালোচনার ভিত্তিতে প্রযোজ্য।
              </p>
            </div>
          </div>

          {/* Programme Waiver Illustrative Table */}
          <div className="mt-12 overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-soft-bg)] px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-en text-sm font-bold text-[var(--color-heading)]">
                    Eligible Programmes & 50% Waiver Matrix
                  </h3>
                  <p className="text-xs text-[var(--color-body)]">
                    নির্বাচিত ১৫টি পেইড কোর্সে সর্বোচ্চ ৫০% স্কলারশিপ প্রযোজ্য।
                  </p>
                </div>
                <div className="text-xs font-semibold text-[var(--color-primary)]">
                  Quota: Max 5 Students / Course
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-en text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-slate-50 text-slate-700">
                    <th scope="col" className="px-5 py-3 font-semibold">Course Code & Title</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Regular Fee</th>
                    <th scope="col" className="px-5 py-3 font-semibold text-[var(--color-primary)]">Max 50% Waiver</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Payable After Waiver</th>
                    <th scope="col" className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {paidCourses.map((c) => {
                    const calc = calculateFeeBreakdown(c);
                    const avail = availabilities.find((a) => a.code === c.code);
                    const isClosed = avail && !avail.isOpen;

                    return (
                      <tr key={c.code} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-[var(--color-heading)]">{c.title}</span>
                          <span className="block font-mono text-xs text-[var(--color-body)]">{c.code}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[var(--color-body)]">
                          {c.categoryName}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[var(--color-body)]">
                          {c.fee}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-[var(--color-primary)]">
                          -৳{calc.waiver.toLocaleString('en-US')} (50%)
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          ৳{calc.final.toLocaleString('en-US')}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {isClosed ? (
                            <span className="inline-block text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded">
                              Batch Full (5/5)
                            </span>
                          ) : (
                            <a
                              href="#apply-scholarship"
                              onClick={() => setSelectedCourse(c.code)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                            >
                              <span>Apply</span>
                              <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[var(--color-border)] bg-slate-50 px-6 py-3 text-xs text-[var(--color-body)]">
              <span className="font-semibold text-[var(--color-heading)]">Free Programmes Notice: </span>
              AI Fundamentals & Digital Literacy (AL-100), AI Governance Fundamentals (FREE), এবং Women’s Safety in the AI Era (SP-WSAI) কর্মসূচিগুলোতে কোনো স্কলারশিপ প্রয়োজন নেই; এগুলো শুরু থেকেই সবার জন্য ১০০% ফ্রি।
            </div>
          </div>
        </div>
      </section>

      {/* 3. Eligibility & Selection Process (Side-by-Side) */}
      <section className="bg-white py-14 sm:py-16 border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* কারা আবেদন করতে পারবেন? */}
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-7 sm:p-8">
              <div className="flex items-center gap-2.5 text-[var(--color-primary)]">
                <Users className="h-5 w-5" aria-hidden="true" />
                <span className="font-en text-xs font-semibold tracking-wider uppercase">
                  Candidate Profile
                </span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-[var(--color-heading)]">
                কারা আবেদন করতে পারবেন?
              </h3>
              <p className="mt-2 text-sm text-[var(--color-body)]">
                যেসব আগ্রহী শিক্ষার্থী ও পেশাজীবী নিম্নলিখিত মানদণ্ডগুলো পূরণ করেন:
              </p>

              <ul className="mt-6 space-y-3.5 text-sm leading-relaxed text-[var(--color-heading)]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-free)]" aria-hidden="true" />
                  <span>AI ও প্রযুক্তি বিষয়ে বাস্তবিক জ্ঞান অর্জনের গভীর আগ্রহ রাখেন।</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-free)]" aria-hidden="true" />
                  <span>আর্থিক সীমাবদ্ধতার কারণে পূর্ণ কোর্স ফি বহনে বাস্তব সমস্যার মুখোমুখি হচ্ছেন।</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-free)]" aria-hidden="true" />
                  <span>শেখার প্রতি আন্তরিকতা, সময়ানুবর্তিতা ও অধ্যবসায়ের স্পষ্ট প্রতিশ্রুতি প্রদর্শন করতে পারেন।</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-free)]" aria-hidden="true" />
                  <span>সংশ্লিষ্ট কোর্সের আবশ্যকীয় শিক্ষাগত বা পেশাগত যোগ্যতা ও প্রস্তুতি বজায় রাখেন।</span>
                </li>
              </ul>
            </div>

            {/* Scholarship Selection Process */}
            <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-7 sm:p-8">
              <div className="flex items-center gap-2.5 text-[var(--color-primary)]">
                <FileText className="h-5 w-5" aria-hidden="true" />
                <span className="font-en text-xs font-semibold tracking-wider uppercase">
                  Evaluation Framework
                </span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-[var(--color-heading)]">
                Scholarship Selection Process
              </h3>
              <p className="mt-2 text-sm text-[var(--color-body)]">
                আবেদন পর্যালোচনার ক্ষেত্রে আমাদের কমিটি প্রধান ৪টি দিক বিবেচনা করে:
              </p>

              <ol className="mt-6 space-y-3.5 text-sm leading-relaxed text-[var(--color-heading)]">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 font-en text-xs font-bold text-[var(--color-primary)]">
                    1
                  </span>
                  <div>
                    <strong className="block text-[var(--color-heading)]">Learning Motivation</strong>
                    <span className="text-xs text-[var(--color-body)]">শেখার আগ্রহ, ভবিষ্যৎ লক্ষ্য এবং অর্জিত দক্ষতা ব্যবহারের বাস্তব পরিকল্পনা।</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 font-en text-xs font-bold text-[var(--color-primary)]">
                    2
                  </span>
                  <div>
                    <strong className="block text-[var(--color-heading)]">Financial Need</strong>
                    <span className="text-xs text-[var(--color-body)]">প্রকৃত আর্থিক সক্ষমতা এবং ফি মওকুফ সহায়তার যৌক্তিক প্রয়োজনীয়তা।</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 font-en text-xs font-bold text-[var(--color-primary)]">
                    3
                  </span>
                  <div>
                    <strong className="block text-[var(--color-heading)]">Educational or Professional Background</strong>
                    <span className="text-xs text-[var(--color-body)]">শিক্ষাগত বা কর্মক্ষেত্রের প্রেক্ষাপট এবং নির্বাচিত কোর্সের সাথে তার প্রাসঙ্গিকতা।</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 font-en text-xs font-bold text-[var(--color-primary)]">
                    4
                  </span>
                  <div>
                    <strong className="block text-[var(--color-heading)]">Commitment to Learning</strong>
                    <span className="text-xs text-[var(--color-body)]">৪ সপ্তাহের ৮টি ক্লাস, প্র্যাকটিক্যাল অ্যাসাইনমেন্ট ও মূল্যায়ন সম্পন্ন করার লিখিত প্রতিশ্রুতি।</span>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Important Scholarship Conditions */}
      <section className="bg-[var(--color-soft-bg)] py-14 sm:py-16 border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-7 sm:p-10">
            <div className="flex items-center gap-2.5 text-[var(--color-primary)]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              <span className="font-en text-xs font-semibold tracking-wider uppercase">
                Terms & Transparency
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-[var(--color-heading)]">
              Important Scholarship Conditions
            </h3>
            <p className="mt-1 text-sm text-[var(--color-body)]">
              আবেদন করার পূর্বে নীতিমালার প্রতিটি শর্ত সতর্কতার সাথে পড়ুন:
            </p>

            <div className="mt-6 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)] text-sm leading-relaxed text-[var(--color-heading)]">
              <div className="flex items-start gap-3 py-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <span>Scholarship সর্বোচ্চ ৫০% পর্যন্ত Course Fee Waiver হিসেবে প্রদান করা হবে।</span>
              </div>
              <div className="flex items-start gap-3 py-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <span>প্রতিটি কোর্সে সর্বোচ্চ ৫ জন শিক্ষার্থী নির্বাচিত হতে পারবেন।</span>
              </div>
              <div className="flex items-start gap-3 py-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <span>Scholarship-এর পরিমাণ আবেদনকারীর যোগ্যতা, প্রয়োজন এবং উপলব্ধ বরাদ্দের ভিত্তিতে নির্ধারিত হবে।</span>
              </div>
              <div className="flex items-start gap-3 py-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <span>Scholarship স্বয়ংক্রিয়ভাবে প্রদান করা হবে না; আবেদন ও মূল্যায়নের মাধ্যমে নির্বাচন করা হবে।</span>
              </div>
              <div className="flex items-start gap-3 py-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <span>Scholarship কেবল নির্ধারিত কোর্স ফি-এর ক্ষেত্রে প্রযোজ্য; অন্যান্য ফি থাকলে তা আলাদাভাবে জানানো হবে।</span>
              </div>
              <div className="flex items-start gap-3 py-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <span>Free Programmes-এর ক্ষেত্রে Scholarship প্রযোজ্য নয়।</span>
              </div>
              <div className="flex items-start gap-3 py-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <span>Scholarship-এর আসন পূর্ণ হলে সংশ্লিষ্ট কোর্সের জন্য নতুন আবেদন গ্রহণ বন্ধ হতে পারে।</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Existing Learner Applications Banner (if authenticated and has applications) */}
      {isAuthenticated && myApplications.length > 0 && (
        <section className="bg-white py-8 border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[12px] border border-blue-200 bg-blue-50/60 p-5">
              <h4 className="font-en text-sm font-bold text-blue-950 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                <span>Your Active Scholarship Applications ({myApplications.length})</span>
              </h4>
              <div className="mt-3 space-y-2">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3 border border-blue-100 text-xs text-[var(--color-heading)]"
                  >
                    <div>
                      <span className="font-bold">{app.course_title}</span>
                      <span className="font-mono text-slate-500 ml-2">({app.course_code})</span>
                      <span className="block text-[11px] text-slate-500 font-mono mt-0.5">Ref: {app.reference_id}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : app.status === 'Waitlisted'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300'
                            : app.status === 'Rejected'
                            ? 'bg-red-50 text-red-800 border border-red-300'
                            : 'bg-blue-50 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {app.status === 'Approved' ? `Approved (${app.approved_waiver_pct || 50}% Waiver)` : app.status}
                      </span>
                      <Link
                        to="/dashboard"
                        className="font-en text-[11px] font-semibold text-[var(--color-primary)] hover:underline"
                      >
                        Open Dashboard →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Apply for a Scholarship Form */}
      <section id="apply-scholarship" className="bg-white py-16 scroll-mt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-en text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)]">
              Application Portal
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">
              Apply for a Scholarship
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[var(--color-body)] leading-relaxed">
              আপনার শেখার আগ্রহ ও প্রয়োজনের কথা আমাদের জানান। আপনার আবেদন পর্যালোচনা করে Scholarship-এর বিষয়ে জানানো হবে।
            </p>
          </div>

          {submittedReference ? (
            <div
              role="status"
              className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[var(--color-free)]">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-[var(--color-heading)]">
                Scholarship আবেদন সফলভাবে গ্রহণ করা হয়েছে
              </h3>
              <p className="mt-2 text-sm text-[var(--color-body)] max-w-md mx-auto">
                <strong>{submittedCourseTitle}</strong> কোর্সের Scholarship মূল্যায়নের জন্য আপনার তথ্য নিবন্ধিত হয়েছে।
              </p>

              <div className="mt-4 inline-block rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-2">
                <span className="font-en text-xs text-[var(--color-body)]">Application Reference: </span>
                <span className="font-mono text-sm font-bold text-[var(--color-primary)]">
                  {submittedReference}
                </span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-[var(--color-body)] max-w-lg mx-auto">
                আমাদের অ্যাকাডেমিক কমিটি আবেদনটি পর্যালোচনা করে ফলাফল ইমেইল অথবা Learner Dashboard-এর মাধ্যমে জানাবে। কোনো প্রকার ব্যাংক কার্ড নম্বর, পিন বা ওটিপি কখনোই চাওয়া হবে না।
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex min-h-[44px] items-center rounded-[8px] bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
                  >
                    Go to Learner Dashboard →
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex min-h-[44px] items-center rounded-[8px] bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
                  >
                    Log In to Track Status →
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex min-h-[44px] items-center rounded-[8px] border border-[var(--color-border)] bg-white px-5 py-2 text-sm font-semibold text-[var(--color-body)] hover:bg-slate-50 cursor-pointer"
                >
                  অন্য কোর্সে আবেদন করুন
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-10 shadow-sm"
            >
              {formError && (
                <div
                  role="alert"
                  className="mb-6 rounded-[8px] border border-red-300 bg-red-50 p-4 text-xs text-red-800"
                >
                  {formError}
                </div>
              )}

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="sch_website_url">Website</label>
                <input
                  type="text"
                  id="sch_website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Course Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="sch_course_select"
                  className="block text-sm font-bold text-[var(--color-heading)]"
                >
                  যে কোর্সের জন্য Scholarship চান (কোর্স নির্বাচন করুন) *
                </label>
                <select
                  id="sch_course_select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full rounded-[8px] border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm font-medium text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
                >
                  <optgroup label="AI Literacy & Foundation (Paid)">
                    {paidCourses
                      .filter((c) => c.categorySlug === 'ai-literacy')
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.title} ({c.code}) — {c.fee}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Applied AI (Paid)">
                    {paidCourses
                      .filter((c) => c.categorySlug === 'applied-ai')
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.title} ({c.code}) — {c.fee}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Professional Development (Paid)">
                    {paidCourses
                      .filter((c) => c.categorySlug === 'professional-development')
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.title} ({c.code}) — {c.fee}
                        </option>
                      ))}
                  </optgroup>
                </select>

                {/* Course Fee Waiver Calculation card */}
                {selectedCourseItem && (
                  <div className="mt-3 rounded-[8px] border border-blue-100 bg-blue-50/50 p-4 font-en text-xs text-blue-950">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold">{selectedCourseItem.title}</span>
                      <span className="text-slate-600">Category: {selectedCourseItem.categoryName}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 border-t border-blue-200/60 pt-2 text-center">
                      <div>
                        <span className="block text-[11px] text-slate-500">Regular Course Fee</span>
                        <span className="font-bold text-slate-900">৳{currentFeeCalc.original.toLocaleString('en-US')}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-500">Max 50% Waiver</span>
                        <span className="font-bold text-[var(--color-primary)]">-৳{currentFeeCalc.waiver.toLocaleString('en-US')}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-500">Fee If Approved</span>
                        <span className="font-bold text-emerald-800">৳{currentFeeCalc.final.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="sch_fullname" className="block text-xs font-bold text-[var(--color-heading)]">
                    আপনার পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    id="sch_fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. ফারহানা হক"
                    className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] px-3.5 py-2.5 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="sch_email" className="block text-xs font-bold text-[var(--color-heading)]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="sch_email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] px-3.5 py-2.5 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="sch_phone" className="block text-xs font-bold text-[var(--color-heading)]">
                    Phone / WhatsApp নম্বর *
                  </label>
                  <input
                    type="tel"
                    id="sch_phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] px-3.5 py-2.5 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="sch_education" className="block text-xs font-bold text-[var(--color-heading)]">
                    শিক্ষাগত বা পেশাগত পরিচয় *
                  </label>
                  <input
                    type="text"
                    id="sch_education"
                    value={educationOrProfession}
                    onChange={(e) => setEducationOrProfession(e.target.value)}
                    placeholder="e.g. ৩য় বর্ষের শিক্ষার্থী (বিবিএ) / জুনিয়র ডেভেলপার"
                    className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] px-3.5 py-2.5 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* 3 Core Criteria Questions */}
              <div className="mt-6 space-y-5 border-t border-[var(--color-border)] pt-6">
                <div>
                  <label htmlFor="sch_motivation" className="block text-xs font-bold text-[var(--color-heading)]">
                    ১. Learning Motivation — এই কোর্সটি শেখার পেছনে আপনার আগ্রহ ও উদ্দেশ্য কী? *
                  </label>
                  <p className="mt-1 text-[11px] text-[var(--color-body)]">
                    কোর্সটি সম্পন্ন করার পর অর্জিত জ্ঞান আপনি কীভাবে ব্যবহার করতে চান, সংক্ষেপে উল্লেখ করুন।
                  </p>
                  <textarea
                    id="sch_motivation"
                    rows={3}
                    value={learningMotivation}
                    onChange={(e) => setLearningMotivation(e.target.value)}
                    placeholder="আপনার শেখার উদ্দেশ্য এবং ভবিষ্যৎ লক্ষ্য সংক্ষেপে লিখুন..."
                    className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] p-3 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="sch_need" className="block text-xs font-bold text-[var(--color-heading)]">
                    ২. Financial Need — কোর্স ফি বহনে আপনার আর্থিক সীমাবদ্ধতার কারণ সংক্ষেপে জানান *
                  </label>
                  <p className="mt-1 text-[11px] text-[var(--color-body)]">
                    সহায়তা কেন প্রয়োজন তা উল্লেখ করুন। সংবেদনশীল ব্যাংক নম্বর বা ব্যক্তিগত আর্থিক ডকুমেন্ট দেওয়ার কোনো প্রয়োজন নেই।
                  </p>
                  <textarea
                    id="sch_need"
                    rows={3}
                    value={financialNeedReason}
                    onChange={(e) => setFinancialNeedReason(e.target.value)}
                    placeholder="আপনার আর্থিক সহায়তার প্রেক্ষাপট সংক্ষেপে জানান..."
                    className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] p-3 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="sch_commitment" className="block text-xs font-bold text-[var(--color-heading)]">
                    ৩. Commitment to Learning — ৪ সপ্তাহের ৮টি ক্লাস ও অ্যাসাইনমেন্ট সম্পন্ন করার প্রতিশ্রুতি *
                  </label>
                  <p className="mt-1 text-[11px] text-[var(--color-body)]">
                    কোর্সের জন্য প্রতি সপ্তাহে প্রয়োজনীয় সময় দেওয়া এবং নিয়মিত অংশ নেওয়ার নিশ্চয়তা দিন।
                  </p>
                  <textarea
                    id="sch_commitment"
                    rows={2}
                    value={commitmentStatement}
                    onChange={(e) => setCommitmentStatement(e.target.value)}
                    placeholder="ক্লাসে নিয়মিত উপস্থিতি ও কাজ সম্পন্ন করার প্রস্তুতি নিশ্চিত করুন..."
                    className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] p-3 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Transparency & Consent */}
              <div className="mt-6 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4 text-xs text-[var(--color-body)]">
                <div className="flex items-start gap-2.5">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-[var(--color-heading)]">গোপনীয়তা ও ডেটা সুরক্ষার নিশ্চয়তা:</span>
                    <p className="mt-0.5 leading-relaxed">
                      Atlas AI Education স্কলারশিপ আবেদনের জন্য অপ্রয়োজনীয় সংবেদনশীল ব্যাংক নথি, ব্যাংক অ্যাকাউন্ট নম্বর, পাসওয়ার্ড বা গোপন কোড দাবি করে না। আপনার প্রদত্ত তথ্য কেবল মূল্যায়ন ও কোর্স সমন্বয়ের জন্য সুরক্ষিতভাবে সংরক্ষিত থাকবে।
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex items-start gap-2.5 border-t border-[var(--color-border)] pt-3">
                  <input
                    type="checkbox"
                    id="sch_privacy_consent"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                  />
                  <label htmlFor="sch_privacy_consent" className="cursor-pointer text-[var(--color-heading)]">
                    আমি নিশ্চিত করছি যে উপরে প্রদত্ত তথ্যগুলো সত্য এবং আমি Atlas AI Education-এর{' '}
                    <Link to="/privacy" className="text-[var(--color-primary)] underline">Privacy Policy</Link>{' '}
                    ও স্কলারশিপের শর্তাবলি মেনে আবেদন করছি। *
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      আবেদন জমা হচ্ছে...
                    </>
                  ) : (
                    'Apply for Scholarship'
                  )}
                </button>

                <p className="text-xs text-[var(--color-body)]">
                  নির্বাচিত হলে ইমেইল বা ড্যাশবোর্ডে জানানো হবে।
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 7. Transparency & Privacy Dedicated Section */}
      <section className="bg-[var(--color-soft-bg)] py-12 border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="h-6 w-6 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-bold text-[var(--color-heading)]">
                  Transparency & Privacy
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                  Scholarship আবেদনের জন্য অপ্রয়োজনীয় সংবেদনশীল ব্যাংক নথি, ব্যাংক অ্যাকাউন্ট নম্বর, পাসওয়ার্ড বা আর্থিক গোপনীয় তথ্য চাওয়া হবে না। আবেদনকারীর তথ্য যথাযথভাবে সংরক্ষণ ও ব্যবহারের ব্যবস্থা নিশ্চিত করা হয়েছে।
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--color-body)] font-en">
                  <span>· Non-sensitive need appraisal</span>
                  <span>· Zero credit/debit card credential collection</span>
                  <span>· Strict safeguarding & data governance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
