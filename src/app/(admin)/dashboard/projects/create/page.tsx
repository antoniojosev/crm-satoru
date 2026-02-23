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
  Calendar,
  Hash,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createProject, clearError } from "@/store/slices/projectsSlice";
import type { CreateProjectDto, ProjectStatus } from "@/store/types";
import ImageUploadLocal from "@/presentation/components/projects/ImageUploadLocal";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

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
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.projects);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      status: "DRAFT",
      tokenPrice: 100,
      totalTokens: 1000,
      minInvestment: 50,
      expectedReturn: 12,
    },
  });

  const tokenPrice = watch("tokenPrice");
  const totalTokens = watch("totalTokens");
  const targetAmount = (tokenPrice || 0) * (totalTokens || 0);

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const uploadImages = async (projectId: string) => {
    if (selectedImages.length === 0) return;

    setUploadingImages(true);

    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      setUploadProgress(`Subiendo imagen ${i + 1} de ${selectedImages.length}...`);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const token = localStorage.getItem("satoru_admin_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
        await fetch(
          `${apiUrl}/projects/${projectId}/images/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
      } catch (error) {
        console.error(`Error uploading image ${i + 1}:`, error);
      }
    }

    setUploadingImages(false);
    setUploadProgress("");
  };

  const onSubmit = async (data: ProjectFormData) => {
    const slug = generateSlug(data.name);

    const createDto: CreateProjectDto = {
      name: data.name,
      slug,
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
      status: data.status,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    };

    const result = await dispatch(createProject(createDto));
    if (createProject.fulfilled.match(result)) {
      const createdProject = result.payload;

      // Upload images if any were selected
      if (selectedImages.length > 0) {
        await uploadImages(createdProject.id);
      }

      router.push("/dashboard/projects");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/projects"
          className="p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Nuevo Proyecto
          </h1>
          <p className="text-gray-500 text-sm">
            Carga los detalles de una nueva oportunidad de inversion.
          </p>
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
                  placeholder="Ej: Torre Futura Center"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
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
                  placeholder="Ej: Miami, FL"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
                />
              </div>
              {errors.location && (
                <span className="text-red-500 text-xs">
                  {errors.location.message}
                </span>
              )}
            </div>

            {/* Estado Inicial */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Estado Inicial
              </label>
              <select
                {...register("status")}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
              >
                <option value="DRAFT">Borrador</option>
                <option value="FUNDING">En Venta</option>
              </select>
            </div>

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
                placeholder="Desarrollo residencial de lujo en el distrito financiero..."
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700 resize-none"
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seccion: Tokenizacion */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
            Tokenizacion
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Precio por Token */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Precio por Token (USD) *
              </label>
              <div className="relative group">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                  size={18}
                />
                <input
                  {...register("tokenPrice", { required: true, min: 1 })}
                  type="number"
                  step="0.01"
                  placeholder="100"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Total de Tokens */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Total de Tokens *
              </label>
              <div className="relative group">
                <Hash
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                  size={18}
                />
                <input
                  {...register("totalTokens", { required: true, min: 1 })}
                  type="number"
                  placeholder="50000"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Meta Calculada (Solo Lectura) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Meta de Financiacion
              </label>
              <div className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-[#FF4400] text-sm font-bold">
                $ {targetAmount.toLocaleString()}
              </div>
              <p className="text-[10px] text-gray-600">= Precio x Tokens</p>
            </div>
          </div>
        </div>

        {/* Seccion: Inversiones */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
            Limites de Inversion
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inversion Minima */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Inversion Minima (USD) *
              </label>
              <div className="relative group">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                  size={18}
                />
                <input
                  {...register("minInvestment", { required: true, min: 1 })}
                  type="number"
                  placeholder="50"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Inversion Maxima */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Inversion Maxima (USD)
              </label>
              <div className="relative group">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                  size={18}
                />
                <input
                  {...register("maxInvestment")}
                  type="number"
                  placeholder="10000 (opcional)"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Valor del Proyecto */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Valor del Proyecto (USD) *
              </label>
              <div className="relative group">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                  size={18}
                />
                <input
                  {...register("projectValue", { required: true, min: 1 })}
                  type="number"
                  placeholder="2500000"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seccion: Rendimiento */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
            Rendimiento Esperado
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rendimiento Minimo */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                APY Minimo (%) *
              </label>
              <div className="relative group">
                <Percent
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
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
                  placeholder="12"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Rendimiento Maximo */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                APY Maximo (%)
              </label>
              <div className="relative group">
                <Percent
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                  size={18}
                />
                <input
                  {...register("expectedReturnMax", { min: 0, max: 100 })}
                  type="number"
                  step="0.1"
                  placeholder="15 (opcional)"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all placeholder:text-gray-700"
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
            {/* Fecha Inicio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Fecha de Inicio
              </label>
              <div className="relative group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
                  size={18}
                />
                <input
                  {...register("startDate")}
                  type="date"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-12 text-white text-sm focus:border-[#FF4400] outline-none transition-all"
                />
              </div>
            </div>

            {/* Fecha Fin */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Fecha de Finalizacion
              </label>
              <div className="relative group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF4400]"
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
            Imagenes del Proyecto (Opcional)
          </h3>
          <ImageUploadLocal
            images={selectedImages}
            onImagesChange={setSelectedImages}
            maxImages={10}
          />
        </div>

        {/* Progress Message */}
        {uploadingImages && uploadProgress && (
          <div className="bg-[#FF4400]/10 border border-[#FF4400]/20 rounded-xl p-4 text-[#FF4400] text-sm text-center">
            {uploadProgress}
          </div>
        )}

        {/* Botones de Accion */}
        <div className="flex justify-end gap-4 pt-4">
          <Link
            href="/dashboard/projects"
            className="px-6 py-3 rounded-xl border border-gray-800 text-gray-400 font-bold text-sm hover:text-white hover:bg-gray-800 transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading || uploadingImages}
            className="px-8 py-3 bg-[#FF4400] hover:bg-[#CC3300] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading || uploadingImages ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {uploadingImages ? "Subiendo imágenes..." : "Desplegando en blockchain..."}
              </>
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
