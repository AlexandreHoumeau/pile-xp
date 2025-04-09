"use client";
import { useEffect } from "react";

import { AdminIconButton } from "@/components/admin/button/AdminIconButton";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";

export default function Projects() {
  const router = useRouter();

  const getProjects = async () => {};

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="min-h-ful">
      <div className="flex justify-between items-center mb-6">
        <AdminIconButton
          className="text-white bg-pink rounded-lg hover:opacity-70"
          onClick={() => router.push("/admin/projects/new")}
          label="Ajouter un projet"
          icon={<IoAddCircleOutline size={30} className="mb-2" />}
        />
      </div>
    </div>
  );
}
