"use client";

import { FaTimes } from "react-icons/fa";
import { useState } from "react";

export function TagInput({
  value,
  onChange,
  placeholder,
  existingTags = [],
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  existingTags?: string[];
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleExistingTagClick = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-insitutrial_bold text-pink text-2xl">Programme</label>
      <div className="flex flex-wrap gap-2 border border-black p-4">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex text-pink items-center gap-1 px-2 py-1 border-pink border"
          >
            {tag}
            <FaTimes
              className="cursor-pointer text-pink"
              onClick={() => removeTag(tag)}
            />
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className="flex-1 bg-transparent focus:outline-none"
        />
      </div>
      {existingTags.length > 0 && (
        <div className="mt-2">
          <div className="text-sm text-gray-500 mb-1">Existing tags:</div>
          <div className="flex flex-wrap gap-2">
            {existingTags
              .filter((tag) => !value.includes(tag))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="px-2 py-1 border border-gray-300 rounded text-gray-700 hover:bg-pink hover:text-white transition"
                  onClick={() => handleExistingTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
