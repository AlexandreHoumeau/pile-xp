"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa6";

export function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-300 py-4 px-6">
      <button
        className="flex justify-between items-center w-full text-left font-insitutrial_bold text-2xl focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        {question}
        <span className="text-xl transition-transform duration-300 ">
          {open ? <FaChevronDown /> : <FaChevronUp />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <p className="font-insitutrial text-lg text-gray-700">{answer}</p>
      </div>
    </div>
  );
}
