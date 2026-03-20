import { useState, useEffect } from 'react';
import StatsBanner from '../components/StatsBanner';
import JournalCard from '../components/JournalCard';
import type { JournalEntry } from '../lib/types';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/journals.json')
      .then(r => r.json())
      .then(setEntries)
      .catch(() => {});
  }, []);

  const sorted = [...entries].sort((a, b) => b.cycle - a.cycle);

  return (
    <>
      <StatsBanner entries={entries} />
      <main className="main-content active">
        <div className="timeline">
          {sorted.length === 0 ? (
            <div className="loading-state">
              <p>No research logs available.</p>
            </div>
          ) : (
            sorted.map(entry => <JournalCard key={entry.cycle} entry={entry} />)
          )}
        </div>
      </main>
    </>
  );
}
