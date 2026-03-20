import fs from 'fs';
import path from 'path';
import type { GetStaticProps } from 'next';
import KanbanBoard from '../components/KanbanBoard';
import type { StrategyData } from '../lib/types';

interface RoadmapPageProps {
  data: StrategyData | null;
}

export const getStaticProps: GetStaticProps<RoadmapPageProps> = async () => {
  const filePath = path.join(process.cwd(), 'data', 'strategy.json');
  let data: StrategyData | null = null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(raw);
  } catch {
    // data file may not exist
  }
  return { props: { data } };
};

export default function RoadmapPage({ data }: RoadmapPageProps) {
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
