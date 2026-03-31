import { useState } from 'react';
import PokemonSprite from './PokemonSprite';
import TypeBadge from './TypeBadge';
import type { RivalBattle, Move } from '../lib/types';

interface RivalBattleCardProps {
  rival: string;
  location: string;
  battles: RivalBattle[];
}

export default function RivalBattleCard({ rival, location, battles }: RivalBattleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const activeBattle = battles[activeTab];

  return (
    <div className={`guide-card rival-card${expanded ? ' expanded' : ''}`}>
      <div className="guide-card-header" onClick={() => setExpanded(!expanded)}>
        <span className="guide-card-title">{rival} &mdash; {location}</span>
        <TypeBadge type="Rival" />
        <span className="card-expand">{'\u25BC'}</span>
      </div>

      {battles.length > 1 && (
        <div className="rival-starter-tabs" role="tablist">
          <span className="rival-tabs-label">If you chose:</span>
          {battles.map((battle, i) => (
            <button
              key={battle.starterMatchup ?? i}
              role="tab"
              aria-selected={i === activeTab}
              className={`rival-starter-tab${i === activeTab ? ' active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setActiveTab(i); if (!expanded) setExpanded(true); }}
            >
              <PokemonSprite name={battle.starterMatchup ?? ''} className="starter-tab-sprite" />
              {battle.starterMatchup}
            </button>
          ))}
        </div>
      )}

      <div className="guide-card-body">
        <table className="party-table">
          <thead>
            <tr>
              <th>Pok&eacute;mon</th>
              <th>Lv</th>
              <th>Held Item</th>
              <th>Moves</th>
            </tr>
          </thead>
          <tbody>
            {activeBattle.party.map((mon, i) => (
              <tr key={i}>
                <td className="mon-name">
                  <PokemonSprite name={mon.species} className="pokemon-thumb" />
                  {mon.species}
                </td>
                <td className="mon-level">{mon.level}</td>
                <td>{mon.heldItem || '\u2014'}</td>
                <td className="mon-moves">
                  {mon.moves && mon.moves.length > 0 ? (
                    mon.moves.map((move, j) => {
                      const moveName = typeof move === 'string' ? move : (move as Move).name;
                      const moveType = typeof move === 'object' ? (move as Move).type : null;
                      return (
                        <span
                          key={j}
                          className={`move-lozenge${moveType ? ` move-type-${moveType.toLowerCase()}` : ''}`}
                        >
                          {moveName}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-muted">Default</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
