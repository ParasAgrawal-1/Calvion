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
        <main className="auth-page">

            {/* Top Navigation */}
            <button
                type="button"
                className="back-home-button"
                onClick={() => navigate("/login")}
            >
                <ArrowLeft size={19} />
                <span>Back to Sign In</span>
            </button>

            <div className="auth-top-actions">
                <button
                    type="button"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="theme-toggle-btn"
                    title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                    aria-label="Toggle Theme"
                >
                    {theme === "dark" ? (
                        <Sun size={16} className="sun-icon" />
                    ) : (
                        <Moon size={16} className="moon-icon" />
                    )}
                </button>
            </div>

            <div className="auth-wrapper">

                {/* Calvion Logo */}

                <button
                    type="button"
                    className="auth-logo auth-logo-button"
                    onClick={() => navigate("/")}
                    aria-label="Go to Calvion home"
                >
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:ring-neutral-800 transition duration-200 group-hover:scale-105">
                        <img
                            src="/calvion-icon.png"
                            alt="Calvion"
                            className="h-8 w-8 object-contain"
                        />
                    </div>

                    <span>Calvion</span>
                </button>


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
    );
}

export default ForgotPassword;