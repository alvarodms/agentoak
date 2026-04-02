import { useState } from 'react';
import TypeBadge from './TypeBadge';
import type { PokedexEntry, MoveInfo } from '../lib/types';

interface LearnsetTableProps {
  pokemon: PokedexEntry;
  moves: Record<string, MoveInfo>;
}

type Tab = 'levelUp' | 'tmhm' | 'tutor' | 'egg';

function MoveRow({ name, info }: { name: string; info?: MoveInfo }) {
  return (
    <>
      <td className="move-name">{name}</td>
      <td>{info ? <TypeBadge type={info.type} /> : '—'}</td>
      <td>{info?.category || '—'}</td>
      <td>{info?.power || '—'}</td>
      <td>{info?.accuracy || '—'}</td>
      <td>{info?.pp || '—'}</td>
    </>
  );
}

export default function LearnsetTable({ pokemon, moves }: LearnsetTableProps) {
  const [tab, setTab] = useState<Tab>('levelUp');

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'levelUp', label: 'Level Up', count: pokemon.learnset.levelUp.length },
    { key: 'tmhm', label: 'TM/HM', count: pokemon.learnset.tmhm.length },
    { key: 'tutor', label: 'Tutor', count: pokemon.learnset.tutor.length },
    { key: 'egg', label: 'Egg Moves', count: pokemon.learnset.egg.length },
  ];

  return (
    <div className="learnset-section">
      <div className="learnset-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`learnset-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
            type="button"
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="learnset-content">
        {tab === 'levelUp' && (
          <table className="learnset-table">
            <thead>
              <tr>
                <th>Lv</th>
                <th>Move</th>
                <th>Type</th>
                <th>Cat</th>
                <th>Pow</th>
                <th>Acc</th>
                <th>PP</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.learnset.levelUp.map((m, i) => (
                <tr key={i}>
                  <td className="move-level">{m.level}</td>
                  <MoveRow name={m.move} info={moves[m.move]} />
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'tmhm' && (
          <table className="learnset-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Move</th>
                <th>Type</th>
                <th>Cat</th>
                <th>Pow</th>
                <th>Acc</th>
                <th>PP</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.learnset.tmhm.map((m, i) => (
                <tr key={i}>
                  <td className="move-level">{m.label}</td>
                  <MoveRow name={m.move} info={moves[m.move]} />
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'tutor' && (
          <table className="learnset-table">
            <thead>
              <tr>
                <th>Move</th>
                <th>Type</th>
                <th>Cat</th>
                <th>Pow</th>
                <th>Acc</th>
                <th>PP</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.learnset.tutor.map((name, i) => (
                <tr key={i}>
                  <MoveRow name={name} info={moves[name]} />
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'egg' && (
          <table className="learnset-table">
            <thead>
              <tr>
                <th>Move</th>
                <th>Type</th>
                <th>Cat</th>
                <th>Pow</th>
                <th>Acc</th>
                <th>PP</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.learnset.egg.map((name, i) => (
                <tr key={i}>
                  <MoveRow name={name} info={moves[name]} />
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab !== 'levelUp' && tab !== 'tmhm' &&
         ((tab === 'tutor' && pokemon.learnset.tutor.length === 0) ||
          (tab === 'egg' && pokemon.learnset.egg.length === 0)) && (
          <p className="learnset-empty">No moves in this category.</p>
        )}
      </div>
    </div>
  );
}
