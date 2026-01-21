"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, MapPin, TrendingUp, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProjects,
  deleteProject,
  updateProjectStatus,
  setStatusFilter,
  setSearchFilter,
} from "@/store/slices/projectsSlice";
import { ProjectStatus } from "@/store/types";
import ProjectStatusDropdown from "@/presentation/components/projects/ProjectStatusDropdown";
import ProjectActionsMenu from "@/presentation/components/projects/ProjectActionsMenu";
import DeleteConfirmModal from "@/presentation/components/ui/DeleteConfirmModal";

const STATUS_TABS: { label: string; value: ProjectStatus | null }[] = [
  { label: "Todos", value: null },
  { label: "Borrador", value: "DRAFT" },
  { label: "En Venta", value: "FUNDING" },
  { label: "Activo", value: "ACTIVE" },
  { label: "Completado", value: "COMPLETED" },
  { label: "Cancelado", value: "CANCELLED" },
];

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, isLoading, error, filters } = useAppSelector(
    (state) => state.projects
  );
  const { user } = useAppSelector((state) => state.auth);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    dispatch(fetchProjects(filters.status ?? undefined));
  }, [dispatch, filters.status]);

  const filteredProjects = useMemo(() => {
    if (!filters.search) return projects;
    const searchLower = filters.search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.location.toLowerCase().includes(searchLower)
    );
  }, [projects, filters.search]);

  const handleStatusChange = async (
    projectId: string,
    newStatus: ProjectStatus
  ) => {
    await dispatch(updateProjectStatus({ id: projectId, status: newStatus }));
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    await dispatch(deleteProject(projectToDelete));
    setIsDeleting(false);
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const getProgress = (raised: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((raised / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Proyectos Inmobiliarios
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona el catalogo de inversiones disponibles.
          </p>
        </div>

        <Link
          href="/dashboard/projects/create"
          className="bg-[#FF4400] hover:bg-[#CC3300] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          Nuevo Proyecto
        </Link>
      </div>

      {/* Filtros por Estado (Tabs) */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => dispatch(setStatusFilter(tab.value))}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filters.status === tab.value
                ? "bg-[#FF4400] text-white"
                : "bg-[#1A1A1A] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Barra de Busqueda */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o ubicacion..."
            value={filters.search}
            onChange={(e) => dispatch(setSearchFilter(e.target.value))}
            className="w-full bg-[#1A1A1A] border border-gray-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#FF4400] transition-colors placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-[#FF4400]" size={32} />
        </div>
      ) : (
        /* Tabla de Proyectos */
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Proyecto
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Estado
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Progreso
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                  APY Est.
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {filteredProjects.map((project) => {
                const targetAmount = project.tokenPrice * project.totalTokens;
                const raisedAmount = project.tokenPrice * project.tokensSold;
                const progress = getProgress(raisedAmount, targetAmount);

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    {/* Nombre + Ubicacion */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">
                          {project.name}
                        </span>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <MapPin size={12} className="mr-1" />
                          {project.location}
                        </div>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="p-4">
                      <ProjectStatusDropdown
                        currentStatus={project.status}
                        onStatusChange={(status) =>
                          handleStatusChange(project.id, status)
                        }
                      />
                    </td>

                    {/* Progreso */}
                    <td className="p-4 w-1/4">
                      <div className="flex justify-between text-[10px] mb-1 font-medium">
                        <span className="text-gray-300">
                          $ {(raisedAmount / 1000).toFixed(0)}k
                        </span>
                        <span className="text-gray-500">
                          de $ {(targetAmount / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#FF4400] h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </td>

                    {/* APY */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end text-green-500 font-bold text-sm">
                        <TrendingUp size={14} className="mr-1" />
                        {project.expectedReturnMax
                          ? `${project.expectedReturn} - ${project.expectedReturnMax}%`
                          : `${project.expectedReturn}%`}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="p-4 text-center">
                      <ProjectActionsMenu
                        projectId={project.id}
                        onDelete={() => handleDeleteClick(project.id)}
                        canDelete={isSuperAdmin}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProjects.length === 0 && !isLoading && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No hay proyectos que mostrar.
            </div>
          )}
        </div>
      )}

      {/* Modal de Confirmacion de Eliminacion */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Eliminar Proyecto"
        message="Esta accion no se puede deshacer. El proyecto sera eliminado permanentemente del sistema."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}
