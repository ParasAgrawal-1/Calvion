import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

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
        <main className="auth-page">

            <div className="auth-wrapper">

                {/* ================= LOGO ================= */}

                <button
                    type="button"
                    className="auth-logo"
                    onClick={() => navigate("/")}
                >
                    <div className="logo-mark">
                        D
                    </div>

                    <span>Calvion</span>
                </button>


                {/* ================= OTP CARD ================= */}

                <section className="auth-card">

                    <div className="auth-header">

                        <div className="otp-icon">
                            ✉
                        </div>

                        <h1>
                            Verify your email
                        </h1>

                        <p>
                            We've sent a 6-digit verification code to
                        </p>

                        {email && (
                            <strong className="otp-email">
                                {email}
                            </strong>
                        )}

                    </div>


                    {/* ================= DEMO OTP ================= */}

                    {demoOtp && (
                        <div className="auth-success-message">
                            Demo OTP:{" "}
                            <strong>{demoOtp}</strong>
                        </div>
                    )}


                    {/* ================= OTP FORM ================= */}

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


                        {/* ================= MESSAGE ================= */}

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


                        {/* ================= VERIFY BUTTON ================= */}

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
                                : "Verify email"}
                        </button>

                    </form>


                    {/* ================= FOOTER ================= */}

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