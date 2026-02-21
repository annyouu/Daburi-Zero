import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
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
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  // MainLayout を適用するページ群
  {
    element: <MainLayout />,
    children: [
      { path: '/home', element: <HomePage /> },
      { path: '/setup/name', element: <NameSetupPage /> },
      { path: '/setup/image', element: <ImageSetupPage /> },
      { path: '/take-photo', element: <TakePhotoPage /> },
      { path: '/test', element: <TestPage /> },
    ],
  },
  // レイアウトなし（認証系）
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/google-login', element: <GoogleLoginPage /> },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
