import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const LogoAnimation = ({ logo }: { logo: string }) => {
  return (
    <DotLottieReact
      speed={1.5}
      width={1600}
      src={logo}
      mode="reverse"
      autoplay
    />
  );
};
