import InventoryList from "@/features/inventory/components/InventoryList";

const InventoryPage = () => {
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="max-w-md w-full">
        <InventoryList />
      </div>
    </div>
  );
};

export default InventoryPage;
