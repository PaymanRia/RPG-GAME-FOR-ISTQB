export type Screen = 'onboarding' | 'home' | 'quiz' | 'summary' | 'upload' | 'collections';

export interface QuizCard {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  badge: 'New' | 'Review' | 'Hard';
}

export interface StartSessionResponse {
  sessionId: string;
  cards: QuizCard[];
  suggestedCount: number;
  newCards: number;
}

export interface SessionResult {
  correct: number;
  total: number;
  percentage: number;
  toughestTerms: string[];
  remainingDue: number;
  status: 'done' | 'remaining';
}

export interface CollectionSummary {
  id: string;
  name: string;
  type: 'istqb' | 'custom';
  cardCount: number;
  description: string;
  createdAt: string;
}
