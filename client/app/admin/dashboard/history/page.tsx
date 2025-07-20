"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";

interface GameHistoryEntry {
  gameId: string;
  date: string;
  generatedNumber: number;
  result: "gagné" | "perdu";
  balanceChange: number;
  newBalance: number;
}

export default function GameHistory() {
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await apiClient.get("/history");
        setHistory(data);
        /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (error: any) {
        console.error(error);
        alert(error?.response?.data?.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Historique des Parties
      </h1>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : history.length === 0 ? (
        <p className="text-center">Aucune partie jouée pour le moment.</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Résultat</th>
                <th className="border px-2 py-1">Numéro</th>
                <th className="border px-2 py-1">Gain/Perte</th>
                <th className="border px-2 py-1">Nouveau Solde</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistory.map((entry) => (
                <tr key={entry.gameId} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">
                    {new Date(entry.date).toLocaleString()}
                  </td>
                  <td
                    className={`border px-2 py-1 font-semibold ${
                      entry.result === "gagné"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {entry.result}
                  </td>
                  <td className="border px-2 py-1">{entry.generatedNumber}</td>
                  <td className="border px-2 py-1">
                    {entry.balanceChange > 0 ? "+" : ""}
                    {entry.balanceChange}
                  </td>
                  <td className="border px-2 py-1">{entry.newBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="px-2 py-1">
              Page {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}
