import { getProjectBySlug } from "@/app/actions/projects/get";
import { Project } from "@/app/actions/projects/type";
import ProjectPageClient from "./ProjectPageClient";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project: Project | null = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl text-gray-500">Project not found.</span>
      </div>
    );
  }

  return <ProjectPageClient project={project} />;
}
