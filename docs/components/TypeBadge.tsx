import { typeClass } from '../lib/type-utils';

interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span className={`type-badge ${typeClass(type)}`}>{type}</span>
  );
}
