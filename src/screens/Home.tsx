import React from 'react';
import { FlowGrid, PillButton, Section } from '../components/Blocks';
import { corePrinciples, flows, sessionLogic, uxAnchors } from '../data';

interface HomeProps {
  onStartSession: () => void;
  onUpload: () => void;
  onCollections: () => void;
  suggestedCount?: number;
  newCards?: number;
  activeCollectionName: string;
}

const HomeScreen: React.FC<HomeProps> = ({
  onStartSession,
  onUpload,
  onCollections,
  suggestedCount = 8,
  newCards = 2,
  activeCollectionName
}) => (
  <div className="screen">
    <section className="home-cta">
      <div>
        <h2>Today’s session is ready</h2>
        <p>
          {suggestedCount} cards to review, {newCards} new cards.
        </p>
        <PillButton onClick={onStartSession}>Start today&apos;s session ({suggestedCount} questions)</PillButton>
      </div>
      <div className="home-cta__secondary">
        <PillButton onClick={onUpload} data-variant="ghost">
          Upload document
        </PillButton>
        <PillButton onClick={onCollections} data-variant="ghost">
          My collections
        </PillButton>
        <span>Active collection: {activeCollectionName}</span>
      </div>
    </section>

    <Section title="Home · FSRS-centered dashboard" kicker="Flow B">
      <FlowGrid flows={[flows[1]]} />
    </Section>

    <Section title="Core principles" kicker="02">
      <div className="grid three">
        {corePrinciples.map((principle) => (
          <article key={principle.title} className="principle-card">
            <h3>{principle.title}</h3>
            <p>{principle.detail}</p>
          </article>
        ))}
      </div>
    </Section>

    <Section title="Session engine" kicker="04" description="FSRS logic, quotas, and telemetry live exclusively in the backend.">
      <div className="grid two">
        <article className="list-card">
          <h3>Quality scoring rules</h3>
          <ul>
            {sessionLogic.qualityRules.map((rule) => (
              <li key={rule.outcome}>
                <strong>{rule.outcome}</strong>
                <span> → quality {rule.quality}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="list-card">
          <h3>Processing pipeline</h3>
          <ol>
            {sessionLogic.pipeline.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </div>
      <article className="list-card">
        <h3>Non‑negotiable guardrails</h3>
        <ul>
          {sessionLogic.guardrails.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </Section>

    <Section title="UX anchors" kicker="08" description="Simple, ADHD-friendly presentation keeps the focus on one strong main path.">
      <ul className="ux-list">
        {uxAnchors.map((anchor) => (
          <li key={anchor}>{anchor}</li>
        ))}
      </ul>
    </Section>
  </div>
);

export default HomeScreen;
