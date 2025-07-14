import { ButtonHTMLAttributes } from "react";

interface SpinnerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
}

export default function SpinnerButton({ isLoading, children, ...props }: SpinnerButtonProps) {
    return (
        <button {...props} disabled={props.disabled || isLoading} className={`${props.className} relative flex items-center justify-center`}>
            {isLoading && (
                <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-4.5L12 0v4a8 8 0 01-8 8z" />
                </svg>
            )}
            {children}
        </button>
    );
}
