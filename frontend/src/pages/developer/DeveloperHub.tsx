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
    Sun,
    Moon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import CodeEditor from "../../components/developer/CodeEditor";
import PlatformHub from "../../components/developer/PlatformHub";
import TestPrepSection from "../../components/developer/TestPrepSection";
import type { CodingProblem } from "../../components/developer/TestPrepSection";

type DeveloperTab = "editor" | "platforms" | "prep";

export const DeveloperHub: React.FC = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
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
            <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#07090e] shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200">

                <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-3 sm:px-5 lg:px-7">
                    {/* LEFT: BACK BUTTON & BRAND */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="group flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                            title="Return to Calvion Home"
                        >
                            <ArrowLeft size={13} className="text-slate-400 dark:text-neutral-400 group-hover:text-cyan-500 group-hover:-translate-x-0.5 transition-all duration-200" />
                            <span className="hidden sm:inline">Home</span>
                        </button>
                    </div>

                    {/* CENTER: TAB NAVIGATION */}
                    <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-neutral-900/90 border border-slate-200/80 dark:border-neutral-800 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setActiveTab("editor")}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${activeTab === "editor"
                                ? "bg-white dark:bg-[#161922] text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/[0.08]"
                                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-neutral-800/50"
                                }`}
                        >
                            <div className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors ${activeTab === "editor" ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-neutral-500"
                                }`}>
                                <Terminal size={13} />
                            </div>
                            <span>Code Playground</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("platforms")}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${activeTab === "platforms"
                                ? "bg-white dark:bg-[#161922] text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/[0.08]"
                                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-neutral-800/50"
                                }`}
                        >
                            <div className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors ${activeTab === "platforms" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-neutral-500"
                                }`}>
                                <Trophy size={13} />
                            </div>
                            <span>Competitive Platforms</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("prep")}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${activeTab === "prep"
                                ? "bg-white dark:bg-[#161922] text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/[0.08]"
                                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-neutral-800/50"
                                }`}
                        >
                            <div className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors ${activeTab === "prep" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-neutral-500"
                                }`}>
                                <BookOpen size={13} />
                            </div>
                            <span>Coding Test Prep</span>
                        </button>
                    </nav>

                    {/* RIGHT: AUTH STATUS & THEME TOGGLE */}
                    <div className="flex items-center gap-2">
                        {/* THEME TOGGLE BUTTON */}
                        <button
                            type="button"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#12141c] text-slate-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 shadow-sm transition-all duration-200"
                            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? (
                                <Sun size={15} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
                            ) : (
                                <Moon size={15} className="text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
                            )}
                        </button>

                        <div className="h-5 w-px bg-slate-200/80 dark:bg-neutral-800" />

                        {token && user ? (
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="group flex h-9 items-center gap-2 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#12141c] px-3 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-neutral-800/80 transition-all duration-200 shadow-sm"
                            >
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-[10px] shadow-sm">
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="hidden sm:inline font-medium text-slate-800 dark:text-neutral-200">{user.name || "Vault"}</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" title="Connected" />
                                <Lock size={12} className="text-slate-400 group-hover:text-cyan-500 transition-colors ml-0.5" />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#12141c] px-3.5 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 transition-all duration-200 shadow-sm"
                                >
                                    <LogIn size={13} className="text-slate-400 dark:text-neutral-400" />
                                    <span>Sign In</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="group relative inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-3.5 text-xs font-semibold text-white shadow-sm shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.98] transition-all duration-200"
                                >
                                    <UserPlus size={13} className="group-hover:scale-110 transition-transform duration-200" />
                                    <span>Create Account</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* MOBILE TAB SWITCHER */}
                <div className="flex md:hidden border-t border-slate-200/80 dark:border-neutral-800 bg-white/90 dark:bg-[#090b10]/95 backdrop-blur-md p-1.5 gap-1 overflow-x-auto text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => setActiveTab("editor")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all duration-200 ${activeTab === "editor"
                            ? "bg-slate-100 dark:bg-neutral-800 text-cyan-600 dark:text-cyan-400 shadow-sm font-bold"
                            : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        <Terminal size={14} />
                        <span>Editor</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("platforms")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all duration-200 ${activeTab === "platforms"
                            ? "bg-slate-100 dark:bg-neutral-800 text-amber-600 dark:text-amber-400 shadow-sm font-bold"
                            : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        <Trophy size={14} />
                        <span>Platforms</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("prep")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all duration-200 ${activeTab === "prep"
                            ? "bg-slate-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold"
                            : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        <BookOpen size={14} />
                        <span>DSA Prep</span>
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main
                className={
                    activeTab === "editor"
                        ? "mx-auto max-w-[1920px] px-2 py-2 sm:px-4 sm:py-2.5 h-[calc(100vh-4.25rem)] flex flex-col overflow-hidden"
                        : "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
                }
            >
                {activeTab === "editor" && (
                    <div className="h-full w-full flex-1 min-h-0">
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
