"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SideNav = () => {
  const pathName = usePathname();
  return (
    <div className="border-r-[1px] h-full items-start bg-slate-50">
      <div className="h-screen w-64 text-black flex flex-col">
        <nav className="flex flex-col p-4 space-y-4 font-insitutrial">
          {links.map((link, index) => (
            <Link
              key={index}
              className={`hover:font-insitutrial_bold ${
                pathName.includes(link.href)
                  ? "text-pink font-insitutrial_bold"
                  : null
              }`}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

const links = [
  { href: "/admin/dashboard", name: "Dashboard" },
  { href: "/admin/projects", name: "Projets" },
  { href: "/admin/journal", name: "Journal" },
  { href: "/admin/contact", name: "Contact" },
];
