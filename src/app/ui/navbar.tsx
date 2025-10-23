"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
	return (
		<div className="font-insitutrial relative mb-4 lg:mb-6">
			<div className="flex flex-wrap items-center font-2xs 2xl:text-xl lg:text-base">
				<div className="pl-2 pr-2 xl:pr-5 hidden lg:block">
					<Image
						src="/mini_logo.png"
						alt="logo"
						width={40}
						height={18}
						className="mt-2 xl:w-auto w-8"
					/>
				</div>

				<div className="flex-1 relative">
					<div
						className="lg:grid grid-cols-4 text-white items-center bg-pink relative"
					>
						<div className="bg-zinc-400 flex justify-between lg:mr-10 py-2 md:px-6 px-4 xl:px-12 lg:text-center text-white">
							<p>Agence d’architecture</p>
							<p className="lg:hidden block">Menu</p>
						</div>
						<div className="lg:flex justify-around lg:mr-10 hidden">
							<Link
								href={"/about"}
							>
								L&apos;Atelier
							</Link>
							<Link
								href={"/"}
							>
								Nos Projets
							</Link>
						</div>
						<div className="lg:flex justify-around -ml-8 mr-10 hidden">
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
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 md:px-12 lg:px-16">
				<div className="lg:col-span-3 md:col-span-2 col-span-1" />
				<div className="bg-pink lg:p-4 px-6 py-2 lg:py-6 flex-1">
					<Image
						src="/full_logo_white.svg"
						alt="logo"
						width={280} // aspect ratio reference
						height={40}
						className="w-72  lg:mt-2 lg:w-auto lg:h-10"
					/>
				</div>
			</div>
		</div>
	);
}
