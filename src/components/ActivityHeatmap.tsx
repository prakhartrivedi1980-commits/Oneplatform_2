import React, { useMemo, useState } from 'react';
import { PLATFORM_META } from '../data/mockTelemetry';
import { HeatmapDay, PlatformId } from '../types/telemetry';

interface ActivityHeatmapProps {
  days: HeatmapDay[];
  activeStreak: number;
  bestStreak: number;
}

type FilterPlatform = 'all' | PlatformId;

const FILTER_OPTIONS: { id: FilterPlatform; label: string }[] = [
  { id: 'all', label: 'All Platforms' },
  { id: 'leetcode', label: 'LeetCode' },
  { id: 'codeforces', label: 'Codeforces' },
  { id: 'github', label: 'GitHub' },
  { id: 'codechef', label: 'CodeChef' },
  { id: 'gfg', label: 'GFG' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
}

const CELL_STYLES: Record<0 | 1 | 2 | 3 | 4, React.CSSProperties> = {
  0: { backgroundColor: '#0B0E15', border: '1px solid rgba(255, 255, 255, 0.04)' },
  1: { backgroundColor: 'rgba(16, 185, 129, 0.22)' },
  2: { backgroundColor: 'rgba(16, 185, 129, 0.45)' },
  3: { backgroundColor: 'rgba(16, 185, 129, 0.72)' },
  4: { backgroundColor: '#10B981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.45)' },
};

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  days,
  activeStreak,
  bestStreak,
}) => {
  const [filter, setFilter] = useState<FilterPlatform>('all');
  const [hovered, setHovered] = useState<{ day: HeatmapDay; x: number; y: number } | null>(null);

  const weeks = useMemo(() => {
    const cols: HeatmapDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }
    return cols;
  }, [days]);

  const monthHeaders = useMemo(() => {
    const labels: { colIndex: number; text: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, colIndex) => {
      const firstDay = week[0];
      if (!firstDay) return;
      const monthIdx = new Date(firstDay.date + 'T00:00:00Z').getUTCMonth();
      if (monthIdx !== lastMonth) {
        labels.push({ colIndex, text: MONTHS[monthIdx] });
        lastMonth = monthIdx;
      }
    });
    return labels;
  }, [weeks]);

  const totalOperations = useMemo(() => {
    return days.reduce((acc, d) => {
      return acc + (filter === 'all' ? d.total : d.byPlatform[filter]);
    }, 0);
  }, [days, filter]);

  const activeDaysCount = useMemo(() => {
    return days.filter((d) => (filter === 'all' ? d.total : d.byPlatform[filter]) > 0).length;
  }, [days, filter]);

  return (
    <section className="relative bg-[#131B2E] border border-white/[0.08] rounded-lg p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
              Execution Activity Matrix
            </h2>
            <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
              {totalOperations.toLocaleString()} events · {activeDaysCount} active days
            </span>
          </div>
          <p className="text-xs font-mono text-[#64748B] mt-1 tabular-nums">
            Current streak {activeStreak}d · Best streak {bestStreak}d · 52-week rolling window
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#0A0D14] border border-white/[0.08] rounded overflow-x-auto">
          {FILTER_OPTIONS.map((opt) => {
            const active = filter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilter(opt.id)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#1E293B] text-[#4CD7F6] border border-[#06B6D4]/40'
                    : 'text-[#94A3B8] hover:text-[#E1E2EC] border border-transparent'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div className="min-w-[780px]">
          {/* Month markers */}
          <div className="relative h-5 ml-9 mb-1 text-[11px] font-mono text-[#64748B]">
            {monthHeaders.map((m) => (
              <span
                key={`${m.text}-${m.colIndex}`}
                className="absolute top-0 whitespace-nowrap"
                style={{ left: `${m.colIndex * 15}px` }}
              >
                {m.text}
              </span>
            ))}
          </div>

          <div className="flex items-start gap-2">
            {/* Weekday labels */}
            <div className="grid grid-rows-7 gap-[3px] w-7 text-[10px] font-mono text-[#64748B] leading-none pt-[2px]">
              <span className="h-[12px] flex items-center"></span>
              <span className="h-[12px] flex items-center">Mon</span>
              <span className="h-[12px] flex items-center"></span>
              <span className="h-[12px] flex items-center">Wed</span>
              <span className="h-[12px] flex items-center"></span>
              <span className="h-[12px] flex items-center">Fri</span>
              <span className="h-[12px] flex items-center"></span>
            </div>

            {/* 52-week heatmap grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                  {week.map((day) => {
                    const count = filter === 'all' ? day.total : day.byPlatform[filter];
                    const level = getIntensityLevel(count);
                    return (
                      <button
                        key={day.date}
                        type="button"
                        aria-label={`${day.date}: ${count} operations`}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHovered({
                            day,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onFocus={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHovered({
                            day,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHovered(null)}
                        onBlur={() => setHovered(null)}
                        style={CELL_STYLES[level]}
                        className="w-[12px] h-[12px] rounded-[2px] transition-transform duration-100 hover:scale-125 focus:outline-none focus:ring-1 focus:ring-[#06B6D4]"
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend + Live inspected day readout */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono">
        <div className="text-[#94A3B8] tabular-nums min-h-[18px]">
          {hovered ? (
            <span>
              <span className="text-[#F8FAFC] font-medium">{hovered.day.date}</span>
              {' · '}
              <span className="text-[#10B981]">{hovered.day.total} total</span>
              {' — '}
              {(Object.keys(hovered.day.byPlatform) as PlatformId[])
                .filter((p) => hovered.day.byPlatform[p] > 0)
                .map((p) => `${PLATFORM_META[p].short}: ${hovered.day.byPlatform[p]}`)
                .join(' · ') || 'No submissions'}
            </span>
          ) : (
            <span className="text-[#64748B]">Hover any cell to inspect daily platform breakdown</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#64748B] shrink-0">
          <span>Less</span>
          <div className="flex items-center gap-[3px]">
            {([0, 1, 2, 3, 4] as const).map((lvl) => (
              <span
                key={lvl}
                style={CELL_STYLES[lvl]}
                className="inline-block w-[11px] h-[11px] rounded-[2px]"
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </section>
  );
};
