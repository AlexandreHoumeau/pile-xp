"use client";
import { capitalizeFirstLetter, getPublicUrl } from "@/utils/general";
import React, { useEffect, useState } from "react";
import { listProjectsByTag, listProjectsOverview } from "./actions/projects/list";
import { ProjectPreview } from "./actions/projects/type";
import { listTags } from "./actions/tag/list";

const Home: React.FC = () => {
  const [projects, setProjects] = useState<ProjectPreview[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const fetchProjects = async (tag?: string) => {
    const data = tag ? await listProjectsByTag(tag) : await listProjectsOverview();
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
    <main className="md:px-8 px-4 mt-4 font-insitutrial">
      <div className="md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 md:px-4 lg:px-8">
        <div className="lg:col-span-3 col-span-2" />
        <div className="lg:pb-8 pb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8 md:px-4 lg:px-8">
        {projects.map((project) => (
          <a
            key={project.id}
            href={`/projects/${project.slug}`}
            className="relative group w-full overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            {project.photos && project.photos.length > 0 ? (
              <>
                <div className="aspect-square w-full overflow-hidden z-0">
                  <img
                    src={project.photos[0]}
                    alt={project.title}
                    className="w-full h-full object-cover z-0"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-pink bg-opacity-50 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                  <div />
                  <p className="text-white font-insitutrial_bold text-lg text-center">
                    {project.title}
                  </p>

                  {/* Collaborators at bottom */}
                  {project.colaborators ? (
                    <p className="text-white font-insitutrial_bold text-base text-center">
                      {project.colaborators}
                    </p>
                  ) : <div />
                  }
                </div>
              </>
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
