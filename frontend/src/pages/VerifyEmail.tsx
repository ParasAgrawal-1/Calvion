import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

type Status = "verifying" | "success" | "error";

function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState<Status>("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage(
                "Verification link is invalid. No token found."
            );
            return;
        }

        // Call backend to verify the token
        api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
            .then((res) => {
                setStatus("success");
                setMessage(
                    typeof res.data === "string"
                        ? res.data
                        : "Email verified successfully. Registration complete."
                );
            })
            .catch((err) => {
                const errData = err.response?.data;
                setStatus("error");
                setMessage(
                    typeof errData === "string"
                        ? errData
                        : errData?.message ||
                          "Verification failed. The link may have expired or already been used."
                );
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="auth-page">
            <div className="auth-wrapper">

                {/* ================= LOGO ================= */}

                <button
                    type="button"
                    className="auth-logo"
                    onClick={() => navigate("/")}
                >
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                        <img
                            src="/calvion-icon.png"
                            alt="Calvion"
                            className="h-8 w-8 object-contain"
                        />
                    </div>
                    <span>Calvion</span>
                </button>


                {/* ================= VERIFY CARD ================= */}

                <section className="auth-card">

                    <div className="auth-header">

                        {/* Icon */}
                        <div className="otp-icon">
                            {status === "verifying" && "⏳"}
                            {status === "success"   && "✅"}
                            {status === "error"     && "❌"}
                        </div>

                        <h1>
                            {status === "verifying" && "Verifying your email…"}
                            {status === "success"   && "Email verified!"}
                            {status === "error"     && "Verification failed"}
                        </h1>

                        {status === "verifying" && (
                            <p>
                                Please wait while we verify your email address.
                            </p>
                        )}

                    </div>


                    {/* Message */}

                    {message && (
                        <div
                            className={
                                status === "success"
                                    ? "auth-success-message"
                                    : "auth-message"
                            }
                            role="alert"
                            style={{ marginBottom: "24px" }}
                        >
                            {message}
                        </div>
                    )}


                    {/* Actions */}

                    {status === "success" && (
                        <button
                            type="button"
                            className="auth-button"
                            onClick={() => navigate("/login")}
                        >
                            Continue to Login
                        </button>
                    )}

                    {status === "error" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <button
                                type="button"
                                className="auth-button"
                                onClick={() => navigate("/register")}
                            >
                                Register again
                            </button>

                            <button
                                type="button"
                                className="create-account-link"
                                onClick={() => navigate("/")}
                            >
                                Back to Home
                            </button>
                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}

export default VerifyEmail;
