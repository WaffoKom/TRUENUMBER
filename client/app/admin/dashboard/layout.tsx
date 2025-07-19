import DashNavBar from "@/components/dashboard/DashNavBar/DashNavBar";
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
      <main className="flex-1 max-h-screen bg-[#f5f4f8] overflow-hidden p-6">
        {children}
      </main>
    </div>
  );
}
