"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { apiRequest, STORAGE_KEYS } from "@/lib/axios";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  };
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<RegisterData>({
    fullName: "",
    email: "",
    password: "",
    role: "ADMIN", // Users registered from admin panel are ADMIN by default
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "La contrasena debe tener al menos 8 caracteres";
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!regex.test(password)) {
      return "Debe contener mayuscula, minuscula, numero y caracter especial (@$!%*?&)";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      // Register the user
      await apiRequest("post", "/auth/register", formData);

      // Auto-login after successful registration
      const loginResponse = await apiRequest<AuthResponse>("post", "/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Store tokens
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginResponse.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginResponse.refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(loginResponse.user));
      }

      // Update Redux state
      dispatch(setUser(loginResponse.user as Parameters<typeof setUser>[0]));

      setLoading(false);
      router.push("/dashboard/projects");
      return;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const msg = error.response?.data?.message;
      if (Array.isArray(msg)) {
        setError(msg.join(", "));
      } else {
        setError(msg || error.message || "Error al registrarse");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 py-12 font-sans text-white">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF4400] to-[#AA3300] rounded-full flex items-center justify-center shadow-lg shadow-orange-900/40 border border-orange-400/20">
              <span className="text-white font-bold text-2xl italic">S</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter italic">
              ssatoru
            </h1>
          </div>
          <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase font-medium">
            lo hacemos posible
          </p>
        </div>

        {/* Titulo */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold uppercase tracking-tight">
            Crear cuenta
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-light">
            Unete a la inversion inmobiliaria del futuro
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Nombre Completo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest">
              Nombre Completo
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF5500] transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Juan Perez"
                required
                value={formData.fullName}
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 pl-11 text-sm focus:border-[#FF5500] outline-none transition-all placeholder:text-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest">
              Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF5500] transition-colors"
                size={16}
              />
              <input
                type="email"
                placeholder="juan@satoru.com"
                required
                value={formData.email}
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 pl-11 text-sm focus:border-[#FF5500] outline-none transition-all placeholder:text-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest">
              Contrasena
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FF5500] transition-colors"
                size={16}
              />
              <input
                type="password"
                placeholder="Password123!"
                required
                minLength={8}
                value={formData.password}
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 pl-11 text-sm focus:border-[#FF5500] outline-none transition-all placeholder:text-gray-700"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <p className="text-[10px] text-gray-600 ml-1">
              Min. 8 caracteres, mayuscula, minuscula, numero y caracter especial (@$!%*?&)
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[11px] text-center">
              {error}
            </div>
          )}

          {/* Boton Principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF5500] to-[#CC4400] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Crear cuenta <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer: Volver al Login */}
        <div className="mt-10 text-center space-y-4 w-full">
          <p className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em]">
            Ya tienes cuenta?
          </p>
          <Link
            href="/login"
            className="block w-full border border-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all uppercase tracking-wider text-sm text-center"
          >
            Inicia sesion <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
