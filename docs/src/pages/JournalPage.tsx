import { useState, useEffect } from 'react';
import StatsBanner from '../components/StatsBanner';
import JournalCard from '../components/JournalCard';
import type { JournalEntry } from '../lib/types';

const ENTRIES_PER_PAGE = 10;

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build page numbers with ellipsis
  const pages: (number | '...')[] = [];
  for (let i = 0; i < totalPages; i++) {
    if (
      i === 0 ||
      i === totalPages - 1 ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`pagination-btn${p === currentPage ? ' active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p + 1}
          </button>
        ),
      )}
      <button
        className="pagination-btn"
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/journals.json')
      .then(r => r.json())
      .then(setEntries)
      .catch(() => {});
  }, []);

  const sorted = [...entries].sort((a, b) => b.cycle - a.cycle);
  const totalPages = Math.ceil(sorted.length / ENTRIES_PER_PAGE);
  const pageEntries = sorted.slice(
    currentPage * ENTRIES_PER_PAGE,
    (currentPage + 1) * ENTRIES_PER_PAGE,
  );

  const startCycle = pageEntries.length > 0 ? pageEntries[0].cycle : 0;
  const endCycle =
    pageEntries.length > 0 ? pageEntries[pageEntries.length - 1].cycle : 0;

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <StatsBanner entries={entries} />
      <main className="main-content active">
        {totalPages > 1 && (
          <div className="pagination-info">
            Showing cycles {startCycle}&ndash;{endCycle} of {sorted.length} total
          </div>
        )}
        <div className="timeline">
          {sorted.length === 0 ? (
            <div className="loading-state">
              <p>No research logs available.</p>
            </div>
          ) : (
            pageEntries.map(entry => (
              <JournalCard key={entry.cycle} entry={entry} />
            ))
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </>
  );
}
