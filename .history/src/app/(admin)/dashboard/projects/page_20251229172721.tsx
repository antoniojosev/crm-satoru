"use client";

import React from "react";
import Link from "next/link";
import { Plus, Search, MapPin, MoreVertical, TrendingUp } from "lucide-react";

export default function ProjectsPage() {
  // Datos Mock (Simulados) basados en tus capturas para visualizar el diseño
  const projects = [
    {
      id: 1,
      name: "Skyline Tower Residences",
      location: "Miami, FL",
      apy: "12 - 15%",
      raised: 1625000,
      target: 2500000,
      status: "En Venta",
      image: "/placeholder-building.jpg", // No te preocupes por la imagen ahora
    },
    {
      id: 2,
      name: "Logistics Hub Alpha",
      location: "Orlando, FL",
      apy: "14.2%",
      raised: 450000,
      target: 1000000,
      status: "Activo",
      image: "/placeholder-warehouse.jpg",
    },
    {
      id: 3,
      name: "Lakeside Apartments",
      location: "Austin, TX",
      apy: "10 - 13%",
      raised: 0,
      target: 3200000,
      status: "Borrador",
      image: "/placeholder-lake.jpg",
    },
  ];

  // Función para elegir el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "En Venta":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Activo":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-700/30 text-gray-400 border-gray-700/50";
    }
  };

  return (
    <div className='space-y-6'>
      {/* 1. Encabezado + Botón Crear */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-white tracking-tight'>
            Proyectos Inmobiliarios
          </h1>
          <p className='text-gray-500 text-sm mt-1'>
            Gestiona el catálogo de inversiones disponibles.
          </p>
        </div>

        <Link
          href='/dashboard/projects/create'
          className='bg-[#FF4400] hover:bg-[#CC3300] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-95'
        >
          <Plus size={18} />
          Nuevo Proyecto
        </Link>
      </div>

      {/* 2. Barra de Filtros y Búsqueda */}
      <div className='flex gap-3'>
        <div className='relative flex-1 max-w-md'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
            size={18}
          />
          <input
            type='text'
            placeholder='Buscar por nombre o ubicación...'
            className='w-full bg-[#1A1A1A] border border-gray-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#FF4400] transition-colors placeholder:text-gray-600'
          />
        </div>
        {/* Aquí podrías agregar más filtros (Dropdowns) */}
      </div>

      {/* 3. Tabla de Proyectos */}
      <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden'>
        <table className='w-full text-left'>
          {/* Header de la Tabla */}
          <thead>
            <tr className='border-b border-gray-800 bg-gray-900/50'>
              <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest'>
                Proyecto
              </th>
              <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest'>
                Estado
              </th>
              <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest'>
                Progreso
              </th>
              <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right'>
                APY Est.
              </th>
              <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center'>
                Acciones
              </th>
            </tr>
          </thead>

          {/* Cuerpo de la Tabla */}
          <tbody className='divide-y divide-gray-800'>
            {projects.map((project) => (
              <tr
                key={project.id}
                className='hover:bg-white/5 transition-colors group'
              >
                {/* Columna Nombre + Ubicación */}
                <td className='p-4'>
                  <div className='flex flex-col'>
                    <span className='font-bold text-white text-sm'>
                      {project.name}
                    </span>
                    <div className='flex items-center text-gray-500 text-xs mt-1'>
                      <MapPin size={12} className='mr-1' />
                      {project.location}
                    </div>
                  </div>
                </td>

                {/* Columna Estado (Badge) */}
                <td className='p-4'>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </td>

                {/* Columna Barra de Progreso */}
                <td className='p-4 w-1/4'>
                  <div className='flex justify-between text-[10px] mb-1 font-medium'>
                    <span className='text-gray-300'>
                      $ {(project.raised / 1000).toFixed(0)}k
                    </span>
                    <span className='text-gray-500'>
                      de $ {(project.target / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className='w-full bg-gray-800 rounded-full h-1.5 overflow-hidden'>
                    <div
                      className='bg-[#FF4400] h-full rounded-full transition-all duration-500'
                      style={{
                        width: `${(project.raised / project.target) * 100}%`,
                      }}
                    ></div>
                  </div>
                </td>

                {/* Columna APY */}
                <td className='p-4 text-right'>
                  <div className='flex items-center justify-end text-green-500 font-bold text-sm'>
                    <TrendingUp size={14} className='mr-1' />
                    {project.apy}
                  </div>
                </td>

                {/* Columna Acciones */}
                <td className='p-4 text-center'>
                  <button className='text-gray-500 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-all'>
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mensaje si no hay datos (Visual) */}
        {projects.length === 0 && (
          <div className='p-8 text-center text-gray-500 text-sm'>
            No hay proyectos cargados aún.
          </div>
        )}
      </div>
    </div>
  );
}
