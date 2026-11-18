export type PlatformId = 'leetcode' | 'codeforces' | 'github' | 'codechef' | 'gfg';

export type Verdict = 'Accepted' | 'TLE' | 'Wrong Answer' | 'Runtime Error';

export type DifficultyTier = 'Easy' | 'Medium' | 'Hard';

export type ScreenId = 'overview' | 'submissions' | 'contests' | 'platforms' | 'queue';

export interface SubmissionRecord {
  id: string;
  problemCode: string;
  title: string;
  platform: Exclude<PlatformId, 'github'>;
  difficulty: DifficultyTier;
  rating?: number;
  verdict: Verdict;
  language: string;
  runtimeMs: number;
  runtimePercentile: number;
  memoryMb: number;
  submittedAt: string; // ISO string
  topics: string[];
  timeComplexity: string;
  spaceComplexity: string;
  patternNote: string;
  code: string;
}

export interface ContestItem {
  id: string;
  name: string;
  platform: Exclude<PlatformId, 'github'>;
  startTimeIso: string;
  durationMinutes: number;
  division: string;
  registered: boolean;
}

export interface RatingPoint {
  id: string;
  date: string; // YYYY-MM-DD
  platform: 'codeforces' | 'leetcode' | 'codechef';
  contestName: string;
  rank: number;
  participants: number;
  solvedCount: number;
  totalProblems: number;
  delta: number;
  rating: number;
}

export interface PlatformProfile {
  platform: PlatformId;
  name: string;
  handle: string;
  tierLabel: string;
  currentRating: number | null;
  peakRating: number | null;
  totalSolved: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  lastSyncedAt: string;
  connected: boolean;
  profileUrl: string;
}

export interface GitHubCommit {
  id: string;
  repo: string;
  branch: string;
  message: string;
  sha: string;
  additions: number;
  deletions: number;
  timestamp: string;
  language: string;
}

export interface PracticeTask {
  id: string;
  problemCode: string;
  title: string;
  platform: Exclude<PlatformId, 'github'>;
  topic: string;
  difficulty: DifficultyTier;
  priority: 'High' | 'Normal' | 'Low';
  dueLabel: string;
  completed: boolean;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  total: number;
  byPlatform: Record<PlatformId, number>;
}
