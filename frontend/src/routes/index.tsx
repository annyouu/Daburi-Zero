import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RegisterPage from '@/pages/auth/Register';
import TestPage from "@/pages/Test";
import NameSetupPage from '@/pages/setup/NameSetup';
import ImageSetupPage from '@/pages/setup/ImageSetup';
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/login/LoginPage';
import TakePhotoPage from '@/pages/take_photo/TakePhotoPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import InventoryRegisterPage from '@/pages/inventory/InventoryRegisterPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import AnalyzePage from '@/pages/analyze/AnalyzePage';

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
      { path: '/analyze', element: <AnalyzePage /> },
      { path: '/setup/name', element: <NameSetupPage /> },
      { path: '/setup/image', element: <ImageSetupPage /> },
      { path: '/take-photo', element: <TakePhotoPage /> },
      { path: '/test', element: <TestPage /> },
      { path: '/inventory', element: <InventoryPage /> },
      { path: '/inventory/register', element: <InventoryRegisterPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  // レイアウトなし（認証系）
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
