import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Plus, Search, Terminal } from 'lucide-react';
import { ScreenId, SubmissionRecord } from '../types/telemetry';
import { PlatformTag } from './PlatformTag';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenLogModal: () => void;
  submissions: SubmissionRecord[];
  onSelectSubmission: (sub: SubmissionRecord) => void;
}

const SCREEN_COMMANDS: { id: ScreenId; label: string; hint: string }[] = [
  { id: 'overview', label: 'Overview Console', hint: 'KPIs, 52-week heatmap & rating trajectory' },
  { id: 'submissions', label: 'Submissions & Problems', hint: 'Full execution ledger & code inspector' },
  { id: 'contests', label: 'Contests & Rating', hint: 'Live countdowns & Elo delta simulator' },
  { id: 'platforms', label: 'Platform Sync', hint: 'LeetCode, Codeforces, GitHub & CodeChef handles' },
  { id: 'queue', label: 'Practice Queue', hint: 'Weekly solve target & drill checklist' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onNavigate,
  onOpenLogModal,
  submissions,
  onSelectSubmission,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const matchedScreens = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SCREEN_COMMANDS;
    return SCREEN_COMMANDS.filter(
      (s) => s.label.toLowerCase().includes(q) || s.hint.toLowerCase().includes(q)
    );
  }, [query]);

  const matchedSubs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? submissions.filter((s) =>
          `${s.problemCode} ${s.title} ${s.topics.join(' ')}`.toLowerCase().includes(q)
        )
      : submissions.slice(0, 4);
    return list.slice(0, 5);
  }, [submissions, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-[#0A0D14]/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#131B2E] border border-white/[0.12] rounded-lg shadow-[0_24px_48px_rgba(0,0,0,0.85)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-white/[0.08] flex items-center gap-3 bg-[#0A0D14]">
          <Search className="w-4 h-4 text-[#4CD7F6] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
            placeholder="Jump to screen, search problem ID, or trigger action..."
            className="flex-1 bg-transparent text-sm font-mono text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[#1E293B] text-[10px] font-mono text-[#94A3B8]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/[0.06]">
          {/* Quick Action */}
          <div className="p-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogModal();
              }}
              className="w-full px-3 py-2 rounded hover:bg-[#1E293B] flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-sm font-medium text-[#F8FAFC]">Log New Submission</span>
              </div>
              <span className="text-[11px] font-mono text-[#64748B]">Action</span>
            </button>
          </div>

          {/* Navigation Targets */}
          {matchedScreens.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.08em] text-[#64748B]">
                Screens
              </div>
              {matchedScreens.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    onNavigate(sc.id);
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded hover:bg-[#1E293B] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Terminal className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                    <span className="text-sm text-[#E1E2EC] whitespace-nowrap">{sc.label}</span>
                    <span className="text-xs font-mono text-[#64748B] truncate hidden sm:inline">
                      {sc.hint}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Problem Diagnostics */}
          {matchedSubs.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.08em] text-[#64748B]">
                Submission Diagnostics
              </div>
              {matchedSubs.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    onSelectSubmission(sub);
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded hover:bg-[#1E293B] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs text-[#64748B] shrink-0">
                      {sub.problemCode}
                    </span>
                    <span className="text-sm text-[#E1E2EC] truncate">{sub.title}</span>
                  </div>
                  <PlatformTag platform={sub.platform} compact />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
