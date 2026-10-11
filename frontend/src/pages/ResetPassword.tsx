import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import AuthHeader from "../components/AuthHeader";

function ResetPassword() {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleResetPassword = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setMessage("");
        setSuccess(false);


        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }


        const email = localStorage.getItem("resetEmail");
        const otp = localStorage.getItem("resetOtp");

        if (!email || !otp) {
            setMessage(
                "Your reset session has expired. Please start again."
            );
            return;
        }


        try {
            setLoading(true);

            const response = await api.post(
                "/auth/reset-password",
                {
                    email,
                    otp,
                    newPassword,
                }
            );


            setSuccess(true);

            setMessage(
                typeof response.data === "string"
                    ? response.data
                    : response.data?.message ||
                    "Password reset successfully!"
            );


            localStorage.removeItem("resetEmail");
            localStorage.removeItem("resetOtp");


            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error: any) {

            console.error(
                "Password reset failed:",
                error
            );

            setSuccess(false);

            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Password reset failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#06070a] dark:text-neutral-100 transition-colors duration-200 flex flex-col">
            <AuthHeader
                backTo="/login"
                backLabel="Sign In"
                rightAction={{
                    label: "Back to Sign In",
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
                            <LockKeyhole size={26} />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                            Create new password
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                            Choose a strong password to keep your Calvion account secure.
                        </p>
                    </div>

                    {/* CARD */}
                    <div className="rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none sm:p-8 transition-colors duration-200">

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
                                <div className="flex items-center gap-2">
                                    {success && <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 shrink-0" />}
                                    <p className={`text-sm font-medium leading-5 ${
                                        success
                                            ? "text-green-700 dark:text-green-400"
                                            : "text-red-700 dark:text-red-400"
                                    }`}>
                                        {message}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* FORM */}
                        <form onSubmit={handleResetPassword} className="space-y-5">

                            {/* NEW PASSWORD */}
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                    />
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter your new password"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        required
                                        className="h-12 w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-[#121318] pl-11 pr-12 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-[#121318] focus:ring-4 focus:ring-cyan-500/10 dark:focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((p) => !p)}
                                        disabled={loading}
                                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-slate-400 dark:text-neutral-500 transition hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-700 dark:hover:text-neutral-200 disabled:cursor-not-allowed"
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                    />
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        required
                                        className={`h-12 w-full rounded-xl border bg-slate-50/70 dark:bg-[#121318] pl-11 pr-12 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-[#121318] focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                                            confirmPassword && confirmPassword !== newPassword
                                                ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/10"
                                                : "border-slate-200 dark:border-neutral-800 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/10 dark:focus:ring-cyan-500/20"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((p) => !p)}
                                        disabled={loading}
                                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-slate-400 dark:text-neutral-500 transition hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-700 dark:hover:text-neutral-200 disabled:cursor-not-allowed"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {confirmPassword && confirmPassword !== newPassword && (
                                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                        Passwords do not match
                                    </p>
                                )}
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Resetting password...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle2 size={17} />
                                        Password reset!
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>

                        </form>

                        {/* FOOTER */}
                        <div className="mt-7 border-t border-slate-100 dark:border-neutral-800/80 pt-6 text-center">
                            <p className="text-sm text-slate-500 dark:text-neutral-400">
                                Remember your password?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition"
                                >
                                    Back to Sign In
                                </button>
                            </p>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default ResetPassword;