import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function VerifyOtp() {
    const navigate = useNavigate();

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
                "/api/auth/verify-otp",
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
        <main className="auth-page">

            <div className="auth-wrapper">

                {/* DataLife Logo */}

                <button
                    type="button"
                    className="auth-logo auth-logo-button"
                    onClick={() => navigate("/")}
                >
                    <div className="logo-mark">
                        D
                    </div>

                    <span>DataLife</span>
                </button>


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
    );
}

export default VerifyOtp;