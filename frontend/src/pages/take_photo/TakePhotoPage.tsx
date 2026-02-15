import { PhotoScanner } from "@/features/take_photo/components/PhotoScanner";

const TakePhotoPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F8F7FF] to-[#EBE9FF] py-12 px-4">
      <div className="max-w-md w-full">
        <PhotoScanner />
      </div>
    </div>
  );
};

export default TakePhotoPage;
