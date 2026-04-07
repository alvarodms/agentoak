import { useState } from 'react';
import type { JournalEntry } from '../lib/types';

interface JournalCardProps {
  entry: JournalEntry;
}

/**
 * Lightweight markdown renderer for plan output content.
 * Handles headers, tables, bullet lists, and bold text.
 */
function MarkdownContent({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h6 key={i}>{formatInline(line.slice(4))}</h6>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h5 key={i}>{formatInline(line.slice(3))}</h5>);
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(<h4 key={i}>{formatInline(line.slice(2))}</h4>);
      i++;
      continue;
    }

    // Table: collect consecutive lines starting with |
    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<MarkdownTable key={`table-${i}`} lines={tableLines} />);
      continue;
    }

    // Bullet list: collect consecutive lines starting with -
    if (line.match(/^[-*]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`}>
          {items.map((item, j) => (
            <li key={j}>{formatInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^-{3,}$/)) {
      elements.push(<hr key={i} />);
      i++;
      continue;
    }

    // Plain paragraph
    elements.push(<p key={i}>{formatInline(line)}</p>);
    i++;
  }

  return <>{elements}</>;
}

/** Render a markdown table from lines */
function MarkdownTable({ lines }: { lines: string[] }) {
  const parseRow = (line: string) =>
    line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

  // Detect separator row (e.g. |---|---|)
  const isSeparator = (line: string) => /^\|[\s:|-]+\|$/.test(line);

  const headerRow = parseRow(lines[0]);
  const hasSeparator = lines.length > 1 && isSeparator(lines[1]);
  const dataStart = hasSeparator ? 2 : 1;
  const dataRows = lines.slice(dataStart).filter((l) => !isSeparator(l)).map(parseRow);

  return (
    <div className="plan-table-wrapper">
      <table>
        {hasSeparator && (
          <thead>
            <tr>
              {headerRow.map((cell, j) => (
                <th key={j}>{formatInline(cell)}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {!hasSeparator && (
            <tr>
              {headerRow.map((cell, j) => (
                <td key={j}>{formatInline(cell)}</td>
              ))}
            </tr>
          )}
          {dataRows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{formatInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Format inline markdown: **bold**, `code` */
function formatInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<code key={match.index}>{match[3]}</code>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export default function JournalCard({ entry }: JournalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(entry.date);
  const dateStr =
    date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' \u00B7 ' +
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className={`journal-card mode-${entry.mode || 'research'}${expanded ? ' expanded' : ''}`}>
      <div className="card-header" onClick={() => setExpanded(!expanded)}>
        <span className="cycle-badge">CYCLE {String(entry.cycle).padStart(4, '0')}</span>
        <span className={`mode-badge ${entry.mode || ''}`}>{entry.mode || 'unknown'}</span>
        <span className="card-date">{dateStr}</span>
        <span className="card-expand">{'\u25BC'}</span>
      </div>

      <div className="card-objective">{entry.objective || ''}</div>

      {entry.cycleResult && (
        <div className={`build-indicator ${entry.cycleResult.status}`}>
          <span className="led"></span>
          {entry.cycleResult.label}
        </div>
      )}

      <div className="card-body">
        <div className="card-body-inner">
          <div className="card-section">
            <div className="section-title"><span className="icon">{'\uD83E\uDDE0'}</span> Reasoning</div>
            <div className="reasoning-block">{entry.reasoning || ''}</div>
          </div>

          {entry.planOutput && (
            <div className="card-section">
              <div className="section-title"><span className="icon">{'\uD83D\uDCCB'}</span> Plan Output</div>
              <div className="plan-output-block">
                <MarkdownContent text={entry.planOutput} />
              </div>
            </div>
          )}

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
            <div className="section-title"><span className="icon">{'\uD83D\uDCDD'}</span> Summary</div>
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
