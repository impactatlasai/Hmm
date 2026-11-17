import { COURSES, CourseItem } from '../data/coursesData';
import {
  CourseSeoRecord,
  buildOrganizationEntity,
  buildWebsiteEntity,
  parseCourseFeeBdt,
} from './foundationSeo';

export const APPLIED_AI_CATEGORY_SLUG = 'applied-ai';

interface AppliedAiCourseSeoProfile {
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
 * course specifications from coursesData.ts. Any newly added Applied AI (applied-ai)
 * course automatically receives a dynamically generated profile via buildFallbackProfile().
 */
const APPLIED_AI_SEO_PROFILES: Record<string, AppliedAiCourseSeoProfile> = {
  'AP-201': {
    seoTitle: 'AI-Powered Content Creation (AP-201) – Atlas AI Education',
    metaDescription:
      '4-week (8 live classes, BDT 1,200) AI-Powered Content Creation course by Atlas AI Education covering editorial planning, copywriting with brand voice, visuals, scripts, and copyright hygiene.',
    ogTitle: 'AI-Powered Content Creation (AP-201 · Applied AI) – Atlas AI Education',
    ogDescription:
      'Practical 4-week Applied AI course (BDT 1,200, scholarship eligible) teaching content calendars, bilingual copywriting, slide and visual prompts, video scripts, and multi-format campaign workflows.',
    primaryKeyword: 'AI-Powered Content Creation course Bangladesh',
    secondaryKeywords: [
      'Applied AI content creation training BDT 1200',
      'AI copywriting and editorial calendar course',
      'AI video script and visual asset prompts',
      'Responsible AI content publishing and copyright',
      'Atlas AI Education AP-201',
    ],
    semanticTopics: [
      'Editorial Planning and Audience Mapping',
      'Brand Voice Copywriting with AI',
      'Visual Asset and Slide Prompting',
      'Video Scriptwriting Workflows',
      'Copyright Hygiene and Disclosure',
      'Multi-Format Campaign Content Pack',
    ],
    searchIntent: 'educational-applied-course-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'AP-202': {
    seoTitle: 'AI for Business & Entrepreneurship (AP-202) – Atlas AI Education',
    metaDescription:
      '4-week (8 live classes, BDT 1,200) AI for Business & Entrepreneurship course by Atlas AI Education covering market discovery, Lean Canvas, customer support SOPs, and small-business operations.',
    ogTitle: 'AI for Business & Entrepreneurship (AP-202 · Applied AI) – Atlas AI Education',
    ogDescription:
      'Hands-on 4-week Applied AI course (BDT 1,200, scholarship eligible) for entrepreneurs and SMEs: competitor mapping, value messaging, customer FAQ libraries, SOP checklists, and data privacy.',
    primaryKeyword: 'AI for Business and Entrepreneurship course Bangladesh',
    secondaryKeywords: [
      'AI for small business and startups Bangladesh',
      'AI market validation and Lean Canvas course',
      'Customer support FAQ and operations SOP with AI',
      'Applied AI business course BDT 1200',
      'Atlas AI Education AP-202',
    ],
    semanticTopics: [
      'AI-Assisted Market Discovery',
      'Lean Canvas and Value Proposition Design',
      'Product Positioning and Pitch Outlines',
      'Customer Support SOP and FAQ Libraries',
      'Small-Team Operational Checklists',
      'Customer Data Privacy and Tool ROI',
    ],
    searchIntent: 'educational-applied-course-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'AP-203': {
    seoTitle: 'AI Automation & Workflow Design (AP-203) – Atlas AI Education',
    metaDescription:
      '4-week (8 live classes, BDT 1,200) AI Automation & Workflow Design course by Atlas AI Education covering no-code triggers, webhooks, JSON basics, structured AI steps, and human-in-the-loop controls.',
    ogTitle: 'AI Automation & Workflow Design (AP-203 · Applied AI) – Atlas AI Education',
    ogDescription:
      'Practical 4-week Applied AI programme (BDT 1,200, scholarship eligible) on mapping repetitive tasks into no-code workflows connecting forms, sheets, webhooks, structured AI prompts, and human review.',
    primaryKeyword: 'AI Automation and Workflow Design course Bangladesh',
    secondaryKeywords: [
      'No-code AI workflow automation training',
      'Webhooks JSON and structured AI outputs course',
      'Human-in-the-loop AI workflow design',
      'Applied AI automation course BDT 1200',
      'Atlas AI Education AP-203',
    ],
    semanticTopics: [
      'Process Mapping and Automation Readiness',
      'No-Code Triggers Actions and Webhooks',
      'Structured JSON Payloads and AI Prompts',
      'Inquiry Classification and Summarisation',
      'Human-in-the-Loop Approval Checkpoints',
      'Workflow Error Handling and Data Hygiene',
    ],
    searchIntent: 'educational-applied-course-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'AP-204': {
    seoTitle: 'AI-Powered Website Development (AP-204) – Atlas AI Education',
    metaDescription:
      '4-week (8 live classes, BDT 1,200) AI-Powered Website Development course by Atlas AI Education covering HTML/CSS layout, AI UI prompting, debugging, accessibility, SEO basics, and live static deployment.',
    ogTitle: 'AI-Powered Website Development (AP-204 · Applied AI) – Atlas AI Education',
    ogDescription:
      'Hands-on 4-week Applied AI course (BDT 1,200, scholarship eligible) teaching how to plan, prompt AI coding assistants for responsive components, verify accessibility and SEO metadata, and deploy live sites.',
    primaryKeyword: 'AI-Powered Website Development course Bangladesh',
    secondaryKeywords: [
      'AI-assisted coding website development course',
      'Responsive HTML CSS with AI coding tools',
      'Website debugging accessibility and SEO basics',
      'Applied AI web development BDT 1200',
      'Atlas AI Education AP-204',
    ],
    semanticTopics: [
      'Web Fundamentals and Information Architecture',
      'Prompting AI for Front-End Components',
      'Responsive Flexbox and Grid Layout',
      'Browser Debugging and Accessibility Checks',
      'On-Page SEO Metadata and Open Graph',
      'Static Website Deployment and Maintenance',
    ],
    searchIntent: 'educational-applied-course-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
};

function buildFallbackProfile(course: CourseItem): AppliedAiCourseSeoProfile {
  const numericFee = parseCourseFeeBdt(course);
  const feeText = course.isFree ? 'FREE (BDT 0)' : `BDT ${numericFee}`;
  return {
    seoTitle: `${course.title} (${course.code}) – Atlas AI Education`,
    metaDescription: `${course.duration} Applied AI course (${feeText}) by Atlas AI Education: ${course.keyAreas.slice(0, 3).join(', ')}.`,
    ogTitle: `${course.title} (${course.code} · Applied AI) – Atlas AI Education`,
    ogDescription: course.hook,
    primaryKeyword: `${course.title} course Atlas AI Education`,
    secondaryKeywords: [
      course.code,
      course.categoryName,
      ...course.keyAreas.slice(0, 4),
    ],
    semanticTopics: [...course.keyAreas],
    searchIntent: 'educational-applied-course-enrolment',
    workloadIso: course.duration.toLowerCase().includes('week') ? 'P4W' : 'PT2H30M',
    courseMode: 'online',
  };
}

export function discoverAppliedAiCourses(): CourseItem[] {
  return COURSES.filter((course) => course.categorySlug === APPLIED_AI_CATEGORY_SLUG);
}

export function isAppliedAiCourseCode(code: string): boolean {
  const upper = code.trim().toUpperCase();
  return discoverAppliedAiCourses().some((c) => c.code.toUpperCase() === upper);
}

export function buildAppliedAiCourseJsonLd(
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
  const profile = APPLIED_AI_SEO_PROFILES[course.code] || buildFallbackProfile(course);
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
    new Set([course.categoryName, 'Applied AI', ...profile.semanticTopics])
  ).map((term) => ({
    '@type': 'DefinedTerm',
    name: term,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Atlas AI Education – Applied AI Curriculum',
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
    educationalLevel: course.level || 'Intermediate',
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
        : 'Applied AI Course Fee (Non-Accredited Programme)',
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
    ...(course.practicalProject
      ? {
          workExample: {
            '@type': 'CreativeWork',
            name: course.practicalProject.title,
            description: course.practicalProject.prompt,
            learningResourceType: course.practicalProject.projectLabel || 'Applied Project',
          },
        }
      : {}),
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
        item: `${cleanBase}/programmes#applied-ai`,
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

export function buildAppliedAiItemListEntity(
  baseUrl: string,
  options?: {
    canonicalPath?: string;
    publishedCourses?: CourseItem[];
  }
): Record<string, unknown> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const targetPath = options?.canonicalPath || '/programmes';
  const pageUrl = `${cleanBase}${targetPath}`;
  const courses = options?.publishedCourses || discoverAppliedAiCourses();

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
        educationalLevel: course.level || 'Intermediate',
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
    '@type': 'ItemList',
    '@id': `${pageUrl}#applied-ai-itemlist`,
    name: 'Applied AI Courses (Atlas AI Education)',
    numberOfItems: itemListElements.length,
    itemListElement: itemListElements,
  };
}

export function buildAppliedAiCategoryListingJsonLd(
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
  const itemList = buildAppliedAiItemListEntity(cleanBase, {
    canonicalPath: targetPath,
    publishedCourses: options?.publishedCourses,
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
        name: options?.pageTitle || 'Applied AI Programmes – Atlas AI Education',
        description:
          options?.pageDescription ||
          'Explore practical Applied AI courses at Atlas AI Education covering Content Creation, Business & Entrepreneurship, Automation & Workflow Design, and Website Development (BDT 1,200).',
        inLanguage: ['bn', 'en'],
        isPartOf: { '@id': `${cleanBase}/#website` },
        about: {
          '@type': 'DefinedTerm',
          name: 'Applied AI',
        },
        mainEntity: { '@id': `${pageUrl}#applied-ai-itemlist` },
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
      itemList,
    ],
  };
}

export function buildAppliedAiCourseSeoRecord(
  course: CourseItem,
  baseUrl = '',
  options?: {
    isPublished?: boolean;
    indexStatus?: 'indexed' | 'noindex';
    isFull?: boolean;
    lastOptimizedAt?: string;
  }
): CourseSeoRecord {
  const profile = APPLIED_AI_SEO_PROFILES[course.code] || buildFallbackProfile(course);
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const canonicalPath = `/programmes/${course.code}`;
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
    learningLevel: course.level || 'Intermediate',
    indexStatus,
    isPublished,
    lastOptimizedAt,
    courseSchema: buildAppliedAiCourseJsonLd(course, cleanBase || 'https://atlasaieducation.org', {
      isFull: options?.isFull,
      lastOptimizedAt,
      seoTitle: profile.seoTitle,
      metaDescription: profile.metaDescription,
    }),
  };
}

export function getAllAppliedAiSeoRecords(baseUrl = ''): CourseSeoRecord[] {
  return discoverAppliedAiCourses().map((course) =>
    buildAppliedAiCourseSeoRecord(course, baseUrl)
  );
}
