import { COURSES, CourseItem } from '../data/coursesData';
import {
  CourseSeoRecord,
  buildOrganizationEntity,
  buildWebsiteEntity,
  parseCourseFeeBdt,
} from './foundationSeo';

export const PROFESSIONAL_DEV_CATEGORY_SLUG = 'professional-development';

interface ProfessionalDevCourseSeoProfile {
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
 * course specifications from coursesData.ts. Any newly added Professional Development course
 * automatically receives a dynamically generated profile via buildFallbackProfile().
 */
const PROFESSIONAL_DEV_SEO_PROFILES: Record<string, ProfessionalDevCourseSeoProfile> = {
  'PD-301': {
    seoTitle: 'AI for Professionals & Workplace Productivity (PD-301) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 2,500) AI for Professionals & Workplace Productivity course covering executive documentation, desk research verification, spreadsheets, and responsible AI at work.',
    ogTitle: 'AI for Professionals & Workplace Productivity (PD-301) – Atlas AI Education',
    ogDescription:
      'Structured 4-week professional track (BDT 2,500, scholarship eligible) teaching workplace prompting, briefing notes, meeting minutes, research synthesis, spreadsheet reporting, and AI oversight.',
    primaryKeyword: 'AI for Professionals and Workplace Productivity course',
    secondaryKeywords: [
      'AI workplace productivity training Bangladesh',
      'AI for corporate and NGO professionals',
      'Executive documentation and meeting notes AI',
      'Spreadsheet reporting and desk research with AI',
      'Atlas AI Education PD-301',
    ],
    semanticTopics: [
      'Workplace Prompt Engineering',
      'Executive Communication and Briefing Notes',
      'AI-Assisted Desk Research and Fact-Checking',
      'Spreadsheet Operations and Management Reporting',
      'Personal Productivity Workflows',
      'Confidentiality and Human Oversight at Work',
    ],
    searchIntent: 'professional-skill-development-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'PD-302': {
    seoTitle: 'AI for Business Development (PD-302) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 2,500) AI for Business Development course covering market intelligence, competitor research, customer personas, lead qualification, proposals, and partnership strategy.',
    ogTitle: 'AI for Business Development (PD-302 · Professional Track) – Atlas AI Education',
    ogDescription:
      '4-week professional programme (BDT 2,500, scholarship eligible) on using AI for sector research, buyer personas, sales pipeline planning, partnership proposals, and verified business intelligence.',
    primaryKeyword: 'AI for Business Development course Bangladesh',
    secondaryKeywords: [
      'AI market intelligence and competitor analysis',
      'AI lead qualification and sales proposals',
      'B2B partnership mapping with AI',
      'SWOT analysis and business growth strategy AI',
      'Atlas AI Education PD-302',
    ],
    semanticTopics: [
      'Market Intelligence and Sector Research',
      'Customer Personas and Journey Mapping',
      'Sales Strategy and Lead Qualification',
      'Partnership Opportunity Mapping and Proposals',
      'SWOT and Business Growth Analysis',
      'Ethical Commercial Intelligence Verification',
    ],
    searchIntent: 'professional-skill-development-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'PD-303': {
    seoTitle: 'AI Leadership & Strategic Management (PD-303) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 2,500) AI Leadership & Strategic Management course for managers and executives covering AI readiness, SWOT/PESTLE decision support, change management, and governance.',
    ogTitle: 'AI Leadership & Strategic Management (PD-303) – Atlas AI Education',
    ogDescription:
      'Intermediate-to-advanced 4-week executive track (BDT 2,500) on organisational AI readiness, workforce reskilling, governance structures, risk accountability, and phased AI roadmaps.',
    primaryKeyword: 'AI Leadership and Strategic Management course',
    secondaryKeywords: [
      'AI leadership training for managers Bangladesh',
      'Organisational AI readiness assessment course',
      'AI governance risk and change management',
      'Strategic AI roadmap and executive briefing',
      'Atlas AI Education PD-303',
    ],
    semanticTopics: [
      'Organisational AI Readiness Assessment',
      'AI-Assisted SWOT PESTLE and Scenario Analysis',
      'Workforce Transformation and Change Management',
      'Organisational AI Governance and Risk',
      'AI Investment and Use Case Prioritisation',
      'Executive AI Strategy Blueprint',
    ],
    searchIntent: 'executive-leadership-course-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'PD-304': {
    seoTitle: 'AI for Project Management (PD-304) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 2,500) AI for Project Management course covering project charters, WBS, scheduling, budget narratives, risk registers, M&E indicators, and stakeholder reporting.',
    ogTitle: 'AI for Project Management (PD-304 · Professional Track) – Atlas AI Education',
    ogDescription:
      '4-week applied professional track (BDT 2,500) integrating AI across project planning, Work Breakdown Structures, resource timelines, risk registers, monitoring indicators, and stakeholder updates.',
    primaryKeyword: 'AI for Project Management course Bangladesh',
    secondaryKeywords: [
      'AI Work Breakdown Structure WBS and charter',
      'AI project scheduling and risk register',
      'Monitoring evaluation and NGO reporting with AI',
      'Project manager AI workflow training',
      'Atlas AI Education PD-304',
    ],
    semanticTopics: [
      'Project Charters Scopes and Work Breakdown Structure',
      'Activity Scheduling and Resource Planning',
      'Project Budget Narratives and Cost Assumptions',
      'Project Risk Registers and Scenario Mitigation',
      'Monitoring Evaluation and M&E Indicators',
      'Stakeholder Status Reporting and Confidentiality',
    ],
    searchIntent: 'professional-skill-development-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'PD-305': {
    seoTitle: 'AI for Marketing & Growth Strategy (PD-305) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 2,500) AI for Marketing & Growth Strategy course covering audience segmentation, brand positioning, 30-day content calendars, campaign workflows, and KPI analysis.',
    ogTitle: 'AI for Marketing & Growth Strategy (PD-305) – Atlas AI Education',
    ogDescription:
      '4-week professional marketing track (BDT 2,500, scholarship eligible) connecting audience insights, brand messaging, campaign planning, marketing KPIs, and copyright-safe AI usage.',
    primaryKeyword: 'AI for Marketing and Growth Strategy course',
    secondaryKeywords: [
      'AI digital marketing strategy Bangladesh',
      'Audience segmentation and brand positioning AI',
      '30-day AI marketing content calendar',
      'Marketing KPI analytics and campaign workflows',
      'Atlas AI Education PD-305',
    ],
    semanticTopics: [
      'Audience Segmentation and Buyer Personas',
      'Brand Positioning and Messaging Frameworks',
      'Digital Content Pillars and 30-Day Calendars',
      'Campaign Workflow and Customer Journey Design',
      'Marketing KPIs and Performance Reporting',
      'Brand Safety Copyright and Truthful Claims',
    ],
    searchIntent: 'professional-skill-development-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'PD-306': {
    seoTitle: 'AI for Human Resource Management (PD-306) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 2,500) AI for Human Resource Management course covering workforce planning, job design, recruitment workflows, L&D pathways, engagement analysis, and bias prevention.',
    ogTitle: 'AI for Human Resource Management (PD-306) – Atlas AI Education',
    ogDescription:
      'Ethical 4-week HR professional track (BDT 2,500) on competency mapping, structured interview guides, personalised L&D, onboarding workflows, and algorithmic fairness in people decisions.',
    primaryKeyword: 'AI for Human Resource Management course',
    secondaryKeywords: [
      'AI in HR workforce planning Bangladesh',
      'Ethical AI recruitment and interview design',
      'Competency mapping and employee L&D with AI',
      'Algorithmic bias and employee privacy in HR',
      'Atlas AI Education PD-306',
    ],
    semanticTopics: [
      'Workforce Planning and Competency Mapping',
      'Structured and Bias-Aware Recruitment Support',
      'Employee Learning and Development Pathways',
      'Performance Documentation and Engagement Surveys',
      'HR Operations and Onboarding Workflows',
      'Algorithmic Fairness Privacy and Human Oversight',
    ],
    searchIntent: 'professional-skill-development-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
  'PD-307': {
    seoTitle: 'AI for Financial Management (PD-307) – Atlas AI Education',
    metaDescription:
      '4-week (8 classes, BDT 2,500) AI for Financial Management course covering budgeting templates, spreadsheet intelligence, budget-vs-actual reporting, financial data security, and auditability.',
    ogTitle: 'AI for Financial Management (PD-307 · Professional Track) – Atlas AI Education',
    ogDescription:
      '4-week finance workflow track (BDT 2,500, scholarship eligible) teaching budget narratives, expense categorisation, formula validation, cash-flow summaries, and strict financial privacy controls.',
    primaryKeyword: 'AI for Financial Management course Bangladesh',
    secondaryKeywords: [
      'AI for budgeting and financial reporting',
      'Spreadsheet intelligence and formula validation AI',
      'Budget versus actual reporting with AI',
      'Financial data privacy and auditability AI',
      'Atlas AI Education PD-307',
    ],
    semanticTopics: [
      'Budgeting Templates and Expense Categorisation',
      'Spreadsheet Data Cleaning and Formula Validation',
      'Budget-vs-Actual and Management Reporting',
      'Revenue Expense and Cash-Flow Trend Analysis',
      'Financial Operations and Approval Workflows',
      'Confidential Financial Data Security and Auditability',
    ],
    searchIntent: 'professional-skill-development-enrolment',
    workloadIso: 'P4W',
    courseMode: 'online',
  },
};

function buildFallbackProfile(course: CourseItem): ProfessionalDevCourseSeoProfile {
  const numericFee = parseCourseFeeBdt(course);
  const feeText = course.isFree ? 'FREE (BDT 0)' : `BDT ${numericFee}`;
  return {
    seoTitle: `${course.title} (${course.code}) – Atlas AI Education`,
    metaDescription: `${course.duration} Professional Development course (${feeText}) by Atlas AI Education: ${course.keyAreas.slice(0, 3).join(', ')}.`,
    ogTitle: `${course.title} (${course.code} · Professional Development) – Atlas AI Education`,
    ogDescription: course.hook,
    primaryKeyword: `${course.title} course Atlas AI Education`,
    secondaryKeywords: [
      course.code,
      course.categoryName,
      ...course.keyAreas.slice(0, 4),
    ],
    semanticTopics: [...course.keyAreas],
    searchIntent: 'professional-skill-development-enrolment',
    workloadIso: course.duration.toLowerCase().includes('week') ? 'P4W' : 'PT2H30M',
    courseMode: 'online',
  };
}

export function discoverProfessionalDevCourses(): CourseItem[] {
  return COURSES.filter((course) => course.categorySlug === PROFESSIONAL_DEV_CATEGORY_SLUG);
}

export function isProfessionalDevCourseCode(code: string): boolean {
  const upper = code.trim().toUpperCase();
  return discoverProfessionalDevCourses().some((c) => c.code.toUpperCase() === upper);
}

export function buildProfessionalDevCourseJsonLd(
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
  const profile = PROFESSIONAL_DEV_SEO_PROFILES[course.code] || buildFallbackProfile(course);
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
    new Set([course.categoryName, 'Professional Development', ...profile.semanticTopics])
  ).map((term) => ({
    '@type': 'DefinedTerm',
    name: term,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Atlas AI Education – Professional Development Curriculum',
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
      educationalRole: 'professional',
      audienceType: (course.whoThisCourseIsFor || []).join('; '),
    },
    offers: {
      '@type': 'Offer',
      price: String(priceNumber),
      priceCurrency: 'BDT',
      category: course.isFree
        ? 'Free Educational Programme'
        : 'Professional Development Course Fee (Non-Accredited Programme)',
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
            learningResourceType: course.practicalProject.projectLabel || 'Capstone Project',
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
        item: `${cleanBase}/programmes#professional-development`,
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

export function buildProfessionalDevItemListEntity(
  baseUrl: string,
  options?: {
    canonicalPath?: string;
    publishedCourses?: CourseItem[];
  }
): Record<string, unknown> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const targetPath = options?.canonicalPath || '/programmes';
  const pageUrl = `${cleanBase}${targetPath}`;
  const courses = options?.publishedCourses || discoverProfessionalDevCourses();

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
    '@id': `${pageUrl}#professional-development-itemlist`,
    name: 'Professional Development Courses (Atlas AI Education)',
    numberOfItems: itemListElements.length,
    itemListElement: itemListElements,
  };
}

export function buildProfessionalDevCategoryListingJsonLd(
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
  const itemList = buildProfessionalDevItemListEntity(cleanBase, {
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
        name: options?.pageTitle || 'Professional Development Programmes – Atlas AI Education',
        description:
          options?.pageDescription ||
          'Explore 7 structured 4-week Professional Development AI courses at Atlas AI Education covering Workplace Productivity, Business Development, Leadership, Project Management, Marketing, HR, and Financial Management (BDT 2,500).',
        inLanguage: ['bn', 'en'],
        isPartOf: { '@id': `${cleanBase}/#website` },
        about: {
          '@type': 'DefinedTerm',
          name: 'Professional Development',
        },
        mainEntity: { '@id': `${pageUrl}#professional-development-itemlist` },
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

export function buildProfessionalDevCourseSeoRecord(
  course: CourseItem,
  baseUrl = '',
  options?: {
    isPublished?: boolean;
    indexStatus?: 'indexed' | 'noindex';
    isFull?: boolean;
    lastOptimizedAt?: string;
  }
): CourseSeoRecord {
  const profile = PROFESSIONAL_DEV_SEO_PROFILES[course.code] || buildFallbackProfile(course);
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
    courseSchema: buildProfessionalDevCourseJsonLd(course, cleanBase || 'https://atlasaieducation.org', {
      isFull: options?.isFull,
      lastOptimizedAt,
      seoTitle: profile.seoTitle,
      metaDescription: profile.metaDescription,
    }),
  };
}

export function getAllProfessionalDevSeoRecords(baseUrl = ''): CourseSeoRecord[] {
  return discoverProfessionalDevCourses().map((course) =>
    buildProfessionalDevCourseSeoRecord(course, baseUrl)
  );
}
