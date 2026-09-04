import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function ResetPassword() {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleResetPassword = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setMessage("");
        setSuccess(false);


        /* =========================
           PASSWORD VALIDATION
        ========================= */

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }


        /* =========================
           GET RESET DATA
        ========================= */

        const email = localStorage.getItem("resetEmail");
        const otp = localStorage.getItem("resetOtp");

        if (!email || !otp) {
            setMessage(
                "Your reset session has expired. Please start again."
            );
            return;
        }


        /* =========================
           RESET PASSWORD
        ========================= */

        try {
            setLoading(true);

            const response = await api.post(
                "/api/auth/reset-password",
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


            /* Clear temporary reset data */

            localStorage.removeItem("resetEmail");
            localStorage.removeItem("resetOtp");


            /* Redirect to login */

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
        <main className="auth-page">

            <div className="auth-wrapper">


                {/* ================= LOGO ================= */}

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


                {/* ================= RESET CARD ================= */}

                <section className="auth-card">


                    {/* Header */}

                    <div className="auth-header">

                        <div className="otp-icon">
                            🔒
                        </div>

                        <h1>Create new password</h1>

                        <p>
                            Choose a strong password to keep your
                            DataLife account secure.
                        </p>

                    </div>


                    {/* ================= FORM ================= */}

                    <form onSubmit={handleResetPassword}>


                        {/* New Password */}

                        <div className="form-group">

                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                                required
                            />

                        </div>


                        {/* Confirm Password */}

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
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


                        {/* ================= BUTTON ================= */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting password..."
                                : "Reset Password"
                            }
                        </button>

                    </form>


                    {/* ================= FOOTER ================= */}

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

export default ResetPassword;