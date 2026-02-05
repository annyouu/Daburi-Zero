import { RegisterForm } from "@/features/auth/components/RegisterForm";

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;