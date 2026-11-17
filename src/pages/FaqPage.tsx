import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';

const FAQ_ITEMS = [
  {
    q: 'Free Masterclass কীভাবে কাজ করে?',
    a: 'AI Fundamentals & Digital Literacy হলো প্রতি মাসে আয়োজিত একটি উন্মুক্ত session (প্রায় ২–২.৫ ঘণ্টা)। এতে অংশগ্রহণ ফি BDT 0, তবে আসন অনুযায়ী আগে থেকে Registration লাগতে পারে। এটি কোনো পূর্ণাঙ্গ course নয় এবং এখানে automatic certificate দেওয়া হয় না।',
  },
  {
    q: 'কোর্স ফি কত এবং পেমেন্ট কীভাবে করতে হয়?',
    a: 'AI Fundamentals & Digital Literacy, AI Governance Fundamentals এবং Women’s Safety in the AI Era সম্পূর্ণ বিনামূল্যে (FREE)। AI Literacy & Foundation-এর অন্যান্য প্রোগ্রাম ৳999 (এবং AI Tools Literacy & Prompt Engineering ৳1,499), Applied AI-এর প্রোগ্রামগুলো ৳1,200 এবং Professional Development বিভাগের ৭টি প্রোগ্রামের প্রতিটির ফি ৳2,500। Paid programme-এ আবেদন ফর্ম পূরণের সময় +8801601289683 নম্বরে bKash অথবা Nagad Send Money করে Transaction ID (TrxID) জমা দিতে হয়; যাচাইয়ের সময় স্ট্যাটাস Pending Verification হিসেবে থাকে।',
  },
  {
    q: 'Certificate কি accredited?',
    a: 'না। Atlas AI Education থেকে প্রদত্ত Certificate-গুলো non-accredited। Paid programme-এ বাস্তব অংশগ্রহণ, নির্ধারিত assignment এবং project বা capstone মূল্যায়নের ভিত্তিতেই এই Certificate দেওয়া হয়। Free Masterclass-এ automatic certificate থাকে না।',
  },
  {
    q: 'চাকরি বা আয়ের কোনো নিশ্চয়তা আছে কি?',
    a: 'না। Atlas AI Education চাকরি, ইন্টার্নশিপ, ফ্রিল্যান্সিং আয় বা কোনো কর্মসংস্থানের guarantee দেয় না। আমরা বাস্তব দক্ষতা ও দায়িত্বশীল ব্যবহার শেখানোর ওপর জোর দিই।',
  },
  {
    q: 'কোন category দিয়ে শুরু করা উচিত?',
    a: 'আপনি যদি AI-তে একদম নতুন হন, তাহলে Free Masterclass বা AI Literacy & Foundation দিয়ে শুরু করতে পারেন। মৌলিক ধারণা থাকলে এবং project-ভিত্তিক দক্ষতা চাইলে Applied AI বেছে নিন। আর যদি দল পরিচালনা, ব্যবস্থাপনা বা প্রাতিষ্ঠানিক সিদ্ধান্তে AI ব্যবহার করতে চান, তাহলে Professional Development উপযোগী হবে।',
  },
  {
    q: 'Specialised Programmes বিভাগে কী কী রয়েছে?',
    a: 'Specialised Programmes বিভাগে দুইটি অংশ রয়েছে: (১) Specialised Learning Programmes-এ ৪ সপ্তাহের সম্পূর্ণ বিনামূল্যের (FREE) শিক্ষামূলক কর্মসূচি Women’s Safety in the AI Era (SP-WSAI), এবং (২) Institutional Training & Advisory Services-এ কোম্পানি, সরকারি/প্রাতিষ্ঠানিক অফিস, বিশ্ববিদ্যালয় ও এনজিও-গুলোর জন্য ৮টি কাস্টম প্রশিক্ষণ, AI Readiness Assessment (৩টি pathway) ও AI Implementation Roadmap সেবা, যার জন্য Consultation ফর্মের মাধ্যমে যোগাযোগ করতে হয়।',
  },
  {
    q: 'Scholarship বা আর্থিক সহায়তা আছে কি?',
    a: 'হ্যাঁ। Atlas AI Education-এর নির্বাচিত Learning Programmes-এর জন্য Course-Based Scholarship Programme চালু রয়েছে। প্রতি কোর্সে সর্বোচ্চ ৫ জন শিক্ষার্থী Merit-based এবং Need-based মূল্যায়নের মাধ্যমে সর্বোচ্চ ৫০% পর্যন্ত Course Fee Waiver পেতে পারেন। Free Programmes ছাড়া অন্য সব কোর্সে /scholarships পেজে গিয়ে অনলাইনে আবেদন করা যায়।',
  },
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Layout>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]}
        title="সাধারণ প্রশ্ন ও উত্তর (FAQ)"
        subtitle="Free Masterclass, কোর্স ফি ও পেমেন্ট, non-accredited certificate, category নির্বাচন ও Scholarship সংক্রান্ত স্পষ্ট উত্তর।"
      />

      <section className="bg-[var(--color-soft-bg)]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.q} className="px-6 py-2">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex min-h-[52px] w-full items-center justify-between gap-4 py-3 text-left text-base font-bold text-[var(--color-heading)] cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[var(--color-primary)] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 pr-6 text-sm leading-relaxed text-[var(--color-body)] sm:text-base">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
