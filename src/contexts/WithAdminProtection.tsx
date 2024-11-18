"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const WithAdminProtection: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter()
  const { user, isLoggedIn } = useAuth();
  const pathName = usePathname();
  const isAdminPage = pathName.includes("admin");
  console.log(user)
  
  useEffect(() => {
    if (!isLoggedIn && isAdminPage) {
      router.replace("/login");
    }
  }, [user]);

  return children;
};

export default WithAdminProtection;
