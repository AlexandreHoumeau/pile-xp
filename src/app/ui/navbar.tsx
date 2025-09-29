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
		<div className="font-insitutrial relative mb-6">
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

				<div className="flex-1 relative">
					<div
						ref={containerRef}
						className="grid grid-cols-4 text-white items-center bg-pink relative"
					>
						<div className="bg-zinc-400 mr-10 py-2 text-center text-white">
							<p>Agence d’architecture</p>
						</div>
						<div className="flex justify-around mr-10">
							<Link
								href={"/about"}
							>
								L'Atelier
							</Link>
							<Link
								href={"/"}
							>
								Nos Projets
							</Link>
						</div>
						<div className="flex justify-around -ml-8 mr-10">
							<Link
								href={"/journal"}
							>
								Journal PXP
							</Link>
							<Link
								href={"/contact"}
							>
								Contact
							</Link>
						</div>
					</div>
				</div>

			</div>
			<div className="grid grid-cols-4 gap-8 px-16">
				<div className="col-span-3" />
					<div className="bg-pink p-4 py-6 flex-1">
						<Image
							width={280}
							height={40}
							src="/full_logo_white.svg"
							alt="logo"
							className="mt-2"
						/>
				</div>
			</div>
		</div>
	);
}
