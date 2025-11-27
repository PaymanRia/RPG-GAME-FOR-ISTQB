import React from 'react';
import { FlowGrid, Section } from '../components/Blocks';
import { flows, heroStats } from '../data';

interface OnboardingProps {
  onContinue: () => void;
}

const OnboardingScreen: React.FC<OnboardingProps> = ({ onContinue }) => (
  <div className="screen">
    <header className="hero">
      <p className="hero__eyebrow">FSRS-first · AI-assisted · Cloud synced</p>
      <h1>Practice ISTQB glossary terms and your own quizzes with smart repetition.</h1>
      <p>
        FSRS optimizes when you review. AI creates quizzes from your documents. Store multiple quiz collections in the
        cloud and let one strong CTA guide every session.
      </p>
      <div className="hero__cta">
        <button onClick={onContinue}>Get started</button>
        <div>
          <strong>Seeded ISTQB collection</strong>
          <p>We create the user + database linkage before you ever see the dashboard.</p>
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

    <Section
      title="Vision & scope"
      kicker="01"
      description="Mobile-first experience with one obvious main path and maximal backend intelligence."
    >
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

    <Section title="First visit · silent onboarding" kicker="Flow A">
      <FlowGrid flows={[flows[0]]} />
    </Section>
  </div>
);

export default OnboardingScreen;
