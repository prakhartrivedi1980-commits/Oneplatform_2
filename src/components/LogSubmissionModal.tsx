import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DifficultyTier, PlatformId, SubmissionRecord, Verdict } from '../types/telemetry';

interface LogSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (submission: Omit<SubmissionRecord, 'id' | 'submittedAt'>) => void;
}

export const LogSubmissionModal: React.FC<LogSubmissionModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [problemCode, setProblemCode] = useState('');
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Exclude<PlatformId, 'github'>>('leetcode');
  const [difficulty, setDifficulty] = useState<DifficultyTier>('Medium');
  const [verdict, setVerdict] = useState<Verdict>('Accepted');
  const [language, setLanguage] = useState('C++ 20');
  const [runtimeMs, setRuntimeMs] = useState(24);
  const [memoryMb, setMemoryMb] = useState(32.5);
  const [topicsInput, setTopicsInput] = useState('Dynamic Programming, Binary Search');
  const [timeComplexity, setTimeComplexity] = useState('O(N log N)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(N)');
  const [patternNote, setPatternNote] = useState('');
  const [code, setCode] = useState('// Paste implementation snippet here');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const topics = topicsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      problemCode:
        problemCode.trim() ||
        `${platform.toUpperCase().slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      platform,
      difficulty,
      verdict,
      language,
      runtimeMs: Number(runtimeMs) || 12,
      runtimePercentile: verdict === 'Accepted' ? 92.4 : 28.0,
      memoryMb: Number(memoryMb) || 24.0,
      topics: topics.length ? topics : ['Algorithms'],
      timeComplexity: timeComplexity.trim() || 'O(N)',
      spaceComplexity: spaceComplexity.trim() || 'O(1)',
      patternNote:
        patternNote.trim() ||
        'Logged directly into local telemetry console with verified complexity bounds.',
      code: code.trim() || '// No snippet provided',
    });
    setProblemCode('');
    setTitle('');
    setPatternNote('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D14]/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Log problem submission"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#131B2E] border border-white/[0.12] rounded-lg shadow-[0_24px_48px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F8FAFC]">Log Problem Submission</h2>
            <p className="text-xs font-mono text-[#64748B] mt-0.5">
              Updates activity heatmap, solved totals, and submission ledger
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded bg-[#0F172A] border border-white/[0.08] text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Problem ID
              </label>
              <input
                type="text"
                value={problemCode}
                onChange={(e) => setProblemCode(e.target.value)}
                placeholder="LC-300"
                className="w-full h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-8">
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Longest Increasing Subsequence"
                required
                className="w-full h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Exclude<PlatformId, 'github'>)}
                className="w-full h-9 px-2.5 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
              >
                <option value="leetcode">LeetCode</option>
                <option value="codeforces">Codeforces</option>
                <option value="codechef">CodeChef</option>
                <option value="gfg">GeeksforGeeks</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyTier)}
                className="w-full h-9 px-2.5 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Verdict
              </label>
              <select
                value={verdict}
                onChange={(e) => setVerdict(e.target.value as Verdict)}
                className="w-full h-9 px-2.5 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
              >
                <option value="Accepted">Accepted</option>
                <option value="TLE">TLE</option>
                <option value="Wrong Answer">Wrong Answer</option>
                <option value="Runtime Error">Runtime Error</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-9 px-2.5 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
              >
                <option value="C++ 20">C++ 20</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python 3">Python 3</option>
                <option value="Rust">Rust</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Runtime (ms)
              </label>
              <input
                type="number"
                min={0}
                value={runtimeMs}
                onChange={(e) => setRuntimeMs(Number(e.target.value))}
                className="w-full h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Memory (MB)
              </label>
              <input
                type="number"
                min={0}
                step="0.1"
                value={memoryMb}
                onChange={(e) => setMemoryMb(Number(e.target.value))}
                className="w-full h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Time Complexity
              </label>
              <input
                type="text"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                className="w-full h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
                Space Complexity
              </label>
              <input
                type="text"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                className="w-full h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
              Topics (comma-separated)
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              className="w-full h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
              Algorithmic Pattern Note
            </label>
            <input
              type="text"
              value={patternNote}
              onChange={(e) => setPatternNote(e.target.value)}
              placeholder="Key invariant or optimization takeaway..."
              className="w-full h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-[0.06em] text-[#64748B] mb-1">
              Solution Snippet
            </label>
            <textarea
              rows={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/[0.12] hover:bg-white/[0.04] rounded text-xs font-mono text-[#E1E2EC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#06B6D4] hover:bg-[#4CD7F6] text-[#0A0D14] rounded text-xs font-mono font-semibold uppercase tracking-wide cursor-pointer"
            >
              Save Submission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
