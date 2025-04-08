import React from "react";

type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.JSX.Element;
};
export const AdminIconButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className = "",
  icon,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-4 text-left font-insitutrial_bold disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[180px] min-h-[86px] ${className}`}
      {...props}
    >
      {icon ?? icon}
      {label}
    </button>
  );
};
