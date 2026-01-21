import { ProjectStatus } from "@/store/types";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const statusConfig: Record<ProjectStatus, { label: string; classes: string }> = {
  DRAFT: {
    label: "Borrador",
    classes: "bg-gray-700/30 text-gray-400 border-gray-700/50",
  },
  FUNDING: {
    label: "En Venta",
    classes: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  ACTIVE: {
    label: "Activo",
    classes: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  COMPLETED: {
    label: "Completado",
    classes: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  CANCELLED: {
    label: "Cancelado",
    classes: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export default function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
