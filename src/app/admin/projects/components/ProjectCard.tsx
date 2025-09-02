import { Project } from "@/app/actions/projects/type";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`projects/${project.id}`} className="">
      <img
        src={project.photos[0]}
        className=" object-cover object-center h-[337px]"
      />
    </Link>
  );
}
