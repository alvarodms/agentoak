import fs from 'fs';
import path from 'path';
import type { GetStaticProps } from 'next';
import StatsBanner from '../components/StatsBanner';
import JournalCard from '../components/JournalCard';
import type { JournalEntry } from '../lib/types';

interface JournalPageProps {
  entries: JournalEntry[];
}

export const getStaticProps: GetStaticProps<JournalPageProps> = async () => {
  const filePath = path.join(process.cwd(), 'data', 'journals.json');
  let entries: JournalEntry[] = [];
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    entries = JSON.parse(raw);
  } catch {
    // data file may not exist during initial setup
  }
  return { props: { entries } };
};

export default function JournalPage({ entries }: JournalPageProps) {
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
