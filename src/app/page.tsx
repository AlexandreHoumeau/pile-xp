"use client";
import { useEffect, useState } from "react";
import { LogoAnimation } from "../components/LogoAnimation";

export default function Home() {
  const [choosenColor, setChoosenColor] = useState<{
    bg: string;
    logo: string | null;
  }>({ bg: "", logo: null });

  useEffect(() => {
    const random = COLORS[Math.floor(Math.random() * COLORS.length)];
    setChoosenColor(random);
  }, []);

  if (!choosenColor.logo) return null;
  return (
    <div
      className={`grid ${choosenColor?.bg} justify-center items-center min-h-screen`}
    >
      <div className="justify-center items-center">
        <LogoAnimation logo={choosenColor.logo} />
        <div className="transition-opacity ease-in duration-700 text-center">
          <p>Agence d’architecture</p>
          <p>Arthur Rundstadler + Charlotte Sampson</p>
          <p>projet@pile-xp.com</p>
          <h1 className="font-bold mt-10">SITE EN CONSTRUCTION</h1>
        </div>
      </div>
    </div>
  );
}

const COLORS = [
  {
    bg: "bg-[#FF1F96]",
    logo: "/pile_xp_logo_animation_white.json",
  },
  {
    bg: "bg-[#6AE678]",
    logo: "/pile_xp_logo_animation_white.json",
  },
  {
    bg: "bg-white",
    logo: "/pile_xp_logo_animation_black.json",
  },
];
