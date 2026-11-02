"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { Project } from "@/app/actions/projects/type";
import ProjectCard from "./ProjectCard";

export default function SortableProjectCard({ project, disabled, onDelete, isDeleting }: {
  project: Project;
  disabled: boolean;
  onDelete: (project: Project) => void;
  isDeleting: boolean;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
    disabled,
  });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`min-w-0 ${isDragging ? "relative z-10 opacity-70" : ""}`}>
      <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners}
        disabled={disabled} aria-label={`Déplacer ${project.title}`}
        className="flex w-full touch-none items-center gap-2 border border-b-0 border-gray-200 bg-gray-50 px-3 py-2 text-sm cursor-grab active:cursor-grabbing disabled:opacity-50">
        <MdDragIndicator aria-hidden="true" /> Déplacer
      </button>
      <ProjectCard project={project} onDelete={onDelete} isDeleting={isDeleting} disabled={disabled} />
    </div>
  );
}
