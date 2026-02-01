// APIを叩いた後の画面遷移ロジックを書く役割
import { useRouter } from "next/navigation";
import { setupEndpoints } from "./api/endpoint";
import { UserStatus } from "@/type/user";

export const useSetup = () => {
    const router = useRouter();

    const navigateByStatus = (status: UserStatus) => {
        console.log(`=== ステータス判定: ${status} ===`);
        switch (status) {
            case "ACTIVE":
                router.push("/home");
                break;
            case "PENDING_IMAGE":
                router.push("/setup/image");
                break;
            case "PENDING_NAME":
                router.push("/setup/name");
                break;
        }
    };

    const submitName = async (name: string) => {
        const res = await setupEndpoints.updateName(name);
        console.log("submitNameの中身：", res);
        navigateByStatus(res.status);
    };

    const submitImage = async (file: File) => {
        // ファイルをFormDataに変換
        const formData = new FormData();
        // face_imageのキー名はバックエンドと合わせる
        formData.append("face_image", file);

        const res = await setupEndpoints.updateImage(formData);
        console.log("submitImageの中身：", res);
        navigateByStatus(res.status);
    };

    return {
        submitName,
        submitImage,
        navigateByStatus,
    };
};