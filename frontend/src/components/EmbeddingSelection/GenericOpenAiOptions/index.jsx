import React, { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

export default function GenericOpenAiEmbeddingOptions({ settings }) {
  // 控制高级设置显示状态
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-2 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            基础 URL
          </label>
          <input
            type="url"
            name="EmbeddingBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="https://api.openai.com/v1"
            defaultValue={settings?.EmbeddingBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            嵌入模型
          </label>
          <input
            type="text"
            name="EmbeddingModelPref"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="text-embedding-ada-002"
            defaultValue={settings?.EmbeddingModelPref}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            最大嵌入块长度
          </label>
          <input
            type="number"
            name="EmbeddingModelMaxChunkLength"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="8192"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.EmbeddingModelMaxChunkLength}
            required={false}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="w-full flex items-center gap-[36px]">
        <div className="flex flex-col w-60">
          <div className="flex flex-col gap-y-1 mb-4">
            <label className="text-white text-sm font-semibold flex items-center gap-x-2">
              API 密钥 <p className="!text-xs !italic !font-thin">可选</p>
            </label>
          </div>
          <input
            type="password"
            name="GenericOpenAiEmbeddingApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="sk-mysecretkey"
            defaultValue={
              settings?.GenericOpenAiEmbeddingApiKey ? "*".repeat(20) : ""
            }
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
      <div className="flex justify-start mt-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowAdvancedControls(!showAdvancedControls);
          }}
          className="border-none text-theme-text-primary hover:text-theme-text-secondary flex items-center text-sm transition-colors duration-150"
        >
          {showAdvancedControls ? "隐藏" : "显示"}高级设置
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>
      <div hidden={!showAdvancedControls}>
        <div className="w-full flex items-start gap-4">
          <div className="flex flex-col w-60">
            <div className="flex flex-col gap-y-1 mb-4">
              <label className="text-white text-sm font-semibold flex items-center gap-x-2">
                最大并发块数
                <p className="!text-xs !italic !font-thin">可选</p>
              </label>
            </div>
            <input
              type="number"
              name="GenericOpenAiEmbeddingMaxConcurrentChunks"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
              placeholder="500"
              min={1}
              onScroll={(e) => e.target.blur()}
              defaultValue={settings?.GenericOpenAiEmbeddingMaxConcurrentChunks}
              required={false}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
