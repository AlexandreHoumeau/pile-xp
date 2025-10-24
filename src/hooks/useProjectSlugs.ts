// hooks/useProjectSlugs.ts
"use client";

import { useEffect, useState } from "react";
import { listProjectsBySlug } from "@/app/actions/projects/list";

export function useProjectSlugs(currentSlug: string) {
	const [data, setData] = useState<{
		slugs: string[];
		currentIndex: number;
		previousSlug: string;
		nextSlug: string;
	}>();

	useEffect(() => {
		const fetch = async () => {
			const slugs = await listProjectsBySlug();
			const currentIndex = slugs.findIndex(s => s === currentSlug);
			const previousSlug =
				currentIndex > 0 ? slugs[currentIndex - 1] : slugs[slugs.length - 1];
			const nextSlug =
				currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : slugs[0];
			setData({ slugs, currentIndex, previousSlug, nextSlug });
		};
		fetch();
	}, [currentSlug]);

	return data;
}
