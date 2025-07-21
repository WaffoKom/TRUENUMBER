"use client";

import { FormEvent, useState } from "react";
import { useSignup } from "@/hooks/useSignup"; // adapte le chemin
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signupMutation = useSignup();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain an uppercase letter.");
      return;
    }
    if (!/\d/.test(password)) {
      setError("The password must contain a number.");
      return;
    }

    setError(null);

    try {
      await signupMutation.mutateAsync({
        username,
        email,
        password: password,
        phone: phoneNumber,
      });
      alert("Inscription réussie !");
      router.push("/login"); // redirige vers la page login après signup
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Error during registration"
      );
    }
  };

  return (
    <div className="w-full h-screen items-center justify-center flex text-sm bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  w-full  max-w-sm border border-white rounded-lg mx-auto bg-white p-4 shadow-lg"
      >
        <div className="flex justify-between mb-6">
          <span className="text-2xl font-medium">Register</span>
          <Link
            href="/login"
            className="text-[#f0652b] font-medium hover:underline"
          >
            login
          </Link>
        </div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 border-2 border-gray-100 rounded-lg mb-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border-2 border-gray-100 rounded-lg mb-3"
        />
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

        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="w-full p-3 border-2 border-gray-100 rounded-lg mb-3"
        />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          disabled={signupMutation.isPending}
          className="p-3 bg-[#f0652b] w-full  font-medium rounded-bl-full rounded-tl-full rounded-br-full rounded-tr-full text-white hover:cursor-pointer hover:bg-orange-600 mb-3"
        >
          {signupMutation.isPending ? (
            <button
              disabled={signupMutation.isPending}
              className={`px-4 py-2  text-white rounded ${
                signupMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Register...
            </button>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
}
