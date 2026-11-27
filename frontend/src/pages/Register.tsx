import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Check,
    X,
    ArrowLeft,
    ArrowRight,
    User,
    Mail,
    LockKeyhole,
    AtSign,
    ShieldCheck,
    MailCheck,
    AlertCircle,
} from "lucide-react";
import axios from "axios";

import api from "../services/api";

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-[#000000]";

function Register() {
    const navigate = useNavigate();

    /* ================= FORM STATES ================= */

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [digitalIdentity, setDigitalIdentity] = useState("");

    /* ================= UI STATES ================= */

    const [message, setMessage] = useState("");
    const [successEmail, setSuccessEmail] = useState("");
    const [demoLink, setDemoLink] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    /* ================= PASSWORD FOCUS ================= */

    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    /* ================= PASSWORD VALIDATION ================= */

    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const passedRules = Object.values(passwordRules).filter(Boolean).length;

    /* ================= PASSWORD STRENGTH ================= */

    const getPasswordStrength = (): "" | "Weak" | "Medium" | "Strong" => {
        if (password.length === 0) return "";
        if (passedRules <= 2) return "Weak";
        if (passedRules <= 4) return "Medium";
        return "Strong";
    };

    const passwordStrength = getPasswordStrength();

    /* ================= PASSWORD MATCH ================= */

    const passwordsMatch =
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword;

    /* ================= PASSWORD VALID ================= */

    const isPasswordValid = Object.values(passwordRules).every(Boolean);

    /* ================= DIGITAL ID VALIDATION ================= */

    const digitalIdentityValid =
        /^[A-Za-z0-9_]+$/.test(digitalIdentity) &&
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

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        /* NAME VALIDATION */
        if (name.trim().length < 2) {
            setMessage("Full name must contain at least 2 characters.");
            return;
        }

        /* EMAIL VALIDATION */
        if (!email.includes("@")) {
            setMessage("Please enter a valid email address.");
            return;
        }

        /* PASSWORD VALIDATION */
        if (!isPasswordValid) {
            setMessage("Please create a stronger password.");
            return;
        }

        /* CONFIRM PASSWORD */
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
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
            setMessage("Please accept the Terms and Conditions.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/register", {
                name: name.trim(),
                email: email.trim(),
                password,
                digitalIdentity: digitalIdentity.trim(),
            });

            /* SAVE DEMO LINK WHEN DEMO MODE IS ENABLED */
            if (
                response.data &&
                typeof response.data === "object" &&
                "demoLink" in response.data &&
                typeof response.data.demoLink === "string"
            ) {
                setDemoLink(response.data.demoLink);
            } else {
                setDemoLink("");
            }

            /* SHOW SUCCESS: check your email */
            setSuccessEmail(email.trim());
        } catch (err: unknown) {
            console.error("Registration failed:", err);

            if (axios.isAxiosError(err)) {
                const responseData = err.response?.data;
                const errorText =
                    (typeof responseData === "string" ? responseData : null) ||
                    (responseData &&
                    typeof responseData === "object" &&
                    "message" in responseData &&
                    typeof responseData.message === "string"
                        ? responseData.message
                        : null) ||
                    "Registration failed. Please try again.";

                setMessage(errorText);
                return;
            }

            setMessage("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const strengthTextClass =
        passwordStrength === "Weak"
            ? "text-rose-600 dark:text-rose-400"
            : passwordStrength === "Medium"
            ? "text-amber-600 dark:text-amber-400"
            : "text-emerald-600 dark:text-emerald-400";

    const strengthBarActiveClass =
        passwordStrength === "Weak"
            ? "bg-rose-500"
            : passwordStrength === "Medium"
            ? "bg-amber-500"
            : "bg-emerald-500";

    return (
        <div className="cv-root flex min-h-dvh flex-col overflow-x-clip bg-white text-slate-900 transition-colors duration-200 dark:bg-[#000000] dark:text-slate-100">
            {/* HEADER — aligned with AppNavbar and Login */}
            <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#000000]/90">
                <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-3 px-3.5 sm:h-16 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        aria-label="Calvion home"
                        className={`flex shrink-0 items-center gap-2 rounded-lg sm:gap-2.5 ${FOCUS_RING}`}
                    >
                        <img
                            src="/calvion-icon.png"
                            alt=""
                            width={32}
                            height={32}
                            decoding="async"
                            className="h-7 w-7 rounded-lg object-contain sm:h-8 sm:w-8"
                        />
                        <span className="cv-display text-base font-bold tracking-tight text-slate-950 dark:text-white sm:text-lg">
                            Calvion
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className={`inline-flex h-9 shrink-0 touch-manipulation items-center gap-1.5 rounded-lg bg-transparent px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-white/10 sm:px-3.5 sm:text-sm ${FOCUS_RING}`}
                    >
                        <ArrowLeft size={15} aria-hidden="true" />
                        <span>Back</span>
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="relative flex flex-1 items-center justify-center px-3.5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10 lg:py-12">
                <div className="w-full max-w-[500px]">
                    {successEmail ? (
                        /* ================= SUCCESS STATE ================= */
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors duration-200 dark:border-white/10 dark:bg-[#000000] dark:shadow-none sm:p-8">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300 sm:mb-5">
                                <MailCheck className="h-7 w-7" />
                            </div>

                            <h1 className="cv-display text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                                Check your inbox!
                            </h1>

                            <p className="mt-2.5 text-xs leading-5 text-slate-500 dark:text-neutral-400 sm:text-sm sm:leading-6">
                                We&apos;ve sent a verification link to{" "}
                                <strong className="block break-all font-semibold text-indigo-700 dark:text-indigo-300 sm:mt-0.5">
                                    {successEmail}
                                </strong>
                            </p>

                            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-neutral-400 sm:text-sm sm:leading-6">
                                Click the link in your email to complete
                                registration. The link expires in{" "}
                                <strong className="font-semibold text-slate-800 dark:text-neutral-200">
                                    24 hours
                                </strong>
                                .
                            </p>

                            {demoLink && (
                                <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-left text-xs leading-5 text-slate-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-neutral-300">
                                    <strong className="font-semibold text-slate-900 dark:text-white">
                                        Demo link:
                                    </strong>{" "}
                                    <a
                                        href={demoLink}
                                        className="break-all font-medium text-indigo-700 underline hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200"
                                    >
                                        {demoLink}
                                    </a>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className={`mt-6 flex h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:h-12 ${FOCUS_RING}`}
                            >
                                <span>Go to Login</span>
                                <ArrowRight size={17} />
                            </button>

                            <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
                                <p className="text-xs text-slate-500 dark:text-neutral-400 sm:text-sm">
                                    Entered the wrong email?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setSuccessEmail("")}
                                        className={`rounded font-semibold text-indigo-700 transition hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200 ${FOCUS_RING}`}
                                    >
                                        Go back to registration
                                    </button>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* ================= INTRO HEADER ================= */}
                            <div className="mb-6 text-center sm:mb-8">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300 sm:mb-5 sm:h-14 sm:w-14">
                                    <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
                                </div>

                                <h1 className="cv-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                                    Create your account
                                </h1>

                                <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-neutral-400 sm:mt-2 sm:text-sm sm:leading-6">
                                    Start organizing your digital life in one
                                    secure place.
                                </p>
                            </div>

                            {/* ================= REGISTER CARD ================= */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-white/10 dark:bg-[#000000] dark:shadow-none sm:p-8">
                                {message && (
                                    <div
                                        role="alert"
                                        aria-live="polite"
                                        className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 dark:border-red-900/50 dark:bg-red-950/30 sm:mb-6 sm:px-4"
                                    >
                                        <AlertCircle
                                            size={16}
                                            aria-hidden="true"
                                            className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                                        />
                                        <p className="text-xs font-medium leading-5 text-red-700 dark:text-red-400 sm:text-sm">
                                            {message}
                                        </p>
                                    </div>
                                )}

                                {/* ================= FORM ================= */}
                                <form
                                    onSubmit={handleRegister}
                                    className="space-y-4 sm:space-y-5"
                                >
                                    {/* FULL NAME */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300 sm:mb-2 sm:text-sm"
                                        >
                                            Full Name
                                        </label>

                                        <div className="relative">
                                            <User
                                                size={17}
                                                aria-hidden="true"
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                            />

                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                autoComplete="name"
                                                autoCapitalize="words"
                                                minLength={2}
                                                disabled={loading}
                                                required
                                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400 dark:focus:bg-[#0a0a0a] dark:focus:ring-indigo-400/10 sm:h-12 sm:pl-11 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300 sm:mb-2 sm:text-sm"
                                        >
                                            Email Address
                                        </label>

                                        <div className="relative">
                                            <Mail
                                                size={17}
                                                aria-hidden="true"
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                            />

                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                autoComplete="email"
                                                inputMode="email"
                                                disabled={loading}
                                                required
                                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400 dark:focus:bg-[#0a0a0a] dark:focus:ring-indigo-400/10 sm:h-12 sm:pl-11 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* PASSWORD */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300 sm:mb-2 sm:text-sm"
                                        >
                                            Password
                                        </label>

                                        <div className="relative">
                                            <LockKeyhole
                                                size={17}
                                                aria-hidden="true"
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                            />

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
                                                    setPassword(e.target.value)
                                                }
                                                onFocus={() =>
                                                    setIsPasswordFocused(true)
                                                }
                                                onBlur={() =>
                                                    setIsPasswordFocused(false)
                                                }
                                                autoComplete="new-password"
                                                disabled={loading}
                                                required
                                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400 dark:focus:bg-[#0a0a0a] dark:focus:ring-indigo-400/10 sm:h-12 sm:pl-11 sm:text-sm"
                                            />

                                            <button
                                                type="button"
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                disabled={loading}
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                                className={`absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 ${FOCUS_RING}`}
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>

                                        {/* PASSWORD CONSTRAINTS */}
                                        {isPasswordFocused &&
                                            password.length > 0 && (
                                                <div className="mt-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.03] sm:p-3.5">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-medium text-slate-600 dark:text-neutral-400">
                                                            Password strength
                                                        </span>
                                                        <span
                                                            className={`font-semibold ${strengthTextClass}`}
                                                        >
                                                            {passwordStrength}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 grid grid-cols-5 gap-1.5">
                                                        {[1, 2, 3, 4, 5].map(
                                                            (item) => (
                                                                <span
                                                                    key={item}
                                                                    className={`h-1.5 rounded-full transition-colors ${
                                                                        item <=
                                                                        passedRules
                                                                            ? strengthBarActiveClass
                                                                            : "bg-slate-200 dark:bg-white/10"
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                    </div>

                                                    <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
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

                                    {/* CONFIRM PASSWORD */}
                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300 sm:mb-2 sm:text-sm"
                                        >
                                            Confirm Password
                                        </label>

                                        <div className="relative">
                                            <LockKeyhole
                                                size={17}
                                                aria-hidden="true"
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                            />

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
                                                autoComplete="new-password"
                                                disabled={loading}
                                                required
                                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400 dark:focus:bg-[#0a0a0a] dark:focus:ring-indigo-400/10 sm:h-12 sm:pl-11 sm:text-sm"
                                            />

                                            <button
                                                type="button"
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                disabled={loading}
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                                className={`absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 ${FOCUS_RING}`}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>

                                        {confirmPassword.length > 0 && (
                                            <div
                                                className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                                                    passwordsMatch
                                                        ? "text-emerald-600 dark:text-emerald-400"
                                                        : "text-rose-600 dark:text-rose-400"
                                                }`}
                                            >
                                                {passwordsMatch ? (
                                                    <Check
                                                        size={14}
                                                        className="shrink-0"
                                                    />
                                                ) : (
                                                    <X
                                                        size={14}
                                                        className="shrink-0"
                                                    />
                                                )}
                                                <span>
                                                    {passwordsMatch
                                                        ? "Passwords match"
                                                        : "Passwords do not match"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* DIGITAL IDENTITY */}
                                    <div>
                                        <div className="mb-1.5 flex items-center justify-between gap-2 sm:mb-2">
                                            <label
                                                htmlFor="digitalIdentity"
                                                className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 sm:text-sm"
                                            >
                                                Digital Identity
                                            </label>

                                            <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-neutral-500">
                                                {digitalIdentity.length}/20
                                            </span>
                                        </div>

                                        <div className="relative">
                                            <AtSign
                                                size={17}
                                                aria-hidden="true"
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                            />

                                            <input
                                                id="digitalIdentity"
                                                type="text"
                                                placeholder="e.g. alice_dev"
                                                value={digitalIdentity}
                                                maxLength={20}
                                                autoCapitalize="none"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                disabled={loading}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value.replace(
                                                            /[^A-Za-z0-9_]/g,
                                                            ""
                                                        );
                                                    setDigitalIdentity(value);
                                                }}
                                                required
                                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400 dark:focus:bg-[#0a0a0a] dark:focus:ring-indigo-400/10 sm:h-12 sm:pl-11 sm:text-sm"
                                            />
                                        </div>

                                        <p className="mt-1.5 text-xs text-slate-500 dark:text-neutral-400">
                                            Use 3–20 letters, numbers, and
                                            underscores only.
                                        </p>
                                    </div>

                                    {/* TERMS */}
                                    <div className="flex items-start gap-2.5 pt-0.5">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            disabled={loading}
                                            onChange={(e) =>
                                                setAcceptedTerms(
                                                    e.target.checked
                                                )
                                            }
                                            className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-indigo-600 dark:border-white/20 dark:accent-indigo-400 ${FOCUS_RING}`}
                                        />

                                        <label
                                            htmlFor="terms"
                                            className="cursor-pointer select-none text-xs leading-5 text-slate-600 dark:text-neutral-400 sm:text-sm"
                                        >
                                            I agree to the{" "}
                                            <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                                                Terms and Conditions
                                            </span>
                                        </label>
                                    </div>

                                    {/* SUBMIT */}
                                    <button
                                        type="submit"
                                        disabled={loading || !isFormValid}
                                        className={`group flex h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:h-12 ${FOCUS_RING}`}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-slate-950/30 dark:border-t-slate-950" />
                                                <span>
                                                    Creating account...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Create Account</span>
                                                <ArrowRight
                                                    size={17}
                                                    className="transition-transform group-hover:translate-x-0.5"
                                                />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* LOGIN LINK */}
                                <div className="mt-6 border-t border-slate-200 pt-5 text-center dark:border-white/10 sm:mt-7 sm:pt-6">
                                    <p className="text-xs text-slate-500 dark:text-neutral-400 sm:text-sm">
                                        Already have an account?{" "}
                                        <Link
                                            to="/login"
                                            className={`rounded font-semibold text-indigo-700 transition hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200 ${FOCUS_RING}`}
                                        >
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
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

function PasswordRule({ valid, text }: PasswordRuleProps) {
    return (
        <div
            className={`flex items-center gap-1.5 text-xs ${
                valid
                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                    : "text-slate-500 dark:text-neutral-400"
            }`}
        >
            {valid ? (
                <Check size={14} className="shrink-0" />
            ) : (
                <X size={14} className="shrink-0 opacity-60" />
            )}
            <span>{text}</span>
        </div>
    );
}

export default Register;