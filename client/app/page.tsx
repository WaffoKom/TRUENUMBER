import React from "react";
import Link from "next/link";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-red-600 text-center">
        BIENVENUE SUR LE JEU TRUENUMBER
      </h1>
      <div className="text-gray-600 mt-4 flex max-w-[30rem] gap-x-20">
        <Link href="/register" className="hover:underline font-bold">
          S&#39;inscrire
        </Link>
        <Link href="/login" className="hover:underline font-bold">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
