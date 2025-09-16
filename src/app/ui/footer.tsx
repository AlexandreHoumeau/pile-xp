import Image from 'next/image';
import React from 'react';
import { IconType } from 'react-icons';
import { FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer: React.FC = () => {
  const IconRenderer = (Icon: IconType, href: string) => (
    <a
      key={href}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 bg-pink rounded-full text-white hover:bg-pink-600 transition-colors duration-200 mx-1"
    >
      <Icon size={20} />
    </a>
  );

  return (
    <footer className="border-t-2 relative text-gray-400 text-center p-8 mt-8 flex justify-between items-center px-16 ">
      <div className="flex space-x-3">
        {IconRenderer(FaInstagram, 'https://www.instagram.com/pile.xp/')}
        {IconRenderer(FaYoutube, 'https://www.youtube.com/@pilexp')}
        {IconRenderer(FaTiktok, 'https://www.tiktok.com/@pile.xp')}
        {IconRenderer(MdEmail, 'mailto:contact@pile-xp.com')}
      </div>

      <p className="font-insitutrial_bold text-lg">
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
