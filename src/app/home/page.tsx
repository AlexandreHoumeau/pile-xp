"use client";
import React, { useEffect, useState } from "react";
import { listProjects } from "../actions/projects/list";
import { Project } from "../actions/projects/type";
import { getPublicUrl } from "../actions/files";

const Home: React.FC = () => {
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const projectList = await listProjects()

			const refinedData = projectList?.map((project) => ({
				...project,
				photos: getPublicUrl(project.photos),
			}));
			setProjects(refinedData!);
		};

		fetchData();
	}, []);

	return (
		<main className="p-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{projects.map((project) => (
					<a
						key={project.id}
						href={`/projects/${project.slug}`}
						// className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center p-4"
					>
						{project.photos && project.photos.length > 0 ? (
							<img
								src={project.photos[0]}
								alt={project.title}
								className="w-[320px] h-[320px] object-cover mb-4"
							/>
						) : (
							<div className="w-[300px] h-[300px] bg-gray-200 flex items-center justify-center rounded mb-4 text-gray-500">
								No photo
							</div>
						)}
					</a>
				))}
			</div>
		</main>
	);
};

export default Home;
