import { useState } from 'react';
import type { JournalEntry } from '../lib/types';

interface JournalCardProps {
  entry: JournalEntry;
}

export default function JournalCard({ entry }: JournalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(entry.date);
  const dateStr =
    date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' \u00B7 ' +
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  const isSuccess = entry.buildResult?.status === 'success';

  return (
    <div className={`journal-card mode-${entry.mode || 'research'}${expanded ? ' expanded' : ''}`}>
      <div className="card-header" onClick={() => setExpanded(!expanded)}>
        <span className="cycle-badge">CYCLE {String(entry.cycle).padStart(4, '0')}</span>
        <span className={`mode-badge ${entry.mode || ''}`}>{entry.mode || 'unknown'}</span>
        <span className="card-date">{dateStr}</span>
        <span className="card-expand">{'\u25BC'}</span>
      </div>

      <div className="card-objective">{entry.objective || ''}</div>

      {entry.buildResult && (
        <div className={`build-indicator ${isSuccess ? 'success' : 'failure'}`}>
          <span className="led"></span>
          {isSuccess ? 'BUILD PASSED' : 'BUILD FAILED'}
        </div>
      )}

      <div className="card-body">
        <div className="card-body-inner">
          <div className="card-section">
            <div className="section-title"><span className="icon">{'\uD83E\uDDE0'}</span> Reasoning</div>
            <div className="reasoning-block">{entry.reasoning || ''}</div>
          </div>

          {entry.filesModified && entry.filesModified.length > 0 && (
            <div className="card-section">
              <div className="section-title"><span className="icon">{'\uD83D\uDCC1'}</span> Files Modified</div>
              <ul className="files-list">
                {entry.filesModified.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card-section">
            <div className="section-title"><span className="icon">{'\uD83D\uDCCB'}</span> Summary</div>
            <div className="summary-block">{entry.summary || ''}</div>
          </div>

          <div className="card-section">
            <div className="section-title"><span className="icon">{'\uD83D\uDD2E'}</span> Next Steps</div>
            <div className="next-steps-block">{entry.nextSteps || ''}</div>
          </div>

          {entry.stats && entry.stats.tokensUsed != null && (
            <div className="card-section">
              <div className="section-title"><span className="icon">{'\uD83D\uDCCA'}</span> Stats</div>
              <div className="stats-bar">
                <span className="stat-chip">
                  Tokens: <strong>{entry.stats.tokensUsed.toLocaleString()}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
