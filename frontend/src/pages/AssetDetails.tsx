
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
    Hash,
    KeyRound,
    Link2,
    Loader2,
    Lock,
    Pencil,
    Share2,
    ShieldCheck,
    Trash2,
    UserRound,
    Users,
    X,
} from "lucide-react";

import api, { apiBaseUrl } from "../services/api";
import { decryptText, decryptFile } from "../utils/crypto";


// =========================================
// TYPES
// =========================================

interface UploadedFile {
    id: number;
    originalFileName: string;
    fileType?: string | null;
    fileSize?: number | null;
    encrypted?: boolean | null;
    fileHash?: string | null;
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

    const [copiedHashId, setCopiedHashId] =
        useState<number | null>(null);

    const handleCopyHash = (fileId: number, hash: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedHashId(fileId);
        setTimeout(() => setCopiedHashId(null), 2000);
    };


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


                const rawData = response.data;

                /*
                 * Zero-Knowledge Client-Side Decryption:
                 * Decrypts title, description, and content in the user's browser.
                 * If the fields were saved in legacy plaintext, decryptText passes them through.
                 */
                const [decryptedTitle, decryptedDescription, decryptedContent] =
                    await Promise.all([
                        decryptText(rawData?.title),
                        decryptText(rawData?.description),
                        decryptText(rawData?.content),
                    ]);

                let mappedFiles = rawData?.files || [];
                try {
                    if (decryptedContent && decryptedContent.trim().startsWith("[")) {
                        const parsedMetadata = JSON.parse(decryptedContent);
                        if (Array.isArray(parsedMetadata)) {
                            mappedFiles = mappedFiles.map((file: UploadedFile, idx: number) => {
                                const meta = parsedMetadata[idx];
                                return meta
                                    ? {
                                          ...file,
                                          originalFileName: meta.name || file.originalFileName,
                                          fileType: meta.type || file.fileType,
                                          fileSize: meta.size || file.fileSize,
                                      }
                                    : file;
                            });
                        }
                    }
                } catch {
                    // Fallback to existing file fields
                }

                setAsset({
                    ...rawData,
                    title: decryptedTitle,
                    description: decryptedDescription,
                    content: decryptedContent,
                    files: mappedFiles,
                });

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

            /*
             * Zero-Knowledge Client-Side Decryption:
             * Decrypts the binary container and recovers the original file content
             * and original filename, without the server ever knowing the contents.
             */
            const { blob: finalBlob, fileName: finalFileName } =
                await decryptFile(blob, file.originalFileName);

            const url =
                window.URL.createObjectURL(
                    finalBlob
                );


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                finalFileName;


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

            <main className="min-h-screen bg-slate-50 dark:bg-black">

                <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">

                    <div className="flex flex-col items-center gap-4 text-center">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#0c0c0e]">

                            <Loader2
                                size={22}
                                className="animate-spin text-violet-600 dark:text-cyan-400"
                            />

                        </div>


                        <div>

                            <p className="text-sm font-semibold text-slate-700 dark:text-neutral-200">
                                Loading asset
                            </p>


                            <p className="mt-1 text-sm text-slate-400 dark:text-neutral-500">
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

            <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 dark:bg-black dark:text-neutral-100">

                <div className="mx-auto max-w-5xl">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/assets")
                        }
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-violet-600 dark:text-neutral-400 dark:hover:text-cyan-400"
                    >

                        <ArrowLeft
                            size={17}
                            className="transition-transform group-hover:-translate-x-0.5"
                        />

                        Back to My Assets

                    </button>


                    <div className="mt-8 rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-[#0c0c0e]">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
                            !
                        </div>


                        <h1 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                            Unable to load asset
                        </h1>


                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-neutral-400">
                            {message ||
                                "The requested asset could not be found."}
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/assets")
                            }
                            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
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

        <main className="min-h-screen bg-slate-50 dark:bg-black dark:text-neutral-100">

            {/* =====================================
                BACKGROUND
            ===================================== */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/10" />

                <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-indigo-100/30 blur-3xl dark:bg-cyan-900/10" />

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
                        className="group inline-flex w-fit items-center gap-2 rounded-lg py-2 pr-3 text-sm font-semibold text-slate-500 transition hover:text-violet-600 dark:text-neutral-400 dark:hover:text-cyan-400"
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
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 text-sm font-semibold text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-900/50"
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
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 text-sm font-semibold text-cyan-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-900/50"
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
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
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
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50"
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

                <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.22)] dark:border-neutral-800 dark:bg-[#0c0c0e] dark:shadow-none">


                    {/* =================================
                        ASSET HERO
                    ================================= */}

                    <div className="border-b border-slate-100 bg-gradient-to-br from-white via-white to-violet-50/50 px-6 py-7 sm:px-9 sm:py-9 lg:px-10 dark:border-neutral-800 dark:bg-gradient-to-br dark:from-[#0c0c0e] dark:via-neutral-900/40 dark:to-neutral-900/60">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                            <div className="min-w-0">

                                <div className="mb-4 flex flex-wrap items-center gap-2">

                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">

                                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

                                        {typeLabel}

                                    </span>


                                    <span className="text-xs font-medium text-slate-400 dark:text-neutral-500">
                                        Asset #{asset.id}
                                    </span>

                                </div>


                                <h1 className="max-w-3xl break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">

                                    {asset.title ||
                                        "Untitled Asset"}

                                </h1>


                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-neutral-400">

                                    {asset.description ||
                                        "No description provided for this asset."}

                                </p>

                            </div>


                            <div className="hidden shrink-0 sm:flex">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100 dark:bg-neutral-900 dark:text-cyan-400 dark:ring-neutral-800">

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


                    <div className="divide-y divide-slate-100 dark:divide-neutral-800">


                        {/* =================================
                            CONTENT
                        ================================= */}

                        <section className="px-6 py-7 sm:px-9 lg:px-10">

                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                                <div>

                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Content
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-400 dark:text-neutral-500">
                                        Information stored inside this asset.
                                    </p>

                                </div>

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80 shadow-xs dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                                    <span>Zero-Knowledge Protected (AES-256-GCM)</span>
                                </span>

                            </div>


                            {/* CREDENTIAL */}

                            {asset.type ===
                                "CREDENTIAL" &&
                                credential ? (

                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-neutral-800 dark:bg-black">

                                    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">

                                                <ShieldCheck
                                                    size={18}
                                                />

                                            </div>


                                            <div>

                                                <p className="text-sm font-bold text-slate-800 dark:text-white">
                                                    Secure Credential
                                                </p>

                                                <p className="text-xs text-slate-400 dark:text-neutral-500">
                                                    Sensitive information
                                                </p>

                                            </div>

                                        </div>

                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            <Lock size={11} className="text-emerald-600 dark:text-emerald-400" />
                                            Vault Protected
                                        </span>

                                    </div>


                                    <div className="grid gap-px bg-slate-200 sm:grid-cols-2 dark:bg-neutral-800">

                                        {/* WEBSITE */}

                                        <div className="bg-slate-50 p-5 dark:bg-black">

                                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                                                Website
                                            </span>


                                            <div className="mt-2 flex items-center justify-between gap-3">

                                                <p className="min-w-0 break-all text-sm font-semibold text-slate-800 dark:text-neutral-200">
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
                                                        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-violet-600 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
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

                                        <div className="bg-slate-50 p-5 dark:bg-black">

                                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                                                Username / Email
                                            </span>


                                            <div className="mt-2 flex items-center justify-between gap-3">

                                                <p className="min-w-0 break-all text-sm font-semibold text-slate-800 dark:text-neutral-200">
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
                                                        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-violet-600 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
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

                                        <div className="bg-slate-50 p-5 sm:col-span-2 dark:bg-black">

                                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                                                Password
                                            </span>


                                            <div className="mt-2 flex items-center gap-2">

                                                <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/80">

                                                    <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap bg-transparent font-mono text-sm font-semibold tracking-wide text-slate-700 dark:text-neutral-200">

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
                                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
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

                                <div className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-neutral-800 dark:bg-black">

                                    {asset.type === "LINK" && asset.content ? (
                                        <a
                                            href={asset.content}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 break-all text-sm font-semibold leading-7 text-cyan-600 hover:text-cyan-700 hover:underline dark:text-cyan-400 dark:hover:text-cyan-300"
                                        >
                                            <ExternalLink size={16} className="shrink-0" />
                                            {asset.content}
                                        </a>
                                    ) : (
                                        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 dark:text-neutral-200">
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

                                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                                Uploaded Files
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-400 dark:text-neutral-500">

                                                {asset.files.length}{" "}

                                                {asset.files.length === 1
                                                    ? "file"
                                                    : "files"}{" "}

                                                attached to this asset.

                                            </p>

                                        </div>


                                        <div className="flex items-center gap-2">
                                            {asset.files.some((f) => Boolean(f.encrypted)) && (
                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                    <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                                                    <span className="hidden sm:inline">AES-256 Encrypted</span>
                                                    <span className="sm:hidden">Encrypted</span>
                                                </span>
                                            )}

                                            <div className="hidden h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-bold text-slate-500 sm:flex dark:bg-neutral-900 dark:text-neutral-400">

                                                {asset.files.length}

                                            </div>
                                        </div>

                                    </div>


                                    <div className="space-y-3">

                                        {asset.files.map(
                                            (file) => (

                                                <div
                                                    key={file.id}
                                                    className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700"
                                                >

                                                    <div className="flex min-w-0 items-center gap-4">

                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100 dark:bg-neutral-900 dark:text-cyan-400 dark:group-hover:bg-neutral-800">

                                                            {getFileIcon(
                                                                file
                                                            )}

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-bold text-slate-800 dark:text-neutral-200">
                                                                {file.originalFileName}
                                                            </p>


                                                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 dark:text-neutral-500">

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

                                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                                {Boolean(file.encrypted) && (
                                                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/80 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                                        <Lock size={10} className="text-emerald-600 dark:text-emerald-400" />
                                                                        AES-256-GCM
                                                                    </span>
                                                                )}

                                                                {file.fileHash && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleCopyHash(file.id, file.fileHash!)}
                                                                        title={`SHA-256: ${file.fileHash}\nClick to copy full checksum`}
                                                                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200/80 px-2 py-0.5 text-[11px] font-mono text-slate-600 transition border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                                                    >
                                                                        <Hash size={10} className="text-slate-400 dark:text-neutral-500" />
                                                                        <span>{file.fileHash.substring(0, 8)}...</span>
                                                                        {copiedHashId === file.id ? (
                                                                            <Check size={10} className="text-emerald-600 dark:text-emerald-400" />
                                                                        ) : (
                                                                            <Copy size={10} className="text-slate-400 dark:text-neutral-500" />
                                                                        )}
                                                                    </button>
                                                                )}
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
                                                            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:flex-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
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
                                                            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white transition hover:bg-violet-700 sm:flex-none dark:border dark:border-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
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

                        <section className="bg-slate-50/60 px-6 py-7 sm:px-9 lg:px-10 dark:bg-black/50">

                            <div className="mb-5">

                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Asset Information
                                </h2>

                                <p className="mt-1 text-sm text-slate-400 dark:text-neutral-500">
                                    Basic information about this asset.
                                </p>

                            </div>


                            <div className="grid gap-3 sm:grid-cols-3">

                                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#0c0c0e]">

                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-neutral-500">

                                        <FileText
                                            size={14}
                                        />

                                        Asset ID

                                    </div>


                                    <p className="mt-3 text-sm font-bold text-slate-800 dark:text-neutral-200">
                                        #{asset.id}
                                    </p>

                                </div>


                                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#0c0c0e]">

                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-neutral-500">

                                        <Clock3
                                            size={14}
                                        />

                                        Created

                                    </div>


                                    <p className="mt-3 break-words text-sm font-semibold text-slate-700 dark:text-neutral-300">

                                        {asset.createdAt
                                            ? new Date(
                                                asset.createdAt
                                            ).toLocaleString()
                                            : "No date"}

                                    </p>

                                </div>


                                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#0c0c0e]">

                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-neutral-500">

                                        <Clock3
                                            size={14}
                                        />

                                        Last Updated

                                    </div>


                                    <p className="mt-3 break-words text-sm font-semibold text-slate-700 dark:text-neutral-300">

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

                    <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400">

                        {message}

                    </div>

                )}

            </div>


            {/* =====================================
                SHARE MODAL
            ===================================== */}

            {showShareModal && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 dark:bg-black/80 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            closeShareModal();
                        }

                    }}
                >

                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] shadow-2xl">

                        <button
                            type="button"
                            onClick={
                                closeShareModal
                            }
                            disabled={sharing}
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 dark:text-neutral-400 transition hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-700 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close share dialog"
                        >

                            <X size={18} />

                        </button>


                        <div className="border-b border-slate-100 dark:border-neutral-800 bg-gradient-to-br from-violet-50/70 to-white dark:from-violet-950/20 dark:to-[#0c0c0e] px-6 py-6">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">

                                <Share2
                                    size={21}
                                />

                            </div>


                            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                                Share Asset
                            </h2>


                            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-neutral-400">

                                Give another Calvion user access to{" "}

                                <strong className="font-semibold text-slate-700 dark:text-neutral-200">
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

                                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300">
                                        User Email
                                    </label>


                                    <div className="relative">

                                        <UserRound
                                            size={17}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
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
                                            className="h-11 w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black pl-10 pr-4 text-sm text-slate-800 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-950/40 disabled:bg-slate-50 dark:disabled:bg-neutral-900"
                                        />

                                    </div>

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300">
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
                                        className="h-11 w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black px-3 text-sm font-medium text-slate-700 dark:text-neutral-200 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-950/40 disabled:bg-slate-50 dark:disabled:bg-neutral-900"
                                    >

                                        <option value="VIEW" className="dark:bg-neutral-900 dark:text-white">
                                            View only
                                        </option>

                                        <option value="EDIT" className="dark:bg-neutral-900 dark:text-white">
                                            Can edit
                                        </option>

                                    </select>


                                    <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-neutral-400">

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
                                                ? "border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                                                : "border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
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
                                    className="h-11 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 text-sm font-semibold text-slate-600 dark:text-neutral-300 transition hover:bg-slate-50 dark:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 dark:bg-black/80 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            closeAccessModal();
                        }

                    }}
                >

                    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] shadow-2xl">

                        {/* HEADER */}

                        <div className="border-b border-slate-100 dark:border-neutral-800 bg-gradient-to-br from-cyan-50/80 via-white to-blue-50/70 dark:from-cyan-950/20 dark:via-[#0c0c0e] dark:to-blue-950/20 px-6 py-6">

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
                                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 dark:text-neutral-400 transition hover:bg-white dark:hover:bg-neutral-800 hover:text-slate-700 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Close manage access dialog"
                            >

                                <X size={18} />

                            </button>


                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400">

                                <Users size={21} />

                            </div>


                            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                                Manage Access
                            </h2>


                            <p className="mt-1 max-w-lg text-sm leading-6 text-slate-500 dark:text-neutral-400">

                                Manage who can access{" "}

                                <strong className="font-semibold text-slate-700 dark:text-neutral-200">
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

                                    <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">
                                        Loading access information...
                                    </p>

                                </div>

                            ) : shares.length ===
                                0 ? (

                                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black/50 px-6 py-10 text-center">

                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 text-slate-400 dark:text-neutral-500 shadow-sm ring-1 ring-slate-200 dark:ring-neutral-800">

                                        <Users
                                            size={21}
                                        />

                                    </div>


                                    <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-neutral-200">
                                        No one has access
                                    </h3>


                                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400 dark:text-neutral-400">
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
                                                className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black p-4 transition hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-sm"
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

                                                            <p className="truncate text-sm font-bold text-slate-800 dark:text-neutral-100">
                                                                {share.name ||
                                                                    "Unknown user"}
                                                            </p>


                                                            <p className="truncate text-xs text-slate-400 dark:text-neutral-400">
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
                                                            className="h-9 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 text-xs font-semibold text-slate-700 dark:text-neutral-200 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 dark:focus:ring-cyan-950/40 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-neutral-900"
                                                        >

                                                            <option value="VIEW" className="dark:bg-neutral-900 dark:text-white">
                                                                View only
                                                            </option>

                                                            <option value="EDIT" className="dark:bg-neutral-900 dark:text-white">
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
                                                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-100 dark:border-red-900/50 bg-white dark:bg-red-950/20 px-3 text-xs font-bold text-red-600 dark:text-red-400 transition hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
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

                                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-neutral-400">

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

                                <div className="mt-4 rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">

                                    {accessMessage}

                                </div>

                            )}

                        </div>


                        {/* FOOTER */}

                        <div className="border-t border-slate-100 dark:border-neutral-800 bg-slate-50/60 dark:bg-black/60 px-6 py-4">

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <p className="text-xs text-slate-400 dark:text-neutral-400">

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
                                    className="h-10 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 text-sm font-semibold text-slate-600 dark:text-neutral-300 transition hover:bg-slate-50 dark:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 dark:bg-black/80 p-4 backdrop-blur-sm"
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

                    <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 shadow-2xl sm:p-7">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">

                            <Trash2
                                size={21}
                            />

                        </div>


                        <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                            Delete this asset?
                        </h2>


                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">

                            You are about to permanently delete{" "}

                            <strong className="font-semibold text-slate-700 dark:text-neutral-200">
                                {asset.title}
                            </strong>

                            . All uploaded files associated with it will also be removed.

                        </p>


                        <div className="mt-4 rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">

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
                                className="h-11 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 text-sm font-semibold text-slate-600 dark:text-neutral-300 transition hover:bg-slate-50 dark:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
