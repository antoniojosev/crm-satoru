"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2, CheckCircle2, Clock, XCircle, Banknote, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLiquidaciones } from "@/store/slices/liquidacionesSlice";
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

export default function LiquidacionesPage() {
  const dispatch = useAppDispatch();
  const { liquidaciones, isLoading, error } = useAppSelector(
    (state) => state.liquidaciones
  );

  useEffect(() => {
    dispatch(fetchLiquidaciones(undefined));
  }, [dispatch]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Liquidaciones
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Distribución de rendimientos a inversores por venta de proyecto.
          </p>
        </div>

        <Link
          href="/dashboard/liquidaciones/create"
          className="bg-[#FF4400] hover:bg-[#CC3300] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          Nueva Liquidación
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-[#FF4400]" size={32} />
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Proyecto
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                  Ventas Totales
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                  Rendimiento
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
                  Inversores
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
                  Estado
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Fecha
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {liquidaciones.map((liq) => {
                const statusCfg = STATUS_CONFIG[liq.status];
                return (
                  <tr
                    key={liq.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* Proyecto */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">
                          {liq.project?.name ?? liq.projectId}
                        </span>
                        <span className="text-gray-600 text-xs">
                          APY {liq.project?.expectedReturn ?? "—"}%
                        </span>
                      </div>
                    </td>

                    {/* Ventas totales */}
                    <td className="p-4 text-right">
                      <span className="text-white font-bold text-sm">
                        ${Number(liq.totalSalesAmount).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Yield distribuido */}
                    <td className="p-4 text-right">
                      <span className="text-green-400 font-bold text-sm">
                        ${Number(liq.yieldAmount).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Inversores */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-400 text-sm">
                        <Users size={14} />
                        <span>{liq.distributedTo}</span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.className}`}
                      >
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="p-4">
                      <span className="text-gray-500 text-xs">
                        {formatDate(liq.createdAt)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {liquidaciones.length === 0 && !isLoading && (
            <div className="p-12 text-center">
              <Banknote className="mx-auto text-gray-700 mb-3" size={40} />
              <p className="text-gray-500 text-sm">No hay liquidaciones registradas.</p>
              <p className="text-gray-700 text-xs mt-1">
                Creá una nueva liquidación cuando se concrete la venta de un proyecto.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
