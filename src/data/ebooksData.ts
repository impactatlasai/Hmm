export interface EbookItem {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  readingLevel: string;
  imageUrl?: string;
}

export const EBOOK_CATEGORIES: string[] = [
  'All',
  'AI Literacy & Basics',
  'Prompt Engineering',
  'Business & Productivity',
  'AI Safety & Governance',
  'Applied AI & Automation',
];

export const EBOOKS: EbookItem[] = [
  {
    id: 'ebk-01',
    title: 'AI Fundamentals: A Beginner’s Handbook in Plain Language',
    description:
      'একদম নতুন শিক্ষার্থীদের জন্য Artificial Intelligence, Machine Learning এবং Generative AI-এর মূল ধারণা সহজ বাংলা ও ইংরেজি উদাহরণসহ ব্যাখ্যা করা হয়েছে।',
    category: 'AI Literacy & Basics',
    language: 'Bilingual (BN / EN)',
    readingLevel: 'Beginner',
    imageUrl: '/src/assets/images/ebook_cover_ai_basics_1794934415808.jpg',
  },
  {
    id: 'ebk-02',
    title: 'Mastering Structured Prompt Engineering',
    description:
      'Zero-shot, few-shot, role prompting এবং iterative refinement ব্যবহার করে কীভাবে ChatGPT, Claude বা Gemini থেকে নির্ভুল ও পেশাদার আউটপুট পাওয়া যায় তার সম্পূর্ণ গাইড।',
    category: 'Prompt Engineering',
    language: 'English / Bangla Notes',
    readingLevel: 'Beginner – Intermediate',
    imageUrl: '/src/assets/images/ebook_cover_prompt_engineering_1794934416121.jpg',
  },
  {
    id: 'ebk-03',
    title: 'AI for Business Operations & SME Growth',
    description:
      'ক্ষুদ্র ও মাঝারি ব্যবসা, উদ্যোক্তা এবং কর্পোরেট টিমের জন্য মার্কেট রিসার্চ, কাস্টমার কমিউনিকেশন, প্রস্তাবনা তৈরি ও অপারেশনাল দক্ষতা বৃদ্ধির প্র্যাকটিক্যাল হ্যান্ডবুক।',
    category: 'Business & Productivity',
    language: 'English',
    readingLevel: 'Intermediate',
    imageUrl: '/src/assets/images/ebook_cover_business_ai_1794934415865.jpg',
  },
  {
    id: 'ebk-04',
    title: 'Everyday Workplace Productivity with AI Assistants',
    description:
      'অফিসিয়াল ইমেইল, মিটিং নোটস, প্রেজেন্টেশন আউটলাইন, ডকুমেন্ট সারসংক্ষেপ এবং দৈনন্দিন কাজের সময় সাশ্রয়ের ব্যবহারিক কর্মপদ্ধতি।',
    category: 'Business & Productivity',
    language: 'Bilingual (BN / EN)',
    readingLevel: 'Beginner',
    imageUrl: '/src/assets/images/ebook_cover_ai_basics_1794934415808.jpg',
  },
  {
    id: 'ebk-05',
    title: 'Responsible AI, Privacy & Fact-Checking Playbook',
    description:
      'AI-generated misinformation, hallucination, data privacy ঝুঁকি এবং ডিপফেক যাচাইয়ের নির্ভরযোগ্য চেকলিস্ট ও নৈতিক ব্যবহারের নির্দেশিকা।',
    category: 'AI Safety & Governance',
    language: 'Bilingual (BN / EN)',
    readingLevel: 'All Levels',
    imageUrl: '/src/assets/images/ebook_cover_business_ai_1794934415865.jpg',
  },
  {
    id: 'ebk-06',
    title: 'Women’s Digital Safety & Deepfake Protection Guide',
    description:
      'AI যুগে অনলাইন নিরাপত্তা, ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা, সিন্থেটিক মিডিয়া শনাক্তকরণ এবং ডিজিটাল প্রমাণ সংরক্ষণের সহজবোধ্য সহায়িকা।',
    category: 'AI Safety & Governance',
    language: 'Bangla (বাংলা)',
    readingLevel: 'All Levels',
    imageUrl: '/src/assets/images/course_womens_digital_safety_1794926670102.jpg',
  },
  {
    id: 'ebk-07',
    title: 'Organisational AI Governance & Acceptable Use Starter Kit',
    description:
      'প্রতিষ্ঠান, এনজিও এবং বিশ্ববিদ্যালয়ের জন্য দায়িত্বশীল AI নীতিমালা, মানবিক তদারকি (human-in-the-loop) এবং ঝুঁকি মূল্যায়নের প্রাথমিক কাঠামো।',
    category: 'AI Safety & Governance',
    language: 'English',
    readingLevel: 'Intermediate',
    imageUrl: '/src/assets/images/course_ai_governance_leadership_1794924812599.jpg',
  },
  {
    id: 'ebk-08',
    title: 'AI Tools Ecosystem: Choosing the Right Tool for Every Task',
    description:
      'লেখালেখি, গবেষণা, ডিজাইন, প্রেজেন্টেশন ও ডেটা কাজের জন্য কোন AI প্ল্যাটফর্ম কখন বেছে নেবেন এবং ফ্রি বনাম পেইড টুলের তুলনামূলক গাইড।',
    category: 'AI Literacy & Basics',
    language: 'English',
    readingLevel: 'Beginner – Intermediate',
    imageUrl: '/src/assets/images/ebook_cover_prompt_engineering_1794934416121.jpg',
  },
  {
    id: 'ebk-09',
    title: 'No-Code AI Workflow & Automation Blueprints',
    description:
      'কোনো কোডিং ছাড়াই ফর্ম, স্প্রেডশিট, ইমেইল ও AI-কে যুক্ত করে পুনরাবৃত্তিমূলক দাপ্তরিক কাজ সহজ করার নিরাপদ ও মানব-নিয়ন্ত্রিত অটোমেশন ধারণা।',
    category: 'Applied AI & Automation',
    language: 'English',
    readingLevel: 'Intermediate',
    imageUrl: '/src/assets/images/course_workflow_automation_1794924807818.jpg',
  },
  {
    id: 'ebk-10',
    title: 'AI for Academic Research, Educators & Critical Thinking',
    description:
      'শিক্ষক ও বিশ্ববিদ্যালয় শিক্ষার্থীদের জন্য একাডেমিক সততা বজায় রেখে রিসার্চ সিন্থেসিস, পাঠ পরিকল্পনা এবং সোর্স ভেরিফিকেশনের আদর্শ নির্দেশিকা।',
    category: 'Prompt Engineering',
    language: 'English / Bangla Notes',
    readingLevel: 'Intermediate',
    imageUrl: '/src/assets/images/programme_ai_literacy_1794867547641.jpg',
  },
];
