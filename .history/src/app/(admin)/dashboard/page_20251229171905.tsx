"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  Building2,
  ArrowUpRight,
  DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  // Estos datos vendrán del endpoint /dashboard/stats más adelante.
  // Por ahora los dejamos fijos (hardcoded) para maquetar la Fase 1.
  const stats = [
    {
      label: "Capital Recaudado",
      value: "$ 450,000",
      subtext: "+12.5% este mes",
      icon: DollarSign,
      color: "text-green-500",
      trend: "up",
    },
    {
      label: "Inversores Activos",
      value: "1,240",
      subtext: "+18 nuevos hoy",
      icon: Users,
      color: "text-orange-500",
      trend: "up",
    },
    {
      label: "Proyectos en Curso",
      value: "8",
      subtext: "2 finalizan pronto",
      icon: Building2,
      color: "text-blue-500",
      trend: "neutral",
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
          <p className='text-sm text-gray-400'>Hoy, 16:45 PM</p>
        </div>
      </div>

      {/* 2. Tarjetas de Estadísticas (Stats Cards) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className='bg-[#1A1A1A] border border-gray-800 p-6 rounded-2xl hover:border-orange-500/30 transition-all group relative overflow-hidden'
            >
              {/* Efecto de brillo naranja en hover */}
              <div className='absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-all'></div>

              <div className='flex justify-between items-start mb-4 relative z-10'>
                <div
                  className={`p-3 rounded-xl bg-gray-900 border border-gray-800 group-hover:border-gray-700 transition-colors`}
                >
                  <Icon size={24} className={stat.color} />
                </div>
                {stat.trend === "up" && (
                  <span className='flex items-center text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full'>
                    <TrendingUp size={12} className='mr-1' /> {stat.subtext}
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

      {/* 3. Sección de Actividad Reciente (Placeholder) */}
      <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]'>
        <div className='w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-700'>
          <TrendingUp size={32} />
        </div>
        <h3 className='text-xl font-bold text-white mb-2'>
          Sin actividad reciente
        </h3>
        <p className='text-gray-500 max-w-sm mb-6 text-sm'>
          Aún no se han registrado nuevas inversiones o movimientos importantes
          en la plataforma el día de hoy.
        </p>
        <button className='px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors border border-gray-700'>
          Ver reporte detallado
        </button>
      </div>
    </div>
  );
}
