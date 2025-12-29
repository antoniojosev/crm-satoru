"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  Eye,
} from "lucide-react";

export default function InvestorsPage() {
  // Datos Mock (Simulados) basados en tus capturas de "Alejandro González"
  const investors = [
    {
      id: 1,
      name: "Alejandro González",
      email: "alejandro@example.com",
      kycStatus: "PENDING", // El Admin debe revisar esto
      joinedDate: "29 Dic 2025",
      totalInvested: 0,
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      email: "maria.rod@gmail.com",
      kycStatus: "VERIFIED",
      joinedDate: "20 Dic 2025",
      totalInvested: 12500,
    },
    {
      id: 3,
      name: "Carlos Perez",
      email: "carlos.perez@hotmail.com",
      kycStatus: "REJECTED",
      joinedDate: "15 Nov 2025",
      totalInvested: 0,
    },
  ];

  // Función para etiquetar el estado del KYC
  const getKycBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border bg-green-500/10 text-green-500 border-green-500/20'>
            <ShieldCheck size={12} /> Verificado
          </span>
        );
      case "PENDING":
        return (
          <span className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border bg-orange-500/10 text-orange-500 border-orange-500/20 animate-pulse'>
            <Clock size={12} /> Pendiente
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
          <button className='px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:border-gray-600 transition-all'>
            Pendientes (1)
          </button>
          <button className='px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:border-gray-600 transition-all'>
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
          className='w-full bg-[#1A1A1A] border border-gray-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#FF4400] transition-colors placeholder:text-gray-600'
        />
      </div>

      {/* 3. Tabla de Inversores */}
      <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden'>
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
              <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right'>
                Inversión Total
              </th>
              <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center'>
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-800'>
            {investors.map((user) => (
              <tr key={user.id} className='hover:bg-white/5 transition-colors'>
                {/* Usuario Info */}
                <td className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400'>
                      <User size={14} />
                    </div>
                    <div>
                      <p className='font-bold text-white text-sm'>
                        {user.name}
                      </p>
                      <p className='text-gray-500 text-xs'>{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Estado KYC */}
                <td className='p-4'>{getKycBadge(user.kycStatus)}</td>

                {/* Fecha */}
                <td className='p-4 text-sm text-gray-400'>{user.joinedDate}</td>

                {/* Inversión */}
                <td className='p-4 text-right text-sm font-medium text-white'>
                  $ {user.totalInvested.toLocaleString()}
                </td>

                {/* Botón Ver Detalle */}
                <td className='p-4 text-center'>
                  <Link
                    href={`/dashboard/investors/${user.id}`}
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
      </div>
    </div>
  );
}
