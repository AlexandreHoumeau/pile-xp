"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
	{ href: "/admin", name: "Dashboard" },
	{ href: "/admin/projects", name: "Projets" },
	{ href: "/admin/journal", name: "Journal" },
	{ href: "/admin/contact", name: "Contact" },
];

export default function Navbar() {
	const pathName = usePathname();
	const containerRef = useRef<HTMLDivElement>(null);
	const [positions, setPositions] = useState<{ left: number; width: number }[]>(
		[]
	);
	const [activeIndex, setActiveIndex] = useState(0);

	// measure link positions
	useEffect(() => {
		if (containerRef.current) {
			const children = Array.from(containerRef.current.children) as HTMLElement[];
			const newPositions = children.map((child) => ({
				left: child.offsetLeft,
				width: child.offsetWidth,
			}));
			console.log(newPositions)
			setPositions(newPositions);
		}
	}, [pathName]);

	useEffect(() => {
		console.log(positions[activeIndex])
	}, [activeIndex])

	return (
		<div className="font-insitutrial relative h-16">
			<div className="flex flex-wrap align-center text-xl">
				<div className="px-8">
					<p>logo</p>
				</div>
				<div className="bg-gray-100 px-16 py-1">
					<p>Agence d’architecture</p>
				</div>
				<div className="flex-1 relative">
					<div
						ref={containerRef}
						className="flex flex-wrap text-white align-center gap-x-32 px-16 py-1 bg-pink relative"
					>
						{links.map((link, index) => (
							<Link key={index} onClick={() => setActiveIndex(index)} href={link.href}>
								{link.name}
							</Link>
						))}
					</div>
					{/* Moving Logo */}
					{positions.length > 0 && (
						<div
							className="absolute bg-pink transition-all p-4 duration-300"
							style={{
								top: "100%", // place below navbar
								left: positions[activeIndex]?.left - 64,
								// width: positions[activeIndex]?.width,
							}}
						>
							<div className="flex justify-center">
								<Image
									width={234}
									height={35}
									src="/pink_logo.png"
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
