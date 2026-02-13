import { StepBar } from "@/components/common/StepBar";
import { NameSetupForm } from "@/features/setup/components/NameSetupForm";

const NameSetupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F8F7FF] to-[#EBE9FF] py-12 px-4">
      <div className="max-w-md w-full">
        <StepBar currentStep={2} />
        
        <NameSetupForm />
      </div>
    </div>
  );
};

export default NameSetupPage;