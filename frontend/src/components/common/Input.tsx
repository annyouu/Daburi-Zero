import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
                {...props}
                className={`px-3 py-2 border rounded-md outline-none ring-offset-1 transition-all
                    ${error 
                        ? "border-red-500 focus:ring-2 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};