import { PhotoScanner } from "@/features/take_photo/components/PhotoScanner";
import InventoryPreview from "@/features/inventory/components/InventoryPreview";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center py-8 px-4 gap-8">
      <div className="max-w-md w-full space-y-8">
        <PhotoScanner />
        <InventoryPreview />
      </div>
    </div>
  );
};

export default HomePage;
