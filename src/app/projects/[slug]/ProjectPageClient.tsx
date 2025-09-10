// app/projects/[slug]/ProjectPageClient.tsx (Client Component)
"use client";

import React, { useRef, useEffect } from "react";
import { Project } from "@/app/actions/projects/type";

export default function ProjectPageClient({ project }: { project: Project }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        if (
          (e.deltaY > 0 && el.scrollLeft + el.clientWidth < el.scrollWidth) ||
          (e.deltaY < 0 && el.scrollLeft > 0)
        ) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div>
      {/* Photos horizontal scroll */}
      <div className="mb-8">
        <div
          ref={scrollRef}
          className="flex no-scrollbar overflow-x-auto space-x-[27px] pb-2 pl-[64px]"
        >
          {project.photos?.map((photo, idx) => (
            <img
              key={idx}
              src={photo}
              alt={`Project photo ${idx + 1}`}
              className="h-[535px] object-cover"
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="grid p-8 max-w-6xl mx-auto grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          <p className="text-gray-700 mb-6">{project.description}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Blueprints</h2>
          <div className="space-y-4">
            {project.blueprints?.map((bp, idx) => (
              <div key={idx} className="bg-blue-50 p-4 rounded-lg shadow">
                <img
                  src={bp}
                  alt={bp || `Blueprint ${idx + 1}`}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
