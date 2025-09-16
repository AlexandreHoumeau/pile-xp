"use client";
import { listProjectsBySlug } from '@/app/actions/projects/list';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { slug } = useParams();
	const [slugs, setSlugs] = useState<string[] | []>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	useEffect(() => {
		const getSlugs = async () => {
			const data = await listProjectsBySlug();
			const currentIndex = data.findIndex(s => s === slug);
			setSlugs(data)
			setCurrentIndex(currentIndex);
		}
		getSlugs();
	}, []);

	const precedentSlug = currentIndex > 0 ? slugs[currentIndex - 1] : slugs[slugs.length - 1];
	const suivantSlug = currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : slugs[0];

	const goToPrecedent = () => {
		window.location.href = `/projects/${precedentSlug}`;
	}

	const goToSuivant = () => {
		window.location.href = `/projects/${suivantSlug}`;
	}

	return (
		<div className="font-insitutrial">
			<div className="flex justify-between items-center px-16 py-4 mx-auto">
				<div onClick={goToPrecedent} className="cursor-pointer hover:text-pink transition" >
					<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						<FiChevronLeft style={{ fontSize: 20 }} />
						<p>Precedent</p>
					</div>
				</div>
				<div  onClick={goToSuivant} className="cursor-pointer hover:text-pink transition" >
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