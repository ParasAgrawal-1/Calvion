import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import api from "../services/api";
import AuthHeader from "../components/AuthHeader";

function VerifyRegistrationOtp() {
    const navigate = useNavigate();

    // Get registration data BEFORE rendering
    const email = localStorage.getItem("registerEmail");
    const demoOtp = localStorage.getItem("demoOtp");

    const [otp, setOtp] = useState(demoOtp || "");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleVerifyOtp = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!email) {
            setMessage(
                "Registration email not found. Please register again."
            );
            return;
        }

        if (otp.length !== 6) {
            setMessage("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setSuccess(false);

            const response = await api.post(
                "/auth/verify-registration-otp",
                {
                    email,
                    otp,
                }
            );

            setSuccess(true);

            setMessage(
                typeof response.data === "string"
                    ? response.data
                    : "Account verified successfully!"
            );

            // Remove temporary registration data
            localStorage.removeItem("registerEmail");
            localStorage.removeItem("demoOtp");

            // Redirect to login
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error: any) {
            console.error(
                "OTP verification failed:",
                error
            );

            const errorData = error.response?.data;

            setSuccess(false);

            if (typeof errorData === "string") {
                setMessage(errorData);
            } else if (errorData?.message) {
                setMessage(errorData.message);
            } else {
                setMessage(
                    "Invalid or expired OTP. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#06070a] dark:text-neutral-100 transition-colors duration-200 flex flex-col">
            <AuthHeader
                backTo="/register"
                backLabel="Register"
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
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                            <Mail size={26} />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                            Verify your email
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                            We've sent a 6-digit verification code to
                        </p>
                        {email && (
                            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-neutral-300">
                                {email}
                            </p>
                        )}
                    </div>

                    {/* CARD */}
                    <div className="rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none sm:p-8 transition-colors duration-200">

                        {/* DEMO OTP */}
                        {demoOtp && (
                            <div className="mb-6 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 px-4 py-3">
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                    Demo OTP: <strong>{demoOtp}</strong>
                                </p>
                            </div>
                        )}

                        {/* MESSAGE */}
                        {message && (
                            <div
                                className={`mb-6 rounded-xl border px-4 py-3 ${
                                    success
                                        ? "border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30"
                                        : "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30"
                                }`}
                                role="alert"
                            >
                                <p className={`text-sm font-medium leading-5 ${
                                    success
                                        ? "text-green-700 dark:text-green-400"
                                        : "text-red-700 dark:text-red-400"
                                }`}>
                                    {message}
                                </p>
                            </div>
                        )}

                        {/* FORM */}
                        <form onSubmit={handleVerifyOtp} className="space-y-5">

                            {/* OTP INPUT */}
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                                >
                                    Verification code
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
                                    className="h-12 w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-[#121318] px-4 text-center text-2xl font-bold tracking-[0.5em] text-slate-900 dark:text-white outline-none transition placeholder:text-slate-300 dark:placeholder:text-neutral-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-[#121318] focus:ring-4 focus:ring-cyan-500/10 dark:focus:ring-cyan-500/20"
                                />
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6 || success}
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Verifying...
                                    </>
                                ) : success ? (
                                    <>
                                        <ShieldCheck size={17} />
                                        Verified!
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={17} />
                                        Verify email
                                    </>
                                )}
                            </button>

                        </form>

                        {/* FOOTER */}
                        <div className="mt-7 border-t border-slate-100 dark:border-neutral-800/80 pt-6 text-center">
                            <p className="text-sm text-slate-500 dark:text-neutral-400">
                                Entered the wrong email?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition"
                                >
                                    Go back to registration
                                </button>
                            </p>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default VerifyRegistrationOtp;