"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

interface ProjectActionsMenuProps {
  projectId: string;
  onDelete: () => void;
  canDelete: boolean;
}

export default function ProjectActionsMenu({
  projectId,
  onDelete,
  canDelete,
}: ProjectActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-all"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 bg-[#1A1A1A] border border-gray-800 rounded-xl shadow-xl overflow-hidden">
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-3"
          >
            <Eye size={16} />
            Ver Detalles
          </Link>
          <Link
            href={`/dashboard/projects/${projectId}/edit`}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-3"
          >
            <Edit size={16} />
            Editar
          </Link>
          {canDelete && (
            <button
              onClick={() => {
                setIsOpen(false);
                onDelete();
              }}
              className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-3"
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
