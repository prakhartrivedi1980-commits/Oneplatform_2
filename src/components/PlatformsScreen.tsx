import React, { useState } from 'react';
import { Check, Edit3, GitCommit, RefreshCw } from 'lucide-react';
import { PLATFORM_META } from '../data/mockTelemetry';
import { GitHubCommit, PlatformId, PlatformProfile } from '../types/telemetry';
import { PlatformTag } from './PlatformTag';

interface PlatformsScreenProps {
  profiles: PlatformProfile[];
  commits: GitHubCommit[];
  onUpdateHandle: (platform: PlatformId, handle: string) => void;
  onSyncPlatform: (platform: PlatformId) => void;
}

const LANGUAGE_BREAKDOWN = [
  { name: 'C++ 20', pct: 54, color: '#38BDF8' },
  { name: 'TypeScript', pct: 24, color: '#06B6D4' },
  { name: 'Python 3', pct: 14, color: '#F59E0B' },
  { name: 'Rust', pct: 8, color: '#10B981' },
];

export const PlatformsScreen: React.FC<PlatformsScreenProps> = ({
  profiles,
  commits,
  onUpdateHandle,
  onSyncPlatform,
}) => {
  const [editingPlatform, setEditingPlatform] = useState<PlatformId | null>(null);
  const [draftHandle, setDraftHandle] = useState('');
  const [syncingId, setSyncingId] = useState<PlatformId | 'all' | null>(null);

  const triggerSync = (platform: PlatformId | 'all') => {
    setSyncingId(platform);
    window.setTimeout(() => {
      if (platform === 'all') {
        profiles.forEach((p) => onSyncPlatform(p.platform));
      } else {
        onSyncPlatform(platform);
      }
      setSyncingId(null);
    }, 550);
  };

  const startEdit = (p: PlatformProfile) => {
    setEditingPlatform(p.platform);
    setDraftHandle(p.handle);
  };

  const saveEdit = (platform: PlatformId) => {
    const trimmed = draftHandle.trim();
    if (trimmed) onUpdateHandle(platform, trimmed);
    setEditingPlatform(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#131B2E] border border-white/[0.08] rounded-lg p-5">
        <div>
          <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
            Connected Engineering & Judge Profiles
          </h2>
          <p className="text-xs font-mono text-[#64748B] mt-0.5">
            Update handles or trigger an on-demand profile telemetry refresh
          </p>
        </div>
        <button
          type="button"
          onClick={() => triggerSync('all')}
          disabled={syncingId !== null}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#06B6D4] hover:bg-[#4CD7F6] disabled:opacity-60 text-[#0A0D14] rounded text-xs font-mono font-semibold uppercase tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncingId === 'all' ? 'animate-spin' : ''}`} />
          <span>{syncingId === 'all' ? 'Syncing...' : 'Sync All Platforms'}</span>
        </button>
      </div>

      {/* Platform Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {profiles.map((p) => {
          const meta = PLATFORM_META[p.platform];
          const isEditing = editingPlatform === p.platform;
          const isSyncing = syncingId === p.platform || syncingId === 'all';
          const total = Math.max(1, p.easyCount + p.mediumCount + p.hardCount);
          const easyPct = (p.easyCount / total) * 100;
          const medPct = (p.mediumCount / total) * 100;
          const hardPct = (p.hardCount / total) * 100;

          return (
            <section
              key={p.platform}
              className="bg-[#131B2E] border border-white/[0.08] hover:border-[#06B6D4]/40 transition-colors rounded-lg p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <PlatformTag platform={p.platform} />
                  <span className="text-[11px] font-mono text-[#64748B] tabular-nums">
                    Synced{' '}
                    {new Date(p.lastSyncedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                </div>

                {/* Handle + Edit */}
                <div className="mt-4 flex items-center justify-between gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={draftHandle}
                        onChange={(e) => setDraftHandle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(p.platform);
                          if (e.key === 'Escape') setEditingPlatform(null);
                        }}
                        autoFocus
                        className="flex-1 h-8 px-2.5 bg-[#0A0D14] border border-[#06B6D4] rounded text-sm font-mono text-[#F8FAFC] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(p.platform)}
                        aria-label="Save handle"
                        className="p-1.5 bg-[#06B6D4] text-[#0A0D14] rounded cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg font-mono font-bold text-[#F8FAFC] truncate">
                        @{p.handle}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        aria-label={`Edit ${p.name} handle`}
                        className="text-[#64748B] hover:text-[#4CD7F6] transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs font-mono mt-1" style={{ color: meta.color }}>
                  {p.tierLabel}
                </p>
              </div>

              {/* Rating + Solved Numbers */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/[0.06] font-mono">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.08em] text-[#64748B] block">
                    {p.platform === 'github' ? '1Y Commits' : 'Total Solved'}
                  </span>
                  <span className="text-xl font-bold text-[#F8FAFC] tabular-nums">
                    {p.totalSolved.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.08em] text-[#64748B] block">
                    {p.currentRating ? 'Current / Peak' : 'Status'}
                  </span>
                  <span className="text-xl font-bold text-[#F8FAFC] tabular-nums">
                    {p.currentRating ? `${p.currentRating}` : 'Active'}
                    {p.peakRating ? (
                      <span className="text-xs text-[#64748B] font-normal ml-1">
                        / {p.peakRating}
                      </span>
                    ) : null}
                  </span>
                </div>
              </div>

              {/* Segmented Difficulty / Commit Split Bar */}
              <div>
                <div className="h-1.5 w-full bg-[#0A0D14] rounded-sm overflow-hidden flex gap-0.5">
                  <div style={{ width: `${easyPct}%`, backgroundColor: '#10B981' }} />
                  <div style={{ width: `${medPct}%`, backgroundColor: '#F59E0B' }} />
                  <div style={{ width: `${hardPct}%`, backgroundColor: '#EF4444' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] mt-2 tabular-nums">
                  <span>
                    {p.platform === 'github' ? 'Docs/Fix' : 'Easy'} {p.easyCount}
                  </span>
                  <span>
                    {p.platform === 'github' ? 'Features' : 'Med'} {p.mediumCount}
                  </span>
                  <span>
                    {p.platform === 'github' ? 'Arch/Core' : 'Hard'} {p.hardCount}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => triggerSync(p.platform)}
                disabled={isSyncing}
                className="w-full py-2 inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Refreshing...' : 'Sync Profile'}</span>
              </button>
            </section>
          );
        })}
      </div>

      {/* GitHub Engineering Commit Stream + Language Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <section className="xl:col-span-8 bg-[#131B2E] border border-white/[0.08] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
                GitHub Commit Telemetry
              </h3>
              <p className="text-xs font-mono text-[#64748B] mt-0.5">
                Recent algorithm library and systems repository pushes
              </p>
            </div>
            <PlatformTag platform="github" />
          </div>

          <div className="divide-y divide-white/[0.05]">
            {commits.map((c) => (
              <div
                key={c.id}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-[#1E293B]/45 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
                    <GitCommit className="w-3.5 h-3.5 text-[#4CD7F6] shrink-0" />
                    <span className="text-[#94A3B8] truncate">{c.repo}</span>
                    <span>·</span>
                    <span className="text-[#4CD7F6]">{c.branch}</span>
                    <span>·</span>
                    <span>{c.sha}</span>
                  </div>
                  <p className="text-sm font-medium text-[#E1E2EC] mt-1 truncate">{c.message}</p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs tabular-nums shrink-0">
                  <span className="text-[#94A3B8]">{c.language}</span>
                  <span className="text-[#10B981]">+{c.additions}</span>
                  <span className="text-[#EF4444]">-{c.deletions}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="xl:col-span-4 bg-[#131B2E] border border-white/[0.08] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#F8FAFC] tracking-tight pb-3 border-b border-white/[0.06]">
              Runtime Language Mix
            </h3>
            <p className="text-xs font-mono text-[#64748B] mt-2">
              Distribution across accepted solutions and repositories
            </p>

            <div className="mt-5 space-y-4">
              {LANGUAGE_BREAKDOWN.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#E1E2EC]">{lang.name}</span>
                    <span className="text-[#94A3B8] tabular-nums">{lang.pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#0A0D14] rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm"
                      style={{ width: `${lang.pct}%`, backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs font-mono text-[#94A3B8] flex justify-between tabular-nums">
            <span>Primary CP Runtime</span>
            <span className="text-[#38BDF8] font-semibold">GCC 14 (C++20)</span>
          </div>
        </section>
      </div>
    </div>
  );
};
