
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Check,
    Clock3,
    Copy,
    Download,
    Eye,
    EyeOff,
    ExternalLink,
    File,
    FileArchive,
    FileImage,
    FileText,
    FileType2,
    KeyRound,
    Link2,
    Loader2,
    Pencil,
    Share2,
    ShieldCheck,
    Trash2,
    UserRound,
    Users,
    X,
} from "lucide-react";

import api, { apiBaseUrl } from "../services/api";


// =========================================
// TYPES
// =========================================

interface UploadedFile {
    id: number;
    originalFileName: string;
    fileType?: string | null;
    fileSize?: number | null;
}


interface Asset {
    id: number;
    title: string;
    description?: string | null;
    type?: string | null;
    content?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    files?: UploadedFile[];
    owner?: boolean;
    permission?: "VIEW" | "EDIT" | null;
}


interface Credential {
    website?: string;
    username?: string;
    password?: string;
}


interface AssetShare {
    id: number;
    name: string;
    email: string;
    permission: "VIEW" | "EDIT";
    sharedAt?: string | null;
}


// =========================================
// ASSET TYPE LABELS
// =========================================

const assetTypeLabels: Record<string, string> = {
    DOCUMENT: "Document",
    CERTIFICATE: "Certificate",
    NOTE: "Note",
    LINK: "Link",
    CREDENTIAL: "Credential",
    OTHER: "Other",
};


// =========================================
// COMPONENT
// =========================================

function AssetDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    // =========================================
    // ASSET STATE
    // =========================================

    const [asset, setAsset] =
        useState<Asset | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");


    // =========================================
    // ACCESS PERMISSIONS
    // =========================================

    const isOwner = asset?.owner === true;

    const canEdit =
        isOwner ||
        asset?.permission === "EDIT";

    const canShare = isOwner;

    const canManageAccess = isOwner;

    const canDelete = isOwner;


    // =========================================
    // DELETE STATE
    // =========================================

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);


    // =========================================
    // PASSWORD STATE
    // =========================================

    const [showPassword, setShowPassword] =
        useState(false);


    // =========================================
    // SHARE STATE
    // =========================================

    const [showShareModal, setShowShareModal] =
        useState(false);

    const [shareEmail, setShareEmail] =
        useState("");

    const [permission, setPermission] =
        useState("VIEW");

    const [sharing, setSharing] =
        useState(false);

    const [shareMessage, setShareMessage] =
        useState("");


    // =========================================
    // MANAGE ACCESS STATE
    // =========================================

    const [showAccessModal, setShowAccessModal] =
        useState(false);

    const [shares, setShares] =
        useState<AssetShare[]>([]);

    const [loadingShares, setLoadingShares] =
        useState(false);

    const [updatingShareId, setUpdatingShareId] =
        useState<number | null>(null);

    const [removingShareId, setRemovingShareId] =
        useState<number | null>(null);

    const [accessMessage, setAccessMessage] =
        useState("");


    // =========================================
    // COPY STATE
    // =========================================

    const [copied, setCopied] =
        useState(false);


    // =========================================
    // FETCH ASSET
    // =========================================

    useEffect(() => {

        const fetchAsset = async () => {

            try {

                setLoading(true);

                setMessage("");


                const response =
                    await api.get(
                        `/assets/${id}`
                    );


                setAsset(response.data);

            } catch (error: any) {

                console.error(
                    "Failed to fetch asset:",
                    error
                );


                const errorData =
                    error.response?.data;


                if (
                    typeof errorData === "string"
                ) {

                    setMessage(
                        errorData
                    );

                } else {

                    setMessage(
                        errorData?.message ||
                        "Failed to load asset details."
                    );
                }

            } finally {

                setLoading(false);
            }
        };


        if (id) {

            fetchAsset();
        }

    }, [id]);


    // =========================================
    // PARSE CREDENTIAL
    // =========================================

    const credential =
        useMemo<Credential | null>(() => {

            if (
                asset?.type !== "CREDENTIAL" ||
                !asset.content
            ) {

                return null;
            }


            try {

                return JSON.parse(
                    asset.content
                );

            } catch {

                return null;
            }

        }, [asset]);


    // =========================================
    // LOAD ASSET SHARES
    // =========================================

    const loadShares = async () => {

        try {

            setLoadingShares(true);

            setAccessMessage("");


            const response =
                await api.get<AssetShare[]>(
                    `/assets/${id}/shares`
                );


            setShares(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error: any) {

            console.error(
                "Failed to load asset shares:",
                error
            );


            const errorData =
                error.response?.data;


            if (
                typeof errorData === "string"
            ) {

                setAccessMessage(
                    errorData
                );

            } else {

                setAccessMessage(
                    errorData?.message ||
                    "Unable to load access information."
                );
            }

        } finally {

            setLoadingShares(false);
        }
    };


    // =========================================
    // OPEN MANAGE ACCESS
    // =========================================

    const handleManageAccess = async () => {

        setShowAccessModal(true);

        await loadShares();
    };


    // =========================================
    // UPDATE SHARE PERMISSION
    // =========================================

    const handlePermissionChange = async (
        shareId: number,
        newPermission: "VIEW" | "EDIT"
    ) => {

        try {

            setUpdatingShareId(shareId);

            setAccessMessage("");


            await api.put(
                `/assets/${id}/shares/${shareId}`,
                {
                    permission: newPermission,
                }
            );


            setShares((currentShares) =>
                currentShares.map((share) =>
                    share.id === shareId
                        ? {
                            ...share,
                            permission:
                                newPermission,
                        }
                        : share
                )
            );

        } catch (error: any) {

            console.error(
                "Failed to update permission:",
                error
            );


            const errorData =
                error.response?.data;


            if (
                typeof errorData === "string"
            ) {

                setAccessMessage(
                    errorData
                );

            } else {

                setAccessMessage(
                    errorData?.message ||
                    "Unable to update permission."
                );
            }

        } finally {

            setUpdatingShareId(null);
        }
    };


    // =========================================
    // REMOVE SHARE ACCESS
    // =========================================

    const handleRemoveAccess = async (
        shareId: number
    ) => {

        const confirmed =
            window.confirm(
                "Remove this user's access to the asset?"
            );


        if (!confirmed) {

            return;
        }


        try {

            setRemovingShareId(shareId);

            setAccessMessage("");


            await api.delete(
                `/assets/${id}/shares/${shareId}`
            );


            setShares((currentShares) =>
                currentShares.filter(
                    (share) =>
                        share.id !== shareId
                )
            );

        } catch (error: any) {

            console.error(
                "Failed to remove access:",
                error
            );


            const errorData =
                error.response?.data;


            if (
                typeof errorData === "string"
            ) {

                setAccessMessage(
                    errorData
                );

            } else {

                setAccessMessage(
                    errorData?.message ||
                    "Unable to remove access."
                );
            }

        } finally {

            setRemovingShareId(null);
        }
    };


    // =========================================
    // SHARE
    // =========================================

    const handleShare = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setShareMessage("");


        if (!shareEmail.trim()) {

            setShareMessage(
                "Please enter the user's email."
            );

            return;
        }


        try {

            setSharing(true);


            const response =
                await api.post(
                    `/assets/${id}/share`,
                    {
                        email:
                            shareEmail.trim(),

                        permission,
                    }
                );


            if (
                typeof response.data === "string"
            ) {

                setShareMessage(
                    response.data
                );

            } else {

                setShareMessage(
                    "Asset shared successfully."
                );
            }


            setShareEmail("");


        } catch (error: any) {

            console.error(
                "Failed to share asset:",
                error
            );


            const errorData =
                error.response?.data;


            if (
                typeof errorData === "string"
            ) {

                setShareMessage(
                    errorData
                );

            } else {

                setShareMessage(
                    errorData?.message ||
                    "Failed to share asset."
                );
            }

        } finally {

            setSharing(false);
        }
    };


    // =========================================
    // DELETE
    // =========================================

    const handleDelete = async () => {

        try {

            setDeleting(true);

            setMessage("");


            await api.delete(
                `/assets/${id}`
            );


            navigate("/assets");

        } catch (error: any) {

            console.error(
                "Failed to delete asset:",
                error
            );


            const errorData =
                error.response?.data;


            if (
                typeof errorData === "string"
            ) {

                setMessage(
                    errorData
                );

            } else {

                setMessage(
                    errorData?.message ||
                    "Failed to delete asset."
                );
            }


            setShowDeleteModal(false);

        } finally {

            setDeleting(false);
        }
    };


    // =========================================
    // COPY TEXT
    // =========================================

    const handleCopy = async (
        text: string
    ) => {

        try {

            await navigator.clipboard.writeText(
                text
            );


            setCopied(true);


            setTimeout(() => {

                setCopied(false);

            }, 1800);

        } catch (error) {

            console.error(
                "Failed to copy:",
                error
            );
        }
    };


    // =========================================
    // FILE SIZE
    // =========================================

    const formatFileSize = (
        bytes?: number | null
    ) => {

        if (
            !bytes ||
            bytes <= 0
        ) {

            return "Unknown size";
        }


        if (bytes < 1024) {

            return `${bytes} B`;
        }


        if (
            bytes <
            1024 * 1024
        ) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;
        }


        if (
            bytes <
            1024 * 1024 * 1024
        ) {

            return `${(
                bytes /
                (1024 * 1024)
            ).toFixed(1)} MB`;
        }


        return `${(
            bytes /
            (1024 * 1024 * 1024)
        ).toFixed(1)} GB`;
    };


    // =========================================
    // FILE ICON
    // =========================================

    const getFileIcon = (
        file: UploadedFile
    ) => {

        const type =
            file.fileType?.toLowerCase() ||
            "";

        const name =
            file.originalFileName.toLowerCase();


        if (
            type.includes("image") ||
            /\.(png|jpg|jpeg|gif|webp|svg)$/.test(
                name
            )
        ) {

            return (
                <FileImage
                    size={22}
                />
            );
        }


        if (
            type.includes("pdf") ||
            name.endsWith(".pdf")
        ) {

            return (
                <FileType2
                    size={22}
                />
            );
        }


        if (
            type.includes("zip") ||
            type.includes("archive") ||
            /\.(zip|rar|7z)$/.test(
                name
            )
        ) {

            return (
                <FileArchive
                    size={22}
                />
            );
        }


        if (
            type.includes("text") ||
            /\.(txt|md)$/.test(
                name
            )
        ) {

            return (
                <FileText
                    size={22}
                />
            );
        }


        return (
            <File
                size={22}
            />
        );
    };


    // =========================================
    // VIEW FILE
    // =========================================

    const handleViewFile = async (
        fileId: number
    ) => {

        try {

            setMessage("");


            const token =
                localStorage.getItem(
                    "token"
                );


            const response =
                await fetch(
                    `${apiBaseUrl}/assets/${id}/files/${fileId}/view`,
                    {
                        headers: {
                            Authorization:
                                token
                                    ? `Bearer ${token}`
                                    : "",
                        },
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to open file"
                );
            }


            const blob =
                await response.blob();


            const blobUrl =
                window.URL.createObjectURL(
                    blob
                );


            window.open(
                blobUrl,
                "_blank",
                "noopener,noreferrer"
            );


            setTimeout(() => {

                window.URL.revokeObjectURL(
                    blobUrl
                );

            }, 60000);

        } catch (error) {

            console.error(
                "Failed to view file:",
                error
            );


            setMessage(
                "Unable to open this file."
            );
        }
    };


    // =========================================
    // DOWNLOAD FILE
    // =========================================

    const handleDownloadFile = async (
        file: UploadedFile
    ) => {

        try {

            setMessage("");


            const token =
                localStorage.getItem(
                    "token"
                );


            const response =
                await fetch(
                    `${apiBaseUrl}/assets/${id}/files/${file.id}/download`,
                    {
                        headers: {
                            Authorization:
                                token
                                    ? `Bearer ${token}`
                                    : "",
                        },
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Download failed"
                );
            }


            const blob =
                await response.blob();


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                file.originalFileName;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );

        } catch (error) {

            console.error(
                "Failed to download file:",
                error
            );


            setMessage(
                "Unable to download this file."
            );
        }
    };


    // =========================================
    // CLOSE SHARE MODAL
    // =========================================

    const closeShareModal = () => {

        if (sharing) {

            return;
        }


        setShowShareModal(false);

        setShareMessage("");

        setShareEmail("");

        setPermission("VIEW");
    };


    // =========================================
    // CLOSE MANAGE ACCESS
    // =========================================

    const closeAccessModal = () => {

        if (
            loadingShares ||
            updatingShareId !== null ||
            removingShareId !== null
        ) {

            return;
        }


        setShowAccessModal(false);

        setAccessMessage("");
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <main className="min-h-screen bg-slate-50">

                <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">

                    <div className="flex flex-col items-center gap-4 text-center">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <Loader2
                                size={22}
                                className="animate-spin text-violet-600"
                            />

                        </div>


                        <div>

                            <p className="text-sm font-semibold text-slate-700">
                                Loading asset
                            </p>


                            <p className="mt-1 text-sm text-slate-400">
                                Preparing your asset details...
                            </p>

                        </div>

                    </div>

                </div>

            </main>
        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (!asset) {

        return (

            <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8">

                <div className="mx-auto max-w-5xl">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/assets")
                        }
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-violet-600"
                    >

                        <ArrowLeft
                            size={17}
                            className="transition-transform group-hover:-translate-x-0.5"
                        />

                        Back to My Assets

                    </button>


                    <div className="mt-8 rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            !
                        </div>


                        <h1 className="mt-5 text-xl font-bold text-slate-900">
                            Unable to load asset
                        </h1>


                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            {message ||
                                "The requested asset could not be found."}
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


    // =========================================
    // TYPE
    // =========================================

    const typeLabel =
        assetTypeLabels[
        asset.type || "OTHER"
        ] || "Other";


    // =========================================
    // MAIN UI
    // =========================================

    return (

        <main className="min-h-screen bg-slate-50">

            {/* =====================================
                BACKGROUND
            ===================================== */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

                <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-indigo-100/30 blur-3xl" />

            </div>


            <div className="relative mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10">


                {/* =================================
                    TOP NAVIGATION
                ================================= */}

                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/assets")
                        }
                        className="group inline-flex w-fit items-center gap-2 rounded-lg py-2 pr-3 text-sm font-semibold text-slate-500 transition hover:text-violet-600"
                    >

                        <ArrowLeft
                            size={17}
                            className="transition-transform group-hover:-translate-x-0.5"
                        />

                        Back to My Assets

                    </button>


                    <div className="flex flex-wrap items-center gap-2">

                        {/* SHARE - OWNER ONLY */}

                        {canShare && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowShareModal(true)
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 text-sm font-semibold text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
                            >

                                <Share2 size={16} />

                                Share

                            </button>
                        )}


                        {/* MANAGE ACCESS - OWNER ONLY */}

                        {canManageAccess && (
                            <button
                                type="button"
                                onClick={
                                    handleManageAccess
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 text-sm font-semibold text-cyan-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50"
                            >

                                <Users size={16} />

                                Manage Access

                            </button>
                        )}


                        {/* EDIT - OWNER + EDIT */}

                        {canEdit && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/assets/${id}/edit`
                                    )
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                            >

                                <Pencil size={16} />

                                Edit

                            </button>
                        )}


                        {/* DELETE - OWNER ONLY */}

                        {canDelete && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowDeleteModal(true)
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-200 hover:bg-red-50"
                            >

                                <Trash2 size={16} />

                                Delete

                            </button>
                        )}

                    </div>

                </div>


                {/* =================================
                    MAIN CARD
                ================================= */}

                <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.22)]">


                    {/* =================================
                        ASSET HERO
                    ================================= */}

                    <div className="border-b border-slate-100 bg-gradient-to-br from-white via-white to-violet-50/50 px-6 py-7 sm:px-9 sm:py-9 lg:px-10">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                            <div className="min-w-0">

                                <div className="mb-4 flex flex-wrap items-center gap-2">

                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-700">

                                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

                                        {typeLabel}

                                    </span>


                                    <span className="text-xs font-medium text-slate-400">
                                        Asset #{asset.id}
                                    </span>

                                </div>


                                <h1 className="max-w-3xl break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">

                                    {asset.title ||
                                        "Untitled Asset"}

                                </h1>


                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">

                                    {asset.description ||
                                        "No description provided for this asset."}

                                </p>

                            </div>


                            <div className="hidden shrink-0 sm:flex">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">

                                    {asset.type ===
                                        "CREDENTIAL" ? (

                                        <KeyRound
                                            size={25}
                                        />

                                    ) : asset.type ===
                                        "LINK" ? (

                                        <Link2
                                            size={25}
                                        />

                                    ) : (

                                        <FileText
                                            size={25}
                                        />

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="divide-y divide-slate-100">


                        {/* =================================
                            CONTENT
                        ================================= */}

                        <section className="px-6 py-7 sm:px-9 lg:px-10">

                            <div className="mb-4">

                                <h2 className="text-base font-bold text-slate-900">
                                    Content
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Information stored inside this asset.
                                </p>

                            </div>


                            {/* CREDENTIAL */}

                            {asset.type ===
                                "CREDENTIAL" &&
                                credential ? (

                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">

                                    <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                                            <ShieldCheck
                                                size={18}
                                            />

                                        </div>


                                        <div>

                                            <p className="text-sm font-bold text-slate-800">
                                                Secure Credential
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Sensitive information
                                            </p>

                                        </div>

                                    </div>


                                    <div className="grid gap-px bg-slate-200 sm:grid-cols-2">

                                        {/* WEBSITE */}

                                        <div className="bg-slate-50 p-5">

                                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                Website
                                            </span>


                                            <div className="mt-2 flex items-center justify-between gap-3">

                                                <p className="min-w-0 break-all text-sm font-semibold text-slate-800">
                                                    {credential.website ||
                                                        "Not provided"}
                                                </p>


                                                {credential.website && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            window.open(
                                                                credential.website,
                                                                "_blank",
                                                                "noopener,noreferrer"
                                                            )
                                                        }
                                                        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-violet-600"
                                                        title="Open website"
                                                    >

                                                        <ExternalLink
                                                            size={16}
                                                        />

                                                    </button>

                                                )}

                                            </div>

                                        </div>


                                        {/* USERNAME */}

                                        <div className="bg-slate-50 p-5">

                                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                Username / Email
                                            </span>


                                            <div className="mt-2 flex items-center justify-between gap-3">

                                                <p className="min-w-0 break-all text-sm font-semibold text-slate-800">
                                                    {credential.username ||
                                                        "Not provided"}
                                                </p>


                                                {credential.username && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCopy(
                                                                credential.username ||
                                                                ""
                                                            )
                                                        }
                                                        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-violet-600"
                                                        title="Copy username"
                                                    >

                                                        {copied ? (
                                                            <Check
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <Copy
                                                                size={16}
                                                            />
                                                        )}

                                                    </button>

                                                )}

                                            </div>

                                        </div>


                                        {/* PASSWORD */}

                                        <div className="bg-slate-50 p-5 sm:col-span-2">

                                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                Password
                                            </span>


                                            <div className="mt-2 flex items-center gap-2">

                                                <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-white px-4 py-3">

                                                    <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap bg-transparent font-mono text-sm font-semibold tracking-wide text-slate-700">

                                                        {credential.password
                                                            ? showPassword
                                                                ? credential.password
                                                                : "••••••••••••"
                                                            : "Not provided"}

                                                    </code>

                                                </div>


                                                {credential.password && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                                                        title={
                                                            showPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                    >

                                                        {showPassword ? (
                                                            <EyeOff
                                                                size={18}
                                                            />
                                                        ) : (
                                                            <Eye
                                                                size={18}
                                                            />
                                                        )}

                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ) : (

                                <div className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">

                                    {asset.type === "LINK" && asset.content ? (
                                        <a
                                            href={asset.content}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 break-all text-sm font-semibold leading-7 text-cyan-600 hover:text-cyan-700 hover:underline"
                                        >
                                            <ExternalLink size={16} className="shrink-0" />
                                            {asset.content}
                                        </a>
                                    ) : (
                                        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                                            {asset.content || "No content provided."}
                                        </p>
                                    )}

                                </div>

                            )}

                        </section>


                        {/* =================================
                            FILES
                        ================================= */}

                        {asset.files &&
                            asset.files.length > 0 && (

                                <section className="px-6 py-7 sm:px-9 lg:px-10">

                                    <div className="mb-5 flex items-end justify-between gap-4">

                                        <div>

                                            <h2 className="text-base font-bold text-slate-900">
                                                Uploaded Files
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-400">

                                                {asset.files.length}{" "}

                                                {asset.files.length === 1
                                                    ? "file"
                                                    : "files"}{" "}

                                                attached to this asset.

                                            </p>

                                        </div>


                                        <div className="hidden h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-bold text-slate-500 sm:flex">

                                            {asset.files.length}

                                        </div>

                                    </div>


                                    <div className="space-y-3">

                                        {asset.files.map(
                                            (file) => (

                                                <div
                                                    key={file.id}
                                                    className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                                                >

                                                    <div className="flex min-w-0 items-center gap-4">

                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100">

                                                            {getFileIcon(
                                                                file
                                                            )}

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-bold text-slate-800">
                                                                {file.originalFileName}
                                                            </p>


                                                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">

                                                                <span>
                                                                    {file.fileType ||
                                                                        "File"}
                                                                </span>


                                                                <span>
                                                                    •
                                                                </span>


                                                                <span>
                                                                    {formatFileSize(
                                                                        file.fileSize
                                                                    )}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div className="flex shrink-0 gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewFile(
                                                                    file.id
                                                                )
                                                            }
                                                            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:flex-none"
                                                        >

                                                            <ExternalLink
                                                                size={15}
                                                            />

                                                            View

                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDownloadFile(
                                                                    file
                                                                )
                                                            }
                                                            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white transition hover:bg-violet-700 sm:flex-none"
                                                        >

                                                            <Download
                                                                size={15}
                                                            />

                                                            Download

                                                        </button>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </section>

                            )}


                        {/* =================================
                            METADATA
                        ================================= */}

                        <section className="bg-slate-50/60 px-6 py-7 sm:px-9 lg:px-10">

                            <div className="mb-5">

                                <h2 className="text-base font-bold text-slate-900">
                                    Asset Information
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Basic information about this asset.
                                </p>

                            </div>


                            <div className="grid gap-3 sm:grid-cols-3">

                                <div className="rounded-2xl border border-slate-200 bg-white p-4">

                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">

                                        <FileText
                                            size={14}
                                        />

                                        Asset ID

                                    </div>


                                    <p className="mt-3 text-sm font-bold text-slate-800">
                                        #{asset.id}
                                    </p>

                                </div>


                                <div className="rounded-2xl border border-slate-200 bg-white p-4">

                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">

                                        <Clock3
                                            size={14}
                                        />

                                        Created

                                    </div>


                                    <p className="mt-3 break-words text-sm font-semibold text-slate-700">

                                        {asset.createdAt
                                            ? new Date(
                                                asset.createdAt
                                            ).toLocaleString()
                                            : "No date"}

                                    </p>

                                </div>


                                <div className="rounded-2xl border border-slate-200 bg-white p-4">

                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">

                                        <Clock3
                                            size={14}
                                        />

                                        Last Updated

                                    </div>


                                    <p className="mt-3 break-words text-sm font-semibold text-slate-700">

                                        {asset.updatedAt
                                            ? new Date(
                                                asset.updatedAt
                                            ).toLocaleString()
                                            : "No date"}

                                    </p>

                                </div>

                            </div>

                        </section>

                    </div>

                </section>


                {/* =================================
                    ERROR MESSAGE
                ================================= */}

                {message && (

                    <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">

                        {message}

                    </div>

                )}

            </div>


            {/* =====================================
                SHARE MODAL
            ===================================== */}

            {showShareModal && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            closeShareModal();
                        }

                    }}
                >

                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

                        <button
                            type="button"
                            onClick={
                                closeShareModal
                            }
                            disabled={sharing}
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close share dialog"
                        >

                            <X size={18} />

                        </button>


                        <div className="border-b border-slate-100 bg-gradient-to-br from-violet-50/70 to-white px-6 py-6">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">

                                <Share2
                                    size={21}
                                />

                            </div>


                            <h2 className="mt-4 text-xl font-bold text-slate-900">
                                Share Asset
                            </h2>


                            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">

                                Give another Calvion user access to{" "}

                                <strong className="font-semibold text-slate-700">
                                    {asset.title}
                                </strong>

                                .

                            </p>

                        </div>


                        <form
                            onSubmit={
                                handleShare
                            }
                            className="p-6"
                        >

                            <div className="space-y-5">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        User Email
                                    </label>


                                    <div className="relative">

                                        <UserRound
                                            size={17}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />


                                        <input
                                            type="email"
                                            value={
                                                shareEmail
                                            }
                                            onChange={(e) => {

                                                setShareEmail(
                                                    e.target.value
                                                );

                                                setShareMessage(
                                                    ""
                                                );

                                            }}
                                            placeholder="user@example.com"
                                            disabled={
                                                sharing
                                            }
                                            required
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
                                        />

                                    </div>

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Permission
                                    </label>


                                    <select
                                        value={
                                            permission
                                        }
                                        onChange={(e) =>
                                            setPermission(
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            sharing
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
                                    >

                                        <option value="VIEW">
                                            View only
                                        </option>

                                        <option value="EDIT">
                                            Can edit
                                        </option>

                                    </select>


                                    <p className="mt-2 text-xs leading-5 text-slate-400">

                                        {permission ===
                                            "VIEW"
                                            ? "The user can view this asset but cannot modify it."
                                            : "The user can view and modify this asset."}

                                    </p>

                                </div>


                                {shareMessage && (

                                    <div
                                        className={`rounded-xl border px-4 py-3 text-sm font-medium ${shareMessage
                                                .toLowerCase()
                                                .includes(
                                                    "successfully"
                                                )
                                                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                                : "border-red-100 bg-red-50 text-red-600"
                                            }`}
                                    >

                                        {shareMessage}

                                    </div>

                                )}

                            </div>


                            <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        closeShareModal
                                    }
                                    disabled={
                                        sharing
                                    }
                                    className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        sharing
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {sharing ? (

                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Share2
                                            size={16}
                                        />

                                    )}


                                    {sharing
                                        ? "Sharing..."
                                        : "Share Asset"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =====================================
                MANAGE ACCESS MODAL
            ===================================== */}

            {showAccessModal && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            closeAccessModal();
                        }

                    }}
                >

                    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

                        {/* HEADER */}

                        <div className="border-b border-slate-100 bg-gradient-to-br from-cyan-50/80 via-white to-blue-50/70 px-6 py-6">

                            <button
                                type="button"
                                onClick={
                                    closeAccessModal
                                }
                                disabled={
                                    loadingShares ||
                                    updatingShareId !== null ||
                                    removingShareId !== null
                                }
                                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Close manage access dialog"
                            >

                                <X size={18} />

                            </button>


                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">

                                <Users size={21} />

                            </div>


                            <h2 className="mt-4 text-xl font-bold text-slate-900">
                                Manage Access
                            </h2>


                            <p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">

                                Manage who can access{" "}

                                <strong className="font-semibold text-slate-700">
                                    {asset.title}
                                </strong>

                                .

                            </p>

                        </div>


                        {/* CONTENT */}

                        <div className="max-h-[60vh] overflow-y-auto p-6">

                            {loadingShares ? (

                                <div className="flex min-h-40 flex-col items-center justify-center gap-3">

                                    <Loader2
                                        size={24}
                                        className="animate-spin text-cyan-600"
                                    />

                                    <p className="text-sm font-medium text-slate-500">
                                        Loading access information...
                                    </p>

                                </div>

                            ) : shares.length ===
                                0 ? (

                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">

                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">

                                        <Users
                                            size={21}
                                        />

                                    </div>


                                    <h3 className="mt-4 text-sm font-bold text-slate-800">
                                        No one has access
                                    </h3>


                                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                                        This asset hasn't been shared with any other Calvion user yet.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {shares.map(
                                        (share) => (

                                            <div
                                                key={
                                                    share.id
                                                }
                                                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-200 hover:shadow-sm"
                                            >

                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                    {/* USER */}

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-sm">

                                                            {share.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase() ||
                                                                "U"}

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-bold text-slate-800">
                                                                {share.name ||
                                                                    "Unknown user"}
                                                            </p>


                                                            <p className="truncate text-xs text-slate-400">
                                                                {share.email}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* CONTROLS */}

                                                    <div className="flex items-center gap-2">

                                                        <select
                                                            value={
                                                                share.permission
                                                            }
                                                            disabled={
                                                                updatingShareId ===
                                                                share.id ||
                                                                removingShareId ===
                                                                share.id
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                handlePermissionChange(
                                                                    share.id,
                                                                    e
                                                                        .target
                                                                        .value as
                                                                    | "VIEW"
                                                                    | "EDIT"
                                                                )
                                                            }
                                                            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                                                        >

                                                            <option value="VIEW">
                                                                View only
                                                            </option>

                                                            <option value="EDIT">
                                                                Can edit
                                                            </option>

                                                        </select>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveAccess(
                                                                    share.id
                                                                )
                                                            }
                                                            disabled={
                                                                updatingShareId ===
                                                                share.id ||
                                                                removingShareId ===
                                                                share.id
                                                            }
                                                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 text-xs font-bold text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            {removingShareId ===
                                                                share.id ? (

                                                                <Loader2
                                                                    size={
                                                                        14
                                                                    }
                                                                    className="animate-spin"
                                                                />

                                                            ) : (

                                                                <Trash2
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                            )}


                                                            Remove

                                                        </button>

                                                    </div>

                                                </div>


                                                {/* PERMISSION INFO */}

                                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">

                                                    <ShieldCheck
                                                        size={
                                                            13
                                                        }
                                                    />


                                                    {share.permission ===
                                                        "EDIT"
                                                        ? "Can view and modify this asset."
                                                        : "Can view this asset but cannot modify it."}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}


                            {/* ACCESS ERROR */}

                            {accessMessage && (

                                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">

                                    {accessMessage}

                                </div>

                            )}

                        </div>


                        {/* FOOTER */}

                        <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4">

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <p className="text-xs text-slate-400">

                                    {shares.length}{" "}

                                    {shares.length ===
                                        1
                                        ? "person has"
                                        : "people have"}{" "}

                                    access to this asset.

                                </p>


                                <button
                                    type="button"
                                    onClick={
                                        closeAccessModal
                                    }
                                    disabled={
                                        loadingShares ||
                                        updatingShareId !== null ||
                                        removingShareId !== null
                                    }
                                    className="h-10 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Done
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================
                DELETE MODAL
            ===================================== */}

            {showDeleteModal && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget &&
                            !deleting
                        ) {

                            setShowDeleteModal(
                                false
                            );
                        }

                    }}
                >

                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">

                            <Trash2
                                size={21}
                            />

                        </div>


                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Delete this asset?
                        </h2>


                        <p className="mt-2 text-sm leading-6 text-slate-500">

                            You are about to permanently delete{" "}

                            <strong className="font-semibold text-slate-700">
                                {asset.title}
                            </strong>

                            . All uploaded files associated with it will also be removed.

                        </p>


                        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">

                            This action cannot be undone.

                        </div>


                        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowDeleteModal(
                                        false
                                    )
                                }
                                disabled={
                                    deleting
                                }
                                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    deleting
                                }
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {deleting ? (

                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <Trash2
                                        size={16}
                                    />

                                )}


                                {deleting
                                    ? "Deleting..."
                                    : "Delete Asset"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </main>
    );
}


export default AssetDetails;
