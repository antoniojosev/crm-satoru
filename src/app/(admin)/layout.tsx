"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkAuth, logout } from "@/store/slices/authSlice";
import Sidebar from "@/presentation/components/ui/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isCheckingAuth } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isCheckingAuth, isAuthenticated, router]);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FF4400]" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const userInitials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const userName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.email || "Usuario";

  return (
    <div className="min-h-screen bg-[#121212] text-white flex font-sans">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 ml-64 min-h-screen bg-[#121212] relative">
        <header className="sticky top-0 z-40 bg-[#121212]/80 backdrop-blur-md border-b border-gray-900/50 px-8 py-4 flex justify-between items-center">
          <h2 className="text-sm text-gray-400 font-medium">
            Panel de Administracion
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF4400] to-[#CC3300] flex items-center justify-center text-xs font-bold border border-orange-500/20 shadow-inner">
              {userInitials}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-300">
                {userName}
              </span>
              <span className="text-[10px] text-gray-500 uppercase">
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
