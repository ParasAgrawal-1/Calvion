import { type FormEvent, useState } from "react";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../services/api";

export default function Login() {
    const navigate = useNavigate();

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
        <div className="cv-root min-h-screen bg-white text-slate-900 dark:bg-[#000000] dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between">

            {/* HEADER — aligned with the Calvion home page */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#000000]/90">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        aria-label="Calvion home"
                        className="flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
                    >
                        <img
                            src="/calvion-icon.png"
                            alt=""
                            width={32}
                            height={32}
                            decoding="async"
                            className="h-8 w-8 rounded-lg object-contain"
                        />
                        <span className="cv-display text-lg font-bold text-slate-950 dark:text-white">
                            Calvion
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="inline-flex h-9 items-center rounded-lg bg-transparent px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-neutral-300 dark:hover:bg-white/10 dark:focus-visible:ring-offset-black"
                        >
                        <ArrowLeft size={16} aria-hidden="true" />
                        <span>Back</span>
                    </button>
                </div>
            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10 sm:px-6">

                <div className="w-full max-w-[480px]">


                    {/* BRAND / INTRO */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300">

                            <ShieldCheck
                                size={28}
                            />

                        </div>

                        <h1 className="cv-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                            Sign in to access your Calvion assets.
                        </p>

                    </div>


                    {/* =================================================
                        LOGIN CARD
                    ================================================= */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#000000] dark:shadow-none sm:p-8 transition-colors duration-200">


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
                                        className="h-12 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0a0a] pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-[#0a0a0a] focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                                        className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition"
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
                                        className="h-12 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0a0a] pl-11 pr-12 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-[#0a0a0a] focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
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

                        <div className="mt-7 border-t border-slate-200 dark:border-white/10 pt-6 text-center">

                            <p className="text-sm text-slate-500 dark:text-neutral-400">

                                Don't have an account?{" "}

                                <Link
                                    to="/register"
                                    className="font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition"
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