"use client";

import React, { useEffect, use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  Hash,
  FileText,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProjectById,
  clearCurrentProject,
} from "@/store/slices/projectsSlice";
import ProjectStatusBadge from "@/presentation/components/projects/ProjectStatusBadge";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const {
    currentProject: project,
    isLoading,
    error,
  } = useAppSelector((state) => state.projects);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, id]);

  const getImageFullUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("http")) return imageUrl;
    // Remove /api from the URL since static files are served from root
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}${imageUrl}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-[#FF4400]" size={40} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-24">
        <p className="text-red-500 mb-4">{error || "Proyecto no encontrado"}</p>
        <Link
          href="/dashboard/projects"
          className="text-[#FF4400] hover:underline"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }

  const targetAmount = project.tokenPrice * project.totalTokens;
  const raisedAmount = project.tokenPrice * project.tokensSold;
  const progressPercent =
    targetAmount > 0 ? Math.min((raisedAmount / targetAmount) * 100, 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {project.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={14} className="mr-1" />
                {project.location}
              </div>
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>
        </div>

        <Link
          href={`/dashboard/projects/${id}/edit`}
          className="bg-[#1A1A1A] border border-gray-800 hover:border-[#FF4400] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
        >
          <Edit size={16} />
          Editar
        </Link>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descripcion */}
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              Descripcion
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Galeria de Imagenes */}
          {project.images && project.images.length > 0 && (
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                Galeria ({project.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(imageUrl)}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#0A0A0A] border border-gray-800 cursor-pointer hover:border-[#FF4400] transition-all group"
                  >
                    <img
                      src={getImageFullUrl(imageUrl)}
                      alt={`${project.name} - Imagen ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progreso de Financiacion */}
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              Progreso de Financiacion
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white font-bold">
                  $ {raisedAmount.toLocaleString()}
                </span>
                <span className="text-gray-500">
                  de $ {targetAmount.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#FF4400] to-[#FF6633] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{progressPercent.toFixed(1)}% completado</span>
                <span>
                  {project.tokensSold.toLocaleString()} /{" "}
                  {project.totalTokens.toLocaleString()} tokens vendidos
                </span>
              </div>
            </div>
          </div>

          {/* Documentos (si existen) */}
          {project.documents && project.documents.length > 0 && (
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                Documentos
              </h3>
              <div className="space-y-2">
                {project.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl hover:bg-gray-900 transition-colors group"
                  >
                    <FileText size={18} className="text-gray-500" />
                    <span className="text-gray-300 text-sm flex-1 truncate">
                      Documento {index + 1}
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-gray-600 group-hover:text-[#FF4400]"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna Lateral (1/3) */}
        <div className="space-y-6">
          {/* Metricas Clave */}
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              Metricas
            </h3>

            <div className="space-y-4">
              {/* APY */}
              <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <TrendingUp size={16} />
                  APY Esperado
                </div>
                <span className="text-green-500 font-bold">
                  {project.expectedReturnMax
                    ? `${project.expectedReturn} - ${project.expectedReturnMax}%`
                    : `${project.expectedReturn}%`}
                </span>
              </div>

              {/* Precio Token */}
              <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <DollarSign size={16} />
                  Precio por Token
                </div>
                <span className="text-white font-bold">
                  $ {project.tokenPrice}
                </span>
              </div>

              {/* Total Tokens */}
              <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Hash size={16} />
                  Total Tokens
                </div>
                <span className="text-white font-bold">
                  {project.totalTokens.toLocaleString()}
                </span>
              </div>

              {/* Valor Proyecto */}
              <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <DollarSign size={16} />
                  Valor Proyecto
                </div>
                <span className="text-white font-bold">
                  $ {project.projectValue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Limites de Inversion */}
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              Limites de Inversion
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Minimo</span>
                <span className="text-white font-medium">
                  $ {project.minInvestment}
                </span>
              </div>
              {project.maxInvestment && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Maximo</span>
                  <span className="text-white font-medium">
                    $ {project.maxInvestment}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fechas */}
          {(project.startDate || project.endDate) && (
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                Cronograma
              </h3>

              <div className="space-y-3">
                {project.startDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-gray-500">Inicio:</span>
                    <span className="text-white">
                      {new Date(project.startDate).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-gray-500">Fin:</span>
                    <span className="text-white">
                      {new Date(project.endDate).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              Informacion del Sistema
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">ID</span>
                <span className="text-gray-400 font-mono truncate max-w-[150px]">
                  {project.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Slug</span>
                <span className="text-gray-400">{project.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Creado</span>
                <span className="text-gray-400">
                  {new Date(project.createdAt).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Actualizado</span>
                <span className="text-gray-400">
                  {new Date(project.updatedAt).toLocaleDateString("es-ES")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox para imagen seleccionada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-[#1A1A1A] border border-gray-800 rounded-xl text-white hover:bg-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={getImageFullUrl(selectedImage)}
            alt="Vista ampliada"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
