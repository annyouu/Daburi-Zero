import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/login";
import { UserLoginInput, UserStatus } from "../types"
import Cookies from "js-cookie";

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const navigateByStatus = (status: UserStatus) => {
        switch (status) {
            case 'PENDING_NAME':
                navigate('/setup/name');
                break;
            case 'PENDING_IMAGE':
                navigate('/setup/image');
                break;
            case 'ACTIVE':
                navigate('/home');
                break;
            default:
                navigate('/login');
        }
    };

    const handleLogin = async (data: UserLoginInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await loginApi(data);

            // トークンをCookieに保存
            if (res.token) {
                Cookies.set("token", res.token, { expires: 1 });
            }

            // ステータスに合わせて遷移する
            navigateByStatus(res.status);

        } catch(error: any) {
            console.error("Login エラー:", error)
            const message = error.response?.data?.error || "ログインに失敗しました";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        handleLogin,
    }
};