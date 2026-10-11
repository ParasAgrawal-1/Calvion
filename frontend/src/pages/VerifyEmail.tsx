import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import api from "../services/api";
import AuthHeader from "../components/AuthHeader";

type Status = "verifying" | "success" | "error";

function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState<Status>("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage(
                "Verification link is invalid. No token found."
            );
            return;
        }

        // Call backend to verify the token
        api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
            .then((res) => {
                setStatus("success");
                setMessage(
                    typeof res.data === "string"
                        ? res.data
                        : "Email verified successfully. Registration complete."
                );
            })
            .catch((err) => {
                const errData = err.response?.data;
                setStatus("error");
                setMessage(
                    typeof errData === "string"
                        ? errData
                        : errData?.message ||
                          "Verification failed. The link may have expired or already been used."
                );
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#06070a] dark:text-neutral-100 transition-colors duration-200 flex flex-col">
            <AuthHeader
                backTo="/"
                backLabel="Home"
                rightAction={{
                    label: "Sign In",
                    onClick: () => navigate("/login"),
                }}
            />

            {/* MAIN */}
            <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6">

                {/* BACKGROUND GLOW */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                    <div className="absolute -top-40 right-1/4 h-[450px] w-[450px] rounded-full bg-cyan-500/5 dark:bg-cyan-600/10 blur-3xl" />
                    <div className="absolute -bottom-40 left-1/4 h-[450px] w-[450px] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-3xl" />
                </div>

                <div className="w-full max-w-[480px]">

                    {/* ICON + HEADING */}
                    <div className="mb-8 text-center">
                        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${
                            status === "verifying"
                                ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/25"
                                : status === "success"
                                    ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/25"
                                    : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/25"
                        }`}>
                            {status === "verifying" && <Loader2 size={26} className="animate-spin" />}
                            {status === "success" && <CheckCircle2 size={26} />}
                            {status === "error" && <XCircle size={26} />}
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                            {status === "verifying" && "Verifying your email…"}
                            {status === "success" && "Email verified!"}
                            {status === "error" && "Verification failed"}
                        </h1>

                        {status === "verifying" && (
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                                Please wait while we verify your email address.
                            </p>
                        )}
                    </div>

                    {/* CARD */}
                    <div className="rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none sm:p-8 transition-colors duration-200">

                        {/* MESSAGE */}
                        {message && (
                            <div
                                className={`mb-6 rounded-xl border px-4 py-3 ${
                                    status === "success"
                                        ? "border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30"
                                        : "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30"
                                }`}
                                role="alert"
                            >
                                <p className={`text-sm font-medium leading-5 ${
                                    status === "success"
                                        ? "text-green-700 dark:text-green-400"
                                        : "text-red-700 dark:text-red-400"
                                }`}>
                                    {message}
                                </p>
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="space-y-3">
                            {status === "success" && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition hover:from-green-600 hover:to-emerald-700"
                                >
                                    <Mail size={17} />
                                    Continue to Login
                                </button>
                            )}

                            {status === "error" && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/register")}
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-600 hover:to-blue-700"
                                    >
                                        Register again
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 text-sm font-semibold text-slate-700 dark:text-neutral-300 transition hover:bg-slate-50 dark:hover:bg-neutral-800"
                                    >
                                        Back to Home
                                    </button>
                                </>
                            )}

                            {status === "verifying" && (
                                <div className="flex items-center justify-center gap-3 py-4 text-sm text-slate-500 dark:text-neutral-400">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-500" />
                                    Verifying your email link...
                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default VerifyEmail;
