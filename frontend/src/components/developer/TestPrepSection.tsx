import React, { useState, useEffect, useMemo } from "react";
import {
    CheckCircle2,
    Circle,
    ExternalLink,
    Play,
    Search,
    Flame,
    Building2,
    Layers,
    BookOpen,
    Sparkles,
} from "lucide-react";
import { PROBLEMS, type CodingProblem } from "./problemsData";

export { PROBLEMS, type CodingProblem };

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
        "Two Pointers",
        "Sliding Window",
        "Stack & Queue",
        "Binary Search",
        "Linked List",
        "Trees & BST",
        "Tries",
        "Heap / Priority Queue",
        "Backtracking",
        "Graphs",
        "Dynamic Programming",
        "Greedy",
        "Intervals",
        "Matrix & Math",
        "Bit Manipulation",
    ];

    const sheets = ["All", "Blind 75", "NeetCode 150", "SDE Sheet"];
    const difficulties = ["All", "Easy", "Medium", "Hard"];

    // Count problems per sheet
    const sheetCounts = useMemo(() => {
        const counts: Record<string, number> = {
            All: PROBLEMS.length,
            "Blind 75": 0,
            "NeetCode 150": 0,
            "SDE Sheet": 0,
        };
        for (const p of PROBLEMS) {
            if (p.sheets?.includes("Blind 75") || p.sheet === "Blind 75") counts["Blind 75"]++;
            if (p.sheets?.includes("NeetCode 150") || p.sheet === "NeetCode 150") counts["NeetCode 150"]++;
            if (p.sheets?.includes("SDE Sheet") || p.sheet === "SDE Sheet") counts["SDE Sheet"]++;
        }
        return counts;
    }, []);

    const filteredProblems = useMemo(() => {
        return PROBLEMS.filter((p) => {
            const matchesSheet =
                selectedSheet === "All" ||
                p.sheet === selectedSheet ||
                (p.sheets && p.sheets.includes(selectedSheet));
            const matchesTopic = selectedTopic === "All" || p.topic === selectedTopic;
            const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                p.title.toLowerCase().includes(q) ||
                p.companies.some((c) => c.toLowerCase().includes(q)) ||
                p.topic.toLowerCase().includes(q);
            return matchesSheet && matchesTopic && matchesDiff && matchesSearch;
        });
    }, [selectedSheet, selectedTopic, selectedDifficulty, searchQuery]);

    const solvedCount = Object.values(solvedMap).filter(Boolean).length;
    const progressPercent = Math.round((solvedCount / PROBLEMS.length) * 100);

    return (
        <div className="space-y-6">
            {/* HERO BANNER & STATS */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-3 border border-cyan-500/20">
                            <Flame size={13} />
                            <span>Comprehensive DSA Preparation Hub</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Blind 75 • NeetCode 150 • Striver&apos;s SDE Sheet
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
                            Master all canonical interview questions with built-in code editor runner, company tags, pattern categorization, and multi-language test harnesses.
                        </p>

                        {/* SHEET PILL BADGES */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-neutral-300">
                                <Layers size={13} className="text-cyan-500" />
                                <span>Blind 75:</span>
                                <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">{sheetCounts["Blind 75"]} Problems</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-neutral-300">
                                <Sparkles size={13} className="text-amber-500" />
                                <span>NeetCode 150:</span>
                                <span className="text-amber-600 dark:text-amber-400 font-extrabold">{sheetCounts["NeetCode 150"]} Problems</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-neutral-300">
                                <BookOpen size={13} className="text-emerald-500" />
                                <span>SDE Sheet:</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{sheetCounts["SDE Sheet"]} Problems</span>
                            </div>
                        </div>
                    </div>

                    {/* PROGRESS BAR WIDGET */}
                    <div className="flex flex-col justify-between bg-slate-50 dark:bg-black/80 rounded-2xl border border-slate-200 dark:border-neutral-800 p-5 min-w-[260px] shadow-sm">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-neutral-300 mb-2">
                            <span>Total Prep Solved</span>
                            <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">
                                {solvedCount} / {PROBLEMS.length} ({progressPercent}%)
                            </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <p className="mt-3 text-[11px] text-slate-400 dark:text-neutral-500 text-center">
                            Track checkmarks as you solve. Saved to your browser.
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTROLS & FILTERS */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* SEARCH INPUT */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by problem name or company (e.g. Google, Amazon)..."
                            className="h-11 w-full rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                        />
                    </div>

                    {/* SHEET SELECTOR */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {sheets.map((sheet) => (
                            <button
                                key={sheet}
                                type="button"
                                onClick={() => setSelectedSheet(sheet)}
                                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                                    selectedSheet === sheet
                                        ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm"
                                        : "border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                                }`}
                            >
                                <span>{sheet}</span>
                                <span className="ml-1.5 opacity-70 text-[10.5px]">
                                    ({sheetCounts[sheet] ?? 0})
                                </span>
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
                                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
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
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {topics.map((top) => (
                        <button
                            key={top}
                            type="button"
                            onClick={() => setSelectedTopic(top)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                                selectedTopic === top
                                    ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40"
                                    : "bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700"
                            }`}
                        >
                            {top}
                        </button>
                    ))}
                </div>
            </div>

            {/* PROBLEM LIST */}
            <div className="rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] shadow-sm overflow-hidden">
                <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-neutral-400">
                    <span>Showing {filteredProblems.length} Problems</span>
                    <span>Click &quot;Solve in Editor&quot; to test in Python, C++, Java, or JS</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-neutral-800/80 max-h-[750px] overflow-y-auto">
                    {filteredProblems.length === 0 ? (
                        <div className="py-16 text-center text-xs text-slate-400 dark:text-neutral-500">
                            No problems match your filters. Try clearing your search query or topic filter.
                        </div>
                    ) : (
                        filteredProblems.map((p) => {
                            const isSolved = !!solvedMap[p.id];
                            return (
                                <div
                                    key={p.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 transition hover:bg-slate-50/70 dark:hover:bg-white/[0.02]"
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
                                                <CheckCircle2 size={19} className="text-emerald-500 fill-emerald-500/20" />
                                            ) : (
                                                <Circle size={19} />
                                            )}
                                        </button>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className={`text-sm font-bold truncate ${isSolved ? "text-slate-400 dark:text-neutral-500 line-through" : "text-slate-900 dark:text-white"}`}>
                                                    {p.id}. {p.title}
                                                </h3>

                                                {/* DIFFICULTY */}
                                                <span
                                                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                        p.difficulty === "Easy"
                                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                                            : p.difficulty === "Medium"
                                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                                    }`}
                                                >
                                                    {p.difficulty}
                                                </span>

                                                {/* SHEET BADGES */}
                                                {p.sheets?.map((s) => (
                                                    <span
                                                        key={s}
                                                        className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-bold ${
                                                            s === "Blind 75"
                                                                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                                                                : s === "NeetCode 150"
                                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                                        }`}
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
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
                                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                        {/* SOLVE IN CALVION EDITOR */}
                                        <button
                                            type="button"
                                            onClick={() => onSelectProblem(p)}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition shadow-sm"
                                        >
                                            <Play size={12} className="fill-current" />
                                            <span>Solve in Editor</span>
                                        </button>

                                        {/* LEETCODE LINK */}
                                        <a
                                            href={p.leetcodeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-bold text-slate-600 dark:text-neutral-300 hover:text-cyan-500 transition shadow-sm"
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
