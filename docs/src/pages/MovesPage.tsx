import { useState, useEffect, useMemo } from 'react';
import TypeBadge from '../components/TypeBadge';
import type { PokedexData, MoveInfo } from '../lib/types';

type SortKey = 'name' | 'type' | 'power' | 'accuracy' | 'pp' | 'category';
type SortDir = 'asc' | 'desc';

export default function MovesPage() {
  const [data, setData] = useState<PokedexData | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/pokedex.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const allMoves = useMemo(() => {
    if (!data?.moves) return [];
    return Object.entries(data.moves).map(([name, info]) => ({ name, ...info }));
  }, [data]);

  const types = useMemo(() => {
    const set = new Set(allMoves.map(m => m.type));
    return [...set].sort();
  }, [allMoves]);

  const categories = useMemo(() => {
    const set = new Set(allMoves.map(m => m.category));
    return [...set].sort();
  }, [allMoves]);

  const filtered = useMemo(() => {
    let result = allMoves;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(q));
    }
    if (typeFilter) {
      result = result.filter(m => m.type === typeFilter);
    }
    if (categoryFilter) {
      result = result.filter(m => m.category === categoryFilter);
    }
    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'type': cmp = a.type.localeCompare(b.type); break;
        case 'category': cmp = a.category.localeCompare(b.category); break;
        case 'power': cmp = a.power - b.power; break;
        case 'accuracy': cmp = a.accuracy - b.accuracy; break;
        case 'pp': cmp = a.pp - b.pp; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [allMoves, search, typeFilter, categoryFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'type' || key === 'category' ? 'asc' : 'desc');
    }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? ' \u25B2' : ' \u25BC';
  }

  if (!data) {
    return (
      <section className="moves-view">
        <div className="info-card"><p>Loading move data...</p></div>
      </section>
    );
  }

  return (
    <section className="moves-view">
      <div className="moves-toolbar">
        <input
          type="text"
          className="moves-search"
          placeholder="Search moves..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="moves-filter"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          className="moves-filter"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="moves-count">
        Showing {filtered.length} of {allMoves.length} moves
      </div>

      <div className="moves-table-wrap">
        <table className="moves-table">
          <thead>
            <tr>
              <th className={sortKey === 'name' ? 'sorted' : ''} onClick={() => handleSort('name')}>
                Move{sortIndicator('name')}
              </th>
              <th className={sortKey === 'type' ? 'sorted' : ''} onClick={() => handleSort('type')}>
                Type{sortIndicator('type')}
              </th>
              <th className={sortKey === 'category' ? 'sorted' : ''} onClick={() => handleSort('category')}>
                Category{sortIndicator('category')}
              </th>
              <th className={sortKey === 'power' ? 'sorted' : ''} onClick={() => handleSort('power')}>
                Power{sortIndicator('power')}
              </th>
              <th className={sortKey === 'accuracy' ? 'sorted' : ''} onClick={() => handleSort('accuracy')}>
                Accuracy{sortIndicator('accuracy')}
              </th>
              <th className={sortKey === 'pp' ? 'sorted' : ''} onClick={() => handleSort('pp')}>
                PP{sortIndicator('pp')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(move => (
              <tr key={move.name}>
                <td>{move.name}</td>
                <td><TypeBadge type={move.type} /></td>
                <td className="move-category">{move.category}</td>
                <td className="move-power">{move.power || '\u2014'}</td>
                <td className="move-accuracy">{move.accuracy || '\u2014'}</td>
                <td className="move-pp">{move.pp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
