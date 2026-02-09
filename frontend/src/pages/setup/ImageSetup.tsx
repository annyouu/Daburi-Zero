import { StepBar } from "@/components/common/StepBar";
import { ImageSetupForm } from "@/features/setup/components/ImageSetupForm";

const ImageSetupPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
          <div className="max-w-md w-full">
            <StepBar currentStep={3} />
            
            <ImageSetupForm />
          </div>
        </div>
    );
};

export default ImageSetupPage;