import { CategorySlug } from './coursesData';

export type ResourceType = 'Guide' | 'PDF' | 'Link';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: CategorySlug | 'general';
  url: string;
}

export const RESOURCES: ResourceItem[] = [
  {
    id: 'res-ai-literacy-handbook',
    title: 'AI Literacy & Foundation Full Curriculum Guide',
    description:
      'Atlas AI Education-এর AI Literacy & Foundation ক্যাটাগরির ৬টি কোর্সের পূর্ণাঙ্গ সিলেবাস, মডিউল ও লার্নিং আউটকাম ডকুমেন্ট।',
    type: 'Guide',
    category: 'ai-literacy',
    url: '/programmes#ai-literacy',
  },
  {
    id: 'res-pd-curriculum-spec',
    title: 'Professional Development Programmes Overview (PD-301 to PD-307)',
    description:
      'কর্মক্ষেত্র, লিডারশিপ, বিজনেস ডেভেলপমেন্ট, প্রজেক্ট, মার্কেটিং, এইচআর ও ফিন্যান্স খাতের ৭টি ৪-সপ্তাহের প্রোগ্রামের বিস্তারিত রূপরেখা।',
    type: 'Guide',
    category: 'professional-development',
    url: '/programmes#professional-development',
  },
  {
    id: 'res-womens-safety-charter',
    title: 'Women’s Safety in the AI Era: Safeguarding & Participation Guide',
    description:
      'ডিপফেক শনাক্তকরণ, ডিজিটাল প্রাইভেসি চেকলিস্ট এবং নিরাপদ অনলাইন অংশগ্রহণের জন্য সেফগার্ডিং ও সহায়তা নির্দেশিকা।',
    type: 'Guide',
    category: 'specialised-programmes',
    url: '/programmes/womens-safety-in-the-ai-era',
  },
  {
    id: 'res-prompt-toolkit',
    title: 'Structured Prompt Architect & Course Matcher Tool',
    description:
      'পারসোনা, টাস্ক, টোন এবং ফরম্যাট নির্ধারণ করে নির্ভুল প্রম্পট তৈরির ইন্টারঅ্যাক্টিভ বিনামূল্যের টুল।',
    type: 'Link',
    category: 'applied-ai',
    url: '/tools',
  },
  {
    id: 'res-unesco-ai-ethics',
    title: 'UNESCO Recommendation on the Ethics of Artificial Intelligence',
    description:
      'দায়িত্বশীল AI ব্যবহার, মানবাধিকার, স্বচ্ছতা এবং বৈশ্বিক AI নীতিমালার আন্তর্জাতিক রেফারেন্স কাঠামো।',
    type: 'Link',
    category: 'ai-literacy',
    url: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics',
  },
  {
    id: 'res-oecd-ai-principles',
    title: 'OECD AI Principles & Responsible Governance Reference',
    description:
      'বিশ্বস্ত AI সিস্টেম, মানবিক তদারকি (human-in-the-loop) এবং জবাবদিহিতামূলক উদ্ভাবনের নীতিগত গাইড।',
    type: 'Link',
    category: 'professional-development',
    url: 'https://oecd.ai/en/ai-principles',
  },
  {
    id: 'res-nist-ai-rmf',
    title: 'NIST AI Risk Management Framework (AI RMF 1.0)',
    description:
      'প্রতিষ্ঠান ও কর্মক্ষেত্রে AI-সংক্রান্ত ঝুঁকি শনাক্তকরণ, পরিমাপ ও নিয়ন্ত্রণের জন্য কারিগরি ও প্রশাসনিক গাইড।',
    type: 'PDF',
    category: 'specialised-programmes',
    url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf',
  },
  {
    id: 'res-scholarship-policy',
    title: 'Course-Based Scholarship Guidelines (Up to 50% Fee Waiver)',
    description:
      'পেইড কোর্সসমূহে মেধা ও প্রয়োজনের ভিত্তিতে প্রতি কোর্সে সর্বোচ্চ ৫ জন শিক্ষার্থীর জন্য স্কলারশিপ আবেদনের নিয়মাবলি।',
    type: 'Guide',
    category: 'general',
    url: '/scholarships',
  },
  {
    id: 'res-certificate-verification',
    title: 'Digital Certificate Verification Portal',
    description:
      'Atlas AI Education কর্তৃক প্রদত্ত যেকোনো non-accredited completion বা participation সার্টিফিকেটের সত্যতা যাচাই করুন।',
    type: 'Link',
    category: 'general',
    url: '/verify-certificate',
  },
];
