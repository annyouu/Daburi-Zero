import { StepBar } from "@/components/common/StepBar";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <StepBar currentStep={1} />

        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;