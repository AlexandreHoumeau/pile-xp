"use client";
import React, { useEffect, useState } from "react";
import { listProjects } from "./actions/projects/list";
import { Project } from "./actions/projects/type";
import { getPublicUrl } from "./actions/files";


const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const projectList = await listProjects();
      const refinedData = projectList?.map((project) => ({
        ...project,
        photos: getPublicUrl(project.photos),
      }));
      setProjects(refinedData || []);
    };

    fetchData();
  }, []);

  return (
    <main className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {projects.map((project) => (
          <a
            key={project.id}
            href={`/projects/${project.slug}`}
            className="transition-transform duration-300 hover:scale-105"
          >
            {project.photos && project.photos.length > 0 ? (
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={project.photos[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-gray-200 flex items-center justify-center rounded text-gray-500">
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
