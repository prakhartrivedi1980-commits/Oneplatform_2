import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Clock } from 'lucide-react';
import { ContestItem } from '../types/telemetry';
import { PlatformTag } from './PlatformTag';

export function formatCountdown(targetIso: string, nowMs: number): {
  label: string;
  isLive: boolean;
  isImminent: boolean;
} {
  const diff = new Date(targetIso).getTime() - nowMs;
  if (diff <= 0) {
    return { label: 'LIVE NOW', isLive: true, isImminent: true };
  }
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hrs = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  const label =
    days > 0
      ? `${days}d ${pad(hrs)}:${pad(mins)}:${pad(secs)}`
      : `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  return {
    label,
    isLive: false,
    isImminent: totalSec < 3600,
  };
}

interface UpcomingContestsPanelProps {
  contests: ContestItem[];
  onToggleRegister: (id: string) => void;
  onViewAll: () => void;
}

export const UpcomingContestsPanel: React.FC<UpcomingContestsPanelProps> = ({
  contests,
  onToggleRegister,
  onViewAll,
}) => {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="bg-[#131B2E] border border-white/[0.08] rounded-lg p-5 flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
            Upcoming Contests
          </h2>
          <p className="text-xs font-mono text-[#64748B] mt-0.5">
            Live synchronized competitive schedule
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-mono text-[#4CD7F6] hover:text-[#ACEDFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Full Schedule →
        </button>
      </div>

      <div className="divide-y divide-white/[0.06] flex-1">
        {contests.slice(0, 4).map((c) => {
          const countdown = formatCountdown(c.startTimeIso, nowMs);
          return (
            <div
              key={c.id}
              className="py-3.5 first:pt-4 last:pb-1 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <PlatformTag platform={c.platform} compact />
                  <span className="text-xs font-mono text-[#64748B] truncate">
                    {c.division} · {c.durationMinutes}m
                  </span>
                </div>
                <p className="text-sm font-medium text-[#E1E2EC] truncate">{c.name}</p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs font-semibold tabular-nums border ${
                    countdown.isImminent
                      ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/35'
                      : 'bg-[#0A0D14] text-[#E1E2EC] border-white/[0.08]'
                  }`}
                >
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{countdown.label}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleRegister(c.id)}
                  title={c.registered ? 'Reminder enabled' : 'Set reminder'}
                  aria-label={c.registered ? `Remove reminder for ${c.name}` : `Set reminder for ${c.name}`}
                  className={`p-2 rounded border transition-colors cursor-pointer ${
                    c.registered
                      ? 'bg-[#06B6D4]/15 border-[#06B6D4]/40 text-[#4CD7F6]'
                      : 'bg-[#0A0D14] border-white/[0.08] text-[#64748B] hover:text-[#E1E2EC]'
                  }`}
                >
                  {c.registered ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
