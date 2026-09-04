import { useEffect, useState } from "react";

import {
    User,
    Mail,
    Fingerprint,
    CalendarDays,
    Save,
    Loader2,
    ShieldCheck,
} from "lucide-react";

import axios from "axios";

import api from "../../services/api";


/* =========================================================
   TYPES
========================================================= */

interface UserProfile {
    id: number;
    name: string;
    email: string;
    digitalIdentity: string;
    role?: string;
    createdAt: string;
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(
    date?: string
) {

    if (!date) {
        return "Unknown";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "Unknown";
    }


    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    );
}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function getErrorMessage(
    error: unknown
) {

    if (
        axios.isAxiosError(error)
    ) {

        const data =
            error.response?.data;


        if (
            typeof data ===
            "string"
        ) {

            return data;
        }


        if (
            data &&
            typeof data === "object" &&
            "message" in data &&
            typeof data.message ===
            "string"
        ) {

            return data.message;
        }


        if (
            error.response?.status ===
            401
        ) {

            return "Your session has expired. Please login again.";
        }


        if (
            error.response?.status ===
            404
        ) {

            return "Profile endpoint was not found.";
        }


        if (
            error.response?.status &&
            error.response.status >= 500
        ) {

            return "Server error. Please try again later.";
        }
    }


    if (
        error instanceof Error
    ) {

        return error.message;
    }


    return "Something went wrong.";
}


/* =========================================================
   COMPONENT
========================================================= */

export default function ProfileSettings() {

    const [
        profile,
        setProfile,
    ] =
        useState<UserProfile | null>(
            null
        );


    const [
        name,
        setName,
    ] =
        useState("");


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        saving,
        setSaving,
    ] =
        useState(false);


    const [
        message,
        setMessage,
    ] =
        useState("");


    const [
        success,
        setSuccess,
    ] =
        useState("");


    /* =====================================================
       FETCH PROFILE
    ===================================================== */

    const fetchProfile =
        async () => {

            try {

                setLoading(true);

                setMessage("");

                setSuccess("");


                const response =
                    await api.get<UserProfile>(
                        "/users/profile"
                    );


                setProfile(
                    response.data
                );


                setName(
                    response.data.name ||
                    ""
                );


            } catch (
                error
                ) {

                console.error(
                    "Failed to load profile:",
                    error
                );


                setMessage(
                    getErrorMessage(
                        error
                    )
                );

            } finally {

                setLoading(false);
            }
        };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        fetchProfile();

    }, []);


    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    const handleSave =
        async (
            event: React.FormEvent<HTMLFormElement>
        ) => {

            event.preventDefault();


            setMessage("");

            setSuccess("");


            const trimmedName =
                name.trim();


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!trimmedName) {

                setMessage(
                    "Name is required."
                );

                return;
            }


            if (
                trimmedName.length >
                100
            ) {

                setMessage(
                    "Name cannot exceed 100 characters."
                );

                return;
            }


            /* ---------------------------------------------
               SAVE
            --------------------------------------------- */

            try {

                setSaving(true);


                await api.put(
                    "/users/profile",
                    {
                        name:
                        trimmedName,
                    }
                );


                /*
                 * Fetch the updated profile
                 * from the backend.
                 */

                await fetchProfile();


                /*
                 * Keep Dashboard username
                 * synchronized.
                 */

                localStorage.setItem(
                    "name",
                    trimmedName
                );


                setSuccess(
                    "Profile updated successfully."
                );


            } catch (
                error
                ) {

                console.error(
                    "Failed to update profile:",
                    error
                );


                setMessage(
                    getErrorMessage(
                        error
                    )
                );

            } finally {

                setSaving(false);
            }
        };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="flex min-h-[420px] items-center justify-center">

                <div className="flex flex-col items-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                        <Loader2
                            size={22}
                            className="animate-spin"
                        />

                    </div>


                    <p className="mt-3 text-sm font-medium text-slate-500">
                        Loading profile...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="space-y-6">


            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                        <User
                            size={19}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                            Profile
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Manage your personal information.
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">


                {/* =================================================
                    CARD HEADER
                ================================================= */}

                <div className="border-b border-slate-100 bg-gradient-to-r from-white via-blue-50/30 to-cyan-50/30 px-5 py-5 dark:border-slate-800 dark:from-slate-900 dark:via-blue-950/20 dark:to-cyan-950/20 sm:px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm">

                            <User
                                size={20}
                            />

                        </div>


                        <div>

                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Personal Information
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Your account information stored securely in DataLife.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={
                        handleSave
                    }
                    className="space-y-6 p-5 sm:p-6"
                >


                    {/* SUCCESS */}

                    {success && (

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">

                            {success}

                        </div>

                    )}


                    {/* ERROR */}

                    {message && (

                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">

                            {message}

                        </div>

                    )}


                    {/* =================================================
                        NAME
                    ================================================= */}

                    <div>

                        <label
                            htmlFor="profile-name"
                            className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                        >
                            Full Name
                        </label>


                        <div className="relative">

                            <User
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />


                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(
                                    event
                                ) => {

                                    setName(
                                        event.target.value
                                    );

                                    setSuccess("");

                                    setMessage("");
                                }}
                                placeholder="Enter your full name"
                                maxLength={100}
                                disabled={saving}
                                required
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-950/40 dark:disabled:bg-slate-900"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <div>

                        <label
                            htmlFor="profile-email"
                            className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                        >
                            Email Address
                        </label>


                        <div className="relative">

                            <Mail
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />


                            <input
                                id="profile-email"
                                type="email"
                                value={
                                    profile?.email ||
                                    ""
                                }
                                readOnly
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                            />

                        </div>


                        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                            Email changes will require verification.
                        </p>

                    </div>


                    {/* =================================================
                        DIGITAL IDENTITY
                    ================================================= */}

                    <div>

                        <label
                            htmlFor="profile-identity"
                            className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                        >
                            Digital Identity
                        </label>


                        <div className="relative">

                            <Fingerprint
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />


                            <input
                                id="profile-identity"
                                type="text"
                                value={
                                    profile?.digitalIdentity ||
                                    ""
                                }
                                readOnly
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 font-mono text-sm text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                            />

                        </div>


                        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                            Your digital identity is unique to your account and cannot be edited.
                        </p>

                    </div>


                    {/* =================================================
                        ACCOUNT CREATED
                    ================================================= */}

                    <div>

                        <label
                            htmlFor="profile-created"
                            className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                        >
                            Account Created
                        </label>


                        <div className="relative">

                            <CalendarDays
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />


                            <input
                                id="profile-created"
                                type="text"
                                value={
                                    formatDate(
                                        profile?.createdAt
                                    )
                                }
                                readOnly
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        ACCOUNT STATUS
                    ================================================= */}

                    <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">

                            <ShieldCheck
                                size={18}
                            />

                        </div>


                        <div>

                            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                                Account information verified
                            </p>

                            <p className="mt-1 text-xs leading-5 text-emerald-700 dark:text-emerald-400">
                                Your email and digital identity are protected account identifiers.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        SAVE
                    ================================================= */}

                    <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">

                        <button
                            type="submit"
                            disabled={
                                saving
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {saving ? (

                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />

                            ) : (

                                <Save
                                    size={17}
                                />

                            )}


                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>

                </form>

            </div>


            {/* =================================================
                SECURITY INFO
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">

                <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400">

                        <ShieldCheck
                            size={17}
                        />

                    </div>


                    <div>

                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Profile security
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Your password is never displayed or returned through the profile API.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}