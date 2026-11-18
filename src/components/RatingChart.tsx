import React, { useMemo, useState } from 'react';
import { PLATFORM_META } from '../data/mockTelemetry';
import { RatingPoint } from '../types/telemetry';

interface RatingChartProps {
  history: RatingPoint[];
}

type Timeframe = '3M' | '6M' | '1Y' | 'ALL';
type SeriesKey = 'codeforces' | 'leetcode' | 'codechef';

const SERIES_ORDER: SeriesKey[] = ['leetcode', 'codeforces', 'codechef'];

export const RatingChart: React.FC<RatingChartProps> = ({ history }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');
  const [enabledSeries, setEnabledSeries] = useState<Record<SeriesKey, boolean>>({
    leetcode: true,
    codeforces: true,
    codechef: true,
  });
  const [hoveredPoint, setHoveredPoint] = useState<RatingPoint | null>(null);

  const filtered = useMemo(() => {
    const anchor = new Date('2026-11-18T00:00:00Z').getTime();
    const daysMap: Record<Timeframe, number> = {
      '3M': 92,
      '6M': 185,
      '1Y': 365,
      ALL: 3650,
    };
    const cutoff = anchor - daysMap[timeframe] * 86400 * 1000;
    return history
      .filter((pt) => new Date(pt.date + 'T00:00:00Z').getTime() >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [history, timeframe]);

  const width = 680;
  const height = 250;
  const pad = { top: 20, right: 20, bottom: 32, left: 48 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const { minTime, maxTime, minRating, maxRating, yTicks } = useMemo(() => {
    const activePts = filtered.filter((p) => enabledSeries[p.platform]);
    const list = activePts.length > 0 ? activePts : filtered;
    const times = list.map((p) => new Date(p.date + 'T00:00:00Z').getTime());
    const ratings = list.map((p) => p.rating);
    const minT = times.length ? Math.min(...times) : 0;
    const maxT = times.length ? Math.max(...times) : 1;
    const rawMinR = ratings.length ? Math.min(...ratings) : 1600;
    const rawMaxR = ratings.length ? Math.max(...ratings) : 2200;
    const minR = Math.floor((rawMinR - 60) / 100) * 100;
    const maxR = Math.ceil((rawMaxR + 60) / 100) * 100;
    const ticks: number[] = [];
    const step = Math.max(100, Math.round((maxR - minR) / 4 / 50) * 50);
    for (let v = minR; v <= maxR; v += step) ticks.push(v);
    return {
      minTime: minT,
      maxTime: maxT === minT ? minT + 86400000 : maxT,
      minRating: minR,
      maxRating: maxR === minR ? minR + 200 : maxR,
      yTicks: ticks,
    };
  }, [filtered, enabledSeries]);

  const toX = (dateStr: string) => {
    const t = new Date(dateStr + 'T00:00:00Z').getTime();
    return pad.left + ((t - minTime) / (maxTime - minTime)) * plotW;
  };

  const toY = (rating: number) => {
    return pad.top + (1 - (rating - minRating) / (maxRating - minRating)) * plotH;
  };

  const toggleSeries = (key: SeriesKey) => {
    setEnabledSeries((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.leetcode && !next.codeforces && !next.codechef) return prev;
      return next;
    });
  };

  return (
    <section className="bg-[#131B2E] border border-white/[0.08] rounded-lg p-5 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
            Multi-Platform Rating Trajectory
          </h2>
          <p className="text-xs font-mono text-[#64748B] mt-0.5 tabular-nums">
            {hoveredPoint
              ? `${hoveredPoint.contestName} · ${hoveredPoint.date} · Rank #${hoveredPoint.rank} (${hoveredPoint.delta >= 0 ? '+' : ''}${hoveredPoint.delta})`
              : 'Hover any contest node to inspect rank and rating delta'}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#0A0D14] border border-white/[0.08] rounded self-start sm:self-auto">
          {(['3M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-[#1E293B] text-[#4CD7F6] border border-[#06B6D4]/40'
                  : 'text-[#94A3B8] hover:text-[#E1E2EC] border border-transparent'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Series toggles */}
      <div className="flex items-center gap-3 flex-wrap mt-3 mb-2">
        {SERIES_ORDER.map((key) => {
          const meta = PLATFORM_META[key];
          const active = enabledSeries[key];
          const latest = [...filtered].reverse().find((p) => p.platform === key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleSeries(key)}
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono transition-opacity cursor-pointer border ${
                active
                  ? 'border-white/[0.12] bg-[#0F172A] text-[#E1E2EC]'
                  : 'border-white/[0.05] bg-transparent text-[#64748B] opacity-55'
              }`}
            >
              <span
                className="w-2.5 h-0.5 rounded-sm"
                style={{ backgroundColor: meta.color }}
              />
              <span>{meta.label}</span>
              {latest && (
                <span className="tabular-nums font-semibold" style={{ color: meta.color }}>
                  {latest.rating}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SVG Chart */}
      <div className="relative w-full flex-1 min-h-[230px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Multi-platform competitive rating progression chart"
        >
          {/* Horizontal Gridlines */}
          {yTicks.map((tick) => {
            const y = toY(tick);
            return (
              <g key={tick}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                />
                <text
                  x={pad.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#64748B] text-[10px] font-mono tabular-nums"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Hover vertical guideline */}
          {hoveredPoint && (
            <line
              x1={toX(hoveredPoint.date)}
              x2={toX(hoveredPoint.date)}
              y1={pad.top}
              y2={height - pad.bottom}
              stroke="rgba(6, 182, 212, 0.35)"
              strokeDasharray="2 2"
            />
          )}

          {/* Lines & Nodes per platform */}
          {SERIES_ORDER.map((platform) => {
            if (!enabledSeries[platform]) return null;
            const pts = filtered.filter((p) => p.platform === platform);
            if (pts.length === 0) return null;
            const color = PLATFORM_META[platform].color;
            const d = pts
              .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(p.date).toFixed(1)} ${toY(p.rating).toFixed(1)}`)
              .join(' ');

            return (
              <g key={platform}>
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {pts.map((pt) => {
                  const cx = toX(pt.date);
                  const cy = toY(pt.rating);
                  const isHovered = hoveredPoint?.id === pt.id;
                  return (
                    <g key={pt.id}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 5.5 : 3.5}
                        fill="#0A0D14"
                        stroke={color}
                        strokeWidth={2}
                      />
                      {/* Larger invisible hit area for effortless inspection */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* X-axis start/mid/end dates */}
          {filtered.length > 1 && (
            <>
              <text
                x={pad.left}
                y={height - 8}
                textAnchor="start"
                className="fill-[#64748B] text-[10px] font-mono tabular-nums"
              >
                {filtered[0].date}
              </text>
              <text
                x={pad.left + plotW / 2}
                y={height - 8}
                textAnchor="middle"
                className="fill-[#64748B] text-[10px] font-mono tabular-nums"
              >
                {filtered[Math.floor(filtered.length / 2)].date}
              </text>
              <text
                x={width - pad.right}
                y={height - 8}
                textAnchor="end"
                className="fill-[#64748B] text-[10px] font-mono tabular-nums"
              >
                {filtered[filtered.length - 1].date}
              </text>
            </>
          )}
        </svg>
      </div>
    </section>
  );
};
