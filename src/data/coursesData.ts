export type CategorySlug =
  | 'ai-literacy'
  | 'applied-ai'
  | 'professional-development'
  | 'specialised-programmes';

export type TierAccentType =
  | 'free'
  | 'literacy'
  | 'applied'
  | 'professional'
  | 'specialised';

export interface CourseModule {
  code: string;
  title: string;
  topics: string[];
}

export interface PracticalProject {
  projectLabel?: string;
  title: string;
  prompt: string;
  deliverables: string[];
  note?: string;
}

export interface CourseItem {
  code: string;
  slug: string;
  title: string;
  categorySlug: CategorySlug;
  categoryName: string;
  tierAccent: TierAccentType;
  tierLabel: string;
  chipLabel: string;
  level?: string;
  hook: string;
  overview: string;
  duration: string;
  fee: string;
  feeNote: string;
  isFree: boolean;
  imageUrl: string;
  imageAlt: string;
  whoThisCourseIsFor?: string[];
  keyAreas: string[];
  learningOutcomes: string[];
  modules: CourseModule[];
  practicalSkills?: string[];
  practicalProject?: PracticalProject;
  outsideScope?: string[];
  programmeNotes?: string[];
  isDraftOutline?: boolean;
  prerequisites: string;
  assessment: string;
  certificate: string;
  registrationNote: string;
}

export interface CourseCategoryMeta {
  slug: CategorySlug;
  title: string;
  tierAccent: TierAccentType;
  levelLabel: string;
  shortDescription: string;
  bannerOverview: string;
  feeRange: string;
  homeCourseList: string[];
  isUnderDevelopment?: boolean;
}

export interface LearningPathwayStep {
  step: number;
  verb: string;
  courseCode: string;
  courseTitle: string;
  level: string;
  fee: string;
}

export interface CategoryEnrolmentInfo {
  seatCapacity: number | null;
  seatLabel: string;
  seatDescription: string;
  certificateLabel: string;
}

export const COURSE_CATEGORIES: CourseCategoryMeta[] = [
  {
    slug: 'ai-literacy',
    title: 'AI Literacy & Foundation',
    tierAccent: 'literacy',
    levelLabel: 'Entry Level · 6 Programmes (2 Free · 4 Paid)',
    shortDescription:
      'AI কী, কীভাবে কাজ করে, Prompt Engineering, দৈনন্দিন productivity এবং নিরাপদ ও নৈতিক ব্যবহারের শক্ত ভিত্তি।',
    bannerOverview:
      'নতুন শিক্ষার্থী ও পেশাজীবীদের জন্য ৬টি কাঠামোবদ্ধ Foundation কোর্স—যার মধ্যে ২টি সম্পূর্ণ বিনামূল্যে (FREE) এবং ৪টি ব্যবহারিক কোর্স (৳999–৳1,499)।',
    feeRange: 'FREE · ৳999 – ৳1,499',
    homeCourseList: [
      'AI Fundamentals & Digital Literacy (FREE)',
      'AI Governance Fundamentals (FREE)',
      'Generative AI & Prompt Engineering (৳999)',
      'AI for Everyday & Professional Productivity (৳999)',
      'AI Safety, Ethics & Responsible Use (৳999)',
      'AI Tools Literacy & Prompt Engineering (৳1,499)',
    ],
  },
  {
    slug: 'applied-ai',
    title: 'Applied AI',
    tierAccent: 'applied',
    levelLabel: 'Practical Track · 4 Programmes',
    shortDescription:
      'Content creation, entrepreneurship, no-code automation এবং website development-এ AI-এর হাতে-কলমে বাস্তব প্রয়োগ।',
    bannerOverview:
      'প্র্যাকটিক্যাল প্রজেক্টভিত্তিক ৪টি Applied AI কোর্স—যার মাধ্যমে কনটেন্ট তৈরি, ব্যবসায়িক প্রয়োগ, অটোমেশন ও ওয়েব ডেভেলপমেন্ট শেখানো হয় (প্রতিটি কোর্স BDT 1,200)।',
    feeRange: 'BDT 1,200 per course',
    homeCourseList: [
      'AI-Powered Content Creation (AP-201)',
      'AI for Business & Entrepreneurship (AP-202)',
      'AI Automation & Workflow Design (AP-203)',
      'AI-Powered Website Development (AP-204)',
    ],
  },
  {
    slug: 'professional-development',
    title: 'Professional Development',
    tierAccent: 'professional',
    levelLabel: 'Professional Track · 7 Programmes',
    shortDescription:
      'Workplace productivity, business development, leadership, project, marketing, HR ও financial management-এ পেশাগত AI দক্ষতা।',
    bannerOverview:
      'কর্মজীবী পেশাজীবী, টিম লিডার ও ম্যানেজারদের জন্য ৭টি স্বতন্ত্র ৪-সপ্তাহের প্রোগ্রাম (৮টি ক্লাস, Capstone প্রজেক্টসহ, প্রতিটি BDT 2,500)।',
    feeRange: 'BDT 2,500 per course',
    homeCourseList: [
      'AI for Professionals & Workplace Productivity',
      'AI for Business Development',
      'AI Leadership & Strategic Management',
      'AI for Project Management & 3 more tracks',
    ],
  },
  {
    slug: 'specialised-programmes',
    title: 'Specialised Programmes',
    tierAccent: 'specialised',
    levelLabel: 'Social Impact & Institutional Advisory',
    shortDescription:
      "Women's Safety in the AI Era (FREE) এবং প্রতিষ্ঠান, অফিস, বিশ্ববিদ্যালয় ও এনজিও-গুলোর জন্য ৮টি Institutional Training & Advisory Services।",
    bannerOverview:
      'সামাজিক সচেতনতা ও সুরক্ষাভিত্তিক বিশেষায়িত লার্নিং প্রোগ্রাম (Section A) এবং কর্পোরেট, সরকারি অফিস, বিশ্ববিদ্যালয় ও এনজিও-র জন্য কাস্টম প্রাতিষ্ঠানিক প্রশিক্ষণ ও পরামর্শ সেবা (Section B)।',
    feeRange: 'FREE Community Track + Institutional Advisory',
    homeCourseList: [
      "Women's Safety in the AI Era (FREE)",
      'Employees & Executive AI Training',
      'AI Readiness Assessment (3 Pathways)',
      'AI Implementation Roadmap & Governance',
    ],
  },
];

export const FOUNDATION_LEARNING_PATHWAY: LearningPathwayStep[] = [
  {
    step: 1,
    verb: 'Understand',
    courseCode: 'FREE',
    courseTitle: 'AI Fundamentals & Digital Literacy',
    level: 'Beginner',
    fee: 'FREE',
  },
  {
    step: 2,
    verb: 'Govern',
    courseCode: 'AL-100',
    courseTitle: 'AI Governance Fundamentals',
    level: 'Beginner',
    fee: 'FREE',
  },
  {
    step: 3,
    verb: 'Create',
    courseCode: 'AL-101',
    courseTitle: 'Generative AI & Prompt Engineering',
    level: 'Beginner to Early Intermediate',
    fee: 'BDT 999',
  },
  {
    step: 4,
    verb: 'Apply',
    courseCode: 'AL-102',
    courseTitle: 'AI for Everyday & Professional Productivity',
    level: 'Beginner to Early Intermediate',
    fee: 'BDT 999',
  },
  {
    step: 5,
    verb: 'Protect',
    courseCode: 'AL-103',
    courseTitle: 'AI Safety, Ethics & Responsible Use',
    level: 'Beginner',
    fee: 'BDT 999',
  },
  {
    step: 6,
    verb: 'Choose & Compare',
    courseCode: 'AL-104',
    courseTitle: 'AI Tools Literacy & Prompt Engineering',
    level: 'Beginner to Intermediate',
    fee: 'BDT 1,499',
  },
];

export const APPLIED_AI_LEARNING_PATHWAY: LearningPathwayStep[] = [
  {
    step: 1,
    verb: 'Communicate',
    courseCode: 'AP-201',
    courseTitle: 'AI-Powered Content Creation',
    level: 'Beginner to Intermediate',
    fee: 'BDT 1,200',
  },
  {
    step: 2,
    verb: 'Build Business',
    courseCode: 'AP-202',
    courseTitle: 'AI for Business & Entrepreneurship',
    level: 'Intermediate',
    fee: 'BDT 1,200',
  },
  {
    step: 3,
    verb: 'Automate',
    courseCode: 'AP-203',
    courseTitle: 'AI Automation & Workflow Design',
    level: 'Intermediate',
    fee: 'BDT 1,200',
  },
  {
    step: 4,
    verb: 'Ship Web',
    courseCode: 'AP-204',
    courseTitle: 'AI-Powered Website Development',
    level: 'Intermediate',
    fee: 'BDT 1,200',
  },
];

export function getCategoryEnrolmentInfo(
  slug: CategorySlug
): CategoryEnrolmentInfo | undefined {
  switch (slug) {
    case 'ai-literacy':
      return {
        seatCapacity: 45,
        seatLabel: 'Max 45 seats per batch',
        seatDescription:
          'Interactive mentoring ও feedback নিশ্চিত করতে প্রতিটি ব্যাচে সীমিত আসন।',
        certificateLabel: 'Certificate of Participation / Completion',
      };
    case 'applied-ai':
      return {
        seatCapacity: 30,
        seatLabel: 'Max 30 seats per batch',
        seatDescription:
          'Hands-on প্রজেক্ট রিভিউ ও ডেলিভারেবল ফিডব্যাকের জন্য নির্ধারিত ব্যাচ।',
        certificateLabel: 'Completion Certificate (Applied Project)',
      };
    case 'professional-development':
      return {
        seatCapacity: 25,
        seatLabel: 'Max 25 seats per cohort',
        seatDescription:
          'Capstone প্রজেক্ট রিভিউ ও পেশাদার কেস ডিসকাশনের জন্য নির্ধারিত কোহর্ট।',
        certificateLabel: 'Professional Completion Certificate (Non-Accredited)',
      };
    default:
      return undefined;
  }
}

const PD_COMMON_NOTES: string[] = [
  'প্রতিটি কোর্স স্বতন্ত্র প্রোগ্রাম; পেশাগত প্রয়োজন অনুযায়ী যেকোনো কোর্সে সরাসরি ভর্তি হওয়া যাবে।',
  '৪ সপ্তাহ · মোট ৮টি সেশন (লাইভ অনলাইন), চূড়ান্ত ডেলিভারি সূচি অনুযায়ী সময় নিশ্চিত করা হবে।',
  'হাতে-কলমে অনুশীলন ও Capstone প্রজেক্টের জন্য কম্পিউটার ও ইন্টারনেট সংযোগ প্রয়োজন।',
  'প্রযোজ্য ক্ষেত্রে ফ্রি ও পেইড AI টুল প্রদর্শন করা হবে; পৃথক টুল সাবস্ক্রিপশন ফি কোর্স ফি-এর অন্তর্ভুক্ত নয়।',
  'কোর্স সমাপ্তি কোনো প্রাতিষ্ঠানিক স্বীকৃতি (accreditation), চাকরির নিশ্চয়তা বা নির্দিষ্ট ব্যবসায়িক ফলাফলের গ্যারান্টি প্রদান করে না।',
];

export const COURSES: CourseItem[] = [
  // =========================================================================
  // CATEGORY 1: AI LITERACY & FOUNDATION (6 Courses: FREE, AL-100 .. AL-104)
  // =========================================================================
  {
    code: 'FREE',
    slug: 'ai-fundamentals-digital-literacy-masterclass',
    title: 'AI Fundamentals & Digital Literacy',
    categorySlug: 'ai-literacy',
    categoryName: 'AI Literacy & Foundation',
    tierAccent: 'free',
    tierLabel: 'Free Masterclass',
    chipLabel: 'AI Literacy & Foundation',
    level: 'Beginner',
    hook: 'AI কী, কীভাবে কাজ করে এবং কীভাবে নিরাপদে ও সচেতনভাবে ব্যবহার করবেন—শুরু হোক প্রতি মাসের এই উন্মুক্ত সেশন দিয়ে (FREE)।',
    overview:
      'এই কোর্সে Artificial Intelligence কী, কীভাবে কাজ করে এবং দৈনন্দিন জীবন, শিক্ষা ও কর্মক্ষেত্রে কীভাবে ব্যবহৃত হয়, তা সহজ ভাষায় ও বাস্তব উদাহরণসহ শেখানো হবে। যারা AI সম্পর্কে একেবারে নতুন, তাদের জন্য এটি প্রাথমিক এবং সর্বোত্তম শুরুর কোর্স।',
    duration: 'Monthly Open Session · 2–2.5 Hours',
    fee: 'BDT 0',
    feeNote: 'Completely Free · Monthly Open Session',
    isFree: true,
    imageUrl: '/src/assets/images/course_ai_literacy_session_1794924850721.jpg',
    imageAlt: 'AI Fundamentals & Digital Literacy interactive community session',
    whoThisCourseIsFor: [
      'AI সম্পর্কে কোনো পূর্ব ধারণা নেই এমন শিক্ষার্থী ও সাধারণ আগ্রহী ব্যক্তি',
      'কর্মক্ষেত্রে AI-এর ভূমিকা বুঝতে চান এমন পেশাজীবী',
      'পরবর্তী AI কোর্সের জন্য শক্ত ভিত্তি তৈরি করতে চান এমন যে কেউ',
    ],
    keyAreas: [
      'Introduction to Artificial Intelligence',
      'How AI Learns from Data & Models',
      'AI in Everyday Life & Public Services',
      'Understanding the AI Ecosystem & Tools',
    ],
    learningOutcomes: [
      'AI-এর মৌলিক ধারণা, ইতিহাস এবং ML ও Deep Learning-এর মূল পার্থক্য সহজভাবে বুঝতে পারবেন।',
      'দৈনন্দিন জীবন, শিক্ষা, স্বাস্থ্য ও কর্মক্ষেত্রে AI-এর বাস্তব প্রয়োগ শনাক্ত করতে পারবেন।',
      'AI কীভাবে তথ্য থেকে শেখে ও আউটপুট দেয় এবং এর সক্ষমতা ও সীমাবদ্ধতা কোথায় তা চিনতে পারবেন।',
      'পরবর্তী AI learning journey শুরু করার জন্য প্রয়োজনীয় পরিষ্কার ভিত্তি তৈরি করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'Introduction to Artificial Intelligence — AI-এর মূল ধারণা ও ইতিহাস',
        topics: [
          'What is Artificial Intelligence?',
          'Evolution and development of AI',
          'AI, Machine Learning and Deep Learning-এর পার্থক্য',
          'Narrow AI and Generative AI',
          'Everyday examples of AI',
        ],
      },
      {
        code: 'Module 2',
        title: 'How AI Works — তথ্য থেকে শেখা এবং সিদ্ধান্ত তৈরির প্রক্রিয়া',
        topics: [
          'AI কীভাবে তথ্য থেকে শেখে',
          'Data, Algorithms and Models-এর ধারণা',
          'Training and Inference-এর প্রাথমিক ধারণা',
          'AI কীভাবে prediction ও recommendation তৈরি করে',
          'AI-এর সক্ষমতা ও সীমাবদ্ধতা',
        ],
      },
      {
        code: 'Module 3',
        title: 'AI in Everyday Life — বাস্তব ক্ষেত্রে AI-এর প্রয়োগ',
        topics: [
          'AI in Education, Healthcare and Business',
          'AI in Communication',
          'AI in Government and Public Services',
          'AI in Research and Innovation',
        ],
      },
      {
        code: 'Module 4',
        title: 'Understanding the AI Ecosystem — AI tools ও মানুষের সম্পর্ক',
        topics: [
          'AI tools and platforms-এর পরিচিতি',
          'Generative AI-এর প্রাথমিক ধারণা',
          'AI ব্যবহার করার সাধারণ পদ্ধতি',
          'Human Intelligence and AI-এর সম্পর্ক',
        ],
      },
    ],
    practicalSkills: [
      'বিভিন্ন AI application শনাক্ত করা',
      'কোন কাজে AI ব্যবহার করা যায় তা বোঝা',
      'AI-generated output-এর সীমাবদ্ধতা চেনা',
      'দৈনন্দিন কাজে AI ব্যবহারের সুযোগ শনাক্ত করা',
    ],
    outsideScope: [
      'Programming or Python for AI',
      'Machine Learning Model Development',
      'Advanced Prompt Engineering',
      'Professional AI Automation',
    ],
    programmeNotes: [
      'প্রতি মাসে ১টি লাইভ উন্মুক্ত সেশন আয়োজন করা হয় (সময়কাল ২–২.৫ ঘণ্টা, ফি BDT 0)।',
      'কোনো ব্যাংক কার্ড, পেমেন্ট পিন বা ফি চাওয়া হয় না; কেবল আসন নিশ্চিত করতে নিবন্ধন প্রয়োজন।',
    ],
    prerequisites: 'কোনো পূর্ব প্রযুক্তিগত অভিজ্ঞতা বা কোডিং জ্ঞান প্রয়োজন নেই। যে কেউ অংশ নিতে পারবেন।',
    assessment: 'উন্মুক্ত অংশগ্রহণ, লাইভ কুইজ ও প্রশ্নোত্তর সেশনে সক্রিয় উপস্থিতি।',
    certificate: 'সেশনে পূর্ণ অংশগ্রহণের ভিত্তিতে Non-accredited Certificate of Participation প্রদান করা হয়।',
    registrationNote: 'প্রতি মাসে ১টি উন্মুক্ত মাস্টারক্লাস। বিনামূল্যে আসন বুক করতে ফ্রি রেজিস্ট্রেশন সম্পন্ন করুন।',
  },
  {
    code: 'AL-100',
    slug: 'ai-governance-fundamentals',
    title: 'AI Governance Fundamentals',
    categorySlug: 'ai-literacy',
    categoryName: 'AI Literacy & Foundation',
    tierAccent: 'free',
    tierLabel: 'Free Foundation',
    chipLabel: 'AI Literacy & Foundation',
    level: 'Beginner',
    hook: 'AI নীতিমালা, জবাবদিহিতা, ঝুঁকি মূল্যায়ন ও প্রাতিষ্ঠানিক দায়িত্বশীলতার প্রাথমিক কাঠামো (FREE)।',
    overview:
      'AI কীভাবে দায়িত্বশীল, নিরাপদ, স্বচ্ছ ও জবাবদিহিমূলকভাবে ব্যবহার ও পরিচালনা করা যায়, তা শেখানো হবে। AI policy, ethics এবং governance সম্পর্কে প্রাথমিক ধারণা তৈরি করাই এই কোর্সের উদ্দেশ্য।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 0',
    feeNote: 'Completely Free Foundation Course',
    isFree: true,
    imageUrl: '/src/assets/images/course_ai_governance_leadership_1794924812599.jpg',
    imageAlt: 'AI Governance Fundamentals policy and responsibility framework seminar',
    whoThisCourseIsFor: [
      'Policy, administration ও public service-এর সঙ্গে যুক্ত শিক্ষার্থী ও পেশাজীবী',
      'প্রতিষ্ঠানে AI ব্যবহারের নিয়ম ও দায়িত্ব বুঝতে আগ্রহী ব্যক্তি',
      'Global South-এর প্রেক্ষাপটে AI governance জানতে চান এমন শিক্ষার্থী',
    ],
    keyAreas: [
      'AI Governance & Policy Foundations',
      'Principles of Responsible & Human-Centered AI',
      'Algorithmic Bias & Societal Risks',
      'Global Frameworks (UNESCO, OECD, EU AI Act)',
    ],
    learningOutcomes: [
      'AI governance এবং AI ethics-এর মধ্যে পার্থক্য ও প্রাতিষ্ঠানিক প্রাসঙ্গিকতা ব্যাখ্যা করতে পারবেন।',
      'Algorithmic bias, privacy risks এবং misinformation-এর মতো প্রধান AI ঝুঁকিগুলো শনাক্ত করতে পারবেন।',
      'Human-in-the-loop oversight ও দায়িত্বশীল প্রাতিষ্ঠানিক কাঠামোর প্রাথমিক ধারণা প্রয়োগ করতে পারবেন।',
      'UNESCO AI Ethics Recommendation, OECD Principles ও EU AI Act-এর মৌলিক দিকগুলো তুলনা করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'Introduction to AI Governance — governance-এর ভিত্তি',
        topics: [
          'What is AI Governance? What is AI Policy?',
          'AI Governance vs AI Ethics',
          'Why AI Governance Matters',
          'AI Governance in the Global Context',
        ],
      },
      {
        code: 'Module 2',
        title: 'Principles of Responsible AI — মূল নীতিমালা',
        topics: [
          'Transparency and Explainability',
          'Accountability',
          'Fairness and Non-discrimination',
          'Human Oversight',
          'Privacy and Data Protection',
          'Safety and Reliability',
        ],
      },
      {
        code: 'Module 3',
        title: 'AI Risks and Responsibilities — ঝুঁকি ও দায়িত্ব',
        topics: [
          'Algorithmic Bias',
          'Misinformation and Disinformation',
          'Privacy Risks',
          'Automated Decision-making Risks',
          'Human Rights and AI',
          'Risks of Uncontrolled AI Deployment',
        ],
      },
      {
        code: 'Module 4',
        title: 'AI Governance in Practice — প্রাতিষ্ঠানিক প্রয়োগ',
        topics: [
          'Responsible AI Use in Organisations',
          'Basic AI Risk Identification',
          'Institutional AI Policies-এর ধারণা',
          'Roles and Responsibilities',
          'Human-in-the-loop Approach',
        ],
      },
      {
        code: 'Module 5',
        title: 'Global AI Governance Landscape — আন্তর্জাতিক কাঠামো',
        topics: [
          'UNESCO AI Ethics Recommendation-এর পরিচিতি',
          'OECD AI Principles-এর পরিচিতি',
          'EU AI Act-এর মৌলিক ধারণা',
          'Global AI Governance Cooperation',
          'Global South and AI Governance',
        ],
      },
    ],
    practicalSkills: [
      'সাধারণ AI governance risks শনাক্ত করা',
      'Responsible AI principles ব্যাখ্যা করা',
      'AI ব্যবহারে accountability-এর গুরুত্ব বোঝা',
      'প্রতিষ্ঠানে AI ব্যবহারের জন্য মৌলিক governance considerations চিহ্নিত করা',
    ],
    outsideScope: [
      'Advanced AI Law or Legal Practice',
      'Professional Regulatory Compliance Auditing',
      'Full Institutional AI Policy Development',
      'Technical AI Security Engineering',
    ],
    prerequisites: 'কোনো আইন বা কম্পিউটার সায়েন্সের পূর্ব ডিগ্রি প্রয়োজন নেই; AI ব্যবহারে দায়িত্বশীলতা নিয়ে আগ্রহ থাকলেই যথেষ্ট।',
    assessment: 'মডিউলভিত্তিক কেস স্টাডি বিশ্লেষণ ও প্রাথমিক AI Governance Risk Checklist মূল্যায়ন।',
    certificate: 'সকল মডিউল ও মূল্যায়ন সম্পন্ন করলে Non-accredited Certificate of Participation প্রদান করা হয়।',
    registrationNote: 'সম্পূর্ণ বিনামূল্যে (BDT 0) নিবন্ধনযোগ্য। আসন পূর্ণ হওয়ার আগেই আবেদন সম্পন্ন করুন।',
  },
  {
    code: 'AL-101',
    slug: 'generative-ai-prompt-engineering',
    title: 'Generative AI & Prompt Engineering',
    categorySlug: 'ai-literacy',
    categoryName: 'AI Literacy & Foundation',
    tierAccent: 'literacy',
    tierLabel: 'Foundation',
    chipLabel: 'AI Literacy & Foundation',
    level: 'Beginner to Early Intermediate',
    hook: 'Generative AI কীভাবে কাজ করে এবং কার্যকর Prompt কাঠামো লিখে নির্ভুল ও প্রাসঙ্গিক আউটপুট পাওয়ার কৌশল (৳999)।',
    overview:
      'Generative AI ব্যবহার করে কার্যকর ফলাফল পাওয়ার জন্য কীভাবে prompt তৈরি, উন্নয়ন এবং মূল্যায়ন করতে হয়, তা শেখানো হবে। মূল গুরুত্ব থাকবে prompt engineering-এর fundamentals এবং hands-on practice-এর ওপর।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 999',
    feeNote: 'Full 4-Week Course · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_ai_agents_engineering_1794924811129.jpg',
    imageAlt: 'Generative AI and structured prompt engineering training lab',
    whoThisCourseIsFor: [
      'Generative AI ব্যবহার শুরু করেছেন কিন্তু ফলাফল অসঙ্গত পাচ্ছেন এমন শিক্ষার্থী ও পেশাজীবী',
      'লেখা, গবেষণা ও কনটেন্টের কাজে AI-কে আরও নির্ভুলভাবে ব্যবহার করতে চান এমন ব্যক্তি',
    ],
    keyAreas: [
      'Generative AI & LLM Architecture Basics',
      'Anatomy of Effective Prompts',
      'Zero-Shot, Few-Shot & Role Prompting',
      'Iterative Refinement & Multimodal Prompting',
    ],
    learningOutcomes: [
      'Generative AI ও Large Language Models কীভাবে নির্দেশনা অনুধাবন করে তা বুঝতে পারবেন।',
      'অস্পষ্ট নির্দেশনাকে Context, Task, Role এবং Output Format যুক্ত স্পষ্ট প্রম্পটে রূপান্তর করতে পারবেন।',
      'Zero-shot, Few-shot এবং Step-by-step prompting কৌশল বাস্তব কাজে প্রয়োগ করতে পারবেন।',
      'ডকুমেন্ট, টেক্সট ও ভিজ্যুয়াল মাধ্যমে প্রম্পটের আউটপুট যাচাই ও মানোন্নয়ন করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'Understanding Generative AI — মৌলিক ধারণা',
        topics: [
          'What is Generative AI? How Large Language Models Work',
          'Text, Image, Audio and Video Generation',
          'Understanding AI-generated Content',
          'Capabilities and Limitations of Generative AI',
        ],
      },
      {
        code: 'Module 2',
        title: 'Introduction to Prompt Engineering — prompt-এর গঠন',
        topics: [
          'What is a Prompt? How AI Interprets Instructions',
          'Anatomy of an Effective Prompt',
          'Context, Task, Role and Output Format',
          'Common Prompting Mistakes',
        ],
      },
      {
        code: 'Module 3',
        title: 'Core Prompt Engineering Techniques — মূল কৌশল',
        topics: [
          'Zero-shot, Few-shot, Role-based and Contextual Prompting',
          'Step-by-step Instruction Design',
          'Structured Output Prompting',
        ],
      },
      {
        code: 'Module 4',
        title: 'Advanced Prompt Improvement — মান উন্নয়ন',
        topics: [
          'Breaking Complex Tasks into Smaller Tasks',
          'Iterative Prompt Refinement',
          'Adding Constraints and Context',
          'Improving Accuracy and Relevance',
          'Evaluating Prompt Performance',
        ],
      },
      {
        code: 'Module 5',
        title: 'Multimodal Prompting — একাধিক মাধ্যমে কাজ',
        topics: [
          'Text-based Prompting and Image Prompting Fundamentals',
          'Working with Documents and Files',
          'Voice and Audio Interaction',
          'Understanding Multimodal AI Capabilities',
        ],
      },
    ],
    practicalSkills: [
      'কার্যকর prompt তৈরি করা',
      'অস্পষ্ট নির্দেশনাকে পরিষ্কার prompt-এ রূপান্তর করা',
      'AI-generated response উন্নত করা',
      'বিভিন্ন ধরনের task-এর জন্য prompt তৈরি করা',
      'AI-এর output পরীক্ষা ও সংশোধন করা',
    ],
    practicalProject: {
      projectLabel: 'Applied Exercise',
      title: 'Personal Structured Prompt Portfolio',
      prompt:
        'শিক্ষার্থী তাঁর শিক্ষা বা কর্মক্ষেত্রের জন্য ৫টি বাস্তব কাজের ওপর ভিত্তি করে Role, Context, Constraints ও Output Format সমৃদ্ধ প্রম্পট প্যাকেজ তৈরি ও পরিমার্জন করবেন।',
      deliverables: [
        '৫টি ডোমেইন-ভিত্তিক প্রম্পট টেমপ্লেট',
        'Before-vs-After আউটপুট তুলনা ও মানোন্নয়ন নোট',
        'হ্যালুসিনেশন ও ত্রুটি যাচাইয়ের সংক্ষিপ্ত মূল্যায়ন',
      ],
    },
    outsideScope: [
      'AI Application Development',
      'API Integration and Programming',
      'Production-level AI Automation',
      'Training or Fine-tuning AI Models',
    ],
    prerequisites: 'ইন্টারনেট ব্রাউজার ও বেসিক কম্পিউটার বা স্মার্টফোন ব্যবহারের অভিজ্ঞতা।',
    assessment: 'সাপ্তাহিক প্রম্পট অনুশীলন ও সমাপনী পোর্টফোলিও মূল্যায়ন।',
    certificate: 'কোর্স ও অ্যাসাইনমেন্ট সম্পন্ন করলে Atlas AI Education থেকে Non-accredited Certificate of Completion প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহের ব্যাচভিত্তিক কোর্স। ফি BDT 999 (যোগ্য শিক্ষার্থীদের জন্য ৫০% পর্যন্ত স্কলারশিপ সুবিধা রয়েছে)।',
  },
  {
    code: 'AL-102',
    slug: 'ai-everyday-professional-productivity',
    title: 'AI for Everyday & Professional Productivity',
    categorySlug: 'ai-literacy',
    categoryName: 'AI Literacy & Foundation',
    tierAccent: 'literacy',
    tierLabel: 'Foundation',
    chipLabel: 'AI Literacy & Foundation',
    level: 'Beginner to Early Intermediate',
    hook: 'পড়াশোনা, লেখালেখি, ইমেইল, মিটিং নোট ও দৈনন্দিন কাজের গতি বাড়াতে AI-র গোছানো ও ব্যবহারিক প্রয়োগ (৳999)।',
    overview:
      'দৈনন্দিন জীবন, পড়াশোনা এবং সাধারণ পেশাগত কাজে AI ব্যবহার করে সময় সাশ্রয়, কাজের মান উন্নয়ন এবং productivity বৃদ্ধির ব্যবহারিক পদ্ধতি শেখানো হবে।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 999',
    feeNote: 'Full 4-Week Course · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_everyday_productivity_1794924806999.jpg',
    imageAlt: 'Everyday and professional AI productivity tools and workflow',
    whoThisCourseIsFor: [
      'শিক্ষার্থী, চাকরিজীবী ও উদ্যোক্তা যারা রুটিন কাজে সময় বাঁচাতে চান',
      'Email, report ও presentation তৈরিতে AI-এর সহায়তা নিতে আগ্রহী ব্যক্তি',
    ],
    keyAreas: [
      'Daily Planning & Task Organization',
      'Professional Emails, Reports & Meeting Notes',
      'Document Editing & Slide Outlines',
      'Personal AI Productivity Workflows',
    ],
    learningOutcomes: [
      'দৈনিক পরিকল্পনা, নোট সংক্ষিপ্তকরণ এবং গবেষণা সহায়তায় AI-কে সঠিকভাবে কাজে লাগাতে পারবেন।',
      'পেশাদার ইমেইল, রিপোর্ট, মিটিং এজেন্ডা ও কার্যবিবরণী দ্রুত ও নির্ভুলভাবে তৈরি করতে পারবেন।',
      'প্রেজেন্টেশন আউটলাইন ও কাঠামোবদ্ধ ডকুমেন্ট প্রস্তুত এবং প্রুফরিডিং করতে পারবেন।',
      'নিজের দৈনন্দিন কাজের জন্য পুনরাবৃত্তিযোগ্য Personal AI Productivity Routine তৈরি করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'AI for Daily Productivity — দৈনিক কাজের সহায়তা',
        topics: [
          'Daily Planning with AI and Task Organisation',
          'Personal Learning Assistance',
          'Information Summarisation',
          'Research Assistance',
        ],
      },
      {
        code: 'Module 2',
        title: 'AI for Professional Communication — পেশাগত যোগাযোগ',
        topics: [
          'Professional Email Writing and Professional Message Writing',
          'Report Drafting',
          'Meeting Agenda Preparation',
          'Meeting Notes and Summaries',
        ],
      },
      {
        code: 'Module 3',
        title: 'AI for Documents and Presentations — ডকুমেন্ট ও উপস্থাপনা',
        topics: [
          'Document Drafting and Editing',
          'Presentation Outline Creation and Slide Content Development',
          'Proofreading and Content Improvement',
          'Structured Document Preparation',
        ],
      },
      {
        code: 'Module 4',
        title: 'AI for Information and Data Tasks — তথ্য ও ডেটা',
        topics: [
          'Working with Tables and Structured Information',
          'Basic Spreadsheet Assistance',
          'Summarising Data',
          'Understanding Charts and Reports',
          'Extracting Information from Documents',
        ],
      },
      {
        code: 'Module 5',
        title: 'Personal Productivity Workflows — নিজস্ব workflow',
        topics: [
          'AI-assisted Research Workflow',
          'Planning and Scheduling',
          'Content Organisation',
          'Repetitive Task Assistance',
          'Building a Personal AI Productivity Routine',
        ],
      },
    ],
    practicalSkills: [
      'AI দিয়ে professional email ও report তৈরি করা',
      'Meeting notes এবং summaries প্রস্তুত করা',
      'Presentation-এর outline তৈরি করা',
      'Documents ও information বিশ্লেষণে AI ব্যবহার করা',
      'দৈনন্দিন কাজের জন্য AI-assisted workflow তৈরি করা',
    ],
    outsideScope: [
      'Advanced Business Process Automation',
      'Programming and Coding',
      'Professional Financial or Legal Advisory',
      'Advanced Data Science',
      'Enterprise Software Implementation',
    ],
    prerequisites: 'বেসিক ইন্টারনেট ব্যবহার, ইমেইল এবং ডকুমেন্ট/স্প্রেডশিট সম্পর্কে সাধারণ ধারণা।',
    assessment: 'প্র্যাকটিক্যাল অ্যাসাইনমেন্ট (ইমেইল/রিপোর্ট/প্রেজেন্টেশন আউটলাইন) ও পার্সোনাল প্রোডাক্টিভিটি রুটিন সাবমিশন।',
    certificate: 'কোর্স ও অ্যাসাইনমেন্ট সম্পন্ন করলে Non-accredited Certificate of Completion প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 999।',
  },
  {
    code: 'AL-103',
    slug: 'ai-safety-ethics-responsible-use',
    title: 'AI Safety, Ethics & Responsible Use',
    categorySlug: 'ai-literacy',
    categoryName: 'AI Literacy & Foundation',
    tierAccent: 'literacy',
    tierLabel: 'Foundation',
    chipLabel: 'AI Literacy & Foundation',
    level: 'Beginner',
    hook: 'Privacy, algorithmic bias, misinformation ও deepfake বুঝে নিরাপদ ও নৈতিকভাবে AI ব্যবহার করার বাস্তব পদ্ধতি (৳999)।',
    overview:
      'AI ব্যবহার করার সময় কী ধরনের ঝুঁকি তৈরি হতে পারে এবং কীভাবে নিরাপদ, নৈতিক ও দায়িত্বশীলভাবে AI ব্যবহার করা যায়, তা শেখানো হবে। ব্যক্তিগত, শিক্ষাগত ও পেশাগত জীবনে responsible AI practices তৈরি করাই এই কোর্সের লক্ষ্য।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 999',
    feeNote: 'Full 4-Week Course · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_ai_safety_ethics_1794924808097.jpg',
    imageAlt: 'AI Safety Ethics and Responsible Use verification seminar',
    whoThisCourseIsFor: [
      'শিক্ষার্থী, শিক্ষক ও অভিভাবক যারা AI ব্যবহারের ঝুঁকি সম্পর্কে সচেতন হতে চান',
      'কর্মক্ষেত্রে সংবেদনশীল তথ্য নিয়ে কাজ করেন এমন পেশাজীবী',
    ],
    keyAreas: [
      'AI Safety Risks & Harm Awareness',
      'Misinformation, Deepfakes & Fact-Checking',
      'Personal Data & Confidentiality Protection',
      'Ethics, Fairness, Copyright & Academic Integrity',
    ],
    learningOutcomes: [
      'AI-generated misinformation, hallucinations এবং deepfake/synthetic media যাচাই করার প্রাথমিক কৌশল প্রয়োগ করতে পারবেন।',
      'AI প্ল্যাটফর্মে ব্যক্তিগত বা সংবেদনশীল তথ্য শেয়ার করার ঝুঁকি চিনে নিরাপদ ডেটা সুরক্ষা অনুশীলন করতে পারবেন।',
      'Algorithmic bias, কপিরাইট এবং একাডেমিক সততার (academic integrity) মানদণ্ড বজায় রেখে AI ব্যবহার করতে পারবেন।',
      'ব্যক্তিগত বা প্রাতিষ্ঠানিক ব্যবহারের জন্য একটি স্পষ্ট Responsible AI Safety Guideline প্রস্তুত করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'Understanding AI Safety — নিরাপত্তার মৌলিক ধারণা',
        topics: [
          'What is AI Safety? What is Responsible AI?',
          'AI-related Risks and Harms',
          'Understanding AI Limitations',
          'Safe AI Usage Practices',
        ],
      },
      {
        code: 'Module 2',
        title: 'Misinformation and Deepfakes — ভুল তথ্য ও সিনথেটিক মিডিয়া',
        topics: [
          'AI-generated Misinformation',
          'Deepfakes and Synthetic Media',
          'Image, Audio and Video Manipulation',
          'Fact-checking AI-generated Content',
          'Identifying Suspicious Information',
        ],
      },
      {
        code: 'Module 3',
        title: 'Privacy and Data Protection — ব্যক্তিগত তথ্যের সুরক্ষা',
        topics: [
          'Personal Data and AI',
          'Sensitive Information Protection',
          'Risks of Uploading Private Documents',
          'Safe Use of AI Platforms',
          'Basic Data Protection Practices',
        ],
      },
      {
        code: 'Module 4',
        title: 'Ethics and Fairness — নৈতিকতা ও ন্যায্যতা',
        topics: [
          'Bias and Discrimination',
          'Fairness in AI Systems',
          'Human Rights and AI',
          'Copyright and Intellectual Property Awareness',
          'Academic Integrity and Responsible AI Use',
        ],
      },
      {
        code: 'Module 5',
        title: 'Responsible AI in Practice — বাস্তব প্রয়োগ',
        topics: [
          'Verifying AI-generated Information',
          'Human Review and Oversight',
          'Recognising Hallucinations',
          'Responsible AI Use in Education and in the Workplace',
          'Developing Personal AI Safety Guidelines',
        ],
      },
    ],
    practicalSkills: [
      'AI-generated misinformation শনাক্ত করার প্রাথমিক কৌশল',
      'Deepfake ও manipulated content যাচাইয়ের পদ্ধতি',
      'ব্যক্তিগত তথ্য সুরক্ষিত রেখে AI ব্যবহার',
      'AI output যাচাই ও cross-check করা',
      'Responsible AI usage guidelines অনুসরণ করা',
    ],
    outsideScope: [
      'Professional Cybersecurity Training',
      'Digital Forensics',
      'Advanced AI Red-teaming',
      'Legal Investigation or Compliance Certification',
      'Technical AI Model Safety Engineering',
    ],
    prerequisites: 'কোনো কারিগরি ব্যাকগ্রাউন্ডের প্রয়োজন নেই; সাধারণ ডিজিটাল সাক্ষরতা যথেষ্ট।',
    assessment: 'ফ্যাক্ট-চেকিং অনুশীলন ও ব্যক্তিগত Responsible AI Checklist মূল্যায়ন।',
    certificate: 'সকল সেশন ও মূল্যায়ন সম্পন্ন করলে Non-accredited Certificate of Completion প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহের ব্যাচভিত্তিক কোর্স। ফি BDT 999।',
  },
  {
    code: 'AL-104',
    slug: 'ai-tools-literacy-prompt-engineering',
    title: 'AI Tools Literacy & Prompt Engineering',
    categorySlug: 'ai-literacy',
    categoryName: 'AI Literacy & Foundation',
    tierAccent: 'literacy',
    tierLabel: 'Foundation · Advanced Literacy',
    chipLabel: 'AI Literacy & Foundation',
    level: 'Beginner to Intermediate',
    hook: 'প্রয়োজনীয় আধুনিক AI tool-গুলোর সমন্বিত ব্যবহার, তুলনামূলক মূল্যায়ন এবং অ্যাডভান্সড Prompt Engineering দক্ষতা (৳1,499)।',
    overview:
      'বিভিন্ন ধরনের AI tools সম্পর্কে ব্যবহারিক ধারণা তৈরি, সঠিক কাজের জন্য উপযুক্ত tool নির্বাচন এবং একাধিক AI platform-এর কার্যকারিতা মূল্যায়ন শেখানো হবে। শুধু prompt লেখার পরিবর্তে AI tools ecosystem সম্পর্কে hands-on literacy তৈরি করাই এই কোর্সের লক্ষ্য।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 1,499',
    feeNote: 'Full 4-Week Course · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_fullstack_engineering_1794924810463.jpg',
    imageAlt: 'AI Tools Literacy ecosystem and cross-platform prompting workshop',
    whoThisCourseIsFor: [
      'একাধিক AI tool ব্যবহার করেন বা করতে চান, কিন্তু কোনটি কোন কাজে উপযুক্ত তা নিয়ে নিশ্চিত নন এমন ব্যক্তি',
      'নিজের কাজের জন্য একটি ব্যক্তিগত AI toolkit সাজাতে আগ্রহী শিক্ষার্থী ও পেশাজীবী',
    ],
    keyAreas: [
      'AI Tools Ecosystem Classification',
      'Platform Selection & Free vs Paid Assessment',
      'Tool-Specific Prompt Adaptation',
      'Output Verification & Personal AI Toolkit',
    ],
    learningOutcomes: [
      'Text, research, design, presentation ও productivity-র বিভিন্ন AI টুলের শ্রেণিবিভাগ ও সীমাবদ্ধতা ব্যাখ্যা করতে পারবেন।',
      'নির্দিষ্ট কাজের লক্ষ্য ও বাজেট অনুযায়ী সঠিক AI প্ল্যাটফর্ম নির্বাচন ও তুলনামূলক মূল্যায়ন করতে পারবেন।',
      'একই কাজের জন্য একাধিক প্ল্যাটফর্মে প্রম্পট অ্যাডাপ্ট করে মানসম্মত আউটপুট বের করতে পারবেন।',
      'Source verification ও হ্যালুসিনেশন শনাক্তকরণের মাধ্যমে নির্ভরযোগ্য ব্যক্তিগত AI toolkit তৈরি করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'Understanding the AI Tools Ecosystem — tools-এর শ্রেণিবিভাগ',
        topics: [
          'Categories of AI Tools',
          'Text and Writing, Research and Knowledge, Image and Design, Audio and Video tools',
          'Productivity and Presentation Tools',
          'Coding and Development Assistants',
        ],
      },
      {
        code: 'Module 2',
        title: 'Selecting the Right AI Tool — সঠিক tool নির্বাচন',
        topics: [
          'Matching Tools with Tasks',
          'Comparing AI Platforms',
          'Understanding Free and Paid Tool Features',
          'Evaluating Tool Capabilities and Recognising Tool Limitations',
        ],
      },
      {
        code: 'Module 3',
        title: 'Practical AI Tool Applications — ব্যবহারিক প্রয়োগ',
        topics: [
          'AI for Research and Learning',
          'AI for Writing and Communication',
          'AI for Content and Design',
          'AI for Presentations',
          'AI for Information Analysis and Everyday Work',
        ],
      },
      {
        code: 'Module 4',
        title: 'Tool-specific Prompt Engineering — platform অনুযায়ী prompting',
        topics: [
          'Adapting Prompts to Different Platforms',
          'Text, Image and Research Prompting',
          'Structured Instructions',
          'Improving Output Quality',
          'Comparing Results Across Tools',
          'Tool-specific Prompt Limitations',
        ],
      },
      {
        code: 'Module 5',
        title: 'Evaluating AI-generated Outputs — output মূল্যায়ন',
        topics: [
          'Accuracy and Relevance',
          'Source Verification',
          'Output Quality Assessment',
          'Detecting Hallucinations',
          'Comparing Multiple AI Responses',
          'Choosing the Appropriate Tool for a Task',
        ],
      },
      {
        code: 'Module 6',
        title: 'Building a Personal AI Toolkit — নিজস্ব toolkit',
        topics: [
          'Selecting a Personal Set of AI Tools',
          'Creating Task-based Tool Workflows',
          'Organising AI Resources',
          'Responsible Tool Usage',
          'Developing an AI-assisted Learning and Productivity Toolkit',
        ],
      },
    ],
    practicalSkills: [
      'প্রয়োজন অনুযায়ী AI tool নির্বাচন করা',
      'বিভিন্ন AI platform ব্যবহার করা',
      'একই task-এর জন্য বিভিন্ন tool-এর output তুলনা করা',
      'বিভিন্ন platform-এ prompt adapt করা',
      'AI-generated output যাচাই ও মূল্যায়ন করা',
      'নিজের প্রয়োজন অনুযায়ী AI toolkit তৈরি করা',
    ],
    practicalProject: {
      projectLabel: 'Capstone Toolkit',
      title: 'Multi-Platform Personal AI Toolkit & Comparison Matrix',
      prompt:
        'শিক্ষার্থী তাঁর দৈনন্দিন ও পেশাগত ৪টি মূল কাজের জন্য উপযুক্ত AI টুল নির্বাচন, ক্রস-প্ল্যাটফর্ম প্রম্পট টেস্ট এবং আউটপুট যাচাইকরণ ম্যাট্রিক্স তৈরি করবেন।',
      deliverables: [
        'Task-to-Tool সিলেকশন ম্যাট্রিক্স',
        'ক্রস-প্ল্যাটফর্ম প্রম্পট ও আউটপুট মূল্যায়ন রিপোর্ট',
        'দায়িত্বশীল ব্যবহারের নির্দেশিকাসহ Personal AI Toolkit ডকুমেন্ট',
      ],
    },
    outsideScope: [
      'Professional AI Software Development',
      'API-based Tool Integration',
      'Advanced No-code or Code-based Automation',
      'AI Model Training and Fine-tuning',
      'Enterprise AI System Deployment',
    ],
    prerequisites: 'বেসিক কম্পিউটার ও ইন্টারনেট ব্যবহারের দক্ষতা। AL-101 সম্পর্কে ধারণা থাকলে সহায়ক, তবে বাধ্যতামূলক নয়।',
    assessment: 'মডিউলভিত্তিক প্র্যাকটিক্যাল অনুশীলন এবং সমাপনী Personal AI Toolkit প্রজেক্ট মূল্যায়ন।',
    certificate: 'সকল মডিউল ও প্রজেক্ট সম্পন্ন করলে Non-accredited Certificate of Completion প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি ক্লাস। ফি BDT 1,499।',
  },

  // =========================================================================
  // CATEGORY 2: APPLIED AI (4 Courses: AP-201 .. AP-204, BDT 1,200 Each)
  // =========================================================================
  {
    code: 'AP-201',
    slug: 'ai-powered-content-creation',
    title: 'AI-Powered Content Creation',
    categorySlug: 'applied-ai',
    categoryName: 'Applied AI',
    tierAccent: 'applied',
    tierLabel: 'Applied Track',
    chipLabel: 'Applied AI',
    level: 'Beginner to Intermediate',
    hook: 'AI-র সহায়তায় ব্লগ, সোশ্যাল মিডিয়া, ভিডিও স্ক্রিপ্ট, স্লাইড ও ভিজ্যুয়াল কনটেন্ট তৈরির পূর্ণাঙ্গ কর্মপ্রবাহ (৳1,200)।',
    overview:
      'এই প্র্যাকটিক্যাল কোর্সে লেখক, ক্রিয়েটর, শিক্ষার্থী ও মার্কেটিং টিমের জন্য AI ব্যবহার করে কাঠামোবদ্ধ কনটেন্ট প্ল্যানিং, ব্র্যান্ড ভয়েস ধরে রেখে রাইটিং, ভিজ্যুয়াল এসেট জেনারেশন এবং নৈতিক ও কপিরাইট-সচেতন প্রকাশনা প্রক্রিয়া শেখানো হয়।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 1,200',
    feeNote: 'Full 4-Week Applied Course · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_digital_creation_1794924807458.jpg',
    imageAlt: 'AI-Powered Content Creation visual and editorial workflow',
    whoThisCourseIsFor: [
      'ডিজিটাল কনটেন্ট ক্রিয়েটর, লেখক ও সোশ্যাল মিডিয়া ম্যানেজার',
      'শিক্ষাগত বা প্রাতিষ্ঠানিক কমিউনিকেশন কনটেন্ট তৈরি করতে আগ্রহী শিক্ষার্থী ও পেশাজীবী',
    ],
    keyAreas: [
      'Editorial Planning & Audience Messaging',
      'Long-Form & Social Copywriting with Brand Voice',
      'AI Visual Design & Presentation Assets',
      'Scriptwriting, Editing & Copyright Hygiene',
    ],
    learningOutcomes: [
      'টার্গেট অডিয়েন্স অনুযায়ী মাসিক কনটেন্ট পিলার ও এডিটোরিয়াল ক্যালেন্ডার তৈরি করতে পারবেন।',
      'মানুষের মৌলিক চিন্তা ও ব্র্যান্ডের স্বকীয়তা অক্ষুণ্ন রেখে ব্লগ, সোশ্যাল পোস্ট ও স্ক্রিপ্ট খসড়া ও সম্পাদনা করতে পারবেন।',
      'ইমেজ ও ভিজ্যুয়াল প্রম্পট লিখে কনটেন্ট-সঙ্গত গ্রাফিক্স ও স্লাইড তৈরি করতে পারবেন।',
      'কপিরাইট, তথ্যের সত্যতা যাচাই ও দায়িত্বশীল সিন্থেটিক মিডিয়া প্রকাশনার মানদণ্ড অনুসরণ করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'Content Strategy & Audience Mapping with AI',
        topics: [
          'Defining audience personas and content pillars',
          'Researching reader questions and topic gaps',
          'Building structured editorial calendars',
        ],
      },
      {
        code: 'Module 2',
        title: 'Written Content & Tone Consistency',
        topics: [
          'Drafting articles, newsletters and bilingual Bengali/English copy',
          'Maintaining human editorial voice and eliminating generic AI tone',
          'Fact-checking statistics, citations and claims',
        ],
      },
      {
        code: 'Module 3',
        title: 'Visual Assets, Slides & Video Script Workflows',
        topics: [
          'Writing effective image generation prompts for illustrations and thumbnails',
          'Structuring short-form and educational video scripts',
          'Creating cohesive presentation decks',
        ],
      },
      {
        code: 'Module 4',
        title: 'Editorial Review, Copyright & Responsible Publishing',
        topics: [
          'Plagiarism checks, source attribution and intellectual property awareness',
          'Disclosure guidelines for AI-assisted media',
          'Multi-platform repurposing workflow',
        ],
      },
    ],
    practicalSkills: [
      'মাল্টি-চ্যানেল কনটেন্ট ক্যালেন্ডার ডিজাইন',
      'ব্র্যান্ড ভয়েস অনুযায়ী প্রম্পট কাস্টমাইজেশন',
      'ভিজ্যুয়াল ও স্ক্রিপ্ট জেনারেশন',
      'ফ্যাক্ট-চেক ও কপিরাইট রিভিউ',
    ],
    practicalProject: {
      projectLabel: 'Applied Project',
      title: 'Multi-Format Campaign Content Pack',
      prompt:
        'শিক্ষার্থী একটি নির্বাচিত বিষয় বা উদ্যোগের জন্য ৭-দিনের মাল্টি-ফরম্যাট কনটেন্ট প্যাক তৈরি করবেন যেখানে আর্টিকেল, সোশ্যাল পোস্ট, স্ক্রিপ্ট ও ভিজ্যুয়াল ডিরেকশন থাকবে।',
      deliverables: [
        'Content Strategy & Audience Brief',
        '১টি দীর্ঘ-ফরম্যাট ব্লগ/নিবন্ধ ও ৩টি সোশ্যাল মিডিয়া পোস্ট',
        '১টি ২-মিনিটের ভিডিও স্ক্রিপ্ট ও ভিজ্যুয়াল প্রম্পট গাইড',
      ],
    },
    outsideScope: [
      'Commercial Ad Media Buying',
      'Full-Scale Graphic Design Certification',
      'Video Production & Motion VFX Engineering',
    ],
    prerequisites: 'বেসিক রাইটিং ও ইন্টারনেট ব্যবহারের দক্ষতা।',
    assessment: 'প্র্যাকটিক্যাল কনটেন্ট প্যাক মূল্যায়ন ও ইনস্ট্রাক্টর ফিডব্যাক।',
    certificate: 'কোর্স ও প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 1,200।',
  },
  {
    code: 'AP-202',
    slug: 'ai-for-business-entrepreneurship',
    title: 'AI for Business & Entrepreneurship',
    categorySlug: 'applied-ai',
    categoryName: 'Applied AI',
    tierAccent: 'applied',
    tierLabel: 'Applied Track',
    chipLabel: 'Applied AI',
    level: 'Intermediate',
    hook: 'উদ্যোক্তা ও ক্ষুদ্র ব্যবসার অপারেশন, কাস্টমার সার্ভিস, মার্কেট রিসার্চ ও খরচ কমাতে AI-র কার্যকর ব্যবহার (৳1,200)।',
    overview:
      'নতুন উদ্যোক্তা ও ক্ষুদ্র/মাঝারি ব্যবসা পরিচালকদের জন্য ডিজাইন করা এই কোর্সে মার্কেট ভ্যালিডেশন, বিজনেস প্ল্যানিং, কাস্টমার সাপোর্ট টেমপ্লেট এবং দৈনন্দিন অপারেশনাল দক্ষতা বাড়াতে AI কীভাবে সহায়ক ভূমিকা রাখে তা হাতে-কলমে শেখানো হয়।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 1,200',
    feeNote: 'Full 4-Week Applied Course · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_business_transformation_1794924809638.jpg',
    imageAlt: 'AI for Business and Entrepreneurship operational planning session',
    whoThisCourseIsFor: [
      'ক্ষুদ্র ও মাঝারি ব্যবসার মালিক, উদ্যোক্তা ও স্টার্টআপ ফাউন্ডার',
      'স্ব-উদ্যোগে ব্যবসা পরিকল্পনা ও অপারেশন সহজ করতে চান এমন শিক্ষার্থী ও পেশাজীবী',
    ],
    keyAreas: [
      'Market Validation & Competitor Mapping',
      'Business Model & Lean Financial Narratives',
      'Customer Support & Sales Communication SOPs',
      'Small-Team Operational Productivity & Data Privacy',
    ],
    learningOutcomes: [
      'AI সহায়তায় দ্রুত মার্কেট ট্রেন্ড, প্রতিযোগী বিশ্লেষণ ও ক্রেতার চাহিদা যাচাই করতে পারবেন।',
      'ব্যবসায়িক প্রস্তাবনা, প্রোডাক্ট ডিসক্রিপশন ও কাস্টমার FAQ সিস্টেম তৈরি করতে পারবেন।',
      'ছোট টিমের দৈনন্দিন ইনভেন্টরি নোট, রিপোর্টিং ও অপারেশনাল SOP সাজাতে পারবেন।',
      'ক্রেতার ব্যক্তিগত তথ্যের নিরাপত্তা ও ব্যবসার নৈতিক মানদণ্ড বজায় রেখে AI প্রয়োগ করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'AI-Assisted Market Discovery & Business Modelling',
        topics: [
          'Identifying local customer pain points and market gaps',
          'Structuring Lean Canvas and value propositions with AI',
          'Validating AI market assumptions against real-world data',
        ],
      },
      {
        code: 'Module 2',
        title: 'Product Positioning, Pricing Narratives & Pitching',
        topics: [
          'Writing clear product catalogues and value messaging',
          'Preparing partner and supplier outreach briefs',
          'Developing structured pitch outlines',
        ],
      },
      {
        code: 'Module 3',
        title: 'Customer Experience & Operations Efficiency',
        topics: [
          'Designing customer support response libraries and FAQ templates',
          'Standardising recurring operational checklists and SOPs',
          'Organising customer feedback to improve service quality',
        ],
      },
      {
        code: 'Module 4',
        title: 'Budgeting Basics & Responsible Business AI',
        topics: [
          'Drafting expense trackers and cash-flow checklist templates',
          'Protecting customer PII and confidential business records',
          'Evaluating tool ROI before committing to paid subscriptions',
        ],
      },
    ],
    practicalSkills: [
      'Lean Canvas ও Market Research Brief তৈরি',
      'Customer Support SOP ও FAQ ফ্রেমওয়ার্ক তৈরি',
      'অপারেশনাল চেকলিস্ট ও ব্যয় ট্র্যাকার ডিজাইন',
    ],
    practicalProject: {
      projectLabel: 'Applied Project',
      title: 'Small Business AI Operations & Growth Kit',
      prompt:
        'একটি বাস্তব বা পরিকল্পিত ক্ষুদ্র ব্যবসার জন্য মার্কেট ব্রিফ, কাস্টমার সার্ভিস রিপ্লাই কিট এবং অপারেশনাল ডকুমেন্টেশন প্যাকেজ তৈরি করুন।',
      deliverables: [
        'Lean Business & Market Research Brief',
        'Customer Support FAQ & Response Library',
        'Weekly Operations & Expense Review Checklist',
      ],
    },
    outsideScope: [
      'Guaranteed Revenue or Business Funding',
      'Company Legal Registration or Tax Filing Advice',
      'Enterprise ERP Engineering',
    ],
    prerequisites: 'ব্যবসা পরিচালনা বা নতুন উদ্যোগ সম্পর্কে সাধারণ আগ্রহ ও কম্পিউটার দক্ষতা।',
    assessment: 'Business AI Kit প্রজেক্ট সাবমিশন ও মেন্টর ফিডব্যাক।',
    certificate: 'কোর্স ও প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 1,200।',
  },
  {
    code: 'AP-203',
    slug: 'ai-automation-workflow-design',
    title: 'AI Automation & Workflow Design',
    categorySlug: 'applied-ai',
    categoryName: 'Applied AI',
    tierAccent: 'applied',
    tierLabel: 'Applied Track',
    chipLabel: 'Applied AI',
    level: 'Intermediate',
    hook: 'পুনরাবৃত্তিমূলক দাপ্তরিক কাজগুলোকে No-code tool, webhook ও human-in-the-loop AI workflow-তে রূপান্তর করা (৳1,200)।',
    overview:
      'কোনো জটিল কোডিং ছাড়াই কীভাবে ফর্ম ডেটা, ইমেইল, স্প্রেডশিট এবং AI সামারি বা ক্লাসিফিকেশন ধাপগুলোকে সংযুক্ত করে নিরাপদ ও কার্যকর অটোমেশন তৈরি করা যায়, তা এই কোর্সে হাতে-কলমে শেখানো হয়।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 1,200',
    feeNote: 'Full 4-Week Applied Course · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_workflow_automation_1794924807818.jpg',
    imageAlt: 'AI Automation and no-code workflow orchestration design diagram',
    whoThisCourseIsFor: [
      'প্রশাসনিক, অপারেশন ও প্রজেক্ট সমন্বয়কারী যারা ম্যানুয়াল ডেটা এন্ট্রি কমাতে চান',
      'No-code অটোমেশন ও প্র্যাকটিক্যাল AI ওয়ার্কফ্লো ডিজাইন শিখতে আগ্রহী ব্যক্তি',
    ],
    keyAreas: [
      'Workflow Mapping & Bottleneck Analysis',
      'Triggers, Actions, Webhooks & JSON Basics',
      'Integrating Forms, Sheets & AI Processing Steps',
      'Error Handling & Human-in-the-Loop Controls',
    ],
    learningOutcomes: [
      'দৈনন্দিন কাজের কোন অংশ অটোমেশনযোগ্য এবং কোথায় মানুষের সিদ্ধান্ত জরুরি তা চিহ্নিত করতে পারবেন।',
      'Triggers, actions, filters এবং webhooks ব্যবহার করে মাল্টি-স্টেপ ওয়ার্কফ্লো ডিজাইন করতে পারবেন।',
      'AI summarization ও classification ধাপ যুক্ত করে ফর্ম ও স্প্রেডশিট ডেটা প্রসেস করতে পারবেন।',
      'অটোমেশন ব্যর্থতা, ডুপ্লিকেট এন্ট্রি ও ডেটা গোপনীয়তার ঝুঁকি মোকাবিলায় সেফগার্ড যুক্ত করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'Process Mapping & Automation Readiness',
        topics: [
          'Auditing repetitive office and digital workflows',
          'Identifying triggers, inputs, decisions and outputs',
          'When NOT to automate: privacy and error risk criteria',
        ],
      },
      {
        code: 'Module 2',
        title: 'No-Code Automation Building Blocks',
        topics: [
          'Connecting forms, spreadsheets, calendars and email',
          'Understanding webhooks and structured JSON payloads simply',
          'Conditional branching and data formatting',
        ],
      },
      {
        code: 'Module 3',
        title: 'Adding AI Steps & Structured Prompts in Workflows',
        topics: [
          'Designing reliable structured outputs for automation',
          'Routing, tagging and summarising incoming inquiries',
          'Adding human-in-the-loop approval checkpoints',
        ],
      },
      {
        code: 'Module 4',
        title: 'Testing, Error Handling & Documentation',
        topics: [
          'Handling edge cases, rate limits and fallback alerts',
          'Sanitising sensitive personal information before AI calls',
          'Writing handover documentation for team workflows',
        ],
      },
    ],
    practicalSkills: [
      'Process Flowchart ও Bottleneck বিশ্লেষণ',
      'No-code অটোমেশন ও Webhook সংযোগ',
      'Structured AI Output এবং Human Review গেট ডিজাইন',
    ],
    practicalProject: {
      projectLabel: 'Applied Project',
      title: 'Human-Reviewed Inquiry Triage Workflow Blueprint',
      prompt:
        'ফর্ম থেকে প্রাপ্ত তথ্য সংগ্রহ, AI-এর মাধ্যমে শ্রেণিবিন্যাস ও খসড়া উত্তর তৈরি এবং মানব অনুমোদনের (human-in-the-loop) জন্য সংরক্ষণের একটি সম্পূর্ণ ওয়ার্কফ্লো ডিজাইন করুন।',
      deliverables: [
        'Workflow Architecture Diagram ও Field Schema',
        'AI Classification Prompt ও Error-Handling Checklist',
        'ডকুমেন্টেশন ও ডেটা প্রাইভেসি রিভিউ নোট',
      ],
    },
    outsideScope: [
      'Custom Enterprise Backend Microservices',
      'Production Kubernetes / Cloud DevOps Engineering',
      'Bypassing Platform Security Policies',
    ],
    prerequisites: 'স্প্রেডশিট ও অনলাইন ফর্ম ব্যবহারের প্রাথমিক অভিজ্ঞতা। কোডিং পূর্বশর্ত নয়।',
    assessment: 'ওয়ার্কফ্লো ব্লুপ্রিন্ট ও প্র্যাকটিক্যাল টেস্ট কেস সাবমিশন।',
    certificate: 'কোর্স ও প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 1,200।',
  },
  {
    code: 'AP-204',
    slug: 'ai-powered-website-development',
    title: 'AI-Powered Website Development',
    categorySlug: 'applied-ai',
    categoryName: 'Applied AI',
    tierAccent: 'applied',
    tierLabel: 'Applied Track',
    chipLabel: 'Applied AI',
    level: 'Intermediate',
    hook: 'AI-assisted coding ও আধুনিক ওয়েব টেকনোলজি ব্যবহার করে নিজস্ব responsive website পরিকল্পনা, তৈরি ও deploy করা (৳1,200)।',
    overview:
      'ওয়েবসাইট কীভাবে কাজ করে তা বুঝে এবং AI coding assistant-কে সঠিকভাবে গাইড করে কীভাবে পরিচ্ছন্ন, মোবাইল-রেসপন্সিভ ও ব্যবহারবান্ধব ওয়েবসাইট তৈরি, যাচাই ও লাইভ পাবলিশ করা যায়—তা এই কোর্সের মূল লক্ষ্য।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 1,200',
    feeNote: 'Full 4-Week Applied Course · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_website_development_1794924809286.jpg',
    imageAlt: 'AI-Powered Website Development responsive interface and coding workflow',
    whoThisCourseIsFor: [
      'শিক্ষার্থী, ফ্রিল্যান্সার ও উদ্যোক্তা যারা নিজের বা উদ্যোগের জন্য ওয়েবসাইট তৈরি করতে চান',
      'AI coding assistant ব্যবহার করে দ্রুত ও সঠিকভাবে ওয়েব পেজ তৈরি শিখতে আগ্রহী ব্যক্তি',
    ],
    keyAreas: [
      'Web Foundations (HTML, CSS & Responsive Layout)',
      'Prompting AI Assistants for Clean UI Components',
      'Debugging, Accessibility & SEO Basics',
      'Static Deployment & Custom Domain Basics',
    ],
    learningOutcomes: [
      'ওয়েবসাইটের কাঠামো (HTML, CSS ও বেসিক JavaScript) এবং রেসপন্সিভ ডিজাইনের মূলনীতি বুঝতে পারবেন।',
      'AI কোডিং টুলকে স্পষ্ট কনটেক্সট ও স্পেসিফিকেশন দিয়ে মডুলার সেকশন তৈরি করতে পারবেন।',
      'AI-জেনারেটেড কোডে বাগ শনাক্ত, অ্যাক্সেসিবিলিটি ও পেজ স্পিড যাচাই করতে পারবেন।',
      'নিজস্ব তৈরি ওয়েবসাইট নিরাপদে ক্লাউড/স্ট্যাটিক হোস্টিংয়ে ডিপ্লয় করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'Web Fundamentals & Information Architecture',
        topics: [
          'Understanding HTML semantics, CSS layout (Flexbox/Grid) and mobile responsiveness',
          'Planning sitemap, page hierarchy and clear user journeys',
          'Preparing brand copy, colour palette and imagery before prompting code',
        ],
      },
      {
        code: 'Module 2',
        title: 'Prompting AI for Structured Front-End Components',
        topics: [
          'Breaking pages into reusable navigation, hero, card and footer sections',
          'Writing technical prompts with layout and constraint specifications',
          'Iterating on spacing, typography and responsive breakpoints',
        ],
      },
      {
        code: 'Module 3',
        title: 'Testing, Debugging & Accessibility Verification',
        topics: [
          'Inspecting browser DevTools for layout and console issues',
          'Checking heading hierarchy, alt text, contrast and keyboard navigation',
          'Spotting security pitfalls like exposed keys or unsafe form handling',
        ],
      },
      {
        code: 'Module 4',
        title: 'SEO Metadata & Live Website Deployment',
        topics: [
          'Configuring page titles, meta descriptions and Open Graph tags',
          'Deploying static websites cleanly using modern hosting workflows',
          'Ongoing content maintenance and version hygiene',
        ],
      },
    ],
    practicalSkills: [
      'ওয়েবসাইট ওয়্যারফ্রেম ও সেকশন প্ল্যানিং',
      'AI কোডিং প্রম্পট ও কম্পোনেন্ট ইটারেশন',
      'ব্রাউজার ইন্সপেকশন, অ্যাক্সেসিবিলিটি চেক ও ডিপ্লয়মেন্ট',
    ],
    practicalProject: {
      projectLabel: 'Applied Project',
      title: 'Live Responsive Portfolio or Initiative Website',
      prompt:
        'একটি ব্যক্তিগত পোর্টফোলিও বা কমিউনিটি উদ্যোগের জন্য ন্যূনতম ৪ সেকশনবিশিষ্ট মোবাইল-রেসপন্সিভ ওয়েবসাইট তৈরি করে ডিপ্লয় ও ভেরিফাই করুন।',
      deliverables: [
        'Information Architecture & Visual Spec',
        'রেসপন্সিভ ওয়েবসাইট সোর্স ও লাইভ প্রিভিউ লিঙ্ক',
        'Accessibility ও SEO চেকলিস্ট রিপোর্ট',
      ],
    },
    outsideScope: [
      'Full-Stack Distributed Microservices Engineering',
      'Custom Payment Gateway PCI-DSS Certification',
      'Enterprise Cloud Infrastructure Security Audits',
    ],
    prerequisites: 'বেসিক কম্পিউটার ব্যবহার ও ওয়েব ব্রাউজার চালানোর অভিজ্ঞতা। পূর্ব কোডিং অভিজ্ঞতা আবশ্যক নয়।',
    assessment: 'ডিপ্লয়েড ওয়েবসাইট প্রজেক্ট ও কোড/অ্যাক্সেসিবিলিটি রিভিউ।',
    certificate: 'কোর্স ও প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 1,200।',
  },

  // =========================================================================
  // CATEGORY 3: PROFESSIONAL DEVELOPMENT (7 Courses: PD-301 .. PD-307, BDT 2,500)
  // =========================================================================
  {
    code: 'PD-301',
    slug: 'ai-for-professionals-workplace-productivity',
    title: 'AI for Professionals & Workplace Productivity',
    categorySlug: 'professional-development',
    categoryName: 'Professional Development',
    tierAccent: 'professional',
    tierLabel: 'Professional Track',
    chipLabel: 'Professional Development',
    level: 'Intermediate',
    hook: 'কর্পোরেট ও প্রাতিষ্ঠানিক কর্মক্ষেত্রে রিপোর্টিং, সমন্বয়, বিশ্লেষণ ও দৈনন্দিন কর্মদক্ষতা বৃদ্ধির সমন্বিত প্রয়োগ (৳2,500)।',
    overview:
      'This programme helps professionals integrate AI into their everyday work to improve productivity, communication, research, documentation and decision-making. Participants will learn to use AI as a practical work assistant while maintaining professional judgement, accuracy and accountability.',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 2,500',
    feeNote: 'Full 4-Week Professional Track · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_everyday_productivity_1794924806999.jpg',
    imageAlt: 'AI for Professionals and Workplace Productivity executive workshop',
    whoThisCourseIsFor: [
      'Corporate and private-sector professionals',
      'Government and public-sector employees',
      'NGO and development-sector professionals',
      'Administrative and programme officers',
      'Consultants, researchers and independent professionals',
      'Early and mid-career professionals',
    ],
    keyAreas: [
      'Advanced Prompting for Professional Tasks',
      'AI-Powered Communication & Documentation',
      'Research, Knowledge Management & Verification',
      'Spreadsheets, Reporting & Responsible AI at Work',
    ],
    learningOutcomes: [
      'Integrate AI into professional workflows to produce higher-quality briefs, reports, emails, and meeting documentation.',
      'Conduct structured AI-assisted desk research while verifying sources and eliminating hallucinations.',
      'Use AI to organise spreadsheets, interpret trends, and build management-ready reporting narratives.',
      'Apply confidentiality, data privacy, and human-oversight standards through a personal responsible AI workplace framework.',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'AI in the Modern Professional Workplace',
        topics: [
          "Understanding AI's role in professional environments",
          'Generative AI and workplace applications',
          'Identifying tasks suitable for AI assistance',
          'AI-assisted versus human-led work',
          'Understanding limitations and professional responsibility',
        ],
      },
      {
        code: 'Module 2',
        title: 'Advanced Prompting for Professional Tasks',
        topics: [
          'Structuring effective professional prompts',
          'Context, role, objective and output specification',
          'Multi-step prompting techniques',
          'Prompt refinement and response evaluation',
          'Building reusable prompt templates for recurring tasks',
        ],
      },
      {
        code: 'Module 3',
        title: 'AI-Powered Communication & Documentation',
        topics: [
          'Drafting professional emails and correspondence',
          'Preparing reports, proposals and briefing notes',
          'Meeting agendas, minutes and action-point extraction',
          'Executive summaries and document simplification',
          'Professional tone, clarity and audience adaptation',
        ],
      },
      {
        code: 'Module 4',
        title: 'Research, Information & Knowledge Management',
        topics: [
          'AI-assisted desk research',
          'Information extraction and synthesis',
          'Summarising long reports and documents',
          'Comparing multiple sources and perspectives',
          'Fact-checking and source verification',
          'Building structured knowledge repositories',
        ],
      },
      {
        code: 'Module 5',
        title: 'AI for Data, Spreadsheets & Reporting',
        topics: [
          'AI-assisted spreadsheet operations',
          'Data cleaning and organisation',
          'Basic data interpretation and trend identification',
          'Generating charts and narrative summaries',
          'Preparing management-ready reports',
          'Understanding the risks of inaccurate AI-generated analysis',
        ],
      },
      {
        code: 'Module 6',
        title: 'Personal Productivity & Workflow Optimisation',
        topics: [
          'Task prioritisation and planning',
          'AI-assisted scheduling and work organisation',
          'Automating repetitive administrative tasks',
          'Creating personal productivity workflows',
          'Improving time management and task execution',
        ],
      },
      {
        code: 'Module 7',
        title: 'Responsible AI at Work',
        topics: [
          'Confidentiality and sensitive workplace information',
          'Data privacy and information security',
          'Reviewing AI-generated professional outputs',
          'Bias, hallucinations and reliability',
          'Human oversight and accountability',
          'Developing a personal responsible AI usage framework',
        ],
      },
    ],
    practicalSkills: [
      'Produce professional documents with AI assistance',
      'Research and synthesise complex information',
      'Prepare structured reports and presentations',
      'Work more efficiently with spreadsheets and data',
      'Design repeatable productivity workflows',
      'Evaluate AI-generated outputs before professional use',
    ],
    practicalProject: {
      projectLabel: 'Capstone Project',
      title: 'AI-Enabled Professional Productivity Portfolio',
      prompt:
        'Participants compile a workplace-ready productivity portfolio integrating reusable prompt systems, executive documentation, research synthesis, and data security safeguards.',
      deliverables: [
        'A professional prompt library',
        'An AI-assisted report or briefing document',
        'A meeting documentation workflow',
        'A research and information synthesis exercise',
        'A personal AI productivity workflow',
        'A responsible AI usage checklist',
      ],
    },
    outsideScope: [
      'Advanced software engineering',
      'Professional data science and statistical modelling',
      'Enterprise-scale automation implementation',
      'Specialised legal, financial or medical advice',
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: 'কম্পিউটার, ইন্টারনেট সংযোগ ও সাধারণ অফিসিয়াল ডকুমেন্ট/স্প্রেডশিট ব্যবহারের অভিজ্ঞতা।',
    assessment: 'সাপ্তাহিক কেস স্টাডি ও সমাপনী Capstone Project মূল্যায়ন।',
    certificate: 'সকল মডিউল ও Capstone প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 2,500 (সর্বোচ্চ ৫০% স্কলারশিপ সুবিধাযোগ্য)।',
  },
  {
    code: 'PD-302',
    slug: 'ai-for-business-development',
    title: 'AI for Business Development',
    categorySlug: 'professional-development',
    categoryName: 'Professional Development',
    tierAccent: 'professional',
    tierLabel: 'Professional Track',
    chipLabel: 'Professional Development',
    level: 'Intermediate',
    hook: 'মার্কেট ইন্টেলিজেন্স, ক্লায়েন্ট প্রোপোজাল, পার্টনারশিপ ও বিজনেস গ্রোথ পাইপলাইনে AI-র কৌশলগত ব্যবহার (৳2,500)।',
    overview:
      'This programme focuses on using AI to strengthen business development capabilities, identify market opportunities, understand customers, develop partnerships, improve sales processes and support sustainable organisational growth. Participants will learn how AI can support business research, opportunity assessment, strategic planning and relationship management.',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 2,500',
    feeNote: 'Full 4-Week Professional Track · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_business_transformation_1794924809638.jpg',
    imageAlt: 'AI for Business Development market intelligence and partnership strategy',
    whoThisCourseIsFor: [
      'Business development professionals',
      'Entrepreneurs and business owners',
      'Sales and growth executives',
      'Partnership and relationship managers',
      'Consultants and independent professionals',
      'Startup founders and aspiring entrepreneurs',
    ],
    keyAreas: [
      'Market Intelligence & Opportunity Research',
      'Customer Personas & Value Propositions',
      'Sales Strategy, Lead Qualification & Proposals',
      'Partnerships, SWOT & Ethical Intelligence Verification',
    ],
    learningOutcomes: [
      'Use AI to research industry trends, segment markets, analyse competitors, and validate market intelligence responsibly.',
      'Build detailed customer personas, journey maps, and clear value propositions aligned with buyer pain points.',
      'Design AI-assisted lead qualification frameworks, tailored outreach messages, and structured partnership proposals.',
      'Protect client confidentiality and avoid fabricated intelligence in commercial decision-making.',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'AI and the Business Development Landscape',
        topics: [
          'Understanding business development functions',
          'AI applications across the business lifecycle',
          'Opportunity identification through AI',
          'AI-assisted business intelligence',
          'Selecting appropriate AI tools for business needs',
        ],
      },
      {
        code: 'Module 2',
        title: 'Market Intelligence & Opportunity Research',
        topics: [
          'AI-assisted industry research',
          'Identifying market gaps and emerging opportunities',
          'Competitor and sector analysis',
          'Market segmentation',
          'Customer needs and demand assessment',
          'Validating AI-generated market information',
        ],
      },
      {
        code: 'Module 3',
        title: 'Customer Intelligence & Value Proposition',
        topics: [
          'Customer persona development',
          'Understanding customer pain points',
          'Customer journey mapping',
          'Value proposition development',
          'Product and service positioning',
          'AI-assisted customer feedback analysis',
        ],
      },
      {
        code: 'Module 4',
        title: 'Sales Strategy & Lead Development',
        topics: [
          'AI-assisted lead research and qualification',
          'Prospect segmentation',
          'Sales communication and outreach',
          'Proposal and pitch development',
          'Sales pipeline planning',
          'Personalised customer engagement',
        ],
      },
      {
        code: 'Module 5',
        title: 'Partnerships, Networking & Strategic Engagement',
        topics: [
          'Identifying potential partners',
          'Partnership opportunity mapping',
          'Preparing collaboration proposals',
          'Stakeholder mapping',
          'AI-assisted meeting preparation',
          'Relationship management documentation',
        ],
      },
      {
        code: 'Module 6',
        title: 'Business Growth & Performance Analysis',
        topics: [
          'Growth strategy development',
          'AI-assisted SWOT analysis',
          'Identifying business performance indicators',
          'Sales and customer trend analysis',
          'Preparing business development reports',
          'Evaluating growth opportunities',
        ],
      },
      {
        code: 'Module 7',
        title: 'Responsible AI for Business Development',
        topics: [
          'Protecting customer and business information',
          'Accuracy in market and competitor research',
          'Avoiding fabricated business intelligence',
          'Ethical customer engagement',
          'Human verification and decision-making',
          'Developing an AI-supported business development plan',
        ],
      },
    ],
    practicalSkills: [
      'Market and competitor research',
      'Customer persona development',
      'Lead research and qualification',
      'Sales communication and proposal writing',
      'Partnership opportunity mapping',
      'Business growth planning',
      'AI-assisted business reporting',
    ],
    practicalProject: {
      projectLabel: 'Capstone Project',
      title: 'AI-Assisted Business Development Strategy',
      prompt:
        'Participants construct a complete 90-day business development and partnership blueprint grounded in verified market and customer intelligence.',
      deliverables: [
        'An industry and market research brief',
        'A competitor analysis',
        'Customer personas and target segments',
        'A value proposition',
        'A lead generation and outreach framework',
        'A partnership opportunity map',
        'A 90-day business development action plan',
      ],
    },
    outsideScope: [
      'Guaranteed sales or revenue generation',
      'Professional investment and financial advisory',
      'Legal company registration services',
      'Advanced CRM software implementation',
      'Enterprise sales management certification',
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: 'ব্যবসায়িক উন্নয়ন, সেলস বা উদ্যোগ পরিচালনার প্রাথমিক ধারণা এবং কম্পিউটার ও ইন্টারনেট সংযোগ।',
    assessment: 'প্র্যাকটিক্যাল মার্কেট ও প্রোপোজাল অনুশীলন এবং Capstone Strategy মূল্যায়ন।',
    certificate: 'সকল মডিউল ও Capstone প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 2,500 (সর্বোচ্চ ৫০% স্কলারশিপ সুবিধাযোগ্য)।',
  },
  {
    code: 'PD-303',
    slug: 'ai-leadership-strategic-management',
    title: 'AI Leadership & Strategic Management',
    categorySlug: 'professional-development',
    categoryName: 'Professional Development',
    tierAccent: 'professional',
    tierLabel: 'Professional Track',
    chipLabel: 'Professional Development',
    level: 'Intermediate to Advanced',
    hook: 'প্রতিষ্ঠানের কৌশলগত পরিকল্পনা, AI adoption রোডম্যাপ, টিম রূপান্তর ও ঝুঁকি ব্যবস্থাপনা নেতৃত্ব (৳2,500)।',
    overview:
      'This programme prepares managers, team leaders and emerging executives to understand AI as a strategic organisational capability rather than simply a productivity tool. Participants will explore AI-driven organisational transformation, strategic decision-making, leadership responsibilities, workforce readiness, governance and responsible adoption.',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 2,500',
    feeNote: 'Full 4-Week Professional Track · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_ai_governance_leadership_1794924812599.jpg',
    imageAlt: 'AI Leadership and Strategic Management executive roundtable',
    whoThisCourseIsFor: [
      'Business owners and executives',
      'Department heads and senior managers',
      'Team leaders and supervisors',
      'Public-sector and institutional leaders',
      'NGO and development-sector managers',
      'Emerging leaders and professionals preparing for management roles',
    ],
    keyAreas: [
      'Organisational AI Readiness & Opportunity Mapping',
      'AI-Assisted SWOT, PESTLE & Scenario Analysis',
      'Workforce Transformation & Change Management',
      'AI Governance, Risk & Investment Prioritisation',
    ],
    learningOutcomes: [
      'Evaluate organisational AI readiness, capability gaps, and operational processes suited for high-value AI adoption.',
      'Apply AI-assisted scenario, SWOT, and PESTLE analysis while preserving senior human judgement in strategic decisions.',
      'Lead workforce reskilling, internal communication, and organisational change management responsibly.',
      'Establish internal AI governance structures, accountability lines, and a phased executive AI roadmap.',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'AI and the Future of Organisational Leadership',
        topics: [
          'Understanding the changing AI landscape',
          'AI as a strategic organisational capability',
          'AI-driven transformation across sectors',
          'Leadership opportunities and challenges',
          'Understanding the difference between AI adoption and AI transformation',
        ],
      },
      {
        code: 'Module 2',
        title: 'AI Strategy & Organisational Readiness',
        topics: [
          'Assessing organisational AI readiness',
          'Identifying high-value AI opportunities',
          'Evaluating organisational capabilities',
          'Mapping processes suitable for AI integration',
          'Identifying skills and infrastructure gaps',
          'Prioritising AI adoption opportunities',
        ],
      },
      {
        code: 'Module 3',
        title: 'AI-Assisted Strategic Decision-Making',
        topics: [
          'Using AI for strategic research',
          'Scenario analysis and strategic options',
          'SWOT and PESTLE analysis with AI assistance',
          'Executive briefing and decision support',
          'Analysing opportunities, risks and uncertainties',
          'Human judgement in strategic decisions',
        ],
      },
      {
        code: 'Module 4',
        title: 'AI, Workforce Transformation & Change Management',
        topics: [
          "Understanding AI's impact on job roles",
          'Workforce skills assessment',
          'Identifying training and reskilling priorities',
          'Managing organisational change',
          'Building an AI-ready organisational culture',
          'Communicating AI transformation to employees',
        ],
      },
      {
        code: 'Module 5',
        title: 'AI Governance, Risk & Accountability',
        topics: [
          'Principles of responsible AI adoption',
          'Organisational AI governance structures',
          'Data protection and privacy considerations',
          'AI-related operational and reputational risks',
          'Human oversight and accountability',
          'Developing internal AI usage guidelines',
        ],
      },
      {
        code: 'Module 6',
        title: 'AI Investment & Implementation Prioritisation',
        topics: [
          'Evaluating AI use cases',
          'Understanding implementation costs and value',
          'Prioritising initiatives by impact and feasibility',
          'Build, buy or partner considerations',
          'Developing implementation milestones',
          'Monitoring performance and organisational value',
        ],
      },
      {
        code: 'Module 7',
        title: 'Leading an AI-Enabled Organisation',
        topics: [
          'Developing an organisational AI vision',
          'Establishing strategic priorities',
          'Leadership roles and responsibilities',
          'Cross-functional AI coordination',
          'Measuring adoption and performance',
          'Preparing an executive AI action plan',
        ],
      },
    ],
    practicalSkills: [
      'Organisational AI readiness assessment',
      'AI opportunity prioritisation',
      'Strategic scenario analysis',
      'Workforce transformation planning',
      'AI governance framework development',
      'Executive-level AI decision support',
      'AI implementation prioritisation',
    ],
    practicalProject: {
      projectLabel: 'Capstone Project',
      title: 'Organisational AI Strategy & Leadership Blueprint',
      prompt:
        'Participants design an executive-grade AI readiness, governance, and phased transformation blueprint tailored to their own department or organisation.',
      deliverables: [
        'An organisational AI readiness overview',
        'A strategic AI opportunity map',
        'A workforce capability gap analysis',
        'An AI governance and risk framework',
        'A prioritised AI implementation roadmap',
        'A leadership action plan with measurable milestones',
      ],
    },
    outsideScope: [
      'Enterprise AI system deployment',
      'Legal or regulatory compliance certification',
      'Detailed financial auditing',
      'Custom AI model development',
      'Guaranteed organisational transformation',
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: 'টিম লিডারশিপ, ম্যানেজমেন্ট বা প্রাতিষ্ঠানিক সিদ্ধান্ত গ্রহণের প্রাথমিক অভিজ্ঞতা ও কম্পিউটার সংযোগ।',
    assessment: 'স্ট্র্যাটেজিক কেস স্টাডি ও সমাপনী Leadership Blueprint মূল্যায়ন।',
    certificate: 'সকল মডিউল ও Capstone প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 2,500 (সর্বোচ্চ ৫০% স্কলারশিপ সুবিধাযোগ্য)।',
  },
  {
    code: 'PD-304',
    slug: 'ai-for-project-management',
    title: 'AI for Project Management',
    categorySlug: 'professional-development',
    categoryName: 'Professional Development',
    tierAccent: 'professional',
    tierLabel: 'Professional Track',
    chipLabel: 'Professional Development',
    level: 'Intermediate',
    hook: 'প্রজেক্ট প্ল্যানিং, রিস্ক ট্র্যাকিং, WBS, রিসোর্স সমন্বয় ও স্টেকহোল্ডার রিপোর্টিংয়ে AI-র পূর্ণাঙ্গ প্রয়োগ (৳2,500)।',
    overview:
      'This programme explores how AI can support the complete project management lifecycle, from project planning and resource allocation to risk assessment, progress monitoring, reporting and evaluation. Participants will learn to use AI as a project support tool while maintaining human accountability for project decisions and delivery.',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 2,500',
    feeNote: 'Full 4-Week Professional Track · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_workflow_automation_1794924807818.jpg',
    imageAlt: 'AI for Project Management WBS scheduling and risk tracking workshop',
    whoThisCourseIsFor: [
      'Project managers and coordinators',
      'Programme officers',
      'NGO and development-sector professionals',
      'Corporate project teams',
      'Operations and administrative managers',
      'Consultants and independent project professionals',
    ],
    keyAreas: [
      'AI-Assisted Concept Notes, Charters & WBS',
      'Scheduling, Milestones & Resource Planning',
      'Budget Narratives & Project Risk Registers',
      'M&E Indicators, Reporting & Stakeholder Comms',
    ],
    learningOutcomes: [
      'Use AI to structure problem analyses, project charters, scopes, and Work Breakdown Structures (WBS) efficiently.',
      'Build milestone schedules, resource dependency checklists, and AI-assisted budget narratives with explicit human validation.',
      'Develop proactive risk registers, scenario mitigations, and M&E indicator frameworks.',
      'Produce clear stakeholder progress reports and action-tracking summaries while protecting project confidentiality.',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'AI in Modern Project Management',
        topics: [
          'Understanding the project management lifecycle',
          'AI applications in project environments',
          'AI-assisted versus traditional project management',
          'Project management use cases',
          'Selecting suitable AI tools',
        ],
      },
      {
        code: 'Module 2',
        title: 'AI-Assisted Project Design & Planning',
        topics: [
          'Defining project objectives',
          'Problem analysis and needs assessment',
          'Developing project concepts',
          'Creating project scopes and deliverables',
          'Work Breakdown Structure (WBS)',
          'Preparing project charters and planning documents',
        ],
      },
      {
        code: 'Module 3',
        title: 'Scheduling, Tasks & Resource Planning',
        topics: [
          'Developing project activity schedules',
          'Task dependencies and sequencing',
          'Milestone identification',
          'Resource allocation support',
          'Timeline and workload planning',
          'AI-assisted project scheduling',
        ],
      },
      {
        code: 'Module 4',
        title: 'Budgeting & Project Documentation',
        topics: [
          'Structuring project budgets',
          'AI-assisted budget narratives',
          'Resource and cost estimation support',
          'Proposal and concept note preparation',
          'Project documentation',
          'Reviewing financial assumptions and limitations',
        ],
      },
      {
        code: 'Module 5',
        title: 'Project Risk Management',
        topics: [
          'Identifying project risks',
          'Risk categorisation and prioritisation',
          'Risk registers',
          'Risk response planning',
          'Scenario analysis',
          'Monitoring assumptions and dependencies',
        ],
      },
      {
        code: 'Module 6',
        title: 'Monitoring, Evaluation & Reporting',
        topics: [
          'Developing project indicators',
          'Monitoring project progress',
          'Data organisation and interpretation',
          'Preparing progress reports',
          'AI-assisted meeting and field report summaries',
          'Learning and evaluation documentation',
        ],
      },
      {
        code: 'Module 7',
        title: 'Project Communication & Responsible AI',
        topics: [
          'Stakeholder communication',
          'AI-assisted status reports',
          'Meeting minutes and action tracking',
          'Project knowledge management',
          'Data confidentiality and privacy',
          'Human verification and accountability',
        ],
      },
    ],
    practicalSkills: [
      'Project concept development',
      'Work Breakdown Structure preparation',
      'Project scheduling and milestone planning',
      'Risk register development',
      'AI-assisted project documentation',
      'Monitoring and progress reporting',
      'Stakeholder communication',
    ],
    practicalProject: {
      projectLabel: 'Capstone Project',
      title: 'AI-Assisted Project Management Portfolio',
      prompt:
        'Participants compile a full lifecycle documentation pack for a real or simulated initiative covering concept, WBS, timeline, risk register, and M&E indicators.',
      deliverables: [
        'A project concept note',
        'A project charter',
        'A Work Breakdown Structure',
        'A project timeline and milestone plan',
        'A risk register',
        'A monitoring indicator framework',
        'A project progress report template',
      ],
    },
    outsideScope: [
      'Professional PMP or PRINCE2 certification',
      'Advanced project management software certification',
      'Professional financial auditing',
      'Complex engineering project planning',
      'Guaranteed project approval or funding',
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: 'প্রজেক্ট বা প্রোগ্রাম সমন্বয়ের সাধারণ ধারণা এবং কম্পিউটার ও ইন্টারনেট সংযোগ।',
    assessment: 'মডিউলভিত্তিক প্রজেক্ট ডকুমেন্টেশন ও Capstone Portfolio মূল্যায়ন।',
    certificate: 'সকল মডিউল ও Capstone প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 2,500 (সর্বোচ্চ ৫০% স্কলারশিপ সুবিধাযোগ্য)।',
  },
  {
    code: 'PD-305',
    slug: 'ai-for-marketing-growth-strategy',
    title: 'AI for Marketing & Growth Strategy',
    categorySlug: 'professional-development',
    categoryName: 'Professional Development',
    tierAccent: 'professional',
    tierLabel: 'Professional Track',
    chipLabel: 'Professional Development',
    level: 'Intermediate',
    hook: 'অডিয়েন্স গবেষণা, ব্র্যান্ড পজিশনিং, ক্যাম্পেইন পরিকল্পনা ও গ্রোথ অ্যানালিটিক্সে AI-র কৌশলগত ব্যবহার (৳2,500)।',
    overview:
      'This programme focuses on using AI to develop data-informed marketing strategies, understand audiences, strengthen brand communication, plan campaigns and evaluate marketing performance. Participants will learn to connect content, customer insights, digital channels and business objectives through structured AI-assisted marketing workflows.',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 2,500',
    feeNote: 'Full 4-Week Professional Track · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_digital_creation_1794924807458.jpg',
    imageAlt: 'AI for Marketing and Growth Strategy campaign analytics workshop',
    whoThisCourseIsFor: [
      'Marketing professionals',
      'Digital marketing executives',
      'Brand and communication managers',
      'Entrepreneurs and business owners',
      'Content strategists',
      'Growth and customer acquisition professionals',
    ],
    keyAreas: [
      'Market Research & Audience Personas',
      'Brand Positioning & Messaging Frameworks',
      'Content Calendars & Campaign Architecture',
      'Marketing KPIs & Brand-Safe Responsible AI',
    ],
    learningOutcomes: [
      'Conduct structured audience segmentation, buyer pain-point research, and competitor positioning analyses using AI.',
      'Articulate brand value propositions, consistent tone-of-voice rules, and platform-specific messaging pillars.',
      'Build 30-day content calendars, full-funnel campaign workflows, and KPI tracking templates.',
      'Enforce accuracy, intellectual property hygiene, and truthful claims across AI-assisted marketing campaigns.',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'AI and the Modern Marketing Environment',
        topics: [
          'Understanding AI-driven marketing',
          'AI applications across marketing functions',
          'Marketing automation and generative AI',
          'Customer-centric marketing',
          'Opportunities and limitations of AI marketing tools',
        ],
      },
      {
        code: 'Module 2',
        title: 'Market Research & Audience Intelligence',
        topics: [
          'AI-assisted market research',
          'Audience segmentation',
          'Customer personas',
          'Customer behaviour and pain-point analysis',
          'Competitor and positioning research',
          'Identifying and validating market insights',
        ],
      },
      {
        code: 'Module 3',
        title: 'Brand Strategy & Marketing Positioning',
        topics: [
          'Brand identity and positioning',
          'Value proposition development',
          'Brand messaging frameworks',
          'Audience-specific communication',
          'Tone of voice and brand consistency',
          'AI-assisted brand strategy documentation',
        ],
      },
      {
        code: 'Module 4',
        title: 'AI-Powered Digital Content Strategy',
        topics: [
          'Developing content pillars',
          'Building marketing content calendars',
          'Social media strategy',
          'AI-assisted copywriting',
          'Visual and multimedia content planning',
          'Platform-specific content adaptation',
        ],
      },
      {
        code: 'Module 5',
        title: 'Campaign Planning & Customer Engagement',
        topics: [
          'Campaign objective setting',
          'Campaign planning and messaging',
          'Customer journey mapping',
          'Email and digital communication',
          'Lead nurturing and engagement',
          'AI-assisted campaign workflow design',
        ],
      },
      {
        code: 'Module 6',
        title: 'Marketing Analytics & Performance Optimisation',
        topics: [
          'Understanding marketing KPIs',
          'Analysing campaign performance data',
          'Engagement and conversion indicators',
          'AI-assisted reporting',
          'Identifying performance gaps',
          'Improving marketing strategies through evidence',
        ],
      },
      {
        code: 'Module 7',
        title: 'Responsible AI in Marketing',
        topics: [
          'Accuracy and authenticity in marketing content',
          'Responsible use of generated images and media',
          'Copyright and intellectual property awareness',
          'Customer data protection',
          'Avoiding misleading AI-generated claims',
          'Human review and brand accountability',
        ],
      },
    ],
    practicalSkills: [
      'Market and audience research',
      'Customer persona development',
      'Brand positioning and messaging',
      'Content strategy and calendar development',
      'Campaign planning',
      'Marketing performance reporting',
      'AI-assisted growth strategy development',
    ],
    practicalProject: {
      projectLabel: 'Capstone Project',
      title: 'AI-Powered Marketing & Growth Strategy',
      prompt:
        'Participants develop a comprehensive go-to-market strategy integrating audience research, messaging, a 30-day calendar, KPI reporting, and a 90-day growth plan.',
      deliverables: [
        'A market and competitor research brief',
        'Target audience personas',
        'Brand positioning and messaging framework',
        'A 30-day content calendar',
        'A campaign strategy',
        'A marketing KPI dashboard or reporting template',
        'A 90-day growth action plan',
      ],
    },
    outsideScope: [
      'Guaranteed sales, leads or conversions',
      'Paid advertising budget or media buying',
      'Advanced marketing analytics engineering',
      'Professional graphic design certification',
      'Full-service marketing agency execution',
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: 'ডিজিটাল মার্কেটিং বা ব্র্যান্ড কমিউনিকেশন সম্পর্কে প্রাথমিক ধারণা ও কম্পিউটার সংযোগ।',
    assessment: 'ক্যাম্পেইন স্ট্র্যাটেজি অ্যাসাইনমেন্ট ও Capstone Growth Plan মূল্যায়ন।',
    certificate: 'সকল মডিউল ও Capstone প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 2,500 (সর্বোচ্চ ৫০% স্কলারশিপ সুবিধাযোগ্য)।',
  },
  {
    code: 'PD-306',
    slug: 'ai-for-human-resource-management',
    title: 'AI for Human Resource Management',
    categorySlug: 'professional-development',
    categoryName: 'Professional Development',
    tierAccent: 'professional',
    tierLabel: 'Professional Track',
    chipLabel: 'Professional Development',
    level: 'Intermediate',
    hook: 'রিক্রুটমেন্ট, অনবোর্ডিং, লার্নিং ও টিম এনগেজমেন্টে পক্ষপাতমুক্ত, মানবিক ও নৈতিক AI প্রয়োগ (৳2,500)।',
    overview:
      'This programme explores the responsible application of AI across human resource management, including workforce planning, recruitment support, employee learning, performance documentation and organisational development. The course emphasises fairness, privacy, human judgement and accountability in people-related decisions.',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 2,500',
    feeNote: 'Full 4-Week Professional Track · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_research_analytics_1794924809260.jpg',
    imageAlt: 'AI for Human Resource Management ethical workforce planning seminar',
    whoThisCourseIsFor: [
      'HR professionals and executives',
      'Recruitment and talent acquisition teams',
      'Learning and development professionals',
      'HR managers and department heads',
      'Organisational development practitioners',
      'Business owners responsible for workforce management',
    ],
    keyAreas: [
      'Workforce Planning, Job Design & Competency Mapping',
      'Structured & Bias-Aware Recruitment Support',
      'Learning, Development & Engagement Analytics',
      'Employee Privacy & Human Oversight in HR',
    ],
    learningOutcomes: [
      'Use AI to draft clear job descriptions, competency matrices, and workforce skills-gap plans.',
      'Streamline recruitment documentation, structured interview guides, and onboarding playbooks without relying on automated rejection.',
      'Design personalised employee L&D plans and summarise engagement feedback surveys systematically.',
      'Prevent algorithmic bias and uphold strict confidentiality and human judgement across all HR workflows.',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'AI in Human Resource Management',
        topics: [
          'Understanding AI in HR functions',
          'HR technology and generative AI',
          'AI applications across the employee lifecycle',
          'Opportunities and operational limitations',
          'Human-centred HR management',
        ],
      },
      {
        code: 'Module 2',
        title: 'AI for Workforce Planning & Job Design',
        topics: [
          'Workforce needs assessment',
          'Job description development',
          'Role and competency mapping',
          'Skills gap identification',
          'Workforce capability planning',
          'AI-assisted HR documentation',
        ],
      },
      {
        code: 'Module 3',
        title: 'AI-Assisted Recruitment & Talent Acquisition',
        topics: [
          'Recruitment workflow design',
          'Vacancy announcement drafting',
          'Interview question development',
          'Candidate communication',
          'Recruitment documentation',
          'Limitations and risks of automated candidate screening',
        ],
      },
      {
        code: 'Module 4',
        title: 'AI for Learning & Employee Development',
        topics: [
          'Employee learning needs assessment',
          'Training programme design',
          'Personalised learning pathways',
          'Competency development frameworks',
          'AI-assisted learning materials',
          'Training evaluation and feedback',
        ],
      },
      {
        code: 'Module 5',
        title: 'Performance Management & Employee Engagement',
        topics: [
          'Performance objective development',
          'KPI and performance documentation',
          'Employee feedback analysis',
          'Engagement survey summarisation',
          'Performance review preparation',
          'Human judgement in performance decisions',
        ],
      },
      {
        code: 'Module 6',
        title: 'HR Operations & Administrative Productivity',
        topics: [
          'HR policy and handbook drafting support',
          'Employee query and FAQ systems',
          'Leave and attendance documentation workflows',
          'HR reporting and data organisation',
          'Employee onboarding support',
          'Repetitive HR task identification',
        ],
      },
      {
        code: 'Module 7',
        title: 'Ethical, Fair & Responsible AI in HR',
        topics: [
          'Algorithmic bias and discrimination risks',
          'Employee data privacy',
          'Confidentiality and consent',
          'Transparency in AI-assisted HR processes',
          'Human oversight in recruitment and evaluation',
          'Responsible HR AI usage guidelines',
        ],
      },
    ],
    practicalSkills: [
      'Workforce planning support',
      'Job description development',
      'Recruitment communication',
      'Interview framework preparation',
      'Learning needs assessment',
      'Performance documentation',
      'HR reporting and workflow improvement',
    ],
    practicalProject: {
      projectLabel: 'Capstone Project',
      title: 'AI-Enabled HR Management Framework',
      prompt:
        'Participants prepare an end-to-end HR documentation and governance framework designed around fairness, transparency, and employee data privacy.',
      deliverables: [
        'A sample workforce needs assessment',
        'A job description and competency framework',
        'A structured recruitment workflow',
        'An employee learning and development plan',
        'A performance review template',
        'An HR operations improvement proposal',
        'A responsible AI in HR checklist',
      ],
    },
    outsideScope: [
      'Automated hiring or candidate rejection decisions',
      'Legal employment advice',
      'Payroll system implementation',
      'Professional psychometric assessment',
      'HR certification or accreditation',
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: 'এইচআর বা পিপল ম্যানেজমেন্ট সম্পর্কে প্রাথমিক ধারণা এবং কম্পিউটার ও ইন্টারনেট সংযোগ।',
    assessment: 'এইচআর কেস স্টাডি ও Capstone HR Framework মূল্যায়ন।',
    certificate: 'সকল মডিউল ও Capstone প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 2,500 (সর্বোচ্চ ৫০% স্কলারশিপ সুবিধাযোগ্য)।',
  },
  {
    code: 'PD-307',
    slug: 'ai-for-financial-management',
    title: 'AI for Financial Management',
    categorySlug: 'professional-development',
    categoryName: 'Professional Development',
    tierAccent: 'professional',
    tierLabel: 'Professional Track',
    chipLabel: 'Professional Development',
    level: 'Intermediate',
    hook: 'বাজেটিং, স্প্রেডশিট বিশ্লেষণ, ফিন্যান্সিয়াল রিপোর্টিং ও ঝুঁকি মূল্যায়নে নির্ভুল AI সহায়তা ও যাচাই (৳2,500)।',
    overview:
      'This programme introduces professionals and business managers to the practical use of AI in financial administration, budgeting, financial reporting, spreadsheet analysis and management decision support. The focus is on improving financial information workflows and analytical capabilities—not replacing qualified accountants, auditors or financial advisers.',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 2,500',
    feeNote: 'Full 4-Week Professional Track · Max 50% Scholarship Eligible',
    isFree: false,
    imageUrl: '/src/assets/images/course_data_intelligence_1794924810524.jpg',
    imageAlt: 'AI for Financial Management budgeting and spreadsheet analytics session',
    whoThisCourseIsFor: [
      'Finance and accounts professionals',
      'Business owners and entrepreneurs',
      'Finance and administrative managers',
      'NGO and development-sector finance officers',
      'Project finance professionals',
      'Professionals responsible for budgets and financial reporting',
    ],
    keyAreas: [
      'Budgeting Templates, Expense Categorisation & Narratives',
      'Spreadsheet Intelligence & Formula Validation',
      'Budget-vs-Actual & Cash-Flow Management Reporting',
      'Financial Data Security, Auditability & Oversight',
    ],
    learningOutcomes: [
      'Prepare structured organisational budget templates, expense categorisations, and clear management budget narratives with AI.',
      'Use AI to accelerate spreadsheet cleaning, formula interpretation, and anomaly spotting while validating every calculation manually.',
      'Produce clear budget-versus-actual reports, scenario comparisons, and revenue/expense trend briefs.',
      'Safeguard sensitive financial records against privacy leaks and uphold strict human auditability.',
    ],
    modules: [
      {
        code: 'Module 1',
        title: 'AI in Financial Management',
        topics: [
          'Understanding AI in finance functions',
          'AI applications in financial administration',
          'Generative AI for finance-related documentation',
          'AI-assisted financial workflows',
          'Opportunities, limitations and risks',
        ],
      },
      {
        code: 'Module 2',
        title: 'AI for Budgeting & Financial Planning',
        topics: [
          'Understanding budget structures',
          'Preparing budget templates',
          'AI-assisted budget narratives',
          'Expense categorisation',
          'Budget assumptions and scenario planning',
          'Reviewing estimates and financial assumptions',
        ],
      },
      {
        code: 'Module 3',
        title: 'Spreadsheet Intelligence & Financial Data',
        topics: [
          'AI-assisted spreadsheet operations',
          'Organising financial data',
          'Data cleaning and validation',
          'Formula assistance and interpretation',
          'Basic financial calculations',
          'Identifying patterns and anomalies for further review',
        ],
      },
      {
        code: 'Module 4',
        title: 'Financial Reporting & Documentation',
        topics: [
          'Preparing financial summaries',
          'Budget-versus-actual reporting',
          'Expense and expenditure summaries',
          'Financial narrative preparation',
          'Management reporting',
          'Presenting financial information clearly',
        ],
      },
      {
        code: 'Module 5',
        title: 'AI for Financial Analysis & Decision Support',
        topics: [
          'Understanding basic financial indicators',
          'Revenue and expense trend analysis',
          'Cash flow concepts',
          'Scenario comparison',
          'Financial performance interpretation',
          'Recognising uncertainty in AI-generated analysis',
        ],
      },
      {
        code: 'Module 6',
        title: 'Financial Operations & Workflow Efficiency',
        topics: [
          'Invoice and receipt information organisation',
          'Expense documentation workflows',
          'Financial record management',
          'Repetitive finance task identification',
          'AI-assisted reporting workflows',
          'Human review and approval processes',
        ],
      },
      {
        code: 'Module 7',
        title: 'Financial Data Security & Responsible AI',
        topics: [
          'Confidential financial information',
          'Data privacy and access control',
          'Risks of uploading financial records to AI platforms',
          'Accuracy and verification of calculations',
          'Auditability and documentation',
          'Human accountability in financial decisions',
        ],
      },
    ],
    practicalSkills: [
      'Budget template preparation',
      'AI-assisted spreadsheet analysis',
      'Expense categorisation',
      'Budget-versus-actual reporting',
      'Financial summary preparation',
      'Basic financial trend interpretation',
      'Financial workflow improvement',
    ],
    practicalProject: {
      projectLabel: 'Capstone Project',
      title: 'AI-Assisted Financial Management Portfolio',
      prompt:
        'Participants construct a complete non-confidential budget and financial reporting workflow with verified spreadsheet formulas and strict data-security controls.',
      deliverables: [
        'A sample organisational budget',
        'An expense categorisation framework',
        'A budget-versus-actual report',
        'A financial performance summary',
        'A basic scenario analysis',
        'A financial reporting template',
        'A responsible AI and financial data handling checklist',
      ],
    },
    outsideScope: [
      'Professional accounting or auditing services',
      'Tax, legal or investment advice',
      'Certified financial modelling',
      'Automated financial approval systems',
      'Regulated financial decision-making',
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: 'বেসিক বাজেটিং বা স্প্রেডশিট (Excel/Sheets) ব্যবহারের অভিজ্ঞতা এবং কম্পিউটার সংযোগ।',
    assessment: 'বাজেট ও রিপোর্টিং অনুশীলন এবং Capstone Portfolio মূল্যায়ন।',
    certificate: 'সকল মডিউল ও Capstone প্রজেক্ট সম্পন্ন করলে Non-accredited Completion Certificate প্রদান করা হবে।',
    registrationNote: '৪ সপ্তাহ · ৮টি লাইভ ক্লাস। ফি BDT 2,500 (সর্বোচ্চ ৫০% স্কলারশিপ সুবিধাযোগ্য)।',
  },

  // =========================================================================
  // CATEGORY 4: SPECIALISED PROGRAMMES (SP-WSAI)
  // =========================================================================
  {
    code: 'SP-WSAI',
    slug: 'womens-safety-in-the-ai-era',
    title: "Women's Safety in the AI Era",
    categorySlug: 'specialised-programmes',
    categoryName: 'Specialised Programmes',
    tierAccent: 'specialised',
    tierLabel: 'Specialised · Free',
    chipLabel: 'Specialised Programme',
    level: 'Beginner / Awareness',
    hook: 'AI যুগে নারী ও মেয়েদের ডিজিটাল নিরাপত্তা: deepfake, synthetic media, privacy ও cyber abuse সুরক্ষায় ৪ সপ্তাহের বিনামূল্যের কর্মসূচি (FREE)।',
    overview:
      'কৃত্রিম বুদ্ধিমত্তা ও ডিজিটাল প্রযুক্তির যুগে অনলাইনে নারী ও কন্যাশিশুদের নিরাপত্তা, ডিপফেক ও সিন্থেটিক মিডিয়ার ঝুঁকি, ব্যক্তিগত তথ্যের প্রাইভেসি সুরক্ষা এবং কার্যকর প্রতিরোধমূলক ও আইনি/প্রাতিষ্ঠানিক সহায়তা পাওয়ার জ্ঞান নিয়ে ৪ সপ্তাহের সম্পূর্ণ বিনামূল্যের বিশেষায়িত সচেতনতামূলক কর্মসূচি।',
    duration: '4 Weeks · 8 Classes Total',
    fee: 'BDT 0',
    feeNote: 'Free Social-Impact Programme',
    isFree: true,
    imageUrl: '/src/assets/images/course_womens_digital_safety_1794926670102.jpg',
    imageAlt: "Women's Safety in the AI Era digital literacy and online protection programme",
    whoThisCourseIsFor: [
      'বিশ্ববিদ্যালয়, কলেজ ও স্কুলের নারী শিক্ষার্থী (১৮ বছরের কম বয়সীদের ক্ষেত্রে অভিভাবকের সম্মতিসহ)',
      'কর্মজীবী নারী, গৃহিণী, অভিভাবক এবং নারী অধিকার ও শিক্ষাবিষয়ক শিক্ষক/মেন্টর',
      'ডিজিটাল প্ল্যাটফর্মে নিরাপদ উপস্থিতি ও ডিপফেক/অনলাইন হয়রানি প্রতিরোধ জানতে আগ্রহী যে কেউ',
    ],
    keyAreas: [
      'Digital Footprints & AI Threat Awareness',
      'Deepfake, Voice Cloning & Image Manipulation Detection',
      'Account Hardening, Privacy Hygiene & Cyber Harassment Defence',
      'Evidence Preservation, Mental Resilience & Support Channels',
    ],
    learningOutcomes: [
      'AI যুগে ডিজিটাল ফুটপ্রিন্ট, প্রাইভেসি ঝুঁকি এবং ডিপফেক বা সিন্থেটিক মিডিয়া কীভাবে তৈরি ও অপব্যবহার হয় তা স্পষ্টভাবে বুঝতে পারবেন।',
      'সোশ্যাল মিডিয়া, মেসেজিং অ্যাপ এবং ক্লাউড অ্যাকাউন্টে শক্তিশালী নিরাপত্তা ও প্রাইভেসি সেটিংস প্রয়োগ করতে পারবেন।',
      'বিকৃত ছবি, ভয়েস ক্লোনিং বা সন্দেহজনক অনলাইন বার্তা যাচাই করার প্রাথমিক কৌশল এবং ব্ল্যাকমেইল বা হয়রানির মুখে করণীয় জানতে পারবেন।',
      'নিরাপদভাবে ডিজিটাল প্রমাণ সংরক্ষণ, জরুরি হেল্পলাইন ও রিপোর্টিং চ্যানেল ব্যবহার এবং ব্যক্তিগত ডিজিটাল সুরক্ষা পরিকল্পনা তৈরি করতে পারবেন।',
    ],
    modules: [
      {
        code: 'Week 1',
        title: 'Digital Footprints, Privacy & Understanding AI-Era Risks',
        topics: [
          'অনলাইন উপস্থিতি ও ডিজিটাল ফুটপ্রিন্ট কীভাবে ডেটা ও AI সিস্টেমে সংরক্ষিত হয়',
          'সোশ্যাল মিডিয়া ও পাবলিক প্রোফাইলে ছবি ও ব্যক্তিগত তথ্যের ঝুঁকি মূল্যায়ন',
          'অনলাইন গোপনীয়তা, কনসেন্ট ও ব্যক্তিগত সীমারেখা (digital boundaries)',
          'প্রাথমিক অ্যাকাউন্ট প্রাইভেসি অডিট অনুশীলন',
        ],
      },
      {
        code: 'Week 2',
        title: 'Recognising Deepfakes, Image Manipulation & Synthetic Abuse',
        topics: [
          'ডিপফেক, ফেস-সোয়াপিং ও ভয়েস ক্লোনিং কীভাবে কাজ করে—সহজ ব্যাখ্যা',
          'ছবি ও ভিডিওতে AI বিকৃতি শনাক্ত করার প্রাথমিক ভিজ্যুয়াল ও মেটাডেটা সংকেত',
          'ভুয়া প্রোফাইল, ইম্পারসোনেশন ও AI-জেনারেটেড প্রতারণা চিহ্নিত করা',
          'সন্দেহজনক মিডিয়া শেয়ার না করে যাচাই করার নিরাপদ অভ্যাস',
        ],
      },
      {
        code: 'Week 3',
        title: 'Account Security, Privacy Protection & Harassment Defence',
        topics: [
          'মাল্টি-ফ্যাক্টর অথেনটিকেশন (2FA), পাসওয়ার্ড হাইজিন ও লগইন মনিটরিং',
          'ফেসবুক, হোয়াটসঅ্যাপ ও অন্যান্য প্ল্যাটফর্মে প্রাইভেসি ও ব্লকিং নিয়ন্ত্রণ',
          'সাইবার স্টকিং, ডক্সিং ও অনলাইন ব্ল্যাকমেইলের প্রাথমিক প্রতিরোধ কৌশল',
          'ফিশিং লিঙ্ক ও ম্যালওয়্যার থেকে ডিভাইস ও ফটো গ্যালারি সুরক্ষিত রাখা',
        ],
      },
      {
        code: 'Week 4',
        title: 'Response Protocols, Evidence Preservation & Support Ecosystems',
        topics: [
          'কোনো ডিজিটাল হয়রানির ঘটনা ঘটলে আতঙ্কিত না হয়ে ধাপে ধাপে করণীয়',
          'স্ক্রিনশট, URL ও টাইমস্ট্যাম্পসহ নিরাপদ প্রমাণ সংরক্ষণের নিয়মাবলি',
          'বাংলাদেশের সরকারি সাইবার হেল্পলাইন, প্ল্যাটফর্ম রিপোর্টিং ও আইনি/মনস্তাত্ত্বিক সহায়তা পথ',
          'নিজের ও পরিবারের জন্য ৪-সপ্তাহের Digital Self-Protection Checklist তৈরি',
        ],
      },
    ],
    practicalSkills: [
      'সোশ্যাল মিডিয়া ও ডিভাইস প্রাইভেসি লকডাউন',
      'ডিপফেক ও ম্যানিপুলেটেড মিডিয়া যাচাইয়ের প্রাথমিক ধারণা',
      'পাসওয়ার্ড ও 2FA সুরক্ষা সেটআপ',
      'ডিজিটাল প্রমাণ সংরক্ষণ ও রিপোর্টিং প্রোটোকল',
    ],
    outsideScope: [
      'আইনি প্রতিনিধিত্ব বা ব্যক্তিগত পুলিশি তদন্ত পরিচালনা (কর্মসূচিটি শিক্ষামূলক ও সচেতনতামূলক)',
      'ক্লিনিক্যাল সাইকোলজিক্যাল থেরাপি',
      'ব্যক্তিগত সংবেদনশীল ছবি বা ডকুমেন্ট ফর্মে সংগ্রহ (সম্পূর্ণ নিষিদ্ধ)',
    ],
    programmeNotes: [
      'এটি Atlas AI Education-এর সম্পূর্ণ বিনামূল্যের (BDT 0) সামাজিক সচেতনতা ও সক্ষমতা উন্নয়ন কর্মসূচি।',
      'কঠোর সেফগার্ডিং নীতিমালা: এই কর্মসূচির কোনো ফর্ম বা ক্লাসে ব্যক্তিগত সংবেদনশীল ছবি বা গোপনীয় নথি জমা নেওয়া হয় না।',
    ],
    prerequisites: 'কোনো পূর্ব প্রযুক্তিগত অভিজ্ঞতার প্রয়োজন নেই; দৈনন্দিন স্মার্টফোন বা ইন্টারনেট ব্যবহার করলেই অংশ নেওয়া যাবে।',
    assessment: '৪ সপ্তাহের সেশনে নিয়মিত অংশগ্রহণ ও সমাপনী Digital Self-Protection Checklist অনুশীলন।',
    certificate: 'কর্মসূচি সফলভাবে সম্পন্ন করলে Non-accredited Certificate of Participation প্রদান করা হবে।',
    registrationNote: 'সম্পূর্ণ বিনামূল্যে (BDT 0) নিবন্ধনযোগ্য। ১৮ বছরের কম বয়সীদের ক্ষেত্রে অভিভাবকের সম্মতি আবশ্যক।',
  },
];

export const WOMENS_SAFETY_PROGRAMME: CourseItem = COURSES.find(
  (c) => c.code === 'SP-WSAI'
)!;

export const FEATURED_COURSES: CourseItem[] = [
  COURSES.find((c) => c.code === 'FREE')!,
  COURSES.find((c) => c.code === 'AP-201')!,
  COURSES.find((c) => c.code === 'PD-301')!,
  WOMENS_SAFETY_PROGRAMME,
];

export function getCourseByCodeOrSlug(codeOrSlug: string): CourseItem | undefined {
  const key = codeOrSlug.trim().toLowerCase();
  return COURSES.find(
    (c) => c.code.toLowerCase() === key || c.slug.toLowerCase() === key
  );
}

export function getCoursesByCategory(slug: CategorySlug): CourseItem[] {
  return COURSES.filter((c) => c.categorySlug === slug);
}
