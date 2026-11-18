import React from 'react';
import { PLATFORM_META } from '../data/mockTelemetry';
import { DifficultyTier, PlatformId, Verdict } from '../types/telemetry';

interface PlatformTagProps {
  platform: PlatformId;
  compact?: boolean;
}

export const PlatformTag: React.FC<PlatformTagProps> = ({ platform, compact = false }) => {
  const meta = PLATFORM_META[platform];
  return (
    <span
      className="inline-flex items-center h-[22px] px-2 rounded text-[11px] font-mono font-medium tracking-wide whitespace-nowrap shrink-0"
      style={{
        backgroundColor: meta.bgTint,
        color: meta.color,
        border: `1px solid ${meta.borderTint}`,
      }}
    >
      {compact ? meta.short : meta.label}
    </span>
  );
};

interface VerdictLabelProps {
  verdict: Verdict;
}

export const VerdictLabel: React.FC<VerdictLabelProps> = ({ verdict }) => {
  const styles: Record<Verdict, { color: string; bg: string; border: string }> = {
    Accepted: {
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.28)',
    },
    TLE: {
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.28)',
    },
    'Wrong Answer': {
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.28)',
    },
    'Runtime Error': {
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.28)',
    },
  };
  const s = styles[verdict];
  return (
    <span
      className="inline-flex items-center h-[22px] px-2 rounded text-[11px] font-mono font-medium whitespace-nowrap shrink-0"
      style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {verdict}
    </span>
  );
};

interface DifficultyTextProps {
  difficulty: DifficultyTier;
  rating?: number;
}

export const DifficultyText: React.FC<DifficultyTextProps> = ({ difficulty, rating }) => {
  const colorMap: Record<DifficultyTier, string> = {
    Easy: 'text-[#10B981]',
    Medium: 'text-[#F59E0B]',
    Hard: 'text-[#EF4444]',
  };
  return (
    <span className={`font-mono text-xs font-medium tabular-nums whitespace-nowrap ${colorMap[difficulty]}`}>
      {difficulty}
      {rating ? ` · ${rating}` : ''}
    </span>
  );
};
