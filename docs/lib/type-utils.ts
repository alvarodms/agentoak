export function typeClass(type: string): string {
  return 'type-' + (type || '').toLowerCase().replace(/[^a-z]/g, '');
}

export function rarityClass(rate: number): string {
  if (rate >= 20) return 'common';
  if (rate >= 10) return 'uncommon';
  if (rate >= 4) return 'rare';
  return 'ultrarare';
}

export function rarityLabel(rate: number): string {
  if (rate >= 20) return 'Common';
  if (rate >= 10) return 'Uncommon';
  if (rate >= 4) return 'Rare';
  return 'Ultra-Rare';
}

export const TYPE_EMOJIS: Record<string, string> = {
  Rock: '\uD83E\uDEA8',
  Dragon: '\uD83D\uDC09',
  Steel: '\u2699\uFE0F',
  Fire: '\uD83D\uDD25',
  Water: '\uD83D\uDCA7',
  Grass: '\uD83C\uDF3F',
  Normal: '\u2B50',
  Psychic: '\uD83D\uDD2E',
  Ground: '\uD83C\uDFDC\uFE0F',
  Ice: '\u2744\uFE0F',
  Electric: '\u26A1',
};
