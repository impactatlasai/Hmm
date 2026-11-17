import {
  COURSES,
  COURSE_CATEGORIES,
  CourseItem,
  WOMENS_SAFETY_PROGRAMME,
} from '../data/coursesData';
import {
  INSTITUTIONAL_SERVICES,
  InstitutionalServiceItem,
} from '../data/institutionalServicesData';
import { RESOURCES } from '../data/resourcesData';
import {
  CourseSeoRecord,
  buildOrganizationEntity,
  buildWebsiteEntity,
} from './foundationSeo';

export const SPECIALISED_CATEGORY_SLUG = 'specialised-programmes';

export interface PageSeoRecord {
  routePath: string;
  canonicalPath: string;
  pageType: 'main' | 'category' | 'institutional-service' | 'utility' | 'legal' | 'programme';
  pageTitle: string;
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  semanticTopics: string[];
  searchIntent: string;
  schemaType: string;
  schemaJson: Record<string, unknown>;
  indexStatus: 'indexed' | 'noindex';
  isPublished: boolean;
  lastOptimizedAt: string;
}

interface InstitutionalSeoProfile {
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  semanticTopics: string[];
  searchIntent: string;
  serviceType: string;
}

const FAQ_VERIFIED_ITEMS = [
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

const INSTITUTIONAL_SEO_PROFILES: Record<string, InstitutionalSeoProfile> = {
  'employees-ai-training': {
    seoTitle: 'Employees AI Training (INST-01) – Institutional Services – Atlas AI Education',
    metaDescription:
      'Role-specific workplace AI training workshops (INST-01) by Atlas AI Education for companies, SMEs, and NGOs covering prompting, verification standards, and data confidentiality.',
    ogTitle: 'Employees AI Training (INST-01) – Atlas AI Education',
    ogDescription:
      'On-site, live virtual, or hybrid workplace AI training helping corporate, NGO, and administrative teams use AI responsibly and productively.',
    primaryKeyword: 'Employees AI Training workshops Bangladesh',
    secondaryKeywords: [
      'Corporate workplace AI training Atlas AI Education',
      'SME and NGO staff AI literacy workshop',
      'Responsible workplace prompting and fact checking',
      'Atlas AI Education INST-01',
    ],
    semanticTopics: [
      'Workplace AI Fluency',
      'Departmental Prompt Workflows',
      'Data Confidentiality in AI Usage',
      'Hallucination Verification Protocols',
      'Employee AI Training Bangladesh',
    ],
    searchIntent: 'institutional-b2b-training-consultation',
    serviceType: 'Workplace AI Training Workshops',
  },
  'ai-leadership-executive-training': {
    seoTitle: 'AI Leadership & Executive Training (INST-02) – Institutional Services – Atlas AI Education',
    metaDescription:
      'Executive AI briefings and strategic workshops (INST-02) by Atlas AI Education covering AI adoption trade-offs, governance oversight, ROI evaluation, and workforce reskilling.',
    ogTitle: 'AI Leadership & Executive Training (INST-02) – Atlas AI Education',
    ogDescription:
      'Executive roundtables and strategy briefings guiding directors, founders, and senior public-sector leaders on responsible AI transformation and risk oversight.',
    primaryKeyword: 'AI Leadership and Executive Training Bangladesh',
    secondaryKeywords: [
      'Executive AI strategy briefing corporate directors',
      'Organisational AI governance and oversight training',
      'Workforce AI change management advisory',
      'Atlas AI Education INST-02',
    ],
    semanticTopics: [
      'Executive AI Strategy',
      'Organisational AI Governance',
      'Build-Buy-Partner Evaluation',
      'Workforce Change Management',
      'AI Risk Oversight',
    ],
    searchIntent: 'institutional-executive-advisory-consultation',
    serviceType: 'Executive AI Briefings & Leadership Training',
  },
  'university-academic-ai-training': {
    seoTitle: 'University & Academic AI Training (INST-03) – Institutional Services – Atlas AI Education',
    metaDescription:
      'Higher education AI workshops (INST-03) by Atlas AI Education for universities, faculty, IQAC units, and students on AI-resilient assessment, research ethics, and academic integrity.',
    ogTitle: 'University & Academic AI Training (INST-03) – Atlas AI Education',
    ogDescription:
      'Faculty development workshops, departmental seminars, and student bootcamps on ethical research workflows, disclosure standards, and AI-aware coursework.',
    primaryKeyword: 'University and Academic AI Training Bangladesh',
    secondaryKeywords: [
      'Higher education AI academic integrity training',
      'Faculty AI-resilient assessment redesign workshop',
      'Ethical AI research and citation guidelines',
      'Atlas AI Education INST-03',
    ],
    semanticTopics: [
      'Academic Integrity and AI Disclosure',
      'AI-Resilient Coursework Design',
      'Ethical Literature Synthesis',
      'Faculty Development Workshops',
      'Student AI Literacy Orientation',
    ],
    searchIntent: 'institutional-academic-training-consultation',
    serviceType: 'University & Academic AI Workshops',
  },
  'ai-readiness-assessment': {
    seoTitle: 'AI Readiness Assessment (INST-04) – Institutional Services – Atlas AI Education',
    metaDescription:
      'Structured AI Readiness Assessment (INST-04) with 3 dedicated diagnostic pathways for Companies, Offices, and Universities—evaluating workflow, skills, data hygiene, and governance.',
    ogTitle: 'AI Readiness Assessment (INST-04 · 3 Pathways) – Atlas AI Education',
    ogDescription:
      'Multi-pathway AI readiness diagnostics by Atlas AI Education tailored for Companies & Businesses, Institutional Offices, and Universities & Colleges.',
    primaryKeyword: 'AI Readiness Assessment institutional diagnostic',
    secondaryKeywords: [
      'Company AI readiness assessment Bangladesh',
      'Government and institutional office AI diagnostic',
      'University academic AI readiness assessment',
      'Atlas AI Education INST-04',
    ],
    semanticTopics: [
      'AI Readiness Diagnostic',
      'Workflow Bottleneck Audit',
      'Organisational Data Hygiene',
      'University AI Readiness Pathway',
      'Governance Maturity Assessment',
    ],
    searchIntent: 'institutional-assessment-advisory-consultation',
    serviceType: 'Organisational AI Readiness Assessment',
  },
  'ai-implementation-roadmap': {
    seoTitle: 'AI Implementation Roadmap (INST-05) – Institutional Services – Atlas AI Education',
    metaDescription:
      'Phased AI Implementation Roadmap advisory (INST-05) tailored across 4 sectors—Companies & Businesses, Government Offices, Universities, and NGOs—with 90-day pilot scoping and governance.',
    ogTitle: 'AI Implementation Roadmap (INST-05 · Multi-Sector) – Atlas AI Education',
    ogDescription:
      'Structured AI adoption roadmaps covering pilot selection, human-in-the-loop governance, capability sequencing, and operational guardrails for organisations.',
    primaryKeyword: 'AI Implementation Roadmap advisory Bangladesh',
    secondaryKeywords: [
      'Enterprise SME AI implementation roadmap',
      'NGO and public office AI adoption planning',
      'Phased AI pilot and governance roadmap',
      'Atlas AI Education INST-05',
    ],
    semanticTopics: [
      'Phased AI Implementation Strategy',
      '90-Day Pilot Scoping',
      'Human-in-the-Loop Controls',
      'Public Sector and NGO AI Adoption',
      'Capability Rollout Planning',
    ],
    searchIntent: 'institutional-roadmap-advisory-consultation',
    serviceType: 'Institutional AI Implementation Roadmap Advisory',
  },
  'ai-workflow-automation-training': {
    seoTitle: 'AI Workflow & Automation Training (INST-06) – Institutional Services – Atlas AI Education',
    metaDescription:
      'Practical workflow mapping and human-reviewed no-code AI automation training (INST-06) by Atlas AI Education for operations, support, and coordination teams.',
    ogTitle: 'AI Workflow & Automation Training (INST-06) – Atlas AI Education',
    ogDescription:
      'Hands-on team labs on process auditing, intake routing, AI summarisation pipelines, exception handling, and operational safety boundaries.',
    primaryKeyword: 'AI Workflow and Automation Training for teams',
    secondaryKeywords: [
      'No-code institutional AI automation training',
      'Human-in-the-loop workflow auditing workshop',
      'Operations team AI intake routing training',
      'Atlas AI Education INST-06',
    ],
    semanticTopics: [
      'Operational Workflow Auditing',
      'No-Code AI Automation Patterns',
      'Human Review Checkpoints',
      'Intake Classification and Drafting',
      'Automation Risk Controls',
    ],
    searchIntent: 'institutional-operations-training-consultation',
    serviceType: 'Team AI Workflow & Automation Training',
  },
  'train-the-trainer-programme': {
    seoTitle: 'Train-the-Trainer Programme (INST-07) – Institutional Services – Atlas AI Education',
    metaDescription:
      'Capacity-building AI Train-the-Trainer programme (INST-07) preparing internal L&D facilitators, corporate champions, NGO mentors, and university faculty to teach AI internally.',
    ogTitle: 'AI Train-the-Trainer Programme (INST-07) – Atlas AI Education',
    ogDescription:
      'Master facilitator labs and co-teaching mentorship building self-sustaining internal AI training capability inside companies, universities, and NGOs.',
    primaryKeyword: 'AI Train the Trainer programme Bangladesh',
    secondaryKeywords: [
      'Internal L&D AI facilitator certification training',
      'Corporate AI champions enablement programme',
      'NGO and faculty AI facilitation workshops',
      'Atlas AI Education INST-07',
    ],
    semanticTopics: [
      'AI Facilitator Enablement',
      'Instructional Design for AI',
      'Internal Training Toolkit Adaptation',
      'Classroom Safeguarding Standards',
      'Self-Sustaining Organisational AI Capacity',
    ],
    searchIntent: 'institutional-capacity-building-consultation',
    serviceType: 'Internal AI Train-the-Trainer Capacity Building',
  },
  'ai-governance-policy-training': {
    seoTitle: 'AI Governance & Policy Training (INST-08) – Institutional Services – Atlas AI Education',
    metaDescription:
      'Institutional AI Governance & Policy workshops (INST-08) by Atlas AI Education covering Acceptable Use Policies, data classification, procurement due diligence, and incident protocols.',
    ogTitle: 'AI Governance & Policy Training (INST-08) – Atlas AI Education',
    ogDescription:
      'Practical governance sprints helping legal, compliance, IT, HR, and leadership teams draft workable institutional AI Acceptable Use Policies and review frameworks.',
    primaryKeyword: 'AI Governance and Policy Training Bangladesh',
    secondaryKeywords: [
      'Organisational AI Acceptable Use Policy workshop',
      'Institutional data privacy and algorithmic risk training',
      'Vendor AI evaluation and disclosure guidelines',
      'Atlas AI Education INST-08',
    ],
    semanticTopics: [
      'AI Acceptable Use Policy',
      'Data Classification and Confidentiality',
      'Vendor AI Due Diligence',
      'Transparency and Incident Response',
      'Organisational AI Governance',
    ],
    searchIntent: 'institutional-governance-compliance-consultation',
    serviceType: 'AI Governance & Acceptable Use Policy Training',
  },
};

export function discoverSpecialisedCourse(): CourseItem {
  return WOMENS_SAFETY_PROGRAMME;
}

export function discoverInstitutionalServices(): InstitutionalServiceItem[] {
  return INSTITUTIONAL_SERVICES;
}

export function buildWomensSafetyCourseSeoRecord(
  course: CourseItem = WOMENS_SAFETY_PROGRAMME,
  baseUrl = '',
  options?: {
    isPublished?: boolean;
    indexStatus?: 'indexed' | 'noindex';
    isFull?: boolean;
    lastOptimizedAt?: string;
  }
): CourseSeoRecord {
  const canonicalPath = '/programmes/womens-safety-in-the-ai-era';
  const seoTitle = "Women's Safety in the AI Era (SP-WSAI) – Atlas AI Education";
  const metaDescription =
    'Free 4-week (8 classes, BDT 0) Women’s Safety in the AI Era programme by Atlas AI Education covering deepfakes, synthetic media, digital privacy, and evidence preservation.';
  const ogTitle = "Women's Safety in the AI Era (FREE Programme) – Atlas AI Education";
  const ogDescription =
    'AI যুগে নারী ও মেয়েদের ডিজিটাল নিরাপত্তা: ডিপফেক শনাক্তকরণ, প্রাইভেসি সুরক্ষা, সাইবার হয়রানি প্রতিরোধ ও প্রমাণ সংরক্ষণে ৪ সপ্তাহের সম্পূর্ণ বিনামূল্যের কর্মসূচি (BDT 0)।';
  const primaryKeyword = "Women's Safety in the AI Era Bangladesh";
  const secondaryKeywords = [
    'AI digital safety training for women and girls',
    'Deepfake and synthetic media awareness course FREE',
    'Online privacy protection cyber harassment defence Bangladesh',
    'Digital evidence preservation and helpline guide',
    'Atlas AI Education SP-WSAI',
  ];
  const semanticTopics = [
    'Digital Footprints and Privacy Hygiene',
    'Deepfake and Image Manipulation Recognition',
    'Voice Cloning and Impersonation Prevention',
    'Account Hardening and Two-Factor Authentication',
    'Online Harassment and Blackmail Defence',
    'Digital Evidence Preservation and Support Channels',
  ];
  const isPublished = options?.isPublished ?? true;
  const indexStatus = options?.indexStatus ?? (isPublished ? 'indexed' : 'noindex');
  const lastOptimizedAt = options?.lastOptimizedAt || new Date().toISOString();

  return {
    courseCode: course.code,
    slug: course.slug,
    canonicalPath,
    seoTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage: course.imageUrl,
    ogImageAlt: course.imageAlt,
    primaryKeyword,
    secondaryKeywords,
    semanticTopics,
    searchIntent: 'informational-educational-free-registration',
    intendedAudience: course.whoThisCourseIsFor || [],
    learningLevel: course.level || 'Beginner / Awareness',
    indexStatus,
    isPublished,
    lastOptimizedAt,
    courseSchema: buildWomensSafetyJsonLd(course, baseUrl, {
      isFull: options?.isFull,
      lastOptimizedAt,
      seoTitle,
      metaDescription,
    }),
  };
}

export function buildWomensSafetyJsonLd(
  course: CourseItem = WOMENS_SAFETY_PROGRAMME,
  baseUrl: string,
  options?: {
    isFull?: boolean;
    lastOptimizedAt?: string;
    seoTitle?: string;
    metaDescription?: string;
  }
): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const canonicalUrl = cleanBase
    ? `${cleanBase}/programmes/womens-safety-in-the-ai-era`
    : '/programmes/womens-safety-in-the-ai-era';
  const orgId = cleanBase ? `${cleanBase}/#organization` : '#organization';
  const websiteId = cleanBase ? `${cleanBase}/#website` : '#website';
  const imageUrl = cleanBase ? `${cleanBase}${course.imageUrl}` : course.imageUrl;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: cleanBase ? `${cleanBase}/` : '/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Programmes',
            item: cleanBase ? `${cleanBase}/programmes` : '/programmes',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Specialised Programmes',
            item: cleanBase
              ? `${cleanBase}/programmes#specialised-programmes`
              : '/programmes#specialised-programmes',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: course.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: options?.seoTitle || `${course.title} (${course.code}) – Atlas AI Education`,
        description: options?.metaDescription || course.hook,
        isPartOf: { '@id': websiteId },
        about: { '@id': `${canonicalUrl}#course` },
        primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl },
        inLanguage: ['bn', 'en'],
        ...(options?.lastOptimizedAt ? { dateModified: options.lastOptimizedAt } : {}),
      },
      {
        '@type': 'Course',
        '@id': `${canonicalUrl}#course`,
        url: canonicalUrl,
        name: course.title,
        alternateName: [
          'AI যুগে নারী ও মেয়েদের ডিজিটাল নিরাপত্তা',
          `${course.code}: ${course.title}`,
        ],
        courseCode: course.code,
        description: `${course.hook} ${course.overview}`,
        provider: { '@id': orgId },
        publisher: { '@id': orgId },
        image: imageUrl,
        inLanguage: ['bn', 'en'],
        educationalLevel: course.level,
        isAccessibleForFree: true,
        timeRequired: 'P4W',
        coursePrerequisites: course.prerequisites || 'No prior coding or technical experience required.',
        educationalCredentialAwarded:
          'Non-accredited Certificate of Participation (subject to session participation and digital self-protection checklist completion)',
        teaches: [...(course.learningOutcomes || []), ...(course.practicalSkills || [])],
        about: (course.keyAreas || []).map((topic) => ({
          '@type': 'Thing',
          name: topic,
        })),
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'Women, female students, parents, teachers, and community educators',
          audienceType: (course.whoThisCourseIsFor || []).join('; '),
        },
        offers: {
          '@type': 'Offer',
          category: 'Free Social-Impact Programme',
          price: '0',
          priceCurrency: 'BDT',
          availability: options?.isFull
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/InStock',
          url: `${canonicalUrl}#register`,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: 'P4W',
          inLanguage: ['bn', 'en'],
        },
        syllabusSections: (course.modules || []).map((mod) => ({
          '@type': 'Syllabus',
          name: `${mod.code}: ${mod.title}`,
          description: mod.topics.join('; '),
        })),
      },
    ],
  };
}

export function buildInstitutionalServiceJsonLd(
  service: InstitutionalServiceItem,
  baseUrl: string,
  options?: { lastOptimizedAt?: string; seoTitle?: string; metaDescription?: string }
): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const canonicalUrl = cleanBase
    ? `${cleanBase}/institutional-services/${service.slug}`
    : `/institutional-services/${service.slug}`;
  const orgId = cleanBase ? `${cleanBase}/#organization` : '#organization';
  const websiteId = cleanBase ? `${cleanBase}/#website` : '#website';
  const imageUrl = cleanBase ? `${cleanBase}${service.imageUrl}` : service.imageUrl;
  const profile = INSTITUTIONAL_SEO_PROFILES[service.slug];

  const catalogItems = [
    ...service.keyAreas.map((area) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: area,
      },
    })),
    ...(service.pathways || []).map((pw) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: pw.title,
        description: pw.summary,
      },
    })),
    ...(service.sectors || []).map((sec) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: sec.title,
        description: sec.summary,
      },
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: cleanBase ? `${cleanBase}/` : '/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Programmes',
            item: cleanBase ? `${cleanBase}/programmes` : '/programmes',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Specialised Programmes',
            item: cleanBase
              ? `${cleanBase}/programmes#specialised-programmes`
              : '/programmes#specialised-programmes',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: service.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name:
          options?.seoTitle ||
          profile?.seoTitle ||
          `${service.title} – Institutional Services – Atlas AI Education`,
        description: options?.metaDescription || profile?.metaDescription || service.shortSummary,
        isPartOf: { '@id': websiteId },
        about: { '@id': `${canonicalUrl}#service` },
        primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl },
        inLanguage: ['en', 'bn'],
        ...(options?.lastOptimizedAt ? { dateModified: options.lastOptimizedAt } : {}),
      },
      {
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        url: canonicalUrl,
        name: service.title,
        alternateName: `${service.code}: ${service.title}`,
        serviceType: profile?.serviceType || service.badge,
        description: `${service.shortSummary} ${service.overview}`,
        provider: { '@id': orgId },
        image: imageUrl,
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
        audience: {
          '@type': 'Audience',
          audienceType: service.whoItIsFor.join('; '),
        },
        serviceOutput: service.potentialDeliverables,
        termsOfService:
          'Tailored institutional scoping following a consultation with your organisation via Atlas AI Education.',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${service.title} Scope & Focus Areas`,
          itemListElement: catalogItems,
        },
      },
    ],
  };
}

export function buildSpecialisedItemListEntity(
  baseUrl: string,
  options?: { canonicalPath?: string; wsaiPublished?: boolean }
): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const path = options?.canonicalPath || '/programmes';
  const pageUrl = `${cleanBase}${path}`;
  const wsaiPublished = options?.wsaiPublished ?? true;

  const entries: Array<{ name: string; url: string; description: string }> = [];
  if (wsaiPublished) {
    entries.push({
      name: `${WOMENS_SAFETY_PROGRAMME.title} (${WOMENS_SAFETY_PROGRAMME.code})`,
      url: cleanBase
        ? `${cleanBase}/programmes/womens-safety-in-the-ai-era`
        : '/programmes/womens-safety-in-the-ai-era',
      description: WOMENS_SAFETY_PROGRAMME.hook,
    });
  }
  for (const srv of INSTITUTIONAL_SERVICES) {
    entries.push({
      name: `${srv.title} (${srv.code})`,
      url: cleanBase
        ? `${cleanBase}/institutional-services/${srv.slug}`
        : `/institutional-services/${srv.slug}`,
      description: srv.shortSummary,
    });
  }

  return {
    '@type': 'ItemList',
    '@id': `${pageUrl}#specialised-itemlist`,
    name: 'Specialised Programmes & Institutional AI Services – Atlas AI Education',
    numberOfItems: entries.length,
    itemListElement: entries.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  };
}

export function buildSpecialisedCategoryListingJsonLd(
  baseUrl: string,
  options?: { canonicalPath?: string; pageTitle?: string; pageDescription?: string }
): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const targetPath = options?.canonicalPath || '/programmes';
  const pageUrl = `${cleanBase}${targetPath}`;
  const itemList = buildSpecialisedItemListEntity(cleanBase, {
    canonicalPath: targetPath,
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#specialised-breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanBase}/` },
          { '@type': 'ListItem', position: 2, name: 'Programmes', item: `${cleanBase}/programmes` },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Specialised Programmes',
            item: `${cleanBase}/programmes#specialised-programmes`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#specialised-collection`,
        url: pageUrl,
        name: options?.pageTitle || 'Specialised Programmes – Atlas AI Education',
        description:
          options?.pageDescription ||
          "Free Women's Safety in the AI Era (SP-WSAI) awareness programme and 8 Institutional Training & Advisory Services.",
        isPartOf: { '@id': `${cleanBase}/#website` },
        about: { '@id': `${cleanBase}/#organization` },
        mainEntity: { '@id': `${pageUrl}#specialised-itemlist` },
        inLanguage: ['bn', 'en'],
      },
      itemList,
    ],
  };
}

export function buildHomeJsonLd(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const homeUrl = cleanBase ? `${cleanBase}/` : '/';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...buildWebsiteEntity(cleanBase),
        inLanguage: ['bn', 'en'],
      },
      {
        ...buildOrganizationEntity(cleanBase),
        slogan: 'Understand AI. Apply AI. Advance Responsibly',
        description:
          'Atlas AI Education is an education initiative of Atlas AI Institute delivering structured AI Literacy & Foundation, Applied AI, Professional Development, Specialised Digital Safety (FREE), and Institutional Advisory Services.',
        knowsAbout: [
          'Artificial Intelligence Literacy',
          'Generative AI and Prompt Engineering',
          'Applied AI Workflows and Automation',
          'Responsible AI Governance',
          'Workplace and Leadership AI Strategy',
          "Women's Digital Safety in the AI Era",
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${homeUrl}#webpage`,
        url: homeUrl,
        name: 'Atlas AI Education – Understand AI. Apply AI. Advance Responsibly',
        description:
          'AI বুঝুন। কাজে লাগান। দায়িত্ব নিয়ে এগোন। Atlas AI Institute-এর education initiative — ১৮টি programme, Free Monthly Masterclass, Free Digital Safety ও Institutional Services।',
        isPartOf: { '@id': cleanBase ? `${cleanBase}/#website` : '#website' },
        about: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: cleanBase
            ? `${cleanBase}/src/assets/images/hero_atlas_institute_1794867545953.jpg`
            : '/src/assets/images/hero_atlas_institute_1794867545953.jpg',
        },
        mainEntity: {
          '@type': 'ItemList',
          name: 'Atlas AI Education Programme Categories',
          numberOfItems: COURSE_CATEGORIES.length,
          itemListElement: COURSE_CATEGORIES.map((cat, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: cat.title,
            description: `${cat.levelLabel} (${cat.feeRange}) — ${cat.shortDescription}`,
            url: `${cleanBase}/programmes#${cat.slug}`,
          })),
        },
        inLanguage: ['bn', 'en'],
      },
    ],
  };
}

export function buildAboutJsonLd(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const pageUrl = cleanBase ? `${cleanBase}/about` : '/about';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanBase}/` },
          { '@type': 'ListItem', position: 2, name: 'About', item: pageUrl },
        ],
      },
      {
        '@type': 'AboutPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'About – Atlas AI Education (Atlas AI Institute)',
        description:
          'An AI-literate, capable and responsible society — Atlas AI Education-এর লক্ষ্য, ছয়টি উদ্দেশ্য, শিক্ষণ পদ্ধতি ও ৭টি নীতিগত অঙ্গীকার।',
        isPartOf: { '@id': cleanBase ? `${cleanBase}/#website` : '#website' },
        mainEntity: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
        inLanguage: ['bn', 'en'],
      },
    ],
  };
}

export function buildContactJsonLd(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const pageUrl = cleanBase ? `${cleanBase}/contact` : '/contact';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanBase}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: pageUrl },
        ],
      },
      {
        '@type': 'ContactPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'Contact – Atlas AI Education',
        description:
          'Contact Atlas AI Education for inquiries on Foundation, Applied AI, Professional Development courses, Free Monthly Masterclass, scholarships, or institutional training.',
        isPartOf: { '@id': cleanBase ? `${cleanBase}/#website` : '#website' },
        mainEntity: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
        inLanguage: ['bn', 'en'],
      },
    ],
  };
}

export function buildFaqJsonLd(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const pageUrl = cleanBase ? `${cleanBase}/faq` : '/faq';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanBase}/` },
          { '@type': 'ListItem', position: 2, name: 'FAQ', item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faqpage`,
        url: pageUrl,
        name: 'Frequently Asked Questions (FAQ) – Atlas AI Education',
        description:
          'Answers to common questions about Free Masterclass, course fees (FREE & BDT 999–2,500), bKash/Nagad Send Money, non-accredited certificates, and Course-Based Scholarships.',
        isPartOf: { '@id': cleanBase ? `${cleanBase}/#website` : '#website' },
        about: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
        mainEntity: FAQ_VERIFIED_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
        inLanguage: ['bn', 'en'],
      },
    ],
  };
}

export function buildScholarshipsJsonLd(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const pageUrl = cleanBase ? `${cleanBase}/scholarships` : '/scholarships';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanBase}/` },
          { '@type': 'ListItem', position: 2, name: 'Scholarships', item: pageUrl },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'Course-Based Scholarships (Up to 50% Fee Waiver) – Atlas AI Education',
        description:
          'Atlas AI Education provides merit-based and need-based course fee waivers (up to 50% waiver, maximum 5 scholars per paid course) on eligible paid AI programmes.',
        isPartOf: { '@id': cleanBase ? `${cleanBase}/#website` : '#website' },
        about: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
        inLanguage: ['bn', 'en'],
      },
    ],
  };
}

export function buildResourcesJsonLd(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const pageUrl = cleanBase ? `${cleanBase}/resources` : '/resources';

  // Strictly emit ONLY publicly accessible guides & curated references (RESOURCES)
  // and never expose locked member eBook payloads or locked prompt template strings.
  const publicItems = RESOURCES.map((res, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'CreativeWork',
      name: res.title,
      description: res.description,
      learningResourceType: res.type,
      isAccessibleForFree: true,
      url: res.url.startsWith('http') ? res.url : `${cleanBase}${res.url}`,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanBase}/` },
          { '@type': 'ListItem', position: 2, name: 'Resources', item: pageUrl },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        url: pageUrl,
        name: 'AI Learning Resource & Guide Library – Atlas AI Education',
        description:
          'Curated AI ethics & governance references (UNESCO, OECD, NIST AI RMF), curriculum guides, scholarship policy guide, and member-gated eBook & industry prompt library overview.',
        isPartOf: { '@id': cleanBase ? `${cleanBase}/#website` : '#website' },
        about: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
        mainEntity: {
          '@type': 'ItemList',
          name: 'Public Curated AI Learning Guides & Global Ethics References',
          numberOfItems: publicItems.length,
          itemListElement: publicItems,
        },
        inLanguage: ['bn', 'en'],
      },
    ],
  };
}

export function buildToolsJsonLd(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const pageUrl = cleanBase ? `${cleanBase}/tools` : '/tools';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanBase}/` },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: pageUrl },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'Interactive AI Learning Tools & Course Matcher – Atlas AI Education',
        description:
          'Free online AI practice utilities from Atlas AI Education: Structured Prompt Architect and AI Programme Course Match Finder.',
        isPartOf: { '@id': cleanBase ? `${cleanBase}/#website` : '#website' },
        about: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: 2,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': 'SoftwareApplication',
                name: 'Structured Prompt Architect',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web Browser',
                isAccessibleForFree: true,
                description:
                  'Create structured AI prompts using persona, specific task objective, tone, and output format.',
                provider: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@type': 'SoftwareApplication',
                name: 'AI Programme Course Match Finder',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web Browser',
                isAccessibleForFree: true,
                description:
                  'Interactive utility helping learners select an AI Foundation, Applied AI, Professional Development, or Specialised programme.',
                provider: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
              },
            },
          ],
        },
        inLanguage: ['bn', 'en'],
      },
    ],
  };
}

export function buildVerifyCertificateJsonLd(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const pageUrl = cleanBase ? `${cleanBase}/verify-certificate` : '/verify-certificate';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanBase}/` },
          { '@type': 'ListItem', position: 2, name: 'Verify Certificate', item: pageUrl },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'Verify Certificate – Atlas AI Education',
        description:
          'Verify the authenticity of non-accredited completion and participation certificates issued by Atlas AI Education by entering a Certificate ID.',
        isPartOf: { '@id': cleanBase ? `${cleanBase}/#website` : '#website' },
        about: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
        inLanguage: ['en', 'bn'],
      },
    ],
  };
}

export function buildLegalOrDirectoryJsonLd(
  baseUrl: string,
  opts: {
    routePath: string;
    breadcrumbLabel: string;
    pageTitle: string;
    description: string;
  }
): Record<string, unknown> {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const pageUrl = cleanBase ? `${cleanBase}${opts.routePath}` : opts.routePath;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanBase}/` },
          { '@type': 'ListItem', position: 2, name: opts.breadcrumbLabel, item: pageUrl },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: opts.pageTitle,
        description: opts.description,
        isPartOf: { '@id': cleanBase ? `${cleanBase}/#website` : '#website' },
        about: { '@id': cleanBase ? `${cleanBase}/#organization` : '#organization' },
        inLanguage: ['bn', 'en'],
      },
    ],
  };
}

export function buildAllSitePageSeoRecords(
  baseUrl = '',
  now = new Date().toISOString()
): PageSeoRecord[] {
  const records: PageSeoRecord[] = [
    {
      routePath: '/',
      canonicalPath: '/',
      pageType: 'main',
      pageTitle: 'Atlas AI Education – Home',
      seoTitle: 'Atlas AI Education – Atlas AI Institute | Understand AI. Apply AI. Advance Responsibly',
      metaDescription:
        'AI বুঝুন। কাজে লাগান। দায়িত্ব নিয়ে এগোন। Atlas AI Institute-এর education initiative — ১৮টি programme (FREE ও BDT 999–2,500), প্রতি মাসের Free Masterclass ও Institutional Services।',
      ogTitle: 'Atlas AI Education – Atlas AI Institute',
      ogDescription:
        '১৮টি structured AI learning programme — AI Literacy & Foundation, Applied AI, Professional Development, Free Women’s Digital Safety ও Institutional Services।',
      ogImage: '/src/assets/images/hero_atlas_institute_1794867545953.jpg',
      ogImageAlt: 'Atlas AI Education – An Education Initiative of Atlas AI Institute',
      primaryKeyword: 'Atlas AI Education Bangladesh',
      secondaryKeywords: [
        'Atlas AI Institute education initiative',
        'AI courses Bangladesh Bangla English',
        'Free AI Masterclass Bangladesh',
        'Responsible AI education platform',
      ],
      semanticTopics: [
        'AI Literacy & Foundation',
        'Applied AI Practical Skills',
        'AI Professional Development',
        "Women's Digital Safety in the AI Era",
        'Free Monthly AI Masterclass',
        'Institutional AI Training & Advisory',
      ],
      searchIntent: 'navigational-informational-education-platform',
      schemaType: 'WebSite,EducationalOrganization,WebPage',
      schemaJson: buildHomeJsonLd(baseUrl),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/about',
      canonicalPath: '/about',
      pageType: 'main',
      pageTitle: 'About – Atlas AI Education',
      seoTitle: 'About Atlas AI Education – Mission, Methodology & Ethics – Atlas AI Institute',
      metaDescription:
        'Atlas AI Education কী ও কেন — Atlas AI Institute-এর research-ভিত্তিক AI শিক্ষা উদ্যোগের লক্ষ্য, ৬টি উদ্দেশ্য, শিক্ষণ পদ্ধতি ও ৭টি নৈতিক অঙ্গীকার।',
      ogTitle: 'About Atlas AI Education – Atlas AI Institute',
      ogDescription:
        'An AI-literate, capable and responsible society — আমাদের শিক্ষার দর্শন, স্বচ্ছ ফি কাঠামো এবং non-accredited certification নীতি।',
      ogImage: '/src/assets/images/hero_atlas_institute_1794867545953.jpg',
      ogImageAlt: 'About Atlas AI Education learning method and ethical principles',
      primaryKeyword: 'About Atlas AI Education',
      secondaryKeywords: [
        'Atlas AI Institute AI literacy mission',
        'Responsible AI training principles Bangladesh',
        'Project-based bilingual AI learning method',
      ],
      semanticTopics: [
        'AI Literacy Vision',
        'Academic Integrity',
        'Transparency and Honest Certification',
        'Responsible AI Education',
      ],
      searchIntent: 'informational-organization-about',
      schemaType: 'AboutPage',
      schemaJson: buildAboutJsonLd(baseUrl),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/programmes',
      canonicalPath: '/programmes',
      pageType: 'category',
      pageTitle: 'Explore Our Programmes',
      seoTitle: 'Explore Our Programmes (18 AI Courses & Institutional Services) – Atlas AI Education',
      metaDescription:
        'Explore 18 structured AI programmes across Foundation (FREE–৳1,499), Applied AI (৳1,200), Professional Development (৳2,500), Free Women’s Safety & 8 Institutional Services.',
      ogTitle: 'All AI Programmes & Institutional Services – Atlas AI Education',
      ogDescription:
        'Compare all 18 bilingual AI courses and 8 institutional advisory programmes across AI Literacy, Applied AI, Professional Development, and Specialised tracks.',
      ogImage: '/src/assets/images/programme_ai_literacy_1794867547641.jpg',
      ogImageAlt: 'Atlas AI Education Full Programmes Directory',
      primaryKeyword: 'Atlas AI Education programmes catalogue',
      secondaryKeywords: [
        'AI Literacy and Foundation courses Bangladesh',
        'Applied AI and Professional Development courses',
        'Specialised AI programmes and corporate training',
      ],
      semanticTopics: [
        'Foundation AI Literacy',
        'Applied AI',
        'Professional Development',
        'Specialised Programmes',
        'Institutional Training Services',
      ],
      searchIntent: 'commercial-educational-catalogue',
      schemaType: 'CollectionPage',
      schemaJson: buildSpecialisedCategoryListingJsonLd(baseUrl, { canonicalPath: '/programmes' }),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/free-masterclass',
      canonicalPath: '/free-masterclass',
      pageType: 'programme',
      pageTitle: 'Free Masterclass Registration',
      seoTitle: 'Free Monthly AI Masterclass Registration (BDT 0) – Atlas AI Education',
      metaDescription:
        'AI Fundamentals & Digital Literacy: প্রতি মাসে ১টা live open session (২–২.৫ ঘণ্টা, ফি FREE / BDT 0)। পরবর্তী session-এর জন্য বিনামূল্যে Register করুন।',
      ogTitle: 'Free Monthly AI Masterclass (BDT 0) – Atlas AI Education',
      ogDescription:
        'Join our monthly 2–2.5 hour open session introducing Artificial Intelligence, how models learn, and responsible everyday use (FREE / BDT 0).',
      ogImage: '/src/assets/images/course_ai_literacy_session_1794924850721.jpg',
      ogImageAlt: 'Free Monthly AI Fundamentals & Digital Literacy Masterclass',
      primaryKeyword: 'Free AI Masterclass Bangladesh',
      secondaryKeywords: [
        'AI Fundamentals and Digital Literacy FREE',
        'Monthly free online AI open session',
        'Atlas AI Education free registration',
      ],
      semanticTopics: [
        'Free AI Masterclass',
        'Digital Literacy Open Session',
        'Beginner AI Introduction',
      ],
      searchIntent: 'informational-free-event-registration',
      schemaType: 'EducationEvent,Course',
      schemaJson: { note: 'Generated dynamically via buildFreeMasterclassJsonLd' },
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/resources',
      canonicalPath: '/resources',
      pageType: 'utility',
      pageTitle: 'Resources & Prompt Library Overview',
      seoTitle: 'AI Learning Resources, Guides & Global Ethics References – Atlas AI Education',
      metaDescription:
        'Access curriculum handbooks, UNESCO/OECD/NIST AI governance references, Women’s Safety guide, scholarship guidelines, and member eBook & industry prompt library overview.',
      ogTitle: 'AI Learning Resource & Guide Library – Atlas AI Education',
      ogDescription:
        'Explore curated bilingual AI guides, international AI governance references (UNESCO, OECD, NIST), and Atlas AI Education member learning libraries.',
      ogImage: '/src/assets/images/ebook_cover_ai_basics_1794934415808.jpg',
      ogImageAlt: 'Atlas AI Education Learning Resources & Curated Guides',
      primaryKeyword: 'AI learning guides and responsible AI resources Bangladesh',
      secondaryKeywords: [
        'UNESCO OECD NIST AI governance references',
        'AI literacy curriculum handbook Bangladesh',
        'Atlas AI Education resources library',
      ],
      semanticTopics: [
        'AI Curriculum Guides',
        'UNESCO AI Ethics Recommendation',
        'OECD AI Principles',
        'NIST AI Risk Management Framework',
        'Safeguarding and Scholarship Guides',
      ],
      searchIntent: 'informational-educational-resources',
      schemaType: 'CollectionPage',
      schemaJson: buildResourcesJsonLd(baseUrl),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/tools',
      canonicalPath: '/tools',
      pageType: 'utility',
      pageTitle: 'Interactive AI Learning Tools',
      seoTitle: 'Interactive AI Prompt Architect & Course Matcher Tools – Atlas AI Education',
      metaDescription:
        'Free interactive AI learning tools from Atlas AI Education: build structured prompts with the Structured Prompt Architect and find your track with Course Match Finder.',
      ogTitle: 'Interactive AI Practice Tools & Course Matcher – Atlas AI Education',
      ogDescription:
        'Practice structured prompting (Persona, Task, Tone, Format) and match your goals to Foundation, Applied AI, or Professional Development programmes.',
      ogImage: '/src/assets/images/course_prompt_engineering_1794924782953.jpg',
      ogImageAlt: 'Structured Prompt Architect and AI Course Match Finder',
      primaryKeyword: 'Interactive AI Prompt Builder and Course Matcher',
      secondaryKeywords: [
        'Structured Prompt Architect tool free',
        'AI course finder Atlas AI Education',
        'Prompt engineering practice utility',
      ],
      semanticTopics: [
        'Structured Prompt Engineering',
        'AI Role and Persona Prompting',
        'AI Course Recommendation Tool',
      ],
      searchIntent: 'interactive-educational-utility',
      schemaType: 'WebPage,SoftwareApplication',
      schemaJson: buildToolsJsonLd(baseUrl),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/scholarships',
      canonicalPath: '/scholarships',
      pageType: 'main',
      pageTitle: 'Scholarships & Financial Assistance',
      seoTitle: 'Course-Based Scholarships (Up to 50% Fee Waiver) – Atlas AI Education',
      metaDescription:
        'Apply for Atlas AI Education Course-Based Scholarships: up to 50% fee waiver on paid AI courses for up to 5 learners per course through merit and need-based evaluation.',
      ogTitle: 'Course-Based AI Scholarships (Up to 50% Waiver) – Atlas AI Education',
      ogDescription:
        'Merit- and need-based fee waiver programme supporting learners across Foundation, Applied AI, and Professional Development paid courses (max 5 seats per course).',
      ogImage: '/src/assets/images/programme_ai_literacy_1794867547641.jpg',
      ogImageAlt: 'Atlas AI Education Course-Based Scholarship Programme',
      primaryKeyword: 'Atlas AI Education course scholarship Bangladesh',
      secondaryKeywords: [
        'AI course fee waiver Bangladesh 50 percent',
        'Merit and need-based AI learning scholarship',
        'Apply for Atlas AI Education scholarship',
      ],
      semanticTopics: [
        'Course-Based Scholarship',
        'Tuition Fee Waiver up to 50%',
        'Merit and Financial Need Evaluation',
      ],
      searchIntent: 'informational-scholarship-application',
      schemaType: 'WebPage',
      schemaJson: buildScholarshipsJsonLd(baseUrl),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/verify-certificate',
      canonicalPath: '/verify-certificate',
      pageType: 'utility',
      pageTitle: 'Verify Certificate',
      seoTitle: 'Verify Non-Accredited Certificate Authenticity – Atlas AI Education',
      metaDescription:
        'Verify the authenticity of non-accredited completion and participation certificates issued by Atlas AI Education using a unique Certificate ID.',
      ogTitle: 'Certificate Verification Portal – Atlas AI Education',
      ogDescription:
        'Check official completion and participation certificate records issued by Atlas AI Education (non-accredited assessment-based credentials).',
      ogImage: '/src/assets/images/hero_atlas_institute_1794867545953.jpg',
      ogImageAlt: 'Atlas AI Education Certificate Verification Portal',
      primaryKeyword: 'Verify Atlas AI Education certificate',
      secondaryKeywords: [
        'Atlas AI certificate authenticity check',
        'Non-accredited AI course certificate verification',
      ],
      semanticTopics: [
        'Certificate Verification',
        'Credential Transparency',
        'Non-Accredited Completion Record',
      ],
      searchIntent: 'utility-credential-verification',
      schemaType: 'WebPage',
      schemaJson: buildVerifyCertificateJsonLd(baseUrl),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/faq',
      canonicalPath: '/faq',
      pageType: 'main',
      pageTitle: 'Frequently Asked Questions (FAQ)',
      seoTitle: 'FAQ – Course Fees, Free Masterclass, Certificates & Scholarships – Atlas AI Education',
      metaDescription:
        'Answers on Free Masterclass registration, BDT 0–2,500 course fees, bKash/Nagad Send Money, non-accredited certificates, Specialised Programmes, and 50% Scholarships.',
      ogTitle: 'Frequently Asked Questions (FAQ) – Atlas AI Education',
      ogDescription:
        'Clear answers about Atlas AI Education programmes, payment verification, certification policy, and scholarships.',
      ogImage: '/src/assets/images/hero_atlas_institute_1794867545953.jpg',
      ogImageAlt: 'Frequently Asked Questions at Atlas AI Education',
      primaryKeyword: 'Atlas AI Education FAQ',
      secondaryKeywords: [
        'Atlas AI Education course fees bKash Nagad',
        'Free AI Masterclass certificate policy FAQ',
        'AI course scholarship eligibility Bangladesh FAQ',
      ],
      semanticTopics: [
        'Free Masterclass Policy',
        'Manual Payment Verification',
        'Non-Accredited Certificates',
        'Course-Based Scholarships',
        'Specialised Programmes',
      ],
      searchIntent: 'informational-faq-support',
      schemaType: 'FAQPage',
      schemaJson: buildFaqJsonLd(baseUrl),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/contact',
      canonicalPath: '/contact',
      pageType: 'main',
      pageTitle: 'Contact Atlas AI Education',
      seoTitle: 'Contact Us – Programme & Institutional Inquiries – Atlas AI Education',
      metaDescription:
        'Contact Atlas AI Education regarding Foundation, Applied AI, or Professional Development courses, Free Monthly Masterclasses, or institutional training inquiries.',
      ogTitle: 'Contact – Atlas AI Education',
      ogDescription:
        'Send an inquiry to the Atlas AI Education team about courses, scholarships, free sessions, or institutional training.',
      ogImage: '/src/assets/images/hero_atlas_institute_1794867545953.jpg',
      ogImageAlt: 'Contact Atlas AI Education Team',
      primaryKeyword: 'Contact Atlas AI Education',
      secondaryKeywords: [
        'Atlas AI Education inquiry form',
        'Institutional AI training consultation contact',
      ],
      semanticTopics: [
        'Learner Support Inquiry',
        'Institutional Consultation Contact',
      ],
      searchIntent: 'navigational-contact',
      schemaType: 'ContactPage',
      schemaJson: buildContactJsonLd(baseUrl),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/privacy',
      canonicalPath: '/privacy',
      pageType: 'legal',
      pageTitle: 'Privacy Policy',
      seoTitle: 'Privacy Policy & Data Protection – Atlas AI Education',
      metaDescription:
        'Atlas AI Education privacy policy detailing how learner account details, enrolment applications, scholarship submissions, and uploaded materials are protected.',
      ogTitle: 'Privacy Policy – Atlas AI Education',
      ogDescription:
        'Learn how Atlas AI Education handles personal data, educational records, and safeguarding privacy protections.',
      ogImage: '/src/assets/images/hero_atlas_institute_1794867545953.jpg',
      ogImageAlt: 'Atlas AI Education Privacy Policy',
      primaryKeyword: 'Atlas AI Education privacy policy',
      secondaryKeywords: ['Learner data protection Atlas AI Education'],
      semanticTopics: ['Data Privacy', 'Learner Data Protection', 'Safeguarding'],
      searchIntent: 'informational-legal-policy',
      schemaType: 'WebPage',
      schemaJson: buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: '/privacy',
        breadcrumbLabel: 'Privacy Policy',
        pageTitle: 'Privacy Policy & Data Protection – Atlas AI Education',
        description:
          'Atlas AI Education privacy policy detailing learner data protection, safeguarding, and application confidentiality.',
      }),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/terms',
      canonicalPath: '/terms',
      pageType: 'legal',
      pageTitle: 'Terms & Conditions',
      seoTitle: 'Terms & Conditions – Non-Accredited Policy & Transparency – Atlas AI Education',
      metaDescription:
        'Atlas AI Education Terms & Conditions covering non-accredited programmes, transparent tuition & assessment rules, and zero job or income guarantees.',
      ogTitle: 'Terms & Conditions – Atlas AI Education',
      ogDescription:
        'Review Atlas AI Education terms of enrolment, non-accredited certification disclosures, and academic integrity commitments.',
      ogImage: '/src/assets/images/hero_atlas_institute_1794867545953.jpg',
      ogImageAlt: 'Atlas AI Education Terms and Conditions',
      primaryKeyword: 'Atlas AI Education terms and conditions',
      secondaryKeywords: ['Non-accredited AI education transparency policy'],
      semanticTopics: ['Terms of Enrolment', 'Non-Accredited Disclosure', 'Academic Integrity'],
      searchIntent: 'informational-legal-terms',
      schemaType: 'WebPage',
      schemaJson: buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: '/terms',
        breadcrumbLabel: 'Terms & Conditions',
        pageTitle: 'Terms & Conditions – Atlas AI Education',
        description:
          'Non-accredited programme policy, fee transparency, and participation conditions for Atlas AI Education.',
      }),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
    {
      routePath: '/sitemap',
      canonicalPath: '/sitemap',
      pageType: 'utility',
      pageTitle: 'Website Sitemap',
      seoTitle: 'HTML Sitemap – All Pages, 18 Programmes & 8 Institutional Services – Atlas AI Education',
      metaDescription:
        'Browse the complete directory of Atlas AI Education pages, 4 programme categories, 18 AI courses, and 8 institutional training & advisory services.',
      ogTitle: 'Sitemap – Atlas AI Education',
      ogDescription:
        'Complete directory of Atlas AI Education public pages, 18 programmes, and institutional AI services.',
      ogImage: '/src/assets/images/hero_atlas_institute_1794867545953.jpg',
      ogImageAlt: 'Atlas AI Education Website Sitemap',
      primaryKeyword: 'Atlas AI Education sitemap',
      secondaryKeywords: ['Atlas AI Education full programme directory'],
      semanticTopics: ['Website Directory', 'AI Programmes List', 'Institutional Services Index'],
      searchIntent: 'navigational-directory',
      schemaType: 'WebPage',
      schemaJson: buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: '/sitemap',
        breadcrumbLabel: 'Sitemap',
        pageTitle: 'HTML Sitemap – Atlas AI Education',
        description:
          'Directory of all public pages, programme categories, 18 courses, and 8 institutional advisory services.',
      }),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    },
  ];

  // Append all 8 Institutional Training & Advisory Services
  for (const service of INSTITUTIONAL_SERVICES) {
    const profile = INSTITUTIONAL_SEO_PROFILES[service.slug];
    const seoTitle =
      profile?.seoTitle || `${service.title} (${service.code}) – Institutional Services – Atlas AI Education`;
    const metaDescription = profile?.metaDescription || service.shortSummary;
    const ogTitle = profile?.ogTitle || `${service.title} (${service.code}) – Atlas AI Education`;
    const ogDescription = profile?.ogDescription || service.shortSummary;

    records.push({
      routePath: `/institutional-services/${service.slug}`,
      canonicalPath: `/institutional-services/${service.slug}`,
      pageType: 'institutional-service',
      pageTitle: `${service.title} (${service.code})`,
      seoTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage: service.imageUrl,
      ogImageAlt: service.imageAlt,
      primaryKeyword: profile?.primaryKeyword || `${service.title} Atlas AI Education`,
      secondaryKeywords: profile?.secondaryKeywords || [
        `${service.title} Bangladesh`,
        `Atlas AI Education ${service.code}`,
      ],
      semanticTopics: profile?.semanticTopics || service.keyAreas,
      searchIntent: profile?.searchIntent || 'institutional-b2b-consultation',
      schemaType: 'Service',
      schemaJson: buildInstitutionalServiceJsonLd(service, baseUrl, {
        lastOptimizedAt: now,
        seoTitle,
        metaDescription,
      }),
      indexStatus: 'indexed',
      isPublished: true,
      lastOptimizedAt: now,
    });
  }

  return records;
}

export function getPageSeoRecordByPath(routePath: string): PageSeoRecord | undefined {
  const clean = routePath === '/' ? '/' : routePath.replace(/\/+$/, '');
  return buildAllSitePageSeoRecords('').find(
    (r) => r.routePath.toLowerCase() === clean.toLowerCase()
  );
}

export function getInstitutionalServiceSeoSummary(
  service: InstitutionalServiceItem,
  baseUrl: string
) {
  const profile = INSTITUTIONAL_SEO_PROFILES[service.slug];
  return {
    code: service.code,
    slug: service.slug,
    title: service.title,
    canonicalUrl: `${baseUrl}/institutional-services/${service.slug}`,
    seoTitle:
      profile?.seoTitle ||
      `${service.title} (${service.code}) – Institutional Services – Atlas AI Education`,
    metaDescription: profile?.metaDescription || service.shortSummary,
    ogTitle: profile?.ogTitle || `${service.title} – Atlas AI Education`,
    ogDescription: profile?.ogDescription || service.shortSummary,
    ogImage: `${baseUrl}${service.imageUrl}`,
    ogImageAlt: service.imageAlt,
    primaryKeyword: profile?.primaryKeyword || service.title,
    secondaryKeywords: profile?.secondaryKeywords || [],
    semanticTopics: profile?.semanticTopics || service.keyAreas,
    searchIntent: profile?.searchIntent || 'institutional-consultation',
    serviceSchema: buildInstitutionalServiceJsonLd(service, baseUrl),
  };
}

export function getCourseCountSummaryByCategory() {
  return COURSE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    title: cat.title,
    levelLabel: cat.levelLabel,
    feeRange: cat.feeRange,
    courseCount: COURSES.filter((c) => c.categorySlug === cat.slug).length,
  }));
}
