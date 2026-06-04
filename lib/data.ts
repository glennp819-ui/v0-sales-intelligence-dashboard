// Mock data for the PG Prioritization Command Center

export interface Account {
  id: string
  name: string
  industry: string
  tier: 1 | 2 | 3
  scores: {
    engineeringHeadcount: number
    aiMlInvestment: number
    toolingStack: number
    fundingRecency: number
    developerVelocity: number
    championAccessibility: number
    expansionPotential: number
  }
  details: {
    website: string
    employees: string
    funding: string
    techStack: string[]
    recentNews: string[]
    champions: {
      name: string
      title: string
      linkedIn: string
    }[]
    discoveryQuestions: string[]
    battleNotes: string
  }
}

export interface CriteriaWeight {
  id: string
  label: string
  shortLabel: string
  weight: number
}

export const defaultWeights: CriteriaWeight[] = [
  { id: 'engineeringHeadcount', label: 'Engineering Headcount', shortLabel: 'Eng HC', weight: 20 },
  { id: 'aiMlInvestment', label: 'AI/ML Investment Signal', shortLabel: 'AI/ML', weight: 15 },
  { id: 'toolingStack', label: 'Current Tooling Stack', shortLabel: 'Stack', weight: 15 },
  { id: 'fundingRecency', label: 'Funding Recency', shortLabel: 'Fund', weight: 10 },
  { id: 'developerVelocity', label: 'Developer Velocity Culture', shortLabel: 'Velocity', weight: 15 },
  { id: 'championAccessibility', label: 'Champion Accessibility', shortLabel: 'Champ', weight: 15 },
  { id: 'expansionPotential', label: 'Expansion Potential', shortLabel: 'Expand', weight: 10 },
]

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Anthropic',
    industry: 'AI Research',
    tier: 1,
    scores: {
      engineeringHeadcount: 92,
      aiMlInvestment: 98,
      toolingStack: 85,
      fundingRecency: 95,
      developerVelocity: 90,
      championAccessibility: 78,
      expansionPotential: 88,
    },
    details: {
      website: 'anthropic.com',
      employees: '500-1000',
      funding: '$7.6B (Series E, 2024)',
      techStack: ['Python', 'PyTorch', 'Kubernetes', 'VS Code', 'GitHub'],
      recentNews: [
        'Launched Claude 3.5 Sonnet with expanded context window',
        'Announced $2B investment from Google',
        'Expanding engineering team by 40%',
      ],
      champions: [
        { name: 'Sarah Chen', title: 'VP of Engineering', linkedIn: 'linkedin.com/in/sarahchen' },
        { name: 'Marcus Webb', title: 'Staff Engineer', linkedIn: 'linkedin.com/in/marcuswebb' },
      ],
      discoveryQuestions: [
        'How is your team currently managing code review velocity?',
        'What tooling gaps exist in your AI model development workflow?',
        'How do you onboard new engineers to your codebase?',
      ],
      battleNotes: 'Strong VS Code users. Focus on AI-assisted debugging and context window advantages.',
    },
  },
  {
    id: '2',
    name: 'Stripe',
    industry: 'FinTech',
    tier: 1,
    scores: {
      engineeringHeadcount: 95,
      aiMlInvestment: 75,
      toolingStack: 90,
      fundingRecency: 70,
      developerVelocity: 95,
      championAccessibility: 85,
      expansionPotential: 92,
    },
    details: {
      website: 'stripe.com',
      employees: '8000+',
      funding: '$95B valuation (2021)',
      techStack: ['Ruby', 'Go', 'React', 'VS Code', 'IntelliJ'],
      recentNews: [
        'Launched Stripe Assistant AI feature',
        'Acquired Lemon Squeezy for indie developer market',
        'Opening new engineering hub in Toronto',
      ],
      champions: [
        { name: 'David Singleton', title: 'CTO', linkedIn: 'linkedin.com/in/davidsingleton' },
        { name: 'Cristina Cordova', title: 'Head of Platform', linkedIn: 'linkedin.com/in/cristinacordova' },
      ],
      discoveryQuestions: [
        'How does your platform team evaluate new developer tools?',
        'What metrics do you track for developer productivity?',
        'How do you handle multi-language codebase navigation?',
      ],
      battleNotes: 'Very metrics-driven. Need hard ROI data. Focus on productivity gains across large teams.',
    },
  },
  {
    id: '3',
    name: 'Vercel',
    industry: 'Developer Tools',
    tier: 2,
    scores: {
      engineeringHeadcount: 65,
      aiMlInvestment: 88,
      toolingStack: 95,
      fundingRecency: 85,
      developerVelocity: 92,
      championAccessibility: 90,
      expansionPotential: 70,
    },
    details: {
      website: 'vercel.com',
      employees: '500-750',
      funding: '$250M (Series E, 2024)',
      techStack: ['TypeScript', 'Next.js', 'React', 'VS Code'],
      recentNews: [
        'Launched v0 AI code generation tool',
        'Next.js 15 released with improved performance',
        'Announced Vercel AI SDK 4.0',
      ],
      champions: [
        { name: 'Guillermo Rauch', title: 'CEO', linkedIn: 'linkedin.com/in/guillermo' },
        { name: 'Lee Robinson', title: 'VP of Product', linkedIn: 'linkedin.com/in/leerobinson' },
      ],
      discoveryQuestions: [
        'How is your team using AI in the development workflow today?',
        'What friction points exist in your current IDE setup?',
        'How do you see AI-assisted coding evolving for frontend development?',
      ],
      battleNotes: 'Already building AI tools. Partnership angle might be stronger than pure sales.',
    },
  },
  {
    id: '4',
    name: 'Databricks',
    industry: 'Data & AI Platform',
    tier: 2,
    scores: {
      engineeringHeadcount: 88,
      aiMlInvestment: 92,
      toolingStack: 78,
      fundingRecency: 80,
      developerVelocity: 75,
      championAccessibility: 65,
      expansionPotential: 85,
    },
    details: {
      website: 'databricks.com',
      employees: '6000+',
      funding: '$43B valuation (2023)',
      techStack: ['Scala', 'Python', 'Spark', 'IntelliJ', 'PyCharm'],
      recentNews: [
        'Acquired MosaicML for $1.3B',
        'Launched Databricks Assistant AI',
        'Expanding MLOps platform capabilities',
      ],
      champions: [
        { name: 'Matei Zaharia', title: 'CTO', linkedIn: 'linkedin.com/in/mateizaharia' },
      ],
      discoveryQuestions: [
        'How do your data engineers currently navigate large Spark codebases?',
        'What IDE do most of your ML engineers prefer?',
        'How do you handle context switching between Python and Scala?',
      ],
      battleNotes: 'Heavy JetBrains users historically. Focus on AI code understanding for complex data pipelines.',
    },
  },
  {
    id: '5',
    name: 'Notion',
    industry: 'Productivity',
    tier: 3,
    scores: {
      engineeringHeadcount: 60,
      aiMlInvestment: 70,
      toolingStack: 75,
      fundingRecency: 65,
      developerVelocity: 80,
      championAccessibility: 55,
      expansionPotential: 60,
    },
    details: {
      website: 'notion.so',
      employees: '500-750',
      funding: '$10B valuation (2021)',
      techStack: ['TypeScript', 'React', 'Node.js', 'VS Code'],
      recentNews: [
        'Launched Notion AI with GPT-4 integration',
        'Acquired Cron calendar app',
        'Expanding into enterprise market',
      ],
      champions: [
        { name: 'Ivan Zhao', title: 'CEO', linkedIn: 'linkedin.com/in/ivanzhao' },
      ],
      discoveryQuestions: [
        'How large is your engineering organization currently?',
        'What development workflow challenges are you facing?',
        'How do you evaluate new engineering tools?',
      ],
      battleNotes: 'Smaller engineering team, but high-quality bar. Need to reach right technical decision maker.',
    },
  },
]

export function calculateTotalScore(account: Account, weights: CriteriaWeight[]): number {
  const weightMap = weights.reduce((acc, w) => ({ ...acc, [w.id]: w.weight }), {} as Record<string, number>)
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0)
  
  if (totalWeight === 0) return 0
  
  const weightedSum = 
    (account.scores.engineeringHeadcount * (weightMap.engineeringHeadcount || 0)) +
    (account.scores.aiMlInvestment * (weightMap.aiMlInvestment || 0)) +
    (account.scores.toolingStack * (weightMap.toolingStack || 0)) +
    (account.scores.fundingRecency * (weightMap.fundingRecency || 0)) +
    (account.scores.developerVelocity * (weightMap.developerVelocity || 0)) +
    (account.scores.championAccessibility * (weightMap.championAccessibility || 0)) +
    (account.scores.expansionPotential * (weightMap.expansionPotential || 0))
  
  return Math.round(weightedSum / totalWeight)
}

export const icpCriteria = [
  {
    category: 'Firmographics',
    items: [
      { label: 'Engineering Headcount', ideal: '100+ engineers', weight: 'High' },
      { label: 'Company Stage', ideal: 'Series B+ or Enterprise', weight: 'High' },
      { label: 'Industry', ideal: 'Tech, FinTech, AI/ML', weight: 'Medium' },
    ]
  },
  {
    category: 'Technographics',
    items: [
      { label: 'Primary Languages', ideal: 'TypeScript, Python, Go, Rust', weight: 'High' },
      { label: 'Current IDE', ideal: 'VS Code (easier migration)', weight: 'Medium' },
      { label: 'AI Investment', ideal: 'Active AI/ML initiatives', weight: 'High' },
    ]
  },
  {
    category: 'Behavioral Signals',
    items: [
      { label: 'Developer Velocity', ideal: 'Fast shipping culture', weight: 'High' },
      { label: 'Tool Adoption', ideal: 'Early adopter mentality', weight: 'Medium' },
      { label: 'Budget Authority', ideal: 'Decentralized tool decisions', weight: 'Medium' },
    ]
  },
]

export const battleCards = [
  {
    competitor: 'VS Code',
    positioning: 'The foundation we build upon',
    strengths: ['Free', 'Massive extension ecosystem', 'Familiar to most developers'],
    weaknesses: ['AI features require multiple extensions', 'No native AI context understanding', 'Copilot is completion-focused only'],
    counterPoints: [
      'Cursor is VS Code + native AI superpowers',
      'One integrated experience vs. cobbling together extensions',
      'Context-aware AI that understands your entire codebase',
    ],
    winStrategy: 'Position as evolution, not replacement. Familiar interface with transformative capabilities.',
  },
  {
    competitor: 'GitHub Copilot',
    positioning: 'Line completion vs. codebase intelligence',
    strengths: ['GitHub integration', 'Familiar brand', 'Enterprise contracts'],
    weaknesses: ['Limited context window', 'Only autocomplete, no chat', 'No multi-file editing'],
    counterPoints: [
      'Cursor understands your entire project, not just current file',
      'Chat, edit, and compose - not just autocomplete',
      'Agent mode for complex multi-step tasks',
    ],
    winStrategy: 'Demonstrate multi-file refactoring and context-aware suggestions. Show agent capabilities.',
  },
  {
    competitor: 'JetBrains AI',
    positioning: 'AI as afterthought vs. AI-native',
    strengths: ['Deep language-specific features', 'Enterprise relationships', 'Refactoring tools'],
    weaknesses: ['Heavy/slow IDE', 'AI bolted on to existing product', 'Per-language pricing'],
    counterPoints: [
      'Cursor is lightweight and fast like VS Code',
      'AI-native architecture designed from ground up',
      'Works across all languages with single subscription',
    ],
    winStrategy: 'Speed comparison demo. Show AI features that JetBrains cannot match. Cross-language workflow.',
  },
]

export const discoveryQuestions = [
  {
    category: 'Current State',
    questions: [
      { question: 'What IDE do most of your engineers use today?', purpose: 'Understand migration path' },
      { question: 'How do you currently handle code reviews?', purpose: 'Identify productivity gaps' },
      { question: 'What is your average PR cycle time?', purpose: 'Establish baseline metrics' },
    ]
  },
  {
    category: 'Pain Points',
    questions: [
      { question: 'Where do engineers spend the most time that feels unproductive?', purpose: 'Surface pain points' },
      { question: 'How do new engineers ramp up on your codebase?', purpose: 'Onboarding friction' },
      { question: 'What happens when you need to refactor across multiple files?', purpose: 'Multi-file pain' },
    ]
  },
  {
    category: 'AI & Future',
    questions: [
      { question: 'How is your team using AI coding assistants today?', purpose: 'Current AI adoption' },
      { question: 'What concerns do you have about AI and code security?', purpose: 'Address objections early' },
      { question: 'How do you envision AI changing your development workflow in 2 years?', purpose: 'Strategic alignment' },
    ]
  },
  {
    category: 'Decision Process',
    questions: [
      { question: 'Who else would need to be involved in evaluating a tool like this?', purpose: 'Map stakeholders' },
      { question: 'How does your team typically evaluate and adopt new dev tools?', purpose: 'Understand buying process' },
      { question: 'What would success look like if you adopted Cursor?', purpose: 'Define success criteria' },
    ]
  },
]
