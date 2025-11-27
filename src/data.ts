export const heroStats = [
  {
    label: 'Daily focus',
    value: 'One guided session',
    detail: 'Session size 3–15 cards, tuned by FSRS + AI.'
  },
  {
    label: 'New card caps',
    value: '3 / session · 10 / day',
    detail: 'Global rule enforced in the backend guardrail layer.'
  },
  {
    label: 'Sources',
    value: 'ISTQB + uploads',
    detail: 'Seed glossary + AI-generated collections live side by side.'
  }
];

export const corePrinciples = [
  {
    title: 'FSRS governs every decision',
    detail:
      'All cards—seeded or AI-made—store stability, difficulty, due date, and state. Sessions always start with due cards, reuse the same scoring, and push updates straight to the cloud.'
  },
  {
    title: 'AI only where it adds leverage',
    detail:
      'AI handles document-to-quiz generation, distractors, explanations, and lightweight coaching such as suggesting a safe session size. It never alters FSRS math or quota caps.'
  },
  {
    title: 'Cloud-first data, local cache second',
    detail:
      'Supabase owns truth for users, cards, FSRS state, and sessions. Local storage (Zustand persist) hydrates quickly but always reconciles with the server on launch.'
  },
  {
    title: 'ADHD-friendly flow',
    detail:
      'One home action—“Start today’s session”—keeps focus. Uploads, collections, and stats are accessible but visually secondary. No timers or distracting widgets.'
  },
  {
    title: 'Forced balance on new material',
    detail:
      'The platform enforces max 3 new cards per session and 10 per day per user. AI may recommend fewer, never more, ensuring sustainable review loads.'
  }
];

export const flows = [
  {
    id: 'onboarding',
    title: 'First visit · silent onboarding',
    intent: 'Create a user identity, link the cloud record, and seed ISTQB cards without cognitive noise.',
    steps: [
      {
        label: 'Welcome microcopy',
        detail: 'One screen with benefits and a single “Get started” CTA.'
      },
      {
        label: 'Anonymous profile',
        detail: 'Frontend generates/stores a UUID; backend upserts User + seeds ISTQB collection if missing.'
      },
      {
        label: 'Hand-off to home',
        detail: 'Return dashboard payload: user stats, seed collection metadata, and allowable new-card budget.'
      }
    ]
  },
  {
    id: 'home',
    title: 'Home · FSRS-centered dashboard',
    intent: 'Surface the daily plan with zero decision fatigue and keep secondary actions nearby.',
    steps: [
      {
        label: 'Daily stats row',
        detail: 'Mastered count, streak, and new-card usage (from DB aggregates).' 
      },
      {
        label: 'Primary CTA',
        detail: '“Start today’s session (X questions)” where X = AI-suggested size (3–15) based on due queue + history.'
      },
      {
        label: 'Secondary controls',
        detail: 'Upload document, My collections, and an indicator of the active collection.'
      }
    ]
  },
  {
    id: 'start-session',
    title: 'Start session API',
    intent: 'Assemble a server-authored queue that honors due order, caps, and distractor prep.',
    steps: [
      {
        label: 'POST /start-session',
        detail: 'Input userId + activeCollectionId. Backend fetches cards + FSRS state.'
      },
      {
        label: 'Queue construction',
        detail: 'Fill session slots with due cards → allowed new cards → review fillers until size X.'
      },
      {
        label: 'Return payload',
        detail: 'sessionId, ordered cards, distractors, explanations, and badge metadata (state/difficulty).' 
      }
    ]
  },
  {
    id: 'quiz',
    title: 'Quiz flow',
    intent: 'Deliver one-card-at-a-time focus with immediate feedback and backend logging.',
    steps: [
      {
        label: 'Answer & reveal',
        detail: 'User selects an option, sees correctness + explanation stored on the card.'
      },
      {
        label: 'POST /answer',
        detail: 'Send userId, sessionId, cardId, correctness, attempt metadata.'
      },
      {
        label: 'FSRS update',
        detail: 'Backend scores quality 1–5, runs reviewCard, persists new stability/difficulty/due date.'
      }
    ]
  },
  {
    id: 'session-complete',
    title: 'Session completion',
    intent: 'Celebrate progress, highlight friction, and invite the next best action.',
    steps: [
      {
        label: 'GET /session-result',
        detail: 'Backend aggregates accuracy, difficulty tags, remaining due cards, and streak status.'
      },
      {
        label: 'UI summary',
        detail: 'Show A/B correct, percentage, toughest cards, and whether today is done.'
      },
      {
        label: 'Next choices',
        detail: 'Buttons for another session (if due cards remain) or return home.'
      }
    ]
  },
  {
    id: 'upload',
    title: 'Upload → AI → new collection',
    intent: 'Let users turn documents into FSRS-ready decks in a few taps.',
    steps: [
      {
        label: 'File intake',
        detail: 'Frontend collects PDF/DOCX/TXT + desired card count (1–50).' 
      },
      {
        label: 'POST /upload-quiz',
        detail: 'Edge function extracts text, prompts OpenAI for term/definition/explanation/distractors.'
      },
      {
        label: 'Collection creation',
        detail: 'Cards + FSRS_State rows are inserted with state=new, stability=1, difficulty=5, due=now.'
      }
    ]
  },
  {
    id: 'collections',
    title: 'Collections management',
    intent: 'Switch active study sets without derailing the daily session habit.',
    steps: [
      {
        label: 'GET /quiz-collections',
        detail: 'Return ISTQB (global) + custom decks with counts and metadata.'
      },
      {
        label: 'Select active',
        detail: 'Frontend stores activeCollectionId locally + server session state uses it for next queue.'
      },
      {
        label: 'Delete custom',
        detail: 'DELETE /quiz-collection/:id removes cards + FSRS_State rows for that user.'
      }
    ]
  }
];

export const sessionLogic = {
  qualityRules: [
    { outcome: 'New card · first correct', quality: 4 },
    { outcome: 'Repeated correct answers', quality: 5 },
    { outcome: 'New card · first incorrect', quality: 3 },
    { outcome: 'Repeat incorrect / lapses', quality: 1 },
    { outcome: 'Hard recovery', quality: 2 }
  ],
  pipeline: [
    'Fetch card + FSRS_State snapshot',
    'Derive due/new/review buckets + quotas',
    'Lock session queue (no client-side shuffling)',
    'On each answer, score quality and run reviewCard()',
    'Persist FSRS state + aggregates (mastered, streak, quota)',
    'Emit session analytics for streak + difficulty heatmaps'
  ],
  guardrails: [
    'Max 3 new cards per session (server-enforced).',
    'Max 10 new cards per day per user (rolling UTC day).',
    'Session size always 3–15; AI may suggest fewer to avoid drop-off.',
    'Due queue exhaustion happens before any optional review fillers.',
    'Distractors cached per card to keep latency predictable.'
  ]
};

export const dataModel = [
  {
    entity: 'User',
    fields: ['id', 'createdAt', 'authProvider?', 'streakCounter', 'dailyNewUsed'],
    notes: 'Anonymous by default; auth can be layered later.'
  },
  {
    entity: 'Collection',
    fields: ['id', 'userId|null', 'name', 'description', 'type', 'createdAt'],
    notes: 'ISTQB collection uses null userId and is shared read-only.'
  },
  {
    entity: 'Card',
    fields: ['id', 'collectionId', 'term', 'definition', 'explanation', 'meta'],
    notes: 'Meta can store tags, category, AI confidence, and distractor cache keys.'
  },
  {
    entity: 'FSRS_State',
    fields: ['userId', 'cardId', 'state', 'stability', 'difficulty', 'dueDate', 'lastReviewedAt', 'reviewCount', 'lapseCount'],
    notes: 'Single row per (user, card); updated on every /answer call.'
  },
  {
    entity: 'Session',
    fields: ['id', 'userId', 'collectionId', 'startedAt', 'finishedAt', 'status'],
    notes: 'Status helps analytics (completed vs aborted).' 
  },
  {
    entity: 'SessionAnswer',
    fields: ['id', 'sessionId', 'cardId', 'isCorrect', 'quality', 'createdAt'],
    notes: 'Stores per-question history for coaching, AI insights, and auditing.'
  }
];

export const apiSurface = [
  {
    method: 'POST',
    path: '/start-session',
    purpose: 'Compose the day’s queue (due + constrained new + filler) and return sessionId + cards.'
  },
  {
    method: 'POST',
    path: '/answer',
    purpose: 'Score a single response, update FSRS state, and increment aggregates.'
  },
  {
    method: 'GET',
    path: '/session-result',
    purpose: 'Summarize performance, remaining due cards, and streak outcomes.'
  },
  {
    method: 'POST',
    path: '/upload-quiz',
    purpose: 'Receive a document, call OpenAI, create a collection, and seed FSRS rows.'
  },
  {
    method: 'GET',
    path: '/quiz-collections',
    purpose: 'List ISTQB + custom collections with counts and metadata.'
  },
  {
    method: 'DELETE',
    path: '/quiz-collection/:id',
    purpose: 'Remove a custom collection and its related cards/state for the user.'
  }
];

export const aiResponsibilities = [
  {
    title: 'Document ingestion → quiz generation',
    detail: 'Edge function extracts text, prompts OpenAI for term, definition, explanation, distractors, and difficulty hints. Output is normalized before writing to Supabase.'
  },
  {
    title: 'Distractor + explanation crafting',
    detail: 'Either generated when the card is created or lazily on-demand; results cached per cardId to avoid duplicate spend.'
  },
  {
    title: 'Session coaching hints',
    detail: 'Analyzes completion history and suggests a session size (3–15) plus recommended max new cards (within global caps).' 
  }
];

export const uxAnchors = [
  'One dominant CTA on home keeps attention on the day’s review.',
  'Upload + collections are available but styled as secondary ghost buttons.',
  'Quiz screen shows a badge for state (New/Review/Hard) and a single card at a time.',
  'Results emphasize completion and next best action instead of raw gamification.',
  'Microcopy reinforces that FSRS already planned the work—no manual deck toggling mid-session.'
];
