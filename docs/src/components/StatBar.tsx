interface StatBarProps {
  label: string;
  value: number;
  max?: number;
}

const STAT_COLORS: Record<string, string> = {
  HP: '#ff5252',
  Atk: '#f08030',
  Def: '#f8d030',
  SpA: '#6890f0',
  SpD: '#78c850',
  Spe: '#f85888',
};

export default function StatBar({ label, value, max = 255 }: StatBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const color = STAT_COLORS[label] || '#4fc3f7';

  return (
    <div className="stat-bar-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
