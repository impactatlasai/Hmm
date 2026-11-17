import { COURSES, CourseItem } from '../data/coursesData';

export const FOUNDATION_CATEGORY_SLUG = 'ai-literacy';

export interface CourseSeoRecord {
  courseCode: string;
  slug: string;
  canonicalPath: string;
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
  intendedAudience: string[];
  learningLevel: string;
  indexStatus: 'indexed' | 'noindex';
  isPublished: boolean;
  lastOptimizedAt: string;
  courseSchema: Record<string, unknown>;
}

interface FoundationCourseSeoProfile {
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  semanticTopics: string[];
  searchIntent: string;
  workloadIso: string;
  courseMode: string;
}

/**
 * Curated per-course SEO / AIO / GEO enrichment profiles strictly grounded in verified
 * course specifications from coursesData.ts. Any newly added Foundation (ai-literacy)
 * course automatically receives a dynamically generated profile via buildFallbackProfile().
 */
const FOUNDATION_SEO_PROFILES: Record<string, FoundationCourseSeoProfile> = {
  FREE: {
    seoTitle: 'AI Fundamentals & Digital Literacy (FREE) – Atlas AI Education',
    metaDescription:
      'Monthly 2–2.5 hour FREE open session (BDT 0) by Atlas AI Education covering how AI works, ML vs Deep Learning, everyday AI applications, and safe use for beginners.',
    ogTitle: 'AI Fundamentals & Digital Literacy (FREE Masterclass) – Atlas AI Education',
    ogDescription:
      'Beginner-friendly monthly open session (BDT 0 · 2–2.5 Hours) introducing Artificial Intelligence, how models learn from data, and everyday responsible AI usage.',
    primaryKeyword: 'AI Fundamentals and Digital Literacy Bangladesh',
    secondaryKeywords: [
      'Free AI Masterclass Bangladesh',
      'AI literacy foundation course BDT 0',
      'Introduction to Artificial Intelligence beginner',
      'Atlas AI Education free open session',
      'AI Machine Learning Deep Learning basics',
    ],
    semanticTopics: [
      'Artificial Intelligence Fundamentals',
      'Digital Literacy',
      'Machine Learning vs Deep Learning',
      'Narrow AI and Generative AI',
      'AI Training and Inference Basics',
      'Everyday AI Applications',
    ],
    searchIntent: 'informational-educational-free-registration',
    workloadIso: 'PT2H30M',
    courseMode: 'online',
  },
  'AL-100': {
    seoTitle: 'AI Governance Fundamentals (AL-100) – Atlas AI Education',
    metaDescription:
      'Free 4-week (8 classes, BDT 0) AI Governance Fundamentals foundation course by Atlas AI Education covering responsible AI principles, algorithmic bias, and UNESCO/OECD/EU frameworks.',
    ogTitle: 'AI Governance Fundamentals (AL-100 · Free Foundation) – Atlas AI Education',
    ogDescription:
      '4-week (8 live online classes · BDT 0) foundation course on AI policy, accountability, transparency, algorithmic risk assessment, and global governance frameworks.',
    primaryKeyword: 'AI Governance Fundamentals course',
    secondaryKeywords: [
      'Free AI governance course Bangladesh',
      'Responsible AI policy and ethics training',
      'Algorithmic bias and AI accountability',
      'UNESCO OECD EU AI Act fundamentals',
      'Atlas AI Education AL-100',
    ],
    semanticTopics: [
      'AI Governance',
      'AI Policy Foundations',
      'Transparency and Explainability',
      'Algorithmic Bias and Fairness',
      'Human-in-the-loop Oversight',
      'Global AI Governance Frameworks',
    ],
    searchIntent: 'informational-educational-free-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'AL-101': {
    seoTitle: 'Generative AI & Prompt Engineering (AL-101) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 999) Generative AI & Prompt Engineering course by Atlas AI Education. Learn LLM fundamentals, zero-shot/few-shot prompting, and multimodal workflows.',
    ogTitle: 'Generative AI & Prompt Engineering (AL-101) – Atlas AI Education',
    ogDescription:
      'Structured 4-week foundation programme (BDT 999, scholarship eligible) teaching prompt anatomy, role and few-shot prompting, iterative refinement, and output verification.',
    primaryKeyword: 'Generative AI and Prompt Engineering course',
    secondaryKeywords: [
      'Prompt engineering foundation course Bangladesh',
      'Generative AI training BDT 999',
      'Zero-shot few-shot role prompting',
      'Large Language Models beginner course',
      'Atlas AI Education AL-101',
    ],
    semanticTopics: [
      'Generative Artificial Intelligence',
      'Large Language Models',
      'Prompt Engineering',
      'Zero-shot and Few-shot Prompting',
      'Structured Output Design',
      'Multimodal Prompting',
    ],
    searchIntent: 'educational-course-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'AL-102': {
    seoTitle: 'AI for Everyday & Professional Productivity (AL-102) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 999) foundation course on AI for daily and workplace productivity: emails, reports, meeting notes, presentation outlines, data summaries, and routines.',
    ogTitle: 'AI for Everyday & Professional Productivity (AL-102) – Atlas AI Education',
    ogDescription:
      'Practical 4-week foundation training (BDT 999) helping students and professionals streamline emails, meeting summaries, structured documents, and daily workflows with AI.',
    primaryKeyword: 'AI for Everyday and Professional Productivity course',
    secondaryKeywords: [
      'AI productivity course Bangladesh',
      'AI for emails reports and meeting notes',
      'Workplace AI efficiency beginner course',
      'Personal AI productivity workflows',
      'Atlas AI Education AL-102',
    ],
    semanticTopics: [
      'AI Workplace Productivity',
      'Professional Communication with AI',
      'Document and Presentation Preparation',
      'Structured Data Summarisation',
      'Personal AI Productivity Workflows',
    ],
    searchIntent: 'educational-course-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'AL-103': {
    seoTitle: 'AI Safety, Ethics & Responsible Use (AL-103) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 999) AI Safety, Ethics & Responsible Use foundation course covering deepfakes, misinformation verification, privacy protection, bias, and academic integrity.',
    ogTitle: 'AI Safety, Ethics & Responsible Use (AL-103) – Atlas AI Education',
    ogDescription:
      '4-week foundation programme (BDT 999) teaching fact-checking AI hallucinations, deepfake awareness, confidential data hygiene, and ethical AI use for education and work.',
    primaryKeyword: 'AI Safety Ethics and Responsible Use course',
    secondaryKeywords: [
      'AI safety and ethics training Bangladesh',
      'Deepfake misinformation verification course',
      'AI privacy and data protection basics',
      'Responsible AI academic integrity',
      'Atlas AI Education AL-103',
    ],
    semanticTopics: [
      'AI Safety and Harm Awareness',
      'Misinformation and Deepfake Verification',
      'Personal Data Protection with AI',
      'Algorithmic Fairness and Copyright',
      'Human Oversight and Hallucination Detection',
    ],
    searchIntent: 'educational-course-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'AL-104': {
    seoTitle: 'AI Tools Literacy & Prompt Engineering (AL-104) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 1,499) AI Tools Literacy & Prompt Engineering course teaching cross-platform tool evaluation, prompt adaptation, source verification, and personal AI toolkits.',
    ogTitle: 'AI Tools Literacy & Prompt Engineering (AL-104) – Atlas AI Education',
    ogDescription:
      'Beginner-to-intermediate 4-week foundation course (BDT 1,499) focused on choosing the right AI platform, cross-tool prompting, hallucination checking, and building an AI toolkit.',
    primaryKeyword: 'AI Tools Literacy and Prompt Engineering course',
    secondaryKeywords: [
      'AI tools literacy training Bangladesh',
      'Comparing AI platforms and workflows',
      'Cross-platform prompt adaptation',
      'AI output accuracy and source verification',
      'Atlas AI Education AL-104',
    ],
    semanticTopics: [
      'AI Tools Ecosystem Classification',
      'Platform Selection and Evaluation',
      'Cross-Tool Prompt Adaptation',
      'AI Output Verification and Hallucination Detection',
      'Personal AI Toolkit Architecture',
    ],
    searchIntent: 'educational-course-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
};

function buildFallbackProfile(course: CourseItem): FoundationCourseSeoProfile {
  const numericFee = parseCourseFeeBdt(course);
  const feeText = course.isFree ? 'FREE (BDT 0)' : `BDT ${numericFee}`;
  return {
    seoTitle: `${course.title} (${course.code}) – Atlas AI Education`,
    metaDescription: `${course.duration} foundation course (${feeText}) by Atlas AI Education in AI Literacy & Foundation: ${course.keyAreas.slice(0, 3).join(', ')}.`,
    ogTitle: `${course.title} (${course.code}) – Atlas AI Education`,
    ogDescription: course.hook,
    primaryKeyword: `${course.title} course Atlas AI Education`,
    secondaryKeywords: [
      course.code,
      course.categoryName,
      ...course.keyAreas.slice(0, 4),
    ],
    semanticTopics: [...course.keyAreas],
    searchIntent: course.isFree
      ? 'informational-educational-free-enrolment'
      : 'educational-course-enrolment',
    workloadIso: course.duration.toLowerCase().includes('week') ? 'P4W' : 'PT2H30M',
    courseMode: 'online',
  };
}

export function parseCourseFeeBdt(course: CourseItem): number {
  if (course.isFree) return 0;
  const digits = course.fee.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
}

export function discoverFoundationCourses(): CourseItem[] {
  return COURSES.filter((course) => course.categorySlug === FOUNDATION_CATEGORY_SLUG);
}

export function isFoundationCourseCode(code: string): boolean {
  const upper = code.trim().toUpperCase();
  return discoverFoundationCourses().some((c) => c.code.toUpperCase() === upper);
}

export function buildOrganizationEntity(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return {
    '@type': 'EducationalOrganization',
    '@id': `${cleanBase}/#organization`,
    name: 'Atlas AI Education',
    url: `${cleanBase}/`,
    description:
      'Atlas AI Education is the structured educational initiative of Atlas AI Institute providing bilingual AI Literacy & Foundation, Applied AI, Professional Development, and Specialised Programmes.',
    parentOrganization: {
      '@type': 'Organization',
      '@id': `${cleanBase}/#parent-organization`,
      name: 'Atlas AI Institute',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    knowsAbout: [
      'Artificial Intelligence Education',
      'AI Literacy and Foundation',
      'AI Governance Fundamentals',
      'Generative AI and Prompt Engineering',
      'AI Safety and Responsible Use',
    ],
  };
}

export function buildWebsiteEntity(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return {
    '@type': 'WebSite',
    '@id': `${cleanBase}/#website`,
    name: 'Atlas AI Education',
    url: `${cleanBase}/`,
    inLanguage: ['bn', 'en'],
    publisher: {
      '@id': `${cleanBase}/#organization`,
    },
  };
}

export function buildFoundationCourseJsonLd(
  course: CourseItem,
  baseUrl: string,
  options?: {
    isFull?: boolean;
    lastOptimizedAt?: string;
    seoTitle?: string;
    metaDescription?: string;
  }
): Record<string, unknown> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const canonicalUrl = `${cleanBase}/programmes/${course.code}`;
  const profile = FOUNDATION_SEO_PROFILES[course.code] || buildFallbackProfile(course);
  const priceNumber = parseCourseFeeBdt(course);
  const imageUrl = course.imageUrl.startsWith('http')
    ? course.imageUrl
    : `${cleanBase}${course.imageUrl}`;

  const courseId = `${canonicalUrl}#course`;
  const webPageId = `${canonicalUrl}#webpage`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;

  const syllabusParts = course.modules.map((mod, idx) => ({
    '@type': 'Syllabus',
    position: idx + 1,
    name: `${mod.code}: ${mod.title}`,
    description: mod.topics.join('; '),
  }));

  const aboutTerms = Array.from(
    new Set([course.categoryName, 'Foundation', ...profile.semanticTopics])
  ).map((term) => ({
    '@type': 'DefinedTerm',
    name: term,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Atlas AI Education – AI Literacy & Foundation Curriculum',
    },
  }));

  const teachesItems = Array.from(
    new Set([...(course.learningOutcomes || []), ...(course.practicalSkills || [])])
  );

  const courseEntity: Record<string, unknown> = {
    '@type': 'Course',
    '@id': courseId,
    name: course.title,
    alternateName: `${course.code}: ${course.title}`,
    courseCode: course.code,
    description: `${course.overview} ${course.hook}`,
    url: canonicalUrl,
    mainEntityOfPage: { '@id': webPageId },
    image: imageUrl,
    inLanguage: ['bn', 'en'],
    educationalLevel: course.level || 'Beginner',
    coursePrerequisites: course.prerequisites,
    isAccessibleForFree: course.isFree,
    provider: { '@id': `${cleanBase}/#organization` },
    about: aboutTerms,
    teaches: teachesItems,
    keywords: [profile.primaryKeyword, ...profile.secondaryKeywords].join(', '),
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: (course.whoThisCourseIsFor || []).join('; '),
    },
    offers: {
      '@type': 'Offer',
      price: String(priceNumber),
      priceCurrency: 'BDT',
      category: course.isFree
        ? 'Free Educational Programme'
        : 'Foundation Course Fee (Non-Accredited Programme)',
      availability: options?.isFull
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
      url: canonicalUrl,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: profile.courseMode,
      courseWorkload: profile.workloadIso,
      inLanguage: ['bn', 'en'],
    },
    hasPart: syllabusParts,
    isPartOf: {
      '@type': 'CollectionPage',
      '@id': `${cleanBase}/programmes#webpage`,
      name: 'Explore Our Programmes – Atlas AI Education',
      url: `${cleanBase}/programmes`,
    },
  };

  const webPageEntity: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': webPageId,
    url: canonicalUrl,
    name: options?.seoTitle || profile.seoTitle,
    description: options?.metaDescription || profile.metaDescription,
    inLanguage: ['bn', 'en'],
    isPartOf: { '@id': `${cleanBase}/#website` },
    about: { '@id': courseId },
    mainEntity: { '@id': courseId },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: imageUrl,
      caption: course.imageAlt,
    },
    breadcrumb: { '@id': breadcrumbId },
    ...(options?.lastOptimizedAt ? { dateModified: options.lastOptimizedAt } : {}),
  };

  const breadcrumbEntity: Record<string, unknown> = {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${cleanBase}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Programmes',
        item: `${cleanBase}/programmes`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: course.categoryName,
        item: `${cleanBase}/programmes#ai-literacy`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `${course.code}: ${course.title}`,
        item: canonicalUrl,
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      webPageEntity,
      breadcrumbEntity,
      courseEntity,
    ],
  };
}

export function buildFoundationCategoryListingJsonLd(
  baseUrl: string,
  options?: {
    canonicalPath?: string;
    pageTitle?: string;
    pageDescription?: string;
    publishedCourses?: CourseItem[];
  }
): Record<string, unknown> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const targetPath = options?.canonicalPath || '/programmes';
  const pageUrl = `${cleanBase}${targetPath}`;
  const courses = options?.publishedCourses || discoverFoundationCourses();

  const itemListElements = courses.map((course, index) => {
    const courseUrl = `${cleanBase}/programmes/${course.code}`;
    const priceNumber = parseCourseFeeBdt(course);
    return {
      '@type': 'ListItem',
      position: index + 1,
      url: courseUrl,
      item: {
        '@type': 'Course',
        '@id': `${courseUrl}#course`,
        name: course.title,
        courseCode: course.code,
        description: course.hook,
        url: courseUrl,
        educationalLevel: course.level || 'Beginner',
        inLanguage: ['bn', 'en'],
        isAccessibleForFree: course.isFree,
        provider: { '@id': `${cleanBase}/#organization` },
        offers: {
          '@type': 'Offer',
          price: String(priceNumber),
          priceCurrency: 'BDT',
          url: courseUrl,
        },
      },
    };
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name:
          options?.pageTitle ||
          'AI Literacy & Foundation Programmes – Atlas AI Education',
        description:
          options?.pageDescription ||
          'Explore all Foundation courses in AI Literacy & Foundation at Atlas AI Education.',
        inLanguage: ['bn', 'en'],
        isPartOf: { '@id': `${cleanBase}/#website` },
        about: {
          '@type': 'DefinedTerm',
          name: 'AI Literacy & Foundation',
        },
        mainEntity: { '@id': `${pageUrl}#foundation-itemlist` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${cleanBase}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Programmes',
            item: `${cleanBase}/programmes`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#foundation-itemlist`,
        name: 'AI Literacy & Foundation Courses (Atlas AI Education)',
        numberOfItems: itemListElements.length,
        itemListElement: itemListElements,
      },
    ],
  };
}

export function buildFreeMasterclassJsonLd(baseUrl: string): Record<string, unknown> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const freeCourse = COURSES.find((c) => c.code === 'FREE');
  const pageUrl = `${cleanBase}/free-masterclass`;
  const canonicalCourseUrl = `${cleanBase}/programmes/FREE`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'Free Masterclass Registration – Atlas AI Education',
        description:
          'Monthly FREE open introductory live online session (2–2.5 hours, BDT 0) on AI Fundamentals & Digital Literacy by Atlas AI Education.',
        inLanguage: ['bn', 'en'],
        isPartOf: { '@id': `${cleanBase}/#website` },
        mainEntity: { '@id': `${canonicalCourseUrl}#course` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${cleanBase}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Free Masterclass',
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'Course',
        '@id': `${canonicalCourseUrl}#course`,
        name: freeCourse?.title || 'AI Fundamentals & Digital Literacy',
        courseCode: 'FREE',
        description:
          freeCourse?.overview ||
          'Monthly open introductory AI literacy and digital awareness session by Atlas AI Education.',
        url: canonicalCourseUrl,
        inLanguage: ['bn', 'en'],
        educationalLevel: 'Beginner',
        isAccessibleForFree: true,
        provider: { '@id': `${cleanBase}/#organization` },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BDT',
          category: 'Free Monthly Open Session',
          url: pageUrl,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: 'PT2H30M',
          inLanguage: ['bn', 'en'],
        },
      },
    ],
  };
}

export function buildFoundationCourseSeoRecord(
  course: CourseItem,
  baseUrl = '',
  options?: {
    isPublished?: boolean;
    indexStatus?: 'indexed' | 'noindex';
    isFull?: boolean;
    lastOptimizedAt?: string;
  }
): CourseSeoRecord {
  const profile = FOUNDATION_SEO_PROFILES[course.code] || buildFallbackProfile(course);
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const canonicalPath = `/programmes/${course.code}`;
  const canonicalUrl = cleanBase ? `${cleanBase}${canonicalPath}` : canonicalPath;
  const isPublished = options?.isPublished ?? true;
  const indexStatus: 'indexed' | 'noindex' = !isPublished
    ? 'noindex'
    : options?.indexStatus || 'indexed';
  const lastOptimizedAt = options?.lastOptimizedAt || new Date().toISOString();

  return {
    courseCode: course.code,
    slug: course.slug,
    canonicalPath,
    seoTitle: profile.seoTitle,
    metaDescription: profile.metaDescription,
    ogTitle: profile.ogTitle,
    ogDescription: profile.ogDescription,
    ogImage: course.imageUrl,
    ogImageAlt: course.imageAlt,
    primaryKeyword: profile.primaryKeyword,
    secondaryKeywords: profile.secondaryKeywords,
    semanticTopics: profile.semanticTopics,
    searchIntent: profile.searchIntent,
    intendedAudience: course.whoThisCourseIsFor || [],
    learningLevel: course.level || 'Beginner',
    indexStatus,
    isPublished,
    lastOptimizedAt,
    courseSchema: buildFoundationCourseJsonLd(course, cleanBase || 'https://atlasaieducation.org', {
      isFull: options?.isFull,
      lastOptimizedAt,
      seoTitle: profile.seoTitle,
      metaDescription: profile.metaDescription,
    }),
  };
}

export function getAllFoundationSeoRecords(baseUrl = ''): CourseSeoRecord[] {
  return discoverFoundationCourses().map((course) =>
    buildFoundationCourseSeoRecord(course, baseUrl)
  );
}
