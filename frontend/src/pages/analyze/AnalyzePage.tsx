import AnalyzeResult from "@/features/analyze/components/AnalyzeResult";

const AnalyzePage = () => {
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="max-w-md w-full">
        <AnalyzeResult />
      </div>
    </div>
  );
};

export default AnalyzePage;
