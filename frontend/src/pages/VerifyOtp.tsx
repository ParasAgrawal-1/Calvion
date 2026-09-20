import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import "../styles/auth.css";

function VerifyOtp() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const email = localStorage.getItem("resetEmail");

    const handleVerifyOtp = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!email) {
            setMessage(
                "Email not found. Please start the password reset process again."
            );
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await api.post(
                "/auth/verify-otp",
                {
                    email,
                    otp,
                }
            );

            setMessage(
                response.data?.message ||
                "OTP verified successfully."
            );

            // Save OTP temporarily
            localStorage.setItem("resetOtp", otp);

            // Go to reset password page
            navigate("/reset-password");

        } catch (error: any) {

            console.error(
                "OTP verification failed:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.response?.data ||
                "Invalid or expired OTP. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#06070a] dark:text-neutral-100 transition-colors duration-200 flex flex-col justify-between">
            {/* UNIFIED DEVELOPER HUB STYLE HEADER */}
            <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#07090e]/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200">
                {/* Micro accent gradient line on very top */}
                <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-blue-600/0" />

                <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">

                    {/* LEFT: BACK BUTTON & BRAND */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="group flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                            title="Return to Forgot Password"
                        >
                            <ArrowLeft size={13} className="text-slate-400 dark:text-neutral-400 group-hover:text-cyan-500 group-hover:-translate-x-0.5 transition-all duration-200" />
                            <span className="hidden sm:inline">Back</span>
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
                            Sign In
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


                {/* OTP Card */}

                <section className="auth-card">

                    <div className="auth-header">

                        <div className="otp-icon">
                            ✉
                        </div>

                        <h1>Verify your code</h1>

                        <p>
                            Enter the 6-digit verification code sent to
                        </p>

                        {email && (
                            <strong className="otp-email">
                                {email}
                            </strong>
                        )}

                    </div>


                    {/* OTP Form */}

                    <form onSubmit={handleVerifyOtp}>

                        <div className="form-group">

                            <label htmlFor="otp">
                                Verification Code
                            </label>

                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter 6-digit code"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6)
                                    )
                                }
                                maxLength={6}
                                autoComplete="one-time-code"
                                required
                            />

                        </div>


                        {/* Message */}

                        {message && (

                            <div
                                className="auth-message"
                                role="alert"
                            >
                                {message}
                            </div>

                        )}


                        {/* Verify Button */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={
                                loading ||
                                otp.length !== 6
                            }
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify code"
                            }
                        </button>

                    </form>


                    {/* Back */}

                    <div className="auth-footer">

                        <p>
                            Didn't receive the code?
                        </p>

                        <button
                            type="button"
                            className="create-account-link"
                            onClick={() =>
                                navigate("/forgot-password")
                            }
                        >
                            Try another email
                        </button>

                    </div>

                </section>

            </div>

        </main>

    </div>
    );
}

export default VerifyOtp;