"use client";
import { useEffect, useState } from "react";

import { listProjects } from "@/app/actions/projects/list";
import { Project } from "@/app/actions/projects/type";
import { AdminIconButton } from "@/components/admin/button/AdminIconButton";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import ProjectCard from "./components/ProjectCard";

const URL_SUFFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/`;

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  const getProjects = async () => {
    const data = await listProjects();

    const refinedData = data?.map((project) => ({
      ...project,
      blueprints: getPublicUrl(project.blueprints),
      photos: getPublicUrl(project.photos),
    }));
    setProjects(refinedData!);
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="min-h-ful">
      <div className="flex justify-between items-center mb-6">
        <AdminIconButton
          className="text-white rounded-md bg-pink hover:opacity-70"
          onClick={() => router.push("/admin/projects/new")}
          label="Ajouter un projet"
          icon={<IoAddCircleOutline size={30} className="mb-2" />}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

const getPublicUrl = (paths: string[]) => {
  return paths.map((path) => URL_SUFFIX + path);
};
