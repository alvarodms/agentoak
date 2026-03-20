import { useState, useEffect } from 'react';
import type { ReleaseEntry } from '../lib/types';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Minimal markdown-to-JSX for release bodies (bullets, bold, headings, links). */
function ReleaseBody({ markdown }: { markdown: string }) {
  const lines = markdown.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key++}>
        {listItems.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*]\s+/, ''));
    } else {
      flushList();
      if (trimmed === '') continue;
      if (/^#{1,3}\s+/.test(trimmed)) {
        const text = trimmed.replace(/^#{1,3}\s+/, '');
        elements.push(<h4 key={key++} dangerouslySetInnerHTML={{ __html: inlineFormat(text) }} />);
      } else {
        elements.push(<p key={key++} dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }} />);
      }
    }
  }
  flushList();

  return <div className="release-changelog">{elements}</div>;
}

function inlineFormat(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export default function DownloadsPage() {
  const [releases, setReleases] = useState<ReleaseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/releases.json`)
      .then(r => r.json())
      .then(data => { setReleases(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="downloads-view active">
      <div className="info-card">
        <h3>{'\uD83C\uDFAE'} How to Play</h3>
        <p>Follow these steps to patch and play <strong>Legends of Hoenn</strong>:</p>
        <ol className="patching-steps">
          <li>
            <strong>Get the base ROM</strong> &mdash; You need a <strong>Pok&eacute;mon Emerald (U)</strong> ROM file.
            <br />
            <span className="text-muted">
              SHA-1: <code>f3ae088181bf583e55daf962a92bb46f4f1d07b7</code>
            </span>
            <br />
            <span className="text-muted">We cannot provide ROM files. Please source your own legally.</span>
          </li>
          <li>
            <strong>Download the patch</strong> &mdash; Grab the <code>.ips</code> patch file from the latest release below.
          </li>
          <li>
            <strong>Apply the patch</strong> &mdash; Use an online patcher like{' '}
            <a href="https://www.marcrobledo.com/RomPatcher.js/" target="_blank" rel="noopener noreferrer">
              RomPatcher.js
            </a>{' '}
            to apply the <code>.ips</code> file to your base ROM.
          </li>
          <li>
            <strong>Play!</strong> &mdash; Load the patched <code>.gba</code> file in any GBA emulator
            (mGBA, VBA-M, etc.) or flash cart.
          </li>
        </ol>
      </div>

      <h2 className="section-heading">Latest Releases</h2>

      {loading && <div className="info-card"><p>Loading releases&hellip;</p></div>}

      {!loading && releases.length === 0 && (
        <div className="info-card">
          <p>
            No releases available yet. Check the{' '}
            <a href="https://github.com/alvarodms/agentoak/releases" target="_blank" rel="noopener noreferrer">
              GitHub releases page
            </a>{' '}
            for updates.
          </p>
        </div>
      )}

      {releases.map(release => (
        <div key={release.tag} className="release-card">
          <div className="release-card-header">
            <div>
              <span className="release-tag">{release.tag}</span>
              <span className="release-name">{release.name}</span>
            </div>
            <span className="release-date">{formatDate(release.date)}</span>
          </div>

          {release.body && <ReleaseBody markdown={release.body} />}

          <div className="release-actions">
            {release.ipsUrl ? (
              <a href={release.ipsUrl} className="download-btn" download>
                {'\u2B07'} Download Patch
                {release.ipsName && <span className="download-filename">{release.ipsName}</span>}
              </a>
            ) : (
              <a href={release.url} className="download-btn download-btn-secondary" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            )}
            <a href={release.url} className="release-github-link" target="_blank" rel="noopener noreferrer">
              View release on GitHub &rarr;
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}
