"use client"
import React from "react";
import TextareaAutosize from 'react-textarea-autosize';

interface TextareaComponentProps {
  label: string;
  required?: boolean;
  placeholder?: string;
}

const TextareaComponent: React.FC<TextareaComponentProps> = ({
  label,
  required = false,
  placeholder = "",
  ...props
}) => {
  return (
    <div className="relative border mt-2 border-black p-1">
      <div className="absolute -top-[16px] left-2 bg-white px-1">
        <span className="text-lg  font-insitutrial_bold">{label}</span>
        {required && (
          <span className="text-green font-insitutrial_bold"> *</span>
        )}
      </div>
      <TextareaAutosize 
        className="w-full border-none focus:outline-none p-2 pt-4 resize-none h-24"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default TextareaComponent;
