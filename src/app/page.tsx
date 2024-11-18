"use client";
import { useEffect, useState } from "react";
import { LogoAnimation } from "../components/LogoAnimation";

export default function Home() {
  const [choosenColor, setChoosenColor] = useState<{
    bg: string;
    text: string;
    logo: string | null;
  }>({ bg: "", text: "text-white", logo: null });

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
        <div className={`${choosenColor.text} text-2xl mt-4 text-center`}>
          <p className="font-insitutrial">Agence d’architecture</p>
          <p className="font-insitutrial">
            Arthur Rundstadler + Charlotte Sampson
          </p>
          <p className="font-insitutrial">projet@pile-xp.com</p>
          <h1 className="mt-10 font-insitutrial_bold">SITE EN CONSTRUCTION</h1>
        </div>
      </div>
    </div>
  );
}

const COLORS = [
  {
    bg: "bg-[#FF1F96]",
    logo: "/pile_xp_logo_animation_white.json",
    text: "text-white",
  },
  {
    bg: "bg-[#6AE678]",
    logo: "/pile_xp_logo_animation_white.json",
    text: "text-white",
  },
  {
    bg: "bg-white",
    logo: "/pile_xp_logo_animation_black.json",
    text: "text-black",
  },
];
