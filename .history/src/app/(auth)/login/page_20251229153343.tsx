"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { AuthRepositoryImpl } from "@/core/data/repositories/AuthRepositoryImpl";
import { LoginCredentials } from "@/core/data/dtos/LoginDTO";

const authRepo = new AuthRepositoryImpl();

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setLoginError(null);
    try {
      await authRepo.login(data);
      router.push("/dashboard/projects");
    } catch (error) {
      setLoginError("Credenciales inválidas. Por favor intenta de nuevo.");
    }
  };

  return (
    <div className='min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans text-white'>
      <div className='w-full max-w-[400px] flex flex-col items-center'>
        {/* Logo Sección - Idéntico a Captura 3 */}
        <div className='mb-10 text-center'>
          <div className='flex items-center justify-center gap-3 mb-1'>
            <div className='w-12 h-12 bg-gradient-to-br from-[#FF4400] to-[#AA3300] rounded-full flex items-center justify-center shadow-lg shadow-orange-900/40 border border-orange-400/20'>
              <span className='text-white font-bold text-2xl italic'>S</span>
            </div>
            <h1 className='text-4xl font-bold tracking-tighter italic'>
              ssatoru
            </h1>
          </div>
          <p className='text-gray-500 text-[10px] tracking-[0.2em] uppercase font-medium'>
            lo hacemos posible
          </p>
        </div>

        {/* Título de Bienvenida */}
        <div className='text-center mb-10'>
          <h2 className='text-2xl font-bold uppercase tracking-tight'>
            Bienvenido
          </h2>
          <p className='text-gray-500 text-sm mt-1 font-light'>
            Accede a tu portafolio institucional
          </p>
        </div>

        {/* Formulario con Lógica Integrada */}
        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-6'>
          {/* Email */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest'>
              Email
            </label>
            <div className='relative group'>
              <Mail
                className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF5500] transition-colors'
                size={18}
              />
              <input
                {...register("email", { required: "El email es requerido" })}
                type='email'
                placeholder='usuario@satoru.app'
                className='w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 pl-12 text-sm focus:border-[#FF5500] outline-none transition-all placeholder:text-gray-700'
              />
            </div>
            {errors.email && (
              <span className='text-red-500 text-[10px] ml-1'>
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest'>
              Contraseña
            </label>
            <div className='relative group'>
              <Lock
                className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF5500] transition-colors'
                size={18}
              />
              <input
                {...register("password", {
                  required: "La contraseña es requerida",
                })}
                type={showPassword ? "text" : "password"}
                placeholder='••••••••'
                className='w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 pl-12 pr-12 text-sm focus:border-[#FF5500] outline-none transition-all placeholder:text-gray-700'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className='text-red-500 text-[10px] ml-1'>
                {errors.password.message}
              </span>
            )}
          </div>

          <div className='text-right'>
            <Link
              href='#'
              className='text-gray-500 text-[11px] hover:text-orange-400 underline decoration-gray-800 transition-colors'
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {loginError && (
            <div className='p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[11px] text-center italic'>
              {loginError}
            </div>
          )}

          {/* Botón Principal - Gradiente Naranja */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-gradient-to-r from-[#FF5500] to-[#CC4400] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-950/20 hover:shadow-orange-700/20 transform hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-50'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' />
            ) : (
              <>
                Ingresar <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer: Registro */}
        <div className='mt-12 text-center space-y-4 w-full'>
          <p className='text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em]'>
            ¿No tienes cuenta?
          </p>
          <Link
            href='/register'
            className='block w-full border border-[#FF5500]/30 text-orange-500 font-bold py-4 rounded-2xl hover:bg-orange-600/5 transition-all uppercase tracking-wider text-sm text-center'
          >
            Registrate <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
