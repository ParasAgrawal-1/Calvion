import { useState, useEffect, useCallback } from "react";
import {
    Users,
    Share2,
    Shield,
    Plus,
    Trash2,
    RefreshCw,
    ExternalLink,
    AlertCircle,
    UserCheck,
    ArrowUpRight,
    ArrowDownLeft,
    Sliders,
    Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

interface UserAsset {
    id: number;
    title: string;
    type: string;
    description?: string;
    owner: boolean;
}

interface OutgoingShare {
    shareId: number;
    assetId: number;
    assetTitle: string;
    assetType: string;
    sharedWithEmail: string;
    sharedWithName: string;
    permission: "VIEW" | "EDIT";
    sharedAt: string;
}

interface IncomingShare {
    id: number;
    title: string;
    type: string;
    description?: string;
    ownerEmail: string;
    ownerName: string;
    permission: "VIEW" | "EDIT";
    sharedAt: string;
}

interface SharingPolicies {
    defaultPermission: "VIEW" | "EDIT";
    allowFileDownload: boolean;
    requirePassphrase: boolean;
    autoExpireDays: number;
}

export default function SharingSection() {
    const navigate = useNavigate();

    // Data states
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assets, setAssets] = useState<UserAsset[]>([]);
    const [outgoingShares, setOutgoingShares] = useState<OutgoingShare[]>([]);
    const [incomingShares, setIncomingShares] = useState<IncomingShare[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Share Modal state
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState<number | "">("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [sharePermission, setSharePermission] = useState<"VIEW" | "EDIT">("VIEW");
    const [shareSubmitting, setShareSubmitting] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSuccess, setModalSuccess] = useState<string | null>(null);

    // Revoking/Updating share state
    const [actionShareId, setActionShareId] = useState<number | null>(null);

    // Sharing Policies
    const [policies, setPolicies] = useState<SharingPolicies>({
        defaultPermission: "VIEW",
        allowFileDownload: true,
        requirePassphrase: false,
        autoExpireDays: 30,
    });

    const updatePolicies = async (patch: Partial<SharingPolicies>) => {
        setPolicies((prev) => ({ ...prev, ...patch }));
        try {
            await api.put("/users/settings", {
                defaultSharePermission: patch.defaultPermission,
                allowFileDownload: patch.allowFileDownload,
                requirePassphrase: patch.requirePassphrase,
            });
        } catch (err) {
            console.error("Failed to persist sharing policies to backend", err);
        }
    };

    // Fetch Outgoing & Incoming Shares
    const loadSharingData = useCallback(async () => {
        try {
            setError(null);

            // Fetch user settings
            api.get<{ defaultSharePermission?: "VIEW" | "EDIT"; allowFileDownload?: boolean; requirePassphrase?: boolean }>("/users/settings")
                .then((res) => {
                    if (res.data) {
                        setPolicies((prev) => ({
                            ...prev,
                            defaultPermission: res.data.defaultSharePermission || prev.defaultPermission,
                            allowFileDownload: res.data.allowFileDownload ?? prev.allowFileDownload,
                            requirePassphrase: res.data.requirePassphrase ?? prev.requirePassphrase,
                        }));
                    }
                })
                .catch(() => {});

            // 1. Fetch user assets
            const assetsRes = await api.get<UserAsset[]>("/assets");
            const ownedAssets = (assetsRes.data || []).filter((a) => a.owner);
            setAssets(ownedAssets);

            // 2. Fetch outgoing shares for each owned asset
            const outgoingPromises = ownedAssets.map(async (asset) => {
                try {
                    const sharesRes = await api.get(`/assets/${asset.id}/shares`);
                    const sharesList = Array.isArray(sharesRes.data) ? sharesRes.data : [];
                    return sharesList.map((s: { id: number; sharedWithEmail: string; sharedWithName: string; permission: "VIEW" | "EDIT"; sharedAt: string }) => ({
                        shareId: s.id,
                        assetId: asset.id,
                        assetTitle: asset.title,
                        assetType: asset.type,
                        sharedWithEmail: s.sharedWithEmail,
                        sharedWithName: s.sharedWithName,
                        permission: s.permission,
                        sharedAt: s.sharedAt,
                    }));
                } catch (e) {
                    console.error(`Failed to fetch shares for asset ${asset.id}`, e);
                    return [];
                }
            });

            const allOutgoingArrays = await Promise.all(outgoingPromises);
            setOutgoingShares(allOutgoingArrays.flat());

            // 3. Fetch incoming shares
            try {
                const incomingRes = await api.get<IncomingShare[]>("/assets/shared");
                setIncomingShares(Array.isArray(incomingRes.data) ? incomingRes.data : []);
            } catch (e) {
                console.error("Failed to fetch incoming shares", e);
                setIncomingShares([]);
            }
        } catch (err) {
            console.error("Failed to load sharing details:", err);
            setError("Unable to load sharing settings and permissions. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadSharingData();
    }, [loadSharingData]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadSharingData();
    };

    // Handle create share
    const handleCreateShare = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError(null);
        setModalSuccess(null);

        if (!selectedAssetId) {
            setModalError("Please choose an asset to share.");
            return;
        }
        if (!recipientEmail.trim()) {
            setModalError("Please enter recipient email address.");
            return;
        }

        try {
            setShareSubmitting(true);
            await api.post(`/assets/${selectedAssetId}/share`, {
                email: recipientEmail.trim(),
                permission: sharePermission,
            });

            setModalSuccess("Asset shared successfully!");
            setTimeout(() => {
                setShowShareModal(false);
                setSelectedAssetId("");
                setRecipientEmail("");
                setModalSuccess(null);
                loadSharingData();
            }, 1000);
        } catch (err: unknown) {
            console.error("Share failed:", err);
            if (err && typeof err === "object" && "response" in err) {
                const axiosErr = err as { response?: { data?: string | { message?: string } } };
                const data = axiosErr.response?.data;
                if (typeof data === "string") {
                    setModalError(data);
                } else if (data && typeof data === "object" && "message" in data) {
                    setModalError(String(data.message));
                } else {
                    setModalError("Failed to share asset. Verify recipient email.");
                }
            } else {
                setModalError("An error occurred while sharing the asset.");
            }
        } finally {
            setShareSubmitting(false);
        }
    };

    // Handle update permission
    const handleUpdatePermission = async (assetId: number, shareId: number, currentPerm: "VIEW" | "EDIT") => {
        const nextPerm = currentPerm === "VIEW" ? "EDIT" : "VIEW";
        setActionShareId(shareId);
        try {
            await api.put(`/assets/${assetId}/shares/${shareId}`, {
                permission: nextPerm,
            });
            // Update local state
            setOutgoingShares((prev) =>
                prev.map((s) => (s.shareId === shareId ? { ...s, permission: nextPerm } : s))
            );
        } catch (err) {
            console.error("Failed to update permission", err);
            alert("Could not update permission level.");
        } finally {
            setActionShareId(null);
        }
    };

    // Handle revoke share
    const handleRevokeShare = async (assetId: number, shareId: number, recipientName: string) => {
        if (!window.confirm(`Revoke access for ${recipientName}? They will no longer be able to view this asset.`)) {
            return;
        }
        setActionShareId(shareId);
        try {
            await api.delete(`/assets/${assetId}/shares/${shareId}`);
            setOutgoingShares((prev) => prev.filter((s) => s.shareId !== shareId));
        } catch (err) {
            console.error("Failed to revoke share", err);
            alert("Could not revoke access.");
        } finally {
            setActionShareId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sharing & Permissions</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Control digital asset access, monitor outgoing and incoming shares, and configure vault sharing defaults.
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
                        onClick={() => {
                            setShowShareModal(true);
                            setModalError(null);
                            setModalSuccess(null);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Share New Asset
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Outgoing Shares</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {loading ? "-" : outgoingShares.length}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">Granted to trusted contacts</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Shared With You</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <ArrowDownLeft className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {loading ? "-" : incomingShares.length}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">Accessible from other vaults</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Default Access</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                            <Shield className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {policies.defaultPermission}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">Base level for new shares</p>
                </div>
            </div>

            {/* Outgoing Shares Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Outgoing Shares (Assets You Shared)</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                People and accounts that currently hold authorized access to your vault items.
                            </p>
                        </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {outgoingShares.length} active
                    </span>
                </div>

                {loading ? (
                    <div className="flex h-36 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                ) : outgoingShares.length === 0 ? (
                    <div className="py-8 text-center">
                        <Users className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                        <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">No outgoing shares yet</p>
                        <p className="mt-1 text-xs text-slate-400">
                            Share assets with colleagues or family with granular VIEW or EDIT permissions.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowShareModal(true)}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Share an Asset
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                <tr>
                                    <th className="pb-3 font-semibold">Asset Title</th>
                                    <th className="pb-3 font-semibold">Recipient</th>
                                    <th className="pb-3 font-semibold">Permission</th>
                                    <th className="pb-3 font-semibold">Shared On</th>
                                    <th className="pb-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {outgoingShares.map((share) => (
                                    <tr key={share.shareId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="py-3 font-medium text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <span>{share.assetTitle}</span>
                                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                    {share.assetType}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-slate-600 dark:text-slate-300">
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">{share.sharedWithName || "User"}</p>
                                                <p className="text-[11px] text-slate-400">{share.sharedWithEmail}</p>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <button
                                                type="button"
                                                disabled={actionShareId === share.shareId}
                                                onClick={() => handleUpdatePermission(share.assetId, share.shareId, share.permission)}
                                                className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold transition ${
                                                    share.permission === "EDIT"
                                                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-950/50 dark:text-purple-300"
                                                        : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950/50 dark:text-blue-300"
                                                }`}
                                                title="Click to toggle VIEW / EDIT"
                                            >
                                                {actionShareId === share.shareId ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    share.permission
                                                )}
                                                <span className="text-[10px] opacity-70">↕</span>
                                            </button>
                                        </td>
                                        <td className="py-3 text-slate-500 dark:text-slate-400">
                                            {share.sharedAt ? new Date(share.sharedAt).toLocaleDateString() : "Recent"}
                                        </td>
                                        <td className="py-3 text-right">
                                            <button
                                                type="button"
                                                disabled={actionShareId === share.shareId}
                                                onClick={() => handleRevokeShare(share.assetId, share.shareId, share.sharedWithName || share.sharedWithEmail)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Revoke
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Incoming Shares Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Incoming Shares (Shared With You)</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Assets shared with your digital identity by other vault owners.
                            </p>
                        </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {incomingShares.length} shared
                    </span>
                </div>

                {loading ? (
                    <div className="flex h-28 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    </div>
                ) : incomingShares.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                        No external assets have been shared with you yet.
                    </div>
                ) : (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {incomingShares.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col justify-between rounded-xl border border-slate-200 p-4 transition hover:border-blue-400 dark:border-slate-800 dark:hover:border-blue-700"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                            {item.permission}
                                        </span>
                                    </div>
                                    <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                                        {item.description || "Shared vault asset"}
                                    </p>
                                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                        <span>Owner:</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.ownerName || item.ownerEmail}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400">
                                        {item.sharedAt ? new Date(item.sharedAt).toLocaleDateString() : "Shared"}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/assets")}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        Open Asset
                                        <ExternalLink className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sharing Policies Configuration */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <Sliders className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Default Sharing Policies</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure security constraints automatically enforced on newly created asset shares.
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Default Permission Level</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Read-only (VIEW) prevents recipient from editing encrypted payloads.
                            </p>
                        </div>
                        <select
                            value={policies.defaultPermission}
                            onChange={(e) => updatePolicies({ defaultPermission: e.target.value as "VIEW" | "EDIT" })}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <option value="VIEW">VIEW (Read-only)</option>
                            <option value="EDIT">EDIT (Read & Write)</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                        <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Allow Attachment Downloads</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Let shared recipients download decrypted file attachments.
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={policies.allowFileDownload}
                                onChange={(e) => updatePolicies({ allowFileDownload: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 dark:bg-slate-800 dark:peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                        <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Require Link Passphrase</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Require external passphrase for public zero-knowledge asset links.
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={policies.requirePassphrase}
                                onChange={(e) => updatePolicies({ requirePassphrase: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 dark:bg-slate-800 dark:peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                    </div>
                </div>
            </div>

            {/* Share Asset Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white">Share Vault Asset</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowShareModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateShare} className="mt-4 space-y-4">
                            {modalError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                    {modalError}
                                </div>
                            )}
                            {modalSuccess && (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                                    {modalSuccess}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Select Asset to Share
                                </label>
                                <select
                                    value={selectedAssetId}
                                    onChange={(e) => setSelectedAssetId(Number(e.target.value) || "")}
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                >
                                    <option value="">-- Choose an asset --</option>
                                    {assets.map((asset) => (
                                        <option key={asset.id} value={asset.id}>
                                            {asset.title} ({asset.type})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Recipient Email
                                </label>
                                <input
                                    type="email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    placeholder="colleague@example.com"
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                />
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Recipient must have an active Calvion account.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Permission Level
                                </label>
                                <div className="mt-1.5 grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSharePermission("VIEW")}
                                        className={`rounded-xl border p-2.5 text-left transition ${
                                            sharePermission === "VIEW"
                                                ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300"
                                                : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                        }`}
                                    >
                                        <p className="text-xs font-bold">VIEW</p>
                                        <p className="text-[10px] opacity-80">Read-only access</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSharePermission("EDIT")}
                                        className={`rounded-xl border p-2.5 text-left transition ${
                                            sharePermission === "EDIT"
                                                ? "border-purple-600 bg-purple-50/50 text-purple-700 dark:border-purple-500 dark:bg-purple-950/40 dark:text-purple-300"
                                                : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                        }`}
                                    >
                                        <p className="text-xs font-bold">EDIT</p>
                                        <p className="text-[10px] opacity-80">Can edit item data</p>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowShareModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={shareSubmitting}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {shareSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                    Authorize Share
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
