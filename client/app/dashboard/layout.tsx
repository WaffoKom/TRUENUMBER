import DashNavBar from "@/components/dashboard/DashNavBar/DashNavBar"; // adapte le chemin
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <DashNavBar />

      {/* Contenu */}
      <main className="flex-1  bg-[#f5f4f8] max-h-screen overflow-hidden p-6">
        {children}
      </main>
    </div>
  );
}
