import React from 'react';
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="font-insitutrial">
			<div className="flex justify-between items-center px-16 py-4 mx-auto">
				<a href="/projects/precedent">
					<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						<FiChevronLeft style={{ fontSize: 20 }} />
						<p>Precedent</p>
					</div>
				</a>
				<a href="/projects/suivant">
					<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						<p>Suivant</p>
						<FiChevronRight style={{ fontSize: 20 }} />
					</div>
				</a>
			</div>
			<main>{children}</main>
		</div>
	);
}