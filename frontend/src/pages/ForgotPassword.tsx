import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import api from "../services/api";
import "../styles/auth.css";

function ForgotPassword() {
    const navigate = useNavigate();

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
                "/api/auth/forgot-password",
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

            <div className="auth-wrapper">

                {/* DataLife Logo */}

                <button
                    type="button"
                    className="auth-logo auth-logo-button"
                    onClick={() => navigate("/")}
                    aria-label="Go to DataLife home"
                >
                    <div className="logo-mark">
                        D
                    </div>

                    <span>DataLife</span>
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