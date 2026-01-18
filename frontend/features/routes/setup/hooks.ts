import { useRouter } from "next/navigation";
import { setupEndpoints } from "./endpoint";

export const useSetup = () => {
    const router = useRouter();

    const handleNameSubmit = async (name: string) => {
        try {
            const res = await setupEndpoints.updateName(name);
            if (res.status == "PENDING_IMAGE") {
                // ページ遷移
                router.push("/setup/image");
            };
        } catch (error) {
            alert("名前の設定に失敗しました");
        }
    };

    const handleImageSubmit = async (imageUrl: string) => {
        try {
            const res = await setupEndpoints.updateImage(imageUrl);
            if (res.status == "ACTIVE") {
                // ホームへ遷移
                router.push("/home");
            }
        } catch (error) {
            alert("画像の設定に失敗しました");
        }
    };

    return {
        handleNameSubmit,
        handleImageSubmit
    };
};