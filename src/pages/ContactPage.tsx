import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { FrontendForm } from '../components/FrontendForm';

export function ContactPage() {
  return (
    <Layout>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        title="যোগাযোগ (Contact)"
        subtitle="Programme, Free Masterclass বা প্রাতিষ্ঠানিক কোনো জিজ্ঞাসা থাকলে নিচের ফর্মের মাধ্যমে বার্তা পাঠাতে পারেন।"
      />

      <section className="bg-[var(--color-soft-bg)]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-tint)] p-4 text-sm text-[var(--color-heading)]">
            প্রতিষ্ঠান, কোম্পানি, অফিস, বিশ্ববিদ্যালয় বা এনজিও-এর জন্য কাস্টম ট্রেনিং, AI Readiness Assessment বা Implementation Roadmap পরামর্শের জন্য{' '}
            <Link
              to="/programmes#institutional-consultation"
              className="font-en font-semibold text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]"
            >
              Institutional Consultation Form
            </Link>
            {' '}ব্যবহার করতে পারেন, অথবা নিচের সাধারণ যোগাযোগ ফর্ম থেকে বার্তা পাঠান।
          </div>
          <FrontendForm mode="contact" />
        </div>
      </section>
    </Layout>
  );
}
