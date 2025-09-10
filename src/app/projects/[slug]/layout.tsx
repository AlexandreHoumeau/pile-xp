import React from 'react';

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="font-insitutrial">
            <div className="flex justify-between items-center px-16 py-4 mx-auto">
                <a href="/projects/precedent">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 20 }}>‹</span>
                        Precedent
                    </div>
                </a>
                <a href="/projects/suivant">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        Suivant
                        <span style={{ fontSize: 20 }}>›</span>
                    </div>
                </a>
            </div>
            <main>{children}</main>
        </div>
    );
}