import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1.5 w-full text-left">
            <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
            <input
                {...props}
                className={`px-4 py-3 border rounded-xl outline-none transition-all
                    ${error 
                        ? "border-red-500 focus:ring-2 focus:ring-red-500" 
                        : "border-gray-200 focus:border-[#7C74F7] focus:ring-4 focus:ring-[#7C74F7]/10 bg-gray-50 focus:bg-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};