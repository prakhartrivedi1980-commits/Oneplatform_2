import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CheckSquare,
  Code2,
  Cpu,
  Globe,
  Menu,
  Plus,
  Search,
  Trophy,
  X,
} from 'lucide-react';
import { CommandPalette } from './components/CommandPalette';
import { ContestsScreen } from './components/ContestsScreen';
import { LogSubmissionModal } from './components/LogSubmissionModal';
import { OverviewScreen } from './components/OverviewScreen';
import { PlatformsScreen } from './components/PlatformsScreen';
import { QueueScreen } from './components/QueueScreen';
import { SubmissionDrawer } from './components/SubmissionDrawer';
import { SubmissionsScreen } from './components/SubmissionsScreen';
import {
  INITIAL_CONTESTS,
  INITIAL_GITHUB_COMMITS,
  INITIAL_PRACTICE_QUEUE,
  INITIAL_PROFILES,
  INITIAL_RATING_HISTORY,
  INITIAL_SUBMISSIONS,
  generateInitialHeatmap,
} from './data/mockTelemetry';
import {
  ContestItem,
  HeatmapDay,
  PlatformId,
  PlatformProfile,
  PracticeTask,
  ScreenId,
  SubmissionRecord,
} from './types/telemetry';

const STORAGE_KEY = 'obsidian_telemetry_state_v1';

interface PersistedState {
  submissions: SubmissionRecord[];
  contests: ContestItem[];
  profiles: PlatformProfile[];
  tasks: PracticeTask[];
  heatmapDays: HeatmapDay[];
  weeklyGoal: number;
}

const NAV_ITEMS: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'submissions', label: 'Submissions', icon: Code2 },
  { id: 'contests', label: 'Contests', icon: Trophy },
  { id: 'platforms', label: 'Platform Sync', icon: Globe },
  { id: 'queue', label: 'Practice Queue', icon: CheckSquare },
];

const SCREEN_TITLES: Record<ScreenId, { title: string; subtitle: string }> = {
  overview: {
    title: 'Overview',
    subtitle: 'Cross-platform problem velocity, execution heatmap, and live contest readiness',
  },
  submissions: {
    title: 'Submissions & Problems',
    subtitle: 'Filterable execution history with runtime diagnostics and source code inspection',
  },
  contests: {
    title: 'Contests & Rating',
    subtitle: 'Synchronized contest timers, Elo delta simulator, and verified standings ledger',
  },
  platforms: {
    title: 'Platform Sync',
    subtitle: 'Connected online judges, GitHub commit telemetry, and runtime language breakdown',
  },
  queue: {
    title: 'Practice Queue',
    subtitle: 'Weekly execution targets, prioritized problem backlog, and topic coverage gaps',
  },
};

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (
        Array.isArray(parsed.submissions) &&
        Array.isArray(parsed.contests) &&
        Array.isArray(parsed.profiles) &&
        Array.isArray(parsed.tasks) &&
        Array.isArray(parsed.heatmapDays)
      ) {
        return {
          submissions: parsed.submissions,
          contests: parsed.contests,
          profiles: parsed.profiles,
          tasks: parsed.tasks,
          heatmapDays: parsed.heatmapDays,
          weeklyGoal: typeof parsed.weeklyGoal === 'number' ? parsed.weeklyGoal : 18,
        };
      }
    }
  } catch {
    // Fall back to default telemetry seed
  }
  return {
    submissions: INITIAL_SUBMISSIONS,
    contests: INITIAL_CONTESTS,
    profiles: INITIAL_PROFILES,
    tasks: INITIAL_PRACTICE_QUEUE,
    heatmapDays: generateInitialHeatmap(),
    weeklyGoal: 18,
  };
}

export default function App() {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inspectedSubmission, setInspectedSubmission] = useState<SubmissionRecord | null>(null);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
        setLogModalOpen(false);
        setInspectedSubmission(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((cur) => (cur === msg ? null : cur));
    }, 2600);
  };

  // Compute active and best streak from heatmapDays
  const { activeStreak, bestStreak } = useMemo(() => {
    let best = 0;
    let run = 0;
    for (const d of state.heatmapDays) {
      if (d.total > 0) {
        run++;
        if (run > best) best = run;
      } else {
        run = 0;
      }
    }
    let current = 0;
    for (let i = state.heatmapDays.length - 1; i >= 0; i--) {
      if (state.heatmapDays[i].total > 0) current++;
      else break;
    }
    return { activeStreak: current, bestStreak: best };
  }, [state.heatmapDays]);

  const weeklySolvedCount = useMemo(() => {
    const last7 = state.heatmapDays.slice(-7);
    return last7.reduce(
      (sum, d) =>
        sum +
        d.byPlatform.leetcode +
        d.byPlatform.codeforces +
        d.byPlatform.codechef +
        d.byPlatform.gfg,
      0
    );
  }, [state.heatmapDays]);

  const handleLogSubmission = (
    payload: Omit<SubmissionRecord, 'id' | 'submittedAt'>
  ) => {
    const newSub: SubmissionRecord = {
      ...payload,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };

    setState((prev) => {
      const nextHeatmap = prev.heatmapDays.map((day, idx) => {
        if (idx !== prev.heatmapDays.length - 1) return day;
        return {
          ...day,
          total: day.total + 1,
          byPlatform: {
            ...day.byPlatform,
            [payload.platform]: day.byPlatform[payload.platform] + 1,
          },
        };
      });

      const nextProfiles =
        payload.verdict === 'Accepted'
          ? prev.profiles.map((p) => {
              if (p.platform !== payload.platform) return p;
              return {
                ...p,
                totalSolved: p.totalSolved + 1,
                easyCount: payload.difficulty === 'Easy' ? p.easyCount + 1 : p.easyCount,
                mediumCount: payload.difficulty === 'Medium' ? p.mediumCount + 1 : p.mediumCount,
                hardCount: payload.difficulty === 'Hard' ? p.hardCount + 1 : p.hardCount,
                lastSyncedAt: new Date().toISOString(),
              };
            })
          : prev.profiles;

      return {
        ...prev,
        submissions: [newSub, ...prev.submissions],
        heatmapDays: nextHeatmap,
        profiles: nextProfiles,
      };
    });

    showToast(`Logged ${newSub.problemCode} (${newSub.verdict})`);
  };

  const handleToggleContestRegister = (id: string) => {
    setState((prev) => ({
      ...prev,
      contests: prev.contests.map((c) =>
        c.id === id ? { ...c, registered: !c.registered } : c
      ),
    }));
  };

  const handleUpdateHandle = (platform: PlatformId, handle: string) => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.platform === platform
          ? { ...p, handle, lastSyncedAt: new Date().toISOString() }
          : p
      ),
    }));
    showToast(`Updated ${platform} handle to @${handle}`);
  };

  const handleSyncPlatform = (platform: PlatformId) => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.platform === platform ? { ...p, lastSyncedAt: new Date().toISOString() } : p
      ),
    }));
    showToast(`Synchronized ${platform} telemetry`);
  };

  const handleToggleTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  const handleDeleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const handleAddTask = (task: Omit<PracticeTask, 'id' | 'completed'>) => {
    const newTask: PracticeTask = {
      ...task,
      id: `pq-${Date.now()}`,
      completed: false,
    };
    setState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    showToast(`Queued ${newTask.problemCode}`);
  };

  const handleCompleteAndLog = (task: PracticeTask) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === task.id ? { ...t, completed: true, dueLabel: 'Completed' } : t
      ),
    }));
    handleLogSubmission({
      problemCode: task.problemCode,
      title: task.title,
      platform: task.platform,
      difficulty: task.difficulty,
      verdict: 'Accepted',
      language: 'C++ 20',
      runtimeMs: 18,
      runtimePercentile: 93.5,
      memoryMb: 28.4,
      topics: [task.topic],
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
      patternNote: `Completed from Practice Queue (${task.topic}).`,
      code: `// Verified solution for ${task.problemCode}: ${task.title}`,
    });
  };

  const handleNavigate = (screen: ScreenId) => {
    setActiveScreen(screen);
    setMobileMenuOpen(false);
  };

  const meta = SCREEN_TITLES[activeScreen];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#E1E2EC] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-[252px] lg:shrink-0 flex-col justify-between bg-[#0F172A]/90 backdrop-blur-md border-r border-white/[0.06] sticky top-0 h-screen">
        <div>
          {/* Brand Wordmark */}
          <div className="h-16 px-5 flex items-center gap-2.5 border-b border-white/[0.06]">
            <Cpu className="w-5 h-5 text-[#06B6D4] shrink-0" />
            <span className="text-base font-bold tracking-tight text-[#F8FAFC] whitespace-nowrap">
              Obsidian Telemetry
            </span>
          </div>

          {/* Primary Navigation */}
          <nav className="p-3 space-y-1" aria-label="Primary telemetry navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-md flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#131B2E] text-[#4CD7F6] border border-[#06B6D4]/35'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Engineer Identity Footer */}
        <div className="p-4 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#131B2E] border border-[#06B6D4]/40 flex items-center justify-center font-mono text-xs font-bold text-[#4CD7F6] shrink-0">
              KN
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[#F8FAFC] truncate">Kenji Nakamura</div>
              <div className="text-xs font-mono text-[#64748B] truncate">
                @k_nakamura · CM 1942
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setState(loadInitialState());
              showToast('Restored baseline telemetry dataset');
            }}
            className="w-full py-1.5 text-[11px] font-mono text-[#64748B] hover:text-[#E1E2EC] border border-white/[0.06] hover:border-white/[0.15] rounded transition-colors cursor-pointer"
          >
            Reset Sample Telemetry
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-[#0A0D14]/80 backdrop-blur-sm flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="w-64 h-full bg-[#0F172A] border-r border-white/[0.08] flex flex-col justify-between p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <span className="text-base font-bold text-[#F8FAFC]">Obsidian Telemetry</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="mt-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full px-3 py-2.5 rounded-md flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#131B2E] text-[#4CD7F6] border border-[#06B6D4]/35'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="text-xs font-mono text-[#64748B] pt-4 border-t border-white/[0.06]">
              Kenji Nakamura · @k_nakamura
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Contextual Header */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0A0D14]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded bg-[#131B2E] border border-white/[0.08] text-[#E1E2EC]"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-sm font-mono min-w-0">
              <span className="text-[#64748B] hidden sm:inline">Telemetry</span>
              <span className="text-[#64748B] hidden sm:inline">/</span>
              <span className="text-[#F8FAFC] font-semibold truncate">{meta.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:inline-flex items-center justify-between gap-6 h-9 px-3 bg-[#0F172A] border border-white/[0.1] hover:border-[#06B6D4]/50 rounded text-xs font-mono text-[#64748B] transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                <span>Jump or search...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#1E293B] text-[10px] text-[#94A3B8]">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-[#06B6D4] hover:bg-[#4CD7F6] text-[#0A0D14] rounded text-xs font-mono font-semibold uppercase tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Submission</span>
            </button>
          </div>
        </header>

        {/* Active Screen Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#F8FAFC] text-balance">
              {meta.title}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#94A3B8] mt-1">{meta.subtitle}</p>
          </div>

          {activeScreen === 'overview' && (
            <OverviewScreen
              profiles={state.profiles}
              heatmapDays={state.heatmapDays}
              submissions={state.submissions}
              contests={state.contests}
              ratingHistory={INITIAL_RATING_HISTORY}
              activeStreak={activeStreak}
              bestStreak={bestStreak}
              onSelectSubmission={setInspectedSubmission}
              onToggleContestRegister={handleToggleContestRegister}
              onNavigate={handleNavigate}
            />
          )}

          {activeScreen === 'submissions' && (
            <SubmissionsScreen
              submissions={state.submissions}
              onSelectSubmission={setInspectedSubmission}
              onOpenLogModal={() => setLogModalOpen(true)}
            />
          )}

          {activeScreen === 'contests' && (
            <ContestsScreen
              contests={state.contests}
              ratingHistory={INITIAL_RATING_HISTORY}
              onToggleRegister={handleToggleContestRegister}
            />
          )}

          {activeScreen === 'platforms' && (
            <PlatformsScreen
              profiles={state.profiles}
              commits={INITIAL_GITHUB_COMMITS}
              onUpdateHandle={handleUpdateHandle}
              onSyncPlatform={handleSyncPlatform}
            />
          )}

          {activeScreen === 'queue' && (
            <QueueScreen
              tasks={state.tasks}
              weeklyGoal={state.weeklyGoal}
              weeklySolvedCount={weeklySolvedCount}
              onChangeWeeklyGoal={(goal) =>
                setState((prev) => ({ ...prev, weeklyGoal: goal }))
              }
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
              onCompleteAndLog={handleCompleteAndLog}
            />
          )}
        </main>
      </div>

      {/* Overlays */}
      <SubmissionDrawer
        submission={inspectedSubmission}
        onClose={() => setInspectedSubmission(null)}
      />

      <LogSubmissionModal
        open={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        onSave={handleLogSubmission}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigate}
        onOpenLogModal={() => setLogModalOpen(true)}
        submissions={state.submissions}
        onSelectSubmission={setInspectedSubmission}
      />

      {/* Ephemeral Action Confirmation Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-[#1E293B] border border-[#06B6D4]/50 rounded-md shadow-[0_12px_32px_rgba(0,0,0,0.65)] text-xs font-mono text-[#F8FAFC]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
