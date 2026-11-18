import {
  ContestItem,
  GitHubCommit,
  HeatmapDay,
  PlatformId,
  PlatformProfile,
  PracticeTask,
  RatingPoint,
  SubmissionRecord,
} from '../types/telemetry';

export const PLATFORM_META: Record<
  PlatformId,
  {
    label: string;
    short: string;
    color: string;
    bgTint: string;
    borderTint: string;
  }
> = {
  leetcode: {
    label: 'LeetCode',
    short: 'LC',
    color: '#F59E0B',
    bgTint: 'rgba(245, 158, 11, 0.14)',
    borderTint: 'rgba(245, 158, 11, 0.30)',
  },
  codeforces: {
    label: 'Codeforces',
    short: 'CF',
    color: '#38BDF8',
    bgTint: 'rgba(6, 182, 212, 0.14)',
    borderTint: 'rgba(56, 189, 248, 0.30)',
  },
  github: {
    label: 'GitHub',
    short: 'GH',
    color: '#F8FAFC',
    bgTint: 'rgba(255, 255, 255, 0.08)',
    borderTint: 'rgba(255, 255, 255, 0.18)',
  },
  codechef: {
    label: 'CodeChef',
    short: 'CC',
    color: '#D97706',
    bgTint: 'rgba(217, 119, 6, 0.15)',
    borderTint: 'rgba(217, 119, 6, 0.30)',
  },
  gfg: {
    label: 'GeeksforGeeks',
    short: 'GFG',
    color: '#10B981',
    bgTint: 'rgba(16, 185, 129, 0.14)',
    borderTint: 'rgba(16, 185, 129, 0.30)',
  },
};

// Deterministic pseudo-random generator for stable 52-week telemetry matrix
function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function generateInitialHeatmap(anchorDate = new Date('2026-11-18T12:00:00Z')): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const totalDays = 52 * 7; // 364 days
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(anchorDate);
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);

    // Build realistic active streak for the last 23 days and varied cadence across the year
    const isRecentStreak = i < 23;
    const wave = Math.sin(i / 17) * 0.25 + 0.5;
    const r = seeded(i + 101);

    let lc = 0;
    let cf = 0;
    let gh = 0;
    let cc = 0;
    let gfg = 0;

    if (isRecentStreak || r < wave * 0.82) {
      lc = r > 0.35 ? Math.floor(seeded(i * 3 + 1) * 4) + (isRecentStreak ? 1 : 0) : 0;
      cf = seeded(i * 5 + 2) > 0.55 ? Math.floor(seeded(i * 7 + 3) * 3) + 1 : 0;
      gh = seeded(i * 11 + 4) > 0.3 ? Math.floor(seeded(i * 13 + 5) * 5) + 1 : 0;
      cc = seeded(i * 17 + 6) > 0.84 ? Math.floor(seeded(i * 19 + 7) * 2) + 1 : 0;
      gfg = seeded(i * 23 + 8) > 0.78 ? Math.floor(seeded(i * 29 + 9) * 2) + 1 : 0;

      if (isRecentStreak && lc + cf + gh + cc + gfg === 0) {
        lc = 2;
        gh = 1;
      }
    }

    const total = lc + cf + gh + cc + gfg;
    days.push({
      date: iso,
      total,
      byPlatform: {
        leetcode: lc,
        codeforces: cf,
        github: gh,
        codechef: cc,
        gfg,
      },
    });
  }
  return days;
}

export const INITIAL_PROFILES: PlatformProfile[] = [
  {
    platform: 'leetcode',
    name: 'LeetCode',
    handle: 'k_nakamura',
    tierLabel: 'Guardian · Top 2.1%',
    currentRating: 2148,
    peakRating: 2184,
    totalSolved: 642,
    easyCount: 194,
    mediumCount: 318,
    hardCount: 130,
    lastSyncedAt: '2026-11-18T09:42:00Z',
    connected: true,
    profileUrl: 'https://leetcode.com',
  },
  {
    platform: 'codeforces',
    name: 'Codeforces',
    handle: 'knakamura_cp',
    tierLabel: 'Candidate Master',
    currentRating: 1942,
    peakRating: 1978,
    totalSolved: 418,
    easyCount: 140,
    mediumCount: 186,
    hardCount: 92,
    lastSyncedAt: '2026-11-18T09:40:00Z',
    connected: true,
    profileUrl: 'https://codeforces.com',
  },
  {
    platform: 'github',
    name: 'GitHub',
    handle: 'kenji-nakamura',
    tierLabel: '1,428 Contributions (1Y)',
    currentRating: null,
    peakRating: null,
    totalSolved: 1428,
    easyCount: 620,
    mediumCount: 540,
    hardCount: 268,
    lastSyncedAt: '2026-11-18T09:44:00Z',
    connected: true,
    profileUrl: 'https://github.com',
  },
  {
    platform: 'codechef',
    name: 'CodeChef',
    handle: 'kenji_cc',
    tierLabel: '5 Star · Div 1',
    currentRating: 2036,
    peakRating: 2051,
    totalSolved: 186,
    easyCount: 54,
    mediumCount: 89,
    hardCount: 43,
    lastSyncedAt: '2026-11-18T08:15:00Z',
    connected: true,
    profileUrl: 'https://codechef.com',
  },
  {
    platform: 'gfg',
    name: 'GeeksforGeeks',
    handle: 'kenji_dev',
    tierLabel: 'Institute Rank #4',
    currentRating: null,
    peakRating: null,
    totalSolved: 138,
    easyCount: 62,
    mediumCount: 58,
    hardCount: 18,
    lastSyncedAt: '2026-11-17T22:10:00Z',
    connected: true,
    profileUrl: 'https://geeksforgeeks.org',
  },
];

export const INITIAL_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 'sub-101',
    problemCode: 'CF-2041D',
    title: 'Drunken Maze',
    platform: 'codeforces',
    difficulty: 'Hard',
    rating: 1900,
    verdict: 'Accepted',
    language: 'C++ 20',
    runtimeMs: 46,
    runtimePercentile: 94.2,
    memoryMb: 18.4,
    submittedAt: '2026-11-18T09:18:00Z',
    topics: ['Shortest Path', 'BFS', 'State Space'],
    timeComplexity: 'O(N · M · 4 · 3)',
    spaceComplexity: 'O(N · M · 12)',
    patternNote:
      'Encode (row, col, last_dir, consecutive_steps) into a flattened 1D state index to avoid hash map overhead and respect the 3-step straight-line constraint.',
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);
  int n, m;
  cin >> n >> m;
  vector<string> grid(n);
  int sr = 0, sc = 0, tr = 0, tc = 0;
  for (int i = 0; i < n; ++i) {
    cin >> grid[i];
    for (int j = 0; j < m; ++j) {
      if (grid[i][j] == 'S') sr = i, sc = j;
      if (grid[i][j] == 'T') tr = i, tc = j;
    }
  }
  const int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};
  auto idx = [&](int r, int c, int d, int s) {
    return ((r * m + c) * 4 + d) * 3 + (s - 1);
  };
  vector<int> dist(n * m * 12, -1);
  queue<int> q;
  for (int d = 0; d < 4; ++d) {
    int nr = sr + dr[d], nc = sc + dc[d];
    if (nr >= 0 && nr < n && nc >= 0 && nc < m && grid[nr][nc] != '#') {
      int id = idx(nr, nc, d, 1);
      dist[id] = 1;
      q.push(id);
    }
  }
  while (!q.empty()) {
    int u = q.front(); q.pop();
    int s = (u % 3) + 1;
    int rem = u / 3;
    int d = rem % 4;
    int cell = rem / 4;
    int r = cell / m, c = cell % m;
    if (r == tr && c == tc) {
      cout << dist[u] << '\\n';
      return 0;
    }
    for (int nd = 0; nd < 4; ++nd) {
      int ns = (nd == d) ? s + 1 : 1;
      if (ns > 3) continue;
      int nr = r + dr[nd], nc = c + dc[nd];
      if (nr < 0 || nr >= n || nc < 0 || nc >= m || grid[nr][nc] == '#') continue;
      int v = idx(nr, nc, nd, ns);
      if (dist[v] == -1) {
        dist[v] = dist[u] + 1;
        q.push(v);
      }
    }
  }
  cout << -1 << '\\n';
  return 0;
}`,
  },
  {
    id: 'sub-102',
    problemCode: 'LC-1547',
    title: 'Minimum Cost to Cut a Stick',
    platform: 'leetcode',
    difficulty: 'Hard',
    verdict: 'Accepted',
    language: 'TypeScript',
    runtimeMs: 14,
    runtimePercentile: 96.8,
    memoryMb: 51.2,
    submittedAt: '2026-11-18T07:52:00Z',
    topics: ['Dynamic Programming', 'Interval DP', 'Sorting'],
    timeComplexity: 'O(K^3)',
    spaceComplexity: 'O(K^2)',
    patternNote:
      'Sort cuts and pad with [0, n]. Iterate over interval length ascending so dp[i][j] strictly depends on smaller sub-intervals dp[i][m] + dp[m][j].',
    code: `function minCost(n: number, cuts: number[]): number {
  const pts = [0, ...cuts.sort((a, b) => a - b), n];
  const m = pts.length;
  const dp: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));

  for (let len = 2; len < m; len++) {
    for (let i = 0; i + len < m; i++) {
      const j = i + len;
      let best = Number.MAX_SAFE_INTEGER;
      for (let k = i + 1; k < j; k++) {
        best = Math.min(best, dp[i][k] + dp[k][j]);
      }
      dp[i][j] = best + (pts[j] - pts[i]);
    }
  }
  return dp[0][m - 1];
}`,
  },
  {
    id: 'sub-103',
    problemCode: 'LC-239',
    title: 'Sliding Window Maximum',
    platform: 'leetcode',
    difficulty: 'Hard',
    verdict: 'Accepted',
    language: 'C++ 20',
    runtimeMs: 128,
    runtimePercentile: 91.4,
    memoryMb: 134.8,
    submittedAt: '2026-11-17T21:14:00Z',
    topics: ['Monotonic Queue', 'Sliding Window', 'Deque'],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)',
    patternNote:
      'Maintain a strictly decreasing deque of indices. Evict out-of-window front indices before pushing and pop smaller elements from the back.',
    code: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
  deque<int> dq;
  vector<int> ans;
  ans.reserve(nums.size() - k + 1);
  for (int i = 0; i < (int)nums.size(); ++i) {
    if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
    while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
    dq.push_back(i);
    if (i >= k - 1) ans.push_back(nums[dq.front()]);
  }
  return ans;
}`,
  },
  {
    id: 'sub-104',
    problemCode: 'CF-2038G',
    title: 'Segment Tree Range Affine Sum',
    platform: 'codeforces',
    difficulty: 'Hard',
    rating: 2100,
    verdict: 'TLE',
    language: 'Python 3',
    runtimeMs: 2000,
    runtimePercentile: 12.0,
    memoryMb: 92.6,
    submittedAt: '2026-11-17T18:33:00Z',
    topics: ['Segment Tree', 'Lazy Propagation', 'Modular Arithmetic'],
    timeComplexity: 'O((N + Q) log N)',
    spaceComplexity: 'O(4N)',
    patternNote:
      'Recursive segment tree in Python exceeded the 2000ms limit due to function-call overhead. Switch to an iterative bottom-up Fenwick / segment tree or port to C++20.',
    code: `MOD = 998244353

def push(node, l, r, tree, mul, add):
    if mul[node] == 1 and add[node] == 0:
        return
    mid = (l + r) // 2
    for ch, seg_len in ((node * 2, mid - l + 1), (node * 2 + 1, r - mid)):
        tree[ch] = (tree[ch] * mul[node] + add[node] * seg_len) % MOD
        mul[ch] = (mul[ch] * mul[node]) % MOD
        add[ch] = (add[ch] * mul[node] + add[node]) % MOD
    mul[node], add[node] = 1, 0`,
  },
  {
    id: 'sub-105',
    problemCode: 'LC-146',
    title: 'LRU Cache',
    platform: 'leetcode',
    difficulty: 'Medium',
    verdict: 'Accepted',
    language: 'TypeScript',
    runtimeMs: 42,
    runtimePercentile: 89.5,
    memoryMb: 98.1,
    submittedAt: '2026-11-17T11:05:00Z',
    topics: ['Hash Table', 'Linked List', 'Design'],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(Capacity)',
    patternNote:
      'JavaScript Map preserves insertion order in O(1) amortized time, allowing delete + set to promote accessed keys to MRU without allocating doubly-linked nodes.',
    code: `class LRUCache {
  private cap: number;
  private cache = new Map<number, number>();

  constructor(capacity: number) {
    this.cap = capacity;
  }

  get(key: number): number {
    const val = this.cache.get(key);
    if (val === undefined) return -1;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.cap) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
  }
}`,
  },
  {
    id: 'sub-106',
    problemCode: 'CC-START161C',
    title: 'Maximal Subarray XOR Queries',
    platform: 'codechef',
    difficulty: 'Medium',
    rating: 1740,
    verdict: 'Accepted',
    language: 'C++ 20',
    runtimeMs: 31,
    runtimePercentile: 95.1,
    memoryMb: 24.7,
    submittedAt: '2026-11-16T16:40:00Z',
    topics: ['Bitwise Trie', 'Prefix XOR', 'Greedy'],
    timeComplexity: 'O(30 · N)',
    spaceComplexity: 'O(30 · N)',
    patternNote:
      'Build a binary trie over prefix XORs while tracking maximum index per node so range [L, R] queries can reject stale prefixes in O(30) bit steps.',
    code: `struct Node {
  int ch[2] = {-1, -1};
  int max_idx = -1;
};

int query(const vector<Node>& trie, int val, int min_idx) {
  int cur = 0, ans = 0;
  for (int b = 29; b >= 0; --b) {
    int bit = (val >> b) & 1;
    int want = bit ^ 1;
    int nxt = trie[cur].ch[want];
    if (nxt != -1 && trie[nxt].max_idx >= min_idx) {
      ans |= (1 << b);
      cur = nxt;
    } else {
      cur = trie[cur].ch[bit];
    }
  }
  return ans;
}`,
  },
  {
    id: 'sub-107',
    problemCode: 'GFG-ARTICULATION',
    title: 'Articulation Points in Undirected Graph',
    platform: 'gfg',
    difficulty: 'Medium',
    verdict: 'Accepted',
    language: 'C++ 20',
    runtimeMs: 62,
    runtimePercentile: 88.2,
    memoryMb: 41.3,
    submittedAt: '2026-11-15T19:22:00Z',
    topics: ['Graphs', 'Tarjan DFS', 'Bridges & Cut Vertices'],
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    patternNote:
      'Apply Tarjan low-link values: root is an articulation point iff it has >= 2 DFS children; non-root u is a cut vertex iff low[v] >= tin[u] for some child v.',
    code: `void dfs(int u, int p, int& timer, const vector<vector<int>>& adj,
         vector<int>& tin, vector<int>& low, vector<bool>& is_cut) {
  tin[u] = low[u] = timer++;
  int children = 0;
  for (int v : adj[u]) {
    if (v == p) continue;
    if (tin[v] != -1) {
      low[u] = min(low[u], tin[v]);
    } else {
      dfs(v, u, timer, adj, tin, low, is_cut);
      low[u] = min(low[u], low[v]);
      if (low[v] >= tin[u] && p != -1) is_cut[u] = true;
      ++children;
    }
  }
  if (p == -1 && children > 1) is_cut[u] = true;
}`,
  },
  {
    id: 'sub-108',
    problemCode: 'LC-410',
    title: 'Split Array Largest Sum',
    platform: 'leetcode',
    difficulty: 'Hard',
    verdict: 'Wrong Answer',
    language: 'Python 3',
    runtimeMs: 4,
    runtimePercentile: 41.2,
    memoryMb: 17.5,
    submittedAt: '2026-11-15T14:08:00Z',
    topics: ['Binary Search', 'Greedy', 'Prefix Sum'],
    timeComplexity: 'O(N log(Sum))',
    spaceComplexity: 'O(1)',
    patternNote:
      'Lower bound of binary search was initialized to min(nums) instead of max(nums), causing a single large element to silently split past k.',
    code: `def splitArray(nums: list[int], k: int) -> int:
    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        groups, cur = 1, 0
        for x in nums:
            if cur + x > mid:
                groups += 1
                cur = 0
            cur += x
        if groups <= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
  },
  {
    id: 'sub-109',
    problemCode: 'LC-207',
    title: 'Course Schedule (Topological Sort)',
    platform: 'leetcode',
    difficulty: 'Medium',
    verdict: 'Accepted',
    language: 'TypeScript',
    runtimeMs: 8,
    runtimePercentile: 95.7,
    memoryMb: 54.0,
    submittedAt: '2026-11-14T20:11:00Z',
    topics: ['Graphs', 'Topological Sort', 'BFS'],
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    patternNote:
      'Kahn’s algorithm using an in-degree array and head-pointer queue avoids Array.shift() O(V) penalty.',
    code: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const indeg = new Int32Array(numCourses);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indeg[a]++;
  }
  const q: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    for (const v of adj[u]) {
      if (--indeg[v] === 0) q.push(v);
    }
  }
  return head === numCourses;
}`,
  },
  {
    id: 'sub-110',
    problemCode: 'CF-2035C',
    title: 'Alya and Permutation',
    platform: 'codeforces',
    difficulty: 'Medium',
    rating: 1400,
    verdict: 'Accepted',
    language: 'C++ 20',
    runtimeMs: 15,
    runtimePercentile: 97.4,
    memoryMb: 6.2,
    submittedAt: '2026-11-13T17:45:00Z',
    topics: ['Constructive', 'Bitmasks', 'Math'],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    patternNote:
      'For even n, anchor the highest power of two k <= n at the end preceded by k-1, k-2, and 3, 1 to force all lower bits high.',
    code: `// Constructive bitmask alignment for even n
vector<int> solveEven(int n) {
  int p = 1;
  while (p * 2 <= n) p *= 2;
  if (n == p) {
    // End with 1, 3, n-2, n-1, n
  }
  return {};
}`,
  },
];

export const INITIAL_CONTESTS: ContestItem[] = [
  {
    id: 'cnt-1',
    name: 'Codeforces Round 992 (Div. 2)',
    platform: 'codeforces',
    startTimeIso: new Date(Date.now() + 1000 * 60 * 34 + 1000 * 18).toISOString(),
    durationMinutes: 120,
    division: 'Div. 2 · Rated <= 2100',
    registered: true,
  },
  {
    id: 'cnt-2',
    name: 'LeetCode Weekly Contest 426',
    platform: 'leetcode',
    startTimeIso: new Date(Date.now() + 1000 * 60 * 60 * 19 + 1000 * 60 * 12).toISOString(),
    durationMinutes: 90,
    division: 'Global Rated',
    registered: true,
  },
  {
    id: 'cnt-3',
    name: 'CodeChef Starters 162',
    platform: 'codechef',
    startTimeIso: new Date(Date.now() + 1000 * 60 * 60 * 44 + 1000 * 60 * 25).toISOString(),
    durationMinutes: 120,
    division: 'Div. 1 & 2',
    registered: false,
  },
  {
    id: 'cnt-4',
    name: 'LeetCode Biweekly Contest 145',
    platform: 'leetcode',
    startTimeIso: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    durationMinutes: 90,
    division: 'Global Rated',
    registered: false,
  },
  {
    id: 'cnt-5',
    name: 'Codeforces Educational Round 173',
    platform: 'codeforces',
    startTimeIso: new Date(Date.now() + 1000 * 60 * 60 * 138).toISOString(),
    durationMinutes: 120,
    division: 'Rated Div. 2',
    registered: true,
  },
];

export const INITIAL_RATING_HISTORY: RatingPoint[] = [
  // Codeforces trajectory
  { id: 'r-cf-1', date: '2026-01-14', platform: 'codeforces', contestName: 'CF Round 921 (Div. 2)', rank: 2410, participants: 18400, solvedCount: 3, totalProblems: 6, delta: 38, rating: 1712 },
  { id: 'r-cf-2', date: '2026-02-22', platform: 'codeforces', contestName: 'Edu Round 163', rank: 1620, participants: 19200, solvedCount: 4, totalProblems: 7, delta: 54, rating: 1766 },
  { id: 'r-cf-3', date: '2026-04-06', platform: 'codeforces', contestName: 'CF Round 938 (Div. 2)', rank: 1980, participants: 21000, solvedCount: 3, totalProblems: 6, delta: -18, rating: 1748 },
  { id: 'r-cf-4', date: '2026-05-19', platform: 'codeforces', contestName: 'CF Round 947 (Div. 1+2)', rank: 1105, participants: 24500, solvedCount: 4, totalProblems: 7, delta: 76, rating: 1824 },
  { id: 'r-cf-5', date: '2026-07-04', platform: 'codeforces', contestName: 'CF Round 956 (Div. 2)', rank: 790, participants: 22100, solvedCount: 5, totalProblems: 6, delta: 69, rating: 1893 },
  { id: 'r-cf-6', date: '2026-08-29', platform: 'codeforces', contestName: 'CF Round 969 (Div. 2)', rank: 612, participants: 23400, solvedCount: 5, totalProblems: 6, delta: 85, rating: 1978 },
  { id: 'r-cf-7', date: '2026-10-12', platform: 'codeforces', contestName: 'CF Round 978 (Div. 2)', rank: 1380, participants: 20800, solvedCount: 3, totalProblems: 6, delta: -36, rating: 1942 },
  { id: 'r-cf-8', date: '2026-11-09', platform: 'codeforces', contestName: 'CF Round 986 (Div. 2)', rank: 980, participants: 19600, solvedCount: 4, totalProblems: 6, delta: 0, rating: 1942 },

  // LeetCode trajectory
  { id: 'r-lc-1', date: '2026-01-25', platform: 'leetcode', contestName: 'Weekly Contest 383', rank: 1840, participants: 29400, solvedCount: 3, totalProblems: 4, delta: 24, rating: 1912 },
  { id: 'r-lc-2', date: '2026-03-10', platform: 'leetcode', contestName: 'Biweekly Contest 126', rank: 1120, participants: 27800, solvedCount: 4, totalProblems: 4, delta: 48, rating: 1960 },
  { id: 'r-lc-3', date: '2026-05-02', platform: 'leetcode', contestName: 'Weekly Contest 396', rank: 890, participants: 31200, solvedCount: 4, totalProblems: 4, delta: 52, rating: 2012 },
  { id: 'r-lc-4', date: '2026-06-28', platform: 'leetcode', contestName: 'Weekly Contest 404', rank: 1410, participants: 33100, solvedCount: 3, totalProblems: 4, delta: -14, rating: 1998 },
  { id: 'r-lc-5', date: '2026-08-18', platform: 'leetcode', contestName: 'Biweekly Contest 137', rank: 540, participants: 28900, solvedCount: 4, totalProblems: 4, delta: 74, rating: 2072 },
  { id: 'r-lc-6', date: '2026-10-04', platform: 'leetcode', contestName: 'Weekly Contest 418', rank: 310, participants: 34200, solvedCount: 4, totalProblems: 4, delta: 112, rating: 2184 },
  { id: 'r-lc-7', date: '2026-11-11', platform: 'leetcode', contestName: 'Weekly Contest 424', rank: 1290, participants: 35600, solvedCount: 3, totalProblems: 4, delta: -36, rating: 2148 },

  // CodeChef trajectory
  { id: 'r-cc-1', date: '2026-02-07', platform: 'codechef', contestName: 'Starters 120', rank: 412, participants: 11200, solvedCount: 4, totalProblems: 7, delta: 34, rating: 1844 },
  { id: 'r-cc-2', date: '2026-04-17', platform: 'codechef', contestName: 'Starters 130', rank: 298, participants: 12400, solvedCount: 5, totalProblems: 7, delta: 62, rating: 1906 },
  { id: 'r-cc-3', date: '2026-07-10', platform: 'codechef', contestName: 'Starters 142', rank: 210, participants: 10900, solvedCount: 5, totalProblems: 7, delta: 78, rating: 1984 },
  { id: 'r-cc-4', date: '2026-09-18', platform: 'codechef', contestName: 'Starters 152', rank: 145, participants: 11800, solvedCount: 6, totalProblems: 7, delta: 67, rating: 2051 },
  { id: 'r-cc-5', date: '2026-11-06', platform: 'codechef', contestName: 'Starters 160', rank: 360, participants: 12100, solvedCount: 4, totalProblems: 7, delta: -15, rating: 2036 },
];

export const INITIAL_GITHUB_COMMITS: GitHubCommit[] = [
  {
    id: 'gh-1',
    repo: 'kenji-nakamura/cp-library-cpp20',
    branch: 'main',
    message: 'feat(segtree): add iterative lazy affine propagation template',
    sha: '8a4f2c9',
    additions: 142,
    deletions: 18,
    timestamp: '2026-11-18T08:45:00Z',
    language: 'C++ 20',
  },
  {
    id: 'gh-2',
    repo: 'kenji-nakamura/raft-consensus-rs',
    branch: 'feat/log-compaction',
    message: 'fix(snapshot): preserve term index across chunked InstallSnapshot RPC',
    sha: '3e91b04',
    additions: 84,
    deletions: 29,
    timestamp: '2026-11-17T22:30:00Z',
    language: 'Rust',
  },
  {
    id: 'gh-3',
    repo: 'kenji-nakamura/obsidian-bench',
    branch: 'main',
    message: 'perf(runner): isolate judge stdin pipes with cgroup memory caps',
    sha: 'c71d8a2',
    additions: 63,
    deletions: 12,
    timestamp: '2026-11-17T16:10:00Z',
    language: 'TypeScript',
  },
  {
    id: 'gh-4',
    repo: 'kenji-nakamura/cp-library-cpp20',
    branch: 'main',
    message: 'test(graphs): verify Tarjan SCC & articulation points on random DAGs',
    sha: '19ab5e0',
    additions: 118,
    deletions: 6,
    timestamp: '2026-11-16T19:05:00Z',
    language: 'C++ 20',
  },
];

export const INITIAL_PRACTICE_QUEUE: PracticeTask[] = [
  {
    id: 'pq-1',
    problemCode: 'CF-2038G',
    title: 'Segment Tree Range Affine Sum (Port to C++20)',
    platform: 'codeforces',
    topic: 'Segment Tree',
    difficulty: 'Hard',
    priority: 'High',
    dueLabel: 'Today',
    completed: false,
  },
  {
    id: 'pq-2',
    problemCode: 'LC-410',
    title: 'Split Array Largest Sum (Fix Binary Search Bound)',
    platform: 'leetcode',
    topic: 'Binary Search',
    difficulty: 'Hard',
    priority: 'High',
    dueLabel: 'Today',
    completed: false,
  },
  {
    id: 'pq-3',
    problemCode: 'LC-124',
    title: 'Binary Tree Maximum Path Sum',
    platform: 'leetcode',
    topic: 'Trees & DP',
    difficulty: 'Hard',
    priority: 'Normal',
    dueLabel: 'Tomorrow',
    completed: false,
  },
  {
    id: 'pq-4',
    problemCode: 'CF-1996F',
    title: 'Bomb (Binary Search on K-th Largest Value)',
    platform: 'codeforces',
    topic: 'Binary Search',
    difficulty: 'Medium',
    priority: 'Normal',
    dueLabel: 'Nov 20',
    completed: false,
  },
  {
    id: 'pq-5',
    problemCode: 'CC-TREEDIST',
    title: 'Centroid Decomposition Distance Queries',
    platform: 'codechef',
    topic: 'Trees & DP',
    difficulty: 'Hard',
    priority: 'Low',
    dueLabel: 'Nov 22',
    completed: false,
  },
  {
    id: 'pq-6',
    problemCode: 'LC-239',
    title: 'Sliding Window Maximum',
    platform: 'leetcode',
    topic: 'Monotonic Queue',
    difficulty: 'Hard',
    priority: 'Normal',
    dueLabel: 'Completed',
    completed: true,
  },
];

export const TOPIC_CATALOG_TARGETS: { topic: string; target: number; solved: number }[] = [
  { topic: 'Dynamic Programming', target: 160, solved: 132 },
  { topic: 'Graphs & Shortest Path', target: 130, solved: 114 },
  { topic: 'Trees & LCA', target: 110, solved: 86 },
  { topic: 'Binary Search', target: 120, solved: 109 },
  { topic: 'Segment Tree & Fenwick', target: 75, solved: 42 },
  { topic: 'Bitmasks & Math', target: 90, solved: 68 },
  { topic: 'Greedy & Two Pointers', target: 140, solved: 129 },
  { topic: 'Strings & Trie', target: 80, solved: 49 },
];
