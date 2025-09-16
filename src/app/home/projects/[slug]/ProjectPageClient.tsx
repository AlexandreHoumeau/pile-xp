"use client";

import React, { useRef, useEffect } from "react";
import { Project } from "@/app/actions/projects/type";
import { FaYoutube } from "react-icons/fa";
import { VscFilePdf } from "react-icons/vsc";

export default function ProjectPageClient({ project }: { project: Project }) {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const onWheel = (e: WheelEvent) => {
			if (el.scrollWidth > el.clientWidth) {
				if (
					(e.deltaY > 0 && el.scrollLeft + el.clientWidth < el.scrollWidth) ||
					(e.deltaY < 0 && el.scrollLeft > 0)
				) {
					e.preventDefault();
					el.scrollLeft += e.deltaY;
				}
			}
		};

		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, []);


	const listItem = (key: string, value: string) => (
		value &&
		<div className="flex gap-2 text-xl" key={key}>
			<p className="font-insitutrial_bold">{key} :</p><p className="font-insitutrial">{value}</p>
		</div>
	);

	return (
		<div>
			<div className="">
				<div
					ref={scrollRef}
					className="flex no-scrollbar overflow-x-auto space-x-[27px] pb-2 pl-[64px]"
				>
					{project.photos?.map((photo, idx) => (
						<img
							key={idx}
							src={photo}
							alt={`Project photo ${idx + 1}`}
							className="h-[535px] object-cover"
						/>
					))}
				</div>
			</div>

			<div className="grid px-16  mx-auto grid-cols-1 md:grid-cols-2 gap-8">
				<div className="md:col-span-1 sticky top-0 z-10 self-start bg-white pt-4">
					<h1 className={`bg-transparent text-pink text-5xl focus:outline-none font-insitutrial_bold`}
					>{project.title}</h1>
					<div className="mt-8 space-y-4 text-lg">
						<p className="text-pink text-3xl font-insitutrial_bold">Données techniques</p>
						<div className="flex gap-8">
							<div>
								{listItem("Lieu", project.address)}
								{listItem("Maître d’ouvrage", project.project_owner)}
								{listItem("Maîtrise d’oeuvre", project.project_management)}
								{listItem("Programme", project.program)}
							</div>
							<div>
								{listItem("Status", project.status)}
								{listItem("Livraison", project.delivery)}
								{listItem("Surface", project.surface)}
								{listItem("Budget", project.budget)}
							</div>
						</div>
					</div>
					<div className="mt-12 space-y-4 text-lg">
						<p className="text-pink text-3xl font-insitutrial_bold">À propos</p>
						<p className="font-insitutrial">{project.description}</p>
						<div className="mt-2 flex gap-6">
							<a href="/" className="flex items-center gap-2 cursor-pointer">
								<VscFilePdf size={30} />
								<p className="underline">Télécharger l’article presse</p>
							</a>
							<a href="/" className="flex items-center gap-2 cursor-pointer">
								<FaYoutube size={35} />
								<p className="underline">Voir la vidéo du projet</p>
							</a>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					{project.blueprints?.map((bp, idx) => (
						<div key={idx} className="">
							<img
								src={bp}
								alt={bp || `Blueprint ${idx + 1}`}
								className="w-full object-cover rounded mb-2"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
