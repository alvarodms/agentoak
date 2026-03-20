import type { RoadmapCompletedEntry, RoadmapUpcomingEntry } from '../lib/types';

type KanbanItem = RoadmapCompletedEntry | RoadmapUpcomingEntry;

interface KanbanColumnProps {
  colClass: string;
  title: string;
  items: KanbanItem[];
  type: 'completed' | 'issues' | 'upcoming';
}

function KanbanColumn({ colClass, title, items, type }: KanbanColumnProps) {
  return (
    <div className={`kanban-column ${colClass}`}>
      <div className="kanban-column-header">
        <span className="kanban-column-title">{title}</span>
        <span className="kanban-column-count">{items.length}</span>
      </div>
      <div className="kanban-cards">
        {items.length === 0 ? (
          <div style={{
            padding: '16px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}>
            No items
          </div>
        ) : (
          items.map((item, i) => {
            const isCompletedType = type === 'completed' || type === 'issues';
            const completedItem = item as RoadmapCompletedEntry;
            const upcomingItem = item as RoadmapUpcomingEntry;
            const text = (completedItem.description || upcomingItem.objective || '').replace(/\*\*/g, '');

            return (
              <div key={i} className="kanban-card">
                <div className="kanban-card-meta">
                  <span className="kanban-cycle-badge">
                    CYCLE {String(item.cycle).padStart(2, '0')}
                  </span>
                  {isCompletedType ? (
                    <span className={`kanban-status-badge kanban-status-${completedItem.status || 'completed'}`}>
                      {{ completed: '\u2713 Done', failed: '\u2717 Failed', partial: '\u26A0 Partial' }[completedItem.status] || completedItem.status}
                    </span>
                  ) : (
                    <span className={`kanban-status-badge kanban-status-${upcomingItem.priority === 'HIGH' ? 'high' : 'low'}`}>
                      {upcomingItem.priority || 'LOW'}
                    </span>
                  )}
                </div>
                <div className="kanban-card-desc">{text}</div>
                {type === 'upcoming' && upcomingItem.complexity && (
                  <span className="kanban-complexity">{upcomingItem.complexity}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  completed: RoadmapCompletedEntry[];
  upcoming: RoadmapUpcomingEntry[];
}

export default function KanbanBoard({ completed, upcoming }: KanbanBoardProps) {
  // De-duplicate upcoming
  const seenUpcoming = new Set<string>();
  const highPriority: RoadmapUpcomingEntry[] = [];
  const lowPriority: RoadmapUpcomingEntry[] = [];
  upcoming.forEach(entry => {
    const key = entry.cycle + '|' + entry.objective;
    if (seenUpcoming.has(key)) return;
    seenUpcoming.add(key);
    if (entry.priority === 'HIGH') {
      highPriority.push(entry);
    } else {
      lowPriority.push(entry);
    }
  });

  highPriority.sort((a, b) => a.cycle - b.cycle);
  lowPriority.sort((a, b) => a.cycle - b.cycle);

  const doneItems = completed.filter(c => c.status === 'completed').reverse();
  const issueItems = completed.filter(c => c.status !== 'completed').reverse();

  return (
    <div className="kanban-board">
      <KanbanColumn colClass="col-done" title={'\u2705 Completed'} items={doneItems} type="completed" />
      <KanbanColumn colClass="col-issues" title={'\u26A0\uFE0F Issues'} items={issueItems} type="issues" />
      <KanbanColumn colClass="col-high" title={'\uD83D\uDD25 Up Next'} items={highPriority} type="upcoming" />
      <KanbanColumn colClass="col-planned" title={'\uD83D\uDCCB Planned'} items={lowPriority} type="upcoming" />
    </div>
  );
}
