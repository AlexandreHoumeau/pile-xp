'use client';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { getFooterText } from '../actions/about/get';

const Footer: React.FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [footerText, setFooterText] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchFooterText = async () => {
      const text = await getFooterText();
      setFooterText(text);
    }
    fetchFooterText();
  }, []);

  useEffect(() => {
    const textEl = textRef.current;
    const containerEl = containerRef.current;
    if (!textEl || !containerEl) return;

    let x = containerEl.offsetWidth; // démarre à droite du conteneur
    const speed = 1.2; // px par frame

    const loop = () => {
      x -= speed;
      const textWidth = textEl.offsetWidth;
      const containerWidth = containerEl.offsetWidth;

      // Quand le texte est complètement sorti du conteneur à gauche, on le remet à droite
      if (x < -textWidth) x = containerWidth;

      textEl.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  return (
    <footer className="border-t-2 relative text-gray-400 text-center p-4 lg:p-8 mt-8 flex lg:flex-row flex-col justify-between items-center md:px-16 overflow-hidden">
      {/* Liens réseaux */}
      <div className="flex space-x-3 text-pink font-insitutrial_bold text-lg z-10">
        <a target="_blank" href="https://www.instagram.com/pile.xp/">Instagram</a>
        <div>|</div>
        <a target="_blank" href="https://www.youtube.com/@pilexp">Youtube</a>
        <div>|</div>
        <a target="_blank" href="https://www.tiktok.com/@pile.xp">Tiktok</a>
      </div>

      {/* Texte défilant dynamique */}
      <div ref={containerRef} className="relative w-full overflow-hidden lg:mx-8 h-8">
        <p
          ref={textRef}
          className="absolute whitespace-nowrap font-insitutrial_bold text-base md:text-lg"
        >
          {footerText || "PILE.XP - Tous droits réservés"}
        </p>
      </div>

      {/* Logo */}
      <Image
        src="/pxp_logo.svg"
        alt="PILE.XP logo"
        width={119}
        height={40}
        className="z-10"
      />
    </footer>
  );
};

export default Footer;
