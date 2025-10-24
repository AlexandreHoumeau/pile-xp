"use client";

import React, { useRef, useEffect, useState } from "react";
import { Project } from "@/app/actions/projects/type";
import { FaYoutube } from "react-icons/fa";
import { VscFilePdf } from "react-icons/vsc";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useParams, useRouter } from 'next/navigation';
import { useProjectSlugs } from "@/hooks/useProjectSlugs";

export default function ProjectPageClient({ project }: { project: Project }) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const infoSectionRef = useRef<HTMLDivElement>(null);
	const [showPhotosButton, setShowPhotosButton] = useState(false);
	const { slug } = useParams();
	const router = useRouter()
	const data = useProjectSlugs(slug as string);
	const { previousSlug, nextSlug } = data || {};

	// Horizontal scroll for images
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

	// Detect when we’ve scrolled past the “Données techniques” section
	useEffect(() => {
		const handleScroll = () => {
			const infoTop = infoSectionRef.current?.offsetTop || 0;
			const scrollY = window.scrollY;
			setShowPhotosButton(scrollY + window.innerHeight / 2 > infoTop);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToInfos = () => {
		if (infoSectionRef.current) {
			infoSectionRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const scrollToPhotos = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const listItem = (key: string, value: string) =>
		value && (
			<div className="flex gap-2 lg:text-lg text-base 2xl:text-xl" key={key}>
				<p className="font-insitutrial_bold">{key} :</p>
				<p className="font-insitutrial">{value}</p>
			</div>
		);

	const goToNext = () => {
		router.push(`/projects/${previousSlug}`);
	}

	const goToPrevious = () => {
		window.location.href = `/projects/${nextSlug}`;
	}



	return (
		<div className="relative">
			<div className="fixed bottom-5 z-50 gap-4 flex items-center left-1/2 transform -translate-x-1/2 -translate-y-1/2">

				<div className="bg-pink p-2 rounded-full" onClick={goToPrevious}>
					<FiChevronLeft style={{ fontSize: 20 }} className="text-white" />
				</div>

				<div
					onClick={showPhotosButton ? scrollToPhotos : scrollToInfos}
					className=" shadow-2xl bg-pink p-2 px-8 rounded-full text-white text-xl lg:hidden cursor-pointer transition-all duration-300"
				>
					<p className="text-sm sm:text-base">{showPhotosButton ? "Photos" : "Infos"}</p>
				</div>
				<div className="bg-pink p-2 rounded-full" onClick={goToNext}>
					<FiChevronRight style={{ fontSize: 20 }} className="text-white" />
				</div>


			</div>

			<div className="lg:p0 md:px-12 px-4">
				<div className="flex justify-between lg:flex md:text-5xl text-3xl text-pink lg:pl-16 pt-8 pb-4 lg:hidden">
					<h1 className="font-insitutrial_bold">{project.title}</h1>
					<p className="font-insitutrial">{project.delivery}</p>
				</div>

				<div
					ref={scrollRef}
					className="lg:flex grid grid-cols-1 space-y-4 md:space-y-8 lg:space-y-0 no-scrollbar lg:overflow-x-auto lg:space-x-[27px] pb-2 lg:pl-[64px]"
				>
					{project.photos?.map((photo, idx) => (
						<img
							key={idx}
							src={photo}
							alt={`Project photo ${idx + 1}`}
							className="lg:h-[535px] -z-10 object-cover"
						/>
					))}
				</div>
			</div>

			{/* Info Section */}
			<div ref={infoSectionRef} className="lg:grid lg:px-16 px-4 mx-auto grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="grid gap-8 order-last">
					{project.blueprints?.map((bp, idx) => (
						<div key={idx} className="aspect-square -z-10 overflow-hidden">
							<img
								src={bp}
								alt={`Blueprint ${idx + 1}`}
								className="h-full w-full -z-10 object-cover"
							/>
						</div>
					))}
				</div>

				<div className="lg:col-span-1 sticky top-0 -z-10 self-start bg-white pt-4">
					<h1 className="bg-transparent text-pink text-5xl focus:outline-none font-insitutrial_bold hidden lg:block mb-8">
						{project.title}
					</h1>

					{/* Données techniques */}
					<div className="mt-8 lg:space-y-4 space-y-2 text-lg">
						<p className="text-pink text-lg lg:text-3xl font-insitutrial_bold">Données techniques</p>
						<div className="lg:flex gap-8">
							<div className="mb-4 lg:mb-0">
								{listItem("Lieu", project.address)}
								{listItem("Maître d’ouvrage", project.project_owner)}
								{listItem("Maîtrise d’oeuvre", project.project_management)}
								{listItem("Status", project.status)}
							</div>
							<div>
								{listItem("Livraison", project.delivery)}
								{listItem("Surface", project.surface)}
								{listItem("Budget", project.budget)}
							</div>
						</div>
					</div>

					{/* À propos */}
					<div className="mt-12 space-y-4 text-lg">
						<p className="text-pink text-lg lg:text-3xl font-insitutrial_bold">À propos</p>
						<p className="font-insitutrial lg:text-lg text-base">{project.description}</p>
						<div className="mt-2 lg:flex gap-6">
							<Link href="/" className="flex items-center gap-2 cursor-pointer">
								<VscFilePdf size={30} />
								<p className="underline">Télécharger l’article presse</p>
							</Link>
							<Link href="/" className="flex items-center gap-2 cursor-pointer">
								<FaYoutube size={35} />
								<p className="underline">Voir la vidéo du projet</p>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
