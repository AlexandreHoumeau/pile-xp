"use client";
import { LogoAnimation } from "@/components/LogoAnimation";

export const SideNav = () => {
  return (
    <div className="border-black border-r-2 h-full items-start">
      <div className="bg-black p-4 h-1/5">
        <LogoAnimation logo="pile_xp_logo_animation_white.json" />
      </div>
    </div>
  );
};
