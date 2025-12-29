"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  LayoutDashboard,
} from "lucide-react";
import { AuthRepositoryImpl } from "@/core/data/repositories/AuthRepositoryImpl";
import { LoginCredentials } from "@/core/data/dtos/LoginDTO";

// Instanciamos el repositorio (Clean Architecture)
const authRepo = new AuthRepositoryImpl();

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: LoginCredentials) => {
    setLoginError(null);
    try {
      // 1. Llamamos a la lógica de negocio
      await authRepo.login(data);

      // 2. Si sale bien, redirigimos al dashboard
      router.push("/dashboard/projects");
    } catch (error) {
      console.error(error);
      setLoginError("Credenciales inválidas. Por favor intenta de nuevo.");
    }
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      {/* Contenedor Principal (Card) */}
      <div className='w-full max-w-md bg-surface border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden'>
        {/* Efecto de luz superior (opcional para darle toque "premium") */}
        <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50'></div>

        {/* Header: Logo y Título */}
        <div className='text-center mb-10'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4'>
            <LayoutDashboard size={32} />
          </div>
          <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
            Bienvenido
          </h1>
          <p className='text-text-muted text-sm'>
            Accede al panel administrativo de Satoru
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Input Email */}
          <div className='space-y-2'>
            <label className='text-xs font-semibold text-text-muted uppercase tracking-wider ml-1'>
              Email
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors'>
                <Mail size={20} />
              </div>
              <input
                {...register("email", { required: "El email es requerido" })}
                type='email'
                placeholder='usuario@satoru.app'
                className='w-full bg-[#121212] border border-gray-800 text-white text-sm rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600'
              />
            </div>
            {errors.email && (
              <span className='text-red-500 text-xs ml-1'>
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Input Password */}
          <div className='space-y-2'>
            <label className='text-xs font-semibold text-text-muted uppercase tracking-wider ml-1'>
              Contraseña
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors'>
                <Lock size={20} />
              </div>
              <input
                {...register("password", {
                  required: "La contraseña es requerida",
                })}
                type={showPassword ? "text" : "password"}
                placeholder='••••••••'
                className='w-full bg-[#121212] border border-gray-800 text-white text-sm rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className='text-red-500 text-xs ml-1'>
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Error Message */}
          {loginError && (
            <div className='p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center'>
              {loginError}
            </div>
          )}

          {/* Botón Ingresar */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-gradient-to-r from-[#FF5500] to-[#CC4400] hover:from-[#FF6600] hover:to-[#DD5500] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' />
            ) : (
              <>
                INGRESAR <ArrowRight size={20} />
              </>
            )}
          </button>

          {/* Footer */}
          <div className='text-center mt-6'>
            <a
              href='#'
              className='text-sm text-text-muted hover:text-white transition-colors'
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
