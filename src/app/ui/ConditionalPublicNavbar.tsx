"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function ConditionalPublicNavbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}
