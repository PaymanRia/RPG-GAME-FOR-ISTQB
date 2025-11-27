import { CollectionSummary, SessionResult, StartSessionResponse } from '../types';

const mockCards = [
  {
    id: 'card-1',
    question: 'What does ISTQB define as a “Test Basis”?',
    correctAnswer: 'The source to derive test cases.',
    options: [
      'The source to derive test cases.',
      'A document that logs production defects.',
      'The CI pipeline definition.',
      'Any exploratory session note.'
    ],
    explanation: 'ISTQB glossaries describe a test basis as the documentation that test cases are derived from.',
    badge: 'Review' as const
  },
  {
    id: 'card-2',
    question: 'Which term describes a deviation from expected results after test execution?',
    correctAnswer: 'Anomaly.',
    options: ['Anomaly.', 'Sprint.', 'Baseline.', 'Persona.'],
    explanation: '“Anomaly” is the glossary’s umbrella term for any unexpected result or behaviour.',
    badge: 'New' as const
  },
  {
    id: 'card-3',
    question: 'What is the primary outcome of applying FSRS to a card?',
    correctAnswer: 'Updated stability, difficulty, and due date.',
    options: [
      'Updated stability, difficulty, and due date.',
      'Immediate deletion of the card.',
      'Locking the card for 7 days.',
      'Switching the collection owner.'
    ],
    explanation: 'FSRS recalculates scheduling parameters so the next review is optimally timed.',
    badge: 'Hard' as const
  }
];

export async function startSession({
  userId,
  collectionId
}: {
  userId: string;
  collectionId: string;
}): Promise<StartSessionResponse> {
  console.info('startSession stub', { userId, collectionId });
  return {
    sessionId: `session-${Date.now()}`,
    cards: mockCards,
    suggestedCount: 8,
    newCards: 2
  };
}

export async function submitAnswer({
  userId,
  sessionId,
  cardId,
  isCorrect
}: {
  userId: string;
  sessionId: string;
  cardId: string;
  isCorrect: boolean;
}): Promise<{ quality: number }> {
  console.info('submitAnswer stub', { userId, sessionId, cardId, isCorrect });
  const quality = isCorrect ? 4 : 2;
  return { quality };
}

export async function getSessionResult({
  userId,
  sessionId,
  answers
}: {
  userId: string;
  sessionId: string;
  answers: { cardId: string; isCorrect: boolean }[];
}): Promise<SessionResult> {
  console.info('getSessionResult stub', { userId, sessionId, answers });
  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  return {
    correct,
    total,
    percentage: Math.round((correct / total) * 100),
    toughestTerms: answers.filter((a) => !a.isCorrect).map((a) => a.cardId),
    remainingDue: Math.max(0, 4 - total + correct),
    status: correct === total ? 'done' : 'remaining'
  };
}

export async function uploadQuiz({
  userId,
  fileName,
  cardCount
}: {
  userId: string;
  fileName: string;
  cardCount: number;
}): Promise<{ collectionId: string; name: string }> {
  console.info('uploadQuiz stub', { userId, fileName, cardCount });
  return {
    collectionId: `custom-${Date.now()}`,
    name: `${fileName.replace(/\.[^.]+$/, '')} · ${cardCount} cards`
  };
}

export async function listCollections(userId: string): Promise<CollectionSummary[]> {
  console.info('listCollections stub', { userId });
  return [
    {
      id: 'istqb-foundation',
      name: 'ISTQB Foundation 4.0',
      type: 'istqb',
      cardCount: 120,
      description: 'Complete glossary seeded on first launch.',
      createdAt: '2024-01-01'
    },
    {
      id: 'custom-1',
      name: 'Payments microservice deep dive',
      type: 'custom',
      cardCount: 38,
      description: 'Generated from onboarding deck.',
      createdAt: '2025-10-12'
    }
  ];
}
