export type InstitutionalIconKey =
  | 'users'
  | 'briefcase'
  | 'graduation-cap'
  | 'clipboard-check'
  | 'map'
  | 'workflow'
  | 'presentation'
  | 'shield-check';

export interface InstitutionalPathway {
  id: string;
  title: string;
  targetAudience: string;
  summary: string;
  focusAreas: string[];
  deliverables: string[];
}

export interface InstitutionalSector {
  id: string;
  title: string;
  summary: string;
  priorities: string[];
  deliverables: string[];
}

export interface InstitutionalServiceItem {
  code: string;
  slug: string;
  title: string;
  badge: string;
  iconKey: InstitutionalIconKey;
  shortSummary: string;
  overview: string;
  engagementFormat: string;
  imageUrl: string;
  imageAlt: string;
  whoItIsFor: string[];
  scopeOfService: string[];
  keyAreas: string[];
  deliveryApproach: string[];
  potentialDeliverables: string[];
  pathways?: InstitutionalPathway[];
  sectors?: InstitutionalSector[];
}

export const INSTITUTIONAL_SERVICES: InstitutionalServiceItem[] = [
  {
    code: 'INST-01',
    slug: 'employees-ai-training',
    title: 'Employees AI Training',
    badge: 'Corporate & Teams',
    iconKey: 'users',
    shortSummary:
      'Role-specific workplace AI training workshops helping corporate, NGO, and institutional teams use AI responsibly and productively.',
    overview:
      'This training programme equips organisational employees across departments—operations, administration, communication, research, and client support—with practical AI fluency tailored to daily workplace responsibilities. Sessions emphasise accuracy, data confidentiality, verification standards, and measurable workflow efficiency without disrupting existing institutional controls.',
    engagementFormat: 'On-site Workshops, Live Virtual Cohorts, or Hybrid Team Sprints',
    imageUrl: '/src/assets/images/course_everyday_productivity_1794924806999.jpg',
    imageAlt: 'Workplace professionals collaborating on AI productivity exercises',
    whoItIsFor: [
      'Private companies, SMEs, and corporate operational departments',
      'NGOs, development organisations, and programme support teams',
      'Administrative, communications, HR, and finance office staff',
    ],
    scopeOfService: [
      'Pre-training role mapping across participating departments',
      'Hands-on prompt structuring and document/report assistance workshops',
      'Data privacy, client confidentiality, and fact-checking protocols',
      'Departmental use-case library tailored to real team workflows',
    ],
    keyAreas: [
      'Structured workplace prompting & quality review',
      'Document drafting, briefing notes & meeting synthesis',
      'Spreadsheet organisation & management summaries',
      'Data confidentiality & safe AI usage rules',
      'Verification workflows to prevent AI hallucinations',
      'Role-based daily productivity toolkits',
    ],
    deliveryApproach: [
      'Departmental needs scoping prior to session delivery',
      'Bilingual (Bangla & English) interactive facilitation with live exercises',
      'Practical case scenarios modelled on your team’s daily tasks',
      'Post-workshop reference handbook and usage checklists',
    ],
    potentialDeliverables: [
      'Custom Workplace AI Training Slide Deck & Workbook',
      'Department-Specific Prompt & Workflow Library',
      'Employee Safe AI Usage Quick-Reference Checklist',
      'Participant Attendance & Completion Summary Report',
    ],
  },
  {
    code: 'INST-02',
    slug: 'ai-leadership-executive-training',
    title: 'AI Leadership & Executive Training',
    badge: 'Executive Advisory',
    iconKey: 'briefcase',
    shortSummary:
      'Executive briefings and strategic workshops on AI adoption decisions, governance oversight, and organisational change management.',
    overview:
      'Designed for C-suite executives, managing directors, department heads, and senior public-sector leaders, this programme frames AI as an organisational capability rather than an isolated software trend. Leaders examine strategic prioritisation, workforce transition, risk governance, and realistic ROI evaluation before committing institutional resources.',
    engagementFormat: 'Executive Roundtables, Half-Day Strategy Briefings, or Multi-Session Advisory',
    imageUrl: '/src/assets/images/course_ai_governance_leadership_1794924812599.jpg',
    imageAlt: 'Senior organisational leaders reviewing AI strategy and governance frameworks',
    whoItIsFor: [
      'Chief executives, founders, board members, and senior directors',
      'Department heads and business unit leaders',
      'Senior government officials and NGO country leadership teams',
    ],
    scopeOfService: [
      'Executive briefing on generative AI capabilities, limits, and market shifts',
      'Decision framework for high-impact vs. high-risk AI use cases',
      'Workforce change management, reskilling, and culture alignment',
      'Leadership accountability, governance structures, and oversight standards',
    ],
    keyAreas: [
      'AI adoption vs. true organisational transformation',
      'Executive decision-making & build-buy-partner evaluation',
      'Managing reputational, privacy, and operational AI risks',
      'Workforce capability planning & role evolution',
      'Prioritising pilot initiatives with measurable indicators',
      'Internal leadership alignment & communication',
    ],
    deliveryApproach: [
      'Confidential pre-session alignment with executive sponsors',
      'Case-led roundtable dialogue focused on strategic trade-offs',
      'Decision matrices and prioritisation scorecards applied live',
    ],
    potentialDeliverables: [
      'Executive AI Strategy & Risk Briefing Memo',
      'Use-Case Prioritisation & Feasibility Scorecard',
      '90-Day Leadership Alignment Action Plan',
    ],
  },
  {
    code: 'INST-03',
    slug: 'university-academic-ai-training',
    title: 'University & Academic AI Training',
    badge: 'Higher Education',
    iconKey: 'graduation-cap',
    shortSummary:
      'AI literacy, academic integrity, ethical research workflows, and assessment adaptation workshops for universities, faculty, and students.',
    overview:
      'Higher education institutions face urgent questions regarding academic honesty, thesis supervision, faculty productivity, and student career readiness in the generative AI era. This service supports university leadership, faculty members, and student cohorts in building constructive, transparent, and ethical academic practices.',
    engagementFormat: 'Faculty Development Workshops, Departmental Seminars, & Student Bootcamps',
    imageUrl: '/src/assets/images/programme_ai_literacy_1794867547641.jpg',
    imageAlt: 'University educators and students participating in an academic AI workshop',
    whoItIsFor: [
      'Public and private university faculty members and department chairs',
      'Academic administrators, IQAC units, and curriculum committees',
      'Undergraduate, postgraduate, and research student cohorts',
    ],
    scopeOfService: [
      'Faculty workshops on AI-resilient assignment & assessment redesign',
      'Academic integrity, citation transparency, and AI disclosure guidelines',
      'Ethical literature review and research synthesis workflows',
      'Department-wide student AI literacy and employability orientations',
    ],
    keyAreas: [
      'Designing AI-aware coursework & oral/applied assessments',
      'Academic integrity policies & disclosure standards',
      'Responsible AI in literature mapping & research drafting',
      'Understanding limitations of AI detection tools',
      'Faculty productivity in rubric design & lesson planning',
      'Student readiness for modern AI-enabled workplaces',
    ],
    deliveryApproach: [
      'Discipline-aware adaptation (STEM, Business, Social Sciences, Humanities)',
      'Interactive syllabus audit and assessment redesign exercises',
      'Dedicated Q&A for faculty governance and departmental policies',
    ],
    potentialDeliverables: [
      'Draft Departmental Academic AI Integrity & Disclosure Policy',
      'Faculty Guide to AI-Resilient Assignment Design',
      'Student Responsible Academic AI Orientation Pack',
    ],
  },
  {
    code: 'INST-04',
    slug: 'ai-readiness-assessment',
    title: 'AI Readiness Assessment',
    badge: 'Diagnostic & Audit',
    iconKey: 'clipboard-check',
    shortSummary:
      'Structured AI readiness diagnostics with dedicated pathways evaluating skills, workflows, data practices, and governance for Companies, Offices, and Universities.',
    overview:
      'Before investing in AI platforms or wide-scale staff rollouts, institutions need an objective baseline of where they stand. Our AI Readiness Assessment evaluates human capabilities, process maturity, data sensitivity, infrastructure constraints, and policy gaps across three specialised institutional pathways.',
    engagementFormat: '2–4 Week Diagnostic Engagement (Surveys, Interviews, & Executive Readout)',
    imageUrl: '/src/assets/images/course_data_intelligence_1794924810524.jpg',
    imageAlt: 'Institutional AI readiness diagnostic dashboard and maturity scorecard review',
    whoItIsFor: [
      'Companies planning structured AI adoption across business units',
      'Government and administrative offices evaluating workflow readiness',
      'Universities assessing faculty, student, and academic policy readiness',
    ],
    scopeOfService: [
      'Stakeholder readiness survey and leadership/departmental interviews',
      'Workflow audit to identify safe, high-leverage AI assistance opportunities',
      'Data sensitivity, confidentiality, and governance gap diagnostic',
      'Prioritised readiness scorecard and capacity-building recommendations',
    ],
    keyAreas: [
      'Workforce AI literacy & skills baseline evaluation',
      'Operational process suitability & bottleneck mapping',
      'Data privacy, confidentiality & security posture check',
      'Governance, policy & human-oversight readiness',
      'Tooling feasibility within budget & infrastructure limits',
      'Departmental pilot readiness prioritisation',
    ],
    deliveryApproach: [
      'Pathway selection matched to institutional structure (Company, Office, or University)',
      'Mixed-method assessment combining structured surveys and team interviews',
      'Clear maturity findings presentation without vendor lock-in',
    ],
    potentialDeliverables: [
      'Institutional AI Readiness Maturity Scorecard',
      'Departmental Skills & Risk Gap Analysis Report',
      'Prioritised Pre-Adoption & Training Recommendations',
    ],
    pathways: [
      {
        id: 'readiness-companies',
        title: 'Companies & Private Sector Pathway',
        targetAudience: 'SMEs, Corporate Groups, Service Firms & Startups',
        summary:
          'Assesses commercial workflows, customer-facing teams, reporting bottlenecks, and competitive productivity opportunities alongside commercial data protection.',
        focusAreas: [
          'Sales, marketing, operations & finance workflow suitability',
          'Commercial confidentiality & client data exposure risks',
          'Staff role-by-role AI skill baselines',
        ],
        deliverables: [
          'Commercial AI Opportunity Matrix',
          'Departmental Training & Pilot Readiness Scorecards',
        ],
      },
      {
        id: 'readiness-offices',
        title: 'Government, Public & Administrative Offices Pathway',
        targetAudience: 'Public Agencies, Administrative Directorates & Institutional Offices',
        summary:
          'Evaluates documentation load, citizen/stakeholder communication, file synthesis processes, and strict public-record confidentiality requirements.',
        focusAreas: [
          'Documentation, drafting & administrative process mapping',
          'Official record confidentiality & access governance',
          'Digital literacy across administrative grades',
        ],
        deliverables: [
          'Administrative Workflow & Safe Use Diagnostic',
          'Office AI Governance & Staff Upskilling Brief',
        ],
      },
      {
        id: 'readiness-universities',
        title: 'Universities & Academic Institutions Pathway',
        targetAudience: 'Universities, Colleges, Research Institutes & Academic Boards',
        summary:
          'Measures faculty AI fluency, student usage patterns, assessment vulnerability, research integrity standards, and institutional policy readiness.',
        focusAreas: [
          'Curriculum & assessment AI-resilience review',
          'Faculty & researcher AI support requirements',
          'Campus academic integrity & disclosure readiness',
        ],
        deliverables: [
          'Academic AI Readiness & Policy Gap Report',
          'Faculty Development & Curriculum Adaptation Plan',
        ],
      },
    ],
  },
  {
    code: 'INST-05',
    slug: 'ai-implementation-roadmap',
    title: 'AI Implementation Roadmap',
    badge: 'Multi-Sector Strategy',
    iconKey: 'map',
    shortSummary:
      'Phased AI implementation roadmaps tailored for Companies & Businesses, Government Offices, Universities, and NGOs.',
    overview:
      'Translating AI ambition into sustainable daily operations requires sequencing, realistic milestones, governance checkpoints, and human accountability. We co-design practical 90-day, 6-month, and 12-month implementation roadmaps calibrated to your sector’s regulatory environment and operational capacity.',
    engagementFormat: 'Advisory Planning Sprints, Stakeholder Co-Design, & Milestone Blueprinting',
    imageUrl: '/src/assets/images/course_business_transformation_1794924809638.jpg',
    imageAlt: 'Strategic AI implementation roadmap planning session across teams',
    whoItIsFor: [
      'Companies & private businesses operationalising AI pilots across teams',
      'Government & public offices modernising administrative workflows safely',
      'Universities rolling out faculty, student, and governance programmes',
      'NGOs & development organisations enhancing reporting, M&E, and programme impact',
    ],
    scopeOfService: [
      'Sequenced pilot selection balancing quick wins and risk controls',
      'Role-based staff training plan aligned with rollout phases',
      'Governance gates, human-review checkpoints, and KPI definition',
      'Vendor-neutral tool category recommendations and budget planning',
    ],
    keyAreas: [
      'Phase 1 (Foundation & Policy) to Phase 3 (Scaled Integration)',
      'Cross-functional pilot charter design',
      'Change management & internal champion structures',
      'Risk mitigation, data boundaries & compliance alignment',
      'Measurable adoption KPIs & quarterly review cadence',
    ],
    deliveryApproach: [
      'Sector-specific co-design workshops with departmental leads',
      'Practical documentation structured for immediate leadership sign-off',
      'Zero hype—focused strictly on verifiable operational feasibility',
    ],
    potentialDeliverables: [
      'Phased 90-Day / 6-Month / 12-Month AI Implementation Roadmap',
      'Pilot Project Charters & Success Metrics Framework',
      'Governance & Risk Escalation Checkpoints',
    ],
    sectors: [
      {
        id: 'sector-companies',
        title: 'Companies & Businesses',
        summary:
          'Commercial roadmaps prioritising team productivity, client service quality, operations automation, and verifiable ROI.',
        priorities: [
          'Pilot rollout across sales, support & operations',
          'Employee workflow upskilling schedule',
          'Client data protection guardrails',
        ],
        deliverables: [
          'Commercial AI Rollout Blueprint',
          'Departmental KPI & Pilot Tracker',
        ],
      },
      {
        id: 'sector-government',
        title: 'Government & Public Offices',
        summary:
          'Careful, accountability-first roadmaps centred on administrative efficiency, citizen service drafting, and public-data safeguards.',
        priorities: [
          'Human-in-the-loop administrative review',
          'Strict data classification & zero-leakage protocols',
          'Capacity development for officers & staff',
        ],
        deliverables: [
          'Public-Sector Phased Adoption Plan',
          'Administrative Safeguards & Oversight Matrix',
        ],
      },
      {
        id: 'sector-universities',
        title: 'Universities & Academic Institutions',
        summary:
          'Balanced academic roadmaps integrating faculty enablement, research ethics, assessment reform, and campus-wide AI literacy.',
        priorities: [
          'Senate/Academic Council policy alignment',
          'Faculty & thesis supervisor training schedule',
          'Student AI literacy integration across faculties',
        ],
        deliverables: [
          'University Academic AI Roadmap',
          'Departmental Assessment Transition Guide',
        ],
      },
      {
        id: 'sector-ngos',
        title: 'NGOs & Development Organisations',
        summary:
          'Mission-aligned roadmaps improving grant reporting, M&E synthesis, field documentation, and beneficiary privacy protection.',
        priorities: [
          'Beneficiary & sensitive field data safeguarding',
          'Proposal, M&E & donor report workflow efficiency',
          'Field and HQ team AI capacity building',
        ],
        deliverables: [
          'NGO Responsible AI Adoption Plan',
          'Programme & M&E Pilot Implementation Guide',
        ],
      },
    ],
  },
  {
    code: 'INST-06',
    slug: 'ai-workflow-automation-training',
    title: 'AI Workflow & Automation Training',
    badge: 'Operations & Process',
    iconKey: 'workflow',
    shortSummary:
      'Practical workflow auditing and no-code, human-reviewed AI automation training for operational, admin, and programme teams.',
    overview:
      'Many institutions waste staff hours on repetitive data entry, meeting follow-ups, form triage, and report formatting. This hands-on training enables non-engineering operational teams to map bottlenecks and build safe, human-approved no-code AI workflows without writing complex software.',
    engagementFormat: 'Hands-On Technical & No-Code Lab Cohorts (2–4 Sessions)',
    imageUrl: '/src/assets/images/course_workflow_automation_1794924807818.jpg',
    imageAlt: 'Operations specialists designing AI workflow automation diagrams',
    whoItIsFor: [
      'Operations managers, admin leads, and project coordinators',
      'Marketing, HR, and customer support operational teams',
      'NGO programme and M&E documentation units',
    ],
    scopeOfService: [
      'Live workflow bottleneck audit using your team’s real recurring processes',
      'No-code automation architecture (triggers, AI processing, human review gates)',
      'Error-handling, logging, and reliability practices for non-developers',
      'Prototype workflow build sprint during training',
    ],
    keyAreas: [
      'Auditing tasks suitable vs. unsuitable for automation',
      'No-code integration concepts (webhooks, forms, spreadsheets, docs)',
      'Designing human-in-the-loop approval checkpoints',
      'Automated reporting & communication drafting pipelines',
      'Preventing silent errors and maintaining audit logs',
    ],
    deliveryApproach: [
      'Workshop participants map and build an actual pilot workflow',
      'Focus on low-cost, maintainable no-code tools and clear SOP documentation',
      'Strong emphasis on security permissions and human sign-off',
    ],
    potentialDeliverables: [
      'Team Workflow Automation Blueprints & SOP Templates',
      'Working Prototype Pilot Workflows Designed by Staff',
      'Automation Risk & Maintenance Checklist',
    ],
  },
  {
    code: 'INST-07',
    slug: 'train-the-trainer-programme',
    title: 'Train-the-Trainer Programme',
    badge: 'Capacity Multiplier',
    iconKey: 'presentation',
    shortSummary:
      'Preparing internal L&D facilitators, corporate AI champions, and university faculty to confidently deliver standardised AI literacy training.',
    overview:
      'Sustainable institutional capability requires internal capacity—not permanent dependence on external trainers. Our Train-the-Trainer Programme prepares your Learning & Development specialists, senior staff champions, and faculty members with structured curricula, facilitation techniques, and evaluation rubrics to train teams internally.',
    engagementFormat: 'Intensive Facilitator Cohort + Teach-Back Evaluation & Curriculum Kit',
    imageUrl: '/src/assets/images/programme_engineering_lab_1794867547072.jpg',
    imageAlt: 'Internal trainers and faculty participating in a Train-the-Trainer facilitation cohort',
    whoItIsFor: [
      'Corporate Learning & Development (L&D) and HR training teams',
      'Internal AI champions and departmental mentors',
      'University lecturers and NGO capacity-building officers',
    ],
    scopeOfService: [
      'Mastery of core AI literacy, prompting, and responsible AI concepts',
      'Pedagogical techniques for mixed-skill adult and student audiences',
      'Handling misconceptions, AI scepticism, and ethical classroom debates',
      'Observed practice facilitation (teach-back) with constructive coaching',
    ],
    keyAreas: [
      'Structuring beginner-friendly AI explanations in Bangla & English',
      'Live tool demonstration & troubleshooting techniques',
      'Assessing participant exercises & practical outputs',
      'Embedding AI safety & responsible use in every module',
      'Customising slide decks & case studies per department',
    ],
    deliveryApproach: [
      'Cohort-based experiential training with practice teach-back sessions',
      'Provision of modular facilitator guides and participant handouts',
      'Follow-up coaching clinic after trainers deliver their first internal session',
    ],
    potentialDeliverables: [
      'Standardised Internal Facilitator Guide & Slide Templates',
      'Practical Exercise Bank & Assessment Rubrics',
      'Trainer Readiness Evaluation & Feedback Summary',
    ],
  },
  {
    code: 'INST-08',
    slug: 'ai-governance-policy-training',
    title: 'AI Governance & Policy Training',
    badge: 'Risk & Compliance',
    iconKey: 'shield-check',
    shortSummary:
      'Acceptable Use Policy design, data privacy, algorithmic risk, copyright awareness, and institutional AI governance workshops.',
    overview:
      'Unregulated staff use of public AI tools exposes institutions to data leakage, copyright disputes, biased decisions, and reputational harm. This specialised training equips compliance, legal, HR, IT, and leadership teams to establish clear, enforceable, and practical internal AI governance policies.',
    engagementFormat: 'Policy Lab Workshops, Governance Briefings, & Draft Policy Co-Creation',
    imageUrl: '/src/assets/images/programme_governance_forum_1794867547140.jpg',
    imageAlt: 'Policy and compliance leaders collaborating in an AI Governance forum',
    whoItIsFor: [
      'Compliance, risk management, legal, and internal audit teams',
      'HR, IT security, and administrative policy committees',
      'University academic boards and NGO safeguarding/compliance leads',
    ],
    scopeOfService: [
      'Mapping institutional AI risks (privacy, IP, bias, hallucination liability)',
      'Alignment with global governance benchmarks (UNESCO, OECD, EU AI Act principles)',
      'Drafting a practical Organisational AI Acceptable Use Policy (AUP)',
      'Establishing human-oversight tiers and incident reporting workflows',
    ],
    keyAreas: [
      'Data classification rules for public vs. enterprise AI tools',
      'Algorithmic bias & fairness reviews in HR/service decisions',
      'Intellectual property, copyright & attribution standards',
      'Third-party AI vendor & procurement risk checklists',
      'Staff communication & realistic policy enforcement',
    ],
    deliveryApproach: [
      'Scenario-based risk table-top exercises tailored to your sector',
      'Guided drafting clinic producing concrete internal policy text',
      'Cross-functional alignment across IT, HR, Legal, and Operations',
    ],
    potentialDeliverables: [
      'Draft Organisational AI Acceptable Use Policy (AUP) Framework',
      'AI Risk Classification & Vendor Review Checklist',
      'Governance Committee Charter & Oversight Protocol',
    ],
  },
];

export function getInstitutionalServiceBySlug(
  slug: string
): InstitutionalServiceItem | undefined {
  const normalized = slug.trim().toLowerCase();
  return INSTITUTIONAL_SERVICES.find(
    (s) => s.slug.toLowerCase() === normalized || s.code.toLowerCase() === normalized
  );
}
