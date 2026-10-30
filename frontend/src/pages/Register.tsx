import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Check,
    X,
    ArrowLeft,
    Sun,
    Moon,
} from "lucide-react";

import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import "../styles/auth.css";


function Register() {

    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();


    /* ================= FORM STATES ================= */

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [digitalIdentity, setDigitalIdentity] =
        useState("");


    /* ================= UI STATES ================= */

    const [message, setMessage] = useState("");
    const [successEmail, setSuccessEmail] = useState("");
    const [demoLink, setDemoLink] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [acceptedTerms, setAcceptedTerms] =
        useState(false);


    /* ================= PASSWORD FOCUS ================= */

    const [isPasswordFocused, setIsPasswordFocused] =
        useState(false);


    /* ================= PASSWORD VALIDATION ================= */

    const passwordRules = {

        length: password.length >= 8,

        uppercase: /[A-Z]/.test(password),

        lowercase: /[a-z]/.test(password),

        number: /[0-9]/.test(password),

        special: /[^A-Za-z0-9]/.test(password),

    };


    const passedRules = Object.values(
        passwordRules
    ).filter(Boolean).length;


    /* ================= PASSWORD STRENGTH ================= */

    const getPasswordStrength = () => {

        if (password.length === 0) {
            return "";
        }

        if (passedRules <= 2) {
            return "Weak";
        }

        if (passedRules <= 4) {
            return "Medium";
        }

        return "Strong";

    };


    const passwordStrength =
        getPasswordStrength();


    /* ================= PASSWORD MATCH ================= */

    const passwordsMatch =

        password.length > 0 &&

        confirmPassword.length > 0 &&

        password === confirmPassword;


    /* ================= PASSWORD VALID ================= */

    const isPasswordValid =

        Object.values(
            passwordRules
        ).every(Boolean);


    /* ================= DIGITAL ID VALIDATION ================= */

    const digitalIdentityValid =

        /^[A-Za-z0-9_]+$/.test(
            digitalIdentity
        ) &&

        digitalIdentity.length >= 3 &&

        digitalIdentity.length <= 20;


    /* ================= FORM VALIDATION ================= */

    const isFormValid =

        name.trim().length >= 2 &&

        email.includes("@") &&

        isPasswordValid &&

        passwordsMatch &&

        digitalIdentityValid &&

        acceptedTerms;


    /* ================= REGISTER ================= */

    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setMessage("");


        /* NAME VALIDATION */

        if (name.trim().length < 2) {

            setMessage(
                "Full name must contain at least 2 characters."
            );

            return;

        }


        /* EMAIL VALIDATION */

        if (!email.includes("@")) {

            setMessage(
                "Please enter a valid email address."
            );

            return;

        }


        /* PASSWORD VALIDATION */

        if (!isPasswordValid) {

            setMessage(
                "Please create a stronger password."
            );

            return;

        }


        /* CONFIRM PASSWORD */

        if (password !== confirmPassword) {

            setMessage(
                "Passwords do not match."
            );

            return;

        }


        /* DIGITAL ID VALIDATION */

        if (!digitalIdentityValid) {

            setMessage(
                "Digital identity must be 3–20 characters and contain only letters, numbers, or underscores."
            );

            return;

        }


        /* TERMS VALIDATION */

        if (!acceptedTerms) {

            setMessage(
                "Please accept the Terms and Conditions."
            );

            return;

        }


        try {

            setLoading(true);


           const response = await api.post(
    "/auth/register",
    {
        name: name.trim(),
        email: email.trim(),
        password,
        digitalIdentity: digitalIdentity.trim(),
    }
);
            /* SAVE DEMO LINK WHEN DEMO MODE IS ENABLED */

if (
    response.data &&
    typeof response.data === "object" &&
    response.data.demoLink
) {
    setDemoLink(response.data.demoLink);
} else {
    setDemoLink("");
}

/* SHOW SUCCESS: check your email */

setSuccessEmail(email.trim());

        } catch (error: any) {

            console.error(
                "Registration failed:",
                error
            );


            const errorText =
                (typeof error.response?.data === "string" ? error.response.data : null) ||
                error.response?.data?.message ||
                "Registration failed. Please try again.";

            setMessage(errorText);

        } finally {

            setLoading(false);

        }

    };


    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#06070a] dark:text-neutral-100 transition-colors duration-200 flex flex-col justify-between">
            {/* UNIFIED DEVELOPER HUB STYLE HEADER */}
            <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#07090e] shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200">
                <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">

                    {/* LEFT: BACK BUTTON & BRAND */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="group flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                            title="Return to Calvion Home"
                        >
                            <ArrowLeft size={13} className="text-slate-400 dark:text-neutral-400 group-hover:text-cyan-500 group-hover:-translate-x-0.5 transition-all duration-200" />
                            <span className="hidden sm:inline">Home</span>
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

                        <span className="hidden text-xs text-slate-500 dark:text-neutral-400 sm:block">
                            Already have an account?
                        </span>

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

                <div className="auth-wrapper" style={{ maxWidth: "560px", width: "100%" }}>
                    <div className="auth-card">

                    {/* ================= SUCCESS STATE ================= */}

                    {successEmail ? (
                        <div style={{ textAlign: "center" }}>

                            <div className="otp-icon" style={{ fontSize: "48px", marginBottom: "16px" }}>
                                ✉️
                            </div>

                            <h1 style={{ fontSize: "22px", marginBottom: "8px" }}>
                                Check your inbox!
                            </h1>

                            <p style={{ color: "#64748b", marginBottom: "20px", lineHeight: "1.6" }}>
                                We've sent a verification link to<br />
                                <strong style={{ color: "#0284c7" }}>{successEmail}</strong>
                            </p>

                            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
                                Click the link in your email to complete
                                registration. The link expires in <strong>24 hours</strong>.
                            </p>

                            {demoLink && (
                                <div
                                    className="auth-success-message"
                                    style={{ marginBottom: "20px", wordBreak: "break-all", fontSize: "13px" }}
                                >
                                    <strong>Demo link:</strong>{" "}
                                    <a href={demoLink} style={{ color: "#0369a1" }}>
                                        {demoLink}
                                    </a>
                                </div>
                            )}

                            <button
                                type="button"
                                className="auth-button"
                                onClick={() => navigate("/login")}
                            >
                                Go to Login
                            </button>

                            <div className="auth-footer" style={{ marginTop: "16px" }}>
                                <p>Entered the wrong email?</p>
                                <button
                                    type="button"
                                    className="create-account-link"
                                    onClick={() => setSuccessEmail("")}
                                >
                                    Go back to registration
                                </button>
                            </div>

                        </div>
                    ) : (
                    <>

                    {/* HEADER */}

                    <div className="auth-header">

                        <h1>
                            Create your account
                        </h1>

                        <p>
                            Start organizing your digital life
                            in one secure place.
                        </p>

                    </div>

                    {message && (
                        <div className="auth-message" style={{ marginBottom: "20px" }}>
                            {message}
                        </div>
                    )}



                    {/* ================= FORM ================= */}

                    <form
                        onSubmit={handleRegister}
                    >


                        {/* ================= FULL NAME ================= */}

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                minLength={2}
                                required
                            />

                        </div>


                        {/* ================= EMAIL ================= */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* ================= PASSWORD ================= */}

                        <div className="form-group password-group">

                            <label htmlFor="password">
                                Password
                            </label>


                            <div className="password-input-wrapper">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    value={password}

                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }

                                    onFocus={() =>
                                        setIsPasswordFocused(
                                            true
                                        )
                                    }

                                    onBlur={() =>
                                        setIsPasswordFocused(
                                            false
                                        )
                                    }

                                    required
                                />


                                <button
                                    type="button"
                                    className="password-toggle"

                                    onMouseDown={(e) =>
                                        e.preventDefault()
                                    }

                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }

                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showPassword ? (

                                        <EyeOff size={20} />

                                    ) : (

                                        <Eye size={20} />

                                    )}

                                </button>

                            </div>


                            {/* ================= PASSWORD CONSTRAINTS ================= */}

                            {isPasswordFocused &&
                                password.length > 0 && (

                                    <div className="password-validation">


                                        {/* PASSWORD STRENGTH */}

                                        <div className="password-strength-header">

                                        <span>
                                            Password strength
                                        </span>

                                            <span
                                                className={`strength-text ${passwordStrength.toLowerCase()}`}
                                            >

                                            {passwordStrength}

                                        </span>

                                        </div>


                                        {/* STRENGTH BARS */}

                                        <div className="strength-bars">

                                            {[1, 2, 3, 4, 5].map(
                                                (item) => (

                                                    <span
                                                        key={item}

                                                        className={
                                                            item <= passedRules

                                                                ? `strength-bar active ${passwordStrength.toLowerCase()}`

                                                                : "strength-bar"
                                                        }
                                                    />

                                                )
                                            )}

                                        </div>


                                        {/* PASSWORD RULES */}

                                        <div className="password-rules">


                                            <PasswordRule
                                                valid={
                                                    passwordRules.length
                                                }
                                                text="At least 8 characters"
                                            />


                                            <PasswordRule
                                                valid={
                                                    passwordRules.uppercase
                                                }
                                                text="One uppercase letter"
                                            />


                                            <PasswordRule
                                                valid={
                                                    passwordRules.lowercase
                                                }
                                                text="One lowercase letter"
                                            />


                                            <PasswordRule
                                                valid={
                                                    passwordRules.number
                                                }
                                                text="One number"
                                            />


                                            <PasswordRule
                                                valid={
                                                    passwordRules.special
                                                }
                                                text="One special character"
                                            />


                                        </div>

                                    </div>

                                )}

                        </div>


                        {/* ================= CONFIRM PASSWORD ================= */}

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>


                            <div className="password-input-wrapper">

                                <input
                                    id="confirmPassword"

                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }

                                    placeholder="Confirm your password"

                                    value={confirmPassword}

                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }

                                    required
                                />


                                <button
                                    type="button"

                                    className="password-toggle"

                                    onMouseDown={(e) =>
                                        e.preventDefault()
                                    }

                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }

                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showConfirmPassword ? (

                                        <EyeOff size={20} />

                                    ) : (

                                        <Eye size={20} />

                                    )}

                                </button>

                            </div>


                            {/* PASSWORD MATCH */}

                            {confirmPassword.length > 0 && (

                                <div
                                    className={`password-match ${
                                        passwordsMatch
                                            ? "match"
                                            : "no-match"
                                    }`}
                                >

                                    {passwordsMatch ? (

                                        <Check size={16} />

                                    ) : (

                                        <X size={16} />

                                    )}

                                    <span>

                                        {passwordsMatch
                                            ? "Passwords match"
                                            : "Passwords do not match"}

                                    </span>

                                </div>

                            )}

                        </div>


                        {/* ================= DIGITAL IDENTITY ================= */}

                        <div className="form-group">

                            <div className="label-row">

                                <label
                                    htmlFor="digitalIdentity"
                                >
                                    Digital Identity
                                </label>


                                <span className="character-count">

                                    {
                                        digitalIdentity.length
                                    }
                                    /20

                                </span>

                            </div>


                            <input
                                id="digitalIdentity"

                                type="text"

                                placeholder="e.g. paras_dev"

                                value={digitalIdentity}

                                maxLength={20}

                                onChange={(e) => {

                                    const value =
                                        e.target.value.replace(
                                            /[^A-Za-z0-9_]/g,
                                            ""
                                        );

                                    setDigitalIdentity(
                                        value
                                    );

                                }}

                                required
                            />


                            <small className="input-hint">

                                Use letters, numbers, and underscores only.

                            </small>

                        </div>


                        {/* ================= TERMS ================= */}

                        <div className="terms-container">

                            <input
                                id="terms"

                                type="checkbox"

                                checked={acceptedTerms}

                                onChange={(e) =>
                                    setAcceptedTerms(
                                        e.target.checked
                                    )
                                }
                            />


                            <label htmlFor="terms">

                                I agree to the{" "}

                                <span className="terms-link">

                                    Terms and Conditions

                                </span>

                            </label>

                        </div>


                        {/* ================= ERROR MESSAGE ================= */}

                        {message && (

                            <div className="auth-message">

                                {message}

                            </div>

                        )}


                        {/* ================= CREATE ACCOUNT ================= */}

                        <button
                            type="submit"

                            className="auth-button"

                            disabled={
                                loading ||
                                !isFormValid
                            }
                        >

                            {loading
                                ? "Creating account..."
                                : "Create Account"
                            }

                        </button>

                    </form>


                    {/* ================= LOGIN ================= */}

                    <div className="auth-links">

                        <p className="auth-switch-text">

                            Already have an account?{" "}

                            <span
                                className="auth-link"

                                onClick={() =>
                                    navigate("/login")
                                }
                            >

                                Sign In

                            </span>

                        </p>

                    </div>

                    </>
                    )}

                </div>

            </div>

        </main>

    </div>

    );

}


/* ================= PASSWORD RULE COMPONENT ================= */

interface PasswordRuleProps {

    valid: boolean;

    text: string;

}


function PasswordRule({
                          valid,
                          text
                      }: PasswordRuleProps) {

    return (

        <div
            className={`password-rule ${
                valid
                    ? "valid"
                    : "invalid"
            }`}
        >

            {valid ? (

                <Check size={16} />

            ) : (

                <X size={16} />

            )}

            <span>
                {text}
            </span>

        </div>

    );

}


export default Register;