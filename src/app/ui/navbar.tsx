"use client";

import Image from "next/image";
import Link from "next/link";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div style={{ position: "sticky", top: "-2.5em"}} className="font-insitutrial mb-4 lg:mb-6">
      <div className="flex flex-wrap items-center text-2xs 2xl:text-xl lg:text-base">
        <div className="pl-2 pr-2 xl:pr-5 hidden lg:block">
          <Image
            src="/mini_logo.png"
            alt="logo"
            width={40}
            height={18}
            className="mt-2 xl:w-auto w-8"
          />
        </div>

        <div className="flex-1 ">
          <div className="lg:grid grid-cols-4 text-white items-center bg-pink relative">
            <div className="bg-zinc-400 flex justify-between lg:mr-10 py-2 md:px-12 px-4 xl:px-12 lg:text-center text-white">
              <p>Agence d&apos;architecture</p>
            </div>

            {/* 🧷 Sticky Menu Button (mobile only) */}
            <div className="lg:hidden sticky top-0 z-50">
              <button
                onClick={toggleMenu}
                className="bg-pink flex justify-between z-50 items-center py-2 md:px-12 px-4 xl:px-12 text-white w-full"
                aria-label="Toggle menu"
              >
                <IoIosMenu className="text-white text-3xl sm:text-4xl md:text-4xl" />
              </button>
            </div>

            <div className="lg:flex justify-around lg:mr-10 hidden">
              <Link href={"/about"}>L&apos;Atelier</Link>
              <Link href={"/"}>Nos Projets</Link>
            </div>
            <div className="lg:flex justify-around -ml-8 mr-10 hidden">
              <Link href={"/journal"}>Journal PXP</Link>
              <Link href={"/contact"}>Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- Mobile menu overlay --- */}
      <div
        className={`fixed inset-0 bg-pink z-50 lg:hidden transition-all duration-300 ease-in-out ${
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
              aria-label="Close menu"
            >
              <IoMdClose className="text-4xl sm:text-5xl md:text-6xl" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-8 md:gap-12 text-white">
            <Link
              href={"/about"}
              onClick={closeMenu}
              className="text-3xl sm:text-4xl md:text-5xl hover:opacity-70 transition-opacity"
            >
              L&apos;Atelier
            </Link>
            <Link
              href={"/"}
              onClick={closeMenu}
              className="text-3xl sm:text-4xl md:text-5xl hover:opacity-70 transition-opacity"
            >
              Nos Projets
            </Link>
            <Link
              href={"/journal"}
              onClick={closeMenu}
              className="text-3xl sm:text-4xl md:text-5xl hover:opacity-70 transition-opacity"
            >
              Journal PXP
            </Link>
            <Link
              href={"/contact"}
              onClick={closeMenu}
              className="text-3xl sm:text-4xl md:text-5xl hover:opacity-70 transition-opacity"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* --- Bottom logo bar --- */}
      <div style={{ position: "sticky", top: "-3em"}}  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 lg:gap-8 md:px-12 lg:px-16">
        <div className="lg:col-span-3 md:col-span-2 col-span-1" />
        <div className="bg-pink lg:p-4 px-2 py-2 lg:py-6 flex-1">
          <div className="relative h-8 sm:h-10 md:h-12 lg:h-14 w-auto lg:mt-2">
            <Image
              src="/full_logo_white.svg"
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
