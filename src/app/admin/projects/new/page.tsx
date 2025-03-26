"use client";
import { addProjects } from "@/app/actions/projects";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function AddProject() {
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState([""]);
  const [images, setImages] = useState([""]);
  const [links, setLinks] = useState([""]);
  const [dates, setDates] = useState([""]);

  const handleAddField = (state: any, setState: any) =>
    setState([...state, ""]);

  const handleRemoveField = (index: any, state: any, setState: any) => {
    const newState = [...state];
    newState.splice(index, 1);
    setState(newState);
  };

  const handleChangeField = (
    index: any,
    value: any,
    state: any,
    setState: any
  ) => {
    const newState = [...state];
    newState[index] = value;
    setState(newState);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const projectData = {
      title,
      descriptions,
      images,
      links,
    };

    const response = await addProjects(projectData);
    redirect("/admin/projects");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-2">Project Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-gray-700 mb-2">Descriptions</label>
            {descriptions.map((desc, index) => (
              <div key={index} className="flex items-center mb-3 space-x-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={desc}
                  onChange={(e) =>
                    handleChangeField(
                      index,
                      e.target.value,
                      descriptions,
                      setDescriptions
                    )
                  }
                  placeholder={`Description ${index + 1}`}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-2 rounded-lg"
                  onClick={() =>
                    handleRemoveField(index, descriptions, setDescriptions)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleAddField(descriptions, setDescriptions)}
            >
              + Add Description
            </button>
          </div>

          {/* Images */}
          <div>
            <label className="block text-gray-700 mb-2">Images</label>
            {images.map((img, index) => (
              <div key={index} className="flex items-center mb-3 space-x-3">
                <input
                  type="url"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={img}
                  onChange={(e) =>
                    handleChangeField(index, e.target.value, images, setImages)
                  }
                  placeholder={`Image URL ${index + 1}`}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-2 rounded-lg"
                  onClick={() => handleRemoveField(index, images, setImages)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleAddField(images, setImages)}
            >
              + Add Image
            </button>
          </div>

          {/* Links */}
          <div>
            <label className="block text-gray-700 mb-2">Links</label>
            {links.map((link, index) => (
              <div key={index} className="flex items-center mb-3 space-x-3">
                <input
                  type="url"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={link}
                  onChange={(e) =>
                    handleChangeField(index, e.target.value, links, setLinks)
                  }
                  placeholder={`Link ${index + 1}`}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-2 rounded-lg"
                  onClick={() => handleRemoveField(index, links, setLinks)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleAddField(links, setLinks)}
            >
              + Add Link
            </button>
          </div>

          {/* Dates */}
          <div>
            <label className="block text-gray-700 mb-2">Dates</label>
            {dates.map((date, index) => (
              <div key={index} className="flex items-center mb-3 space-x-3">
                <input
                  type="date"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={date}
                  onChange={(e) =>
                    handleChangeField(index, e.target.value, dates, setDates)
                  }
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-2 rounded-lg"
                  onClick={() => handleRemoveField(index, dates, setDates)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleAddField(dates, setDates)}
            >
              + Add Date
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
