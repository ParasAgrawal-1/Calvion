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
                    files
                        .map(
                            (file) =>
                                file.name
                        )
                        .join(", ");
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
               CREATE FORMDATA
            ================================================= */

            const data =
                new FormData();


            data.append(
                "title",
                formData.title.trim()
            );


            data.append(
                "description",
                formData.description.trim()
            );


            data.append(
                "type",
                mapAssetType(
                    formData.type
                )
            );


            data.append(
                "content",
                assetContent
            );


            /* =================================================
               ADD FILES
            ================================================= */

            if (
                formData.contentMode ===
                "file"
            ) {

                files.forEach(
                    (file) => {

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

        <div className="min-h-screen bg-slate-50 text-slate-900">

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
                    className="group mb-7 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
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

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-blue-700">

                        <Database
                            size={13}
                        />

                        Personal Workspace

                    </div>


                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                        <div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Add New Asset
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                Store your important digital information securely in your workspace.
                            </p>

                        </div>


                        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-500 shadow-sm md:flex">

                            <ShieldCheck
                                size={16}
                                className="text-blue-600"
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
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
                >

                    {/* =================================================
                        FORM HEADER
                    ================================================= */}

                    <div className="border-b border-slate-100 bg-gradient-to-r from-white via-blue-50/20 to-cyan-50/30 px-5 py-5 sm:px-7">

                        <h2 className="text-base font-bold text-slate-900">
                            Asset Information
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
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
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700"
                            >

                                {message}

                            </div>

                        )}


                        {/* =================================================
                            TITLE + TYPE
                        ================================================= */}

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


                            {/* TITLE */}

                            <div>

                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-semibold text-slate-800"
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
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />


                                <p className="mt-1.5 text-xs text-slate-400">
                                    Give your asset a clear and recognizable name.
                                </p>

                            </div>


                            {/* TYPE */}

                            <div>

                                <label
                                    htmlFor="type"
                                    className="mb-2 block text-sm font-semibold text-slate-800"
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
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
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


                                <p className="mt-1.5 text-xs text-slate-400">
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
                                className="mb-2 block text-sm font-semibold text-slate-800"
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
                                className="min-h-[110px] w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                            />


                            <div className="mt-1.5 flex justify-end">

                                <span className="text-xs text-slate-400">
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

                                    <label className="mb-2 block text-sm font-semibold text-slate-800">
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
                                                    ? "border-blue-300 bg-blue-50 ring-4 ring-blue-50"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                        >

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                                        formData.contentMode ===
                                                        "text"
                                                            ? "bg-blue-100 text-blue-600"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}
                                                >

                                                    <FileText
                                                        size={18}
                                                    />

                                                </div>


                                                <div>

                                                    <p className="text-sm font-semibold text-slate-900">
                                                        Text Content
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-500">
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
                                                    ? "border-blue-300 bg-blue-50 ring-4 ring-blue-50"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                        >

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                                        formData.contentMode ===
                                                        "file"
                                                            ? "bg-blue-100 text-blue-600"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}
                                                >

                                                    <Upload
                                                        size={18}
                                                    />

                                                </div>


                                                <div>

                                                    <p className="text-sm font-semibold text-slate-900">
                                                        File Upload
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-500">
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
                                        className="mb-2 block text-sm font-semibold text-slate-800"
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
                                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    />


                                    <div className="mt-1.5 flex justify-end">

                                    <span className="text-xs text-slate-400">
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

                                        <label className="block text-sm font-semibold text-slate-800">
                                            Upload Files
                                        </label>


                                        {files.length > 0 && (

                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
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
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/40"
                                        } ${
                                            loading
                                                ? "cursor-not-allowed opacity-60"
                                                : ""
                                        }`}
                                    >

                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                                            <Upload
                                                size={26}
                                            />

                                        </div>


                                        <h3 className="mt-4 text-sm font-bold text-slate-900">
                                            Click to upload or drag and drop
                                        </h3>


                                        <p className="mt-1 text-xs text-slate-500">
                                            Multiple files are supported
                                        </p>


                                        <p className="mt-2 text-[11px] font-medium text-slate-400">
                                            PDF, DOC, DOCX, TXT, PNG, JPG and more
                                        </p>

                                    </div>


                                    {/* SELECTED FILES */}

                                    {files.length > 0 && (

                                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">

                                            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">

                                                <p className="text-xs font-bold text-slate-700">
                                                    Selected Files
                                                </p>

                                            </div>


                                            <div className="divide-y divide-slate-100">

                                                {files.map(
                                                    (
                                                        file,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                                                            className="flex items-center gap-3 px-4 py-3"
                                                        >

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                                                <FileText
                                                                    size={
                                                                        18
                                                                    }
                                                                />

                                                            </div>


                                                            <div className="min-w-0 flex-1">

                                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                                    {
                                                                        file.name
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 text-xs text-slate-400">

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
                                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                                    className="mb-2 block text-sm font-semibold text-slate-800"
                                >
                                    URL
                                </label>


                                <div className="relative">

                                    <LinkIcon
                                        size={17}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    />

                                </div>


                                <p className="mt-1.5 text-xs text-slate-400">
                                    Paste the website or resource address.
                                </p>

                            </div>
                        )}


                        {/* =================================================
                            CREDENTIAL
                        ================================================= */}

                        {formData.type === "Credential" && (

                            <div className="space-y-5 rounded-2xl border border-violet-100 bg-violet-50/30 p-5">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">

                                        <KeyRound
                                            size={18}
                                        />

                                    </div>


                                    <div>

                                        <h3 className="text-sm font-bold text-slate-900">
                                            Credential Details
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Store the account information associated with this service.
                                        </p>

                                    </div>

                                </div>


                                {/* URL */}

                                <div>

                                    <label
                                        htmlFor="credential-url"
                                        className="mb-2 block text-sm font-semibold text-slate-800"
                                    >
                                        Website / URL
                                    </label>


                                    <div className="relative">

                                        <LinkIcon
                                            size={17}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        />

                                    </div>

                                </div>


                                {/* USERNAME */}

                                <div>

                                    <label
                                        htmlFor="username"
                                        className="mb-2 block text-sm font-semibold text-slate-800"
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
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    />

                                </div>


                                {/* PASSWORD */}

                                <div>

                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold text-slate-800"
                                    >
                                        Password
                                    </label>


                                    <div className="relative">

                                        <KeyRound
                                            size={17}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        />

                                    </div>


                                    <p className="mt-1.5 text-xs text-slate-400">
                                        Credentials are currently stored as part of the asset content.
                                    </p>

                                </div>

                            </div>
                        )}

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                            disabled={
                                loading
                            }
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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