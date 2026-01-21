"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, LogOut } from "lucide-react";

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Proyectos", path: "/dashboard/projects", icon: Building2 },
    { name: "Inversores", path: "/dashboard/investors", icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-gray-900 h-screen fixed left-0 top-0 text-white flex flex-col z-50">
      {/* Logo Satoru */}
      <div className="p-8 border-b border-gray-900/50 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#FF4400] to-[#AA3300] rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/40">
          <span className="text-white font-bold text-lg italic">S</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter italic">ssatoru</h1>
          <p className="text-[9px] text-gray-500 tracking-[0.2em] uppercase">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Menu de Navegacion */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-[#FF4400]/10 text-[#FF4400] border border-[#FF4400]/20"
                  : "text-gray-500 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "text-[#FF4400]"
                    : "text-gray-500 group-hover:text-white transition-colors"
                }
              />
              <span className="text-sm font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-900/50">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Cerrar Sesion</span>
        </button>
      </div>
    </aside>
  );
}
