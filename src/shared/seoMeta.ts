import { COURSES } from '../data/coursesData';
import {
  buildFoundationCategoryListingJsonLd,
  buildFoundationCourseJsonLd,
  buildFoundationCourseSeoRecord,
  buildFreeMasterclassJsonLd,
  discoverFoundationCourses,
} from './foundationSeo';
import {
  buildAppliedAiCategoryListingJsonLd,
  buildAppliedAiCourseJsonLd,
  buildAppliedAiCourseSeoRecord,
  buildAppliedAiItemListEntity,
  discoverAppliedAiCourses,
} from './appliedAiSeo';
import {
  buildProfessionalDevCategoryListingJsonLd,
  buildProfessionalDevCourseJsonLd,
  buildProfessionalDevCourseSeoRecord,
  buildProfessionalDevItemListEntity,
  discoverProfessionalDevCourses,
} from './professionalDevSeo';
import { INSTITUTIONAL_SERVICES } from '../data/institutionalServicesData';
import {
  buildAboutJsonLd,
  buildAllSitePageSeoRecords,
  buildContactJsonLd,
  buildFaqJsonLd,
  buildHomeJsonLd,
  buildInstitutionalServiceJsonLd,
  buildLegalOrDirectoryJsonLd,
  buildResourcesJsonLd,
  buildScholarshipsJsonLd,
  buildSpecialisedCategoryListingJsonLd,
  buildSpecialisedItemListEntity,
  buildToolsJsonLd,
  buildVerifyCertificateJsonLd,
  buildWomensSafetyCourseSeoRecord,
  buildWomensSafetyJsonLd,
  discoverSpecialisedCourse,
  getPageSeoRecordByPath,
} from './siteWideSeo';

export interface RouteSeoEntry {
  path: string;
  canonicalPath?: string;
  excludeFromSitemap?: boolean;
  noindex?: boolean;
  title: string;
  description: string;
  ogType?: 'website' | 'article';
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  keywords?: string[];
  foundationCourseCode?: string;
  appliedAiCourseCode?: string;
  professionalDevCourseCode?: string;
  specialisedCourseCode?: string;
  institutionalServiceSlug?: string;
  pageSeoRoute?: string;
  authoritativeHead?: boolean;
  jsonLd?: Record<string, unknown>;
  jsonLdBuilder?: (baseUrl: string) => Record<string, unknown>;
}

const SITE_PAGE_REC_MAP = new Map(
  buildAllSitePageSeoRecords('').map((r) => [r.routePath, r])
);
const pageRec = (routePath: string) => SITE_PAGE_REC_MAP.get(routePath)!;
const WSAI_REC = buildWomensSafetyCourseSeoRecord(discoverSpecialisedCourse());

export const ROUTE_SEO_ENTRIES: RouteSeoEntry[] = [
  {
    path: '/',
    pageSeoRoute: '/',
    authoritativeHead: true,
    title: pageRec('/').seoTitle,
    description: pageRec('/').metaDescription,
    ogType: 'website',
    ogTitle: pageRec('/').ogTitle,
    ogDescription: pageRec('/').ogDescription,
    ogImage: pageRec('/').ogImage,
    ogImageAlt: pageRec('/').ogImageAlt,
    keywords: [pageRec('/').primaryKeyword, ...pageRec('/').secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildHomeJsonLd(baseUrl),
  },
  {
    path: '/about',
    pageSeoRoute: '/about',
    authoritativeHead: true,
    title: pageRec('/about').seoTitle,
    description: pageRec('/about').metaDescription,
    ogType: 'article',
    ogTitle: pageRec('/about').ogTitle,
    ogDescription: pageRec('/about').ogDescription,
    ogImage: pageRec('/about').ogImage,
    ogImageAlt: pageRec('/about').ogImageAlt,
    keywords: [pageRec('/about').primaryKeyword, ...pageRec('/about').secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildAboutJsonLd(baseUrl),
  },
  {
    path: '/programmes',
    pageSeoRoute: '/programmes',
    authoritativeHead: true,
    title: 'Explore Our Programmes – Atlas AI Education',
    description:
      'Build AI knowledge, practical skills and professional capabilities through 18 structured learning programmes across AI Literacy & Foundation, Applied AI, Professional Development, and Specialised Programmes.',
    ogType: 'website',
    ogImage: '/src/assets/images/programme_ai_literacy_1794867547641.jpg',
    ogImageAlt: 'Atlas AI Education Foundation, Applied AI, Professional & Specialised Programmes',
    keywords: [
      'Atlas AI Education programmes',
      'AI Literacy and Foundation courses Bangladesh',
      'Applied AI Bangladesh',
      'AI Professional Development',
      'Specialised AI Programmes and Institutional Services',
    ],
    jsonLdBuilder: (baseUrl) => {
      const schema = buildFoundationCategoryListingJsonLd(baseUrl, {
        canonicalPath: '/programmes',
        pageTitle: 'Explore Our Programmes – Atlas AI Education',
        pageDescription:
          'Structured AI learning programmes across AI Literacy & Foundation, Applied AI, Professional Development, and Specialised Programmes.',
      });
      const graph = Array.isArray(schema['@graph'])
        ? [
            ...(schema['@graph'] as Record<string, unknown>[]),
            buildAppliedAiItemListEntity(baseUrl, { canonicalPath: '/programmes' }),
            buildProfessionalDevItemListEntity(baseUrl, { canonicalPath: '/programmes' }),
            buildSpecialisedItemListEntity(baseUrl, { canonicalPath: '/programmes' }),
          ]
        : [];
      return { ...schema, '@graph': graph };
    },
  },
  {
    path: '/free-masterclass',
    title: 'Free Masterclass Registration – Atlas AI Education',
    description:
      'AI Fundamentals & Digital Literacy: প্রতি মাসে ১টা live open session (২–২.৫ ঘণ্টা, ফি FREE / BDT 0)। পরবর্তী session-এর জন্য বিনামূল্যে Register করুন।',
    ogType: 'website',
    ogImage: '/src/assets/images/course_ai_literacy_session_1794924850721.jpg',
    ogImageAlt: 'Free Monthly AI Fundamentals & Digital Literacy Masterclass session',
    keywords: [
      'Free AI Masterclass Bangladesh',
      'AI Fundamentals and Digital Literacy FREE',
      'Atlas AI Education free session',
    ],
    jsonLdBuilder: (baseUrl) => buildFreeMasterclassJsonLd(baseUrl),
  },
  {
    path: '/programmes/ai-literacy',
    canonicalPath: '/programmes',
    excludeFromSitemap: true,
    noindex: true,
    title: 'AI Literacy & Foundation – Atlas AI Education',
    description:
      'Entry level: AI Fundamentals, Governance, Generative AI & Prompt Engineering, Productivity ও Responsible Use (FREE · ৳999–৳1,499)।',
    ogType: 'website',
    ogImage: '/src/assets/images/programme_ai_literacy_1794867547641.jpg',
    ogImageAlt: 'AI Literacy & Foundation Courses at Atlas AI Education',
    jsonLdBuilder: (baseUrl) =>
      buildFoundationCategoryListingJsonLd(baseUrl, {
        canonicalPath: '/programmes',
        pageTitle: 'AI Literacy & Foundation – Atlas AI Education',
        pageDescription:
          'Entry level: AI Fundamentals, Governance, Generative AI & Prompt Engineering, Productivity ও Responsible Use (FREE · ৳999–৳1,499)।',
      }),
  },
  {
    path: '/programmes/applied-ai',
    canonicalPath: '/programmes',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Applied AI – Atlas AI Education',
    description:
      'Practical Applied AI programmes (4 weeks, BDT 1,200): AI-Powered Content Creation (AP-201), Business & Entrepreneurship (AP-202), Automation & Workflow Design (AP-203), and Website Development (AP-204).',
    ogType: 'website',
    ogTitle: 'Applied AI Courses – Atlas AI Education',
    ogDescription:
      '4 hands-on Applied AI courses (BDT 1,200 each, scholarship eligible) covering Content Creation, Business & Entrepreneurship, No-Code Automation, and AI Website Development.',
    ogImage: '/src/assets/images/programme_engineering_lab_1794867547072.jpg',
    ogImageAlt: 'Applied AI Practical Courses at Atlas AI Education',
    keywords: [
      'Applied AI courses Bangladesh',
      'AI-Powered Content Creation AP-201',
      'AI for Business and Entrepreneurship AP-202',
      'AI Automation and Workflow Design AP-203',
      'AI-Powered Website Development AP-204',
    ],
    jsonLdBuilder: (baseUrl) =>
      buildAppliedAiCategoryListingJsonLd(baseUrl, {
        canonicalPath: '/programmes',
        pageTitle: 'Applied AI – Atlas AI Education',
        pageDescription:
          'Practical Applied AI programmes covering Content Creation, Business & Entrepreneurship, Automation & Workflow Design, and Website Development (BDT 1,200).',
      }),
  },
  {
    path: '/programmes/professional-development',
    canonicalPath: '/programmes',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Professional Development – Atlas AI Education',
    description:
      '7 structured 4-week Professional Development AI courses (BDT 2,500 each): Workplace Productivity (PD-301), Business Development (PD-302), Leadership (PD-303), Project Management (PD-304), Marketing (PD-305), HR (PD-306), and Financial Management (PD-307).',
    ogType: 'website',
    ogTitle: 'Professional Development AI Courses – Atlas AI Education',
    ogDescription:
      'Professional AI tracks (4 weeks, BDT 2,500, scholarship eligible) for corporate, NGO, public-sector professionals, managers, project teams, HR, marketing, and finance practitioners.',
    ogImage: '/src/assets/images/programme_governance_forum_1794867547140.jpg',
    ogImageAlt: 'Professional Development AI Programmes at Atlas AI Education',
    keywords: [
      'AI Professional Development Bangladesh',
      'AI for Workplace Productivity PD-301',
      'AI for Business Development PD-302',
      'AI Leadership and Strategic Management PD-303',
      'AI for Project Marketing HR and Finance',
    ],
    jsonLdBuilder: (baseUrl) =>
      buildProfessionalDevCategoryListingJsonLd(baseUrl, {
        canonicalPath: '/programmes',
        pageTitle: 'Professional Development – Atlas AI Education',
        pageDescription:
          '7 structured 4-week Professional Development AI courses across workplace productivity, business development, leadership, project, marketing, HR, and finance (BDT 2,500).',
      }),
  },
  {
    path: '/programmes/specialised-programmes',
    canonicalPath: '/programmes',
    excludeFromSitemap: true,
    noindex: true,
    authoritativeHead: true,
    title: 'Specialised Programmes – Atlas AI Education',
    description:
      "Women's Safety in the AI Era (FREE · 4 Weeks) এবং কোম্পানি, অফিস, বিশ্ববিদ্যালয় ও এনজিও-গুলোর জন্য ৮টি Institutional Training & Advisory Services।",
    ogType: 'website',
    ogTitle: 'Specialised Programmes & Institutional AI Services – Atlas AI Education',
    ogDescription:
      "Free Women's Safety in the AI Era awareness programme (BDT 0) and 8 institutional AI training, readiness assessment, and roadmap advisory services.",
    ogImage: '/src/assets/images/course_womens_digital_safety_1794926670102.jpg',
    ogImageAlt: 'Specialised AI Programmes & Institutional Services at Atlas AI Education',
    keywords: [
      "Women's Safety in the AI Era",
      'Institutional AI training Bangladesh',
      'AI Readiness Assessment and Implementation Roadmap',
    ],
    jsonLdBuilder: (baseUrl) =>
      buildSpecialisedCategoryListingJsonLd(baseUrl, {
        canonicalPath: '/programmes',
        pageTitle: 'Specialised Programmes – Atlas AI Education',
        pageDescription:
          "Women's Safety in the AI Era (FREE) এবং ৮টি Institutional Training & Advisory Services।",
      }),
  },
  {
    path: '/programmes/womens-safety-in-the-ai-era',
    specialisedCourseCode: 'SP-WSAI',
    authoritativeHead: true,
    title: WSAI_REC.seoTitle,
    description: WSAI_REC.metaDescription,
    ogType: 'article',
    ogTitle: WSAI_REC.ogTitle,
    ogDescription: WSAI_REC.ogDescription,
    ogImage: WSAI_REC.ogImage,
    ogImageAlt: WSAI_REC.ogImageAlt,
    keywords: [WSAI_REC.primaryKeyword, ...WSAI_REC.secondaryKeywords],
    jsonLdBuilder: (baseUrl) =>
      buildWomensSafetyJsonLd(discoverSpecialisedCourse(), baseUrl, {
        seoTitle: WSAI_REC.seoTitle,
        metaDescription: WSAI_REC.metaDescription,
      }),
  },
  {
    path: '/programmes/SP-WSAI',
    canonicalPath: '/programmes/womens-safety-in-the-ai-era',
    excludeFromSitemap: true,
    noindex: true,
    specialisedCourseCode: 'SP-WSAI',
    authoritativeHead: true,
    title: WSAI_REC.seoTitle,
    description: WSAI_REC.metaDescription,
    ogType: 'article',
    ogTitle: WSAI_REC.ogTitle,
    ogDescription: WSAI_REC.ogDescription,
    ogImage: WSAI_REC.ogImage,
    ogImageAlt: WSAI_REC.ogImageAlt,
    keywords: [WSAI_REC.primaryKeyword, ...WSAI_REC.secondaryKeywords],
    jsonLdBuilder: (baseUrl) =>
      buildWomensSafetyJsonLd(discoverSpecialisedCourse(), baseUrl, {
        seoTitle: WSAI_REC.seoTitle,
        metaDescription: WSAI_REC.metaDescription,
      }),
  },

  // Primary Code-Based Course Detail Routes (/programmes/:code) — Dynamically Generated for All Foundation Courses
  ...discoverFoundationCourses().map((course): RouteSeoEntry => {
    const rec = buildFoundationCourseSeoRecord(course);
    return {
      path: rec.canonicalPath,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: 'article',
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      foundationCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) =>
        buildFoundationCourseJsonLd(course, baseUrl, {
          seoTitle: rec.seoTitle,
          metaDescription: rec.metaDescription,
        }),
    };
  }),

  // Category 2: Applied AI — Dynamically Generated for All Applied AI Courses
  ...discoverAppliedAiCourses().map((course): RouteSeoEntry => {
    const rec = buildAppliedAiCourseSeoRecord(course);
    return {
      path: rec.canonicalPath,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: 'article',
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      appliedAiCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) =>
        buildAppliedAiCourseJsonLd(course, baseUrl, {
          seoTitle: rec.seoTitle,
          metaDescription: rec.metaDescription,
        }),
    };
  }),

  // Category 3: Professional Development — Dynamically Generated for All Professional Development Courses
  ...discoverProfessionalDevCourses().map((course): RouteSeoEntry => {
    const rec = buildProfessionalDevCourseSeoRecord(course);
    return {
      path: rec.canonicalPath,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: 'article',
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      professionalDevCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) =>
        buildProfessionalDevCourseJsonLd(course, baseUrl, {
          seoTitle: rec.seoTitle,
          metaDescription: rec.metaDescription,
        }),
    };
  }),

  // Supporting Foundation Slug Aliases (excluded from sitemap, noindex + canonicalized to code route)
  ...discoverFoundationCourses().map((course): RouteSeoEntry => {
    const rec = buildFoundationCourseSeoRecord(course);
    return {
      path: `/programmes/${course.slug}`,
      canonicalPath: rec.canonicalPath,
      excludeFromSitemap: true,
      noindex: true,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: 'article',
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      foundationCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) =>
        buildFoundationCourseJsonLd(course, baseUrl, {
          seoTitle: rec.seoTitle,
          metaDescription: rec.metaDescription,
        }),
    };
  }),
  // Supporting Applied AI Slug Aliases (excluded from sitemap, noindex + canonicalized to code route)
  ...discoverAppliedAiCourses().map((course): RouteSeoEntry => {
    const rec = buildAppliedAiCourseSeoRecord(course);
    return {
      path: `/programmes/${course.slug}`,
      canonicalPath: rec.canonicalPath,
      excludeFromSitemap: true,
      noindex: true,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: 'article',
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      appliedAiCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) =>
        buildAppliedAiCourseJsonLd(course, baseUrl, {
          seoTitle: rec.seoTitle,
          metaDescription: rec.metaDescription,
        }),
    };
  }),
  // Supporting Professional Development Slug Aliases (excluded from sitemap, noindex + canonicalized to code route)
  ...discoverProfessionalDevCourses().map((course): RouteSeoEntry => {
    const rec = buildProfessionalDevCourseSeoRecord(course);
    return {
      path: `/programmes/${course.slug}`,
      canonicalPath: rec.canonicalPath,
      excludeFromSitemap: true,
      noindex: true,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: 'article',
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      professionalDevCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) =>
        buildProfessionalDevCourseJsonLd(course, baseUrl, {
          seoTitle: rec.seoTitle,
          metaDescription: rec.metaDescription,
        }),
    };
  }),

  // Institutional Training & Advisory Services (Specialised Programmes — Section B)
  ...INSTITUTIONAL_SERVICES.map((service): RouteSeoEntry => {
    const rec = pageRec(`/institutional-services/${service.slug}`);
    return {
      path: `/institutional-services/${service.slug}`,
      pageSeoRoute: `/institutional-services/${service.slug}`,
      institutionalServiceSlug: service.slug,
      authoritativeHead: true,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: 'article',
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      jsonLdBuilder: (baseUrl) =>
        buildInstitutionalServiceJsonLd(service, baseUrl, {
          seoTitle: rec.seoTitle,
          metaDescription: rec.metaDescription,
        }),
    };
  }),

  // Supporting Institutional & Utility Pages
  {
    path: '/resources',
    pageSeoRoute: '/resources',
    authoritativeHead: true,
    title: pageRec('/resources').seoTitle,
    description: pageRec('/resources').metaDescription,
    ogType: 'website',
    ogTitle: pageRec('/resources').ogTitle,
    ogDescription: pageRec('/resources').ogDescription,
    ogImage: pageRec('/resources').ogImage,
    ogImageAlt: pageRec('/resources').ogImageAlt,
    keywords: [pageRec('/resources').primaryKeyword, ...pageRec('/resources').secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildResourcesJsonLd(baseUrl),
  },
  {
    path: '/tools',
    pageSeoRoute: '/tools',
    authoritativeHead: true,
    title: pageRec('/tools').seoTitle,
    description: pageRec('/tools').metaDescription,
    ogType: 'website',
    ogTitle: pageRec('/tools').ogTitle,
    ogDescription: pageRec('/tools').ogDescription,
    ogImage: pageRec('/tools').ogImage,
    ogImageAlt: pageRec('/tools').ogImageAlt,
    keywords: [pageRec('/tools').primaryKeyword, ...pageRec('/tools').secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildToolsJsonLd(baseUrl),
  },
  {
    path: '/verify-certificate',
    pageSeoRoute: '/verify-certificate',
    authoritativeHead: true,
    title: pageRec('/verify-certificate').seoTitle,
    description: pageRec('/verify-certificate').metaDescription,
    ogType: 'website',
    ogTitle: pageRec('/verify-certificate').ogTitle,
    ogDescription: pageRec('/verify-certificate').ogDescription,
    ogImage: pageRec('/verify-certificate').ogImage,
    ogImageAlt: pageRec('/verify-certificate').ogImageAlt,
    keywords: [
      pageRec('/verify-certificate').primaryKeyword,
      ...pageRec('/verify-certificate').secondaryKeywords,
    ],
    jsonLdBuilder: (baseUrl) => buildVerifyCertificateJsonLd(baseUrl),
  },
  {
    path: '/login',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Login – Atlas AI Education',
    description: 'Sign in to your Atlas AI Education Learner Dashboard.',
    ogType: 'website',
  },
  {
    path: '/signup',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Create Account – Atlas AI Education',
    description: 'Create your Atlas AI Education learner account to access courses, assignments, and certificates.',
    ogType: 'website',
  },
  {
    path: '/forgot-password',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Forgot Password – Atlas AI Education',
    description: 'Request a password reset link for your Atlas AI Education account.',
    ogType: 'website',
  },
  {
    path: '/reset-password',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Reset Password – Atlas AI Education',
    description: 'Reset your Atlas AI Education account password.',
    ogType: 'website',
  },
  {
    path: '/verify-email',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Verify Email – Atlas AI Education',
    description: 'Verify your Atlas AI Education learner email address.',
    ogType: 'website',
  },
  {
    path: '/profile',
    excludeFromSitemap: true,
    noindex: true,
    title: 'My Profile – Atlas AI Education',
    description: 'Manage your Atlas AI Education learner profile and saved items.',
    ogType: 'website',
  },
  {
    path: '/dashboard',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Learner Dashboard – Atlas AI Education',
    description: 'Atlas AI Education Learner Dashboard & Learning Management System.',
    ogType: 'website',
  },
  {
    path: '/admin',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Admin & Instructor Console – Atlas AI Education',
    description: 'Operational management console for Atlas AI Education.',
    ogType: 'website',
  },
  {
    path: '/menu',
    excludeFromSitemap: true,
    noindex: true,
    title: 'Menu – Atlas AI Education',
    description: 'Atlas AI Education মোবাইল মেন্যু ও সব পেজের তালিকা।',
    ogType: 'website',
  },
  {
    path: '/scholarships',
    pageSeoRoute: '/scholarships',
    authoritativeHead: true,
    title: pageRec('/scholarships').seoTitle,
    description: pageRec('/scholarships').metaDescription,
    ogType: 'website',
    ogTitle: pageRec('/scholarships').ogTitle,
    ogDescription: pageRec('/scholarships').ogDescription,
    ogImage: pageRec('/scholarships').ogImage,
    ogImageAlt: pageRec('/scholarships').ogImageAlt,
    keywords: [pageRec('/scholarships').primaryKeyword, ...pageRec('/scholarships').secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildScholarshipsJsonLd(baseUrl),
  },
  {
    path: '/faq',
    pageSeoRoute: '/faq',
    authoritativeHead: true,
    title: pageRec('/faq').seoTitle,
    description: pageRec('/faq').metaDescription,
    ogType: 'website',
    ogTitle: pageRec('/faq').ogTitle,
    ogDescription: pageRec('/faq').ogDescription,
    ogImage: pageRec('/faq').ogImage,
    ogImageAlt: pageRec('/faq').ogImageAlt,
    keywords: [pageRec('/faq').primaryKeyword, ...pageRec('/faq').secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildFaqJsonLd(baseUrl),
  },
  {
    path: '/contact',
    pageSeoRoute: '/contact',
    authoritativeHead: true,
    title: pageRec('/contact').seoTitle,
    description: pageRec('/contact').metaDescription,
    ogType: 'website',
    ogTitle: pageRec('/contact').ogTitle,
    ogDescription: pageRec('/contact').ogDescription,
    ogImage: pageRec('/contact').ogImage,
    ogImageAlt: pageRec('/contact').ogImageAlt,
    keywords: [pageRec('/contact').primaryKeyword, ...pageRec('/contact').secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildContactJsonLd(baseUrl),
  },
  {
    path: '/privacy',
    pageSeoRoute: '/privacy',
    authoritativeHead: true,
    title: pageRec('/privacy').seoTitle,
    description: pageRec('/privacy').metaDescription,
    ogType: 'article',
    ogTitle: pageRec('/privacy').ogTitle,
    ogDescription: pageRec('/privacy').ogDescription,
    ogImage: pageRec('/privacy').ogImage,
    ogImageAlt: pageRec('/privacy').ogImageAlt,
    keywords: [pageRec('/privacy').primaryKeyword, ...pageRec('/privacy').secondaryKeywords],
    jsonLdBuilder: (baseUrl) =>
      buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: '/privacy',
        breadcrumbLabel: 'Privacy Policy',
        pageTitle: pageRec('/privacy').seoTitle,
        description: pageRec('/privacy').metaDescription,
      }),
  },
  {
    path: '/privacy-policy',
    canonicalPath: '/privacy',
    excludeFromSitemap: true,
    noindex: true,
    authoritativeHead: true,
    title: pageRec('/privacy').seoTitle,
    description: pageRec('/privacy').metaDescription,
    ogType: 'article',
    ogTitle: pageRec('/privacy').ogTitle,
    ogDescription: pageRec('/privacy').ogDescription,
    ogImage: pageRec('/privacy').ogImage,
    ogImageAlt: pageRec('/privacy').ogImageAlt,
    jsonLdBuilder: (baseUrl) =>
      buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: '/privacy',
        breadcrumbLabel: 'Privacy Policy',
        pageTitle: pageRec('/privacy').seoTitle,
        description: pageRec('/privacy').metaDescription,
      }),
  },
  {
    path: '/terms',
    pageSeoRoute: '/terms',
    authoritativeHead: true,
    title: pageRec('/terms').seoTitle,
    description: pageRec('/terms').metaDescription,
    ogType: 'article',
    ogTitle: pageRec('/terms').ogTitle,
    ogDescription: pageRec('/terms').ogDescription,
    ogImage: pageRec('/terms').ogImage,
    ogImageAlt: pageRec('/terms').ogImageAlt,
    keywords: [pageRec('/terms').primaryKeyword, ...pageRec('/terms').secondaryKeywords],
    jsonLdBuilder: (baseUrl) =>
      buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: '/terms',
        breadcrumbLabel: 'Terms & Conditions',
        pageTitle: pageRec('/terms').seoTitle,
        description: pageRec('/terms').metaDescription,
      }),
  },
  {
    path: '/sitemap',
    pageSeoRoute: '/sitemap',
    authoritativeHead: true,
    title: pageRec('/sitemap').seoTitle,
    description: pageRec('/sitemap').metaDescription,
    ogType: 'website',
    ogTitle: pageRec('/sitemap').ogTitle,
    ogDescription: pageRec('/sitemap').ogDescription,
    ogImage: pageRec('/sitemap').ogImage,
    ogImageAlt: pageRec('/sitemap').ogImageAlt,
    keywords: [pageRec('/sitemap').primaryKeyword, ...pageRec('/sitemap').secondaryKeywords],
    jsonLdBuilder: (baseUrl) =>
      buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: '/sitemap',
        breadcrumbLabel: 'Sitemap',
        pageTitle: pageRec('/sitemap').seoTitle,
        description: pageRec('/sitemap').metaDescription,
      }),
  },
];

export function resolveRouteSeo(pathname: string): { entry: RouteSeoEntry; isKnown: boolean } {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const found =
    ROUTE_SEO_ENTRIES.find((item) => item.path === clean) ||
    ROUTE_SEO_ENTRIES.find((item) => item.path.toLowerCase() === clean.toLowerCase());
  if (found) {
    return { entry: found, isKnown: true };
  }

  if (clean.startsWith('/dashboard')) {
    return {
      entry: {
        path: clean,
        excludeFromSitemap: true,
        noindex: true,
        title: 'Learner Dashboard – Atlas AI Education',
        description: 'Atlas AI Education Learner Dashboard & Learning Management System.',
        ogType: 'website',
      },
      isKnown: true,
    };
  }

  if (clean.startsWith('/admin')) {
    return {
      entry: {
        path: clean,
        excludeFromSitemap: true,
        noindex: true,
        title: 'Admin & Instructor Console – Atlas AI Education',
        description: 'Operational management console for Atlas AI Education.',
        ogType: 'website',
      },
      isKnown: true,
    };
  }

  if (clean.startsWith('/verify-certificate/')) {
    const verifyRec = getPageSeoRecordByPath('/verify-certificate')!;
    return {
      entry: {
        path: clean,
        canonicalPath: '/verify-certificate',
        excludeFromSitemap: true,
        noindex: true,
        authoritativeHead: true,
        title: verifyRec.seoTitle,
        description: verifyRec.metaDescription,
        ogType: 'website',
        ogTitle: verifyRec.ogTitle,
        ogDescription: verifyRec.ogDescription,
        ogImage: verifyRec.ogImage,
        ogImageAlt: verifyRec.ogImageAlt,
        jsonLdBuilder: (baseUrl) => buildVerifyCertificateJsonLd(baseUrl),
      },
      isKnown: true,
    };
  }

  // Dynamic fallback if a Foundation or Applied AI course exists in COURSES or future DB updates
  if (clean.startsWith('/programmes/')) {
    const param = clean.slice('/programmes/'.length);
    const dynamicFoundation = COURSES.find(
      (c) =>
        c.categorySlug === 'ai-literacy' &&
        (c.code.toLowerCase() === param.toLowerCase() ||
          c.slug.toLowerCase() === param.toLowerCase())
    );
    if (dynamicFoundation) {
      const rec = buildFoundationCourseSeoRecord(dynamicFoundation);
      const isSlugAccess = param.toLowerCase() === dynamicFoundation.slug.toLowerCase();
      return {
        entry: {
          path: clean,
          canonicalPath: rec.canonicalPath,
          excludeFromSitemap: isSlugAccess,
          noindex: isSlugAccess,
          title: rec.seoTitle,
          description: rec.metaDescription,
          ogType: 'article',
          ogTitle: rec.ogTitle,
          ogDescription: rec.ogDescription,
          ogImage: rec.ogImage,
          ogImageAlt: rec.ogImageAlt,
          keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
          foundationCourseCode: dynamicFoundation.code,
          authoritativeHead: true,
          jsonLdBuilder: (baseUrl) =>
            buildFoundationCourseJsonLd(dynamicFoundation, baseUrl, {
              seoTitle: rec.seoTitle,
              metaDescription: rec.metaDescription,
            }),
        },
        isKnown: true,
      };
    }

    const dynamicAppliedAi = COURSES.find(
      (c) =>
        c.categorySlug === 'applied-ai' &&
        (c.code.toLowerCase() === param.toLowerCase() ||
          c.slug.toLowerCase() === param.toLowerCase())
    );
    if (dynamicAppliedAi) {
      const rec = buildAppliedAiCourseSeoRecord(dynamicAppliedAi);
      const isSlugAccess = param.toLowerCase() === dynamicAppliedAi.slug.toLowerCase();
      return {
        entry: {
          path: clean,
          canonicalPath: rec.canonicalPath,
          excludeFromSitemap: isSlugAccess,
          noindex: isSlugAccess,
          title: rec.seoTitle,
          description: rec.metaDescription,
          ogType: 'article',
          ogTitle: rec.ogTitle,
          ogDescription: rec.ogDescription,
          ogImage: rec.ogImage,
          ogImageAlt: rec.ogImageAlt,
          keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
          appliedAiCourseCode: dynamicAppliedAi.code,
          authoritativeHead: true,
          jsonLdBuilder: (baseUrl) =>
            buildAppliedAiCourseJsonLd(dynamicAppliedAi, baseUrl, {
              seoTitle: rec.seoTitle,
              metaDescription: rec.metaDescription,
            }),
        },
        isKnown: true,
      };
    }

    const dynamicProfessionalDev = COURSES.find(
      (c) =>
        c.categorySlug === 'professional-development' &&
        (c.code.toLowerCase() === param.toLowerCase() ||
          c.slug.toLowerCase() === param.toLowerCase())
    );
    if (dynamicProfessionalDev) {
      const rec = buildProfessionalDevCourseSeoRecord(dynamicProfessionalDev);
      const isSlugAccess = param.toLowerCase() === dynamicProfessionalDev.slug.toLowerCase();
      return {
        entry: {
          path: clean,
          canonicalPath: rec.canonicalPath,
          excludeFromSitemap: isSlugAccess,
          noindex: isSlugAccess,
          title: rec.seoTitle,
          description: rec.metaDescription,
          ogType: 'article',
          ogTitle: rec.ogTitle,
          ogDescription: rec.ogDescription,
          ogImage: rec.ogImage,
          ogImageAlt: rec.ogImageAlt,
          keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
          professionalDevCourseCode: dynamicProfessionalDev.code,
          authoritativeHead: true,
          jsonLdBuilder: (baseUrl) =>
            buildProfessionalDevCourseJsonLd(dynamicProfessionalDev, baseUrl, {
              seoTitle: rec.seoTitle,
              metaDescription: rec.metaDescription,
            }),
        },
        isKnown: true,
      };
    }
  }

  return {
    entry: {
      path: clean,
      noindex: true,
      excludeFromSitemap: true,
      title: 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি – Atlas AI Education',
      description: 'Atlas AI Education ওয়েবসাইটে এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি।',
      ogType: 'website',
    },
    isKnown: false,
  };
}
