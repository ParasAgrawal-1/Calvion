import {type FormEvent, useState } from "react";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    ArrowRight,
    Files,
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
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="border-b border-slate-200 bg-white">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* LOGO */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                        className="group flex items-center gap-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">

                            <Files size={20} />

                        </div>

                        <div className="text-left">

                            <div className="text-lg font-bold tracking-tight text-slate-900">
                                DataLife
                            </div>

                            <div className="hidden text-[11px] font-medium text-slate-400 sm:block">
                                Digital Asset Manager
                            </div>

                        </div>

                    </button>


                    {/* REGISTER */}

                    <div className="flex items-center gap-3">

                        <span className="hidden text-sm text-slate-500 sm:block">
                            Don't have an account?
                        </span>

                        <Link
                            to="/register"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                            Register
                        </Link>

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10 sm:px-6">

                <div className="w-full max-w-md">


                    {/* BRAND / INTRO */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20">

                            <ShieldCheck
                                size={27}
                            />

                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Sign in to access your DataLife assets.
                        </p>

                    </div>


                    {/* =================================================
                        LOGIN CARD
                    ================================================= */}

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">


                        {/* ERROR */}

                        {error && (

                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                                <p className="text-sm font-medium leading-5 text-red-700">
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
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>


                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-slate-700"
                                    >
                                        Password
                                    </label>


                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-semibold text-cyan-600 transition hover:text-cyan-700"
                                    >
                                        Forgot password?
                                    </Link>

                                </div>


                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
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
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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

                        <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                            <p className="text-sm text-slate-500">

                                Don't have an account?{" "}

                                <Link
                                    to="/register"
                                    className="font-semibold text-cyan-600 hover:text-cyan-700"
                                >
                                    Create one
                                </Link>

                            </p>

                        </div>

                    </div>


                    {/* SECURITY NOTE */}

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

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