import React from 'react';
import {
  heroStats,
  corePrinciples,
  flows,
  sessionLogic,
  dataModel,
  apiSurface,
  aiResponsibilities,
  uxAnchors
} from './data';

const Section: React.FC<{ title: string; kicker?: string; description?: string; children: React.ReactNode }> = ({
  title,
  kicker,
  description,
  children
}) => (
  <section className="section">
    {kicker && <p className="section__kicker">{kicker}</p>}
    <div className="section__header">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
    {children}
  </section>
);

const FlowCard: React.FC<{
  title: string;
  intent: string;
  steps: { label: string; detail: string }[];
}> = ({ title, intent, steps }) => (
  <article className="flow-card">
    <header>
      <h3>{title}</h3>
      <p>{intent}</p>
    </header>
    <ol>
      {steps.map((step) => (
        <li key={step.label}>
          <span>{step.label}</span>
          <p>{step.detail}</p>
        </li>
      ))}
    </ol>
  </article>
);

const ListCard: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <article className="list-card">
    <h3>{title}</h3>
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </article>
);

function App() {
  return (
    <main className="app-shell">
      <header className="hero">
        <p className="hero__eyebrow">FSRS-first · AI-assisted · Cloud synced</p>
        <h1>ISTQB & custom glossary practice that feels effortless.</h1>
        <p>
          Launch straight into a single, well-paced study path. FSRS handles spacing, AI expands your decks,
          and Supabase keeps every card, session, and distractor in sync across devices.
        </p>
        <div className="hero__cta">
          <button>Start today&apos;s session</button>
          <div>
            <strong>Upload later</strong>
            <p>Documents become FSRS-ready cards in under a minute.</p>
          </div>
        </div>
        <div className="hero__stats">
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
              <span>{stat.detail}</span>
            </div>
          ))}
        </div>
      </header>

      <Section title="Vision & scope" kicker="01" description="Mobile-first experience with one obvious main path and maximal backend intelligence.">
        <div className="grid two">
          <div className="vision-card">
            <h3>What users can do</h3>
            <ul>
              <li>Practice the complete ISTQB glossary out of the box.</li>
              <li>Upload PDF, DOCX, or TXT files and let AI mint fresh decks.</li>
              <li>Own multiple collections stored in the cloud and switch on demand.</li>
            </ul>
          </div>
          <div className="vision-card">
            <h3>System rules</h3>
            <ul>
              <li>Every card is an FSRS card with state, stability, difficulty, due date.</li>
              <li>Sessions always prioritize due work, then tightly limited new cards.</li>
              <li>Local cache (Zustand) mirrors the Supabase source of truth.</li>
            </ul>
          </div>
        </div>
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

      <Section title="Main flows" kicker="03" description="Seven flows capture the entire journey from first run to advanced collection management.">
        <div className="flow-grid">
          {flows.map((flow) => (
            <FlowCard key={flow.id} title={flow.title} intent={flow.intent} steps={flow.steps} />
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
        <ListCard title="Non‑negotiable guardrails" items={sessionLogic.guardrails} />
      </Section>

      <Section title="Data model" kicker="05" description="Supabase schema keeps cards, FSRS state, and sessions normalized.">
        <div className="data-grid">
          {dataModel.map((entity) => (
            <article key={entity.entity}>
              <header>
                <h3>{entity.entity}</h3>
                <p>{entity.notes}</p>
              </header>
              <p className="fields">Fields: {entity.fields.join(', ')}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="API surface" kicker="06" description="Edge functions drive both study and creation flows.">
        <div className="api-grid">
          {apiSurface.map((api) => (
            <article key={api.path}>
              <p className="badge">{api.method}</p>
              <h3>{api.path}</h3>
              <p>{api.purpose}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="AI responsibilities" kicker="07" description="AI augments content and pacing without touching FSRS formulas or quotas.">
        <div className="grid three">
          {aiResponsibilities.map((item) => (
            <article key={item.title} className="principle-card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="UX anchors" kicker="08" description="Simple, ADHD-friendly presentation keeps the focus on one strong main path.">
        <ul className="ux-list">
          {uxAnchors.map((anchor) => (
            <li key={anchor}>{anchor}</li>
          ))}
        </ul>
      </Section>
    </main>
  );
}

export default App;
