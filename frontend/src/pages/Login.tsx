import { type FormEvent, useState } from "react";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    Sun,
    Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            setError("Please enter your email address.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            console.log("========== LOGIN ==========");
            console.log("Login email:", cleanEmail);

            /*
             * api.ts already contains:
             *
             * http://localhost:8080/api
             *
             * Therefore this must be:
             *
             * /auth/login
             *
             * NOT:
             *
             * /api/auth/login
             */

            const response = await api.post("/auth/login", {
                email: cleanEmail,
                password,
            });

            console.log(
                "Login API status:",
                response.status
            );

            console.log(
                "Login API response:",
                response.data
            );

            const data = response.data;

            /*
             * Save authentication token
             */

            if (data?.token) {
                localStorage.setItem(
                    "token",
                    data.token
                );
            }

            /*
             * Save email
             */

            localStorage.setItem(
                "email",
                cleanEmail
            );

            /*
             * Save user name if backend returns it
             */

            if (data?.name) {
                localStorage.setItem(
                    "name",
                    data.name
                );
            } else if (data?.user?.name) {
                localStorage.setItem(
                    "name",
                    data.user.name
                );
            } else {
                localStorage.setItem(
                    "name",
                    cleanEmail.split("@")[0]
                );
            }

            /*
             * Initialize client-side Zero-Knowledge E2EE key in browser session memory
             */
            sessionStorage.setItem("datalife_e2ee_vault_passphrase", password);

            console.log(
                "Token saved:",
                Boolean(
                    localStorage.getItem("token")
                )
            );

            console.log(
                "=========================="
            );

            /*
             * Login successful
             */

            navigate("/dashboard");

        } catch (err: unknown) {
            console.error(
                "Login failed:",
                err
            );

            /*
             * Axios error
             */

            if (axios.isAxiosError(err)) {
                const status =
                    err.response?.status;

                const responseData =
                    err.response?.data;

                console.error(
                    "HTTP status:",
                    status
                );

                console.error(
                    "Server response:",
                    responseData
                );

                /*
                 * Backend may return a plain string
                 */

                if (
                    typeof responseData ===
                    "string"
                ) {
                    setError(
                        responseData
                    );

                    return;
                }

                /*
                 * Backend may return:
                 *
                 * {
                 *   message: "..."
                 * }
                 */

                if (
                    responseData &&
                    typeof responseData ===
                    "object" &&
                    "message" in responseData &&
                    typeof responseData.message ===
                    "string"
                ) {
                    setError(
                        responseData.message
                    );

                    return;
                }

                /*
                 * Spring Boot default error
                 *
                 * {
                 *   timestamp: "...",
                 *   status: 404,
                 *   error: "Not Found",
                 *   path: "..."
                 * }
                 */

                if (
                    responseData &&
                    typeof responseData ===
                    "object" &&
                    "error" in responseData &&
                    typeof responseData.error ===
                    "string"
                ) {
                    if (status === 401) {
                        setError(
                            "Invalid email or password."
                        );
                    } else if (
                        status === 404
                    ) {
                        setError(
                            "Login service was not found. Please check the backend."
                        );
                    } else {
                        setError(
                            responseData.error
                        );
                    }

                    return;
                }

                /*
                 * Status based fallback
                 */

                if (status === 400) {
                    setError(
                        "Invalid login request."
                    );
                    return;
                }

                if (status === 401) {
                    setError(
                        "Invalid email or password."
                    );
                    return;
                }

                if (status === 403) {
                    setError(
                        "You are not allowed to login."
                    );
                    return;
                }

                if (
                    status &&
                    status >= 500
                ) {
                    setError(
                        "Server error. Please try again later."
                    );
                    return;
                }

                setError(
                    "Unable to login. Please try again."
                );

                return;
            }

            /*
             * Non-Axios error
             */

            if (err instanceof Error) {
                setError(
                    err.message
                );
            } else {
                setError(
                    "Unable to login. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#06070a] dark:text-neutral-100 transition-colors duration-200 flex flex-col justify-between">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#07090e]/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200">
                {/* Micro accent gradient line on very top */}
                <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-blue-600/0" />

                <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">

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

                        <div className="h-5 w-px bg-slate-200/80 dark:bg-neutral-800" />

                        <div className="flex items-center gap-2.5">
                            <div className="relative group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-[1.5px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-sm shadow-cyan-500/25">
                                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-[#0c0e14] overflow-hidden p-1 transition duration-200">
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
                        </div>
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

                        <span className="hidden text-xs text-slate-500 dark:text-neutral-400 sm:block">
                            Don't have an account?
                        </span>


                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-3.5 py-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-white transition-all duration-200 shadow-sm"
                        >
                            Register
                        </button>

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10 sm:px-6">

                {/* BACKGROUND GLOW */}

                <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                    <div className="absolute -top-40 right-1/4 h-[450px] w-[450px] rounded-full bg-cyan-500/5 dark:bg-cyan-600/10 blur-3xl" />
                    <div className="absolute -bottom-40 left-1/4 h-[450px] w-[450px] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-3xl" />
                </div>

                <div className="w-full max-w-[480px]">


                    {/* BRAND / INTRO */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">

                            <ShieldCheck
                                size={28}
                            />

                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                            Sign in to access your Calvion assets.
                        </p>

                    </div>


                    {/* =================================================
                        LOGIN CARD
                    ================================================= */}

                    <div className="rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none sm:p-8 transition-colors duration-200">


                        {/* ERROR */}

                        {error && (

                            <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3">

                                <p className="text-sm font-medium leading-5 text-red-700 dark:text-red-400">
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleLogin
                            }
                            className="space-y-5"
                        >


                            {/* EMAIL */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                                >
                                    Email address
                                </label>


                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                    />


                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(
                                            event
                                        ) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        disabled={
                                            loading
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-[#121318] pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-[#121318] focus:ring-4 focus:ring-cyan-500/10 dark:focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                                    >
                                        Password
                                    </label>


                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition"
                                    >
                                        Forgot password?
                                    </Link>

                                </div>


                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                    />


                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            password
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={
                                            loading
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-[#121318] pl-11 pr-12 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-[#121318] focus:ring-4 focus:ring-cyan-500/10 dark:focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-slate-400 dark:text-neutral-500 transition hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-700 dark:hover:text-neutral-200 disabled:cursor-not-allowed"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (
                                            <EyeOff
                                                size={
                                                    18
                                                }
                                            />
                                        ) : (
                                            <Eye
                                                size={
                                                    18
                                                }
                                            />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in

                                        <ArrowRight
                                            size={
                                                17
                                            }
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </>
                                )}

                            </button>

                        </form>


                        {/* REGISTER */}

                        <div className="mt-7 border-t border-slate-100 dark:border-neutral-800/80 pt-6 text-center">

                            <p className="text-sm text-slate-500 dark:text-neutral-400">

                                Don't have an account?{" "}

                                <Link
                                    to="/register"
                                    className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition"
                                >
                                    Create one
                                </Link>

                            </p>

                        </div>

                    </div>


                    {/* SECURITY NOTE */}

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-neutral-500">

                        <ShieldCheck
                            size={14}
                        />

                        Your digital assets are protected.

                    </div>

                </div>

            </main>

        </div>
    );
}