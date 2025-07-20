"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  balance: number;
}

export default function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await apiClient.get("/users");
      setUsers(data);
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      alert(error?.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await apiClient.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error: any) {
      alert(error?.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleEdit = async (id: string, updatedUser: Partial<User>) => {
    try {
      const { data } = await apiClient.put(`/users/${id}`, updatedUser);
      setUsers((prev) => prev.map((u) => (u._id === id ? data.user : u)));
      setEditingUser(null);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        Liste des Utilisateurs
      </h1>
      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Nom</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Téléphone</th>
                <th className="border px-2 py-1">Rôle</th>
                <th className="border px-2 py-1">Solde</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">
                    {editingUser === user._id ? (
                      <input
                        defaultValue={user.username}
                        onBlur={(e) =>
                          handleEdit(user._id, { username: e.target.value })
                        }
                        className="border px-1 w-full"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {editingUser === user._id ? (
                      <input
                        defaultValue={user.email}
                        onBlur={(e) =>
                          handleEdit(user._id, { email: e.target.value })
                        }
                        className="border px-1 w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {editingUser === user._id ? (
                      <input
                        defaultValue={user.phone}
                        onBlur={(e) =>
                          handleEdit(user._id, { phone: e.target.value })
                        }
                        className="border px-1 w-full"
                      />
                    ) : (
                      user.phone
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {editingUser === user._id ? (
                      <select
                        defaultValue={user.role}
                        onBlur={(e) =>
                          handleEdit(user._id, { role: e.target.value })
                        }
                        className="border px-1 w-full"
                      >
                        <option value="client">client</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="border px-2 py-1">{user.balance}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() =>
                        setEditingUser((prev) =>
                          prev === user._id ? null : user._id
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      {editingUser === user._id ? "Annuler" : "Modifier"}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
