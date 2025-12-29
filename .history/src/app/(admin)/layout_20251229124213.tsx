"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut, Building2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Protección básica de rutas: Si no hay token, chau.
  useEffect(() => {
    const token = localStorage.getItem("satoru_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("satoru_token");
    localStorage.removeItem("satoru_user");
    router.push("/login");
  };

  return (
    <div className='flex h-screen bg-background text-text-main'>
      {/* SIDEBAR LATERAL */}
      <aside className='w-64 bg-surface border-r border-gray-800 flex flex-col'>
        {/* Logo Area */}
        <div className='h-16 flex items-center px-6 border-b border-gray-800'>
          <div className='w-8 h-8 bg-primary rounded-lg mr-3 flex items-center justify-center font-bold text-white'>
            S
          </div>
          <span className='font-bold text-lg tracking-wide'>SATORU</span>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 space-y-2'>
          <p className='text-xs text-gray-500 font-semibold uppercase px-2 mb-2'>
            Menu
          </p>

          <Link
            href='/dashboard/projects'
            className='flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors'
          >
            <Building2 size={20} />
            <span>Proyectos</span>
          </Link>

          <Link
            href='/dashboard/investors'
            className='flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors'
          >
            <Users size={20} />
            <span>Inversores</span>
          </Link>
        </nav>

        {/* Footer Sidebar */}
        <div className='p-4 border-t border-gray-800'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 px-3 py-2 w-full text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL (Aquí se renderizarán tus Pages) */}
      <main className='flex-1 overflow-y-auto bg-background p-8'>
        {children}
      </main>
    </div>
  );
}
