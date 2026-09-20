import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Upload,
    FileText,
    X,
    Plus,
    Link as LinkIcon,
    KeyRound,
    Database,
    ShieldCheck,
} from "lucide-react";

import api from "../services/api";
import { encryptText, encryptFile } from "../utils/crypto";


/* =========================================================
   TYPES
========================================================= */

type AssetType =
    | "Document"
    | "Certificate"
    | "Note"
    | "Link"
    | "Credential";

type ContentMode =
    | "text"
    | "file";

interface FormDataState {
    title: string;
    type: AssetType;
    description: string;

    contentMode: ContentMode;
    content: string;

    url: string;
    username: string;
    password: string;
}


/* =========================================================
   COMPONENT
========================================================= */

const AddAsset = () => {

    const navigate = useNavigate();

    const fileInputRef =
        useRef<HTMLInputElement>(null);


    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] =
        useState<FormDataState>({
            title: "",
            type: "Document",
            description: "",

            contentMode: "file",
            content: "",

            url: "",
            username: "",
            password: "",
        });


    /* =====================================================
       FILE STATE
    ===================================================== */

    const [files, setFiles] =
        useState<File[]>([]);

    const [dragActive, setDragActive] =
        useState(false);


    /* =====================================================
       UI STATE
    ===================================================== */

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");


    /* =====================================================
       TYPE MAPPING
    ===================================================== */

    const mapAssetType = (
        type: AssetType
    ): string => {

        switch (type) {

            case "Document":
                return "DOCUMENT";

            case "Certificate":
                return "CERTIFICATE";

            case "Note":
                return "NOTE";

            case "Link":
                return "LINK";

            case "Credential":
                return "CREDENTIAL";

            default:
                return "OTHER";
        }
    };


    /* =====================================================
       HANDLE FORM CHANGE
    ===================================================== */

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        const {
            name,
            value,
        } = e.target;


        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );


        setMessage("");
    };


    /* =====================================================
       ADD FILES
    ===================================================== */

    const addFiles = (
        selectedFiles: FileList | File[]
    ) => {

        const newFiles =
            Array.from(selectedFiles);


        if (newFiles.length === 0) {
            return;
        }


        setFiles(
            (previousFiles) => {

                const combinedFiles = [
                    ...previousFiles,
                    ...newFiles,
                ];


                const uniqueFiles =
                    combinedFiles.filter(
                        (
                            file,
                            index,
                            array
                        ) =>
                            index ===
                            array.findIndex(
                                (item) =>
                                    item.name ===
                                    file.name &&
                                    item.size ===
                                    file.size &&
                                    item.lastModified ===
                                    file.lastModified
                            )
                    );


                return uniqueFiles;
            }
        );


        setMessage("");
    };


    /* =====================================================
       FILE INPUT CHANGE
    ===================================================== */

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (e.target.files) {

            addFiles(
                e.target.files
            );
        }


        e.target.value = "";
    };


    /* =====================================================
       DRAG OVER
    ===================================================== */

    const handleDragOver = (
        e: React.DragEvent<HTMLDivElement>
    ) => {

        e.preventDefault();
        e.stopPropagation();

        setDragActive(true);
    };


    /* =====================================================
       DRAG LEAVE
    ===================================================== */

    const handleDragLeave = (
        e: React.DragEvent<HTMLDivElement>
    ) => {

        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);
    };


    /* =====================================================
       DROP
    ===================================================== */

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>
    ) => {

        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);


        if (
            e.dataTransfer.files &&
            e.dataTransfer.files.length > 0
        ) {

            addFiles(
                e.dataTransfer.files
            );
        }
    };


    /* =====================================================
       REMOVE FILE
    ===================================================== */

    const removeFile = (
        indexToRemove: number
    ) => {

        setFiles(
            (previousFiles) =>
                previousFiles.filter(
                    (_, index) =>
                        index !==
                        indexToRemove
                )
        );

        setMessage("");
    };


    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = (): string | null => {

        const title =
            formData.title.trim();


        if (!title) {

            return "Please enter an asset title.";
        }


        /* -----------------------------------------------
           LINK
        ----------------------------------------------- */

        if (
            formData.type === "Link"
        ) {

            if (
                !formData.url.trim()
            ) {

                return "Please enter a URL.";
            }
        }


        /* -----------------------------------------------
           CREDENTIAL
        ----------------------------------------------- */

        if (
            formData.type === "Credential"
        ) {

            if (
                !formData.url.trim()
            ) {

                return "Please enter the website or URL.";
            }


            if (
                !formData.username.trim()
            ) {

                return "Please enter the username or email.";
            }


            if (
                !formData.password
            ) {

                return "Please enter the password.";
            }
        }


        /* -----------------------------------------------
           FILE MODE
        ----------------------------------------------- */

        if (
            formData.contentMode === "file" &&
            formData.type !== "Link" &&
            formData.type !== "Credential" &&
            files.length === 0
        ) {

            return "Please select at least one file.";
        }


        /* -----------------------------------------------
           TEXT MODE
        ----------------------------------------------- */

        if (
            formData.contentMode === "text" &&
            formData.type !== "Link" &&
            formData.type !== "Credential" &&
            !formData.content.trim()
        ) {

            return "Please enter some content.";
        }


        return null;
    };


    /* =====================================================
       CREATE ASSET
    ===================================================== */

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setMessage("");


        /* =================================================
           VALIDATE
        ================================================= */

        const validationError =
            validateForm();


        if (validationError) {

            setMessage(
                validationError
            );

            return;
        }


        try {

            setLoading(true);


            /* =================================================
               PREPARE CONTENT
            ================================================= */

            let assetContent = "";


            /* -----------------------------------------------
               TEXT CONTENT
            ----------------------------------------------- */

            if (
                formData.contentMode ===
                "text"
            ) {

                assetContent =
                    formData.content.trim();
            }


            /* -----------------------------------------------
               FILE CONTENT
            ----------------------------------------------- */

            if (
                formData.contentMode ===
                "file"
            ) {

                assetContent =
                    JSON.stringify(
                        files.map((file) => ({
                            name: file.name,
                            size: file.size,
                            type: file.type || "application/octet-stream",
                        }))
                    );
            }


            /* -----------------------------------------------
               LINK
            ----------------------------------------------- */

            if (
                formData.type === "Link"
            ) {

                assetContent =
                    formData.url.trim();
            }


            /* -----------------------------------------------
               CREDENTIAL
            ----------------------------------------------- */

            if (
                formData.type ===
                "Credential"
            ) {

                assetContent =
                    JSON.stringify({
                        website:
                            formData.url.trim(),

                        username:
                            formData.username.trim(),

                        password:
                        formData.password,
                    });
            }


            /* =================================================
               CLIENT-SIDE ZERO-KNOWLEDGE ENCRYPTION (E2EE)
            ================================================= */
            const [encryptedTitle, encryptedDescription, encryptedContent] =
                await Promise.all([
                    encryptText(formData.title.trim()),
                    formData.description.trim()
                        ? encryptText(formData.description.trim())
                        : Promise.resolve(""),
                    assetContent
                        ? encryptText(assetContent)
                        : Promise.resolve(""),
                ]);

            /* =================================================
               CREATE FORMDATA
            ================================================= */

            const data =
                new FormData();


            data.append(
                "title",
                encryptedTitle
            );


            data.append(
                "description",
                encryptedDescription
            );


            data.append(
                "type",
                mapAssetType(
                    formData.type
                )
            );


            data.append(
                "content",
                encryptedContent
            );


            /* =================================================
               ADD ENCRYPTED FILES
            ================================================= */

            if (
                formData.contentMode ===
                "file" &&
                files.length > 0
            ) {

                const encryptedFileResults =
                    await Promise.all(
                        files.map((file) => encryptFile(file))
                    );

                encryptedFileResults.forEach(
                    ({ file }) => {

                        data.append(
                            "files",
                            file
                        );
                    }
                );
            }


            /* =================================================
               CREATE ASSET API

               IMPORTANT:

               api.ts currently contains:

               Content-Type: application/json

               We override that ONLY for this request.
            ================================================= */

            const response =
                await api.post(
                    "/assets",
                    data,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );


            console.log(
                "Asset created successfully:",
                response.data
            );


            /* =================================================
               SUCCESS
            ================================================= */

            navigate(
                "/assets"
            );

        } catch (error: any) {

            console.error(
                "========== CREATE ASSET ERROR =========="
            );

            console.error(
                "Error:",
                error
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "URL:",
                error.config?.url
            );

            console.error(
                "Response:",
                error.response?.data
            );

            console.error(
                "========================================"
            );


            /* =================================================
               UNAUTHORIZED
            ================================================= */

            if (
                error.response?.status ===
                401
            ) {

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


            /* =================================================
               FORBIDDEN
            ================================================= */

            if (
                error.response?.status ===
                403
            ) {

                setMessage(
                    "You do not have permission to create an asset."
                );

                return;
            }


            /* =================================================
               BACKEND RESPONSE
            ================================================= */

            const errorData =
                error.response?.data;


            if (
                typeof errorData ===
                "string" &&
                errorData.trim()
            ) {

                setMessage(
                    errorData
                );

            } else if (
                errorData?.message
            ) {

                setMessage(
                    errorData.message
                );

            } else if (
                error.message
            ) {

                setMessage(
                    error.message
                );

            } else {

                setMessage(
                    "Failed to create asset."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {

        if (loading) {
            return;
        }


        navigate(
            "/assets"
        );
    };


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-neutral-100">

            <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/assets"
                        )
                    }
                    disabled={loading}
                    className="group mb-7 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:text-cyan-400"
                >

                    <ArrowLeft
                        size={17}
                        className="transition-transform duration-200 group-hover:-translate-x-0.5"
                    />

                    Back to My Assets

                </button>


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <section className="mb-8">

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-blue-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400">

                        <Database
                            size={13}
                        />

                        Personal Workspace

                    </div>


                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                        <div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                                Add New Asset
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-neutral-400">
                                Store your important digital information securely in your workspace.
                            </p>

                        </div>


                        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-500 shadow-sm md:flex dark:border-neutral-800 dark:bg-[#0c0c0e] dark:text-neutral-400">

                            <ShieldCheck
                                size={16}
                                className="text-blue-600 dark:text-cyan-400"
                            />

                            Secure workspace

                        </div>

                    </div>

                </section>


                {/* =================================================
                    FORM CARD
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-neutral-800 dark:bg-[#0c0c0e] dark:shadow-none"
                >

                    {/* =================================================
                        FORM HEADER
                    ================================================= */}

                    <div className="border-b border-slate-100 bg-gradient-to-r from-white via-blue-50/20 to-cyan-50/30 px-5 py-5 sm:px-7 dark:border-neutral-800 dark:bg-gradient-to-r dark:from-[#0c0c0e] dark:via-neutral-900/40 dark:to-neutral-900/60">

                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Asset Information
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                            Add the details of the information you want to keep in your workspace.
                        </p>

                    </div>


                    {/* =================================================
                        FORM BODY
                    ================================================= */}

                    <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-8">


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {message && (

                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-400"
                            >

                                {message}

                            </div>

                        )}


                        {/* =================================================
                            ZERO-KNOWLEDGE PRIVACY GUARANTEE BANNER
                        ================================================= */}
                        <div className="flex items-start gap-3.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-emerald-900 shadow-sm sm:items-center dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm dark:bg-emerald-600/80">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="flex-1 text-xs sm:text-sm">
                                <div className="flex flex-wrap items-center gap-2 font-bold text-emerald-950 dark:text-emerald-200">
                                    <span>Zero-Knowledge Client-Side Encryption Active</span>
                                    <span className="inline-flex items-center rounded-md bg-emerald-200/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                                        AES-256-GCM + SHA-256
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-emerald-800/90 leading-relaxed dark:text-emerald-400/90">
                                    Your title, content, uploaded files, and original filenames are encrypted directly in your browser before transmission. Backend developers, server admins, and the database only ever receive ciphertext and cryptographic hashes.
                                </p>
                            </div>
                        </div>


                        {/* =================================================
                            TITLE + TYPE
                        ================================================= */}

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


                            {/* TITLE */}

                            <div>

                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-semibold text-slate-800 dark:text-neutral-200"
                                >
                                    Asset Title
                                </label>


                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Resume, Degree Certificate"
                                    maxLength={150}
                                    required
                                    disabled={loading}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-600 dark:hover:border-neutral-700 dark:focus:border-cyan-500/50 dark:focus:ring-cyan-500/10 dark:disabled:bg-neutral-900"
                                />


                                <p className="mt-1.5 text-xs text-slate-400 dark:text-neutral-500">
                                    Give your asset a clear and recognizable name.
                                </p>

                            </div>


                            {/* TYPE */}

                            <div>

                                <label
                                    htmlFor="type"
                                    className="mb-2 block text-sm font-semibold text-slate-800 dark:text-neutral-200"
                                >
                                    Asset Type
                                </label>


                                <select
                                    id="type"
                                    name="type"
                                    value={
                                        formData.type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:hover:border-neutral-700 dark:focus:border-cyan-500/50 dark:focus:ring-cyan-500/10 dark:disabled:bg-neutral-900"
                                >

                                    <option value="Document">
                                        Document
                                    </option>

                                    <option value="Certificate">
                                        Certificate
                                    </option>

                                    <option value="Note">
                                        Note
                                    </option>

                                    <option value="Link">
                                        Link
                                    </option>

                                    <option value="Credential">
                                        Credential
                                    </option>

                                </select>


                                <p className="mt-1.5 text-xs text-slate-400 dark:text-neutral-500">
                                    Choose the category that best describes this asset.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-semibold text-slate-800 dark:text-neutral-200"
                            >
                                Description
                            </label>


                            <textarea
                                id="description"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Briefly describe this asset..."
                                maxLength={500}
                                rows={4}
                                disabled={loading}
                                className="min-h-[110px] w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-600 dark:hover:border-neutral-700 dark:focus:border-cyan-500/50 dark:focus:ring-cyan-500/10 dark:disabled:bg-neutral-900"
                            />


                            <div className="mt-1.5 flex justify-end">

                                <span className="text-xs text-slate-400 dark:text-neutral-500">
                                    {
                                        formData
                                            .description
                                            .length
                                    }
                                    /500
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            CONTENT MODE
                        ================================================= */}

                        {formData.type !== "Link" &&
                            formData.type !== "Credential" && (

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-neutral-200">
                                        Content Mode
                                    </label>


                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">


                                        {/* TEXT */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData(
                                                    (
                                                        previous
                                                    ) => ({
                                                        ...previous,
                                                        contentMode:
                                                            "text",
                                                    })
                                                )
                                            }
                                            disabled={
                                                loading
                                            }
                                            className={`rounded-xl border px-4 py-3 text-left transition ${
                                                formData.contentMode ===
                                                "text"
                                                    ? "border-blue-300 bg-blue-50 ring-4 ring-blue-50 dark:border-cyan-500/50 dark:bg-cyan-950/30 dark:ring-cyan-500/20"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
                                            }`}
                                        >

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                                        formData.contentMode ===
                                                        "text"
                                                            ? "bg-blue-100 text-blue-600 dark:bg-cyan-900/40 dark:text-cyan-400"
                                                            : "bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400"
                                                    }`}
                                                >

                                                    <FileText
                                                        size={18}
                                                    />

                                                </div>


                                                <div>

                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        Text Content
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                                                        Store text directly
                                                    </p>

                                                </div>

                                            </div>

                                        </button>


                                        {/* FILE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData(
                                                    (
                                                        previous
                                                    ) => ({
                                                        ...previous,
                                                        contentMode:
                                                            "file",
                                                    })
                                                )
                                            }
                                            disabled={
                                                loading
                                            }
                                            className={`rounded-xl border px-4 py-3 text-left transition ${
                                                formData.contentMode ===
                                                "file"
                                                    ? "border-blue-300 bg-blue-50 ring-4 ring-blue-50 dark:border-cyan-500/50 dark:bg-cyan-950/30 dark:ring-cyan-500/20"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
                                            }`}
                                        >

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                                        formData.contentMode ===
                                                        "file"
                                                            ? "bg-blue-100 text-blue-600 dark:bg-cyan-900/40 dark:text-cyan-400"
                                                            : "bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400"
                                                    }`}
                                                >

                                                    <Upload
                                                        size={18}
                                                    />

                                                </div>


                                                <div>

                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        File Upload
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                                                        Upload one or more files
                                                    </p>

                                                </div>

                                            </div>

                                        </button>

                                    </div>

                                </div>
                            )}


                        {/* =================================================
                            TEXT CONTENT
                        ================================================= */}

                        {formData.contentMode === "text" &&
                            formData.type !== "Link" &&
                            formData.type !== "Credential" && (

                                <div>

                                    <label
                                        htmlFor="content"
                                        className="mb-2 block text-sm font-semibold text-slate-800 dark:text-neutral-200"
                                    >
                                        Content
                                    </label>


                                    <textarea
                                        id="content"
                                        name="content"
                                        value={
                                            formData.content
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter the content you want to store..."
                                        maxLength={5000}
                                        rows={9}
                                        disabled={loading}
                                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-600 dark:hover:border-neutral-700 dark:focus:border-cyan-500/50 dark:focus:ring-cyan-500/10 dark:disabled:bg-neutral-900"
                                    />


                                    <div className="mt-1.5 flex justify-end">

                                    <span className="text-xs text-slate-400 dark:text-neutral-500">
                                        {
                                            formData
                                                .content
                                                .length
                                        }
                                        /5000
                                    </span>

                                    </div>

                                </div>
                            )}


                        {/* =================================================
                            FILE UPLOAD
                        ================================================= */}

                        {formData.contentMode === "file" &&
                            formData.type !== "Link" &&
                            formData.type !== "Credential" && (

                                <div>

                                    <div className="mb-2 flex items-center justify-between">

                                        <label className="block text-sm font-semibold text-slate-800 dark:text-neutral-200">
                                            Upload Files
                                        </label>


                                        {files.length > 0 && (

                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:bg-cyan-950/40 dark:text-cyan-400">
                                            {
                                                files.length
                                            }{" "}
                                                selected
                                        </span>

                                        )}

                                    </div>


                                    <input
                                        ref={
                                            fileInputRef
                                        }
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={
                                            handleFileChange
                                        }
                                        disabled={
                                            loading
                                        }
                                    />


                                    <div
                                        onDragOver={
                                            handleDragOver
                                        }
                                        onDragLeave={
                                            handleDragLeave
                                        }
                                        onDrop={
                                            handleDrop
                                        }
                                        onClick={() => {

                                            if (
                                                !loading
                                            ) {

                                                fileInputRef
                                                    .current
                                                    ?.click();
                                            }

                                        }}
                                        role="button"
                                        tabIndex={
                                            loading
                                                ? -1
                                                : 0
                                        }
                                        onKeyDown={(
                                            event
                                        ) => {

                                            if (
                                                loading
                                            ) {
                                                return;
                                            }


                                            if (
                                                event.key ===
                                                "Enter" ||
                                                event.key ===
                                                " "
                                            ) {

                                                event.preventDefault();

                                                fileInputRef
                                                    .current
                                                    ?.click();
                                            }

                                        }}
                                        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                                            dragActive
                                                ? "border-blue-500 bg-blue-50 dark:border-cyan-500 dark:bg-cyan-950/30"
                                                : "border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/40 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700 dark:hover:bg-neutral-900/50"
                                        } ${
                                            loading
                                                ? "cursor-not-allowed opacity-60"
                                                : ""
                                        }`}
                                    >

                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-neutral-900 dark:text-cyan-400">

                                            <Upload
                                                size={26}
                                            />

                                        </div>


                                        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                                            Click to upload or drag and drop
                                        </h3>


                                        <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                                            Multiple files are supported
                                        </p>


                                        <p className="mt-2 text-[11px] font-medium text-slate-400 dark:text-neutral-500">
                                            Supports any file type (PDF, Images, Videos, Audio, ZIP, Code, Binaries, etc. up to 500MB)
                                        </p>

                                    </div>


                                    {/* SELECTED FILES */}

                                    {files.length > 0 && (

                                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-neutral-800 dark:bg-black">

                                            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">

                                                <p className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                                    Selected Files
                                                </p>

                                            </div>


                                            <div className="divide-y divide-slate-100 dark:divide-neutral-800">

                                                {files.map(
                                                    (
                                                        file,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                                                            className="flex items-center gap-3 px-4 py-3"
                                                        >

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-neutral-900 dark:text-cyan-400">

                                                                <FileText
                                                                    size={
                                                                        18
                                                                    }
                                                                />

                                                            </div>


                                                            <div className="min-w-0 flex-1">

                                                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-neutral-200">
                                                                    {
                                                                        file.name
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 text-xs text-slate-400 dark:text-neutral-500">

                                                                    {(
                                                                        file.size /
                                                                        1024
                                                                    ).toFixed(
                                                                        1
                                                                    )}
                                                                    {" "}
                                                                    KB

                                                                </p>

                                                            </div>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeFile(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                                title={`Remove ${file.name}`}
                                                            >

                                                                <X
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                            </button>

                                                        </div>
                                                    )
                                                )}

                                            </div>

                                        </div>
                                    )}

                                </div>
                            )}


                        {/* =================================================
                            LINK
                        ================================================= */}

                        {formData.type === "Link" && (

                            <div>

                                <label
                                    htmlFor="url"
                                    className="mb-2 block text-sm font-semibold text-slate-800 dark:text-neutral-200"
                                >
                                    URL
                                </label>


                                <div className="relative">

                                    <LinkIcon
                                        size={17}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                    />


                                    <input
                                        id="url"
                                        type="url"
                                        name="url"
                                        value={
                                            formData.url
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://example.com"
                                        required
                                        disabled={
                                            loading
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-600 dark:hover:border-neutral-700 dark:focus:border-cyan-500/50 dark:focus:ring-cyan-500/10 dark:disabled:bg-neutral-900"
                                    />

                                </div>


                                <p className="mt-1.5 text-xs text-slate-400 dark:text-neutral-500">
                                    Paste the website or resource address.
                                </p>

                            </div>
                        )}


                        {/* =================================================
                            CREDENTIAL
                        ================================================= */}

                        {formData.type === "Credential" && (

                            <div className="space-y-5 rounded-2xl border border-violet-100 bg-violet-50/30 p-5 dark:border-neutral-800 dark:bg-neutral-950">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">

                                        <KeyRound
                                            size={18}
                                        />

                                    </div>


                                    <div>

                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Credential Details
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                                            Store the account information associated with this service.
                                        </p>

                                    </div>

                                </div>


                                {/* URL */}

                                <div>

                                    <label
                                        htmlFor="credential-url"
                                        className="mb-2 block text-sm font-semibold text-slate-800 dark:text-neutral-200"
                                    >
                                        Website / URL
                                    </label>


                                    <div className="relative">

                                        <LinkIcon
                                            size={17}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                        />

                                        <input
                                            id="credential-url"
                                            type="url"
                                            name="url"
                                            value={
                                                formData.url
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="https://example.com"
                                            required
                                            disabled={
                                                loading
                                            }
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-600 dark:hover:border-neutral-700 dark:focus:border-violet-400 dark:disabled:bg-neutral-900"
                                        />

                                    </div>

                                </div>


                                {/* USERNAME */}

                                <div>

                                    <label
                                        htmlFor="username"
                                        className="mb-2 block text-sm font-semibold text-slate-800 dark:text-neutral-200"
                                    >
                                        Username / Email
                                    </label>


                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        value={
                                            formData.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. user@example.com"
                                        required
                                        disabled={
                                            loading
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-600 dark:hover:border-neutral-700 dark:focus:border-violet-400 dark:disabled:bg-neutral-900"
                                    />

                                </div>


                                {/* PASSWORD */}

                                <div>

                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold text-slate-800 dark:text-neutral-200"
                                    >
                                        Password
                                    </label>


                                    <div className="relative">

                                        <KeyRound
                                            size={17}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                                        />


                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter password"
                                            required
                                            disabled={
                                                loading
                                            }
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-600 dark:hover:border-neutral-700 dark:focus:border-violet-400 dark:disabled:bg-neutral-900"
                                        />

                                    </div>


                                    <p className="mt-1.5 text-xs text-slate-400 dark:text-neutral-500">
                                        Credentials are currently stored as part of the asset content.
                                    </p>

                                </div>

                            </div>
                        )}

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 dark:border-neutral-800 dark:bg-black/50">

                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                            disabled={
                                loading
                            }
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                        >

                            <Plus
                                size={18}
                            />

                            {loading
                                ? "Creating..."
                                : "Create Asset"}

                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
};


export default AddAsset;