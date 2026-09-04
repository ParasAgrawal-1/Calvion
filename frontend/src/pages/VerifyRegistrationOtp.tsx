import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function VerifyRegistrationOtp() {
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const email = localStorage.getItem("registerEmail");

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

        try {
            setLoading(true);
            setMessage("");

            const response = await api.post(
                "/api/auth/verify-registration-otp",
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

            localStorage.removeItem("registerEmail");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error: any) {

            const errorData = error.response?.data;

            setSuccess(false);

            if (typeof errorData === "string") {
                setMessage(errorData);

            } else if (errorData?.message) {
                setMessage(errorData.message);

            } else {
                setMessage("Invalid or expired OTP. Please try again.");
            }

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
                    className="auth-logo"
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

                        <h1>Verify your email</h1>

                        <p>
                            We've sent a 6-digit verification code to
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
                            />

                        </div>


                        {message && (

                            <div
                                className={
                                    success
                                        ? "auth-success-message"
                                        : "auth-message"
                                }
                                role="alert"
                            >
                                {message}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading || otp.length !== 6}
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify email"
                            }
                        </button>

                    </form>


                    <div className="auth-footer">

                        <p>
                            Entered the wrong email?
                        </p>

                        <button
                            type="button"
                            className="create-account-link"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Go back to registration
                        </button>

                    </div>

                </section>

            </div>

        </main>
    );
}

export default VerifyRegistrationOtp;