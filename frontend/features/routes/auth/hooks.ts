// endpointで叩いたapiのレスポンスを使って、おそらくトークンが帰ってくる
// トークンをCookieに保存し、ステータスに応じて画面を変えていく処理を実装
// UI(画面)とAPI(データ)を繋ぐ仲介者ってイメージ

import { useState } from "react";
import Cookies from "js-cookie";
import { authEndpoints } from "./endpoint"
import { useSetup } from "../setup/hooks";
import { UserRegisterInput ,UserLoginInput } from "@/type/user";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { navigateByStatus } = useSetup();

    const register = async (data: UserRegisterInput) => {
        setIsLoading(true);

        try {
            // APIを叩くてユーザーを作成する
            const res = await authEndpoints.register(data);

            // Cookieに保存する
            if (res.token) {
                Cookies.set("token", res.token, { expires: 1 });
            }

            // 登録直後のステータスに応じて遷移する
            navigateByStatus(res.status);

        } catch (error) {
            console.error("登録失敗:", error);
            alert("アカウント新規作成に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: UserLoginInput) => {
        setIsLoading(true);

        try {
            const res = await authEndpoints.login(data);

            if (res.token) {
                Cookies.set("token", res.token, { expires: 1 });
            }

            navigateByStatus(res.status);

        } catch (error) {
            console.error("Login failed:", error);
            alert("ログインに失敗しました。メールアドレスまたはパスワードを確認してください");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        login,
        isLoading,
    }
};

