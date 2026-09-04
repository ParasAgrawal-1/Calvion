import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    FileText,
    Loader2,
    Save,
    ShieldCheck,
} from "lucide-react";

import api from "../services/api";


// =========================================================
// TYPES
// =========================================================

type AssetPermission = "VIEW" | "EDIT";

interface Asset {
    id: number;
    title: string;
    description?: string | null;
    type?: string | null;
    content?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;

    owner?: boolean;
    permission?: AssetPermission | null;
}


// =========================================================
// ASSET TYPE LABELS
// =========================================================

const assetTypeLabels: Record<string, string> = {
    DOCUMENT: "Document",
    CERTIFICATE: "Certificate",
    NOTE: "Note",
    LINK: "Link",
    CREDENTIAL: "Credential",
    OTHER: "Other",
};


// =========================================================
// COMPONENT
// =========================================================

function EditAsset() {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // FORM STATE
    // =====================================================

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [type, setType] =
        useState("OTHER");


    // =====================================================
    // ASSET STATE
    // =====================================================

    const [asset, setAsset] =
        useState<Asset | null>(null);


    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    // =====================================================
    // FETCH ASSET
    // =====================================================

    useEffect(() => {

        let mounted = true;


        const fetchAsset = async () => {

            try {

                setLoading(true);
                setMessage("");
                setSuccessMessage("");


                if (!id) {

                    setMessage(
                        "Invalid asset ID."
                    );

                    return;
                }


                // IMPORTANT:
                // api.ts already contains /api
                //
                // Correct:
                // /assets/${id}
                //
                // NOT:
                // /api/assets/${id}

                const response =
                    await api.get<Asset>(
                        `/assets/${id}`
                    );


                if (!mounted) {
                    return;
                }


                const loadedAsset =
                    response.data;


                setAsset(
                    loadedAsset
                );


                setTitle(
                    loadedAsset.title || ""
                );


                setDescription(
                    loadedAsset.description || ""
                );


                setType(
                    loadedAsset.type || "OTHER"
                );


                // =================================================
                // PERMISSION CHECK
                // =================================================

                const isOwner =
                    loadedAsset.owner === true;


                const canEdit =
                    isOwner ||
                    loadedAsset.permission === "EDIT";


                if (!canEdit) {

                    setMessage(
                        "You only have view permission for this asset."
                    );
                }


            } catch (error: any) {

                console.error(
                    "Failed to load asset:",
                    error
                );


                if (!mounted) {
                    return;
                }


                const status =
                    error.response?.status;


                const errorData =
                    error.response?.data;


                if (status === 401) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "email"
                    );

                    localStorage.removeItem(
                        "name"
                    );

                    navigate(
                        "/login",
                        {
                            replace: true,
                        }
                    );

                    return;
                }


                if (
                    status === 403
                ) {

                    setMessage(
                        typeof errorData === "string"
                            ? errorData
                            : "You do not have permission to edit this asset."
                    );

                    return;
                }


                if (
                    typeof errorData === "string"
                ) {

                    setMessage(
                        errorData
                    );

                } else {

                    setMessage(
                        errorData?.message ||
                        "Failed to load asset."
                    );
                }


            } finally {

                if (mounted) {

                    setLoading(false);
                }
            }
        };


        fetchAsset();


        return () => {

            mounted = false;
        };

    }, [id, navigate]);


    // =====================================================
    // UPDATE ASSET
    // =====================================================

    const handleUpdate = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();


        setMessage("");
        setSuccessMessage("");


        if (!id) {

            setMessage(
                "Invalid asset ID."
            );

            return;
        }


        if (!asset) {

            setMessage(
                "Asset information is not available."
            );

            return;
        }


        // =================================================
        // FRONTEND PERMISSION CHECK
        // =================================================

        const isOwner =
            asset.owner === true;


        const canEdit =
            isOwner ||
            asset.permission === "EDIT";


        if (!canEdit) {

            setMessage(
                "You only have view permission. You cannot edit this asset."
            );

            return;
        }


        // =================================================
        // VALIDATION
        // =================================================

        const trimmedTitle =
            title.trim();


        if (!trimmedTitle) {

            setMessage(
                "Asset title is required."
            );

            return;
        }


        try {

            setSaving(true);


            // =================================================
            // UPDATE REQUEST
            // =================================================

            await api.put(
                `/assets/${id}`,
                {
                    title: trimmedTitle,

                    description:
                        description.trim(),

                    type,
                }
            );


            setSuccessMessage(
                "Asset updated successfully."
            );


            // Give the user a moment to see success message
            // before returning to the asset details page.

            setTimeout(() => {

                navigate(
                    `/assets/${id}`
                );

            }, 700);


        } catch (error: any) {

            console.error(
                "Failed to update asset:",
                error
            );


            const status =
                error.response?.status;


            const errorData =
                error.response?.data;


            if (status === 401) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "email"
                );

                localStorage.removeItem(
                    "name"
                );


                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );

                return;
            }


            if (status === 403) {

                setMessage(
                    typeof errorData === "string"
                        ? errorData
                        : "You do not have permission to edit this asset."
                );

                return;
            }


            if (
                typeof errorData === "string"
            ) {

                setMessage(
                    errorData
                );

            } else {

                setMessage(
                    errorData?.message ||
                    "Failed to update asset."
                );
            }


        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // LOADING UI
    // =====================================================

    if (loading) {

        return (
            <main className="min-h-screen bg-slate-50">

                <div className="flex min-h-screen items-center justify-center px-5">

                    <div className="flex flex-col items-center text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-100 bg-white shadow-sm">

                            <Loader2
                                size={24}
                                className="animate-spin text-cyan-600"
                            />

                        </div>


                        <h2 className="mt-5 text-base font-bold text-slate-800">
                            Loading asset
                        </h2>


                        <p className="mt-1 text-sm text-slate-400">
                            Preparing the editor...
                        </p>

                    </div>

                </div>

            </main>
        );
    }


    // =====================================================
    // ERROR UI
    // =====================================================

    if (!asset) {

        return (
            <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8">

                <div className="mx-auto max-w-3xl">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/assets")
                        }
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan-700"
                    >

                        <ArrowLeft
                            size={17}
                            className="transition-transform group-hover:-translate-x-0.5"
                        />

                        Back to My Assets

                    </button>


                    <div className="mt-8 rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">

                            <span className="text-xl font-bold">
                                !
                            </span>

                        </div>


                        <h1 className="mt-5 text-xl font-bold text-slate-900">
                            Unable to load asset
                        </h1>


                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            {message ||
                                "The requested asset could not be loaded."}
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/assets")
                            }
                            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Return to Assets
                        </button>

                    </div>

                </div>

            </main>
        );
    }


    // =====================================================
    // PERMISSION
    // =====================================================

    const isOwner =
        asset.owner === true;


    const canEdit =
        isOwner ||
        asset.permission === "EDIT";


    const permissionLabel =
        isOwner
            ? "Owner"
            : asset.permission === "EDIT"
                ? "Can edit"
                : "View only";


    // =====================================================
    // MAIN UI
    // =====================================================

    return (
        <main className="min-h-screen bg-slate-50">

            {/* =============================================
                BACKGROUND
            ============================================= */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-200/25 blur-3xl" />

                <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-blue-200/25 blur-3xl" />

            </div>


            <div className="relative mx-auto w-full max-w-4xl px-5 py-6 sm:px-8 sm:py-8">

                {/* =========================================
                    TOP NAVIGATION
                ========================================= */}

                <div className="mb-7 flex items-center justify-between gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/assets/${id}`)
                        }
                        className="group inline-flex items-center gap-2 rounded-lg py-2 pr-3 text-sm font-semibold text-slate-500 transition hover:text-cyan-700"
                    >

                        <ArrowLeft
                            size={17}
                            className="transition-transform group-hover:-translate-x-0.5"
                        />

                        Back to Asset

                    </button>


                    <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 sm:flex">

                        <ShieldCheck
                            size={15}
                            className={
                                canEdit
                                    ? "text-cyan-600"
                                    : "text-slate-400"
                            }
                        />

                        <span className="text-xs font-bold text-slate-600">
                            {permissionLabel}
                        </span>

                    </div>

                </div>


                {/* =========================================
                    MAIN CARD
                ========================================= */}

                <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.22)]">

                    {/* =====================================
                        HEADER
                    ===================================== */}

                    <div className="border-b border-slate-100 bg-gradient-to-br from-white via-white to-cyan-50/60 px-6 py-7 sm:px-9 sm:py-8">

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">

                                <FileText
                                    size={22}
                                />

                            </div>


                            <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                    <span className="inline-flex items-center rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cyan-700">

                                        Edit Asset

                                    </span>


                                    <span className="text-xs font-medium text-slate-400">

                                        #{asset.id}

                                    </span>

                                </div>


                                <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">

                                    {asset.title ||
                                        "Untitled Asset"}

                                </h1>


                                <p className="mt-2 text-sm leading-6 text-slate-500">

                                    Update the information stored in this digital asset.

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        VIEW ONLY WARNING
                    ===================================== */}

                    {!canEdit && (

                        <div className="border-b border-amber-100 bg-amber-50 px-6 py-4 sm:px-9">

                            <div className="flex items-start gap-3">

                                <ShieldCheck
                                    size={19}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />

                                <div>

                                    <p className="text-sm font-bold text-amber-800">
                                        View-only access
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-amber-700">
                                        You can view this asset, but you do not have permission to modify it.
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =====================================
                        FORM
                    ===================================== */}

                    <form
                        onSubmit={handleUpdate}
                        className="px-6 py-7 sm:px-9 sm:py-9"
                    >

                        <div className="space-y-6">

                            {/* =================================
                                TITLE
                            ================================= */}

                            <div>

                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Asset Title
                                </label>


                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(
                                            e.target.value
                                        );
                                        setMessage("");
                                    }}
                                    placeholder="Enter asset title"
                                    disabled={
                                        saving ||
                                        !canEdit
                                    }
                                    required
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                />

                            </div>


                            {/* =================================
                                DESCRIPTION
                            ================================= */}

                            <div>

                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Description
                                </label>


                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(
                                            e.target.value
                                        );
                                        setMessage("");
                                    }}
                                    placeholder="Describe this asset..."
                                    disabled={
                                        saving ||
                                        !canEdit
                                    }
                                    rows={5}
                                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                />

                            </div>


                            {/* =================================
                                TYPE
                            ================================= */}

                            <div>

                                <label
                                    htmlFor="type"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Asset Type
                                </label>


                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => {
                                        setType(
                                            e.target.value
                                        );
                                        setMessage("");
                                    }}
                                    disabled={
                                        saving ||
                                        !canEdit
                                    }
                                    required
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                >

                                    <option value="DOCUMENT">
                                        Document
                                    </option>

                                    <option value="CERTIFICATE">
                                        Certificate
                                    </option>

                                    <option value="NOTE">
                                        Note
                                    </option>

                                    <option value="LINK">
                                        Link
                                    </option>

                                    <option value="CREDENTIAL">
                                        Credential
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>


                                <p className="mt-2 text-xs text-slate-400">

                                    Current type:{" "}

                                    <span className="font-semibold text-slate-500">

                                        {assetTypeLabels[type] ||
                                            "Other"}

                                    </span>

                                </p>

                            </div>


                            {/* =================================
                                MESSAGES
                            ================================= */}

                            {message && (

                                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-600">

                                    {message}

                                </div>

                            )}


                            {successMessage && (

                                <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-5 text-emerald-700">

                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <span>
                                        {successMessage}
                                    </span>

                                </div>

                            )}

                        </div>


                        {/* =====================================
                            ACTIONS
                        ===================================== */}

                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/assets/${id}`)
                                }
                                disabled={saving}
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    !canEdit
                                }
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                                    ? "Saving Changes..."
                                    : "Save Changes"}

                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </main>
    );
}

export default EditAsset;