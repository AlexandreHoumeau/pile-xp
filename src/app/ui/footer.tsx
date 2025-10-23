import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 relative text-gray-400 text-center p-8 mt-8 flex lg:flex-row flex-col justify-between items-center px-16 ">
      <div className="flex space-x-3 text-pink font-insitutrial_bold text-lg">
        <a target="_blank" href={"https://www.instagram.com/pile.xp/"}>Instagram</a>
        <div>|</div>
        <a target="_blank" href={"https://www.youtube.com/@pilexp"}>Youtube</a>
        <div>|</div>
        <a target="_blank" href={"https://www.tiktok.com/@pile.xp"}>Tiktok</a>
      </div>

      <p className="font-insitutrial_bold text-base md:text-lg">
        &copy; {new Date().getFullYear()} PILE.XP meilleure agence d’archi de
        France, euh non ddu monde... de l’UNIVERS !!!!!!!!!
      </p>
      <Image
        src="/pxp_logo.svg"
        alt="Some picture of mine"
        width={119}
        height={40}
      />
    </footer>
  );
};

export default Footer;
