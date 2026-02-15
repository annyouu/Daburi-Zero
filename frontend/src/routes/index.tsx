import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import RegisterPage from '@/pages/auth/Register';
import TestPage from "@/pages/Test";
import NameSetupPage from '@/pages/setup/NameSetup';
import ImageSetupPage from '@/pages/setup/ImageSetup';
import { GoogleLoginPage } from '@/pages/auth/GoogleLoginPage';
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/login/LoginPage';
import TakePhotoPage from '@/pages/take_photo/TakePhotoPage';

const router = createBrowserRouter([
  {
    // ルートパスにアクセスしたら /home へリダイレクト
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    /* ログイン画面（今後作成） */
    path: '/login',
    element: <LoginPage />,
  },
  {
    /* セットアップ画面（今後作成） */
    path: '/setup',
    children: [
      { path: 'name', element: <NameSetupPage /> },
      { path: 'image', element: <ImageSetupPage /> },
    ],
  },
  {
    path: "/google-login",
    element: <GoogleLoginPage />,
  },
  {
    path: '/take-photo',
    element: <TakePhotoPage />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};