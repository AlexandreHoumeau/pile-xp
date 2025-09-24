"use client";
import { LogoAnimation } from '@/components/LogoAnimation';
import React, { useEffect } from 'react';

const Loading: React.FC = () => {
    useEffect(() => { console.log("Hello world") }, []);
    return (
        <div className="flex flex-col items-center justify-center bg-white h-screen">
            <LogoAnimation logo={"/pile_xp_logo_animation_black.json"} />
        </div>
    )
};

export default Loading;
