import React from 'react';
import { FlowGrid, Section } from '../components/Blocks';
import { flows, uxAnchors } from '../data';
import { SessionResult } from '../types';

interface SessionSummaryProps {
  result: SessionResult | null;
  onStartAnother: () => void;
  onDone: () => void;
}

const SessionSummaryScreen: React.FC<SessionSummaryProps> = ({ result, onStartAnother, onDone }) => (
  <div className="screen">
    <Section title="Session completion" kicker="Flow E">
      <FlowGrid flows={[flows[4]]} />
    </Section>

    <section className="summary-card">
      <h2>Session complete!</h2>
      {result ? (
        <div className="summary-stats">
          <p>
            Correct: {result.correct} of {result.total}
          </p>
          <p>Percentage: {result.percentage}%</p>
          <p>
            Status: {result.status === 'done' ? "Today’s review is complete" : `${result.remainingDue} cards left to review today`}
          </p>
          {result.toughestTerms.length > 0 && (
            <div>
              <h3>Difficult cards</h3>
              <ul>
                {result.toughestTerms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="summary-actions">
            <button onClick={onStartAnother}>Take another session</button>
            <button onClick={onDone} data-variant="ghost">
              Done for now
            </button>
          </div>
        </div>
      ) : (
        <p>Loading summary…</p>
      )}
    </section>

    <Section title="UX anchors" kicker="08" description="Simple, ADHD-friendly presentation keeps the focus on one strong main path.">
      <ul className="ux-list">
        {uxAnchors.map((anchor) => (
          <li key={anchor}>{anchor}</li>
        ))}
      </ul>
    </Section>
  </div>
);

export default SessionSummaryScreen;
