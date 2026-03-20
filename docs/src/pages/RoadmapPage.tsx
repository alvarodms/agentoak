import { useState, useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import type { StrategyData } from '../lib/types';

export default function RoadmapPage() {
  const [data, setData] = useState<StrategyData | null>(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/strategy.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data?.roadmap) {
    return (
      <section className="roadmap-view active">
        <div className="roadmap-loading"><p>No roadmap data available.</p></div>
      </section>
    );
  }

  return (
    <section className="roadmap-view active">
      <div className="roadmap-header">
        <h2>{'\uD83D\uDDFA\uFE0F'} Implementation Roadmap</h2>
        <p>Development progress across all cycles &mdash; from completed work to planned objectives.</p>
      </div>
      <KanbanBoard
        completed={data.roadmap.completed || []}
        upcoming={data.roadmap.upcoming || []}
      />
    </section>
  );
}
