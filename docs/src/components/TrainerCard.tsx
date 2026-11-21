import { useState } from 'react';
import PokemonSprite from './PokemonSprite';
import TypeBadge from './TypeBadge';
import type { PartyMember, Move, RouteTrainer } from '../lib/types';

interface TrainerCardProps {
  title: string;
  subtitle?: string;
  typeBadge: string;
  party: PartyMember[];
  /** When provided, renders multiple trainers in a single collapsible card */
  routeTrainers?: RouteTrainer[];
}

function PartyTable({ party }: { party: PartyMember[] }) {
  return (
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
        {party.map((mon, i) => (
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
  );
}

export default function TrainerCard({ title, subtitle, typeBadge, party, routeTrainers }: TrainerCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isRouteTrainerCard = routeTrainers && routeTrainers.length > 0;

  return (
    <div className={`guide-card${expanded ? ' expanded' : ''}`}>
      <div className="guide-card-header" onClick={() => setExpanded(!expanded)}>
        <span className="guide-card-title">{title}</span>
        <TypeBadge type={typeBadge} />
        <span className="card-expand">{'\u25BC'}</span>
      </div>

      {subtitle && <div className="guide-card-subtitle">{subtitle}</div>}

      <div className="guide-card-body">
        {isRouteTrainerCard ? (
          routeTrainers.map((trainer, idx) => (
            <div key={idx} className="route-trainer-entry">
              <div className="route-trainer-name">
                {trainer.trainerClass} {trainer.name}
                {trainer.doubleBattle && <span className="double-badge">Double</span>}
              </div>
              <PartyTable party={trainer.party} />
            </div>
          ))
        ) : (
          <PartyTable party={party} />
        )}
      </div>
    </div>
  );
}
