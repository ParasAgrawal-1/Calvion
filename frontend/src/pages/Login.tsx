import { type FormEvent, useState } from "react";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../services/api";

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-[#000000]";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
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

            console.log("Login API status:", response.status);
            console.log("Login API response:", response.data);

            const data = response.data;

            /*
             * Save authentication token
             */
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }

            /*
             * Save email
             */
            localStorage.setItem("email", cleanEmail);

            /*
             * Save user name if backend returns it
             */
            if (data?.name) {
                localStorage.setItem("name", data.name);
            } else if (data?.user?.name) {
                localStorage.setItem("name", data.user.name);
            } else {
                localStorage.setItem("name", cleanEmail.split("@")[0]);
            }

            /*
             * Initialize client-side Zero-Knowledge E2EE key in browser session memory
             */
            sessionStorage.setItem("datalife_e2ee_vault_passphrase", password);

            console.log(
                "Token saved:",
                Boolean(localStorage.getItem("token"))
            );
            console.log("==========================");

            /*
             * Login successful
             */
            navigate("/dashboard");
        } catch (err: unknown) {
            console.error("Login failed:", err);

            /*
             * Axios error
             */
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const responseData = err.response?.data;

                console.error("HTTP status:", status);
                console.error("Server response:", responseData);

                /*
                 * Backend may return a plain string
                 */
                if (typeof responseData === "string") {
                    setError(responseData);
                    return;
                }

                /*
                 * Backend may return:
                 * { message: "..." }
                 */
                if (
                    responseData &&
                    typeof responseData === "object" &&
                    "message" in responseData &&
                    typeof responseData.message === "string"
                ) {
                    setError(responseData.message);
                    return;
                }

                /*
                 * Spring Boot default error
                 */
                if (
                    responseData &&
                    typeof responseData === "object" &&
                    "error" in responseData &&
                    typeof responseData.error === "string"
                ) {
                    if (status === 401) {
                        setError("Invalid email or password.");
                    } else if (status === 404) {
                        setError(
                            "Login service was not found. Please check the backend."
                        );
                    } else {
                        setError(responseData.error);
                    }
                    return;
                }

                /*
                 * Status based fallback
                 */
                if (status === 400) {
                    setError("Invalid login request.");
                    return;
                }

                if (status === 401) {
                    setError("Invalid email or password.");
                    return;
                }

                if (status === 403) {
                    setError("You are not allowed to login.");
                    return;
                }

                if (status && status >= 500) {
                    setError("Server error. Please try again later.");
                    return;
                }

                setError("Unable to login. Please try again.");
                return;
            }

            /*
             * Non-Axios error
             */
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unable to login. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cv-root flex min-h-dvh flex-col overflow-x-clip bg-white text-slate-900 transition-colors duration-200 dark:bg-[#000000] dark:text-slate-100">
            {/* HEADER — aligned with AppNavbar and Dashboard */}
            <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#000000]/90">
                <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-3 px-3.5 sm:h-16 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        aria-label="Calvion home"
                        className={`flex shrink-0 items-center gap-2 rounded-lg sm:gap-2.5 ${FOCUS_RING}`}
                    >
                        <img
                            src="/calvion-icon.png"
                            alt=""
                            width={32}
                            height={32}
                            decoding="async"
                            className="h-7 w-7 rounded-lg object-contain sm:h-8 sm:w-8"
                        />
                        <span className="cv-display text-base font-bold tracking-tight text-slate-950 dark:text-white sm:text-lg">
                            Calvion
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className={`inline-flex h-9 shrink-0 touch-manipulation items-center gap-1.5 rounded-lg bg-transparent px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-white/10 sm:px-3.5 sm:text-sm ${FOCUS_RING}`}
                    >
                        <ArrowLeft size={15} aria-hidden="true" />
                        <span>Back</span>
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="relative flex flex-1 items-center justify-center px-3.5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10 lg:py-12">
                <div className="w-full max-w-[460px]">
                    {/* BRAND / INTRO */}
                    <div className="mb-6 text-center sm:mb-8">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300 sm:mb-5 sm:h-14 sm:w-14">
                            <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>

                        <h1 className="cv-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                            Welcome back
                        </h1>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-neutral-400 sm:mt-2 sm:text-sm sm:leading-6">
                            Sign in to access your Calvion assets.
                        </p>
                    </div>

                    {/* LOGIN CARD */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-white/10 dark:bg-[#000000] dark:shadow-none sm:p-8">
                        {/* ERROR */}
                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 dark:border-red-900/50 dark:bg-red-950/30 sm:mb-6 sm:px-4"
                            >
                                <AlertCircle
                                    size={16}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                                />
                                <p className="text-xs font-medium leading-5 text-red-700 dark:text-red-400 sm:text-sm">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* FORM */}
                        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300 sm:mb-2 sm:text-sm"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        inputMode="email"
                                        disabled={loading}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400 dark:focus:bg-[#0a0a0a] dark:focus:ring-indigo-400/10 sm:h-12 sm:pl-11 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 sm:mb-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 sm:text-sm"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className={`rounded text-xs font-semibold text-indigo-700 transition hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200 ${FOCUS_RING}`}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                    />

                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={loading}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400 dark:focus:bg-[#0a0a0a] dark:focus:ring-indigo-400/10 sm:h-12 sm:pl-11 sm:text-sm"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) => !previous
                                            )
                                        }
                                        disabled={loading}
                                        className={`absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 ${FOCUS_RING}`}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group flex h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:h-12 ${FOCUS_RING}`}
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-slate-950/30 dark:border-t-slate-950" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <ArrowRight
                                            size={17}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* REGISTER */}
                        <div className="mt-6 border-t border-slate-200 pt-5 text-center dark:border-white/10 sm:mt-7 sm:pt-6">
                            <p className="text-xs text-slate-500 dark:text-neutral-400 sm:text-sm">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/register"
                                    className={`rounded font-semibold text-indigo-700 transition hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200 ${FOCUS_RING}`}
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* SECURITY NOTE */}
                    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-neutral-500 sm:mt-6">
                        <ShieldCheck size={14} className="shrink-0" />
                        <span>Your digital assets are protected.</span>
                    </div>
                </div>
            </main>
        </div>
    );
}