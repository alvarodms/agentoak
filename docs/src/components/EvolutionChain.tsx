import PokemonSprite from './PokemonSprite';
import type { PokedexEntry } from '../lib/types';

interface EvolutionChainProps {
  pokemon: PokedexEntry;
  allPokemon: PokedexEntry[];
  onNavigate: (name: string) => void;
}

interface ChainNode {
  name: string;
  method?: string;
}

function buildChain(pokemon: PokedexEntry, allPokemon: PokedexEntry[]): ChainNode[][] {
  const stages: ChainNode[][] = [];

  // Walk back to the base form
  let base = pokemon;
  const visited = new Set<string>();
  while (base.evolution.evolvesFrom && !visited.has(base.name)) {
    visited.add(base.name);
    const prev = allPokemon.find(p => p.name === base.evolution.evolvesFrom!.from);
    if (!prev) break;
    base = prev;
  }

  // Build forward from base
  const queue: { mon: PokedexEntry; stage: number; method?: string }[] = [
    { mon: base, stage: 0 },
  ];
  const seen = new Set<string>();

  while (queue.length > 0) {
    const { mon, stage, method } = queue.shift()!;
    if (seen.has(mon.name)) continue;
    seen.add(mon.name);

    if (!stages[stage]) stages[stage] = [];
    stages[stage].push({ name: mon.name, method });

    for (const evo of mon.evolution.evolvesTo) {
      const next = allPokemon.find(p => p.name === evo.species);
      if (next) {
        queue.push({ mon: next, stage: stage + 1, method: evo.method });
      }
    }
  }

  return stages;
}

export default function EvolutionChain({ pokemon, allPokemon, onNavigate }: EvolutionChainProps) {
  const stages = buildChain(pokemon, allPokemon);

  if (stages.length <= 1 && stages[0]?.length <= 1) {
    return <p className="evo-none">This Pokemon does not evolve.</p>;
  }

  return (
    <div className="evo-chain">
      {stages.map((stage, i) => (
        <div key={i} className="evo-stage">
          {i > 0 && <span className="evo-arrow">→</span>}
          <div className="evo-stage-mons">
            {stage.map(node => (
              <button
                key={node.name}
                className={`evo-node ${node.name === pokemon.name ? 'evo-current' : ''}`}
                onClick={() => onNavigate(node.name)}
                type="button"
              >
                <PokemonSprite name={node.name} className="evo-sprite" />
                <span className="evo-name">{node.name}</span>
                {node.method && <span className="evo-method">{node.method}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
