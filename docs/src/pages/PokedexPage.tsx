import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PokedexCard from '../components/PokedexCard';
import PokemonSprite from '../components/PokemonSprite';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import EvolutionChain from '../components/EvolutionChain';
import LearnsetTable from '../components/LearnsetTable';
import PokeballSpinner from '../components/PokeballSpinner';
import { rarityLabel } from '../lib/type-utils';
import type { PokedexData, PokedexEntry } from '../lib/types';

const ALL_TYPES = [
  'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel',
];

type SortKey = 'id' | 'name' | 'bst';

export default function PokedexPage() {
  const { name } = useParams<{ name?: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PokedexData | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('id');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/pokedex.json`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.pokemon;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        String(p.id).includes(q)
      );
    }

    if (typeFilter) {
      list = list.filter(p => p.types.includes(typeFilter));
    }

    if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'bst') {
      list = [...list].sort((a, b) => b.bst - a.bst);
    }
    // default sort by id is already the natural order

    return list;
  }, [data, search, typeFilter, sort]);

  if (!data) {
    return (
      <div className="page-loading">
        <PokeballSpinner />
        <p>Loading Pokedex data...</p>
      </div>
    );
  }

  // Detail view
  if (name) {
    const pokemon = data.pokemon.find(
      p => p.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase()
    );

    if (!pokemon) {
      return (
        <div className="pokedex-not-found">
          <h2>Pokemon not found</h2>
          <button onClick={() => navigate('/pokedex')} type="button" className="back-btn">
            Back to Pokedex
          </button>
        </div>
      );
    }

    return (
      <div className="pokedex-detail">
        <button onClick={() => navigate('/pokedex')} type="button" className="back-btn">
          &larr; Back to Pokedex
        </button>

        {/* Header */}
        <div className="pokedex-detail-header">
          <PokemonSprite name={pokemon.name} className="pokedex-detail-sprite" />
          <div className="pokedex-detail-info">
            <span className="pokedex-detail-id">#{String(pokemon.id).padStart(3, '0')}</span>
            <h2 className="pokedex-detail-name">{pokemon.name}</h2>
            <p className="pokedex-detail-category">The {pokemon.category} Pokemon</p>
            <div className="pokedex-detail-types">
              {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
            </div>
            {pokemon.description && (
              <p className="pokedex-detail-desc">{pokemon.description}</p>
            )}
          </div>
        </div>

        {/* Stats + Info panels side by side */}
        <div className="pokedex-panels">
          {/* Base Stats */}
          <div className="pokedex-panel">
            <h3>Base Stats</h3>
            <StatBar label="HP" value={pokemon.stats.hp} />
            <StatBar label="Atk" value={pokemon.stats.atk} />
            <StatBar label="Def" value={pokemon.stats.def} />
            <StatBar label="SpA" value={pokemon.stats.spa} />
            <StatBar label="SpD" value={pokemon.stats.spd} />
            <StatBar label="Spe" value={pokemon.stats.spe} />
            <div className="stat-bar-row stat-total">
              <span className="stat-label">Total</span>
              <span className="stat-value">{pokemon.bst}</span>
            </div>
          </div>

          {/* Info */}
          <div className="pokedex-panel">
            <h3>Details</h3>
            <table className="info-table">
              <tbody>
                <tr><td>Height</td><td>{pokemon.height} m</td></tr>
                <tr><td>Weight</td><td>{pokemon.weight} kg</td></tr>
                <tr><td>Abilities</td><td>{pokemon.abilities.join(', ') || '—'}</td></tr>
                <tr><td>Catch Rate</td><td>{pokemon.catchRate}</td></tr>
                <tr><td>Gender</td><td>{pokemon.genderRatio}</td></tr>
                <tr><td>Egg Groups</td><td>{pokemon.eggGroups.join(', ')}</td></tr>
                <tr><td>Growth Rate</td><td>{pokemon.growthRate}</td></tr>
                <tr>
                  <td>EV Yield</td>
                  <td>
                    {Object.entries(pokemon.evYield)
                      .filter(([, v]) => v > 0)
                      .map(([k, v]) => `${v} ${k.toUpperCase()}`)
                      .join(', ') || 'None'}
                  </td>
                </tr>
                {(pokemon.heldItems.common || pokemon.heldItems.rare) && (
                  <tr>
                    <td>Held Items</td>
                    <td>
                      {[pokemon.heldItems.common, pokemon.heldItems.rare]
                        .filter(Boolean)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .join(', ')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evolution */}
        <div className="pokedex-section">
          <h3>Evolution</h3>
          <EvolutionChain
            pokemon={pokemon}
            allPokemon={data.pokemon}
            onNavigate={n => navigate(`/pokedex/${n.toLowerCase().replace(/\s+/g, '-')}`)}
          />
        </div>

        {/* Learnset */}
        <div className="pokedex-section">
          <h3>Learnset</h3>
          <LearnsetTable pokemon={pokemon} moves={data.moves} />
        </div>

        {/* Locations */}
        {pokemon.locations.length > 0 && (
          <div className="pokedex-section">
            <h3>Locations</h3>
            <table className="learnset-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Method</th>
                  <th>Levels</th>
                  <th>Rate</th>
                  <th>Rarity</th>
                </tr>
              </thead>
              <tbody>
                {pokemon.locations.map((loc, i) => (
                  <tr key={i}>
                    <td>{loc.map}</td>
                    <td>{loc.method}</td>
                    <td>{loc.minLevel === loc.maxLevel ? `Lv ${loc.minLevel}` : `Lv ${loc.minLevel}–${loc.maxLevel}`}</td>
                    <td>{loc.rate}%</td>
                    <td><span className={`rarity-tag rarity-${rarityLabel(loc.rate).toLowerCase().replace('-', '')}`}>{rarityLabel(loc.rate)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="pokedex-list-page">
      <div className="pokedex-header">
        <h2>Pokedex</h2>
        <span className="pokedex-count">{filtered.length} / {data.pokemon.length} Pokemon</span>
      </div>

      <div className="pokedex-controls">
        <input
          type="text"
          className="pokedex-search"
          placeholder="Search by name or number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="pokedex-filters">
          <select
            className="pokedex-type-filter"
            value={typeFilter || ''}
            onChange={e => setTypeFilter(e.target.value || null)}
          >
            <option value="">All Types</option>
            {ALL_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="pokedex-sort"
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
          >
            <option value="id">Sort by #</option>
            <option value="name">Sort by Name</option>
            <option value="bst">Sort by BST</option>
          </select>
        </div>
      </div>

      <div className="pokedex-grid">
        {filtered.map(p => (
          <PokedexCard
            key={p.id}
            pokemon={p}
            onClick={() => navigate(`/pokedex/${p.name.toLowerCase().replace(/\s+/g, '-')}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="pokedex-empty">No Pokemon match your search.</p>
      )}
    </div>
  );
}
