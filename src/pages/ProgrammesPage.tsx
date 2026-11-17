import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Building2,
  GraduationCap,
  Layers,
  Search,
  Users,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { CourseCard } from '../components/CourseCard';
import { InstitutionalServiceCard } from '../components/InstitutionalServiceCard';
import { InstitutionalConsultationForm } from '../components/InstitutionalConsultationForm';
import {
  APPLIED_AI_LEARNING_PATHWAY,
  COURSE_CATEGORIES,
  COURSES,
  CategorySlug,
  FOUNDATION_LEARNING_PATHWAY,
  TierAccentType,
  getCategoryEnrolmentInfo,
  getCoursesByCategory,
} from '../data/coursesData';
import {
  INSTITUTIONAL_SERVICES,
  InstitutionalServiceItem,
} from '../data/institutionalServicesData';

const SECTION_ACCENT_BORDER: Record<TierAccentType, string> = {
  free: 'border-t-4 border-t-[var(--color-free)]',
  literacy: 'border-t-4 border-t-[var(--color-literacy)]',
  applied: 'border-t-4 border-t-[var(--color-applied)]',
  professional: 'border-t-4 border-t-[var(--color-professional)]',
  specialised: 'border-t-4 border-t-[var(--color-specialised-border)]',
};

const SECTION_CHIP_STYLE: Record<TierAccentType, string> = {
  free: 'bg-[#EAF7EE] text-[#1E8E3E]',
  literacy: 'bg-[var(--color-tint)] text-[var(--color-primary)]',
  applied: 'bg-[#EEEDFC] text-[#4B3FD6]',
  professional: 'bg-[#E8EDF7] text-[#0B1F4B]',
  specialised: 'bg-[#F1F4F9] text-[#0B1F4B]',
};

function normalizeText(str: string): string {
  return str.replace(/[\u2018\u2019]/g, "'").toLowerCase();
}

export function ProgrammesPage() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<'all' | CategorySlug>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitutionalService, setSelectedInstitutionalService] = useState<string>(
    INSTITUTIONAL_SERVICES[0].slug
  );

  const normalizedQuery = normalizeText(searchQuery.trim());

  const matchesSearch = (course: (typeof COURSES)[number]) => {
    if (!normalizedQuery) return true;
    const haystack = normalizeText(
      [
        course.code,
        course.title,
        course.categoryName,
        course.hook,
        course.fee,
        ...course.keyAreas,
      ].join(' ')
    );
    return haystack.includes(normalizedQuery);
  };

  const matchesInstitutionalSearch = (service: InstitutionalServiceItem) => {
    if (!normalizedQuery) return true;
    const pathwayText = service.pathways
      ? service.pathways.map((p) => `${p.title} ${p.summary}`).join(' ')
      : '';
    const sectorText = service.sectors
      ? service.sectors.map((s) => `${s.title} ${s.summary}`).join(' ')
      : '';
    const haystack = normalizeText(
      [
        service.code,
        service.title,
        service.badge,
        service.shortSummary,
        'Specialised Programmes',
        'Institutional Training Advisory',
        ...service.keyAreas,
        pathwayText,
        sectorText,
      ].join(' ')
    );
    return haystack.includes(normalizedQuery);
  };

  const totalMatchingCourses = COURSES.filter(matchesSearch).length;
  const matchingInstitutionalServices = INSTITUTIONAL_SERVICES.filter(
    matchesInstitutionalSearch
  );
  const hasAnyMatch =
    totalMatchingCourses > 0 || matchingInstitutionalServices.length > 0;

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const hashSlug = hash as CategorySlug;
    if (COURSE_CATEGORIES.some((c) => c.slug === hashSlug)) {
      setActiveCategory(hashSlug);
      const target = document.getElementById(hashSlug);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    } else if (hash === 'institutional-consultation' || hash === 'institutional-services') {
      setActiveCategory('specialised-programmes');
      const target = document.getElementById(hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    }
  }, [location.hash]);

  const handleCategoryJump = (target: 'all' | CategorySlug) => {
    setActiveCategory(target);
    if (target === 'all') {
      setSearchQuery('');
      const el = document.getElementById('catalogue-sections');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (window.location.hash) {
        window.history.replaceState(null, '', '/programmes');
      }
      return;
    }

    const sectionEl = document.getElementById(target);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.history.replaceState(null, '', `/programmes#${target}`);
  };

  const handleConsultClick = (serviceSlug: string) => {
    setSelectedInstitutionalService(serviceSlug);
    const formEl = document.getElementById('institutional-consultation');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Layout>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Programmes' }]}
        badge={`${COURSES.length} Programmes · ${COURSE_CATEGORIES.length} Learning Tracks · ${INSTITUTIONAL_SERVICES.length} Institutional Services`}
        title="Explore Our Programmes"
        subtitle="Build AI knowledge, practical skills and professional capabilities through structured learning programmes and institutional advisory services."
      />

      {/* Filter Navigation + Search + Total Count */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Section Jump Pills */}
            <nav
              aria-label="Programme category navigation"
              className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0"
            >
              <button
                type="button"
                onClick={() => handleCategoryJump('all')}
                className={`min-h-[44px] shrink-0 rounded-full px-4 py-2 font-en text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'border border-[var(--color-border)] bg-[var(--color-soft-bg)] text-[var(--color-heading)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                All ({COURSES.length})
              </button>

              {COURSE_CATEGORIES.map((cat) => {
                const count = getCoursesByCategory(cat.slug).length;
                const selected = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleCategoryJump(cat.slug)}
                    className={`min-h-[44px] shrink-0 rounded-full px-4 py-2 font-en text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'border border-[var(--color-border)] bg-[var(--color-soft-bg)] text-[var(--color-heading)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {cat.title} ({count})
                  </button>
                );
              })}
            </nav>

            {/* Search Input + Live Count */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center shrink-0">
              <div className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3 py-2 font-en text-xs font-semibold text-[var(--color-heading)] whitespace-nowrap">
                <BookOpen className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                <span>
                  {normalizedQuery
                    ? `${totalMatchingCourses} of ${COURSES.length} Programmes · ${matchingInstitutionalServices.length} Institutional`
                    : `${COURSES.length} Programmes · ${INSTITUTIONAL_SERVICES.length} Institutional`}
                </span>
              </div>

              <div className="relative w-full sm:w-72 shrink-0">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-body)]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search programmes or institutional services..."
                  aria-label="Search programmes or institutional services"
                  className="min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] py-2 pl-10 pr-4 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Single-Page Four-Category Catalogue */}
      <div id="catalogue-sections" className="scroll-mt-20">
        {!hasAnyMatch ? (
          <section className="bg-[var(--color-soft-bg)]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-8 text-center">
                <p className="font-en text-base font-semibold text-[var(--color-heading)]">
                  No programmes or institutional services matched &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 inline-flex min-h-[44px] items-center rounded-[8px] bg-[var(--color-primary)] px-5 py-2 font-en text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] cursor-pointer"
                >
                  Show All {COURSES.length} Programmes &amp; Institutional Services
                </button>
              </div>
            </div>
          </section>
        ) : (
          COURSE_CATEGORIES.map((category, index) => {
            const categoryCourses = getCoursesByCategory(category.slug).filter(matchesSearch);
            const isSpecialised = category.slug === 'specialised-programmes';
            const showSpecialised =
              isSpecialised &&
              (categoryCourses.length > 0 || matchingInstitutionalServices.length > 0);

            if (!isSpecialised && categoryCourses.length === 0) return null;
            if (isSpecialised && !showSpecialised) return null;

            const isSoftBg = index % 2 === 1;
            const totalInCategory = getCoursesByCategory(category.slug).length;
            const categoryEnrolmentInfo = !isSpecialised
              ? getCategoryEnrolmentInfo(category.slug)
              : undefined;

            return (
              <section
                key={category.slug}
                id={category.slug}
                className={`scroll-mt-20 border-b border-[var(--color-border)] ${
                  isSoftBg ? 'bg-[var(--color-soft-bg)]' : 'bg-white'
                }`}
              >
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
                  {/* Category Section Header */}
                  <div
                    className={`mb-8 rounded-[12px] border border-[var(--color-border)] ${
                      SECTION_ACCENT_BORDER[category.tierAccent]
                    } ${isSoftBg ? 'bg-white' : 'bg-[var(--color-soft-bg)]'} p-6 sm:p-7`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-en text-xs font-semibold ${
                            SECTION_CHIP_STYLE[category.tierAccent]
                          }`}
                        >
                          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {String(index + 1).padStart(2, '0')} · {category.title}
                          </span>
                        </span>
                        <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 font-en text-xs font-semibold text-[var(--color-heading)]">
                          {isSpecialised
                            ? `${totalInCategory} Learning Programme · ${INSTITUTIONAL_SERVICES.length} Institutional Services`
                            : normalizedQuery
                            ? `${categoryCourses.length} of ${totalInCategory} Programmes`
                            : `${totalInCategory} ${
                                totalInCategory === 1 ? 'Programme' : 'Programmes'
                              }`}
                        </span>
                      </div>
                      <span className="font-en text-xs font-semibold text-[var(--color-body)]">
                        {isSpecialised
                          ? 'FREE Educational Programme + Institutional Consultation'
                          : category.feeRange}
                      </span>
                    </div>

                    <h2 className="mt-3 font-en text-2xl font-bold text-[var(--color-heading)] sm:text-3xl">
                      {category.title}
                    </h2>
                    <p className="prose-measure mt-2 text-sm leading-relaxed text-[var(--color-body)] sm:text-base">
                      {category.bannerOverview}
                    </p>
                    {categoryEnrolmentInfo && (
                      <div className="mt-4 flex flex-wrap items-center gap-3 pt-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1 font-en text-xs font-semibold text-[var(--color-heading)]">
                          <Users
                            className="h-3.5 w-3.5 text-[var(--color-primary)]"
                            aria-hidden="true"
                          />
                          <span>{categoryEnrolmentInfo.seatLabel} per course</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1 font-en text-xs font-semibold text-[var(--color-heading)]">
                          <Award
                            className="h-3.5 w-3.5 text-[var(--color-primary)]"
                            aria-hidden="true"
                          />
                          <span>{categoryEnrolmentInfo.certificateLabel}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Standard Category Cards Grid (Categories 1–3) */}
                  {!isSpecialised ? (
                    <>
                      {category.slug === 'ai-literacy' && !normalizedQuery && (
                        <div className="mb-8 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-5 sm:p-6">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="font-en text-base font-bold text-[var(--color-heading)]">
                              Recommended Learning Pathway (AI Literacy &amp; Foundation)
                            </h3>
                            <span className="font-en text-xs font-semibold text-[var(--color-primary)]">
                              6 Courses · 2 Free · 4 Paid
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--color-body)] sm:text-sm">
                            নিচের sequence একটি recommended pathway। প্রতিটি কোর্সের নিজস্ব learning objectives আছে, তাই শিক্ষার্থী নিজের প্রয়োজন অনুযায়ী যেকোনো কোর্স আলাদাভাবেও শুরু করতে পারবেন।
                          </p>
                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {FOUNDATION_LEARNING_PATHWAY.map((item) => (
                              <Link
                                key={item.courseCode}
                                to={`/programmes/${item.courseCode}`}
                                className="flex items-start justify-between gap-3 rounded-[10px] border border-[var(--color-border)] bg-white p-3.5 transition-colors hover:border-[var(--color-primary)]"
                              >
                                <div className="min-w-0">
                                  <p className="font-en text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]">
                                    {String(item.step).padStart(2, '0')} · {item.verb}
                                  </p>
                                  <p className="mt-0.5 font-en text-xs font-bold text-[var(--color-heading)]">
                                    {item.courseTitle}
                                  </p>
                                  <p className="mt-0.5 font-en text-[11px] text-[var(--color-body)]">
                                    {item.level}
                                  </p>
                                </div>
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 font-en text-[11px] font-bold ${
                                    item.fee === 'FREE'
                                      ? 'bg-[#EAF7EE] text-[#1E8E3E]'
                                      : 'bg-[var(--color-tint)] text-[var(--color-primary)]'
                                  }`}
                                >
                                  {item.fee}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {category.slug === 'applied-ai' && !normalizedQuery && (
                        <div className="mb-8 rounded-[12px] border border-[var(--color-border)] bg-white p-5 sm:p-6">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="font-en text-base font-bold text-[var(--color-heading)]">
                              Recommended Learning Pathway (Applied AI)
                            </h3>
                            <span className="font-en text-xs font-semibold text-[#4B3FD6]">
                              4 Courses · BDT 1,200 Each
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--color-body)] sm:text-sm">
                            এই sequence একটি recommended pathway। শিক্ষার্থীরা নিজেদের আগ্রহ ও প্রয়োজন অনুযায়ী আলাদাভাবেও যেকোনো কোর্স শুরু করতে পারবেন।
                          </p>
                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {APPLIED_AI_LEARNING_PATHWAY.map((item) => (
                              <Link
                                key={item.courseCode}
                                to={`/programmes/${item.courseCode}`}
                                className="flex items-start justify-between gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-3.5 transition-colors hover:border-[#4B3FD6]"
                              >
                                <div className="min-w-0">
                                  <p className="font-en text-[11px] font-bold uppercase tracking-wide text-[#4B3FD6]">
                                    {String(item.step).padStart(2, '0')} · {item.verb}
                                  </p>
                                  <p className="mt-0.5 font-en text-xs font-bold text-[var(--color-heading)]">
                                    {item.courseTitle}
                                  </p>
                                  <p className="mt-0.5 font-en text-[11px] text-[var(--color-body)]">
                                    {item.level}
                                  </p>
                                </div>
                                <span className="shrink-0 rounded-full bg-[#EEEDFC] px-2 py-0.5 font-en text-[11px] font-bold text-[#4B3FD6]">
                                  {item.fee}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {category.slug === 'professional-development' && !normalizedQuery && (
                        <div className="mb-8 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-5 sm:p-6">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="font-en text-base font-bold text-[var(--color-heading)]">
                              Programme-Wide Learning Approach (Professional Development)
                            </h3>
                            <span className="font-en text-xs font-semibold text-[#0B1F4B]">
                              7 Independent Programmes · 4 Weeks · 8 Classes Total Each
                            </span>
                          </div>
                          <p className="mt-1 font-en text-xs leading-relaxed text-[var(--color-body)] sm:text-sm">
                            All seven programmes follow an application-oriented learning model. Each course is independent (BDT 2,500) and requires a computer with internet access for hands-on exercises and Capstone evaluation.
                          </p>
                          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                              '01 · Structured concept-based learning',
                              '02 · Demonstration of relevant AI tools',
                              '03 · Guided practical exercises',
                              '04 · Professional case studies & scenarios',
                              '05 · Individual or group assignments',
                              '06 · Capstone project deliverable',
                              '07 · Final project review & feedback',
                            ].map((component) => (
                              <div
                                key={component}
                                className="rounded-[8px] border border-[var(--color-border)] bg-white px-3 py-2.5 font-en text-xs font-semibold text-[var(--color-heading)]"
                              >
                                {component}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryCourses.map((course) => (
                          <CourseCard key={course.code} course={course} />
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Specialised Programmes: Visually Distinct Section A & Section B */
                    <div className="space-y-12">
                      {/* SECTION A: Specialised Learning Programmes */}
                      {categoryCourses.length > 0 && (
                        <div className="rounded-[16px] border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-2xs">
                          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] pb-5">
                            <div>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF7EE] px-3 py-1 font-en text-xs font-bold text-[#1E8E3E]">
                                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>SECTION A · Specialised Learning Programmes</span>
                              </span>
                              <h3 className="mt-2.5 font-en text-xl font-bold text-[var(--color-heading)] sm:text-2xl">
                                Specialised Learning Programmes
                              </h3>
                              <p className="mt-1.5 max-w-2xl text-sm text-[var(--color-body)]">
                                Open educational safety &amp; social-impact learning programme with full curriculum, 4-week duration, and free direct enrolment.
                              </p>
                            </div>
                            <span className="rounded-full border border-[#1E8E3E]/30 bg-[#EAF7EE] px-3 py-1 font-en text-xs font-bold text-[#1E8E3E]">
                              Educational Programme · FREE
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {categoryCourses.map((course) => (
                              <CourseCard key={course.code} course={course} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SECTION B: Institutional Training & Advisory Services */}
                      {matchingInstitutionalServices.length > 0 && (
                        <div
                          id="institutional-services"
                          className="scroll-mt-24 rounded-[16px] border border-[#0B1F4B]/20 bg-[#F8FAFC] p-6 sm:p-8"
                        >
                          <div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] pb-6">
                            <div>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1F4B] px-3 py-1 font-en text-xs font-bold text-white">
                                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>SECTION B · Institutional Training &amp; Advisory Services</span>
                              </span>
                              <h3 className="mt-2.5 font-en text-xl font-bold text-[var(--color-heading)] sm:text-2xl">
                                Institutional Training &amp; Advisory Services
                              </h3>
                              <p className="mt-1.5 max-w-3xl font-en text-sm leading-relaxed text-[var(--color-body)]">
                                Custom training cohorts, AI readiness diagnostics, implementation roadmaps, and governance advisory for companies, government offices, universities, and NGOs. Scoped per institution through direct consultation — no fixed off-the-shelf pricing packages or course checkout.
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                              <a
                                href="#institutional-consultation"
                                className="inline-flex min-h-[42px] items-center rounded-[8px] bg-[#0B1F4B] px-4 py-2 font-en text-xs font-semibold text-white transition-colors hover:bg-[var(--color-primary)]"
                              >
                                Request Institutional Consultation
                              </a>
                              <Link
                                to="/contact"
                                className="inline-flex min-h-[42px] items-center rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-2 font-en text-xs font-semibold text-[var(--color-heading)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                              >
                                Contact Our Team
                              </Link>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {matchingInstitutionalServices.map((service) => (
                              <InstitutionalServiceCard
                                key={service.slug}
                                service={service}
                                onRequestConsultation={handleConsultClick}
                              />
                            ))}
                          </div>

                          {/* Embedded Institutional Consultation Inquiry Form */}
                          <div
                            id="institutional-consultation"
                            className="mt-10 scroll-mt-24 border-t border-[var(--color-border)] pt-8"
                          >
                            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                              <div>
                                <span className="inline-block rounded-full bg-[#E8EDF7] px-3 py-1 font-en text-xs font-bold text-[#0B1F4B]">
                                  Organisational Inquiry Form
                                </span>
                                <h4 className="mt-2 font-en text-xl font-bold text-[var(--color-heading)] sm:text-2xl">
                                  Request Institutional Consultation
                                </h4>
                                <p className="mt-1 font-en text-sm text-[var(--color-body)]">
                                  Describe your organisation&apos;s goals, team scope, and preferred training or assessment area.
                                </p>
                              </div>
                            </div>

                            <InstitutionalConsultationForm
                              selectedServiceSlug={selectedInstitutionalService}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            );
          })
        )}
      </div>
    </Layout>
  );
}
