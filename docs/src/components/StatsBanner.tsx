import type { JournalEntry } from '../lib/types';

interface StatsBannerProps {
  entries: JournalEntry[];
}

export default function StatsBanner({ entries }: StatsBannerProps) {
  const totalCycles = entries.length;
  const builds = entries.filter(j => j.buildResult);
  const successes = builds.filter(j => j.buildResult!.status === 'success').length;
  const failures = builds.length - successes;
  const filesModified = new Set(entries.flatMap(j => j.filesModified || [])).size;

  return (
    <div className="stats-banner">
      <div className="stat-item">
        <span className="stat-label">Cycles</span>
        <span className="stat-value">{String(totalCycles).padStart(3, '0')}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Builds</span>
        <span className={`stat-value ${failures === 0 ? 'success' : ''}`}>
          {successes}/{builds.length}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Files Changed</span>
        <span className="stat-value">{filesModified}</span>
      </div>
    </div>
  );
}
