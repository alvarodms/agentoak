import { useState } from 'react';
import { pokemonSpriteUrl, pokemonSpriteFallbackUrl } from '../lib/pokemon-dex';

interface PokemonSpriteProps {
  name: string;
  className?: string;
}

export default function PokemonSprite({ name, className = 'pokemon-thumb' }: PokemonSpriteProps) {
  const src = pokemonSpriteUrl(name);
  const fallback = pokemonSpriteFallbackUrl(name);
  const [hidden, setHidden] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  if (!src || hidden) return null;

  return (
    <img
      src={currentSrc!}
      alt={name}
      className={className}
      loading="lazy"
      onError={() => {
        if (fallback && currentSrc !== fallback) {
          setCurrentSrc(fallback);
        } else {
          setHidden(true);
        }
      }}
    />
  );
}
