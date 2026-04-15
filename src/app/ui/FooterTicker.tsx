"use client";

import { useEffect, useRef } from "react";

type FooterTickerProps = {
  text: string;
};

export default function FooterTicker({ text }: FooterTickerProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textEl = textRef.current;
    const containerEl = containerRef.current;

    if (!textEl || !containerEl) {
      return;
    }

    let animationFrameId = 0;
    let x = containerEl.offsetWidth;
    const speed = 1.2;

    const loop = () => {
      x -= speed;

      const textWidth = textEl.offsetWidth;
      const containerWidth = containerEl.offsetWidth;

      if (x < -textWidth) {
        x = containerWidth;
      }

      textEl.style.transform = `translateX(${x}px)`;
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden lg:mx-8 h-8">
      <p
        ref={textRef}
        className="absolute whitespace-nowrap font-insitutrial_bold text-base md:text-lg"
      >
        {text}
      </p>
    </div>
  );
}
