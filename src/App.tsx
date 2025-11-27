import React, { useEffect, useMemo, useState } from 'react';
import OnboardingScreen from './screens/Onboarding';
import HomeScreen from './screens/Home';
import QuizSessionScreen from './screens/QuizSession';
import SessionSummaryScreen from './screens/SessionSummary';
import UploadScreen from './screens/Upload';
import CollectionsScreen from './screens/Collections';
import { listCollections, startSession, submitAnswer, getSessionResult, uploadQuiz } from './lib/api';
import { CollectionSummary, QuizCard, Screen, SessionResult, StartSessionResponse } from './types';

const USER_ID = 'demo-user';

function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState('istqb-foundation');
  const [session, setSession] = useState<StartSessionResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ cardId: string; isCorrect: boolean }[]>([]);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recentCollection, setRecentCollection] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    (async () => {
      const data = await listCollections(USER_ID);
      setCollections(data);
      if (data.length > 0) {
        setActiveCollectionId(data[0].id);
      }
    })();
  }, []);

  const activeCollectionName = useMemo(() => {
    const active = collections.find((c) => c.id === activeCollectionId);
    return active?.name ?? 'ISTQB Foundation 4.0';
  }, [collections, activeCollectionId]);

  const handleStartSession = async (collectionIdOverride?: string) => {
    const targetCollectionId = collectionIdOverride ?? activeCollectionId;
    const newSession = await startSession({ userId: USER_ID, collectionId: targetCollectionId });
    setActiveCollectionId(targetCollectionId);
    setSession(newSession);
    setCurrentIndex(0);
    setAnswers([]);
    setScreen('quiz');
    setRecentCollection(null);
  };

  const handleCardComplete = async (card: QuizCard, isCorrect: boolean) => {
    if (!session) return;
    await submitAnswer({ userId: USER_ID, sessionId: session.sessionId, cardId: card.id, isCorrect });
    const updatedAnswers = [...answers, { cardId: card.id, isCorrect }];
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < session.cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const result = await getSessionResult({
        userId: USER_ID,
        sessionId: session.sessionId,
        answers: updatedAnswers
      });
      setSessionResult(result);
      setScreen('summary');
    }
  };

  const handleAbortSession = () => {
    setSession(null);
    setCurrentIndex(0);
    setAnswers([]);
    setScreen('home');
  };

  const handleUpload = async ({ fileName, cardCount }: { fileName: string; cardCount: number }) => {
    setUploading(true);
    const { collectionId, name } = await uploadQuiz({ userId: USER_ID, fileName, cardCount });
    setCollections((prev) => [
      ...prev,
      {
        id: collectionId,
        name,
        type: 'custom',
        cardCount,
        description: 'Generated from upload flow.',
        createdAt: new Date().toISOString().split('T')[0]
      }
    ]);
    setRecentCollection({ id: collectionId, name });
    setUploading(false);
  };

  const handleSelectCollection = (collectionId: string) => {
    setActiveCollectionId(collectionId);
    setScreen('home');
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollections((prev) => {
      const next = prev.filter((collection) => collection.id !== collectionId);
      if (collectionId === activeCollectionId) {
        setActiveCollectionId(next[0]?.id ?? 'istqb-foundation');
      }
      return next;
    });
  };

  const renderScreen = () => {
    switch (screen) {
      case 'onboarding':
        return <OnboardingScreen onContinue={() => setScreen('home')} />;
      case 'home':
        return (
          <HomeScreen
            onStartSession={handleStartSession}
            onUpload={() => setScreen('upload')}
            onCollections={() => setScreen('collections')}
            suggestedCount={session?.suggestedCount ?? 8}
            newCards={session?.newCards ?? 2}
            activeCollectionName={activeCollectionName}
          />
        );
      case 'quiz':
        return (
          <QuizSessionScreen
            card={session ? session.cards[currentIndex] : null}
            currentIndex={currentIndex}
            total={session?.cards.length ?? 0}
            onCardComplete={handleCardComplete}
            onAbort={handleAbortSession}
          />
        );
      case 'summary':
        return (
          <SessionSummaryScreen
            result={sessionResult}
            onStartAnother={handleStartSession}
            onDone={() => setScreen('home')}
          />
        );
      case 'upload':
        return (
          <UploadScreen
            onUpload={handleUpload}
            isUploading={uploading}
            recentCollection={recentCollection}
            onStartRecentCollection={(collectionId) => handleStartSession(collectionId)}
          />
        );
      case 'collections':
        return (
          <CollectionsScreen
            collections={collections}
            activeCollectionId={activeCollectionId}
            onSelect={handleSelectCollection}
            onDelete={handleDeleteCollection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="app-shell">
      {screen !== 'onboarding' && screen !== 'quiz' && (
        <nav className="app-nav">
          <button onClick={() => setScreen('home')} className={screen === 'home' ? 'active' : ''}>
            Home
          </button>
          <button onClick={() => setScreen('upload')} className={screen === 'upload' ? 'active' : ''}>
            Upload document
          </button>
          <button onClick={() => setScreen('collections')} className={screen === 'collections' ? 'active' : ''}>
            My collections
          </button>
        </nav>
      )}
      {renderScreen()}
    </main>
  );
}

export default App;
