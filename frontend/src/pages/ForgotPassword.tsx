import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, ArrowLeft, Sun, Moon } from "lucide-react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import "../styles/auth.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setMessage("");

        if (!email.trim()) {
            setMessage("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "/auth/forgot-password",
                {
                    email: email.trim(),
                }
            );

            // Save email for OTP verification
            localStorage.setItem(
                "resetEmail",
                email.trim()
            );

            // Navigate to OTP verification
            navigate("/verify-otp");

        } catch (error: any) {

            console.error(
                "Forgot password request failed:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to send verification code. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#06070a] dark:text-neutral-100 transition-colors duration-200 flex flex-col justify-between">
            {/* UNIFIED DEVELOPER HUB STYLE HEADER */}
            <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#07090e] shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200">
                <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">

                    {/* LEFT: BACK BUTTON & BRAND */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="group flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                            title="Return to Sign In"
                        >
                            <ArrowLeft size={13} className="text-slate-400 dark:text-neutral-400 group-hover:text-cyan-500 group-hover:-translate-x-0.5 transition-all duration-200" />
                            <span className="hidden sm:inline">Sign In</span>
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

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-3.5 py-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-white transition-all duration-200 shadow-sm"
                        >
                            Back to Sign In
                        </button>
                    </div>

                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10 sm:px-6">
                {/* BACKGROUND GLOW */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                    <div className="absolute -top-40 right-1/4 h-[450px] w-[450px] rounded-full bg-cyan-500/5 dark:bg-cyan-600/10 blur-3xl" />
                    <div className="absolute -bottom-40 left-1/4 h-[450px] w-[450px] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-3xl" />
                </div>

                <div className="auth-wrapper" style={{ maxWidth: "500px", width: "100%" }}>


                {/* Forgot Password Card */}

                <section className="auth-card">

                    {/* Header */}

                    <div className="auth-header">

                        <div className="otp-icon">
                            <LockKeyhole size={24} />
                        </div>

                        <h1>
                            Forgot password?
                        </h1>

                        <p>
                            No worries. Enter your email address and
                            we'll send you a verification code to reset
                            your password.
                        </p>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleForgotPassword}
                        noValidate
                    >

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setMessage("");
                                }}
                                autoComplete="email"
                                required
                            />

                        </div>


                        {/* Error Message */}

                        {message && (

                            <div
                                className="auth-message"
                                role="alert"
                            >
                                {message}
                            </div>

                        )}


                        {/* Send Verification Code */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Sending code..."
                                : "Send verification code"
                            }
                        </button>

                    </form>


                    {/* Back to Login */}

                    <div className="auth-footer">

                        <p>
                            Remember your password?
                        </p>

                        <button
                            type="button"
                            className="create-account-link"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Back to Sign In
                        </button>

                    </div>

                </section>

            </div>

        </main>

    </div>
    );
}

export default ForgotPassword;