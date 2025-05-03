import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import Home from "./Home";
import LLMPreference from "./LLMPreference";
import UserSetup from "./UserSetup";
import DataHandling from "./DataHandling";
import Survey from "./Survey";
import CreateWorkspace from "./CreateWorkspace";

// 定义引导步骤组件映射
const OnboardingSteps = {
  home: Home,
  "llm-preference": LLMPreference,
  "user-setup": UserSetup,
  "data-handling": DataHandling,
  survey: Survey,
  "create-workspace": CreateWorkspace,
};

export default OnboardingSteps;

export function OnboardingLayout({ children }) {
  // 页面标题和描述状态
  const [header, setHeader] = useState({
    title: "",
    description: "",
  });
  
  // 返回按钮状态
  const [backBtn, setBackBtn] = useState({
    showing: false,
    disabled: true,
    onClick: () => null,
  });
  
  // 前进按钮状态
  const [forwardBtn, setForwardBtn] = useState({
    showing: false,
    disabled: true,
    onClick: () => null,
  });

  // 移动设备布局
  if (isMobile) {
    return (
      <div
        data-layout="onboarding"
        className="w-screen h-screen overflow-y-auto bg-theme-bg-primary overflow-hidden"
      >
        <div className="flex flex-col">
          <div className="w-full relative py-10 px-2">
            <div className="flex flex-col w-fit mx-auto gap-y-1 mb-[55px]">
              <h1 className="text-theme-text-primary font-semibold text-center text-2xl">
                {header.title}
              </h1>
              <p className="text-theme-text-secondary text-base text-center">
                {header.description}
              </p>
            </div>
            {children(setHeader, setBackBtn, setForwardBtn)}
          </div>
          <div className="flex w-full justify-center gap-x-4 pb-20">
            <div className="flex justify-center items-center">
              {backBtn.showing && (
                <button
                  disabled={backBtn.disabled}
                  onClick={backBtn.onClick}
                  className="group p-2 rounded-lg border-2 border-zinc-300 disabled:border-zinc-600 h-fit w-fit disabled:cursor-not-allowed hover:bg-zinc-100 disabled:hover:bg-transparent transition-all duration-200"
                  aria-label="返回"
                >
                  <ArrowLeft
                    className="text-white group-hover:text-black group-disabled:text-gray-500"
                    size={30}
                  />
                </button>
              )}
            </div>

            <div className="flex justify-center items-center">
              {forwardBtn.showing && (
                <button
                  disabled={forwardBtn.disabled}
                  onClick={forwardBtn.onClick}
                  className="group p-2 rounded-lg border-2 border-zinc-300 disabled:border-zinc-600 h-fit w-fit disabled:cursor-not-allowed hover:bg-teal disabled:hover:bg-transparent transition-all duration-200"
                  aria-label="继续"
                >
                  <ArrowRight
                    className="text-white group-hover:text-teal group-disabled:text-gray-500"
                    size={30}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 桌面设备布局
  return (
    <div
      data-layout="onboarding"
      className="w-screen overflow-y-auto bg-theme-bg-primary flex justify-center overflow-hidden"
    >
      {/* 左侧返回按钮区域 */}
      <div className="flex w-1/5 h-screen justify-center items-center">
        {backBtn.showing && (
          <button
            disabled={backBtn.disabled}
            onClick={backBtn.onClick}
            className="group p-2 rounded-lg border-2 border-theme-sidebar-border h-fit w-fit disabled:cursor-not-allowed hover:bg-theme-bg-secondary disabled:hover:bg-transparent transition-all duration-200 hover:shadow-md"
            aria-label="返回"
          >
            <ArrowLeft
              className="text-theme-text-secondary group-hover:text-theme-text-primary group-disabled:text-gray-500"
              size={30}
            />
          </button>
        )}
      </div>

      {/* 中间内容区域 */}
      <div className="w-full md:w-3/5 relative h-full py-10">
        <div className="flex flex-col w-fit mx-auto gap-y-1 mb-[55px]">
          <h1 className="text-theme-text-primary font-semibold text-center text-2xl">
            {header.title}
          </h1>
          <p className="text-theme-text-secondary text-base text-center max-w-[600px]">
            {header.description}
          </p>
        </div>
        {children(setHeader, setBackBtn, setForwardBtn)}
      </div>

      {/* 右侧前进按钮区域 */}
      <div className="flex w-1/5 h-screen justify-center items-center">
        {forwardBtn.showing && (
          <button
            disabled={forwardBtn.disabled}
            onClick={forwardBtn.onClick}
            className="group p-2 rounded-lg border-2 border-theme-sidebar-border h-fit w-fit disabled:cursor-not-allowed hover:bg-teal disabled:hover:bg-transparent transition-all duration-200 hover:shadow-md"
            aria-label="继续"
          >
            <ArrowRight
              className="text-theme-text-secondary group-hover:text-white group-disabled:text-gray-500"
              size={30}
            />
          </button>
        )}
      </div>
    </div>
  );
}
