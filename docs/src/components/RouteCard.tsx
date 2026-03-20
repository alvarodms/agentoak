import { useState } from 'react';
import PokemonSprite from './PokemonSprite';
import { rarityClass, rarityLabel } from '../lib/type-utils';
import type { RouteData, EncounterEntry } from '../lib/types';

interface RouteCardProps {
  name: string;
  route: RouteData;
  /** Species appearing for the first time in game progression */
  newSpecies?: Set<string>;
}

interface DeduplicatedEncounter extends EncounterEntry {
  totalRate: number;
}

function deduplicateEncounters(mons: EncounterEntry[]): DeduplicatedEncounter[] {
  const seen = new Map<string, DeduplicatedEncounter>();
  mons.forEach(m => {
    const key = m.species;
    if (seen.has(key)) {
      const existing = seen.get(key)!;
      existing.minLevel = Math.min(existing.minLevel, m.minLevel);
      existing.maxLevel = Math.max(existing.maxLevel, m.maxLevel);
      existing.totalRate += m.rate;
    } else {
      seen.set(key, { ...m, totalRate: m.rate });
    }
  });
  return [...seen.values()].sort((a, b) => b.totalRate - a.totalRate);
}

function EncounterTable({
  title,
  mons,
  newSpecies,
}: {
  title: string;
  mons: EncounterEntry[];
  newSpecies?: Set<string>;
}) {
  const deduped = deduplicateEncounters(mons);

  return (
    <div className="encounter-group">
      <div className="encounter-group-title" dangerouslySetInnerHTML={{ __html: title }} />
      <table className="encounter-table">
        <thead>
          <tr>
            <th>Pok&eacute;mon</th>
            <th>Level</th>
            <th>Rate</th>
            <th>Rarity</th>
          </tr>
        </thead>
        <tbody>
          {deduped.map((m, i) => (
            <tr key={i}>
              <td className="mon-name">
                <PokemonSprite name={m.species} className="pokemon-thumb-sm" />
                {m.species}
                {newSpecies?.has(m.species) && (
                  <span className="new-species-badge">NEW</span>
                )}
              </td>
              <td>{m.minLevel === m.maxLevel ? m.minLevel : `${m.minLevel}\u2013${m.maxLevel}`}</td>
              <td>{m.totalRate}%</td>
              <td>
                <span className={`rarity-badge rarity-${rarityClass(m.totalRate)}`}>
                  {rarityLabel(m.totalRate)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RouteCard({ name, route, newSpecies }: RouteCardProps) {
  const [expanded, setExpanded] = useState(false);

  const allSpecies = new Set<string>();
  ['land', 'water', 'rockSmash'].forEach(type => {
    const entries = route[type as keyof RouteData];
    if (Array.isArray(entries)) {
      (entries as EncounterEntry[]).forEach(m => allSpecies.add(m.species));
    }
  });
  if (route.fishing) {
    (['oldRod', 'goodRod', 'superRod'] as const).forEach(rod => {
      if (route.fishing![rod]) route.fishing![rod]!.forEach(m => allSpecies.add(m.species));
    });
  }

  const newCount = newSpecies ? [...allSpecies].filter(s => newSpecies.has(s)).length : 0;

  return (
    <div className={`guide-card${expanded ? ' expanded' : ''}`}>
      <div className="guide-card-header" onClick={() => setExpanded(!expanded)}>
        <span className="guide-card-title">{name}</span>
        <span className="encounter-count">{allSpecies.size} species</span>
        {newCount > 0 && (
          <span className="new-count-badge">{newCount} new</span>
        )}
        <span className="card-expand">{'\u25BC'}</span>
      </div>

      <div className="guide-card-body">
        {route.land && <EncounterTable title="&#x1F33F; Grass / Cave" mons={route.land} newSpecies={newSpecies} />}
        {route.water && <EncounterTable title="&#x1F30A; Surfing" mons={route.water} newSpecies={newSpecies} />}
        {route.rockSmash && <EncounterTable title="&#x1FAA8; Rock Smash" mons={route.rockSmash} newSpecies={newSpecies} />}
        {route.fishing?.oldRod && <EncounterTable title="&#x1F3A3; Old Rod" mons={route.fishing.oldRod} newSpecies={newSpecies} />}
        {route.fishing?.goodRod && <EncounterTable title="&#x1F3A3; Good Rod" mons={route.fishing.goodRod} newSpecies={newSpecies} />}
        {route.fishing?.superRod && <EncounterTable title="&#x1F3A3; Super Rod" mons={route.fishing.superRod} newSpecies={newSpecies} />}
      </div>
    </div>
  );
}
