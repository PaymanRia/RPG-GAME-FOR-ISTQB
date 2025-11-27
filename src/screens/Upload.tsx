import React, { useState } from 'react';
import { FlowGrid, Section } from '../components/Blocks';
import { aiResponsibilities, flows } from '../data';

interface UploadScreenProps {
  onUpload: (payload: { fileName: string; cardCount: number }) => Promise<void>;
  isUploading: boolean;
  recentCollection?: { id: string; name: string } | null;
  onStartRecentCollection: (collectionId: string) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({
  onUpload,
  isUploading,
  recentCollection,
  onStartRecentCollection
}) => {
  const [fileName, setFileName] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!fileName) {
      setMessage('Select a file name to simulate the upload.');
      return;
    }
    setMessage(null);
    await onUpload({ fileName, cardCount });
    setMessage('Quiz created.');
  };

  return (
    <div className="screen">
      <Section title="Upload → AI → new collection" kicker="Flow F">
        <FlowGrid flows={[flows[5]]} />
      </Section>

      <section className="upload-card">
        <h2>Upload document</h2>
        <form onSubmit={handleSubmit}>
          <label>
            File name (PDF/DOCX/TXT)
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="istqb-notes.pdf"
            />
          </label>
          <label>
            Cards to generate: {cardCount}
            <input
              type="range"
              min={1}
              max={50}
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
            />
          </label>
          <button type="submit" disabled={isUploading}>
            {isUploading ? 'Generating…' : 'Generate quiz'}
          </button>
        </form>
        {message && (
          <div className="upload-message">
            <p>{message}</p>
            {recentCollection && (
              <>
                <p>Do you want to start a session for this collection now?</p>
                <button onClick={() => onStartRecentCollection(recentCollection.id)}>Start session</button>
              </>
            )}
          </div>
        )}
      </section>

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
    </div>
  );
};

export default UploadScreen;
