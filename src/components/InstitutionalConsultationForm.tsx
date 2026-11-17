import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Building2, CheckCircle2 } from 'lucide-react';
import {
  INSTITUTIONAL_SERVICES,
  getInstitutionalServiceBySlug,
} from '../data/institutionalServicesData';

interface InstitutionalConsultationFormProps {
  selectedServiceSlug?: string;
  initialPathway?: string;
  initialSector?: string;
  compactHeader?: boolean;
}

const ORGANISATION_TYPES = [
  { value: 'company', label: 'Company / Commercial Business' },
  { value: 'government-office', label: 'Government / Public Sector Office' },
  { value: 'university', label: 'University / Academic Institution' },
  { value: 'ngo', label: 'NGO / Development Organisation' },
  { value: 'other', label: 'Other Institutional Body' },
];

const COHORT_SIZES = [
  '1–15 participants',
  '16–50 participants',
  '51–150 participants',
  '150+ participants / Institution-wide',
  'Assessment / Advisory Only',
];

const DELIVERY_MODES = [
  'Live Online',
  'On-site (In-person)',
  'Hybrid',
  'To be discussed during consultation',
];

export function InstitutionalConsultationForm({
  selectedServiceSlug,
  initialPathway,
  initialSector,
  compactHeader = false,
}: InstitutionalConsultationFormProps) {
  const defaultSlug = selectedServiceSlug || INSTITUTIONAL_SERVICES[0].slug;
  const [serviceSlug, setServiceSlug] = useState(defaultSlug);
  const [pathway, setPathway] = useState(initialPathway || '');
  const [sector, setSector] = useState(initialSector || '');
  const [organisationName, setOrganisationName] = useState('');
  const [organisationType, setOrganisationType] = useState('company');
  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cohortSize, setCohortSize] = useState(COHORT_SIZES[1]);
  const [deliveryMode, setDeliveryMode] = useState(DELIVERY_MODES[3]);
  const [requirements, setRequirements] = useState('');
  const [accepted, setAccepted] = useState(false);

  const [honeypot, setHoneypot] = useState('');
  const formLoadedAt = useRef(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedServiceSlug) {
      setServiceSlug(selectedServiceSlug);
    }
  }, [selectedServiceSlug]);

  useEffect(() => {
    if (initialPathway) {
      setPathway(initialPathway);
    }
  }, [initialPathway]);

  useEffect(() => {
    if (initialSector) {
      setSector(initialSector);
    }
  }, [initialSector]);

  const activeService =
    getInstitutionalServiceBySlug(serviceSlug) || INSTITUTIONAL_SERVICES[0];

  const isReadinessService = activeService.slug === 'ai-readiness-assessment';
  const isRoadmapService = activeService.slug === 'ai-implementation-roadmap';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (organisationName.trim().length < 2) {
      setError('Please enter your organisation or institution name.');
      return;
    }
    if (contactName.trim().length < 2) {
      setError('Please enter the contact person’s full name.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid official or work email address.');
      return;
    }
    if (phone.trim().length < 6) {
      setError('Please provide an active phone or WhatsApp number.');
      return;
    }
    if (isReadinessService && !pathway) {
      setError('Please select an AI Readiness Assessment pathway (Companies, Offices, or Universities).');
      return;
    }
    if (isRoadmapService && !sector) {
      setError('Please select a target sector for the AI Implementation Roadmap.');
      return;
    }
    if (requirements.trim().length < 15) {
      setError('Please briefly describe your institutional requirements or objectives (minimum 15 characters).');
      return;
    }
    if (!accepted) {
      setError('Please confirm the consultation disclosure checkbox before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/institutional-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: activeService.slug,
          pathway: isReadinessService ? pathway : undefined,
          sector: isRoadmapService ? sector : undefined,
          organisationName: organisationName.trim(),
          organisationType,
          contactName: contactName.trim(),
          designation: designation.trim(),
          email: email.trim(),
          phone: phone.trim(),
          cohortSize,
          deliveryMode,
          requirements: requirements.trim(),
          privacyConsent: accepted,
          website_url: honeypot,
          submittedAfterMs: Math.max(850, Date.now() - formLoadedAt.current),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        referenceId?: string;
        message?: string;
      };

      if (!res.ok) {
        setError(data.error || 'Could not submit consultation request. Please try again.');
        return;
      }

      setReferenceId(data.referenceId || null);
      setServerMessage(data.message || null);
      setSubmitted(true);
    } catch {
      setError('Unable to reach the server right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setOrganisationName('');
    setContactName('');
    setDesignation('');
    setEmail('');
    setPhone('');
    setRequirements('');
    setAccepted(false);
    setHoneypot('');
    setReferenceId(null);
    setServerMessage(null);
    setError(null);
    formLoadedAt.current = Date.now();
  };

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-xs"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 shrink-0 text-[var(--color-free)]"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center rounded-full bg-[#EAF7EE] px-3 py-0.5 font-en text-xs font-bold text-[#1E8E3E]">
              Consultation Request Received
            </span>
            <h3 className="mt-2 font-en text-xl font-bold text-[var(--color-heading)]">
              Thank you — your institutional inquiry has been logged
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
              {serverMessage ||
                'Our institutional advisory team will review your organisation’s requirements and reach out to schedule a scoping consultation.'}
            </p>

            {referenceId && (
              <div className="mt-4 inline-block rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-4 py-2.5">
                <span className="font-en text-xs font-semibold text-[var(--color-body)]">
                  Consultation Reference ID:{' '}
                </span>
                <span className="font-en text-sm font-bold text-[var(--color-primary)]">
                  {referenceId}
                </span>
              </div>
            )}

            <div className="mt-4 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4 text-xs text-[var(--color-heading)]">
              <p className="font-en font-bold">Inquiry Summary</p>
              <dl className="mt-2 grid gap-1.5 sm:grid-cols-2">
                <div>
                  <dt className="inline text-[var(--color-body)]">Service: </dt>
                  <dd className="inline font-en font-semibold">{activeService.title}</dd>
                </div>
                <div>
                  <dt className="inline text-[var(--color-body)]">Organisation: </dt>
                  <dd className="inline font-en font-semibold">{organisationName}</dd>
                </div>
                {isReadinessService && pathway && (
                  <div className="sm:col-span-2">
                    <dt className="inline text-[var(--color-body)]">Pathway: </dt>
                    <dd className="inline font-en font-semibold">{pathway}</dd>
                  </div>
                )}
                {isRoadmapService && sector && (
                  <div className="sm:col-span-2">
                    <dt className="inline text-[var(--color-body)]">Target Sector: </dt>
                    <dd className="inline font-en font-semibold">{sector}</dd>
                  </div>
                )}
              </dl>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-5 inline-flex min-h-[44px] items-center rounded-[8px] border border-[var(--color-primary)] px-4 py-2 font-en text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-tint)] cursor-pointer"
            >
              Submit Another Institutional Inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-xs"
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor="inst-website-url">Website URL</label>
        <input
          id="inst-website-url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {!compactHeader && (
        <div className="mb-6 flex items-start gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#0B1F4B] text-white">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-en text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Institutional Consultation &amp; Scoping Request
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-body)]">
              Institutional programmes are designed around organisational needs rather than fixed off-the-shelf pricing. Share your context below to request a tailored scoping discussion.
            </p>
          </div>
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
        <div className="sm:col-span-2">
          <label
            htmlFor="inst-service"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Institutional Service of Interest *
          </label>
          <select
            id="inst-service"
            value={serviceSlug}
            onChange={(e) => {
              setServiceSlug(e.target.value);
              setPathway('');
              setSector('');
            }}
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm font-medium text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          >
            {INSTITUTIONAL_SERVICES.map((srv) => (
              <option key={srv.slug} value={srv.slug}>
                {srv.title} ({srv.badge})
              </option>
            ))}
          </select>
        </div>

        {isReadinessService && activeService.pathways && (
          <div className="sm:col-span-2">
            <label
              htmlFor="inst-pathway"
              className="block font-en text-sm font-semibold text-[var(--color-heading)]"
            >
              AI Readiness Assessment Pathway *
            </label>
            <select
              id="inst-pathway"
              value={pathway}
              onChange={(e) => setPathway(e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-primary)]/40 bg-[var(--color-tint)]/50 px-3.5 py-2 font-en text-sm font-semibold text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            >
              <option value="">Select a readiness pathway...</option>
              {activeService.pathways.map((p) => (
                <option key={p.id} value={p.title}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {isRoadmapService && activeService.sectors && (
          <div className="sm:col-span-2">
            <label
              htmlFor="inst-sector"
              className="block font-en text-sm font-semibold text-[var(--color-heading)]"
            >
              Target Sector for AI Implementation Roadmap *
            </label>
            <select
              id="inst-sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-primary)]/40 bg-[var(--color-tint)]/50 px-3.5 py-2 font-en text-sm font-semibold text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            >
              <option value="">Select your institutional sector...</option>
              {activeService.sectors.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label
            htmlFor="inst-org-name"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Organisation / Institution Name *
          </label>
          <input
            id="inst-org-name"
            type="text"
            required
            value={organisationName}
            onChange={(e) => setOrganisationName(e.target.value)}
            placeholder="e.g., Horizon Group / Dhaka University Dept."
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="inst-org-type"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Organisation Type *
          </label>
          <select
            id="inst-org-type"
            value={organisationType}
            onChange={(e) => setOrganisationType(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          >
            {ORGANISATION_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="inst-contact-name"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Contact Person Name *
          </label>
          <input
            id="inst-contact-name"
            type="text"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Full name"
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="inst-designation"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Role / Designation (Optional)
          </label>
          <input
            id="inst-designation"
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="e.g., Head of HR / Dean / Director"
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="inst-email"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Official / Work Email *
          </label>
          <input
            id="inst-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organisation.org"
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="inst-phone"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Phone / WhatsApp *
          </label>
          <input
            id="inst-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880 1XXX-XXXXXX"
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="inst-cohort"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Estimated Team / Cohort Scope
          </label>
          <select
            id="inst-cohort"
            value={cohortSize}
            onChange={(e) => setCohortSize(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          >
            {COHORT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="inst-delivery"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Preferred Delivery Approach
          </label>
          <select
            id="inst-delivery"
            value={deliveryMode}
            onChange={(e) => setDeliveryMode(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          >
            {DELIVERY_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="inst-requirements"
            className="block font-en text-sm font-semibold text-[var(--color-heading)]"
          >
            Organisational Requirements &amp; Objectives *
          </label>
          <textarea
            id="inst-requirements"
            rows={4}
            required
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe your teams or departments, key goals, current AI usage or policy challenges, and preferred timeline..."
            className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2.5 font-en text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5">
        <input
          id="inst-consent"
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />
        <label
          htmlFor="inst-consent"
          className="font-en text-xs leading-relaxed text-[var(--color-body)]"
        >
          I understand this form submits an institutional consultation request to Atlas AI Education. No automated payment or fixed course checkout applies; our team will follow up for scoping.
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#0B1F4B] px-6 py-2.5 font-en text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary)] disabled:opacity-60 cursor-pointer"
        >
          {submitting ? 'Submitting Request...' : 'Request Institutional Consultation'}
        </button>
        <span className="font-en text-xs text-[var(--color-body)]">
          Tailored scoping · No public disclosure of institutional inquiries
        </span>
      </div>
    </form>
  );
}
