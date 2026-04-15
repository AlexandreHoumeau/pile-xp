"use client";
import { useEffect, useState } from "react";

import { deleteProjectById } from "@/app/actions/projects/delete";
import { listProjects } from "@/app/actions/projects/list";
import { Project } from "@/app/actions/projects/type";
import Modal from "@/components/Modal";
import { AdminIconButton } from "@/components/admin/button/AdminIconButton";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import ProjectCard from "./components/ProjectCard";
import toast from "react-hot-toast";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [projectPendingDelete, setProjectPendingDelete] = useState<Project | null>(null);
  const router = useRouter();

  const getProjects = async () => {
    const data = await listProjects();
    setProjects(data ?? []);
  };

  useEffect(() => {
    getProjects();
  }, []);

  const confirmDelete = (project: Project) => {
    setProjectPendingDelete(project);
  };

  const handleDelete = (project: Project) => {
    setDeletingProjectId(project.id);

    toast.promise(
      async () => {
        await deleteProjectById(project.id);
        setProjects((previousProjects) =>
          previousProjects.filter((existingProject) => existingProject.id !== project.id)
        );
      },
      {
        loading: "Deleting...",
        success: "Project deleted!",
        error: (err) => err.message || "Something went wrong.",
      }
    ).finally(() => {
      setDeletingProjectId(null);
      setProjectPendingDelete(null);
    });
  };

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
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={confirmDelete}
            isDeleting={deletingProjectId === project.id}
          />
        ))}
      </div>
      <Modal
        isOpen={Boolean(projectPendingDelete)}
        onClose={() => {
          if (!deletingProjectId) {
            setProjectPendingDelete(null);
          }
        }}
      >
        <h2 className="mb-2 text-xl font-insitutrial_bold">
          Supprimer ce projet ?
        </h2>
        <p className="mb-2 text-center font-insitutrial italic">
          Les photos, blueprints et le PDF associes seront aussi supprimes. Cette action est irreversible.
        </p>
        {projectPendingDelete ? (
          <p className="text-center font-insitutrial_bold text-pink">
            {projectPendingDelete.title}
          </p>
        ) : null}
        <div className="mt-4 flex justify-between">
          <AdminIconButton
            label="Annuler"
            onClick={() => setProjectPendingDelete(null)}
            disabled={Boolean(deletingProjectId)}
            className="min-h-max rounded-lg border text-center hover:bg-gray-100"
          />
          <AdminIconButton
            label={deletingProjectId ? "Suppression..." : "Supprimer"}
            onClick={() => {
              if (projectPendingDelete) {
                handleDelete(projectPendingDelete);
              }
            }}
            disabled={!projectPendingDelete || Boolean(deletingProjectId)}
            className="min-h-max rounded-lg border border-red-200 bg-red-100 text-center text-red-500 hover:bg-red-200"
          />
        </div>
      </Modal>
    </div>
  );
}
