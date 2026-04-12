import { useState } from 'react';

interface PokemonSpriteProps {
  spriteKey: string;
  alt: string;
  className?: string;
}

export default function PokemonSprite({ spriteKey, alt, className = 'pokemon-thumb' }: PokemonSpriteProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <img
      src={`${import.meta.env.BASE_URL}sprites/${spriteKey}.png`}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHidden(true)}
    />
  );
}
