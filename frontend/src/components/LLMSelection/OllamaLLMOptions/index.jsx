import React, { useEffect, useState } from "react";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { OLLAMA_COMMON_URLS } from "@/utils/constants";
import { CaretDown, CaretUp, Info } from "@phosphor-icons/react";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import { Tooltip } from "react-tooltip";

export default function OllamaLLMOptions({ settings }) {
  const {
    autoDetecting: loading,
    basePath,
    basePathValue,
    authToken,
    authTokenValue,
    showAdvancedControls,
    setShowAdvancedControls,
    handleAutoDetectClick,
  } = useProviderEndpointAutoDiscovery({
    provider: "ollama",
    initialBasePath: settings?.OllamaLLMBasePath,
    initialAuthToken: settings?.OllamaLLMAuthToken,
    ENDPOINTS: OLLAMA_COMMON_URLS,
  });
  // 性能模式状态
  const [performanceMode, setPerformanceMode] = useState(
    settings?.OllamaLLMPerformanceMode || "base"
  );
  // 最大令牌数状态
  const [maxTokens, setMaxTokens] = useState(
    settings?.OllamaLLMTokenLimit || 4096
  );

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-start gap-[36px] mt-2">
        <OllamaLLMModelSelection
          settings={settings}
          basePath={basePath.value}
          authToken={authToken.value}
        />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            最大令牌数
          </label>
          <input
            type="number"
            name="OllamaLLMTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="4096"
            defaultChecked="4096"
            min={1}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            onScroll={(e) => e.target.blur()}
            required={true}
            autoComplete="off"
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            上下文和响应的最大令牌数限制。
          </p>
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
        <div className="flex flex-col">
          <div className="w-full flex items-start gap-4">
            <div className="flex flex-col w-60">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-semibold">
                  Ollama 基础 URL
                </label>
                {loading ? (
                  <PreLoader size="6" />
                ) : (
                  <>
                    {!basePathValue.value && (
                      <button
                        onClick={handleAutoDetectClick}
                        className="bg-primary-button text-xs font-medium px-2 py-1 rounded-lg hover:bg-secondary hover:text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-all duration-200"
                      >
                        自动检测
                      </button>
                    )}
                  </>
                )}
              </div>
              <input
                type="url"
                name="OllamaLLMBasePath"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
                placeholder="http://127.0.0.1:11434"
                value={basePathValue.value}
                required={true}
                autoComplete="off"
                spellCheck={false}
                onChange={basePath.onChange}
                onBlur={basePath.onBlur}
              />
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
                输入 Ollama 运行的 URL 地址。
              </p>
            </div>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold mb-2 flex items-center">
                性能模式
                <Info
                  size={16}
                  className="ml-2 text-white"
                  data-tooltip-id="performance-mode-tooltip"
                />
              </label>
              <select
                name="OllamaLLMPerformanceMode"
                required={true}
                className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5 cursor-pointer transition-colors duration-200"
                value={performanceMode}
                onChange={(e) => setPerformanceMode(e.target.value)}
              >
                <option value="base">基础模式（默认）</option>
                <option value="maximum">最大性能模式</option>
              </select>
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
                为 Ollama 模型选择性能模式。
              </p>
              <Tooltip
                id="performance-mode-tooltip"
                place="bottom"
                className="tooltip !text-xs max-w-xs"
              >
                <p className="text-red-500">
                  <strong>注意：</strong> 请谨慎使用最大性能模式。它可能会显著增加资源使用量。
                </p>
                <br />
                <p>
                  <strong>基础模式：</strong> Ollama 自动将上下文限制在 2048 个令牌，保持较低的资源使用率同时维持良好的性能。适合大多数用户和模型。
                </p>
                <br />
                <p>
                  <strong>最大性能模式：</strong> 使用完整的上下文窗口（最大令牌数限制）。会导致资源使用量增加，但允许更大上下文的对话。<br />
                  <br />
                  不推荐大多数用户使用此模式。
                </p>
              </Tooltip>
            </div>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-2">
                Ollama 保持活跃时间
              </label>
              <select
                name="OllamaLLMKeepAliveSeconds"
                required={true}
                className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5 cursor-pointer transition-colors duration-200"
                defaultValue={settings?.OllamaLLMKeepAliveSeconds ?? "300"}
              >
                <option value="0">不缓存</option>
                <option value="300">5 分钟</option>
                <option value="3600">1 小时</option>
                <option value="-1">永久</option>
              </select>
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
                选择 Ollama 在卸载模型前将其保持在内存中的时间。
                <a
                  className="underline text-blue-300 hover:text-blue-400 transition-colors duration-150"
                  href="https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-keep-a-model-loaded-in-memory-or-make-it-unload-immediately"
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  了解更多 &rarr;
                </a>
              </p>
            </div>
          </div>
          <div className="w-full flex items-start gap-4">
            <div className="flex flex-col w-100">
              <label className="text-white text-sm font-semibold">
                认证令牌
              </label>
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
                输入用于与 Ollama 服务器交互的 <code>Bearer</code> 认证令牌。
                <br />
                <b>仅</b>在 Ollama 运行在认证服务器后面时使用。
              </p>
              <input
                type="password"
                name="OllamaLLMAuthToken"
                className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg outline-none block w-full p-2.5 transition-all duration-200"
                placeholder="Ollama 认证令牌"
                value={authTokenValue.value}
                onChange={authToken.onChange}
                onBlur={authToken.onBlur}
                required={false}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OllamaLLMModelSelection({
  settings,
  basePath = null,
  authToken = null,
}) {
  // 存储可用的自定义模型列表
  const [customModels, setCustomModels] = useState([]);
  // 控制加载状态
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取自定义模型列表
    async function findCustomModels() {
      if (!basePath) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { models } = await System.customModels(
          "ollama",
          authToken,
          basePath
        );
        setCustomModels(models || []);
      } catch (error) {
        console.error("Failed to fetch custom models:", error);
        setCustomModels([]);
      }
      setLoading(false);
    }
    findCustomModels();
  }, [basePath, authToken]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-2">
          Ollama 模型
        </label>
        <select
          name="OllamaLLMModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5 cursor-not-allowed opacity-80"
        >
          <option disabled={true} selected={true}>
            {!!basePath
              ? "--正在加载可用模型--"
              : "请先输入 Ollama URL"}
          </option>
        </select>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          选择您想要使用的 Ollama 模型。在输入有效的 Ollama URL 后，模型列表将会加载。
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-2">
        Ollama 模型
      </label>
      <select
        name="OllamaLLMModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5 cursor-pointer transition-colors duration-200 hover:bg-theme-settings-input-active"
      >
        {customModels.length > 0 && (
          <optgroup label="您已加载的模型">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.OllamaLLMModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
        选择您想要用于对话的 Ollama 模型。
      </p>
    </div>
  );
}
