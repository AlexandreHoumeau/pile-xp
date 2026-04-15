"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoIosMenu, IoMdClose } from "react-icons/io";

const adminLinks = [
  { name: "Projets", path: "/admin/projects" },
  { name: "Journal", path: "/admin/journal" },
  { name: "L'atelier", path: "/admin/about" },
  { name: "Contact", path: "/admin/contact" },
];

export default function NavbarAdmin() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  const linkClassName = (path: string) =>
    pathname === path ? "opacity-100" : "opacity-75 hover:opacity-100 transition-opacity";

  return (
    <div className="font-insitutrial z-50 sticky md:top-0 -top-[2.5em] md:block">
      <div className="flex z-50 bg-white flex-wrap items-center text-2xs 2xl:text-xl lg:text-base">
        <div className="pl-2 bg-white pr-2 lg:pr-[14px] hidden lg:block">
          <Image
            src="/mini_logo.png"
            alt="logo"
            width={40}
            height={18}
            className="mt-2 lg:w-auto w-8"
          />
        </div>

        <div className="flex-1">
          <div className="lg:grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)] text-white items-center bg-pink relative">
            <div className="bg-zinc-400 flex justify-between xl:mr-10 py-2 md:px-10 px-4 xl:px-12 lg:text-center text-white">
              <p>Administration PILE.XP</p>
            </div>

            <div className="lg:hidden sticky md:block top-0 z-50">
              <button
                onClick={toggleMenu}
                className="bg-pink flex justify-between z-50 items-center py-2 md:px-12 px-4 xl:px-12 text-white w-full"
                aria-label="Toggle admin menu"
              >
                <IoIosMenu className="text-white text-3xl sm:text-4xl md:text-4xl" />
              </button>
            </div>

            <div className="lg:flex justify-around lg:mr-10 hidden">
              {adminLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={linkClassName(link.path)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="lg:flex justify-around -ml-8 mr-10 hidden">
              {adminLinks.slice(2).map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={linkClassName(link.path)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex items-center justify-center bg-white text-pink px-4 xl:px-8 py-2 border border-pink ">
              <Link href="/" className="font-insitutrial_bold hover:opacity-80 transition-opacity">
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-pink z-[100] lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4 md:p-8">
            <button
              onClick={closeMenu}
              className="text-white"
              aria-label="Close admin menu"
            >
              <IoMdClose className="text-4xl sm:text-5xl md:text-6xl" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-8 md:gap-12 text-white">
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={closeMenu}
                className="text-3xl sm:text-4xl md:text-5xl hover:opacity-70 transition-opacity"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/"
              onClick={closeMenu}
              className="text-xl sm:text-2xl md:text-3xl border border-white px-6 py-3 hover:bg-white hover:text-pink transition-colors"
            >
              Retour au site
            </Link>
          </nav>
        </div>
      </div>

      <div
        style={{ position: "sticky", top: "-3em" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 lg:gap-8 md:px-12 lg:px-16"
      >
      </div>
    </div>
  );
}
