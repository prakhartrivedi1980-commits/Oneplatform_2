import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Code2, Plus, Search, X } from 'lucide-react';
import { DifficultyTier, PlatformId, SubmissionRecord, Verdict } from '../types/telemetry';
import { DifficultyText, PlatformTag, VerdictLabel } from './PlatformTag';

interface SubmissionsScreenProps {
  submissions: SubmissionRecord[];
  onSelectSubmission: (sub: SubmissionRecord) => void;
  onOpenLogModal: () => void;
}

type PlatformFilter = 'all' | Exclude<PlatformId, 'github'>;
type VerdictFilter = 'all' | Verdict;
type DifficultyFilter = 'all' | DifficultyTier;
type SortKey = 'newest' | 'runtime' | 'difficulty';

const PLATFORM_TABS: { id: PlatformFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'leetcode', label: 'LeetCode' },
  { id: 'codeforces', label: 'Codeforces' },
  { id: 'codechef', label: 'CodeChef' },
  { id: 'gfg', label: 'GFG' },
];

const DIFF_ORDER: Record<DifficultyTier, number> = { Easy: 1, Medium: 2, Hard: 3 };

export const SubmissionsScreen: React.FC<SubmissionsScreenProps> = ({
  submissions,
  onSelectSubmission,
  onOpenLogModal,
}) => {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<PlatformFilter>('all');
  const [verdict, setVerdict] = useState<VerdictFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('newest');

  const topTopics = useMemo(() => {
    const counts = new Map<string, number>();
    submissions.forEach((s) => {
      s.topics.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = submissions.filter((s) => {
      if (platform !== 'all' && s.platform !== platform) return false;
      if (verdict !== 'all' && s.verdict !== verdict) return false;
      if (difficulty !== 'all' && s.difficulty !== difficulty) return false;
      if (selectedTopic && !s.topics.includes(selectedTopic)) return false;
      if (q) {
        const hay = `${s.problemCode} ${s.title} ${s.language} ${s.topics.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'runtime') return a.runtimeMs - b.runtimeMs;
      if (sortBy === 'difficulty') return DIFF_ORDER[b.difficulty] - DIFF_ORDER[a.difficulty];
      return b.submittedAt.localeCompare(a.submittedAt);
    });
  }, [submissions, query, platform, verdict, difficulty, selectedTopic, sortBy]);

  const resetAll = () => {
    setQuery('');
    setPlatform('all');
    setVerdict('all');
    setDifficulty('all');
    setSelectedTopic(null);
  };

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <section className="bg-[#131B2E] border border-white/[0.08] rounded-lg p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          {/* Search cavity */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search problem ID, title, language, or algorithm..."
              className="w-full h-10 pl-9 pr-14 bg-[#0A0D14] border border-white/[0.1] rounded text-sm font-mono text-[#E1E2EC] placeholder:text-[#475569] focus:border-[#06B6D4] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#E1E2EC] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Platform segmented tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#0A0D14] border border-white/[0.08] rounded overflow-x-auto">
              {PLATFORM_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPlatform(tab.id)}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    platform === tab.id
                      ? 'bg-[#1E293B] text-[#4CD7F6] border border-[#06B6D4]/40'
                      : 'text-[#94A3B8] hover:text-[#E1E2EC] border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <select
              value={verdict}
              onChange={(e) => setVerdict(e.target.value as VerdictFilter)}
              aria-label="Filter by verdict"
              className="h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none cursor-pointer"
            >
              <option value="all">All Verdicts</option>
              <option value="Accepted">Accepted</option>
              <option value="TLE">TLE</option>
              <option value="Wrong Answer">Wrong Answer</option>
              <option value="Runtime Error">Runtime Error</option>
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}
              aria-label="Filter by difficulty"
              className="h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none cursor-pointer"
            >
              <option value="all">All Tiers</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <button
              type="button"
              onClick={() =>
                setSortBy((prev) =>
                  prev === 'newest' ? 'runtime' : prev === 'runtime' ? 'difficulty' : 'newest'
                )
              }
              className="h-9 px-3 inline-flex items-center gap-1.5 bg-[#0A0D14] border border-white/[0.1] hover:border-white/[0.25] rounded text-xs font-mono text-[#E1E2EC] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#4CD7F6]" />
              <span>
                Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'runtime' ? 'Runtime' : 'Difficulty'}
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Topic Filter Strip */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06] overflow-x-auto">
          <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] shrink-0 mr-1">
            Topics:
          </span>
          {topTopics.map(([topic, count]) => {
            const active = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(active ? null : topic)}
                className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                  active
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#D0BCFF]'
                    : 'bg-[#0A0D14] border-white/[0.08] text-[#94A3B8] hover:text-[#E1E2EC]'
                }`}
              >
                {topic} · {count}
              </button>
            );
          })}
        </div>
      </section>

      {/* Submissions Data Table */}
      <section className="bg-[#131B2E] border border-white/[0.08] rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#94A3B8] tabular-nums">
            Showing <span className="text-[#F8FAFC] font-semibold">{filtered.length}</span> of{' '}
            {submissions.length} logged submissions
          </div>
          <button
            type="button"
            onClick={onOpenLogModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#06B6D4] hover:bg-[#4CD7F6] text-[#0A0D14] rounded text-xs font-mono font-semibold uppercase tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Submission</span>
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <Code2 className="w-8 h-8 text-[#64748B] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#E1E2EC]">
              No submissions match the active filters
            </p>
            <p className="text-xs font-mono text-[#64748B] mt-1 mb-4">
              Clear your search query or log a new problem execution.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="px-4 py-2 bg-[#1E293B] hover:bg-[#273549] border border-white/[0.12] rounded text-xs font-mono text-[#E1E2EC] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#0F172A]/70 text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B]">
                  <th className="py-2.5 px-5 font-semibold">Problem</th>
                  <th className="py-2.5 px-3 font-semibold">Platform</th>
                  <th className="py-2.5 px-3 font-semibold">Tier</th>
                  <th className="py-2.5 px-3 font-semibold">Verdict</th>
                  <th className="py-2.5 px-3 font-semibold">Topics</th>
                  <th className="py-2.5 px-3 font-semibold">Lang</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Runtime</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Memory</th>
                  <th className="py-2.5 px-5 font-semibold text-right">Complexity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-sm">
                {filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => onSelectSubmission(sub)}
                    className="hover:bg-[#1E293B]/65 transition-colors cursor-pointer h-[44px]"
                  >
                    <td className="py-2 px-5">
                      <div className="flex items-center gap-2.5 min-w-[220px]">
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
                    <td className="py-2 px-3 text-xs font-mono text-[#94A3B8] whitespace-nowrap">
                      {sub.topics.slice(0, 2).join(' · ')}
                    </td>
                    <td className="py-2 px-3 font-mono text-xs text-[#94A3B8] whitespace-nowrap">
                      {sub.language}
                    </td>
                    <td className="py-2 px-3 font-mono text-xs text-[#E1E2EC] text-right tabular-nums whitespace-nowrap">
                      {sub.runtimeMs} ms
                    </td>
                    <td className="py-2 px-3 font-mono text-xs text-[#94A3B8] text-right tabular-nums whitespace-nowrap">
                      {sub.memoryMb.toFixed(1)} MB
                    </td>
                    <td className="py-2 px-5 font-mono text-xs text-[#D0BCFF] text-right whitespace-nowrap">
                      {sub.timeComplexity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
