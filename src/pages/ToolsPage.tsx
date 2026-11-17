import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, FileText, Search, Sparkles, Wrench, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { COURSES } from '../data/coursesData';

export function ToolsPage() {
  // Tool 1: AI Prompt Builder state
  const [persona, setPersona] = useState('Data Analyst');
  const [task, setTask] = useState('Analyze monthly sales trends and summarize key outliers');
  const [tone, setTone] = useState('Professional and concise');
  const [outputFormat, setOutputFormat] = useState('Bullet points');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleGeneratePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    const result = `Act as an expert ${persona}. Your task is to: ${task}.
Tone and Style: ${tone}.
Output Format: ${outputFormat}.
Ensure high accuracy, clear structure, and actionable insights.`;
    setGeneratedPrompt(result);
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Tool 2: Course Matcher state
  const [interest, setInterest] = useState('business');
  const [experience, setExperience] = useState('beginner');

  const recommendedCourses = COURSES.filter((c) => {
    if (interest === 'business' && c.categorySlug !== 'ai-literacy' && c.categorySlug !== 'professional-development') return false;
    if (interest === 'tech' && c.categorySlug !== 'applied-ai' && c.categorySlug !== 'specialised-programmes') return false;
    return true;
  }).slice(0, 3);

  return (
    <Layout
      customTitle="AI Tools – Atlas AI Education"
      customDescription="Atlas AI Education interactive AI learning tools, prompt builders, and skill matching utilities."
    >
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Tools' }]}
        title="Interactive AI Learning Tools"
        subtitle="আপনার প্রাত্যহিক শিক্ষা ও কাজের দক্ষতা বৃদ্ধিতে সহায়ক ইন্টারঅ্যাক্টিভ এআই টুলস এবং প্রম্পট জেনারেটর।"
      />

      <section className="bg-[var(--color-soft-bg)] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Intro Card */}
          <div className="rounded-[16px] bg-gradient-to-r from-[#0B1F4B] to-[#0056D2] p-8 text-white shadow-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 font-en text-xs font-semibold backdrop-blur-md">
                <Wrench className="h-4 w-4 text-amber-300" aria-hidden="true" />
                <span>Student & Professional Utilities</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold font-en">
                Atlas AI Practitioner Toolkit
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-blue-100">
                এই পেজটিতে শিক্ষার্থীরা বিনামূল্যে বিভিন্ন প্র্যাকটিক্যাল এআই টুল ব্যবহার করতে পারবেন — যার মধ্যে রয়েছে স্ট্রাকচার্ড প্রম্পট বিল্ডার, কোর্স ফাইন্ডার এবং স্কিল এসেসমেন্ট গাইড।
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Tool 1: Structured Prompt Generator (Span 7) */}
            <div className="lg:col-span-7 rounded-[16px] border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--color-tint)] text-[var(--color-primary)]">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-heading)] font-en">
                    Structured Prompt Architect
                  </h3>
                  <p className="text-xs text-[var(--color-body)]">
                    Create production-grade AI prompts using persona, task, and constraints.
                  </p>
                </div>
              </div>

              <form onSubmit={handleGeneratePrompt} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-heading)] font-en mb-1.5">
                    1. AI Persona / Role
                  </label>
                  <input
                    type="text"
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    placeholder="e.g. Senior Copywriter, Data Scientist, Teacher"
                    className="min-h-[42px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-heading)] font-en mb-1.5">
                    2. Specific Task / Objective
                  </label>
                  <textarea
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    rows={2}
                    placeholder="Describe what you want the AI to achieve..."
                    className="w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-3 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-heading)] font-en mb-1.5">
                      Tone & Style
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 text-sm text-[var(--color-heading)] focus:outline-none"
                    >
                      <option value="Professional and concise">Professional & Concise</option>
                      <option value="Friendly and engaging">Friendly & Engaging</option>
                      <option value="Academic and rigorous">Academic & Rigorous</option>
                      <option value="Persuasive and sales-oriented">Persuasive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-heading)] font-en mb-1.5">
                      Output Format
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 text-sm text-[var(--color-heading)] focus:outline-none"
                    >
                      <option value="Bullet points">Bullet Points</option>
                      <option value="Structured table">Structured Table</option>
                      <option value="Step-by-step guide">Step-by-Step Guide</option>
                      <option value="Executive summary">Executive Summary</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[46px] rounded-[8px] bg-[var(--color-primary)] px-6 py-2.5 font-en text-sm font-bold text-white hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer shadow-xs"
                >
                  Generate Professional Prompt
                </button>
              </form>

              {generatedPrompt && (
                <div className="mt-6 rounded-[10px] border border-blue-200 bg-[var(--color-tint)] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-en text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                      Generated Prompt Result
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[6px] bg-[var(--color-primary)] px-3 py-1 font-en text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-[8px] bg-white p-3 font-en text-xs text-[var(--color-heading)] leading-relaxed whitespace-pre-wrap border border-blue-100">
                    {generatedPrompt}
                  </div>
                </div>
              )}
            </div>

            {/* Tool 2: Course Recommendation Matcher (Span 5) */}
            <div className="lg:col-span-5 rounded-[16px] border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-600">
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-heading)] font-en">
                      Course Match Finder
                    </h3>
                    <p className="text-xs text-[var(--color-body)]">
                      Find the ideal Atlas AI programme for your goals.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-heading)] font-en mb-1.5">
                      Your Primary Focus
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 text-sm text-[var(--color-heading)] focus:outline-none"
                    >
                      <option value="business">Business, Content & Entrepreneurship</option>
                      <option value="tech">Applied AI, Automation & Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-heading)] font-en mb-1.5">
                      Experience Level
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 text-sm text-[var(--color-heading)] focus:outline-none"
                    >
                      <option value="beginner">Beginner (No prior AI experience)</option>
                      <option value="intermediate">Intermediate / Working Professional</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h4 className="font-en text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recommended Programmes ({recommendedCourses.length})
                  </h4>
                  {recommendedCourses.map((course) => (
                    <div
                      key={course.code}
                      className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-3.5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-en text-[11px] font-bold text-[var(--color-primary)]">
                          {course.code} · {course.fee}
                        </span>
                        <h5 className="text-sm font-bold text-[var(--color-heading)] leading-tight mt-0.5">
                          {course.title}
                        </h5>
                      </div>
                      <Link
                        to={`/programmes/${course.code}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                        aria-label={`View ${course.title}`}
                      >
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--color-border)]">
                <Link
                  to="/programmes"
                  className="inline-flex items-center gap-2 font-en text-xs font-bold text-[var(--color-primary)] hover:underline"
                >
                  <span>Explore all 12 programmes</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
