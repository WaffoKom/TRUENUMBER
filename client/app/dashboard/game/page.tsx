"use client";

import { useState } from "react";
import apiClient from "@/lib/api/client"; // adapte le chemin si besoin

export default function PlayGame() {
  const [result, setResult] = useState<string | null>(null);
  const [generatedNumber, setGeneratedNumber] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const play = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/game/play");

      setResult(data.result);
      setGeneratedNumber(data.generatedNumber);
      setNewBalance(data.newBalance);
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Jouer au Jeu TRUENUMBER</h1>
      <button
        onClick={play}
        disabled={loading}
        className="bg-[#f0652b]  text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Chargement..." : "Jouer"}
      </button>

      {result && (
        <div className="mt-4 text-lg">
          <p className="bg-violet-400 p-3 rounded-lg mb-3">
            Résultat : <strong>{result}</strong>
          </p>
          <p className="bg-sky-400 p-3 rounded-lg mb-3">
            Numéro généré : <strong>{generatedNumber}</strong>
          </p>
          <p className="bg-green-400 p-3 rounded-lg">
            Votre nouveau solde : <strong>{newBalance}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
