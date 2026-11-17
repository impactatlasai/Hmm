import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  FileText,
  Layers,
  Users,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { InstitutionalServiceCard } from '../components/InstitutionalServiceCard';
import { InstitutionalConsultationForm } from '../components/InstitutionalConsultationForm';
import {
  INSTITUTIONAL_SERVICES,
  getInstitutionalServiceBySlug,
} from '../data/institutionalServicesData';
import { NotFoundPage } from './NotFoundPage';

export function InstitutionalServiceDetailsPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const service = getInstitutionalServiceBySlug(slug);

  const [selectedPathway, setSelectedPathway] = useState<string>(
    service?.pathways?.[0]?.title || ''
  );
  const [selectedSector, setSelectedSector] = useState<string>(
    service?.sectors?.[0]?.title || ''
  );

  if (!service) {
    return <NotFoundPage />;
  }

  const otherServices = INSTITUTIONAL_SERVICES.filter(
    (s) => s.slug !== service.slug
  ).slice(0, 3);

  const scrollToConsultation = (opt?: { pathwayTitle?: string; sectorTitle?: string }) => {
    if (opt?.pathwayTitle) setSelectedPathway(opt.pathwayTitle);
    if (opt?.sectorTitle) setSelectedSector(opt.sectorTitle);
    const el = document.getElementById('institutional-consultation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Layout
      customTitle={`${service.title} – Institutional Services – Atlas AI Education`}
      customDescription={service.shortSummary}
    >
      {/* Hero Banner */}
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 font-en text-xs text-blue-100"
          >
            <Link to="/" className="hover:text-white hover:underline">
              Home
            </Link>
            <span aria-hidden="true">›</span>
            <Link to="/programmes" className="hover:text-white hover:underline">
              Programmes
            </Link>
            <span aria-hidden="true">›</span>
            <Link
              to="/programmes#specialised-programmes"
              className="hover:text-white hover:underline"
            >
              Specialised Programmes
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-white">{service.title}</span>
          </nav>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-white px-3 py-0.5 font-en text-xs font-bold text-[#0B1F4B]">
                  {service.code}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-0.5 font-en text-xs font-semibold text-white">
                  Institutional Training &amp; Advisory
                </span>
                <span className="rounded-full bg-white/15 px-3 py-0.5 font-en text-xs font-semibold text-white">
                  {service.badge}
                </span>
              </div>

              <h1 className="mt-4 font-en text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {service.title}
              </h1>

              <p className="prose-measure mt-3 font-en text-base leading-relaxed text-blue-100">
                {service.shortSummary}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-white/20 pt-5 font-en text-sm text-blue-50">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
                  <span>{service.engagementFormat}</span>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#institutional-consultation"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-[8px] bg-white px-5 py-2.5 font-en text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-blue-50"
                >
                  <span>Request Institutional Consultation</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex min-h-[44px] items-center rounded-[8px] border border-white/60 px-5 py-2.5 font-en text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-[12px] border border-white/20 bg-slate-900 shadow-lg">
                <img
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Details */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* Left Column */}
          <div className="space-y-10 lg:col-span-8">
            {/* Overview */}
            <div>
              <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                Overview
              </h2>
              <p className="prose-measure mt-3 font-en text-base leading-relaxed text-[var(--color-body)]">
                {service.overview}
              </p>
            </div>

            {/* Who It Is For */}
            <div>
              <h2 className="flex items-center gap-2 font-en text-2xl font-bold text-[var(--color-heading)]">
                <Users className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
                <span>Who It Is For</span>
              </h2>
              <ul className="mt-4 space-y-2.5">
                {service.whoItIsFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4 font-en text-sm text-[var(--color-heading)]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dedicated Pathways Section for AI Readiness Assessment */}
            {service.pathways && service.pathways.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 font-en text-2xl font-bold text-[var(--color-heading)]">
                  <ClipboardCheck
                    className="h-5 w-5 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                  <span>Dedicated AI Readiness Assessment Pathways</span>
                </h2>
                <p className="mt-2 font-en text-sm text-[var(--color-body)]">
                  Select the pathway matching your institution type to view focus areas and request a tailored readiness diagnostic.
                </p>

                <div className="mt-5 grid gap-5">
                  {service.pathways.map((pathway) => (
                    <div
                      key={pathway.id}
                      className="rounded-[12px] border border-[var(--color-border)] border-l-4 border-l-[#0B1F4B] bg-[var(--color-soft-bg)] p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-en text-lg font-bold text-[var(--color-heading)]">
                            {pathway.title}
                          </h3>
                          <p className="mt-0.5 font-en text-xs font-medium text-[var(--color-primary)]">
                            {pathway.targetAudience}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            scrollToConsultation({ pathwayTitle: pathway.title })
                          }
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[8px] border border-[#0B1F4B] bg-white px-3.5 py-1.5 font-en text-xs font-semibold text-[#0B1F4B] transition-colors hover:bg-[#E8EDF7] cursor-pointer"
                        >
                          <span>Consult on This Pathway</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <p className="mt-3 font-en text-sm leading-relaxed text-[var(--color-body)]">
                        {pathway.summary}
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[8px] bg-white p-4 border border-[var(--color-border)]">
                          <p className="font-en text-xs font-bold uppercase tracking-wide text-[var(--color-heading)]">
                            Focus Areas
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-4 font-en text-xs text-[var(--color-body)]">
                            {pathway.focusAreas.map((fa) => (
                              <li key={fa}>{fa}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-[8px] bg-white p-4 border border-[var(--color-border)]">
                          <p className="font-en text-xs font-bold uppercase tracking-wide text-[var(--color-heading)]">
                            Pathway Deliverables
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-4 font-en text-xs text-[var(--color-body)]">
                            {pathway.deliverables.map((del) => (
                              <li key={del}>{del}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dedicated Multi-Sector Section for AI Implementation Roadmap */}
            {service.sectors && service.sectors.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 font-en text-2xl font-bold text-[var(--color-heading)]">
                  <Layers
                    className="h-5 w-5 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                  <span>Supported Sectors for AI Implementation Roadmaps</span>
                </h2>
                <p className="mt-2 font-en text-sm text-[var(--color-body)]">
                  Every roadmap is designed around sector-specific regulations, operational constraints, and human oversight requirements.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {service.sectors.map((sector) => (
                    <div
                      key={sector.id}
                      className="flex flex-col justify-between rounded-[12px] border border-[var(--color-border)] border-t-4 border-t-[#0B1F4B] bg-[var(--color-soft-bg)] p-5"
                    >
                      <div>
                        <h3 className="font-en text-base font-bold text-[var(--color-heading)]">
                          {sector.title}
                        </h3>
                        <p className="mt-2 font-en text-xs leading-relaxed text-[var(--color-body)]">
                          {sector.summary}
                        </p>

                        <p className="mt-3 font-en text-[11px] font-bold uppercase tracking-wide text-[#0B1F4B]">
                          Key Priorities
                        </p>
                        <ul className="mt-1.5 list-disc space-y-1 pl-4 font-en text-xs text-[var(--color-heading)]">
                          {sector.priorities.map((pr) => (
                            <li key={pr}>{pr}</li>
                          ))}
                        </ul>

                        <p className="mt-3 font-en text-[11px] font-bold uppercase tracking-wide text-[#0B1F4B]">
                          Sector Deliverables
                        </p>
                        <ul className="mt-1.5 list-disc space-y-1 pl-4 font-en text-xs text-[var(--color-body)]">
                          {sector.deliverables.map((del) => (
                            <li key={del}>{del}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          scrollToConsultation({ sectorTitle: sector.title })
                        }
                        className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-[#0B1F4B] bg-white px-3 py-1.5 font-en text-xs font-semibold text-[#0B1F4B] transition-colors hover:bg-[#E8EDF7] cursor-pointer"
                      >
                        <span>Request Roadmap Consultation</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scope of Service */}
            <div>
              <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                Scope of Service
              </h2>
              <ul className="mt-4 list-disc space-y-2.5 pl-5 font-en text-base text-[var(--color-body)]">
                {service.scopeOfService.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Key Training or Assessment Areas */}
            <div>
              <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                Key Training or Assessment Areas
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.keyAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-start gap-2.5 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                    <span className="font-en text-sm font-semibold text-[var(--color-heading)]">
                      {area}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Approach & Potential Deliverables */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-6">
                <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                  Delivery Approach
                </h2>
                <ul className="mt-3 space-y-2 font-en text-sm leading-relaxed text-[var(--color-body)]">
                  {service.deliveryApproach.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B1F4B]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-6">
                <h2 className="flex items-center gap-2 font-en text-lg font-bold text-[var(--color-heading)]">
                  <FileText className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>Potential Deliverables</span>
                </h2>
                <ul className="mt-3 space-y-2 font-en text-sm leading-relaxed text-[var(--color-body)]">
                  {service.potentialDeliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#1E8E3E]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-5 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-6">
              <span className="inline-flex items-center rounded-full bg-[#0B1F4B] px-3 py-1 font-en text-xs font-bold text-white">
                Institutional Advisory &amp; Training
              </span>
              <h2 className="font-en text-lg font-bold text-[var(--color-heading)]">
                Engagement Summary
              </h2>

              <dl className="divide-y divide-[var(--color-border)] font-en text-sm">
                <div className="py-3">
                  <dt className="text-xs font-semibold text-[var(--color-body)]">Category</dt>
                  <dd className="mt-1 font-semibold text-[var(--color-heading)]">
                    Specialised Programmes — Section B
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold text-[var(--color-body)]">Service Code</dt>
                  <dd className="mt-1 font-bold text-[var(--color-heading)]">{service.code}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold text-[var(--color-body)]">Delivery Mode</dt>
                  <dd className="mt-1 font-medium text-[var(--color-heading)]">
                    {service.engagementFormat}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold text-[var(--color-body)]">Scoping Model</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-[var(--color-body)]">
                    Tailored institutional scoping following a consultation with your team.
                  </dd>
                </div>
              </dl>

              <a
                href="#institutional-consultation"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#0B1F4B] px-4 py-2.5 font-en text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary)]"
              >
                <span>Request Institutional Consultation</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <Link
                to="/contact"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-2.5 font-en text-sm font-semibold text-[var(--color-heading)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                Contact Our Team
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Dedicated Institutional Consultation Form */}
      <section
        id="institutional-consultation"
        className="border-b border-[var(--color-border)] bg-[var(--color-soft-bg)] scroll-mt-20"
      >
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-[#E8EDF7] px-3 py-1 font-en text-xs font-bold text-[#0B1F4B]">
            Consultation Inquiry
          </span>
          <h2 className="mt-3 font-en text-2xl font-bold text-[var(--color-heading)]">
            Request Institutional Consultation
          </h2>
          <p className="mt-2 font-en text-sm text-[var(--color-body)]">
            Share your organisation’s goals, team size, and context for <strong>{service.title}</strong>. Our team will follow up to schedule a scoping conversation.
          </p>

          <div className="mt-6">
            <InstitutionalConsultationForm
              selectedServiceSlug={service.slug}
              initialPathway={selectedPathway}
              initialSector={selectedSector}
            />
          </div>
        </div>
      </section>

      {/* Other Institutional Services */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-en text-2xl font-bold text-[var(--color-heading)]">
                Other Institutional Services
              </h2>
              <p className="mt-1 font-en text-sm text-[var(--color-body)]">
                Explore additional training, assessment, and advisory offerings under Specialised Programmes.
              </p>
            </div>
            <Link
              to="/programmes#specialised-programmes"
              className="font-en text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              View All Specialised Programmes →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {otherServices.map((srv) => (
              <InstitutionalServiceCard key={srv.slug} service={srv} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
