"use client";

import React, { useEffect } from "react";
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDashboardStats } from "@/store/slices/dashboardSlice";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { stats, isLoading, error, lastUpdated } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
            <h3 className='text-red-500 font-bold mb-1'>
              Error al cargar estadísticas
            </h3>
            <p className='text-red-400 text-sm'>{error}</p>
            <button
              onClick={() => dispatch(fetchDashboardStats())}
              className='mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors'
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <AlertCircle className='text-gray-600 mx-auto mb-4' size={48} />
          <p className='text-gray-500'>No hay estadísticas disponibles</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: "Capital Recaudado",
      value: formatCurrency(stats.totalRaised),
      count: stats.totalRaised,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Total de Inversores",
      value: stats.totalInvestors.toString(),
      count: stats.activeInvestors,
      subtext: `${stats.activeInvestors} activos`,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Proyectos",
      value: stats.totalProjects.toString(),
      count: stats.activeProjects,
      subtext: `${stats.activeProjects} activos`,
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "KYC Pendientes",
      value: stats.pendingKyc.toString(),
      count: stats.pendingKyc,
      icon: ShieldCheck,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div className='space-y-8'>
      {/* 1. Encabezado de Bienvenida */}
      <div className='flex justify-between items-end'>
        <div>
          <h1 className='text-3xl font-bold text-white tracking-tight'>
            Resumen General
          </h1>
          <p className='text-gray-500 mt-1 text-sm'>
            Bienvenido al panel de control de Satoru.
          </p>
        </div>
        <div className='text-right hidden sm:block'>
          <p className='text-xs text-gray-600 uppercase tracking-widest font-semibold'>
            Última actualización
          </p>
          <p className='text-sm text-gray-400'>{formatDate(lastUpdated)}</p>
        </div>
      </div>

      {/* 2. Tarjetas de Estadísticas (Stats Cards) */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className='bg-[#1A1A1A] border border-gray-800 p-6 rounded-2xl hover:border-orange-500/30 transition-all group relative overflow-hidden'
            >
              {/* Efecto de brillo naranja en hover */}
              <div className='absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-all'></div>

              <div className='flex justify-between items-start mb-4 relative z-10'>
                <div className='p-3 rounded-xl bg-gray-900 border border-gray-800 group-hover:border-gray-700 transition-colors'>
                  <Icon size={24} className={stat.color} />
                </div>
                {stat.subtext && (
                  <span className='flex items-center text-[10px] font-bold text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full'>
                    {stat.subtext}
                  </span>
                )}
              </div>

              <div className='relative z-10'>
                <h3 className='text-gray-500 text-xs font-bold uppercase tracking-widest mb-1'>
                  {stat.label}
                </h3>
                <p className='text-3xl font-bold text-white tracking-tight'>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Sección de Estadísticas Adicionales */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Total Invertido */}
        <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-3 rounded-xl bg-gray-900 border border-gray-800'>
              <TrendingUp className='text-green-500' size={24} />
            </div>
            <div>
              <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest'>
                Total Invertido
              </h3>
              <p className='text-2xl font-bold text-white'>
                {formatCurrency(stats.totalInvested)}
              </p>
            </div>
          </div>
          <div className='pt-4 border-t border-gray-800'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Capital Recaudado</span>
              <span className='text-white font-medium'>
                {formatCurrency(stats.totalRaised)}
              </span>
            </div>
          </div>
        </div>

        {/* KYC y Estado */}
        <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-3 rounded-xl bg-gray-900 border border-gray-800'>
              <Clock className='text-yellow-500' size={24} />
            </div>
            <div>
              <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest'>
                Estado del Sistema
              </h3>
              <p className='text-2xl font-bold text-white'>
                {stats.pendingKyc} Pendientes
              </p>
            </div>
          </div>
          <div className='pt-4 border-t border-gray-800 space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Inversores Activos</span>
              <span className='text-green-400 font-medium'>
                {stats.activeInvestors}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Proyectos Activos</span>
              <span className='text-blue-400 font-medium'>
                {stats.activeProjects}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Botón de actualización */}
      <div className='flex justify-center'>
        <button
          onClick={() => dispatch(fetchDashboardStats())}
          className='px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors border border-gray-700 flex items-center gap-2'
        >
          <TrendingUp size={16} />
          Actualizar estadísticas
        </button>
      </div>
    </div>
  );
}
