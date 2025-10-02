"use client";

import { FaTimes } from "react-icons/fa";
import { useState } from "react";

export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
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
    </div>
  );
}
