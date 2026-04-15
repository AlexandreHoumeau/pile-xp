import Image from "next/image";

import { getFooterText } from "../actions/about/get";
import FooterTicker from "./FooterTicker";

export default async function Footer() {
  const footerText = (await getFooterText()) || "PILE.XP - Tous droits réservés";

  return (
    <footer className="border-t-2 relative text-gray-400 text-center p-4 lg:p-8 mt-8 flex lg:flex-row flex-col justify-between items-center md:px-16 overflow-hidden">
      <div className="flex space-x-3 text-pink font-insitutrial_bold text-lg z-10">
        <a target="_blank" href="https://www.instagram.com/pile.xp/">Instagram</a>
        <div>|</div>
        <a target="_blank" href="https://www.youtube.com/@pilexp">Youtube</a>
        <div>|</div>
        <a target="_blank" href="https://www.tiktok.com/@pile.xp">Tiktok</a>
      </div>

      <FooterTicker text={footerText} />

      <Image
        src="/pxp_logo.svg"
        alt="PILE.XP logo"
        width={119}
        height={40}
        className="z-10"
      />
    </footer>
  );
}
