"use client";
import { useLogin } from "@/hooks/useLogin";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import apiClient from "@/lib/api/client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const loginMutation = useLogin();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Le mot de passe doit contenir une majuscule.");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Le mot de passe doit contenir un chiffre.");
      return;
    }
    setError(null);

    try {
      await loginMutation.mutateAsync({ email, password });
      try {
        alert("Connexion Reussie");
        const res = await apiClient.get("/users/me"); // contient le rôle
        const role = res.data.role;
        if (role === "client") {
          router.push(`/dashboard`);
        } else {
          router.push(`/${role}/dashboard`);
        }

        /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (meError: any) {
        console.error("Erreur lors de /users/me :", meError);
        alert("Erreur lors de la récupération du profil.");
      }

      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const detail =
        error?.response?.data?.message || error?.response?.data?.error;
      if (detail === "Email not found.") {
        // alert("Email inconnu.");
        setMessage("Email inconnu.");
      } else if (detail === "Incorrect password.") {
        // alert("Mot de passe incorrect.");
        setPasswordMessage("Mot de passe incorrect.");
      } else if (
        detail === "This account has been deleted. Please register again"
      ) {
        alert("Ce compte a été supprimé. Veuillez vous réinscrire.");
      } else {
        alert(detail || "Erreur de connexion");
      }
    }
  };

  return (
    <div className=" w-full h-screen items-center justify-center flex text-sm bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  w-full  max-w-sm border border-white rounded-lg mx-auto bg-white p-4 shadow-lg"
      >
        <div className="flex justify-between mb-6">
          <span className="text-2xl font-medium">Login</span>
          <Link
            href="/register"
            className="text-[#f0652b] font-medium hover:underline"
          >
            register
          </Link>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border-2 border-gray-100 rounded-lg mb-3"
        />
        {message && <p className="mb-3 text-sm  text-red-600">{message}</p>}
        <div className="relative mb-3">
          <input
            // type="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-100 rounded-lg "
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2  -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

        {passwordMessage && (
          <p className="mb-3 text-sm  text-red-600">{passwordMessage}</p>
        )}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className={`flex items-center justify-center p-3 w-full font-medium rounded-full text-white transition-colors mb-3
    ${
      loginMutation.isPending
        ? "bg-[#f0652b] opacity-50 cursor-not-allowed"
        : "bg-[#f0652b] hover:bg-orange-600"
    }
  `}
        >
          {loginMutation.isPending ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                />
              </svg>
              Chargement...
            </>
          ) : (
            "Continue"
          )}
        </button>
      </form>
    </div>
  );
}
