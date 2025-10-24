"use client";
import { useProjectSlugs } from '@/hooks/useProjectSlugs';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { slug } = useParams();
	const router = useRouter()
	const data = useProjectSlugs(slug as string);


	if (!data) return null;
	const { previousSlug, nextSlug } = data;

	const goToPrecedent = () => {
		router.push(`/projects/${previousSlug}`);
	}

	const goToSuivant = () => {
		window.location.href = `/projects/${nextSlug}`;
	}

	return (
		<div className="font-insitutrial">
			<div className="flex justify-between items-center px-16 py-4 mx-auto hidden lg:flex">
				<div onClick={goToPrecedent} className="cursor-pointer hover:text-pink transition" >
					<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						<FiChevronLeft style={{ fontSize: 20 }} />
						<p>Precedent</p>
					</div>
				</div>
				<div onClick={goToSuivant} className="cursor-pointer hover:text-pink transition" >
					<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						<p>Suivant</p>
						<FiChevronRight style={{ fontSize: 20 }} />
					</div>
				</div>
			</div>
			<main>{children}</main>
		</div>
	);
}