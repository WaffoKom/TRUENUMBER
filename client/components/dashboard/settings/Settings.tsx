"use client";
import React from "react";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
export default function Settings() {
  const { mutate: logout } = useLogout();
  return (
    <div className="settings">
      <h1 className="text-3xl font-medium">Settings</h1>
      <div className="settings-parts bg-white h-[80vh]  rounded-xl">
        <div className="content flex flex-col items-center gap-y-6 justify-center pt-8">
          <button className="flex w-50 border-2 border-gray-100 p-2 justify-between rounded-lg">
            <span>Logout</span>

            <LogOut
              className="hover:cursor-pointer hover:scale-95 "
              onClick={() => logout()}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
