import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/common/Input";
import { useSetupName } from "../hooks/useSetupName";

export const NameSetupForm = () => {
    const [name, setName] = useState("");
    const { isLoading, error, handleSetupName } = useSetupName();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || isLoading) return;

        const result = await handleSetupName({ name });

        if (result) {
            navigate("/setup/image");
        }
    };

    return (
        <div className="w-full p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Profile Setup
                </h1>
                <p className="text-gray-600">
                    あなたの名前を教えてください
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                    <Input
                        label="Name"
                        type="text"
                        placeholder="例: たろう"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        required
                        autoFocus 
                    />
                    {error && (
                        <p className="text-sm text-red-500 mt-1">{error}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!name || isLoading}
                    className={`
                        w-full py-3 px-4 font-bold rounded-xl transition-all shadow-md
                        active:scale-[0.98]
                        ${
                        name && !isLoading
                            ? "bg-[#7C74F7] text-white hover:bg-[#6A62E5]"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }
                    `}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        保存中...
                        </span>
                    ) : (
                        "次へ進む"
                    )}
                </button>
            </form>
        </div>
    );
};