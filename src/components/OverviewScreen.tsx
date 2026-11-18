import React from 'react';
import { ArrowUpRight, Flame, Layers, Target, Trophy } from 'lucide-react';
import {
  ContestItem,
  HeatmapDay,
  PlatformProfile,
  RatingPoint,
  ScreenId,
  SubmissionRecord,
} from '../types/telemetry';
import { ActivityHeatmap } from './ActivityHeatmap';
import { UpcomingContestsPanel } from './ContestCountdown';
import { DifficultyText, PlatformTag, VerdictLabel } from './PlatformTag';
import { RatingChart } from './RatingChart';

interface OverviewScreenProps {
  profiles: PlatformProfile[];
  heatmapDays: HeatmapDay[];
  submissions: SubmissionRecord[];
  contests: ContestItem[];
  ratingHistory: RatingPoint[];
  activeStreak: number;
  bestStreak: number;
  onSelectSubmission: (sub: SubmissionRecord) => void;
  onToggleContestRegister: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

const Sparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const w = 88;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w;
      const y = h - 3 - ((v - min) / range) * (h - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0" aria-hidden="true">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
};

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  profiles,
  heatmapDays,
  submissions,
  contests,
  ratingHistory,
  activeStreak,
  bestStreak,
  onSelectSubmission,
  onToggleContestRegister,
  onNavigate,
}) => {
  const totalSolved = profiles
    .filter((p) => p.platform !== 'github')
    .reduce((sum, p) => sum + p.totalSolved, 0);

  const lcProfile = profiles.find((p) => p.platform === 'leetcode');
  const cfProfile = profiles.find((p) => p.platform === 'codeforces');
  const acceptedCount = submissions.filter((s) => s.verdict === 'Accepted').length;
  const recent30Total = heatmapDays.slice(-30).reduce((acc, d) => acc + d.total, 0);

  const kpis = [
    {
      label: 'Problems Solved',
      value: totalSolved.toLocaleString(),
      sub: `+${acceptedCount} logged this week across 4 judges`,
      delta: '+4.8%',
      deltaColor: 'text-[#10B981]',
      spark: [1290, 1304, 1322, 1341, 1356, 1370, totalSolved],
      sparkColor: '#10B981',
      icon: Layers,
    },
    {
      label: 'Peak Contest Rating',
      value: `${lcProfile?.currentRating ?? 2148}`,
      sub: `Codeforces ${cfProfile?.currentRating ?? 1942} · CM Tier`,
      delta: '+74 pts (90d)',
      deltaColor: 'text-[#F59E0B]',
      spark: [1998, 2040, 2072, 2110, 2184, 2148],
      sparkColor: '#F59E0B',
      icon: Trophy,
    },
    {
      label: 'Active Streak',
      value: `${activeStreak}d`,
      sub: `All-time best ${bestStreak} consecutive days`,
      delta: 'Nominal',
      deltaColor: 'text-[#4CD7F6]',
      spark: [8, 12, 14, 17, 19, 21, activeStreak],
      sparkColor: '#06B6D4',
      icon: Flame,
    },
    {
      label: '30-Day Velocity',
      value: `${recent30Total}`,
      sub: 'Commits and accepted problem runs',
      delta: `${Math.round((recent30Total / 30) * 10) / 10}/day avg`,
      deltaColor: 'text-[#D0BCFF]',
      spark: [3, 5, 4, 7, 6, 8, 5, 9],
      sparkColor: '#8B5CF6',
      icon: Target,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-[#131B2E] border border-white/[0.08] hover:border-[#06B6D4]/40 transition-colors rounded-lg p-4 flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-medium uppercase tracking-[0.08em] text-[#64748B]">
                  {kpi.label}
                </span>
                <Icon className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
              </div>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-3xl font-mono font-bold tracking-tight text-[#F8FAFC] tabular-nums">
                    {kpi.value}
                  </div>
                  <div className={`text-xs font-mono mt-1 tabular-nums ${kpi.deltaColor}`}>
                    {kpi.delta}
                  </div>
                </div>
                <Sparkline values={kpi.spark} color={kpi.sparkColor} />
              </div>

              <p className="text-xs font-mono text-[#94A3B8] pt-2 border-t border-white/[0.06] truncate">
                {kpi.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* 52-Week Activity Matrix */}
      <ActivityHeatmap days={heatmapDays} activeStreak={activeStreak} bestStreak={bestStreak} />

      {/* Dual-Column Analytical Section: Rating Trajectory + Upcoming Contests */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-7">
          <RatingChart history={ratingHistory} />
        </div>
        <div className="xl:col-span-5">
          <UpcomingContestsPanel
            contests={contests}
            onToggleRegister={onToggleContestRegister}
            onViewAll={() => onNavigate('contests')}
          />
        </div>
      </div>

      {/* Recent Submissions Telemetry Table */}
      <section className="bg-[#131B2E] border border-white/[0.08] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
              Recent Submission Diagnostics
            </h2>
            <p className="text-xs font-mono text-[#64748B] mt-0.5">
              Select any row to inspect runtime percentile, complexity bounds, and source code
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('submissions')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#4CD7F6] hover:text-[#ACEDFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>All Submissions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#0F172A]/70 text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B]">
                <th className="py-2.5 px-5 font-semibold">Problem</th>
                <th className="py-2.5 px-3 font-semibold">Platform</th>
                <th className="py-2.5 px-3 font-semibold">Difficulty</th>
                <th className="py-2.5 px-3 font-semibold">Verdict</th>
                <th className="py-2.5 px-3 font-semibold">Language</th>
                <th className="py-2.5 px-3 font-semibold text-right">Runtime</th>
                <th className="py-2.5 px-5 font-semibold text-right">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-sm">
              {submissions.slice(0, 6).map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => onSelectSubmission(sub)}
                  className="hover:bg-[#1E293B]/65 transition-colors cursor-pointer h-[44px]"
                >
                  <td className="py-2 px-5">
                    <div className="flex items-center gap-2.5 min-w-[210px]">
                      <span className="font-mono text-xs text-[#64748B] tabular-nums shrink-0">
                        {sub.problemCode}
                      </span>
                      <span className="font-medium text-[#E1E2EC] truncate">{sub.title}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <PlatformTag platform={sub.platform} />
                  </td>
                  <td className="py-2 px-3">
                    <DifficultyText difficulty={sub.difficulty} rating={sub.rating} />
                  </td>
                  <td className="py-2 px-3">
                    <VerdictLabel verdict={sub.verdict} />
                  </td>
                  <td className="py-2 px-3 font-mono text-xs text-[#94A3B8] whitespace-nowrap">
                    {sub.language}
                  </td>
                  <td className="py-2 px-3 font-mono text-xs text-[#E1E2EC] text-right tabular-nums whitespace-nowrap">
                    {sub.runtimeMs} ms
                  </td>
                  <td className="py-2 px-5 font-mono text-xs text-[#64748B] text-right tabular-nums whitespace-nowrap">
                    {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
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
