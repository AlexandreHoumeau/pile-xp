"use client";
import React, { useEffect, useState } from "react";
import { listProjects, listProjectsByTag } from "./actions/projects/list";
import { Project } from "./actions/projects/type";
import { getPublicUrl } from "./actions/files";
import { listTags } from "./actions/tag/list";
import { capitalizeFirstLetter } from "@/utils/general";

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const fetchProjects = async (tag?: string) => {
    const data = tag ? await listProjectsByTag(tag) : await listProjects();
    const refinedData = data?.map((project) => ({
      ...project,
      photos: getPublicUrl(project.photos),
    }));
    setProjects(refinedData || []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      const existingTags = await listTags();
      setTags(existingTags || []);
    };

    fetchTags();
  }, []);

  const handleTagSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = event.target.value;
    setSelectedTag(tag);
    await fetchProjects(tag || undefined);
  };

  return (
    <main className="px-8 font-insitutrial">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4 px-8">
        <div className="col-span-3" />
        <div className="pb-8">
          <select
            value={selectedTag}
            onChange={handleTagSelect}
            className="border text-gray-400 border-gray-300 p-2 w-full"
          >
            <option value="">Catégorie</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {capitalizeFirstLetter(tag)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
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
