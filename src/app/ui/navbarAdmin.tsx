import React from 'react';
import Link from 'next/link';

const adminLinks = [
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Journal', path: '/admin/journal' },
    { name: 'About', path: '/admin/about' },
    { name: 'Contact', path: '/admin/contact' },
];

const NavbarAdmin: React.FC = () => (
    <nav className="bg-white text-black p-4 border-b flex justify-between items-center">
        <ul className="flex space-x-8">
            {adminLinks.map(link => (
                <li key={link.path}>
                    <Link href={link.path}>{link.name}</Link>
                </li>
            ))}
        </ul>
        <div>
            <Link className='text-pink font-insitutrial_bold' href="/">Retour au site</Link>
        </div>
    </nav>
);

export default NavbarAdmin;