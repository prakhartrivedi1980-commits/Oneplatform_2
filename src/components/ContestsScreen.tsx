import React, { useEffect, useMemo, useState } from 'react';
import { Bell, BellOff, Calculator, Clock } from 'lucide-react';
import { ContestItem, RatingPoint } from '../types/telemetry';
import { formatCountdown } from './ContestCountdown';
import { PlatformTag } from './PlatformTag';
import { RatingChart } from './RatingChart';

interface ContestsScreenProps {
  contests: ContestItem[];
  ratingHistory: RatingPoint[];
  onToggleRegister: (id: string) => void;
}

export const ContestsScreen: React.FC<ContestsScreenProps> = ({
  contests,
  ratingHistory,
  onToggleRegister,
}) => {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [simPlatform, setSimPlatform] = useState<'codeforces' | 'leetcode' | 'codechef'>('codeforces');
  const [simRank, setSimRank] = useState<number>(650);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'codeforces' | 'leetcode' | 'codechef'>('all');

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const currentRatingMap = useMemo(() => {
    const map: Record<'codeforces' | 'leetcode' | 'codechef', number> = {
      codeforces: 1942,
      leetcode: 2148,
      codechef: 2036,
    };
    (['codeforces', 'leetcode', 'codechef'] as const).forEach((p) => {
      const pts = ratingHistory.filter((r) => r.platform === p);
      if (pts.length) map[p] = pts[pts.length - 1].rating;
    });
    return map;
  }, [ratingHistory]);

  // Deterministic Elo-style projection based on target rank & platform pool
  const simulation = useMemo(() => {
    const poolSize = simPlatform === 'leetcode' ? 32000 : simPlatform === 'codeforces' ? 21000 : 11500;
    const base = currentRatingMap[simPlatform];
    const percentile = 1 - Math.min(0.99, Math.max(0.001, simRank / poolSize));
    const perfRating = Math.round(1350 + percentile * 1150);
    const delta = Math.round((perfRating - base) * 0.28);
    const projected = base + delta;
    const nextMilestone =
      simPlatform === 'codeforces'
        ? base < 2100
          ? { label: 'Master', target: 2100 }
          : { label: 'International Master', target: 2300 }
        : simPlatform === 'leetcode'
        ? { label: 'Top 1% Guardian', target: 2300 }
        : { label: '6 Star', target: 2200 };
    return { base, perfRating, delta, projected, nextMilestone };
  }, [simPlatform, simRank, currentRatingMap]);

  const sortedHistory = useMemo(() => {
    return ratingHistory
      .filter((r) => historyFilter === 'all' || r.platform === historyFilter)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [ratingHistory, historyFilter]);

  return (
    <div className="space-y-6">
      {/* Live & Upcoming Contest Grid */}
      <section className="bg-[#131B2E] border border-white/[0.08] rounded-lg p-5">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
              Competitive Contest Schedule
            </h2>
            <p className="text-xs font-mono text-[#64748B] mt-0.5">
              Synchronized countdown clocks across Codeforces, LeetCode, and CodeChef
            </p>
          </div>
          <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
            {contests.filter((c) => c.registered).length} reminders active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {contests.map((c) => {
            const cd = formatCountdown(c.startTimeIso, nowMs);
            return (
              <div
                key={c.id}
                className="bg-[#0F172A] border border-white/[0.08] hover:border-[#06B6D4]/40 transition-colors rounded-lg p-4 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <PlatformTag platform={c.platform} />
                    <span className="text-[11px] font-mono text-[#64748B] tabular-nums">
                      {c.durationMinutes} min
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#F8FAFC] leading-snug">{c.name}</h3>
                  <p className="text-xs font-mono text-[#94A3B8] mt-1">{c.division}</p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <div
                    className={`inline-flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums ${
                      cd.isImminent ? 'text-[#F59E0B]' : 'text-[#4CD7F6]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{cd.label}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleRegister(c.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      c.registered
                        ? 'bg-[#06B6D4]/15 text-[#4CD7F6] border border-[#06B6D4]/40'
                        : 'bg-[#131B2E] text-[#E1E2EC] border border-white/[0.12] hover:border-white/[0.25]'
                    }`}
                  >
                    {c.registered ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    <span>{c.registered ? 'Registered' : 'Remind Me'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rating Trajectory + Delta Simulator */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-8">
          <RatingChart history={ratingHistory} />
        </div>

        <section className="xl:col-span-4 bg-[#131B2E] border border-white/[0.08] rounded-lg p-5 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <Calculator className="w-4 h-4 text-[#D0BCFF]" />
              <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
                Rating Delta Simulator
              </h2>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-2">
                  Target Judge
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0A0D14] border border-white/[0.08] rounded">
                  {(['codeforces', 'leetcode', 'codechef'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSimPlatform(p)}
                      className={`py-1.5 text-xs font-mono rounded capitalize transition-colors cursor-pointer ${
                        simPlatform === p
                          ? 'bg-[#1E293B] text-[#4CD7F6] border border-[#06B6D4]/40'
                          : 'text-[#94A3B8] hover:text-[#E1E2EC] border border-transparent'
                      }`}
                    >
                      {p === 'codeforces' ? 'CF' : p === 'leetcode' ? 'LC' : 'CC'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-[#64748B] uppercase tracking-[0.06em] text-[11px]">
                    Projected Rank
                  </span>
                  <span className="text-[#F8FAFC] font-bold tabular-nums">#{simRank}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={4500}
                  step={50}
                  value={simRank}
                  onChange={(e) => setSimRank(Number(e.target.value))}
                  className="w-full accent-[#06B6D4] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#64748B] mt-1">
                  <span>#50 (Top 0.2%)</span>
                  <span>#2,250</span>
                  <span>#4,500</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0D14] border border-white/[0.08] rounded-lg p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Current Rating</span>
              <span className="text-[#E1E2EC] tabular-nums">{simulation.base}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Contest Performance</span>
              <span className="text-[#D0BCFF] tabular-nums">{simulation.perfRating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Expected Delta</span>
              <span
                className={`font-semibold tabular-nums ${
                  simulation.delta >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}
              >
                {simulation.delta >= 0 ? `+${simulation.delta}` : simulation.delta}
              </span>
            </div>
            <div className="pt-2.5 border-t border-white/[0.06] flex justify-between items-baseline">
              <span className="text-[#94A3B8]">Projected New Rating</span>
              <span className="text-lg font-bold text-[#4CD7F6] tabular-nums">
                {simulation.projected}
              </span>
            </div>
            <div className="text-[11px] text-[#64748B] tabular-nums">
              {simulation.nextMilestone.target - simulation.projected > 0
                ? `${simulation.nextMilestone.target - simulation.projected} pts to ${simulation.nextMilestone.label}`
                : `Clears ${simulation.nextMilestone.label} threshold (${simulation.nextMilestone.target})`}
            </div>
          </div>
        </section>
      </div>

      {/* Full Contest Rating History Table */}
      <section className="bg-[#131B2E] border border-white/[0.08] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
              Rated Contest Ledger
            </h2>
            <p className="text-xs font-mono text-[#64748B] mt-0.5">
              Verified standings and Elo adjustments across rated rounds
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-[#0A0D14] border border-white/[0.08] rounded self-start sm:self-auto">
            {(['all', 'leetcode', 'codeforces', 'codechef'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setHistoryFilter(p)}
                className={`px-2.5 py-1 text-xs font-mono rounded capitalize transition-colors cursor-pointer ${
                  historyFilter === p
                    ? 'bg-[#1E293B] text-[#4CD7F6] border border-[#06B6D4]/40'
                    : 'text-[#94A3B8] hover:text-[#E1E2EC] border border-transparent'
                }`}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#0F172A]/70 text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B]">
                <th className="py-2.5 px-5 font-semibold">Contest</th>
                <th className="py-2.5 px-3 font-semibold">Platform</th>
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold text-right">Rank</th>
                <th className="py-2.5 px-3 font-semibold text-right">Solved</th>
                <th className="py-2.5 px-3 font-semibold text-right">Delta</th>
                <th className="py-2.5 px-5 font-semibold text-right">New Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-sm">
              {sortedHistory.map((row) => (
                <tr key={row.id} className="hover:bg-[#1E293B]/50 transition-colors h-[42px]">
                  <td className="py-2 px-5 font-medium text-[#E1E2EC] whitespace-nowrap">
                    {row.contestName}
                  </td>
                  <td className="py-2 px-3">
                    <PlatformTag platform={row.platform} />
                  </td>
                  <td className="py-2 px-3 font-mono text-xs text-[#94A3B8] tabular-nums whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-2 px-3 font-mono text-xs text-[#E1E2EC] text-right tabular-nums whitespace-nowrap">
                    #{row.rank.toLocaleString()} / {row.participants.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 font-mono text-xs text-[#94A3B8] text-right tabular-nums whitespace-nowrap">
                    {row.solvedCount} / {row.totalProblems}
                  </td>
                  <td
                    className={`py-2 px-3 font-mono text-xs font-semibold text-right tabular-nums whitespace-nowrap ${
                      row.delta > 0
                        ? 'text-[#10B981]'
                        : row.delta < 0
                        ? 'text-[#EF4444]'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {row.delta > 0 ? `+${row.delta}` : row.delta}
                  </td>
                  <td className="py-2 px-5 font-mono text-sm font-bold text-[#F8FAFC] text-right tabular-nums whitespace-nowrap">
                    {row.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
