import React, { useState } from "react";
import {
    ExternalLink,
    Trophy,
    Calendar,
    Search,
    Flame,
    Target,
    ArrowRight,
    Code2,
    Award,
    Terminal,
    Sparkles,
    Database,
    Globe,
} from "lucide-react";

interface Platform {
    id: string;
    name: string;
    category: "Competitive" | "Interview Prep" | "Foundations" | "Data Science";
    difficulty: "All Levels" | "Beginner Friendly" | "Advanced / Hardcore" | "Intermediate";
    description: string;
    icon: React.ElementType;
    iconBg: string;
    iconText: string;
    iconBorder: string;
    hoverBorder: string;
    actionText: string;
    actionLabel: string;
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
        icon: Code2,
        iconBg: "bg-amber-500/10",
        iconText: "text-amber-600 dark:text-amber-400",
        iconBorder: "border-amber-500/20",
        hoverBorder: "hover:border-amber-500/40",
        actionText: "text-amber-600 dark:text-amber-400",
        actionLabel: "Launch LeetCode",
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
        icon: Trophy,
        iconBg: "bg-rose-500/10",
        iconText: "text-rose-600 dark:text-rose-400",
        iconBorder: "border-rose-500/20",
        hoverBorder: "hover:border-rose-500/40",
        actionText: "text-rose-600 dark:text-rose-400",
        actionLabel: "Launch Codeforces",
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
        icon: Award,
        iconBg: "bg-orange-500/10",
        iconText: "text-orange-600 dark:text-orange-400",
        iconBorder: "border-orange-500/20",
        hoverBorder: "hover:border-orange-500/40",
        actionText: "text-orange-600 dark:text-orange-400",
        actionLabel: "Launch CodeChef",
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
        icon: Terminal,
        iconBg: "bg-emerald-500/10",
        iconText: "text-emerald-600 dark:text-emerald-400",
        iconBorder: "border-emerald-500/20",
        hoverBorder: "hover:border-emerald-500/40",
        actionText: "text-emerald-600 dark:text-emerald-400",
        actionLabel: "Launch HackerRank",
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
        icon: Sparkles,
        iconBg: "bg-teal-500/10",
        iconText: "text-teal-600 dark:text-teal-400",
        iconBorder: "border-teal-500/20",
        hoverBorder: "hover:border-teal-500/40",
        actionText: "text-teal-600 dark:text-teal-400",
        actionLabel: "Launch GeeksforGeeks",
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
        icon: Target,
        iconBg: "bg-indigo-500/10",
        iconText: "text-indigo-600 dark:text-indigo-400",
        iconBorder: "border-indigo-500/20",
        hoverBorder: "hover:border-indigo-500/40",
        actionText: "text-indigo-600 dark:text-indigo-400",
        actionLabel: "Launch AtCoder",
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
        icon: Database,
        iconBg: "bg-blue-500/10",
        iconText: "text-blue-600 dark:text-blue-400",
        iconBorder: "border-blue-500/20",
        hoverBorder: "hover:border-blue-500/40",
        actionText: "text-blue-600 dark:text-blue-400",
        actionLabel: "Launch CSES Set",
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
        icon: Globe,
        iconBg: "bg-cyan-500/10",
        iconText: "text-cyan-600 dark:text-cyan-400",
        iconBorder: "border-cyan-500/20",
        hoverBorder: "hover:border-cyan-500/40",
        actionText: "text-cyan-600 dark:text-cyan-400",
        actionLabel: "Launch Kaggle ML",
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
                            <span>Competitive Coding &amp; Interview Launchpad</span>
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

            {/* PLATFORMS GRID - HARMONIZED WITH HOME PAGE CARD FORMAT */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredPlatforms.map((p) => {
                    const Icon = p.icon;
                    return (
                        <div
                            key={p.id}
                            onClick={() => window.open(p.url, "_blank")}
                            className={`
                                cursor-pointer
                                rounded-3xl
                                border
                                border-slate-200/80
                                dark:border-neutral-800
                                bg-white
                                dark:bg-[#0c0c0e]
                                p-6
                                sm:p-8
                                flex
                                flex-col
                                justify-between
                                ${p.hoverBorder}
                                hover:shadow-md
                                dark:hover:shadow-none
                                transition
                                group
                                shadow-sm
                                dark:shadow-none
                            `}
                        >
                            <div>
                                {/* TOP ROW: ICON BADGE & OPTIONAL TAG */}
                                <div className="flex items-center justify-between mb-5">
                                    <div
                                        className={`
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            ${p.iconBg}
                                            ${p.iconText}
                                            border
                                            ${p.iconBorder}
                                        `}
                                    >
                                        <Icon size={24} />
                                    </div>

                                    {p.badge && (
                                        <span
                                            className={`
                                                rounded-full
                                                ${p.iconBg}
                                                ${p.iconText}
                                                border
                                                ${p.iconBorder}
                                                px-3
                                                py-1
                                                text-[11px]
                                                font-bold
                                            `}
                                        >
                                            {p.badge}
                                        </span>
                                    )}
                                </div>

                                {/* TITLE */}
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {p.name}
                                </h3>

                                {/* CATEGORY & DIFFICULTY */}
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className="rounded-md bg-slate-100 dark:bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-neutral-300 border border-slate-200/60 dark:border-neutral-800">
                                        {p.category}
                                    </span>
                                    <span className="text-[11px] text-slate-400 dark:text-neutral-500">•</span>
                                    <span className="text-[11px] font-medium text-slate-500 dark:text-neutral-400">
                                        {p.difficulty}
                                    </span>
                                </div>

                                {/* DESCRIPTION */}
                                <p className="mt-3 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                                    {p.description}
                                </p>

                                {/* FEATURE PILLS */}
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {p.features.map((feat, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-lg border border-slate-100 dark:border-neutral-800/80 bg-slate-50 dark:bg-black/60 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-neutral-300"
                                        >
                                            {feat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* FOOTER ACTION BAR */}
                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                                    <a
                                        href={p.problemsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:text-cyan-600 dark:hover:text-cyan-400 transition"
                                    >
                                        Problems
                                    </a>
                                    <span className="text-slate-300 dark:text-neutral-700">|</span>
                                    <a
                                        href={p.contestsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:text-cyan-600 dark:hover:text-cyan-400 transition"
                                    >
                                        Contests
                                    </a>
                                </div>

                                <div
                                    className={`
                                        flex
                                        items-center
                                        gap-1.5
                                        text-xs
                                        ${p.actionText}
                                        font-bold
                                        group-hover:translate-x-1
                                        transition-transform
                                    `}
                                >
                                    <span>{p.actionLabel}</span>
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlatformHub;
