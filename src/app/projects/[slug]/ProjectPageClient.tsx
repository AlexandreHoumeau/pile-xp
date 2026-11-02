"use client";

import { Project } from "@/app/actions/projects/type";
import BlueprintImage from "@/components/BlueprintImage";
import { useProjectSlugs } from "@/hooks/useProjectSlugs";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { VscFilePdf } from "react-icons/vsc";

export default function ProjectPageClient({ project }: { project: Project }) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const infoSectionRef = useRef<HTMLDivElement>(null);
	const [showPhotosButton, setShowPhotosButton] = useState(false);
	const [blueprintSelection, setBlueprintSelection] = useState({ projectId: project.id, index: 0 });
	const blueprintIndex = blueprintSelection.projectId === project.id
		? blueprintSelection.index % Math.max(project.blueprints.length, 1)
		: 0;
	const { slug } = useParams();
	const router = useRouter()
	const data = useProjectSlugs(slug as string);
	const { previousSlug, nextSlug } = data || {};
	const hasPhotos = Boolean(project.photos?.length);
	const hasBlueprints = Boolean(project.blueprints?.length);
	const technicalInfo = [
		["Lieu", project.address],
		["Maître d’ouvrage", project.project_owner],
		["Maîtrise d’œuvre", project.project_management],
		["Statut", project.status],
		["Livraison", project.delivery],
		["Surface", project.surface],
		["Budget", project.budget],
	].filter(([, value]) => value?.trim());

	// Horizontal scroll for images
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const onWheel = (e: WheelEvent) => {
			// Preserve zoom gestures and native horizontal trackpad scrolling.
			if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
			const maxScroll = el.scrollWidth - el.clientWidth;
			if (maxScroll <= 1 || e.deltaY === 0 || !e.cancelable) return;

			const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
			const start = Math.max(0, Math.min(maxScroll, el.scrollLeft));
			let target = Math.max(0, Math.min(maxScroll, start + delta));
			// Snap to the edge to avoid trapping fractional scroll positions.
			if (delta > 0 && maxScroll - target <= 1) target = maxScroll;
			if (delta < 0 && target <= 1) target = 0;

			e.preventDefault();
			el.scrollLeft = target;
			const remaining = delta - (target - start);
			// Explicitly continue the same gesture down the page at either edge.
			if (Math.abs(remaining) > 1) {
				window.scrollBy({ top: remaining, behavior: "instant" });
			}
		};

		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, []);

	// Detect when we’ve scrolled past the “Données techniques” section
	useEffect(() => {
		const handleScroll = () => {
			const infoTop = infoSectionRef.current
				? infoSectionRef.current.getBoundingClientRect().top + window.scrollY
				: Infinity;
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
		value?.trim() && (
			<div className="flex flex-wrap gap-x-2 text-sm sm:text-base" key={key}>
				<p className="font-insitutrial_bold">{key} :</p>
				<p className="font-insitutrial">{value}</p>
			</div>
		);

	const goToNext = () => {
		if (previousSlug) {
			router.push(`/projects/${previousSlug}`);
		}
	}

	const goToPrevious = () => {
		if (nextSlug) {
			window.location.href = `/projects/${nextSlug}`;
		}
	}



	return (
		<div className="relative">
			<div className="fixed lg:hidden bottom-5 z-10 gap-4 flex items-center left-1/2 transform -translate-x-1/2 -translate-y-1/2">

				<div className="bg-pink p-2 rounded-full" onClick={goToPrevious}>
					<FiChevronLeft style={{ fontSize: 20 }} className="text-white" />
				</div>

				<div
					onClick={showPhotosButton ? scrollToPhotos : scrollToInfos}
					className=" shadow-2xl bg-pink z-0 p-2 px-8 rounded-full text-white text-xl  cursor-pointer transition-all duration-300"
				>
					<p className="text-sm sm:text-base z-0">{showPhotosButton ? "Photos" : "Infos"}</p>
				</div>
				<div className="bg-pink p-2 rounded-full" onClick={goToNext}>
					<FiChevronRight style={{ fontSize: 20 }} className="text-white" />
				</div>


			</div>

			<div className="lg:px-16 md:px-12 px-4">
				<section>
					<h1 className="lg:hidden pt-6 pb-4 text-3xl sm:text-4xl text-pink font-insitutrial_bold">{project.title}</h1>
					<div
						ref={scrollRef}
						className="min-w-0 grid grid-cols-1 gap-4 md:gap-8 lg:flex lg:gap-6 no-scrollbar lg:overflow-x-auto lg:h-[calc(100svh-20rem)] lg:min-h-[20rem] pb-2"
					>
						{hasPhotos ? project.photos.map((photo, idx) => (
							<img
								key={idx}
								src={photo}
								alt={`${project.title} — photo ${idx + 1}`}
								className="w-full h-auto lg:w-auto lg:h-full lg:max-w-none lg:shrink-0 object-contain"
							/>
						)) : (
							<div className="aspect-square lg:aspect-auto w-full border border-dashed border-gray-300 bg-gray-50 text-gray-500 flex items-center justify-center">
								<p>Aucune photo disponible pour ce projet</p>
							</div>
						)}
					</div>

					<div ref={infoSectionRef} className="mt-6 scroll-mt-48">
						<h1 className="hidden lg:block text-pink text-3xl xl:text-4xl font-insitutrial_bold mb-3 break-words">{project.title}</h1>
						<h2 className="text-pink text-lg font-insitutrial_bold">Données techniques</h2>
					</div>
				</section>

				<section className="mt-4 pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 lg:gap-8 items-start">
					<div className="min-w-0">
						{technicalInfo.length > 0 && (
							<>
								<div className="space-y-2">
									{technicalInfo.map(([label, value]) => listItem(label, value))}
								</div>
							</>
						)}

					<div className="mt-10 space-y-4 text-sm leading-relaxed">
						{project.description?.trim() && (
							<>
								<h2 className="text-pink text-lg font-insitutrial_bold">À propos</h2>
								<p className="whitespace-pre-line">{project.description}</p>
							</>
						)}
						<div className="flex flex-col gap-4">
							{project.pdf_url && (
								<Link href={project.pdf_url} target="_blank" className="flex items-center gap-2">
									<VscFilePdf size={24} />
									<span className="underline">Télécharger l’article presse</span>
								</Link>
							)}
							{project.youtube_url && (
								<Link target="_blank" href={project.youtube_url} className="flex items-center gap-2">
									<FaYoutube size={24} />
									<span className="underline">Voir la vidéo du projet</span>
								</Link>
							)}
						</div>
					</div>
					</div>
					{hasBlueprints && (
						<div className="order-last w-full min-w-0 self-start">
							<button
								type="button"
								onClick={() => setBlueprintSelection({ projectId: project.id, index: (blueprintIndex + 1) % project.blueprints.length })}
								disabled={project.blueprints.length < 2}
								aria-label={`Plan ${blueprintIndex + 1} sur ${project.blueprints.length}${project.blueprints.length > 1 ? " — afficher le plan suivant" : ""}`}
								className="block w-full p-0 align-top focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink disabled:cursor-default"
							>
								<BlueprintImage key={project.blueprints[blueprintIndex]} src={project.blueprints[blueprintIndex]} alt={`Plan ${blueprintIndex + 1} — ${project.title}`} />
							</button>
							{project.blueprints.length > 1 && (
								<p className="mt-3 text-center text-xs text-gray-500" aria-live="polite">{blueprintIndex + 1} / {project.blueprints.length} · Cliquer pour le plan suivant</p>
							)}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
