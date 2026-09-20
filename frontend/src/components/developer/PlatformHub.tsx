import React, { useState } from "react";
import {
    ExternalLink,
    Trophy,
    Calendar,
    Search,
    Flame,
    Target,
} from "lucide-react";

interface Platform {
    id: string;
    name: string;
    category: "Competitive" | "Interview Prep" | "Foundations" | "Data Science";
    difficulty: "All Levels" | "Beginner Friendly" | "Advanced / Hardcore" | "Intermediate";
    description: string;
    accentColor: string;
    url: string;
    contestsUrl: string;
    problemsUrl: string;
    features: string[];
    badge?: string;
}

const PLATFORMS: Platform[] = [
    {
        id: "leetcode",
        name: "LeetCode",
        category: "Interview Prep",
        difficulty: "All Levels",
        description: "The premier platform for technical interviews, DSA, and weekly/bi-weekly rated contests.",
        accentColor: "from-amber-500 to-orange-600",
        url: "https://leetcode.com",
        contestsUrl: "https://leetcode.com/contest/",
        problemsUrl: "https://leetcode.com/problemset/all/",
        features: ["3000+ Questions", "Weekly & Biweekly Contests", "Company Tags", "Active Discussion"],
        badge: "Most Popular",
    },
    {
        id: "codeforces",
        name: "Codeforces",
        category: "Competitive",
        difficulty: "Advanced / Hardcore",
        description: "Global standard for competitive programming, fast rated rounds (Div 1 to Div 4) and Elo ratings.",
        accentColor: "from-red-500 to-rose-600",
        url: "https://codeforces.com",
        contestsUrl: "https://codeforces.com/contests",
        problemsUrl: "https://codeforces.com/problemset",
        features: ["Global Leaderboards", "Frequent Rated Contests", "Candidate Master / GM Rank", "Virtual Contests"],
        badge: "Hardcore CP",
    },
    {
        id: "codechef",
        name: "CodeChef",
        category: "Competitive",
        difficulty: "All Levels",
        description: "Indian & global competitive programming platform featuring Starters, Cook-Off, and Lunchtime rounds.",
        accentColor: "from-amber-700 to-yellow-800",
        url: "https://www.codechef.com",
        contestsUrl: "https://www.codechef.com/contests",
        problemsUrl: "https://www.codechef.com/practice",
        features: ["Star Ratings (1★-7★)", "College & Global Contests", "Video Editorials", "Topic Ladders"],
    },
    {
        id: "hackerrank",
        name: "HackerRank",
        category: "Interview Prep",
        difficulty: "Beginner Friendly",
        description: "Ideal for beginners learning language fundamentals, interview preparation kits, and company screening tests.",
        accentColor: "from-emerald-500 to-green-600",
        url: "https://www.hackerrank.com",
        contestsUrl: "https://www.hackerrank.com/contests",
        problemsUrl: "https://www.hackerrank.com/domains",
        features: ["Skill Certifications", "Language Specific Tracks", "Company Assessments", "Interview Prep Kits"],
    },
    {
        id: "geeksforgeeks",
        name: "GeeksforGeeks",
        category: "Foundations",
        difficulty: "All Levels",
        description: "Comprehensive tutorials, computer science subjects, core CS concepts, and Problem of the Day (POTD).",
        accentColor: "from-green-600 to-teal-700",
        url: "https://www.geeksforgeeks.org",
        contestsUrl: "https://practice.geeksforgeeks.org/events",
        problemsUrl: "https://practice.geeksforgeeks.org/explore",
        features: ["Problem of the Day (POTD)", "Article Explanations", "SDE Sheet", "Company Interview Archives"],
        badge: "Best DSA Theory",
    },
    {
        id: "atcoder",
        name: "AtCoder",
        category: "Competitive",
        difficulty: "Intermediate",
        description: "High quality Japanese competitive programming platform known for elegant math and algorithmic problems.",
        accentColor: "from-slate-700 to-zinc-900",
        url: "https://atcoder.jp",
        contestsUrl: "https://atcoder.jp/contests/",
        problemsUrl: "https://kenkoooo.com/atcoder/#/table/",
        features: ["ABC/ARC/AGC Contests", "High Quality Problem Design", "Detailed Editorials", "Clean Rating System"],
    },
    {
        id: "cses",
        name: "CSES Problem Set",
        category: "Foundations",
        difficulty: "Intermediate",
        description: "The gold-standard curated collection of 300 classic algorithmic problems covering DP, Trees, and Graphs.",
        accentColor: "from-blue-600 to-cyan-700",
        url: "https://cses.fi/problemset/",
        contestsUrl: "https://cses.fi",
        problemsUrl: "https://cses.fi/problemset/list/",
        features: ["Zero Boilerplate", "Pure Algorithm Drills", "Clean Test Cases", "Essential for ICPC"],
        badge: "ICPC Essential",
    },
    {
        id: "kaggle",
        name: "Kaggle",
        category: "Data Science",
        difficulty: "Intermediate",
        description: "The world's largest data science & machine learning competition platform with notebooks and datasets.",
        accentColor: "from-sky-500 to-blue-600",
        url: "https://www.kaggle.com",
        contestsUrl: "https://www.kaggle.com/competitions",
        problemsUrl: "https://www.kaggle.com/datasets",
        features: ["Grandmaster Tiers", "Free GPU Compute", "Real World Industry Data", "Prize Pools"],
    },
];

export const PlatformHub: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = ["All", "Interview Prep", "Competitive", "Foundations", "Data Science"];

    const filteredPlatforms = PLATFORMS.filter((p) => {
        const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* HERO BANNER & QUICK STATS */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-neutral-800 bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/60 dark:from-[#0c0c0e] dark:via-black dark:to-neutral-900 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-3">
                            <Trophy size={13} />
                            <span>Competitive Coding & Interview Launchpad</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Connect to the World&apos;s Top Coding Arenas
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                            Access live contests, rating leaderboards, problem archives, and company-specific question sets across all major platforms directly from your Calvion workspace.
                        </p>
                    </div>

                    {/* CONTEST TRACKER QUICK SHORTCUT */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="https://clist.by"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 py-3 text-xs font-bold text-slate-800 dark:text-neutral-200 shadow-sm hover:border-cyan-500 hover:text-cyan-500 transition"
                        >
                            <Calendar size={15} className="text-cyan-500" />
                            <span>Live Contest Calendar (CLIST)</span>
                            <ExternalLink size={12} className="opacity-60" />
                        </a>
                        <a
                            href="https://leetcode.com/contest/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:from-amber-600 hover:to-orange-700 transition"
                        >
                            <Flame size={15} />
                            <span>Upcoming LeetCode Contests</span>
                            <ExternalLink size={12} className="opacity-60" />
                        </a>
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* SEARCH */}
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search platform by name, tag, or contest type..."
                        className="h-11 w-full rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                    />
                </div>

                {/* CATEGORY PILLS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                                selectedCategory === cat
                                    ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm"
                                    : "border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* PLATFORMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {filteredPlatforms.map((p) => (
                    <div
                        key={p.id}
                        className="group flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl dark:hover:shadow-cyan-950/20"
                    >
                        <div>
                            {/* HEADER */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${p.accentColor} text-white shadow-md shadow-slate-900/10 font-black text-sm`}>
                                    {p.name.substring(0, 2).toUpperCase()}
                                </div>
                                {p.badge && (
                                    <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                                        {p.badge}
                                    </span>
                                )}
                            </div>

                            {/* TITLE & CATEGORY */}
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{p.name}</span>
                            </h3>

                            <div className="mt-1 flex items-center gap-2">
                                <span className="rounded-md bg-slate-100 dark:bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-neutral-300">
                                    {p.category}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-neutral-500">•</span>
                                <span className="text-[10px] font-medium text-slate-500 dark:text-neutral-400">
                                    {p.difficulty}
                                </span>
                            </div>

                            {/* DESCRIPTION */}
                            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-neutral-400 line-clamp-3">
                                {p.description}
                            </p>

                            {/* FEATURE TAGS */}
                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {p.features.map((feat, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-lg border border-slate-100 dark:border-neutral-800/80 bg-slate-50 dark:bg-black/60 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-neutral-300"
                                    >
                                        {feat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <a
                                    href={p.problemsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 transition"
                                >
                                    <Target size={12} />
                                    <span>Problems</span>
                                </a>
                                <span className="text-slate-300 dark:text-neutral-700">|</span>
                                <a
                                    href={p.contestsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 transition"
                                >
                                    <Trophy size={12} />
                                    <span>Contests</span>
                                </a>
                            </div>

                            <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-200 hover:bg-cyan-500 hover:text-white transition shadow-sm"
                                title={`Open ${p.name}`}
                            >
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlatformHub;
