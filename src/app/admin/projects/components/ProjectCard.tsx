export default function ProjectCard({ project }: { project: any }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
      <p className="text-gray-600 mt-2">{project.description}</p>
    </div>
  );
}
