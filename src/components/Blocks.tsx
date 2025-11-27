import React from 'react';

interface SectionProps {
  title: string;
  kicker?: string;
  description?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, kicker, description, children }) => (
  <section className="section">
    {kicker && <p className="section__kicker">{kicker}</p>}
    <div className="section__header">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
    {children}
  </section>
);

interface FlowCardProps {
  title: string;
  intent: string;
  steps: { label: string; detail: string }[];
}

export const FlowCard: React.FC<FlowCardProps> = ({ title, intent, steps }) => (
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

export const FlowGrid: React.FC<{ flows: FlowCardProps[] }> = ({ flows }) => (
  <div className="flow-grid">
    {flows.map((flow) => (
      <FlowCard key={flow.title} {...flow} />
    ))}
  </div>
);

export const Grid: React.FC<{ columns?: 'two' | 'three'; children: React.ReactNode }> = ({
  columns = 'two',
  children
}) => <div className={`grid ${columns}`}>{children}</div>;

export const PillButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button className="pill-btn" {...props}>
    {children}
  </button>
);
