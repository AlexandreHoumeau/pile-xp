import { Project } from "@/app/actions/projects/type";
import Link from "next/link";

type ProjectCardProps = {
  project: Project;
  onDelete?: (project: Project) => void;
  isDeleting?: boolean;
};

export default function ProjectCard({
  project,
  onDelete,
  isDeleting = false,
}: ProjectCardProps) {
  const coverPhoto = project.photos?.[0];

  return (
    <div className="border border-gray-200 bg-white">
      <Link href={`projects/${project.id}`} className="block">
        {coverPhoto ? (
          <img
            alt="Project image"
            src={coverPhoto}
            className="object-cover object-center h-[337px] w-full"
          />
        ) : (
          <div className="flex h-[337px] w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
            Aucune image
          </div>
        )}
      </Link>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <p className="truncate font-insitutrial_bold text-pink">{project.title}</p>
        </div>
        <button
          type="button"
          onClick={() => onDelete?.(project)}
          disabled={isDeleting}
          className="shrink-0 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-insitutrial_bold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Suppression..." : "Supprimer"}
        </button>
      </div>
    </div>
  );
}
