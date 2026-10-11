import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";


/* =========================================================
   PROPS
========================================================= */

interface AuthHeaderProps {
    /** Path to navigate back to. Defaults to "/" */
    backTo?: string;
    /** Label shown next to the back arrow */
    backLabel?: string;
    /** Optional right-side action button */
    rightAction?: {
        label: string;
        hint?: string;
        onClick: () => void;
    };
}


/* =========================================================
   COMPONENT
========================================================= */

export default function AuthHeader({
    backTo = "/",
    backLabel = "Home",
    rightAction,
}: AuthHeaderProps) {

    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200">
            <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">

                {/* LEFT: BACK + BRAND */}
                <div className="flex items-center gap-2.5 sm:gap-3.5">

                    {/* BACK BUTTON */}
                    <button
                        type="button"
                        onClick={() => navigate(backTo)}
                        className="group flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <ArrowLeft
                            size={13}
                            className="text-slate-400 dark:text-neutral-400 group-hover:text-cyan-500 group-hover:-translate-x-0.5 transition-all duration-200"
                        />
                        <span className="hidden sm:inline">{backLabel}</span>
                    </button>

                    {/* DIVIDER */}
                    <div className="h-5 w-px bg-slate-200/80 dark:bg-neutral-800" />

                    {/* BRAND */}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="group flex items-center gap-2.5"
                    >
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-[1.5px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-sm shadow-cyan-500/25 transition duration-200 group-hover:scale-105">
                            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-[#0c0e14] overflow-hidden p-1">
                                <img
                                    src="/calvion-icon.png"
                                    alt="Calvion"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="text-left">
                            <div className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                                Calvion
                                <span className="ml-1.5 font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent text-xs uppercase tracking-wider">
                                    Cloud
                                </span>
                            </div>
                            <div className="hidden text-[10.5px] font-medium text-slate-400 dark:text-neutral-500 sm:block -mt-0.5">
                                Digital Asset Manager
                            </div>
                        </div>
                    </button>

                </div>


                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* THEME TOGGLE */}
                    <button
                        type="button"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#12141c] text-slate-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 shadow-sm transition-all duration-200"
                        title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                        aria-label="Toggle Theme"
                    >
                        {theme === "dark" ? (
                            <Sun size={16} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
                        ) : (
                            <Moon size={16} className="text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
                        )}
                    </button>

                    {/* OPTIONAL RIGHT ACTION */}
                    {rightAction && (
                        <>
                            {rightAction.hint && (
                                <span className="hidden text-xs text-slate-500 dark:text-neutral-400 sm:block">
                                    {rightAction.hint}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={rightAction.onClick}
                                className="rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-3.5 py-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-white transition-all duration-200 shadow-sm"
                            >
                                {rightAction.label}
                            </button>
                        </>
                    )}

                </div>

            </div>
        </header>
    );
}
