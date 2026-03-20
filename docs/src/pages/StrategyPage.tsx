import { useState, useEffect } from 'react';
import PokemonSprite from '../components/PokemonSprite';
import { TYPE_EMOJIS } from '../lib/type-utils';
import type { StrategyData } from '../lib/types';

export default function StrategyPage() {
  const [data, setData] = useState<StrategyData | null>(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/strategy.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <section className="strategy-view active">
        <div className="info-card"><p>Unable to load strategy data.</p></div>
      </section>
    );
  }

  return (
    <section className="strategy-view active">
      {/* Vision */}
      {data.vision?.title && (
        <div className="info-card">
          <h3>{'\uD83C\uDFAF'} ROM Hack Vision</h3>
          <p>
            <strong>{data.vision.title}</strong> &mdash; {data.vision.description}
          </p>
        </div>
      )}

      {/* Starters */}
      {data.starters && data.starters.length > 0 && (
        <div className="info-card">
          <h3>{'\u2694\uFE0F'} New Starter Trio</h3>
          <div className="starter-grid">
            {data.starters.map((s, i) => {
              const primaryType = s.types.split(/\s*[\/\u2192]\s*/)[0].trim();
              const emoji = TYPE_EMOJIS[primaryType] || '\uD83D\uDC7E';
              return (
                <div key={i} className="starter-card">
                  <div className="pokemon-sprite-wrap">
                    <PokemonSprite name={s.name} className="pokemon-sprite-wrap-img" />
                  </div>
                  <div className="pokemon-name">{s.name}</div>
                  <div className="pokemon-type">{s.types}</div>
                  <div className="pokemon-identity">{s.identity}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Roadmap List */}
      {data.roadmap && (
        <div className="info-card">
          <h3>{'\uD83D\uDCCB'} Implementation Roadmap</h3>
          <ul>
            {data.roadmap.completed?.map((entry, i) => {
              const color =
                entry.status === 'completed' ? 'var(--green-bright)' :
                entry.status === 'failed' ? 'var(--red-bright)' :
                'var(--yellow-bright)';
              const icon =
                entry.status === 'completed' ? '\u2713' :
                entry.status === 'failed' ? '\u2717' : '\u26A0';
              return (
                <li key={`c-${i}`}>
                  <strong style={{ color }}>{icon} Cycle {entry.cycle}</strong> &mdash; {entry.description}
                </li>
              );
            })}
            {data.roadmap.upcoming?.map((entry, i) => (
              <li key={`u-${i}`}>
                <strong style={{ color: 'var(--text-muted)' }}>{'\u25CB'} Cycle {entry.cycle}</strong> &mdash; {entry.objective}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
