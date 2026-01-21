"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Shield,
  Download,
  Loader2,
  AlertCircle,
  User,
  ShieldCheck,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchInvestorById,
  updateKycStatus,
  clearCurrentInvestor,
} from "@/store/slices/investorsSlice";
import type { KycStatus } from "@/store/types";

export default function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentInvestor: investor, isLoading, error } = useAppSelector(
    (state) => state.investors
  );

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchInvestorById(id));

    return () => {
      dispatch(clearCurrentInvestor());
    };
  }, [dispatch, id]);

  const handleKycAction = async (status: "APPROVED" | "REJECTED") => {
    if (!investor) return;

    setIsProcessing(true);

    try {
      const result = await dispatch(
        updateKycStatus({
          id: investor.id,
          data: {
            status,
            kycData: {
              reviewedAt: new Date().toISOString(),
              reviewComment:
                status === "APPROVED"
                  ? "Documentos verificados correctamente"
                  : "Documentos rechazados por inconsistencias",
            },
          },
        })
      );

      if (updateKycStatus.fulfilled.match(result)) {
        router.push("/dashboard/investors");
      }
    } catch (err) {
      console.error("Error al actualizar KYC:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getKycBadge = (status: KycStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className='px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-full uppercase flex items-center gap-2'>
            <ShieldCheck size={12} /> Aprobado
          </span>
        );
      case "PENDING":
        return (
          <span className='px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold rounded-full uppercase flex items-center gap-2 animate-pulse'>
            <Shield size={12} /> Revisión Pendiente
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className='px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold rounded-full uppercase flex items-center gap-2'>
            <Clock size={12} /> En Revisión
          </span>
        );
      case "REJECTED":
        return (
          <span className='px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-full uppercase flex items-center gap-2'>
            <ShieldAlert size={12} /> Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  // Helper function to construct full URL for KYC images
  const getKycImageUrl = (url: string | undefined): string => {
    if (!url) return '';
    if (url.startsWith("http")) return url;
    // Remove /api from base URL since static files are served from root
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}${url}`;
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Loader2 className='animate-spin text-[#FF4400]' size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-2xl mx-auto mt-12'>
        <div className='bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4'>
          <AlertCircle className='text-red-500 flex-shrink-0' size={24} />
          <div>
            <h3 className='text-red-500 font-bold mb-1'>Error al cargar inversor</h3>
            <p className='text-red-400 text-sm'>{error}</p>
            <Link
              href='/dashboard/investors'
              className='inline-flex items-center gap-2 mt-4 text-sm text-white hover:text-red-500 transition-colors'
            >
              <ArrowLeft size={16} /> Volver al listado
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className='max-w-2xl mx-auto mt-12 text-center'>
        <User className='text-gray-600 mx-auto mb-4' size={64} />
        <p className='text-gray-500'>Inversor no encontrado</p>
        <Link
          href='/dashboard/investors'
          className='inline-flex items-center gap-2 mt-4 text-sm text-[#FF4400] hover:underline'
        >
          <ArrowLeft size={16} /> Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto space-y-6'>
      {/* Header de Navegación */}
      <div className='flex items-center gap-4'>
        <Link
          href='/dashboard/investors'
          className='p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors'
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className='text-2xl font-bold text-white tracking-tight'>
            Revisión de Identidad (KYC)
          </h1>
          <p className='text-gray-500 text-sm'>
            Solicitud #{id.substring(0, 8)} • {investor.firstName}{" "}
            {investor.lastName}
          </p>
        </div>

        <div className='ml-auto'>{getKycBadge(investor.kycStatus)}</div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Columna Izquierda: Datos Personales */}
        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6'>
            <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4'>
              Datos Personales
            </h3>

            <div className='space-y-4'>
              <div className='space-y-1'>
                <label className='text-[10px] font-bold text-gray-600 uppercase'>
                  Nombre Completo
                </label>
                <div className='text-white font-medium flex items-center gap-2'>
                  {investor.firstName} {investor.lastName}
                </div>
              </div>

              <div className='space-y-1'>
                <label className='text-[10px] font-bold text-gray-600 uppercase'>
                  Documento
                </label>
                <div className='text-white text-sm flex items-center gap-2'>
                  <FileText size={14} className='text-gray-500' />{" "}
                  {investor.documentType} {investor.documentNumber}
                </div>
              </div>

              {investor.kycData?.nationality && (
                <div className='space-y-1'>
                  <label className='text-[10px] font-bold text-gray-600 uppercase'>
                    Nacionalidad
                  </label>
                  <div className='text-white text-sm flex items-center gap-2'>
                    <MapPin size={14} className='text-gray-500' />{" "}
                    {investor.kycData.nationality}
                  </div>
                </div>
              )}

              {investor.kycData?.birthDate && (
                <div className='space-y-1'>
                  <label className='text-[10px] font-bold text-gray-600 uppercase'>
                    Fecha de Nacimiento
                  </label>
                  <div className='text-white text-sm flex items-center gap-2'>
                    <Calendar size={14} className='text-gray-500' />{" "}
                    {formatDate(investor.kycData.birthDate)}
                  </div>
                </div>
              )}

              <div className='space-y-1'>
                <label className='text-[10px] font-bold text-gray-600 uppercase'>
                  Contacto
                </label>
                <div className='space-y-1'>
                  <div className='text-white text-sm flex items-center gap-2'>
                    <Mail size={14} className='text-gray-500' />{" "}
                    {investor.email}
                  </div>
                  {investor.phone && (
                    <div className='text-white text-sm flex items-center gap-2'>
                      <Phone size={14} className='text-gray-500' />{" "}
                      {investor.phone}
                    </div>
                  )}
                </div>
              </div>

              {investor.walletAddress && (
                <div className='space-y-1'>
                  <label className='text-[10px] font-bold text-gray-600 uppercase'>
                    Billetera
                  </label>
                  <div className='text-white text-xs font-mono break-all bg-gray-900 p-2 rounded-lg'>
                    {investor.walletAddress}
                  </div>
                </div>
              )}

              <div className='space-y-1'>
                <label className='text-[10px] font-bold text-gray-600 uppercase'>
                  Registrado
                </label>
                <div className='text-white text-sm'>
                  {formatDate(investor.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          {investor.kycStatus !== "APPROVED" && investor.kycStatus !== "REJECTED" && (
            <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-3'>
              <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-2'>
                Decisión Final
              </h3>
              <button
                onClick={() => handleKycAction("APPROVED")}
                disabled={isProcessing}
                className='w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isProcessing ? (
                  <Loader2 className='animate-spin' size={18} />
                ) : (
                  <CheckCircle size={18} />
                )}{" "}
                Aprobar KYC
              </button>
              <button
                onClick={() => handleKycAction("REJECTED")}
                disabled={isProcessing}
                className='w-full py-3 bg-[#1A1A1A] border border-red-900/50 text-red-500 hover:bg-red-900/10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isProcessing ? (
                  <Loader2 className='animate-spin' size={18} />
                ) : (
                  <XCircle size={18} />
                )}{" "}
                Rechazar
              </button>
            </div>
          )}

          {/* Información de revisión si ya fue revisado */}
          {investor.kycData?.reviewedAt && (
            <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6'>
              <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4'>
                Información de Revisión
              </h3>
              <div className='space-y-2'>
                <div className='text-xs text-gray-500'>Revisado el</div>
                <div className='text-white text-sm'>
                  {formatDate(investor.kycData.reviewedAt)}
                </div>
                {investor.kycData.reviewComment && (
                  <>
                    <div className='text-xs text-gray-500 mt-3'>Comentario</div>
                    <div className='text-white text-sm'>
                      {investor.kycData.reviewComment}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Documentos */}
        <div className='lg:col-span-2 bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6'>
          <div className='flex justify-between items-center border-b border-gray-800 pb-2 mb-6'>
            <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest'>
              Documentación Presentada
            </h3>
          </div>

          {!investor.kycData?.documentFrontUrl && !investor.kycData?.documentBackUrl && !investor.kycData?.selfieUrl ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <FileText className='text-gray-600 mb-4' size={48} />
              <p className='text-gray-500 text-sm'>
                No se han subido documentos aún
              </p>
            </div>
          ) : (
            <div className='space-y-8'>
              {/* Frente del DNI */}
              {investor.kycData?.documentFrontUrl && (
                <div>
                  <p className='text-xs text-gray-400 mb-2 flex items-center gap-2'>
                    <FileText size={14} /> Documento de Identidad (Frente)
                  </p>
                  <div className='w-full h-64 bg-black rounded-xl border-2 border-gray-800 overflow-hidden relative group'>
                    <img
                      src={getKycImageUrl(investor.kycData.documentFrontUrl)}
                      alt='Documento frente'
                      className='w-full h-full object-contain'
                      onError={(e) => {
                        console.error('Error loading documentFront:', getKycImageUrl(investor.kycData!.documentFrontUrl));
                        e.currentTarget.src = '/placeholder.png';
                      }}
                    />
                    <a
                      href={getKycImageUrl(investor.kycData.documentFrontUrl)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='absolute top-2 right-2 bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              )}

              {/* Dorso del DNI */}
              {investor.kycData?.documentBackUrl && (
                <div>
                  <p className='text-xs text-gray-400 mb-2 flex items-center gap-2'>
                    <FileText size={14} /> Documento de Identidad (Dorso)
                  </p>
                  <div className='w-full h-64 bg-black rounded-xl border-2 border-gray-800 overflow-hidden relative group'>
                    <img
                      src={getKycImageUrl(investor.kycData.documentBackUrl)}
                      alt='Documento dorso'
                      className='w-full h-full object-contain'
                      onError={(e) => {
                        console.error('Error loading documentBack:', getKycImageUrl(investor.kycData!.documentBackUrl));
                        e.currentTarget.src = '/placeholder.png';
                      }}
                    />
                    <a
                      href={getKycImageUrl(investor.kycData.documentBackUrl)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='absolute top-2 right-2 bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              )}

              {/* Selfie */}
              {investor.kycData?.selfieUrl && (
                <div>
                  <p className='text-xs text-gray-400 mb-2 flex items-center gap-2'>
                    <User size={14} /> Selfie de Verificación
                  </p>
                  <div className='w-full h-64 bg-black rounded-xl border-2 border-gray-800 overflow-hidden relative group'>
                    <img
                      src={getKycImageUrl(investor.kycData.selfieUrl)}
                      alt='Selfie'
                      className='w-full h-full object-contain'
                      onError={(e) => {
                        console.error('Error loading selfie:', getKycImageUrl(investor.kycData!.selfieUrl));
                        e.currentTarget.src = '/placeholder.png';
                      }}
                    />
                    <a
                      href={getKycImageUrl(investor.kycData.selfieUrl)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='absolute top-2 right-2 bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
