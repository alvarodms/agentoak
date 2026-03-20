import { useState, useEffect } from 'react';
import PokemonSprite from '../components/PokemonSprite';
import TrainerCard from '../components/TrainerCard';
import RouteCard from '../components/RouteCard';
import { TYPE_EMOJIS } from '../lib/type-utils';
import type { GuideData } from '../lib/types';

function sortRouteNames(names: string[]): string[] {
  return names.sort((a, b) => {
    const aNum = a.match(/^Route (\d+)$/);
    const bNum = b.match(/^Route (\d+)$/);
    if (aNum && bNum) return parseInt(aNum[1]) - parseInt(bNum[1]);
    if (aNum) return -1;
    if (bNum) return 1;
    return a.localeCompare(b);
  });
}

export default function GuidePage() {
  const [data, setData] = useState<GuideData | null>(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/game-guide.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <section className="guide-view active">
        <div className="info-card"><p>Unable to load game guide data.</p></div>
      </section>
    );
  }

  const routeNames = sortRouteNames(Object.keys(data.routes));

  return (
    <section className="guide-view active">
      {/* Starters */}
      <div className="info-card">
        <h3>{'\u2694\uFE0F'} Starter Pok&eacute;mon</h3>
        <div className="starter-grid">
          {data.starters.map((s, i) => {
            const types = s.types || [];
            const typeStr = types.join(' / ');
            const emoji = TYPE_EMOJIS[types[0]] || '\uD83D\uDC7E';
            return (
              <div key={i} className="starter-card">
                <div className="pokemon-sprite-wrap">
                  <PokemonSprite name={s.species} className="pokemon-sprite-wrap-img" />
                </div>
                <div className="pokemon-name">{s.species}</div>
                <div className="pokemon-type">{typeStr}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gym Leaders */}
      <div className="guide-section">
        <h2 className="guide-section-title">{'\uD83C\uDFDF\uFE0F'} Gym Leaders</h2>
        {data.gymLeaders.map((gym, i) => (
          <TrainerCard
            key={i}
            title={`Gym ${gym.gym}: ${gym.name}`}
            subtitle={gym.location + (gym.doubleBattle ? ' \u00B7 Double Battle' : '')}
            typeBadge={gym.type}
            party={gym.party}
          />
        ))}
      </div>

      {/* Elite Four */}
      <div className="guide-section">
        <h2 className="guide-section-title">{'\uD83C\uDFC6'} Elite Four</h2>
        {data.eliteFour.map((e4, i) => (
          <TrainerCard
            key={i}
            title={`Elite Four #${i + 1}: ${e4.name}`}
            subtitle={`${e4.type} Specialist`}
            typeBadge={e4.type}
            party={e4.party}
          />
        ))}
      </div>

      {/* Champion */}
      {data.champion && (
        <div className="guide-section">
          <h2 className="guide-section-title">{'\uD83D\uDC51'} Champion</h2>
          <TrainerCard
            title={`Champion ${data.champion.name}`}
            subtitle="The final challenge"
            typeBadge="Champion"
            party={data.champion.party}
          />
        </div>
      )}

      {/* Rivals */}
      <div className="guide-section">
        <h2 className="guide-section-title">{'\uD83C\uDFC3'} Rival Battles</h2>
        {data.rivals
          .filter(r => r.rival === 'Brendan')
          .sort((a, b) => {
            const maxA = Math.max(...a.party.map(p => p.level));
            const maxB = Math.max(...b.party.map(p => p.level));
            return maxA - maxB;
          })
          .map((battle, i) => (
            <TrainerCard
              key={i}
              title={`${battle.rival} \u2014 ${battle.location}`}
              subtitle={battle.starterMatchup ? `If player chose: ${battle.starterMatchup}` : ''}
              typeBadge="Rival"
              party={battle.party}
            />
          ))}
      </div>

      {/* Routes */}
      <div className="guide-section">
        <h2 className="guide-section-title">{'\uD83D\uDDFA\uFE0F'} Wild Encounters by Location</h2>
        {routeNames.map(name => (
          <RouteCard key={name} name={name} route={data.routes[name]} />
        ))}
      </div>
    </section>
  );
}
