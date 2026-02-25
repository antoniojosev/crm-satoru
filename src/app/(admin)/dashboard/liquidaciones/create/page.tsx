"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Search,
  DollarSign,
  Eye,
  CheckCircle2,
  Users,
  Coins,
  FileText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/slices/projectsSlice";
import {
  fetchLiquidacionPreview,
  createLiquidacion,
  clearPreview,
  clearError,
} from "@/store/slices/liquidacionesSlice";

export default function CreateLiquidacionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { projects } = useAppSelector((state) => state.projects);
  const { preview, isLoading, isLoadingPreview, error } = useAppSelector(
    (state) => state.liquidaciones
  );

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [totalSalesAmount, setTotalSalesAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [previewRequested, setPreviewRequested] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects(undefined));
    dispatch(clearPreview());
    dispatch(clearError());
  }, [dispatch]);

  // Resetear preview al cambiar proyecto o monto
  useEffect(() => {
    setPreviewRequested(false);
    dispatch(clearPreview());
  }, [selectedProjectId, totalSalesAmount, dispatch]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const salesAmountNum = parseFloat(totalSalesAmount) || 0;
  const canPreview = selectedProjectId && salesAmountNum > 0;
  const canConfirm = previewRequested && preview && !isLoadingPreview;

  const handlePreview = () => {
    if (!canPreview) return;
    setPreviewRequested(true);
    dispatch(
      fetchLiquidacionPreview({
        projectId: selectedProjectId,
        totalSalesAmount: salesAmountNum,
      })
    );
  };

  const handleConfirm = async () => {
    if (!canConfirm) return;
    const result = await dispatch(
      createLiquidacion({
        projectId: selectedProjectId,
        totalSalesAmount: salesAmountNum,
        notes: notes || undefined,
      })
    );
    if (createLiquidacion.fulfilled.match(result)) {
      router.push("/dashboard/liquidaciones");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/liquidaciones"
          className="p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Nueva Liquidación
          </h1>
          <p className="text-gray-500 text-sm">
            Distribuí rendimientos a inversores tras la venta de un proyecto.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Formulario */}
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
          Datos de la Liquidación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Proyecto */}
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Proyecto *
            </label>
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                size={18}
              />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all appearance-none"
              >
                <option value="">Seleccionar proyecto...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedProject && (
              <p className="text-xs text-gray-600">
                APY esperado:{" "}
                <span className="text-green-500 font-bold">
                  {selectedProject.expectedReturn}%
                </span>
              </p>
            )}
          </div>

          {/* Monto de ventas */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Monto Total de Ventas (USD) *
            </label>
            <div className="relative group">
              <DollarSign
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                size={18}
              />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej: 500000"
                value={totalSalesAmount}
                onChange={(e) => setTotalSalesAmount(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
              />
            </div>
            {selectedProject && salesAmountNum > 0 && (
              <p className="text-xs text-gray-600">
                Rendimiento estimado:{" "}
                <span className="text-[#FF4400] font-bold">
                  $
                  {(
                    (salesAmountNum * selectedProject.expectedReturn) /
                    100
                  ).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USDT
                </span>
              </p>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-2 col-span-2">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Notas (Opcional)
            </label>
            <div className="relative group">
              <FileText
                className="absolute left-4 top-4 text-gray-600 group-focus-within:text-[#FF4400]"
                size={18}
              />
              <textarea
                rows={2}
                placeholder="Ej: Venta escriturada el 24/02/2026..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Botón Preview */}
        <div className="flex justify-end">
          <button
            onClick={handlePreview}
            disabled={!canPreview || isLoadingPreview}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoadingPreview ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Calculando...
              </>
            ) : (
              <>
                <Eye size={18} />
                Ver Preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview de distribución */}
      {preview && previewRequested && (
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
            Preview de Distribución
          </h3>

          {/* Resumen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">
                Ventas Totales
              </p>
              <p className="text-white font-bold text-lg">
                ${Number(preview.totalSalesAmount).toLocaleString("es-AR", { minimumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">
                APY Aplicado
              </p>
              <p className="text-green-400 font-bold text-lg">
                {preview.yieldPercentage}%
              </p>
            </div>
            <div className="bg-[#0A0A0A] rounded-xl p-4 border border-[#FF4400]/30 bg-[#FF4400]/5">
              <p className="text-[#FF4400] text-xs uppercase font-bold mb-1">
                A Distribuir
              </p>
              <p className="text-white font-bold text-lg">
                ${Number(preview.yieldAmount).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
              </p>
            </div>
            <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">
                Inversores
              </p>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-400" />
                <p className="text-white font-bold text-lg">
                  {preview.totalInvestors}
                </p>
              </div>
            </div>
          </div>

          {/* Tabla de distribución */}
          {preview.distributions.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-800">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60">
                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Wallet
                    </th>
                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                      Tokens
                    </th>
                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                      Participación
                    </th>
                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                      Recibirá (USDT)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {preview.distributions.map((d) => (
                    <tr
                      key={d.investorId}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="p-3">
                        <span className="font-mono text-xs text-gray-400">
                          {d.walletAddress.slice(0, 8)}...{d.walletAddress.slice(-6)}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1 text-gray-300 text-xs">
                          <Coins size={12} />
                          {Number(d.tokens).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-gray-400 text-xs">
                          {d.percentage}%
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-green-400 font-bold text-sm">
                          ${d.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              No hay inversores confirmados en este proyecto.
            </div>
          )}

          {/* Acciones finales */}
          <div className="flex justify-end gap-4 pt-2">
            <Link
              href="/dashboard/liquidaciones"
              className="px-6 py-3 rounded-xl border border-gray-800 text-gray-400 font-bold text-sm hover:text-white hover:bg-gray-800 transition-all"
            >
              Cancelar
            </Link>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || isLoading || preview.distributions.length === 0}
              className="px-8 py-3 bg-[#FF4400] hover:bg-[#CC3300] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Distribuyendo...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Confirmar y Distribuir
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
