export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'aadhaar' | 'dbt' | 'banking' | 'linking';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  tags: string[];
  content: LessonContent[];
  thumbnail?: string;
}

export interface LessonContent {
  type: 'heading' | 'paragraph' | 'list' | 'steps' | 'infographic';
  content: string | string[];
  alt?: string; // for infographics
}

export const lessonCategories = [
  { id: 'all', label: 'All Topics', color: 'bg-primary' },
  { id: 'aadhaar', label: 'Aadhaar', color: 'bg-primary' },
  { id: 'dbt', label: 'DBT', color: 'bg-secondary' },
  { id: 'banking', label: 'Banking', color: 'bg-accent' },
  { id: 'linking', label: 'Linking Process', color: 'bg-warning' },
] as const;

export const lessonsData: Lesson[] = [
  {
    id: 'what-is-aadhaar',
    title: 'What is Aadhaar?',
    description: 'Learn the basics of Aadhaar - India\'s unique identification system',
    category: 'aadhaar',
    difficulty: 'beginner',
    duration: 5,
    tags: ['basics', 'identification', 'government'],
    content: [
      {
        type: 'heading',
        content: 'Understanding Aadhaar',
      },
      {
        type: 'paragraph',
        content: 'Aadhaar is a 12-digit unique identification number issued by the Unique Identification Authority of India (UIDAI) to all Indian residents based on their biometric and demographic data.',
      },
      {
        type: 'heading',
        content: 'Key Features',
      },
      {
        type: 'list',
        content: [
          'Unique 12-digit identification number',
          'Based on biometric data (fingerprints, iris scan)',
          'Linked to demographic information',
          'Voluntary for residents of India',
          'Valid proof of identity and address',
        ],
      },
      {
        type: 'heading',
        content: 'Why Aadhaar Matters',
      },
      {
        type: 'paragraph',
        content: 'Aadhaar serves as a foundation for digital identity in India, enabling access to various government services, subsidies, and benefits. It simplifies the verification process and reduces identity fraud.',
      },
    ],
  },
  {
    id: 'what-is-dbt',
    title: 'What is DBT?',
    description: 'Understand Direct Benefit Transfer and how it works',
    category: 'dbt',
    difficulty: 'beginner',
    duration: 6,
    tags: ['dbt', 'government schemes', 'subsidies'],
    content: [
      {
        type: 'heading',
        content: 'Direct Benefit Transfer (DBT)',
      },
      {
        type: 'paragraph',
        content: 'Direct Benefit Transfer (DBT) is an initiative by the Government of India to transfer subsidies and benefits directly to the bank accounts of beneficiaries, reducing delays and leakages.',
      },
      {
        type: 'heading',
        content: 'How DBT Works',
      },
      {
        type: 'steps',
        content: [
          'Government identifies beneficiaries for a scheme',
          'Beneficiary\'s Aadhaar is linked to their bank account',
          'Subsidy amount is calculated and approved',
          'Funds are transferred directly to the bank account',
          'Beneficiary receives instant notification',
        ],
      },
      {
        type: 'heading',
        content: 'Benefits of DBT',
      },
      {
        type: 'list',
        content: [
          'Eliminates middlemen and reduces corruption',
          'Faster transfer of benefits',
          'Reduced paperwork and hassle',
          'Transparent and accountable system',
          'Real-time tracking of transfers',
        ],
      },
    ],
  },
  {
    id: 'aadhaar-seeded-vs-linked',
    title: 'Aadhaar-Seeded vs Aadhaar-Linked Accounts',
    description: 'Understand the crucial difference between seeded and linked accounts',
    category: 'banking',
    difficulty: 'intermediate',
    duration: 8,
    tags: ['banking', 'aadhaar', 'dbt', 'linking'],
    content: [
      {
        type: 'heading',
        content: 'The Key Difference',
      },
      {
        type: 'paragraph',
        content: 'Many people confuse Aadhaar-seeded accounts with Aadhaar-linked accounts, but they are different concepts with different implications for DBT eligibility.',
      },
      {
        type: 'heading',
        content: 'Aadhaar-Seeded Account',
      },
      {
        type: 'paragraph',
        content: 'An Aadhaar-seeded account means your Aadhaar number is recorded in the bank\'s system and associated with your account. However, this does NOT mean it\'s verified or approved for DBT transfers.',
      },
      {
        type: 'list',
        content: [
          'Aadhaar number is stored in bank records',
          'May not be verified by NPCI',
          'Cannot receive DBT payments',
          'First step in the linking process',
        ],
      },
      {
        type: 'heading',
        content: 'Aadhaar-Linked Account (DBT-Enabled)',
      },
      {
        type: 'paragraph',
        content: 'An Aadhaar-linked account means your Aadhaar is verified and mapped to your bank account in the NPCI (National Payments Corporation of India) mapper. Only linked accounts can receive DBT payments.',
      },
      {
        type: 'list',
        content: [
          'Verified by NPCI mapper system',
          'Eligible to receive DBT transfers',
          'Can receive government subsidies',
          'Requires explicit linking process',
        ],
      },
      {
        type: 'heading',
        content: 'Why This Matters',
      },
      {
        type: 'paragraph',
        content: 'Many beneficiaries assume their account is DBT-ready because they provided Aadhaar to their bank. However, without proper linking through the NPCI mapper, they cannot receive DBT benefits. Always verify your DBT status through the official channels.',
      },
    ],
  },
  {
    id: 'how-to-link-aadhaar',
    title: 'How to Link Aadhaar with Bank Account',
    description: 'Step-by-step guide to link your Aadhaar with your bank account for DBT',
    category: 'linking',
    difficulty: 'beginner',
    duration: 10,
    tags: ['linking', 'banking', 'tutorial'],
    content: [
      {
        type: 'heading',
        content: 'Linking Your Aadhaar to Bank Account',
      },
      {
        type: 'paragraph',
        content: 'Follow these steps to properly link your Aadhaar with your bank account to enable DBT transfers.',
      },
      {
        type: 'heading',
        content: 'Method 1: Visit Your Bank Branch',
      },
      {
        type: 'steps',
        content: [
          'Visit your bank branch with original Aadhaar card',
          'Fill out the Aadhaar seeding/linking form',
          'Provide your Aadhaar number and account details',
          'Submit the form to bank official',
          'Receive acknowledgment receipt',
          'Linking will be completed within 7-10 working days',
        ],
      },
      {
        type: 'heading',
        content: 'Method 2: Internet Banking',
      },
      {
        type: 'steps',
        content: [
          'Log in to your bank\'s internet banking portal',
          'Navigate to \'Profile\' or \'Service Requests\' section',
          'Select \'Link Aadhaar\' option',
          'Enter your 12-digit Aadhaar number',
          'Verify and submit the request',
          'You\'ll receive confirmation via SMS/email',
        ],
      },
      {
        type: 'heading',
        content: 'Method 3: Mobile Banking App',
      },
      {
        type: 'steps',
        content: [
          'Open your bank\'s mobile banking app',
          'Go to \'Services\' or \'Requests\' menu',
          'Select \'Link Aadhaar to Account\'',
          'Enter your Aadhaar number',
          'Confirm and submit',
          'Check for confirmation message',
        ],
      },
      {
        type: 'heading',
        content: 'Verification',
      },
      {
        type: 'paragraph',
        content: 'After linking, verify your DBT status through the NPCI mapper or your bank to ensure you can receive government benefits and subsidies.',
      },
    ],
  },
  {
    id: 'dbt-schemes-india',
    title: 'Popular DBT Schemes in India',
    description: 'Overview of major government schemes using DBT',
    category: 'dbt',
    difficulty: 'beginner',
    duration: 7,
    tags: ['schemes', 'government', 'benefits'],
    content: [
      {
        type: 'heading',
        content: 'Major DBT Schemes',
      },
      {
        type: 'paragraph',
        content: 'The Government of India has implemented DBT across numerous schemes to ensure transparent and efficient delivery of benefits.',
      },
      {
        type: 'heading',
        content: 'LPG Subsidy (PAHAL)',
      },
      {
        type: 'paragraph',
        content: 'Direct transfer of LPG subsidy to beneficiary bank accounts, one of the largest DBT schemes in the world.',
      },
      {
        type: 'heading',
        content: 'PM-KISAN',
      },
      {
        type: 'paragraph',
        content: 'Income support of ₹6,000 per year to farmer families in three equal installments directly to their bank accounts.',
      },
      {
        type: 'heading',
        content: 'MGNREGA Wages',
      },
      {
        type: 'paragraph',
        content: 'Wages under the Mahatma Gandhi National Rural Employment Guarantee Act are transferred directly to workers\' accounts.',
      },
      {
        type: 'heading',
        content: 'Scholarship Schemes',
      },
      {
        type: 'paragraph',
        content: 'Various central and state scholarship schemes for students are disbursed through DBT.',
      },
      {
        type: 'heading',
        content: 'Pension Schemes',
      },
      {
        type: 'list',
        content: [
          'National Social Assistance Programme (NSAP)',
          'State-level old age pensions',
          'Widow and disability pensions',
          'All transferred directly to beneficiary accounts',
        ],
      },
    ],
  },
  {
    id: 'verify-dbt-status',
    title: 'How to Verify Your DBT Status',
    description: 'Learn different methods to check if your account is DBT-enabled',
    category: 'banking',
    difficulty: 'intermediate',
    duration: 6,
    tags: ['verification', 'banking', 'dbt'],
    content: [
      {
        type: 'heading',
        content: 'Checking Your DBT Status',
      },
      {
        type: 'paragraph',
        content: 'It\'s important to verify that your bank account is properly linked and DBT-enabled to receive government benefits.',
      },
      {
        type: 'heading',
        content: 'Method 1: NPCI Mapper Portal',
      },
      {
        type: 'steps',
        content: [
          'Visit the NPCI Aadhaar Mapper portal',
          'Enter your Aadhaar number',
          'Complete the verification process',
          'View linked bank accounts',
          'Check DBT status for each account',
        ],
      },
      {
        type: 'heading',
        content: 'Method 2: Bank Statement',
      },
      {
        type: 'paragraph',
        content: 'Check your bank statement or passbook. DBT-enabled accounts are usually marked with specific indicators.',
      },
      {
        type: 'heading',
        content: 'Method 3: Contact Bank',
      },
      {
        type: 'paragraph',
        content: 'Call your bank\'s customer service or visit the branch to inquire about your account\'s DBT status.',
      },
      {
        type: 'heading',
        content: 'Method 4: SMS Service',
      },
      {
        type: 'paragraph',
        content: 'Some banks offer SMS-based services to check Aadhaar linking status. Check with your bank for the specific format.',
      },
    ],
  },
];

export const getRelatedLessons = (currentLessonId: string, limit = 3): Lesson[] => {
  const currentLesson = lessonsData.find(l => l.id === currentLessonId);
  if (!currentLesson) return [];

  return lessonsData
    .filter(lesson => 
      lesson.id !== currentLessonId && 
      (lesson.category === currentLesson.category || 
       lesson.tags.some(tag => currentLesson.tags.includes(tag)))
    )
    .slice(0, limit);
};
