import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Terminal,
    Trophy,
    BookOpen,
    ArrowLeft,
    UserPlus,
    LogIn,
    Lock,
} from "lucide-react";
import CodeEditor from "../../components/developer/CodeEditor";
import PlatformHub from "../../components/developer/PlatformHub";
import TestPrepSection from "../../components/developer/TestPrepSection";
import type { CodingProblem } from "../../components/developer/TestPrepSection";

type DeveloperTab = "editor" | "platforms" | "prep";

export const DeveloperHub: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<DeveloperTab>("editor");
    const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);

    // Check if user is logged in
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userJson = localStorage.getItem("user") || sessionStorage.getItem("user");
    let user: any = null;
    try {
        if (userJson) user = JSON.parse(userJson);
    } catch {
        // ignore
    }

    const handleSelectProblem = (problem: CodingProblem) => {
        setSelectedProblem(problem);
        setActiveTab("editor");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-neutral-100 transition-colors duration-200">
            {/* TOP NAVIGATION BAR */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* LEFT: BACK & BRAND */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="group flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:text-cyan-500 transition"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            <span>Home</span>
                        </button>

                        <div className="h-6 w-px bg-slate-200 dark:bg-neutral-800" />

                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm font-mono font-bold text-sm">
                                &lt;/&gt;
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                        Calvion Developer Hub
                                    </h1>
                                    <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.2 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                                        v1.0
                                    </span>
                                </div>
                                <p className="hidden text-[10px] text-slate-400 dark:text-neutral-500 sm:block">
                                    Competitive Coding, In-Browser Sandbox & DSA Prep
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CENTER: TAB NAVIGATION */}
                    <div className="hidden md:flex items-center rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-100/80 dark:bg-[#0c0c0e] p-1 gap-1 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setActiveTab("editor")}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                                activeTab === "editor"
                                    ? "bg-white text-slate-900 dark:bg-neutral-900 dark:text-white shadow-sm"
                                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <Terminal size={14} className={activeTab === "editor" ? "text-cyan-500" : ""} />
                            <span>Code Playground</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("platforms")}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                                activeTab === "platforms"
                                    ? "bg-white text-slate-900 dark:bg-neutral-900 dark:text-white shadow-sm"
                                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <Trophy size={14} className={activeTab === "platforms" ? "text-amber-500" : ""} />
                            <span>Competitive Platforms</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("prep")}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                                activeTab === "prep"
                                    ? "bg-white text-slate-900 dark:bg-neutral-900 dark:text-white shadow-sm"
                                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <BookOpen size={14} className={activeTab === "prep" ? "text-emerald-500" : ""} />
                            <span>Coding Test Prep</span>
                        </button>
                    </div>

                    {/* RIGHT: AUTH STATUS */}
                    <div className="flex items-center gap-2">
                        {token && user ? (
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-neutral-200 hover:border-cyan-500 transition"
                            >
                                <div className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-[10px]">
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="hidden sm:inline">{user.name || "Vault Connected"}</span>
                                <Lock size={12} className="text-emerald-500" />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
                                >
                                    <LogIn size={13} />
                                    <span>Sign In</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:from-cyan-600 hover:to-blue-700 transition"
                                >
                                    <UserPlus size={13} />
                                    <span>Create Account</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* MOBILE TAB SWITCHER */}
                <div className="flex md:hidden border-t border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black p-2 gap-1 overflow-x-auto text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => setActiveTab("editor")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 ${
                            activeTab === "editor"
                                ? "bg-white dark:bg-neutral-900 text-cyan-600 dark:text-cyan-400 shadow-sm"
                                : "text-slate-600 dark:text-neutral-400"
                        }`}
                    >
                        <Terminal size={14} />
                        <span>Editor</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("platforms")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 ${
                            activeTab === "platforms"
                                ? "bg-white dark:bg-neutral-900 text-amber-600 dark:text-amber-400 shadow-sm"
                                : "text-slate-600 dark:text-neutral-400"
                        }`}
                    >
                        <Trophy size={14} />
                        <span>Platforms</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("prep")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 ${
                            activeTab === "prep"
                                ? "bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                : "text-slate-600 dark:text-neutral-400"
                        }`}
                    >
                        <BookOpen size={14} />
                        <span>DSA Prep</span>
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="mx-auto max-w-[1700px] px-3 py-4 sm:px-6 lg:px-8">
                {activeTab === "editor" && (
                    <div className="space-y-4">
                        <CodeEditor
                            initialCode={selectedProblem ? selectedProblem.starterCode.python : undefined}
                            initialLanguage="python"
                            problemTitle={selectedProblem ? `${selectedProblem.id}. ${selectedProblem.title}` : undefined}
                            activeProblem={selectedProblem}
                            onSelectProblem={setSelectedProblem}
                        />
                    </div>
                )}

                {activeTab === "platforms" && <PlatformHub />}

                {activeTab === "prep" && <TestPrepSection onSelectProblem={handleSelectProblem} />}
            </main>
        </div>
    );
};

export default DeveloperHub;
