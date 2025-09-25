"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const userLinks = [
	{ href: "/about", name: "À propos" },
	{ href: "/", name: "Projets" },
	{ href: "/journal", name: "Journal" },
	{ href: "/contact", name: "Contact" },
];
const adminLinks = userLinks.map(l => ({ ...l, href: `/admin${l.href}` }));

export default function Navbar() {
	const pathName = usePathname();

	const containerRef = useRef<HTMLDivElement>(null);
	const [positions, setPositions] = useState<{ left: number; width: number }[]>(
		[]
	);
	const [activeIndex, setActiveIndex] = useState(0);
	const isAdminRoute = pathName.startsWith("/admin");
	const links = isAdminRoute ? adminLinks : userLinks;;

	useEffect(() => {
		if (containerRef.current) {
			const children = Array.from(
				containerRef.current.children
			) as HTMLElement[];
			const newPositions = children.map(child => ({
				left: child.offsetLeft,
				width: child.offsetWidth,
			}));
			setPositions(newPositions);

			const idx = links.findIndex(l => l.href === pathName);
			if (idx >= 0) setActiveIndex(idx);
		}
	}, [pathName, links]);

	return (
		<div className="font-insitutrial relative h-16 mb-6">
			<div className="flex flex-wrap items-center text-xl">
				<div className="pl-2 pr-5">
					<Image
						width={40}
						height={18}
						src="/mini_logo.png"
						alt="logo"
						className="mt-2"
					/>
				</div>
				<div className="bg-zinc-400 px-16 text-white py-1">
					<p>{isAdminRoute ? "Admin Panel" : "Agence d’architecture"}</p>
				</div>
				<div className="flex-1 relative">
					<div
						ref={containerRef}
						className="flex flex-wrap text-white items-center gap-x-32 px-16 py-1 bg-pink relative"
					>
						{links.map((link, index) => (
							<Link
								key={index}
								onClick={() => setActiveIndex(index)}
								href={link.href}
							>
								{link.name}
							</Link>
						))}
					</div>
					{positions.length > 0 && (
						<div
							className="absolute bg-pink transition-all p-4 duration-300"
							style={{
								top: "100%",
								left: positions[activeIndex]?.left - 64,
							}}
						>
							<div className="flex justify-center">
								<Image
									width={234}
									height={35}
									src="/full_logo_white.svg"
									alt="logo"
									className="mt-2"
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
