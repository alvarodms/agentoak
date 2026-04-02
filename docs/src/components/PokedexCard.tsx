import PokemonSprite from './PokemonSprite';
import TypeBadge from './TypeBadge';
import type { PokedexEntry } from '../lib/types';

interface PokedexCardProps {
  pokemon: PokedexEntry;
  onClick: () => void;
}

export default function PokedexCard({ pokemon, onClick }: PokedexCardProps) {
  return (
    <button className="pokedex-card" onClick={onClick} type="button">
      <span className="pokedex-card-id">#{String(pokemon.id).padStart(3, '0')}</span>
      <PokemonSprite name={pokemon.name} className="pokedex-card-sprite" />
      <span className="pokedex-card-name">{pokemon.name}</span>
      <div className="pokedex-card-types">
        {pokemon.types.map(t => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
      <span className="pokedex-card-bst">BST {pokemon.bst}</span>
    </button>
  );
}
