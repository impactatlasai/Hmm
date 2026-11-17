export interface PromptItem {
  id: string;
  title: string;
  description: string;
  promptText: string;
}

export interface IndustryPromptCategory {
  id: string;
  name: string;
  iconName: string;
  prompts: PromptItem[];
}

export const INDUSTRY_PROMPT_CATEGORIES: IndustryPromptCategory[] = [
  {
    id: 'business-strategy',
    name: 'Business & Strategy',
    iconName: 'Briefcase',
    prompts: [
      {
        id: 'biz-1',
        title: 'Market Entry & Opportunity Brief',
        description: 'Generate a structured market entry assessment for a new product or service line.',
        promptText:
          'Act as a senior business strategy analyst. Evaluate the feasibility of launching [Product/Service] in [Target Market/City]. Structure your response with: 1) Customer pain points, 2) Key competitors & differentiation, 3) Operational risks, and 4) A realistic 90-day validation roadmap.',
      },
      {
        id: 'biz-2',
        title: 'Client Proposal Executive Summary',
        description: 'Draft a clear, persuasive executive summary for a B2B service proposal.',
        promptText:
          'Write a concise executive summary for a client proposal addressed to [Client Organisation] addressing [Problem Statement]. Highlight scope boundaries, measurable deliverables, timeline, and human quality assurance.',
      },
    ],
  },
  {
    id: 'marketing-growth',
    name: 'Marketing & Growth',
    iconName: 'Megaphone',
    prompts: [
      {
        id: 'mkt-1',
        title: '30-Day Content Pillar Calendar',
        description: 'Build an audience-focused monthly social and blog content plan.',
        promptText:
          'Act as a content strategist for [Brand/Industry]. Create a 4-week content calendar built on 3 educational pillars tailored to [Target Audience]. Include topic angle, format, and a non-hype call-to-action for each post.',
      },
      {
        id: 'mkt-2',
        title: 'Customer Persona & Messaging Matrix',
        description: 'Map core buyer segments, objections, and verified value propositions.',
        promptText:
          'Develop 2 detailed customer personas for [Offer]. For each persona list goals, daily friction points, common scepticism or objections, and clear, honest value messaging.',
      },
    ],
  },
  {
    id: 'human-resources',
    name: 'Human Resources & L&D',
    iconName: 'Users',
    prompts: [
      {
        id: 'hr-1',
        title: 'Competency-Based Job Description',
        description: 'Draft an inclusive, bias-checked job description with clear role outcomes.',
        promptText:
          'Act as an HR specialist. Draft a structured job description for [Role Title] at [Company Type]. Include core responsibilities, essential vs. nice-to-have competencies, 90-day success indicators, and unbiased language.',
      },
      {
        id: 'hr-2',
        title: 'Structured Behavioural Interview Guide',
        description: 'Create fair, standardised interview questions and scoring rubrics.',
        promptText:
          'Design 6 structured behavioural interview questions for assessing [Skill/Competency]. Include follow-up probes and what strong vs. weak evidence looks like so human interviewers can score fairly.',
      },
    ],
  },
  {
    id: 'education-faculty',
    name: 'Education & Teaching',
    iconName: 'GraduationCap',
    prompts: [
      {
        id: 'edu-1',
        title: 'Outcome-Aligned Lesson Plan',
        description: 'Structure a 90-minute interactive class session with formative checks.',
        promptText:
          'Act as an instructional designer. Design a 90-minute lesson plan on [Topic] for [Student Level]. Break it into learning objectives, conceptual explanation, 15-minute guided group activity, and a short comprehension check.',
      },
      {
        id: 'edu-2',
        title: 'AI-Resilient Assessment Rubric',
        description: 'Convert rote essay prompts into applied, verifiable student projects.',
        promptText:
          'Redesign this traditional assignment prompt ([Insert Prompt]) so it assesses critical thinking, local context application, and oral/process reflection rather than easily generated generic text.',
      },
    ],
  },
  {
    id: 'academic-research',
    name: 'Research & Academic',
    iconName: 'BookOpen',
    prompts: [
      {
        id: 'res-1',
        title: 'Literature Synthesis & Gap Matrix',
        description: 'Organise research themes, methodologies, and open questions from pasted abstracts.',
        promptText:
          'Based ONLY on the paper summaries I paste below, create a comparative table showing Author/Year, Methodology, Key Findings, Limitations, and Unanswered Questions. Do not invent citations.',
      },
      {
        id: 'res-2',
        title: 'Research Concept Note Critic',
        description: 'Identify methodological weaknesses and assumptions in a draft proposal.',
        promptText:
          'Review my draft research objective and methodology below as a rigorous peer reviewer. Point out unclear definitions, potential confounding variables, and ethical considerations.',
      },
    ],
  },
  {
    id: 'finance-accounting',
    name: 'Finance & Budgeting',
    iconName: 'Calculator',
    prompts: [
      {
        id: 'fin-1',
        title: 'Budget-vs-Actual Variance Narrative',
        description: 'Turn anonymised budget figures into a clear management summary.',
        promptText:
          'Act as a finance manager. Given the anonymised quarterly budget-vs-actual figures below, draft a concise management commentary explaining key variances, cost drivers, and recommended follow-up checks.',
      },
      {
        id: 'fin-2',
        title: 'Expense Categorisation Framework',
        description: 'Standardise operational cost buckets for SME or NGO project reporting.',
        promptText:
          'Propose a clean chart-of-accounts expense categorisation structure tailored for a [Organisation Type, e.g., mid-sized NGO / service agency] with sample line items and documentation requirements.',
      },
    ],
  },
  {
    id: 'project-management',
    name: 'Project Management',
    iconName: 'CheckSquare',
    prompts: [
      {
        id: 'pm-1',
        title: 'Work Breakdown Structure (WBS) Builder',
        description: 'Break a complex initiative into phases, deliverables, and owners.',
        promptText:
          'Act as a senior project manager. Create a 4-phase Work Breakdown Structure for [Project Name] with timeline [Duration]. Include concrete deliverables, dependencies, and milestone sign-off criteria.',
      },
      {
        id: 'pm-2',
        title: 'Project Risk Register Generator',
        description: 'Identify operational, schedule, and stakeholder risks with mitigations.',
        promptText:
          'Create a risk register table (Risk, Likelihood, Impact, Mitigation Plan, Contingency Owner) for delivering [Project Scope] under [Key Constraint].',
      },
    ],
  },
  {
    id: 'software-engineering',
    name: 'Software & Web Dev',
    iconName: 'Code',
    prompts: [
      {
        id: 'dev-1',
        title: 'Code Review & Security Checklist',
        description: 'Audit TypeScript/React or backend snippets for edge cases and safety.',
        promptText:
          'Review the code below strictly for: 1) Input validation & injection risks, 2) Null/error-handling gaps, 3) Performance bottlenecks, and 4) Readability improvements. Explain why each change matters.',
      },
      {
        id: 'dev-2',
        title: 'API Contract & Documentation Writer',
        description: 'Generate clean endpoint documentation and test payloads from route handlers.',
        promptText:
          'From the Express route handler below, produce clear API documentation detailing request params, validation rules, success responses, error codes, and curl test examples.',
      },
    ],
  },
  {
    id: 'content-writing',
    name: 'Content & Journalism',
    iconName: 'FileText',
    prompts: [
      {
        id: 'cnt-1',
        title: 'Bilingual Article Simplifier (BN/EN)',
        description: 'Translate dense technical briefs into accessible Bangla educational copy.',
        promptText:
          'Translate and adapt the following technical explanation into natural, clear Standard Bangla suitable for university students. Preserve technical terms in parentheses where helpful.',
      },
      {
        id: 'cnt-2',
        title: 'Editorial Fact-Check & Tone Audit',
        description: 'Flag unsupported claims, exaggerated promises, and clarity issues in drafts.',
        promptText:
          'Audit this draft article for unsupported claims, vague superlatives, logical leaps, and readability issues. List specific sentences needing source verification.',
      },
    ],
  },
  {
    id: 'cybersecurity-safety',
    name: 'Safety, Ethics & Policy',
    iconName: 'Shield',
    prompts: [
      {
        id: 'sec-1',
        title: 'Acceptable AI Use Policy Drafter',
        description: 'Draft clear staff guardrails on confidentiality and human verification.',
        promptText:
          'Draft a 1-page Internal AI Acceptable Use Policy for a [Team/Organisation Type]. Explicitly define prohibited sensitive data uploads, mandatory human verification steps, and attribution rules.',
      },
      {
        id: 'sec-2',
        title: 'Digital Privacy & Account Hardening Checklist',
        description: 'Create an actionable personal privacy checklist for workshops.',
        promptText:
          'Create a step-by-step non-technical checklist helping everyday social media and smartphone users audit 2FA, privacy visibility, password hygiene, and impersonation reporting.',
      },
    ],
  },
  {
    id: 'healthcare-admin',
    name: 'Healthcare & Public Health',
    iconName: 'Activity',
    prompts: [
      {
        id: 'hlt-1',
        title: 'Patient Education Leaflet Simplifier',
        description: 'Convert clinical instructions into clear, empathetic patient guidance.',
        promptText:
          'Rewrite the approved medical instructions below at a plain 6th-grade reading level for patient handouts. Emphasise follow-up warning signs and never add clinical advice beyond the provided text.',
      },
    ],
  },
  {
    id: 'ngo-development',
    name: 'NGO & Social Impact',
    iconName: 'Globe',
    prompts: [
      {
        id: 'ngo-1',
        title: 'Donor Concept Note & Logframe Outline',
        description: 'Structure problem statements, Theory of Change, and measurable indicators.',
        promptText:
          'Act as a development programme specialist. Draft a concept note outline for [Intervention Area] targeting [Community], including Problem Statement, Theory of Change, Outputs, Outcomes, and Safeguarding considerations.',
      },
      {
        id: 'ngo-2',
        title: 'Field Visit Synthesis & Learning Brief',
        description: 'Summarise anonymised field observation notes into structured insights.',
        promptText:
          'Synthesise the anonymised field monitoring notes below into: Key Implementation Wins, Operational Bottlenecks, Community Feedback Themes, and Immediate Action Items.',
      },
    ],
  },
  {
    id: 'public-administration',
    name: 'Public Office & Admin',
    iconName: 'Building',
    prompts: [
      {
        id: 'pub-1',
        title: 'Official Briefing Note & Circular Draft',
        description: 'Prepare clear, formal internal memos and procedural circulars.',
        promptText:
          'Draft a formal briefing note for senior leadership summarising [Policy/Operational Issue]. Keep it strictly objective with Background, Current Status, Options Analysis, and Recommended Next Step.',
      },
    ],
  },
  {
    id: 'customer-support',
    name: 'Customer Support & CX',
    iconName: 'Headphones',
    prompts: [
      {
        id: 'cx-1',
        title: 'Empathetic Escalation Response Kit',
        description: 'Write transparent, calm resolution templates for service delays.',
        promptText:
          'Write 3 courteous customer support response templates for [Service Issue] balancing empathy, clear timeline transparency, and zero over-promising.',
      },
    ],
  },
  {
    id: 'career-leadership',
    name: 'Career & Executive Leadership',
    iconName: 'Award',
    prompts: [
      {
        id: 'car-1',
        title: 'CV Impact Bullet Refiner',
        description: 'Transform passive job duties into truthful, evidence-backed achievements.',
        promptText:
          'Rewrite these raw work responsibilities into concise, action-oriented CV bullet points highlighting measurable scope and tools used, without exaggerating or inventing metrics.',
      },
      {
        id: 'car-2',
        title: '90-Day Role Onboarding Plan',
        description: 'Design a structured first-90-day learning and delivery plan for new hires or managers.',
        promptText:
          'Create a 30-60-90 day onboarding roadmap for a new [Role Title] focusing on stakeholder listening, process audits, quick wins, and measurable Q1 objectives.',
      },
    ],
  },
];
