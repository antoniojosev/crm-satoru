"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/presentation/components/ui/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Protección básica de rutas
  useEffect(() => {
    const token = localStorage.getItem("satoru_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className='min-h-screen bg-[#121212] text-white flex font-sans'>
      {/* 1. Sidebar (Componente Aislado) */}
      <Sidebar />

      {/* 2. Área de Contenido Principal */}
      <main className='flex-1 ml-64 min-h-screen bg-[#121212] relative'>
        {/* Header Superior Simulado */}
        <header className='sticky top-0 z-40 bg-[#121212]/80 backdrop-blur-md border-b border-gray-900/50 px-8 py-4 flex justify-between items-center'>
          <h2 className='text-sm text-gray-400 font-medium'>
            Panel de Administración
          </h2>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center text-xs font-bold border border-gray-700 shadow-inner'>
              AD
            </div>
            <span className='text-xs font-bold text-gray-300'>Admin</span>
          </div>
        </header>

        {/* Contenido de las Páginas */}
        <div className='p-8 max-w-7xl mx-auto'>{children}</div>
      </main>
    </div>
  );
}
