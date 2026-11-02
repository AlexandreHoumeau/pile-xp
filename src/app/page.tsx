"use client";
import { LogoAnimation } from "@/components/LogoAnimation";
import { capitalizeFirstLetter } from "@/utils/general";
import React, { useEffect, useState } from "react";
import { listProjectsByTag, listProjectsOverview } from "./actions/projects/list";
import { ProjectPreview } from "./actions/projects/type";
import { listTags } from "./actions/tag/list";

const Home: React.FC = () => {
  const [projects, setProjects] = useState<ProjectPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const fetchProjects = async (tag?: string) => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const data = tag ? await listProjectsByTag(tag) : await listProjectsOverview();
      if (data === null) throw new Error("Unable to load projects");
      setProjects(data);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
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

  const isNewProject = (createdAt: string | Date) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const projectDate = new Date(createdAt);
    return projectDate > oneMonthAgo;
  };

  return (
    <main className="md:px-8 px-4 mt-4 font-insitutrial">
      <div className="md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 md:px-4 lg:px-8">
        <div className="lg:col-span-3 col-span-2" />
        <div className="lg:pb-8 pb-4">
          <select
            disabled={isLoading}
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
        {isLoading && (
          <div className="md:col-span-3 lg:col-span-4 flex min-h-[50vh] items-center justify-center" role="status" aria-label="Chargement des projets">
            <LogoAnimation logo="/pile_xp_logo_animation_black.json" />
          </div>
        )}
        {!isLoading && loadError && (
          <div className="md:col-span-3 lg:col-span-4 px-6 py-16 text-center text-gray-500" role="alert">
            <p>Impossible de charger les projets pour le moment.</p>
            <button type="button" onClick={() => fetchProjects(selectedTag || undefined)} className="mt-4 font-insitutrial_bold text-pink">
              Réessayer
            </button>
          </div>
        )}
        {!isLoading && !loadError && projects.length === 0 && (
          <div className="md:col-span-3 lg:col-span-4 border border-gray-200 px-6 py-16 text-center text-gray-500">
            <p className="font-insitutrial_bold text-xl text-pink">Aucun projet disponible</p>
            <p className="mt-2 font-insitutrial">
              Aucun projet à afficher pour le moment.
            </p>
          </div>
        )}
        {!isLoading && !loadError && projects.map((project) => (
          <div key={project.id} className="relative">
            <a
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group w-full overflow-hidden transition-transform duration-300 hover:scale-105 z-10"
            >
              {project.photos && project.photos.length > 0 ? (
                <>
                  <div className="aspect-square w-full overflow-hidden z-10">
                    <img
                      src={project.photos[0]}
                      alt={project.title}
                      className="w-full h-full object-cover z-10"
                    />
                  </div>

                  {/* New badge */}
                  {project.created_at && isNewProject(project.created_at) && (
                    <img
                      src="/new.svg"
                      alt="New"
                      className="absolute -top-5 sm:-top-10 md:-top-12 left-2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 z-20 pointer-events-none"
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-slate-400 bg-opacity-50 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                    <div />
                    <p className="text-white font-insitutrial_bold text-xl text-center">
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
                <div className="aspect-square w-full border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500 flex items-center justify-center">
                  <div>
                    <p className="font-insitutrial_bold text-pink">{project.title}</p>
                    <p className="mt-2 font-insitutrial text-sm">Aucune image disponible</p>
                  </div>
                </div>
              )}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
