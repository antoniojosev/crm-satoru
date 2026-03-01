"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Loader2,
    AlertCircle,
    Banknote,
    CheckCircle2,
    Clock,
    XCircle,
    Users,
    TrendingUp,
    DollarSign,
    Trash2,
    ExternalLink,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchLiquidacionById,
    deleteLiquidacion,
    clearCurrentLiquidacion,
} from "@/store/slices/liquidacionesSlice";
import type { LiquidacionStatus } from "@/store/slices/liquidacionesSlice";

const STATUS_CONFIG: Record<LiquidacionStatus, { label: string; icon: React.ReactNode; className: string }> = {
    PENDING: {
        label: "Pendiente",
        icon: <Clock size={13} />,
        className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    DISTRIBUTED: {
        label: "Distribuido",
        icon: <CheckCircle2 size={13} />,
        className: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    FAILED: {
        label: "Fallido",
        icon: <XCircle size={13} />,
        className: "bg-red-500/10 text-red-400 border-red-500/20",
    },
};

export default function LiquidacionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentLiquidacion: liq, isLoadingDetail, isLoading, error } = useAppSelector(
        (state) => state.liquidaciones
    );

    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        dispatch(fetchLiquidacionById(id));
        return () => {
            dispatch(clearCurrentLiquidacion());
        };
    }, [dispatch, id]);

    const handleDelete = async () => {
        const result = await dispatch(deleteLiquidacion(id));
        if (deleteLiquidacion.fulfilled.match(result)) {
            router.push("/dashboard/liquidaciones");
        }
    };

    const canDelete = liq?.status === "PENDING" || liq?.status === "FAILED";

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const fmt = (n: number) =>
        Number(n).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const fmt6 = (n: number) =>
        Number(n).toLocaleString("es-AR", { minimumFractionDigits: 6, maximumFractionDigits: 6 });

    if (isLoadingDetail) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-[#FF4400]" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-12">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4">
                    <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                    <div>
                        <h3 className="text-red-500 font-bold mb-1">Error al cargar liquidación</h3>
                        <p className="text-red-400 text-sm">{error}</p>
                        <Link
                            href="/dashboard/liquidaciones"
                            className="inline-flex items-center gap-2 mt-4 text-sm text-white hover:text-[#FF4400] transition-colors"
                        >
                            <ArrowLeft size={16} /> Volver al listado
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!liq) return null;

    const statusCfg = STATUS_CONFIG[liq.status];
    const distributions = liq.distributions ?? [];
    const totalTokens = distributions.reduce((s, d) => s + 0, 0); // tokens no vienen del backend

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/liquidaciones"
                    className="p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Detalle de Liquidación
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {liq.project?.name ?? liq.projectId} · #{id.substring(0, 8)}
                    </p>
                </div>
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusCfg.className}`}
                >
                    {statusCfg.icon}
                    {statusCfg.label}
                </span>
            </div>

            {/* Notas de error si tiene */}
            {liq.notes && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-400 text-sm">
                    <span className="font-bold">Notas: </span>{liq.notes}
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FF4400]/10 border border-[#FF4400]/20 flex items-center justify-center">
                        <DollarSign size={20} className="text-[#FF4400]" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase font-bold mb-0.5">Ventas Totales</p>
                        <p className="text-white font-bold text-xl">
                            ${fmt(liq.totalSalesAmount)}
                            <span className="text-gray-500 text-xs font-normal ml-1">USDT</span>
                        </p>
                    </div>
                </div>

                <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <TrendingUp size={20} className="text-green-400" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase font-bold mb-0.5">
                            Rendimiento ({liq.project?.expectedReturn ?? "—"}%)
                        </p>
                        <p className="text-green-400 font-bold text-xl">
                            ${fmt(liq.yieldAmount)}
                            <span className="text-gray-500 text-xs font-normal ml-1">USDT</span>
                        </p>
                    </div>
                </div>

                <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Users size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase font-bold mb-0.5">Inversores</p>
                        <p className="text-white font-bold text-xl">{liq.distributedTo}</p>
                        <p className="text-gray-600 text-xs">
                            {liq.distributedAt ? `Distribuido ${formatDate(liq.distributedAt)}` : `Creado ${formatDate(liq.createdAt)}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Distributions Table */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-800 flex items-center gap-2">
                    <Banknote size={16} className="text-[#FF4400]" />
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Distribuciones ({distributions.length})
                    </h3>
                </div>

                {distributions.length === 0 ? (
                    <div className="p-12 text-center">
                        <Banknote className="mx-auto text-gray-700 mb-3" size={40} />
                        <p className="text-gray-500 text-sm">
                            {liq.status === "PENDING"
                                ? "La distribución está en proceso..."
                                : "No se registraron distribuciones para esta liquidación."}
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-900/50 border-b border-gray-800">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Inversor ID
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Wallet
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                                    Monto USDT
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Fecha
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Tx
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {distributions.map((d) => (
                                <tr key={d.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-400 text-xs font-mono">{d.investorId.substring(0, 12)}…</td>
                                    <td className="p-4">
                                        <span className="text-gray-300 text-xs font-mono">
                                            {d.walletAddress.substring(0, 8)}…{d.walletAddress.substring(d.walletAddress.length - 6)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="text-green-400 font-bold text-sm">
                                            +${fmt6(d.amount)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-xs">{formatDate(d.createdAt)}</td>
                                    <td className="p-4">
                                        {d.txHash ? (
                                            <a
                                                href={`https://amoy.polygonscan.com/tx/${d.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-500 hover:text-[#FF4400] transition-colors"
                                                title={d.txHash}
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        ) : (
                                            <span className="text-gray-700">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Section */}
            {canDelete && (
                <div className="bg-[#1A1A1A] border border-red-900/30 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Zona de Peligro
                    </h3>
                    <p className="text-gray-600 text-xs mb-4">
                        Esta liquidación tiene estado <strong className="text-gray-400">{statusCfg.label}</strong>. Podés eliminarla del historial permanentemente.
                    </p>

                    {!showConfirm ? (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-red-900/50 text-red-500 hover:bg-red-900/10 rounded-xl text-sm font-bold transition-all"
                        >
                            <Trash2 size={16} />
                            Eliminar liquidación
                        </button>
                    ) : (
                        <div className="bg-red-900/10 border border-red-500/30 rounded-xl p-4 space-y-3">
                            <p className="text-red-400 text-sm font-medium">
                                ⚠️ ¿Estás seguro? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    Sí, eliminar
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-white rounded-xl text-sm font-bold transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
