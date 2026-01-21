"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ProjectStatus } from "@/store/types";
import ProjectStatusBadge from "./ProjectStatusBadge";

interface ProjectStatusDropdownProps {
  currentStatus: ProjectStatus;
  onStatusChange: (status: ProjectStatus) => void;
  disabled?: boolean;
}

const allowedTransitions: Record<ProjectStatus, ProjectStatus[]> = {
  DRAFT: ["FUNDING", "CANCELLED"],
  FUNDING: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export default function ProjectStatusDropdown({
  currentStatus,
  onStatusChange,
  disabled = false,
}: ProjectStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableStatuses = allowedTransitions[currentStatus];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (availableStatuses.length === 0 || disabled) {
    return <ProjectStatusBadge status={currentStatus} />;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <ProjectStatusBadge status={currentStatus} />
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-40 bg-[#1A1A1A] border border-gray-800 rounded-xl shadow-xl overflow-hidden">
          {availableStatuses.map((status) => (
            <button
              key={status}
              onClick={() => {
                onStatusChange(status);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <ProjectStatusBadge status={status} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
