"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  DollarSign,
  Percent,
  Loader2,
} from "lucide-react";

// Definimos los tipos de datos que esperamos (basado en lo que se ve en las cards)
interface CreateProjectForm {
  name: string;
  location: string;
  description: string;
  targetAmount: number;
  minInvestment: number;
  apy: string; // Ej: "12-15%"
  imageUrl: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectForm>();

  // Simulamos el envío a la API
  const onSubmit = async (data: CreateProjectForm) => {
    console.log("Datos a enviar al backend:", data);
    // Aquí llamaremos a projectRepo.create(data) más adelante

    // Simulamos delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/dashboard/projects");
  };

  return (
    <div className='max-w-3xl mx-auto'>
      {/* Header con botón volver */}
      <div className='flex items-center gap-4 mb-8'>
        <Link
          href='/dashboard/projects'
          className='p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors'
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className='text-2xl font-bold text-white tracking-tight'>
            Nuevo Proyecto
          </h1>
          <p className='text-gray-500 text-sm'>
            Carga los detalles de una nueva oportunidad de inversión.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Sección: Información Principal */}
        <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6'>
          <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4'>
            Información General
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Nombre */}
            <div className='space-y-2 col-span-2'>
              <label className='text-xs font-bold text-gray-400 uppercase'>
                Nombre del Proyecto
              </label>
              <div className='relative group'>
                <Building2
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]'
                  size={18}
                />
                <input
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  type='text'
                  placeholder='Ej: Torre Futura Center'
                  className='w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700'
                />
              </div>
              {errors.name && (
                <span className='text-red-500 text-[10px]'>
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Ubicación */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-gray-400 uppercase'>
                Ubicación
              </label>
              <div className='relative group'>
                <MapPin
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]'
                  size={18}
                />
                <input
                  {...register("location", {
                    required: "La ubicación es obligatoria",
                  })}
                  type='text'
                  placeholder='Ej: Miami, FL'
                  className='w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700'
                />
              </div>
            </div>

            {/* APY Estimado */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-gray-400 uppercase'>
                Rendimiento (APY)
              </label>
              <div className='relative group'>
                <Percent
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]'
                  size={18}
                />
                <input
                  {...register("apy", { required: "El APY es obligatorio" })}
                  type='text'
                  placeholder='Ej: 12 - 15%'
                  className='w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700'
                />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className='space-y-2'>
            <label className='text-xs font-bold text-gray-400 uppercase'>
              Descripción Corta
            </label>
            <textarea
              {...register("description", {
                required: "La descripción es obligatoria",
              })}
              rows={3}
              placeholder='Desarrollo residencial de lujo en el distrito financiero...'
              className='w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700 resize-none'
            ></textarea>
          </div>
        </div>

        {/* Sección: Metas Financieras */}
        <div className='bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6'>
          <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4'>
            Metas de Financiación
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Meta Total */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-gray-400 uppercase'>
                Meta Total (USD)
              </label>
              <div className='relative group'>
                <DollarSign
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]'
                  size={18}
                />
                <input
                  {...register("targetAmount", { required: true, min: 1 })}
                  type='number'
                  placeholder='2500000'
                  className='w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700'
                />
              </div>
            </div>

            {/* Mínimo Inversión */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-gray-400 uppercase'>
                Inversión Mínima (USD)
              </label>
              <div className='relative group'>
                <DollarSign
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]'
                  size={18}
                />
                <input
                  {...register("minInvestment", { required: true, min: 50 })}
                  type='number'
                  placeholder='50'
                  className='w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className='flex justify-end gap-4 pt-4'>
          <Link
            href='/dashboard/projects'
            className='px-6 py-3 rounded-xl border border-gray-800 text-gray-400 font-bold text-sm hover:text-white hover:bg-gray-800 transition-all'
          >
            Cancelar
          </Link>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-8 py-3 bg-[#FF4400] hover:bg-[#CC3300] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-all disabled:opacity-50'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' size={18} />
            ) : (
              <>
                <Save size={18} /> Guardar Proyecto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
