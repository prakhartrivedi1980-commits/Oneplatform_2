import React, { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { SubmissionRecord } from '../types/telemetry';
import { DifficultyText, PlatformTag, VerdictLabel } from './PlatformTag';

interface SubmissionDrawerProps {
  submission: SubmissionRecord | null;
  onClose: () => void;
}

export const SubmissionDrawer: React.FC<SubmissionDrawerProps> = ({ submission, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!submission) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(submission.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0A0D14]/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Submission diagnostics for ${submission.title}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl h-full bg-[#0F172A] border-l border-white/[0.1] shadow-[0_24px_48px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs text-[#64748B] tabular-nums">
                {submission.problemCode}
              </span>
              <PlatformTag platform={submission.platform} />
              <VerdictLabel verdict={submission.verdict} />
            </div>
            <h2 className="text-lg font-semibold text-[#F8FAFC] mt-2 truncate">
              {submission.title}
            </h2>
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#94A3B8] mt-1 flex-wrap">
              <DifficultyText difficulty={submission.difficulty} rating={submission.rating} />
              <span>·</span>
              <span>{submission.language}</span>
              <span>·</span>
              <span className="tabular-nums">
                {new Date(submission.submittedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close submission drawer"
            className="p-2 rounded bg-[#131B2E] border border-white/[0.08] text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Runtime & Complexity Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#131B2E] border border-white/[0.08] rounded-lg p-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#64748B] block">
                Runtime
              </span>
              <span className="text-lg font-mono font-bold text-[#F8FAFC] tabular-nums">
                {submission.runtimeMs} ms
              </span>
              <span className="text-[11px] font-mono text-[#10B981] block mt-0.5 tabular-nums">
                Beats {submission.runtimePercentile.toFixed(1)}%
              </span>
            </div>

            <div className="bg-[#131B2E] border border-white/[0.08] rounded-lg p-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#64748B] block">
                Memory
              </span>
              <span className="text-lg font-mono font-bold text-[#F8FAFC] tabular-nums">
                {submission.memoryMb.toFixed(1)} MB
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8] block mt-0.5">Heap + Stack</span>
            </div>

            <div className="bg-[#131B2E] border border-white/[0.08] rounded-lg p-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#64748B] block">
                Time Bound
              </span>
              <span className="text-sm font-mono font-semibold text-[#4CD7F6] block mt-1">
                {submission.timeComplexity}
              </span>
            </div>

            <div className="bg-[#131B2E] border border-white/[0.08] rounded-lg p-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#64748B] block">
                Space Bound
              </span>
              <span className="text-sm font-mono font-semibold text-[#D0BCFF] block mt-1">
                {submission.spaceComplexity}
              </span>
            </div>
          </div>

          {/* Algorithmic Pattern Note */}
          <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#131B2E]/70 border border-[#8B5CF6]/35 rounded-lg p-4">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-[#D0BCFF] tracking-tight">
                Algorithmic Pattern Diagnostic
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                {submission.topics.join(' · ')}
              </span>
            </div>
            <p className="text-xs font-mono text-[#E1E2EC] leading-relaxed">
              {submission.patternNote}
            </p>
          </div>

          {/* Source Code Block */}
          <div className="bg-[#0A0D14] border border-white/[0.08] rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-[#131B2E] border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-mono text-[#94A3B8]">
                {submission.language} · Source Implementation
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#273549] border border-white/[0.1] text-xs font-mono text-[#E1E2EC] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-[#E1E2EC] overflow-x-auto leading-relaxed">
              <code>{submission.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
