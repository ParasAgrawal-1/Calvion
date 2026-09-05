import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Check,
    X,
    ArrowLeft
} from "lucide-react";

import api from "../services/api";
import "../styles/auth.css";


function Register() {

    const navigate = useNavigate();


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
            /* SAVE EMAIL FOR OTP */

localStorage.setItem(
    "registerEmail",
    email.trim()
);


/* SAVE DEMO OTP WHEN DEMO MODE IS ENABLED */

if (
    response.data &&
    typeof response.data === "object" &&
    response.data.demoOtp
) {

    localStorage.setItem(
        "demoOtp",
        response.data.demoOtp
    );

} else {

    localStorage.removeItem(
        "demoOtp"
    );

}


/* REDIRECT TO OTP */

navigate(
    "/verify-registration-otp"
);

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
        <div className="auth-page">

            {/* Back to Home */}

            <button
                type="button"
                className="back-home-button"
                onClick={() => navigate("/")}
            >
                <ArrowLeft size={19} />

                <span>
                Back to Home
            </span>
            </button>


            <div className="auth-wrapper">


                {/* ================= LOGO ================= */}

                <div
                    className="auth-logo"
                    onClick={() =>
                        navigate("/")
                    }
                    style={{
                        cursor: "pointer"
                    }}
                >

                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 group-hover:scale-105">
                        <img
                            src="/calvion-icon.png"
                            alt="Calvion"
                            className="h-8 w-8 object-contain"
                        />
                    </div>

                    <span>
                       Calvion
                    </span>

                </div>


                {/* ================= REGISTER CARD ================= */}

                <div className="auth-card">


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

                </div>

            </div>

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