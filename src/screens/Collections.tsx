import React from 'react';
import { FlowGrid, Section } from '../components/Blocks';
import { dataModel, flows, apiSurface } from '../data';
import { CollectionSummary } from '../types';

interface CollectionsScreenProps {
  collections: CollectionSummary[];
  activeCollectionId: string;
  onSelect: (collectionId: string) => void;
  onDelete: (collectionId: string) => void;
}

const CollectionsScreen: React.FC<CollectionsScreenProps> = ({
  collections,
  activeCollectionId,
  onSelect,
  onDelete
}) => (
  <div className="screen">
    <Section title="Collections management" kicker="Flow G">
      <FlowGrid flows={[flows[6]]} />
    </Section>

    <section className="collections-card">
      <h2>My collections</h2>
      <ul>
        {collections.map((collection) => (
          <li key={collection.id}>
            <div>
              <strong>{collection.name}</strong>
              <p>{collection.description}</p>
              <span>
                {collection.cardCount} cards · Created {collection.createdAt} · {collection.type === 'istqb' ? 'ISTQB' : 'Custom'}
              </span>
            </div>
            <div className="collections-card__actions">
              <button
                onClick={() => onSelect(collection.id)}
                disabled={collection.id === activeCollectionId}
              >
                {collection.id === activeCollectionId ? 'Active' : 'Select'}
              </button>
              {collection.type === 'custom' && (
                <button data-variant="ghost" onClick={() => onDelete(collection.id)}>
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>

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
  </div>
);

export default CollectionsScreen;
