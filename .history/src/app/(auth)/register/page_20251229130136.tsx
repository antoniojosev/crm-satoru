"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthRepositoryImpl } from "@/core/data/repositories/AuthRepositoryImpl";
import { RegisterUser } from "@/core/domain/use-cases/RegisterUser";
import { RegisterDTO } from "@/core/data/dtos/RegisterDTO";

// Inyección de dependencias (Manual)
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
      // Si sale bien, mandamos al login
      alert("Cuenta creada con éxito. Por favor inicia sesión.");
      router.push("/login");
    } catch (err: any) {
      // Intentamos sacar el mensaje de error del backend si existe
      const msg =
        err.response?.data?.message || err.message || "Error al registrarse";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-black text-white'>
      <div className='w-full max-w-md p-8 bg-gray-900 rounded-lg border border-gray-800'>
        <h1 className='text-2xl font-bold mb-6 text-center text-orange-500'>
          Crear Cuenta Satoru
        </h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex gap-2'>
            <input
              type='text'
              placeholder='Nombre'
              required
              className='w-1/2 p-3 rounded bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none'
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <input
              type='text'
              placeholder='Apellido'
              required
              className='w-1/2 p-3 rounded bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none'
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          <input
            type='email'
            placeholder='Email'
            required
            className='p-3 rounded bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none'
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type='password'
            placeholder='Contraseña'
            required
            className='p-3 rounded bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none'
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {error && (
            <div className='text-red-500 text-sm text-center bg-red-900/20 p-2 rounded'>
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='mt-2 bg-orange-600 p-3 rounded font-bold hover:bg-orange-700 transition disabled:opacity-50'
          >
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>

        <p className='mt-4 text-center text-gray-400 text-sm'>
          ¿Ya tienes cuenta?{" "}
          <a href='/login' className='text-orange-400 hover:underline'>
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  );
}
