"use client";

import React, { useEffect, use, useState } from "react";
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
  Calendar,
  Hash,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProjectById,
  updateProject,
  clearCurrentProject,
  clearError,
} from "@/store/slices/projectsSlice";
import type { UpdateProjectDto } from "@/store/types";
import ImageUpload from "@/presentation/components/projects/ImageUpload";

interface ProjectFormData {
  name: string;
  description: string;
  location: string;
  tokenPrice: number;
  totalTokens: number;
  minInvestment: number;
  maxInvestment?: number;
  expectedReturn: number;
  expectedReturnMax?: number;
  projectValue: number;
  startDate?: string;
  endDate?: string;
}

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    currentProject: project,
    isLoading,
    error,
  } = useAppSelector((state) => state.projects);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>();

  const tokenPrice = watch("tokenPrice");
  const totalTokens = watch("totalTokens");
  const targetAmount = (tokenPrice || 0) * (totalTokens || 0);
  const [projectImages, setProjectImages] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    return () => {
      dispatch(clearCurrentProject());
      dispatch(clearError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        location: project.location,
        tokenPrice: project.tokenPrice,
        totalTokens: project.totalTokens,
        minInvestment: project.minInvestment,
        maxInvestment: project.maxInvestment,
        expectedReturn: project.expectedReturn,
        expectedReturnMax: project.expectedReturnMax,
        projectValue: project.projectValue,
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : undefined,
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : undefined,
      });
      setProjectImages(project.images || []);
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    const updateDto: UpdateProjectDto = {
      name: data.name,
      description: data.description,
      location: data.location,
      targetAmount,
      tokenPrice: Number(data.tokenPrice),
      totalTokens: Number(data.totalTokens),
      minInvestment: Number(data.minInvestment),
      maxInvestment: data.maxInvestment ? Number(data.maxInvestment) : undefined,
      expectedReturn: Number(data.expectedReturn),
      expectedReturnMax: data.expectedReturnMax
        ? Number(data.expectedReturnMax)
        : undefined,
      projectValue: Number(data.projectValue),
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    };

    const result = await dispatch(updateProject({ id, data: updateDto }));
    if (updateProject.fulfilled.match(result)) {
      router.push(`/dashboard/projects/${id}`);
    }
  };

  if (isLoading && !project) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-[#FF4400]" size={40} />
      </div>
    );
  }

  if (!project && !isLoading) {
    return (
      <div className="text-center py-24">
        <p className="text-red-500 mb-4">Proyecto no encontrado</p>
        <Link
          href="/dashboard/projects"
          className="text-[#FF4400] hover:underline"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/dashboard/projects/${id}`}
          className="p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Editar Proyecto
          </h1>
          <p className="text-gray-500 text-sm">{project?.name}</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Seccion: Informacion General */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
            Informacion General
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Nombre del Proyecto *
              </label>
              <div className="relative group">
                <Building2
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                  size={18}
                />
                <input
                  {...register("name", { required: "El nombre es obligatorio" })}
                  type="text"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
              {errors.name && (
                <span className="text-red-500 text-xs">{errors.name.message}</span>
              )}
            </div>

            {/* Ubicacion */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Ubicacion *
              </label>
              <div className="relative group">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                  size={18}
                />
                <input
                  {...register("location", {
                    required: "La ubicacion es obligatoria",
                  })}
                  type="text"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>

            <div></div>

            {/* Descripcion */}
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Descripcion *
              </label>
              <textarea
                {...register("description", {
                  required: "La descripcion es obligatoria",
                })}
                rows={4}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-[#FF4400] outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Seccion: Tokenizacion */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
            Tokenizacion
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Precio por Token (USD) *
              </label>
              <div className="relative group">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  {...register("tokenPrice", { required: true, min: 1 })}
                  type="number"
                  step="0.01"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Total de Tokens *
              </label>
              <div className="relative group">
                <Hash
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  {...register("totalTokens", { required: true, min: 1 })}
                  type="number"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Meta de Financiacion
              </label>
              <div className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-[#FF4400] text-sm font-bold">
                $ {targetAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Seccion: Inversiones y Rendimiento */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
            Inversiones y Rendimiento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Inversion Minima (USD) *
              </label>
              <div className="relative group">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  {...register("minInvestment", { required: true, min: 1 })}
                  type="number"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Inversion Maxima (USD)
              </label>
              <div className="relative group">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  {...register("maxInvestment")}
                  type="number"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Valor del Proyecto (USD) *
              </label>
              <div className="relative group">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  {...register("projectValue", { required: true, min: 1 })}
                  type="number"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>

            <div></div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                APY Minimo (%) *
              </label>
              <div className="relative group">
                <Percent
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  {...register("expectedReturn", {
                    required: true,
                    min: 0,
                    max: 100,
                  })}
                  type="number"
                  step="0.1"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                APY Maximo (%)
              </label>
              <div className="relative group">
                <Percent
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  {...register("expectedReturnMax", { min: 0, max: 100 })}
                  type="number"
                  step="0.1"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seccion: Fechas */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
            Cronograma
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Fecha de Inicio
              </label>
              <div className="relative group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  {...register("startDate")}
                  type="date"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Fecha de Finalizacion
              </label>
              <div className="relative group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  {...register("endDate")}
                  type="date"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seccion: Imagenes */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
            Imagenes del Proyecto
          </h3>
          <ImageUpload
            projectId={id}
            images={projectImages}
            onImagesChange={setProjectImages}
            maxImages={10}
          />
        </div>

        {/* Botones de Accion */}
        <div className="flex justify-end gap-4 pt-4">
          <Link
            href={`/dashboard/projects/${id}`}
            className="px-6 py-3 rounded-xl border border-gray-800 text-gray-400 font-bold text-sm hover:text-white hover:bg-gray-800 transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className="px-8 py-3 bg-[#FF4400] hover:bg-[#CC3300] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Save size={18} /> Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
