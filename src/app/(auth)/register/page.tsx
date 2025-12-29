"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { AuthRepositoryImpl } from "@/core/data/repositories/AuthRepositoryImpl";
import { RegisterUser } from "@/core/domain/use-cases/RegisterUser";
import { RegisterDTO } from "@/core/data/dtos/RegisterDTO";

// Inyección de dependencias (Manual - Clean Architecture)
const authRepo = new AuthRepositoryImpl();
const registerUseCase = new RegisterUser(authRepo);

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterDTO>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUseCase.execute(formData);
      alert("Cuenta creada con éxito. Por favor inicia sesión.");
      router.push("/login");
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Error al registrarse";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#121212] flex items-center justify-center p-4 py-12 font-sans text-white'>
      <div className='w-full max-w-[400px] flex flex-col items-center'>
        {/* Logo Sección */}
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

        {/* Título */}
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold uppercase tracking-tight'>
            Crear cuenta
          </h2>
          <p className='text-gray-500 text-sm mt-1 font-light'>
            Únete a la inversión inmobiliaria del futuro
          </p>
        </div>

        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          {/* Nombre y Apellido en grilla para ahorrar espacio como el diseño */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest'>
                Nombre
              </label>
              <div className='relative group'>
                <User
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF5500] transition-colors'
                  size={16}
                />
                <input
                  type='text'
                  placeholder='Juan'
                  required
                  className='w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 pl-11 text-sm focus:border-[#FF5500] outline-none transition-all placeholder:text-gray-700'
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className='space-y-1.5'>
              <label className='text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest'>
                Apellido
              </label>
              <input
                type='text'
                placeholder='Pérez'
                required
                className='w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 text-sm focus:border-[#FF5500] outline-none transition-all placeholder:text-gray-700'
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest'>
              Email
            </label>
            <div className='relative group'>
              <Mail
                className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF5500] transition-colors'
                size={16}
              />
              <input
                type='email'
                placeholder='juan@satoru.com'
                required
                className='w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 pl-11 text-sm focus:border-[#FF5500] outline-none transition-all placeholder:text-gray-700'
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest'>
              Contraseña
            </label>
            <div className='relative group'>
              <Lock
                className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF5500] transition-colors'
                size={16}
              />
              <input
                type='password'
                placeholder='••••••••••••'
                required
                className='w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 pl-11 text-sm focus:border-[#FF5500] outline-none transition-all placeholder:text-gray-700'
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          {error && (
            <div className='p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[11px] text-center italic'>
              {error}
            </div>
          )}

          {/* Botón Principal */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-[#FF5500] to-[#CC4400] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-50'
          >
            {loading ? (
              <Loader2 className='animate-spin' />
            ) : (
              <>
                Crear cuenta <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer: Volver al Login */}
        <div className='mt-10 text-center space-y-4 w-full'>
          <p className='text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em]'>
            ¿Ya tienes cuenta?
          </p>
          <Link
            href='/login'
            className='block w-full border border-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all uppercase tracking-wider text-sm text-center'
          >
            Inicia sesión <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
