import React, { useState } from 'react';
import { FlowGrid, Section } from '../components/Blocks';
import { flows } from '../data';
import { QuizCard } from '../types';

interface QuizSessionProps {
  card: QuizCard | null;
  currentIndex: number;
  total: number;
  onCardComplete: (card: QuizCard, isCorrect: boolean) => Promise<void>;
  onAbort: () => void;
}

const QuizSessionScreen: React.FC<QuizSessionProps> = ({ card, currentIndex, total, onCardComplete, onAbort }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!card) {
    return (
      <div className="screen">
        <p>No cards available. Return to home.</p>
        <button onClick={onAbort}>Back to home</button>
      </div>
    );
  }

  const isCorrect = selected === card.correctAnswer;
  const lastCard = currentIndex === total - 1;

  const handleCheck = () => {
    if (!selected) return;
    setRevealed(true);
  };

  const handleNext = async () => {
    if (!selected) return;
    setSubmitting(true);
    await onCardComplete(card, isCorrect);
    setSelected(null);
    setRevealed(false);
    setSubmitting(false);
  };

  return (
    <div className="screen">
      <Section title="Start session API" kicker="Flow C">
        <FlowGrid flows={[flows[2]]} />
      </Section>

      <Section title="Quiz flow" kicker="Flow D">
        <FlowGrid flows={[flows[3]]} />
      </Section>

      <section className="quiz-card">
        <header>
          <span className={`badge badge--${card.badge.toLowerCase()}`}>{card.badge}</span>
          <p>
            Card {currentIndex + 1} of {total}
          </p>
        </header>
        <h2>{card.question}</h2>
        <div className="quiz-options">
          {card.options.map((option) => (
            <button
              key={option}
              className={`quiz-option${selected === option ? ' quiz-option--selected' : ''}`}
              onClick={() => setSelected(option)}
              disabled={revealed}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="quiz-actions">
          {!revealed ? (
            <button disabled={!selected} onClick={handleCheck}>
              Check answer
            </button>
          ) : (
            <button onClick={handleNext} disabled={submitting}>
              {lastCard ? 'Finish session' : 'Next card'}
            </button>
          )}
          <button data-variant="ghost" onClick={onAbort}>
            Exit session
          </button>
        </div>
        {revealed && (
          <div className={`quiz-feedback ${isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect'}`}>
            <strong>{isCorrect ? 'Correct' : 'Incorrect'}</strong>
            <p>{card.explanation}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default QuizSessionScreen;
