import InventoryRegisterForm from "@/features/inventory/components/InventoryRegisterForm";

const InventoryRegisterPage = () => {
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="max-w-md w-full">
        <InventoryRegisterForm />
      </div>
    </div>
  );
};

export default InventoryRegisterPage;
