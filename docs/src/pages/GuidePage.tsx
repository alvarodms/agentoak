import { useState, useEffect, useMemo, useRef } from 'react';
import PokemonSprite from '../components/PokemonSprite';
import TrainerCard from '../components/TrainerCard';
import RouteCard from '../components/RouteCard';
import TypeBadge from '../components/TypeBadge';
import { TYPE_EMOJIS } from '../lib/type-utils';
import { GAME_PROGRESSION } from '../lib/game-progression';
import type { ProgressionStep } from '../lib/game-progression';
import type { GuideData, EncounterEntry } from '../lib/types';

/** Collect all unique species from a set of route keys. */
function collectSpecies(data: GuideData, routeKeys: string[]): string[] {
  const species = new Set<string>();
  for (const key of routeKeys) {
    const route = data.routes[key];
    if (!route) continue;
    for (const type of ['land', 'water', 'rockSmash'] as const) {
      const entries = route[type];
      if (Array.isArray(entries)) {
        (entries as EncounterEntry[]).forEach(m => species.add(m.species));
      }
    }
    if (route.fishing) {
      for (const rod of ['oldRod', 'goodRod', 'superRod'] as const) {
        if (route.fishing[rod]) {
          route.fishing[rod]!.forEach(m => species.add(m.species));
        }
      }
    }
  }
  return [...species];
}

/** Compute guide-wide stats from the data. */
function computeStats(data: GuideData) {
  const allSpecies = new Set<string>();
  let maxLevel = 0;
  let minLevel = 999;

  for (const route of Object.values(data.routes)) {
    for (const type of ['land', 'water', 'rockSmash'] as const) {
      const entries = route[type];
      if (Array.isArray(entries)) {
        (entries as EncounterEntry[]).forEach(m => {
          allSpecies.add(m.species);
          if (m.maxLevel > maxLevel) maxLevel = m.maxLevel;
          if (m.minLevel < minLevel) minLevel = m.minLevel;
        });
      }
    }
    if (route.fishing) {
      for (const rod of ['oldRod', 'goodRod', 'superRod'] as const) {
        if (route.fishing[rod]) {
          route.fishing[rod]!.forEach(m => {
            allSpecies.add(m.species);
            if (m.maxLevel > maxLevel) maxLevel = m.maxLevel;
            if (m.minLevel < minLevel) minLevel = m.minLevel;
          });
        }
      }
    }
  }

  // Check trainer levels too
  for (const gym of data.gymLeaders) {
    for (const mon of gym.party) {
      if (mon.level > maxLevel) maxLevel = mon.level;
    }
  }
  if (data.champion) {
    for (const mon of data.champion.party) {
      if (mon.level > maxLevel) maxLevel = mon.level;
    }
  }
  for (const boss of data.bossFights || []) {
    for (const mon of boss.party) {
      if (mon.level > maxLevel) maxLevel = mon.level;
    }
  }

  return {
    totalRoutes: Object.keys(data.routes).length,
    totalSpecies: allSpecies.size,
    trainers:
      data.gymLeaders.length +
      data.eliteFour.length +
      (data.champion ? 1 : 0) +
      (data.bossFights?.length || 0),
    levelRange: `Lv ${minLevel}\u2013${maxLevel}`,
  };
}

/** Render a single progression step. */
function StepRenderer({
  step,
  data,
  newSpecies,
}: {
  step: ProgressionStep;
  data: GuideData;
  newSpecies: Set<string>;
}) {
  switch (step.type) {
    case 'chapter':
      return (
        <div className="progression-chapter" id={step.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
          <h2 className="progression-chapter-title">{step.label}</h2>
          {step.description && <p className="progression-chapter-desc">{step.description}</p>}
        </div>
      );

    case 'starter':
      return (
        <div className="info-card">
          <h3>{'\u2694\uFE0F'} Starter Pok&eacute;mon</h3>
          <div className="starter-grid">
            {data.starters.map((s, i) => {
              const types = s.types || [];
              const typeStr = types.join(' / ');
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
      );

    case 'route': {
      if (!step.routeKeys || step.routeKeys.length === 0) return null;
      // Check if any route key actually has data
      const validKeys = step.routeKeys.filter(k => data.routes[k]);
      if (validKeys.length === 0) return null;

      // For multi-floor / multi-area locations, merge into a combined view
      if (validKeys.length === 1) {
        return (
          <RouteCard
            name={step.label}
            route={data.routes[validKeys[0]]}
            newSpecies={newSpecies}
          />
        );
      }

      // Multiple sub-areas — render each
      return (
        <div className="route-group">
          <div className="route-group-label">{step.label}</div>
          {validKeys.map(key => (
            <RouteCard
              key={key}
              name={key}
              route={data.routes[key]}
              newSpecies={newSpecies}
            />
          ))}
        </div>
      );
    }

    case 'gym': {
      const gym = data.gymLeaders.find(g => g.gym === step.gymNumber);
      if (!gym) return null;
      return (
        <TrainerCard
          title={`Gym ${gym.gym}: ${gym.name}`}
          subtitle={gym.location + (gym.doubleBattle ? ' \u00B7 Double Battle' : '')}
          typeBadge={gym.type}
          party={gym.party}
        />
      );
    }

    case 'boss': {
      if (!step.bossKeys || step.bossKeys.length === 0) return null;
      const fights = (data.bossFights || []).filter(b => step.bossKeys!.includes(b.key));
      if (fights.length === 0) return null;
      // Preserve the author's ordering from bossKeys (not the JSON order).
      const ordered = step.bossKeys
        .map(k => fights.find(f => f.key === k))
        .filter((b): b is NonNullable<typeof b> => !!b);
      return (
        <>
          {ordered.map(boss => (
            <TrainerCard
              key={boss.key}
              title={`${boss.faction === 'Wally' ? 'Wally' : boss.faction + ' ' + boss.name} \u2014 ${boss.location}`}
              subtitle={boss.doubleBattle ? 'Double Battle' : ''}
              typeBadge={boss.faction}
              party={boss.party}
            />
          ))}
        </>
      );
    }

    case 'rival': {
      const battles = data.rivals.filter(r => {
        if (!step.rivalLocation) return false;
        return r.location.includes(step.rivalLocation);
      });
      if (battles.length === 0) return null;

      // Group by rival name, show all starter matchups
      return (
        <>
          {battles
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
        </>
      );
    }

    case 'elite-four':
      return (
        <div className="guide-section">
          <h3 className="guide-section-title">{'\uD83C\uDFC6'} Elite Four</h3>
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
      );

    case 'champion':
      if (!data.champion) return null;
      return (
        <div className="guide-section">
          <h3 className="guide-section-title">{'\uD83D\uDC51'} Champion</h3>
          <TrainerCard
            title={`Champion ${data.champion.name}`}
            subtitle="The final challenge"
            typeBadge="Champion"
            party={data.champion.party}
          />
        </div>
      );

    case 'landmark':
      return (
        <div className="landmark-card">
          <span className="landmark-icon">{'\uD83C\uDFD8\uFE0F'}</span>
          <div>
            <div className="landmark-name">{step.label}</div>
            {step.description && <div className="landmark-desc">{step.description}</div>}
          </div>
        </div>
      );

    default:
      return null;
  }
}

/** Determine the CSS class for a step type's left border color */
function stepTypeClass(type: ProgressionStep['type']): string {
  switch (type) {
    case 'gym': return 'step-gym';
    case 'boss': return 'step-boss';
    case 'rival': return 'step-rival';
    case 'route': return 'step-route';
    case 'elite-four': return 'step-elite';
    case 'champion': return 'step-champion';
    case 'starter': return 'step-starter';
    case 'landmark': return 'step-landmark';
    case 'chapter': return 'step-chapter';
    default: return '';
  }
}

export default function GuidePage() {
  const [data, setData] = useState<GuideData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/game-guide.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  // Build the "new species" set: track species seen so far, mark first appearances
  const newSpeciesByStep = useMemo(() => {
    if (!data) return new Map<number, Set<string>>();
    const seen = new Set<string>();
    const result = new Map<number, Set<string>>();

    for (let i = 0; i < GAME_PROGRESSION.length; i++) {
      const step = GAME_PROGRESSION[i];
      if (step.type !== 'route' || !step.routeKeys) continue;

      const stepNew = new Set<string>();
      const species = collectSpecies(data, step.routeKeys);
      for (const sp of species) {
        if (!seen.has(sp)) {
          stepNew.add(sp);
          seen.add(sp);
        }
      }
      result.set(i, stepNew);
    }

    return result;
  }, [data]);

  // Collect chapter labels for quick nav
  const chapters = useMemo(() => {
    return GAME_PROGRESSION
      .map((step, i) => ({ step, index: i }))
      .filter(({ step }) => step.type === 'chapter');
  }, []);

  // Filter steps based on search
  const filteredSteps = useMemo(() => {
    if (!searchQuery.trim()) return GAME_PROGRESSION.map((step, i) => ({ step, index: i }));

    const q = searchQuery.toLowerCase();
    // Keep chapters if any of their children match
    const matchingIndices = new Set<number>();

    for (let i = 0; i < GAME_PROGRESSION.length; i++) {
      const step = GAME_PROGRESSION[i];
      if (step.label.toLowerCase().includes(q)) {
        matchingIndices.add(i);
      }
      // Also match route keys
      if (step.routeKeys?.some(k => k.toLowerCase().includes(q))) {
        matchingIndices.add(i);
      }
    }

    // Include chapter headers if any following step (before next chapter) matches
    const result: { step: ProgressionStep; index: number }[] = [];
    let currentChapterIdx = -1;
    let chapterAdded = false;

    for (let i = 0; i < GAME_PROGRESSION.length; i++) {
      const step = GAME_PROGRESSION[i];
      if (step.type === 'chapter') {
        currentChapterIdx = i;
        chapterAdded = false;
        continue;
      }
      if (matchingIndices.has(i)) {
        if (!chapterAdded && currentChapterIdx >= 0) {
          result.push({ step: GAME_PROGRESSION[currentChapterIdx], index: currentChapterIdx });
          chapterAdded = true;
        }
        result.push({ step, index: i });
      }
    }

    return result;
  }, [searchQuery]);

  if (!data) {
    return (
      <section className="guide-view active">
        <div className="info-card"><p>Unable to load game guide data.</p></div>
      </section>
    );
  }

  const stats = computeStats(data);

  return (
    <section className="guide-view active">
      {/* Stats Banner */}
      <div className="guide-stats-banner">
        <div className="guide-stat">
          <div className="guide-stat-value">{stats.totalRoutes}</div>
          <div className="guide-stat-label">Locations</div>
        </div>
        <div className="guide-stat">
          <div className="guide-stat-value">{stats.totalSpecies}</div>
          <div className="guide-stat-label">Species</div>
        </div>
        <div className="guide-stat">
          <div className="guide-stat-value">{stats.trainers}</div>
          <div className="guide-stat-label">Key Trainers</div>
        </div>
        <div className="guide-stat">
          <div className="guide-stat-value">{stats.levelRange}</div>
          <div className="guide-stat-label">Level Range</div>
        </div>
      </div>

      {/* Search & Quick Nav */}
      <div className="guide-toolbar">
        <div className="guide-search-wrap">
          <input
            ref={searchRef}
            type="text"
            className="guide-search"
            placeholder="Search locations, trainers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="guide-search-clear" onClick={() => setSearchQuery('')}>
              {'\u2715'}
            </button>
          )}
        </div>
        <div className="guide-quick-nav">
          {chapters.map(({ step, index }) => (
            <a
              key={index}
              className="guide-quick-nav-item"
              href={`#${step.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              title={step.label}
            >
              {step.label.replace(/^Chapter \d+:\s*/, '')}
            </a>
          ))}
        </div>
      </div>

      {/* Progression Timeline */}
      <div className="progression-timeline">
        {filteredSteps.map(({ step, index }) => (
          <div
            key={index}
            className={`progression-step ${stepTypeClass(step.type)}`}
          >
            <StepRenderer
              step={step}
              data={data}
              newSpecies={newSpeciesByStep.get(index) || new Set()}
            />
          </div>
        ))}
      </div>

      {searchQuery && filteredSteps.length === 0 && (
        <div className="info-card">
          <p>No locations or trainers match &ldquo;{searchQuery}&rdquo;.</p>
        </div>
      )}
    </section>
  );
}
