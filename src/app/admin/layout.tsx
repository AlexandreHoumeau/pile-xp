"use client";
import { Toaster } from "react-hot-toast";
import NavbarAdmin from "../ui/navbarAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) {
      redirect("/login");
    }
  }, [isLoggedIn])

  return (
      <div>
        <NavbarAdmin />
        <Toaster />
        <div className="flex-grow bg-white p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
  );
}