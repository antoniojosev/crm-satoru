"use client";

import React, { useState, use } from "react"; // 1. Importamos 'use'
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
} from "lucide-react";

// 2. Definimos que params es una Promesa
export default function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 3. Desempaquetamos el ID usando el hook use()
  const { id } = use(params);

  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Datos Mock (Usamos la variable 'id' ya limpia)
  const investor = {
    id: id,
    firstName: "Alejandro",
    lastName: "González",
    email: "alejandro@example.com",
    phone: "+54 9 11 1234 5678",
    nationality: "Argentina",
    dob: "15/04/1988",
    kycStatus: "PENDING",
    documents: {
      front: "/placeholder-id-front.jpg",
      back: "/placeholder-id-back.jpg",
    },
  };

  const handleKycAction = async (status: "VERIFIED" | "REJECTED") => {
    setIsProcessing(true);
    console.log(`Enviando estado ${status} para el usuario ${investor.id}`);

    setTimeout(() => {
      alert(
        status === "VERIFIED"
          ? "✅ Usuario verificado correctamente"
          : "❌ Verificación rechazada"
      );
      router.push("/dashboard/investors");
    }, 1000);
  };

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
            {/* Usamos 'id' limpio aquí también */}
            Solicitud #{id.substring(0, 6)} • {investor.firstName}{" "}
            {investor.lastName}
          </p>
        </div>

        <div className='ml-auto'>
          <span className='px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold rounded-full uppercase flex items-center gap-2 animate-pulse'>
            <Shield size={12} /> Revisión Pendiente
          </span>
        </div>
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
                  Nacionalidad
                </label>
                <div className='text-white text-sm flex items-center gap-2'>
                  <MapPin size={14} className='text-gray-500' />{" "}
                  {investor.nationality}
                </div>
              </div>

              <div className='space-y-1'>
                <label className='text-[10px] font-bold text-gray-600 uppercase'>
                  Fecha de Nacimiento
                </label>
                <div className='text-white text-sm flex items-center gap-2'>
                  <Calendar size={14} className='text-gray-500' />{" "}
                  {investor.dob}
                </div>
              </div>

              <div className='space-y-1'>
                <label className='text-[10px] font-bold text-gray-600 uppercase'>
                  Contacto
                </label>
                <div className='space-y-1'>
                  <div className='text-white text-sm flex items-center gap-2'>
                    <Mail size={14} className='text-gray-500' />{" "}
                    {investor.email}
                  </div>
                  <div className='text-white text-sm flex items-center gap-2'>
                    <Phone size={14} className='text-gray-500' />{" "}
                    {investor.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-3'>
            <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-2'>
              Decisión Final
            </h3>
            <button
              onClick={() => handleKycAction("VERIFIED")}
              disabled={isProcessing}
              className='w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all'
            >
              <CheckCircle size={18} /> Aprobar KYC
            </button>
            <button
              onClick={() => handleKycAction("REJECTED")}
              disabled={isProcessing}
              className='w-full py-3 bg-[#1A1A1A] border border-red-900/50 text-red-500 hover:bg-red-900/10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all'
            >
              <XCircle size={18} /> Rechazar
            </button>
          </div>
        </div>

        {/* Columna Derecha: Documentos */}
        <div className='lg:col-span-2 bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6'>
          <div className='flex justify-between items-center border-b border-gray-800 pb-2 mb-6'>
            <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest'>
              Documentación Presentada
            </h3>
            <button className='text-xs text-[#FF4400] font-bold flex items-center gap-1 hover:underline'>
              <Download size={14} /> Descargar ZIP
            </button>
          </div>

          <div className='space-y-8'>
            {/* Frente del DNI */}
            <div>
              <p className='text-xs text-gray-400 mb-2 flex items-center gap-2'>
                <FileText size={14} /> Documento de Identidad (Frente)
              </p>
              <div className='w-full h-64 bg-black rounded-xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center relative overflow-hidden group'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10'></div>
                <div className='z-20 text-center'>
                  <div className='w-16 h-10 bg-gray-700 rounded mb-2 mx-auto'></div>
                  <p className='text-gray-500 text-xs'>
                    Vista previa del documento
                  </p>
                </div>
              </div>
            </div>

            {/* Dorso del DNI */}
            <div>
              <p className='text-xs text-gray-400 mb-2 flex items-center gap-2'>
                <FileText size={14} /> Documento de Identidad (Dorso)
              </p>
              <div className='w-full h-64 bg-black rounded-xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center relative overflow-hidden'>
                <div className='z-20 text-center'>
                  <div className='w-16 h-10 bg-gray-700 rounded mb-2 mx-auto'></div>
                  <p className='text-gray-500 text-xs'>
                    Vista previa del documento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
