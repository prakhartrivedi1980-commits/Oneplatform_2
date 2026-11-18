import React, { useMemo, useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { TOPIC_CATALOG_TARGETS } from '../data/mockTelemetry';
import { DifficultyTier, PlatformId, PracticeTask } from '../types/telemetry';
import { DifficultyText, PlatformTag } from './PlatformTag';

interface QueueScreenProps {
  tasks: PracticeTask[];
  weeklyGoal: number;
  weeklySolvedCount: number;
  onChangeWeeklyGoal: (goal: number) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (task: Omit<PracticeTask, 'id' | 'completed'>) => void;
  onCompleteAndLog: (task: PracticeTask) => void;
}

export const QueueScreen: React.FC<QueueScreenProps> = ({
  tasks,
  weeklyGoal,
  weeklySolvedCount,
  onChangeWeeklyGoal,
  onToggleTask,
  onDeleteTask,
  onAddTask,
  onCompleteAndLog,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Exclude<PlatformId, 'github'>>('leetcode');
  const [topic, setTopic] = useState('Dynamic Programming');
  const [difficulty, setDifficulty] = useState<DifficultyTier>('Hard');
  const [priority, setPriority] = useState<'High' | 'Normal' | 'Low'>('High');

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === 'pending') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });
  }, [tasks, filter]);

  const goalPct = Math.min(100, Math.round((weeklySolvedCount / Math.max(1, weeklyGoal)) * 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      problemCode: code.trim() || `${platform.toUpperCase().slice(0, 2)}-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      platform,
      topic,
      difficulty,
      priority,
      dueLabel: priority === 'High' ? 'Today' : 'This Week',
    });
    setCode('');
    setTitle('');
  };

  const queueGapProblem = (topicName: string) => {
    onAddTask({
      problemCode: 'DRILL-' + Math.floor(100 + Math.random() * 899),
      title: `${topicName} Core Drill Set`,
      platform: 'codeforces',
      topic: topicName,
      difficulty: 'Medium',
      priority: 'High',
      dueLabel: 'This Week',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Row: Weekly Goal + Quick Add */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <section className="xl:col-span-5 bg-[#131B2E] border border-white/[0.08] rounded-lg p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
                Weekly Execution Target
              </h2>
              <span className="font-mono text-xs text-[#4CD7F6] font-semibold tabular-nums">
                {goalPct}% complete
              </span>
            </div>
            <p className="text-xs font-mono text-[#64748B] mt-1 tabular-nums">
              {weeklySolvedCount} of {weeklyGoal} accepted solves logged this week
            </p>

            <div className="mt-4 h-2.5 w-full bg-[#0A0D14] border border-white/[0.06] rounded-sm overflow-hidden">
              <div
                className="h-full bg-[#10B981] transition-all duration-200"
                style={{ width: `${goalPct}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-4">
            <label htmlFor="weekly-goal-range" className="text-xs font-mono text-[#94A3B8]">
              Adjust Target ({weeklyGoal} / wk)
            </label>
            <input
              id="weekly-goal-range"
              type="range"
              min={5}
              max={40}
              step={1}
              value={weeklyGoal}
              onChange={(e) => onChangeWeeklyGoal(Number(e.target.value))}
              className="w-40 accent-[#06B6D4] cursor-pointer"
            />
          </div>
        </section>

        <section className="xl:col-span-7 bg-[#131B2E] border border-white/[0.08] rounded-lg p-5">
          <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight mb-3">
            Queue Target Problem
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ID (e.g. LC-312)"
              className="sm:col-span-3 h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] placeholder:text-[#475569] focus:border-[#06B6D4] focus:outline-none"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Problem title or drill focus..."
              required
              className="sm:col-span-6 h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] placeholder:text-[#475569] focus:border-[#06B6D4] focus:outline-none"
            />
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Exclude<PlatformId, 'github'>)}
              aria-label="Target platform"
              className="sm:col-span-3 h-9 px-2.5 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none cursor-pointer"
            >
              <option value="leetcode">LeetCode</option>
              <option value="codeforces">Codeforces</option>
              <option value="codechef">CodeChef</option>
              <option value="gfg">GeeksforGeeks</option>
            </select>

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic"
              className="sm:col-span-4 h-9 px-3 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none"
            />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyTier)}
              aria-label="Target difficulty"
              className="sm:col-span-3 h-9 px-2.5 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none cursor-pointer"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'High' | 'Normal' | 'Low')}
              aria-label="Priority"
              className="sm:col-span-2 h-9 px-2.5 bg-[#0A0D14] border border-white/[0.1] rounded text-xs font-mono text-[#E1E2EC] focus:border-[#06B6D4] focus:outline-none cursor-pointer"
            >
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
            <button
              type="submit"
              className="sm:col-span-3 h-9 inline-flex items-center justify-center gap-1.5 bg-[#06B6D4] hover:bg-[#4CD7F6] text-[#0A0D14] rounded text-xs font-mono font-semibold uppercase tracking-wide transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </form>
        </section>
      </div>

      {/* Main Queue + Topic Coverage Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Practice Checklist */}
        <section className="xl:col-span-8 bg-[#131B2E] border border-white/[0.08] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
                Active Practice Queue
              </h2>
              <p className="text-xs font-mono text-[#64748B] mt-0.5 tabular-nums">
                {tasks.filter((t) => !t.completed).length} pending ·{' '}
                {tasks.filter((t) => t.completed).length} completed
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#0A0D14] border border-white/[0.08] rounded self-start sm:self-auto">
              {(['all', 'pending', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 text-xs font-mono rounded capitalize transition-colors cursor-pointer ${
                    filter === f
                      ? 'bg-[#1E293B] text-[#4CD7F6] border border-[#06B6D4]/40'
                      : 'text-[#94A3B8] hover:text-[#E1E2EC] border border-transparent'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1E293B]/45 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Spec-aligned 14x14px 2px-radius checkbox */}
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.completed}
                    aria-label={`Mark ${task.title} complete`}
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-1 w-[14px] h-[14px] rounded-[2px] flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      task.completed
                        ? 'bg-[#06B6D4] border border-[#06B6D4] text-[#0A0D14]'
                        : 'bg-[#0F172A] border border-white/25 hover:border-[#06B6D4]'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-[#64748B] tabular-nums">
                        {task.problemCode}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          task.completed ? 'line-through text-[#64748B]' : 'text-[#E1E2EC]'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 mt-1.5 flex-wrap text-xs font-mono text-[#94A3B8]">
                      <PlatformTag platform={task.platform} compact />
                      <DifficultyText difficulty={task.difficulty} />
                      <span>·</span>
                      <span>{task.topic}</span>
                      <span>·</span>
                      <span
                        className={
                          task.priority === 'High'
                            ? 'text-[#F59E0B]'
                            : task.priority === 'Normal'
                            ? 'text-[#4CD7F6]'
                            : 'text-[#64748B]'
                        }
                      >
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-6 sm:pl-0">
                  {!task.completed && (
                    <button
                      type="button"
                      onClick={() => onCompleteAndLog(task)}
                      className="px-2.5 py-1.5 bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/35 text-[#10B981] rounded text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer"
                    >
                      Complete & Log
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    aria-label={`Remove ${task.title}`}
                    className="p-1.5 text-[#64748B] hover:text-[#EF4444] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Topic Coverage & Gap Drill */}
        <section className="xl:col-span-4 bg-[#131B2E] border border-white/[0.08] rounded-lg p-5">
          <h3 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
            Topic Coverage Matrix
          </h3>
          <p className="text-xs font-mono text-[#64748B] mt-0.5 pb-4 border-b border-white/[0.06]">
            Queue drills on lower-ratio domains
          </p>

          <div className="mt-4 space-y-3.5">
            {TOPIC_CATALOG_TARGETS.map((item) => {
              const pct = Math.round((item.solved / item.target) * 100);
              const isGap = pct < 70;
              return (
                <div key={item.topic}>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5 gap-2">
                    <span className="text-[#E1E2EC] truncate">{item.topic}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[#94A3B8] tabular-nums">
                        {item.solved}/{item.target} ({pct}%)
                      </span>
                      {isGap && (
                        <button
                          type="button"
                          onClick={() => queueGapProblem(item.topic)}
                          className="text-[11px] text-[#D0BCFF] hover:text-white underline cursor-pointer"
                        >
                          +Drill
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-[#0A0D14] rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isGap ? '#8B5CF6' : '#06B6D4',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
