"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchInvestors,
  setKycStatusFilter,
  setSearchFilter,
} from "@/store/slices/investorsSlice";
import type { KycStatus } from "@/store/types";

export default function InvestorsPage() {
  const dispatch = useAppDispatch();
  const { investors, isLoading, error, filters } = useAppSelector(
    (state) => state.investors
  );

  const [localSearch, setLocalSearch] = useState("");

  // Cargar inversores al montar y cuando cambien los filtros
  useEffect(() => {
    dispatch(
      fetchInvestors({
        kycStatus: filters.kycStatus ?? undefined,
        search: filters.search || undefined,
      })
    );
  }, [dispatch, filters.kycStatus, filters.search]);

  // Filtrado local para búsqueda en tiempo real
  const filteredInvestors = useMemo(() => {
    if (!localSearch.trim()) return investors;

    const searchLower = localSearch.toLowerCase();
    return investors.filter(
      (investor) =>
        investor.firstName.toLowerCase().includes(searchLower) ||
        investor.lastName.toLowerCase().includes(searchLower) ||
        investor.email.toLowerCase().includes(searchLower) ||
        `${investor.firstName} ${investor.lastName}`.toLowerCase().includes(searchLower)
    );
  }, [investors, localSearch]);

  // Contar inversores por estado
  const pendingCount = investors.filter((inv) => inv.kycStatus === "PENDING").length;

  // Función para cambiar filtro de estado
  const handleStatusFilter = (status: KycStatus | null) => {
    dispatch(setKycStatusFilter(status));
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Función para etiquetar el estado del KYC
  const getKycBadge = (status: KycStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border bg-green-500/10 text-green-500 border-green-500/20'>
            <ShieldCheck size={12} /> Aprobado
          </span>
        );
      case "PENDING":
        return (
          <span className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border bg-orange-500/10 text-orange-500 border-orange-500/20 animate-pulse'>
            <Clock size={12} /> Pendiente
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border bg-blue-500/10 text-blue-500 border-blue-500/20'>
            <Clock size={12} /> En Revisión
          </span>
        );
      case "REJECTED":
        return (
          <span className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border bg-red-500/10 text-red-500 border-red-500/20'>
            <ShieldAlert size={12} /> Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className='space-y-6'>
      {/* 1. Encabezado */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-white tracking-tight'>
            Gestión de Inversores
          </h1>
          <p className='text-gray-500 text-sm mt-1'>
            Revisa y aprueba las verificaciones de identidad (KYC).
          </p>
        </div>

        {/* Filtro rápido */}
        <div className='flex gap-2'>
          <button
            onClick={() => handleStatusFilter("PENDING")}
            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
              filters.kycStatus === "PENDING"
                ? "bg-[#FF4400] border-[#FF4400] text-white"
                : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:text-white hover:border-gray-600"
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => handleStatusFilter(null)}
            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
              filters.kycStatus === null
                ? "bg-[#FF4400] border-[#FF4400] text-white"
                : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:text-white hover:border-gray-600"
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {/* 2. Buscador */}
      <div className='relative max-w-md'>
        <Search
          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
          size={18}
        />
        <input
          type='text'
          placeholder='Buscar por nombre o email...'
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className='w-full bg-[#1A1A1A] border border-gray-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#FF4400] transition-colors placeholder:text-gray-600'
        />
      </div>

      {/* Estado de Error */}
      {error && (
        <div className='bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3'>
          <AlertCircle className='text-red-500' size={20} />
          <p className='text-red-500 text-sm font-medium'>{error}</p>
        </div>
      )}

      {/* 3. Tabla de Inversores */}
      <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden'>
        {isLoading ? (
          <div className='flex items-center justify-center py-20'>
            <Loader2 className='animate-spin text-[#FF4400]' size={40} />
          </div>
        ) : filteredInvestors.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <User className='text-gray-600 mb-4' size={48} />
            <p className='text-gray-500 text-sm'>
              {localSearch.trim()
                ? "No se encontraron inversores con ese criterio"
                : "No hay inversores registrados"}
            </p>
          </div>
        ) : (
          <table className='w-full text-left'>
            <thead>
              <tr className='border-b border-gray-800 bg-gray-900/50'>
                <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest'>
                  Usuario
                </th>
                <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest'>
                  Estado KYC
                </th>
                <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest'>
                  Registrado
                </th>
                <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest'>
                  Documento
                </th>
                <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center'>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-800'>
              {filteredInvestors.map((investor) => (
                <tr key={investor.id} className='hover:bg-white/5 transition-colors'>
                  {/* Usuario Info */}
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400'>
                        <User size={14} />
                      </div>
                      <div>
                        <p className='font-bold text-white text-sm'>
                          {investor.firstName} {investor.lastName}
                        </p>
                        <p className='text-gray-500 text-xs'>{investor.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Estado KYC */}
                  <td className='p-4'>{getKycBadge(investor.kycStatus)}</td>

                  {/* Fecha */}
                  <td className='p-4 text-sm text-gray-400'>
                    {formatDate(investor.createdAt)}
                  </td>

                  {/* Documento */}
                  <td className='p-4 text-sm text-gray-400'>
                    {investor.documentType} {investor.documentNumber}
                  </td>

                  {/* Botón Ver Detalle */}
                  <td className='p-4 text-center'>
                    <Link
                      href={`/dashboard/investors/${investor.id}`}
                      className='inline-flex items-center justify-center p-2 text-gray-400 hover:text-[#FF4400] hover:bg-[#FF4400]/10 rounded-lg transition-all'
                      title='Ver Documentos'
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
