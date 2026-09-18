import { useState, useEffect, useMemo, useCallback } from "react";
import {
    FileText,
    Download,
    Trash2,
    ShieldCheck,
    Search,
    RefreshCw,
    Folder,
    CheckCircle2,
    Loader2
} from "lucide-react";
import api from "../../../services/api";

interface UploadedFileItem {
    id: number;
    originalFileName: string;
    fileType: string;
    fileSize: number;
    encrypted?: boolean;
    assetId: number;
    assetTitle: string;
    assetType: string;
    createdAt?: string;
}

interface AssetWithFiles {
    id: number;
    title: string;
    type: string;
    files?: {
        id: number;
        originalFileName: string;
        fileType: string;
        fileSize: number;
        encrypted?: boolean;
    }[];
}

const TOTAL_QUOTA_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB Free Tier

function formatBytes(bytes: number, decimals = 1) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function StorageSection() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assets, setAssets] = useState<AssetWithFiles[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("ALL");
    const [cacheCleared, setCacheCleared] = useState(false);
    const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);

    const loadStorageData = useCallback(async () => {
        try {
            const res = await api.get<AssetWithFiles[]>("/assets");
            setAssets(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load storage data", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadStorageData();
    }, [loadStorageData]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadStorageData();
    };

    // Flatten all files across all assets
    const allFiles: UploadedFileItem[] = useMemo(() => {
        const files: UploadedFileItem[] = [];
        assets.forEach((asset) => {
            if (Array.isArray(asset.files)) {
                asset.files.forEach((f) => {
                    files.push({
                        id: f.id,
                        originalFileName: f.originalFileName,
                        fileType: f.fileType,
                        fileSize: f.fileSize || 0,
                        encrypted: f.encrypted ?? true,
                        assetId: asset.id,
                        assetTitle: asset.title,
                        assetType: asset.type,
                    });
                });
            }
        });
        return files;
    }, [assets]);

    // Compute metrics
    const totalStorageUsed = useMemo(() => {
        return allFiles.reduce((acc, f) => acc + (f.fileSize || 0), 0);
    }, [allFiles]);

    const percentageUsed = Math.min(
        100,
        Math.max(0.2, (totalStorageUsed / TOTAL_QUOTA_BYTES) * 100)
    );

    // Categories breakdown
    const categoryStats = useMemo(() => {
        const categories = ["CREDENTIALS", "FINANCIAL", "LEGAL", "PERSONAL", "DOCUMENTS", "NOTES"];
        return categories.map((cat) => {
            const catAssets = assets.filter((a) => (a.type || "").toUpperCase() === cat);
            const catFiles = allFiles.filter((f) => (f.assetType || "").toUpperCase() === cat);
            const catSize = catFiles.reduce((acc, f) => acc + (f.fileSize || 0), 0);
            return {
                name: cat,
                assetCount: catAssets.length,
                fileCount: catFiles.length,
                sizeBytes: catSize,
                formattedSize: formatBytes(catSize),
            };
        });
    }, [assets, allFiles]);

    // Filtered files list
    const filteredFiles = useMemo(() => {
        return allFiles.filter((f) => {
            const matchesQuery =
                f.originalFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.assetTitle.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                filterCategory === "ALL" || (f.assetType || "").toUpperCase() === filterCategory;
            return matchesQuery && matchesCategory;
        });
    }, [allFiles, searchQuery, filterCategory]);

    // Clear local cache
    const handleClearCache = () => {
        // Clear non-essential vault storage keys
        const keysToRemove = [
            "datalife_cached_decrypted",
            "datalife_file_preview_cache",
            "datalife_temp_vault_keys",
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        setCacheCleared(true);
        setTimeout(() => setCacheCleared(false), 3000);
    };

    // Export storage usage report
    const handleExportStorageReport = () => {
        const report = {
            generatedAt: new Date().toISOString(),
            quotaTotal: TOTAL_QUOTA_BYTES,
            storageUsedBytes: totalStorageUsed,
            storageUsedFormatted: formatBytes(totalStorageUsed),
            totalAssets: assets.length,
            totalFiles: allFiles.length,
            categories: categoryStats,
            files: allFiles.map((f) => ({
                id: f.id,
                fileName: f.originalFileName,
                sizeBytes: f.fileSize,
                type: f.fileType,
                asset: f.assetTitle,
                category: f.assetType,
            })),
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `calvion_storage_audit_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Download file
    const handleDownloadFile = async (file: UploadedFileItem) => {
        setDownloadingFileId(file.id);
        try {
            const res = await api.get(`/assets/${file.assetId}/files/${file.id}/view`, {
                responseType: "blob",
            });
            const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute("download", file.originalFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("File download failed", err);
            alert("Unable to download file. Please check permissions or try again.");
        } finally {
            setDownloadingFileId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data & Storage</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Monitor vault storage consumption, audit encrypted attachments, and manage local storage cache.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                        Sync
                    </button>
                    <button
                        type="button"
                        onClick={handleExportStorageReport}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Storage Report
                    </button>
                </div>
            </div>

            {/* Storage Meter Card */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Zero-Knowledge Vault Storage
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {formatBytes(totalStorageUsed)}
                            </h3>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                of {formatBytes(TOTAL_QUOTA_BYTES, 0)} free tier
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Files</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{allFiles.length}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                        <div className="text-right">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Vault Assets</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{assets.length}</p>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                            style={{ width: `${percentageUsed}%` }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        <span>{percentageUsed.toFixed(2)}% used</span>
                        <span>{formatBytes(TOTAL_QUOTA_BYTES - totalStorageUsed)} available</span>
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Storage by Category</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribution of encrypted payloads and attachments across vault types.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {categoryStats.map((cat) => (
                        <div
                            key={cat.name}
                            onClick={() => setFilterCategory(filterCategory === cat.name ? "ALL" : cat.name)}
                            className={`cursor-pointer rounded-xl border p-3 transition ${
                                filterCategory === cat.name
                                    ? "border-blue-500 bg-blue-50/50 shadow-xs dark:border-blue-500 dark:bg-blue-950/30"
                                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                            }`}
                        >
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                {cat.name}
                            </span>
                            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                {cat.formattedSize}
                            </p>
                            <p className="text-[10px] text-slate-400">
                                {cat.assetCount} items · {cat.fileCount} files
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Uploaded Files Table Explorer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Uploaded File Vault Explorer</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                All AES-256 encrypted documents, photos, and file attachments stored across your assets.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-44 rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pr-3 pl-8 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                            />
                        </div>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <option value="ALL">All Categories</option>
                            <option value="CREDENTIALS">Credentials</option>
                            <option value="FINANCIAL">Financial</option>
                            <option value="LEGAL">Legal</option>
                            <option value="PERSONAL">Personal</option>
                            <option value="DOCUMENTS">Documents</option>
                            <option value="NOTES">Notes</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex h-36 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                        No files match your search or filter.
                    </div>
                ) : (
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                <tr>
                                    <th className="pb-3 font-semibold">File Name</th>
                                    <th className="pb-3 font-semibold">Attached Asset</th>
                                    <th className="pb-3 font-semibold">Size</th>
                                    <th className="pb-3 font-semibold">Format</th>
                                    <th className="pb-3 font-semibold">Encryption</th>
                                    <th className="pb-3 text-right font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredFiles.map((file) => (
                                    <tr key={`${file.assetId}-${file.id}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="py-3 font-medium text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                                                <span className="truncate max-w-xs">{file.originalFileName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-slate-600 dark:text-slate-300">
                                            <span className="truncate max-w-[150px] inline-block">{file.assetTitle}</span>
                                        </td>
                                        <td className="py-3 text-slate-500 dark:text-slate-400">
                                            {formatBytes(file.fileSize)}
                                        </td>
                                        <td className="py-3 text-slate-500 dark:text-slate-400">
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                {file.fileType || "blob"}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                <ShieldCheck className="h-3 w-3" />
                                                AES-256
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <button
                                                type="button"
                                                disabled={downloadingFileId === file.id}
                                                onClick={() => handleDownloadFile(file)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                            >
                                                {downloadingFileId === file.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                                                ) : (
                                                    <Download className="h-3 w-3" />
                                                )}
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Storage Actions Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Local Vault Cache & Storage Maintenance</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Purging client cache removes temporary decrypted buffers from browser storage without deleting files from your vault.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={handleClearCache}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        Clear Decrypted File Cache
                    </button>
                    {cacheCleared && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Browser cache cleared successfully!
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
