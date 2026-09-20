import React, { useState, useEffect } from "react";
import {
    CheckCircle2,
    Circle,
    ExternalLink,
    Play,
    Search,
    Flame,
    Building2,
} from "lucide-react";

export interface CodingProblem {
    id: number;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    topic: string;
    sheet: "Blind 75" | "NeetCode 150" | "SDE Sheet";
    leetcodeUrl: string;
    companies: string[];
    starterCode: {
        python: string;
        cpp: string;
        java: string;
        javascript: string;
    };
}

export const PROBLEMS: CodingProblem[] = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        topic: "Arrays & Hashing",
        sheet: "Blind 75",
        leetcodeUrl: "https://leetcode.com/problems/two-sum/",
        companies: ["Google", "Amazon", "Apple", "Meta"],
        starterCode: {
            python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Hash map approach O(n)
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                return [seen[diff], i]
            seen[num] = i
        return []

# Test execution
sol = Solution()
print(sol.twoSum([2, 7, 11, 15], 9)) # Output: [0, 1]
`,
            cpp: `#include <vector>
#include <unordered_map>
#include <iostream>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (mp.count(complement)) return {mp[complement], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution s;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = s.twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]\n";
    return 0;
}
`,
            java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[]{map.get(comp), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
`,
            javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            return [map.get(diff), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
        },
    },
    {
        id: 2,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        topic: "Sliding Window",
        sheet: "Blind 75",
        leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        companies: ["Amazon", "Microsoft", "Meta"],
        starterCode: {
            python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            if price < min_price:
                min_price = price
            elif price - min_price > max_profit:
                max_profit = price - min_price
        return max_profit

print(Solution().maxProfit([7,1,5,3,6,4])) # Output: 5
`,
            cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = 1e9, maxProfit = 0;
        for (int p : prices) {
            minPrice = min(minPrice, p);
            maxProfit = max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }
};
`,
            java: `class Solution {
    public int maxProfit(int[] prices) {
        int min = Integer.MAX_VALUE, max = 0;
        for (int p : prices) {
            min = Math.min(min, p);
            max = Math.max(max, p - min);
        }
        return max;
    }
}
`,
            javascript: `function maxProfit(prices) {
    let min = Infinity;
    let max = 0;
    for (const p of prices) {
        min = Math.min(min, p);
        max = Math.max(max, p - min);
    }
    return max;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));
`,
        },
    },
    {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        topic: "Sliding Window",
        sheet: "Blind 75",
        leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        companies: ["Amazon", "Google", "Bloomberg"],
        starterCode: {
            python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_len = 0
        for right in range(len(s)):
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1
            char_set.add(s[right])
            max_len = max(max_len, right - left + 1)
        return max_len

print(Solution().lengthOfLongestSubstring("abcabcbb")) # 3
`,
            cpp: `#include <string>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> st;
        int l = 0, ans = 0;
        for (int r = 0; r < s.size(); r++) {
            while (st.count(s[r])) {
                st.erase(s[l++]);
            }
            st.insert(s[r]);
            ans = max(ans, r - l + 1);
        }
        return ans;
    }
};
`,
            java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> set = new HashSet<>();
        int l = 0, res = 0;
        for (int r = 0; r < s.length(); r++) {
            while (set.contains(s.charAt(r))) {
                set.remove(s.charAt(l++));
            }
            set.add(s.charAt(r));
            res = Math.max(res, r - l + 1);
        }
        return res;
    }
}
`,
            javascript: `function lengthOfLongestSubstring(s) {
    const set = new Set();
    let l = 0, max = 0;
    for (let r = 0; r < s.length; r++) {
        while (set.has(s[r])) {
            set.delete(s[l++]);
        }
        set.add(s[r]);
        max = Math.max(max, r - l + 1);
    }
    return max;
}

console.log(lengthOfLongestSubstring("pwwkew")); // 3
`,
        },
    },
    {
        id: 4,
        title: "Valid Parentheses",
        difficulty: "Easy",
        topic: "Stack",
        sheet: "Blind 75",
        leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
        companies: ["Microsoft", "Meta", "Amazon"],
        starterCode: {
            python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        pairs = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in pairs:
                if not stack or stack[-1] != pairs[char]:
                    return False
                stack.pop()
            else:
                stack.append(char)
        return len(stack) == 0

print(Solution().isValid("()[]{}")) # True
`,
            cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                char top = st.top(); st.pop();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) return false;
            }
        }
        return st.empty();
    }
};
`,
            java: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}
`,
            javascript: `function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
        if (pairs[char]) {
            if (stack.pop() !== pairs[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}

console.log(isValid("([{}])")); // true
`,
        },
    },
    {
        id: 5,
        title: "LRU Cache",
        difficulty: "Medium",
        topic: "Design & Linked List",
        sheet: "NeetCode 150",
        leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
        companies: ["Amazon", "Microsoft", "Google", "Apple"],
        starterCode: {
            python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

lru = LRUCache(2)
lru.put(1, 1)
lru.put(2, 2)
print(lru.get(1)) # 1
lru.put(3, 3)     # evicts 2
print(lru.get(2)) # -1
`,
            cpp: `// C++ LRU Cache using Doubly Linked List & Hash Map
#include <unordered_map>
#include <list>
#include <iostream>
using namespace std;

class LRUCache {
    int cap;
    list<pair<int, int>> lru;
    unordered_map<int, list<pair<int, int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}
    
    int get(int key) {
        if (!mp.count(key)) return -1;
        lru.splice(lru.begin(), lru, mp[key]);
        return mp[key]->second;
    }
    
    void put(int key, int value) {
        if (mp.count(key)) {
            mp[key]->second = value;
            lru.splice(lru.begin(), lru, mp[key]);
            return;
        }
        if (lru.size() == cap) {
            mp.erase(lru.back().first);
            lru.pop_back();
        }
        lru.push_front({key, value});
        mp[key] = lru.begin();
    }
};
`,
            java: `import java.util.*;

class LRUCache extends LinkedHashMap<Integer, Integer> {
    private int capacity;
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }
    public int get(int key) {
        return super.getOrDefault(key, -1);
    }
    public void put(int key, int value) {
        super.put(key, value);
    }
    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}
`,
            javascript: `class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();
    }

    get(key) {
        if (!this.map.has(key)) return -1;
        const val = this.map.get(key);
        this.map.delete(key);
        this.map.set(key, val);
        return val;
    }

    put(key, value) {
        if (this.map.has(key)) this.map.delete(key);
        this.map.set(key, value);
        if (this.map.size > this.capacity) {
            const oldestKey = this.map.keys().next().value;
            this.map.delete(oldestKey);
        }
    }
}
`,
        },
    },
    {
        id: 6,
        title: "Trapping Rain Water",
        difficulty: "Hard",
        topic: "Two Pointers",
        sheet: "Blind 75",
        leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
        companies: ["Amazon", "Goldman Sachs", "Google"],
        starterCode: {
            python: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height:
            return 0
        l, r = 0, len(height) - 1
        left_max, right_max = height[l], height[r]
        water = 0
        while l < r:
            if left_max < right_max:
                l += 1
                left_max = max(left_max, height[l])
                water += left_max - height[l]
            else:
                r -= 1
                right_max = max(right_max, height[r])
                water += right_max - height[r]
        return water

print(Solution().trap([0,1,0,2,1,0,1,3,2,1,2,1])) # Output: 6
`,
            cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int lmax = 0, rmax = 0, ans = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= lmax) lmax = height[l];
                else ans += lmax - height[l];
                l++;
            } else {
                if (height[r] >= rmax) rmax = height[r];
                else ans += rmax - height[r];
                r--;
            }
        }
        return ans;
    }
};
`,
            java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1, lmax = 0, rmax = 0, ans = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= lmax) lmax = height[l];
                else ans += lmax - height[l];
                l++;
            } else {
                if (height[r] >= rmax) rmax = height[r];
                else ans += rmax - height[r];
                r--;
            }
        }
        return ans;
    }
}
`,
            javascript: `function trap(height) {
    let l = 0, r = height.length - 1, lmax = 0, rmax = 0, res = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            if (height[l] >= lmax) lmax = height[l];
            else res += lmax - height[l];
            l++;
        } else {
            if (height[r] >= rmax) rmax = height[r];
            else res += rmax - height[r];
            r--;
        }
    }
    return res;
}
`,
        },
    },
    {
        id: 7,
        title: "Coin Change",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        sheet: "Blind 75",
        leetcodeUrl: "https://leetcode.com/problems/coin-change/",
        companies: ["Amazon", "Uber", "Apple"],
        starterCode: {
            python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for c in coins:
            for x in range(c, amount + 1):
                dp[x] = min(dp[x], dp[x - c] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1

print(Solution().coinChange([1, 2, 5], 11)) # Output: 3
`,
            cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int c : coins) {
            for (int x = c; x <= amount; x++) {
                dp[x] = min(dp[x], dp[x - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};
`,
            java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int c : coins) {
            for (int x = c; x <= amount; x++) {
                dp[x] = Math.min(dp[x], dp[x - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
`,
            javascript: `function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const c of coins) {
        for (let x = c; x <= amount; x++) {
            dp[x] = Math.min(dp[x], dp[x - c] + 1);
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChange([1, 2, 5], 11)); // 3
`,
        },
    },
    {
        id: 8,
        title: "Number of Islands",
        difficulty: "Medium",
        topic: "Graphs",
        sheet: "Blind 75",
        leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
        companies: ["Amazon", "Google", "Microsoft", "Meta"],
        starterCode: {
            python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0
        rows, cols = len(grid), len(grid[0])
        count = 0

        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
                return
            grid[r][c] = '0' # mark visited
            dfs(r+1, c)
            dfs(r-1, c)
            dfs(r, c+1)
            dfs(r, c-1)

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    dfs(r, c)
        return count
`,
            cpp: `#include <vector>
using namespace std;

class Solution {
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r+1, c);
        dfs(grid, r-1, c);
        dfs(grid, r, c+1);
        dfs(grid, r, c-1);
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        int cnt = 0;
        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid[0].size(); j++) {
                if (grid[i][j] == '1') {
                    cnt++;
                    dfs(grid, i, j);
                }
            }
        }
        return cnt;
    }
};
`,
            java: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}
`,
            javascript: `function numIslands(grid) {
    let count = 0;
    function dfs(r, c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
        grid[r][c] = '0';
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(i, j);
            }
        }
    }
    return count;
}
`,
        },
    },
];

interface TestPrepSectionProps {
    onSelectProblem: (problem: CodingProblem) => void;
}

export const TestPrepSection: React.FC<TestPrepSectionProps> = ({ onSelectProblem }) => {
    const [selectedSheet, setSelectedSheet] = useState<string>("All");
    const [selectedTopic, setSelectedTopic] = useState<string>("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [solvedMap, setSolvedMap] = useState<Record<number, boolean>>({});

    useEffect(() => {
        try {
            const saved = localStorage.getItem("calvion_solved_problems");
            if (saved) {
                setSolvedMap(JSON.parse(saved));
            }
        } catch {
            // ignore
        }
    }, []);

    const toggleSolved = (id: number) => {
        const next = { ...solvedMap, [id]: !solvedMap[id] };
        setSolvedMap(next);
        try {
            localStorage.setItem("calvion_solved_problems", JSON.stringify(next));
        } catch {
            // ignore
        }
    };

    const topics = [
        "All",
        "Arrays & Hashing",
        "Sliding Window",
        "Two Pointers",
        "Stack",
        "Graphs",
        "Dynamic Programming",
        "Design & Linked List",
    ];

    const sheets = ["All", "Blind 75", "NeetCode 150", "SDE Sheet"];
    const difficulties = ["All", "Easy", "Medium", "Hard"];

    const filteredProblems = PROBLEMS.filter((p) => {
        const matchesSheet = selectedSheet === "All" || p.sheet === selectedSheet;
        const matchesTopic = selectedTopic === "All" || p.topic === selectedTopic;
        const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
        const matchesSearch =
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.companies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
            p.topic.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSheet && matchesTopic && matchesDiff && matchesSearch;
    });

    const solvedCount = Object.values(solvedMap).filter(Boolean).length;
    const progressPercent = Math.round((solvedCount / PROBLEMS.length) * 100);

    return (
        <div className="space-y-6">
            {/* PROGRESS BANNER */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                            <Flame size={13} />
                            <span>Interview Readiness Roadmap</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                            Master Core Data Structures & Algorithms
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                            Curated high-yield coding questions frequently asked by FAANG, Tier-1 startups, and tech giants.
                        </p>
                    </div>

                    {/* PROGRESS BAR WIDGET */}
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-black/80 rounded-2xl border border-slate-200 dark:border-neutral-800 p-4 min-w-[240px]">
                        <div className="flex-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                                <span>Prep Progress</span>
                                <span>{solvedCount} / {PROBLEMS.length} ({progressPercent}%)</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-800">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTROLS & FILTERS */}
            <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* SEARCH INPUT */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by problem name or company (e.g. Google)..."
                            className="h-10 w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-cyan-500"
                        />
                    </div>

                    {/* SHEET SELECTOR */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {sheets.map((sheet) => (
                            <button
                                key={sheet}
                                type="button"
                                onClick={() => setSelectedSheet(sheet)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                                    selectedSheet === sheet
                                        ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                                        : "border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                                }`}
                            >
                                {sheet}
                            </button>
                        ))}
                    </div>

                    {/* DIFFICULTY FILTER */}
                    <div className="flex items-center gap-1.5">
                        {difficulties.map((diff) => (
                            <button
                                key={diff}
                                type="button"
                                onClick={() => setSelectedDifficulty(diff)}
                                className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
                                    selectedDifficulty === diff
                                        ? "bg-cyan-500 text-white shadow-sm"
                                        : "border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                                }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TOPIC CHIPS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {topics.map((top) => (
                        <button
                            key={top}
                            type="button"
                            onClick={() => setSelectedTopic(top)}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition whitespace-nowrap ${
                                selectedTopic === top
                                    ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40"
                                    : "bg-slate-100 dark:bg-black/60 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700"
                            }`}
                        >
                            {top}
                        </button>
                    ))}
                </div>
            </div>

            {/* PROBLEM LIST */}
            <div className="rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-neutral-800/80">
                    {filteredProblems.length === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-400 dark:text-neutral-500">
                            No problems match your filters. Try clearing your search query.
                        </div>
                    ) : (
                        filteredProblems.map((p) => {
                            const isSolved = !!solvedMap[p.id];
                            return (
                                <div
                                    key={p.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 transition hover:bg-slate-50/70 dark:hover:bg-black/50"
                                >
                                    {/* STATUS & TITLE */}
                                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                                        <button
                                            type="button"
                                            onClick={() => toggleSolved(p.id)}
                                            className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-500 dark:text-neutral-600 dark:hover:text-emerald-400 transition"
                                            title={isSolved ? "Mark as Incomplete" : "Mark as Solved"}
                                        >
                                            {isSolved ? (
                                                <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-500/20" />
                                            ) : (
                                                <Circle size={18} />
                                            )}
                                        </button>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`text-sm font-bold truncate ${isSolved ? "text-slate-400 dark:text-neutral-500 line-through" : "text-slate-900 dark:text-white"}`}>
                                                    {p.id}. {p.title}
                                                </h3>
                                                {/* DIFFICULTY */}
                                                <span
                                                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                        p.difficulty === "Easy"
                                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                            : p.difficulty === "Medium"
                                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                                    }`}
                                                >
                                                    {p.difficulty}
                                                </span>
                                            </div>

                                            {/* TOPIC & COMPANIES */}
                                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                                <span className="text-[11px] font-medium text-slate-500 dark:text-neutral-400">
                                                    {p.topic}
                                                </span>
                                                <span className="text-slate-300 dark:text-neutral-700">•</span>
                                                <div className="flex items-center gap-1">
                                                    <Building2 size={11} className="text-slate-400" />
                                                    <span className="text-[10px] text-slate-400 dark:text-neutral-500">
                                                        {p.companies.join(", ")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        {/* SOLVE IN CALVION EDITOR */}
                                        <button
                                            type="button"
                                            onClick={() => onSelectProblem(p)}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition shadow-sm"
                                        >
                                            <Play size={11} className="fill-current" />
                                            <span>Solve in Editor</span>
                                        </button>

                                        {/* LEETCODE LINK */}
                                        <a
                                            href={p.leetcodeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-neutral-300 hover:text-cyan-500 transition shadow-sm"
                                            title="Open on LeetCode"
                                        >
                                            <span>LeetCode</span>
                                            <ExternalLink size={12} className="opacity-60" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestPrepSection;
