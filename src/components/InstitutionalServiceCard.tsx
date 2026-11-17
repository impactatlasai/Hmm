import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  ClipboardCheck,
  GraduationCap,
  Map,
  Presentation,
  ShieldCheck,
  Users,
  Workflow,
} from 'lucide-react';
import {
  InstitutionalIconKey,
  InstitutionalServiceItem,
} from '../data/institutionalServicesData';

interface InstitutionalServiceCardProps {
  service: InstitutionalServiceItem;
  onRequestConsultation?: (serviceSlug: string) => void;
}

const ICONS: Record<InstitutionalIconKey, React.ComponentType<{ className?: string }>> = {
  users: Users,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  'clipboard-check': ClipboardCheck,
  map: Map,
  workflow: Workflow,
  presentation: Presentation,
  'shield-check': ShieldCheck,
};

export function InstitutionalServiceCard({
  service,
  onRequestConsultation,
}: InstitutionalServiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICONS[service.iconKey] || Users;
  const detailPath = `/institutional-services/${service.slug}`;

  return (
    <article className="flex h-full flex-col justify-between rounded-[12px] border border-[var(--color-border)] border-t-[4px] border-t-[#0B1F4B] bg-white p-6 shadow-[0_2px_10px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(11,31,75,0.1)]">
      <div>
        {/* Header Badge & Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#E8EDF7] text-[#0B1F4B]">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="rounded-full bg-[#F1F4F9] px-2.5 py-0.5 font-en text-[11px] font-semibold text-[#0B1F4B]">
              {service.badge}
            </span>
          </div>
          <span className="font-en text-[11px] font-bold tracking-wide text-[var(--color-body)]">
            {service.code}
          </span>
        </div>

        {/* Service Title */}
        <h3 className="mt-4 font-en text-lg font-bold leading-snug text-[var(--color-heading)]">
          <Link
            to={detailPath}
            className="transition-colors hover:text-[var(--color-primary)]"
          >
            {service.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="mt-2 font-en text-sm leading-relaxed text-[var(--color-body)]">
          {service.shortSummary}
        </p>

        {/* Highlighted Pathways (for AI Readiness Assessment) */}
        {service.pathways && service.pathways.length > 0 && (
          <div className="mt-4 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-3.5">
            <p className="font-en text-[11px] font-bold uppercase tracking-wider text-[#0B1F4B]">
              3 Assessment Pathways
            </p>
            <ul className="mt-2 space-y-1.5 font-en text-xs font-medium text-[var(--color-heading)]">
              {service.pathways.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  <span>{p.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Highlighted Multi-Sector Support (for AI Implementation Roadmap) */}
        {service.sectors && service.sectors.length > 0 && (
          <div className="mt-4 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-3.5">
            <p className="font-en text-[11px] font-bold uppercase tracking-wider text-[#0B1F4B]">
              Multi-Sector Roadmaps
            </p>
            <ul className="mt-2 space-y-1.5 font-en text-xs font-medium text-[var(--color-heading)]">
              {service.sectors.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  <span>{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Inline Expandable Quick Scope & Deliverables */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 font-en text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
          >
            <span>{expanded ? 'Hide Scope & Deliverables' : 'Preview Scope & Deliverables'}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-3.5 font-en text-xs">
              <div>
                <p className="font-bold text-[var(--color-heading)]">Who It Is For</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[var(--color-body)]">
                  {service.whoItIsFor.slice(0, 2).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-[var(--color-heading)]">Key Focus Areas</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[var(--color-body)]">
                  {service.keyAreas.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-[var(--color-heading)]">Potential Deliverables</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[var(--color-body)]">
                  {service.potentialDeliverables.slice(0, 2).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions (Strictly NO prices & NO Enroll Now) */}
      <div className="mt-5 border-t border-[var(--color-border)] pt-4">
        <p className="font-en text-xs font-medium text-[var(--color-body)]">
          {service.engagementFormat}
        </p>

        <div className="mt-3.5 grid grid-cols-1 gap-2.5">
          {onRequestConsultation ? (
            <button
              type="button"
              onClick={() => onRequestConsultation(service.slug)}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-[#0B1F4B] bg-white px-3.5 py-2 font-en text-sm font-semibold text-[#0B1F4B] transition-colors hover:bg-[#E8EDF7] cursor-pointer whitespace-nowrap"
            >
              <span>Request Institutional Consultation</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>
          ) : (
            <Link
              to={`${detailPath}#institutional-consultation`}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-[#0B1F4B] bg-white px-3.5 py-2 font-en text-sm font-semibold text-[#0B1F4B] transition-colors hover:bg-[#E8EDF7] whitespace-nowrap"
            >
              <span>Request Institutional Consultation</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          )}

          <Link
            to={detailPath}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#0B1F4B] px-3.5 py-2 font-en text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary)] whitespace-nowrap"
          >
            <span>View Service Details</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
