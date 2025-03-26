"use client";
import { useEffect, useState } from "react";
import ProjectCard from "./components/ProjectCard";
import { listProjects } from "@/app/actions/projects";
import { useRouter } from "next/navigation";

export default function Projects() {
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const router = useRouter()

  const getProjects = async () => {
    const data = await listProjects();
    setProjects(data);
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="min-h-full bg-white rounded-lg border-[1px] p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/admin/projects/new')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          + Add Project
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* {isModalOpen && (
        <AddProjectModal
          onClose={() => setModalOpen(false)}
          onAdd={handleAddProject}
        />
      )} */}
    </div>
  );
}
