type StepBarProps = {
  // 1: 登録, 2: 名前, 3: 画像
  currentStep: 1 | 2 | 3;
};

export const StepBar = ({ currentStep }: StepBarProps) => {
  const steps = [
    { id: 1, label: "アカウント作成" },
    { id: 2, label: "プロフィール設定" },
    { id: 3, label: "顔写真登録" },
  ];

  return (
    <ol className="flex justify-center list-none p-0 w-full mb-8">
      {steps.map((step, index) => {
        const isPrev = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <li
            key={step.id}
            className={`flex flex-1 flex-col items-center relative z-10 text-[0.75rem] font-bold transition-colors duration-300
              ${isPrev || isCurrent ? "text-[#7C74F7]" : "text-gray-400"}`}
          >
            {/* 丸いアイコン部分 */}
            <div
              className={`w-4 h-4 mb-2 border-2 rounded-full transition-all duration-300
                ${isPrev || isCurrent ? "border-[#7C74F7]" : "border-gray-200"}
                ${isPrev || isCurrent ? "bg-[#7C74F7]" : "bg-white"}`}
            />
            
            <span>{step.label}</span>

            {/* ステップ間のライン */}
            {index !== steps.length - 1 && (
              <div
                className={`absolute top-1.75 left-1/2 -z-10 w-full h-0.5 transition-colors duration-300
                  ${isPrev ? "bg-[#7C74F7]" : "bg-gray-200"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};