"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CircleUserRound,
  Settings,
  Ticket,
  Users,
  Bus,
  Key,
} from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api/client"; // axios instance avec withCredentials

type UserRole = "client" | "admin";

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  phone: string;
}

const navItemsByRole: Record<
  UserRole,
  { label: string; icon: React.ReactNode; path: string }[]
> = {
  client: [
    { label: "Users", icon: <Users size={20} />, path: "/users" },
    { label: "Play Game", icon: <Bus size={20} />, path: "/game" },
    { label: "My Game History", icon: <LayoutDashboard size={20} />, path: "" },
  ],
  admin: [
    { label: "Users", icon: <Users size={20} />, path: "/users" },
    { label: "Play Game", icon: <Bus size={20} />, path: "/game" },
    { label: "My Game History", icon: <LayoutDashboard size={20} />, path: "" },
    {
      label: "All Users Games History",
      icon: <LayoutDashboard size={20} />,
      path: "/all",
    },
  ],
};

export default function DashNavBar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiClient.get<User>("/users/me");
        setUser(res.data);
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return (
      <div>Erreur lors de la récupération des informations utilisateur.</div>
    );
  }

  const role = user.role;
  if (!role || !navItemsByRole[role]) return null;

  const getPath = (subpath: string) =>
    role === "client" ? `/dashboard${subpath}` : `/${role}/dashboard${subpath}`;

  return (
    <aside className="w-60 h-screen bg-white shadow-md">
      <div className="flex flex-col justify-between h-full p-2">
        <div className="part-1">
          {navItemsByRole[role].map((item) => (
            <Link key={item.path} href={getPath(item.path)}>
              <div className="flex items-center text-sm font-medium hover:bg-[#f5f4f8] p-3 rounded-md cursor-pointer">
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="part-2">
          <div className="h-px w-full bg-gray-300 mb-3" />
          <div className="flex items-center justify-between mr-3">
            <span className="font-medium text-sm truncate">
              {user.username}
            </span>
            <Link href={getPath("/settings")}>
              <Settings className="text-gray-500" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
