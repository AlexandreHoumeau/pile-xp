"use client";
import { useEffect, useRef, useState } from "react";

import { deleteProjectById } from "@/app/actions/projects/delete";
import { listProjects } from "@/app/actions/projects/list";
import { Project } from "@/app/actions/projects/type";
import Modal from "@/components/Modal";
import { AdminIconButton } from "@/components/admin/button/AdminIconButton";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import SortableProjectCard from "./components/SortableProjectCard";
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { reorderProjects } from "@/app/actions/projects/reorder";
import toast from "react-hot-toast";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [projectPendingDelete, setProjectPendingDelete] = useState<Project | null>(null);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const saving = useRef(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const getProjects = async () => {
    setIsLoading(true);
    try {
      const data = await listProjects();
      setProjects(data ?? []);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id || saving.current || deletingProjectId || loadError) return;
    const oldIndex = projects.findIndex((project) => project.id === active.id);
    const newIndex = projects.findIndex((project) => project.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const previous = projects;
    const reordered = arrayMove(projects, oldIndex, newIndex);
    saving.current = true;
    setIsSaving(true);
    setProjects(reordered);
    try {
      const result = await reorderProjects(reordered.map((p) => String(p.id)), previous.map((p) => String(p.id)));
      if (result.error) throw new Error(result.error);
      toast.success("Ordre des projets enregistré.");
    } catch (error) {
      setProjects(previous);
      toast.error(error instanceof Error ? error.message : "Impossible d’enregistrer l’ordre.");
      // Reconcile even if the response was lost after the transaction committed.
      await getProjects();
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  };

  const confirmDelete = (project: Project) => {
    if (!saving.current) setProjectPendingDelete(project);
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
      <p className="mb-4 text-sm" role="status">{isSaving ? "Enregistrement de l’ordre…" : "Déplacez les projets avec la poignée (ou Espace puis les flèches au clavier)."}</p>
      {loadError && <p role="alert" className="mb-4 text-red-600">Impossible de charger les projets pour le moment. <button onClick={getProjects} className="underline">Réessayer</button></p>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={projects.map((p) => p.id)} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2" aria-busy={isSaving || isLoading}>
        {projects.map((project) => (
          <SortableProjectCard
            key={project.id}
            project={project}
            disabled={isSaving || isLoading || loadError || Boolean(deletingProjectId) || Boolean(projectPendingDelete)}
            onDelete={confirmDelete}
            isDeleting={deletingProjectId === project.id}
          />
        ))}
      </div>
      </SortableContext>
      </DndContext>
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
