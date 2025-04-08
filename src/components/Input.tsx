import React from "react";

interface InputComponentProps {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}

export const InputComponent: React.FC<InputComponentProps> = ({
  label,
  required = false,
  type = "text",
  placeholder = "",
  ...props
}) => {
  return (
    <div className="relative border border-black p-1">
      <div className="absolute -top-[16px] left-2 bg-white px-1">
        <span className="text-lg font-insitutrial_bold">{label}</span>
        {required && <span className="text-green-500">*</span>}
      </div>
      <input
        type={type}
        className="w-full border-none focus:outline-none p-2 pt-4"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
