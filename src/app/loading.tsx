"use client";
import { LogoAnimation } from '@/components/LogoAnimation';
import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-white h-screen">
            <LogoAnimation logo={"/pile_xp_logo_animation_black.json"} />
        </div>
    )
};

export default Loading;
