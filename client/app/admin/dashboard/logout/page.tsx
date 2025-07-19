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
import blankProfile from "@/public/images/blank-profile.webp";
import Image from "next/image";
import Link from "next/link";
import apiClient from "@/lib/api/client";

// Définition des menus par rôle
const navItemsByRole: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    path: string;
  }[]
> = {
  user: [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "" },
    {
      label: "My Profile",
      icon: <CircleUserRound size={20} />,
      path: "/profile",
    },
    { label: "My Password", icon: <Key size={20} />, path: "/password" },

    { label: "My Tickets", icon: <Ticket size={20} />, path: "/tickets" },
  ],
  admin: [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "" },
    { label: "Users", icon: <Users size={20} />, path: "/users" },
    { label: "Buses", icon: <Bus size={20} />, path: "/buses" },
    {
      label: "My Profile",
      icon: <CircleUserRound size={20} />,
      path: "/profile",
    },
    { label: "My Password", icon: <Key size={20} />, path: "/password" },
  ],
  owner: [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "" },
    { label: "Buses", icon: <Bus size={20} />, path: "/buses" },
    {
      label: "My Profile",
      icon: <CircleUserRound size={20} />,
      path: "/profile",
    },
    { label: "My Password", icon: <Key size={20} />, path: "/password" },
  ],
  cashier: [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "" },
    { label: "Tickets", icon: <Ticket size={20} />, path: "/tickets" },
    {
      label: "My Profile",
      icon: <CircleUserRound size={20} />,
      path: "/profile",
    },
    { label: "My Password", icon: <Key size={20} />, path: "/password" },
  ],
};

export default function DashNavBar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await apiClient.get("/auth/me");
        setRole(res.data.role);
      } catch (error) {
        console.error("Erreur récupération rôle :", error);
      }
    };
    fetchUserRole();
  }, []);

  if (!role || !navItemsByRole[role]) return null; //Afficher un loader ou return null;

  const getPath = (subpath: string) =>
    role === "user" ? `/dashboard${subpath}` : `/${role}/dashboard${subpath}`;

  return (
    <aside className="w-60 h-screen bg-white shadow-md">
      <div className="flex flex-col justify-between h-full p-2">
        <div className="part-1">
          {navItemsByRole[role].map((item) => (
            <Link key={item.path} href={getPath(item.path)}>
              <div className="flex items-center text-sm font-medium hover:bg-[#f5f4f8] p-3 rounded-md">
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="part-2">
          <div className="h-px w-full bg-gray-300 mb-3" />
          <div className="flex items-center justify-between mr-3">
            <Image
              src={blankProfile}
              alt="avatar"
              className="w-8 h-8 object-cover rounded-full"
            />
            <span className="font-medium text-sm truncate">DaniloWaffis</span>
            <Link href={getPath("/settings")}>
              <Settings className="text-gray-500" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
