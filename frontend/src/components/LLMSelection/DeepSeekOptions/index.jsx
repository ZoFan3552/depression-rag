import { useState, useEffect } from "react";
import System from "@/models/system";

export default function DeepSeekOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.DeepSeekApiKey);
  const [deepSeekApiKey, setDeepSeekApiKey] = useState(
    settings?.DeepSeekApiKey
  );

  return (
    <div className="flex gap-[36px] mt-2">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API 密钥
        </label>
        <input
          type="password"
          name="DeepSeekApiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
          placeholder="DeepSeek API 密钥"
          defaultValue={settings?.DeepSeekApiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setDeepSeekApiKey(inputValue)}
        />
      </div>
      {!settings?.credentialsOnly && (
        <DeepSeekModelSelection settings={settings} apiKey={deepSeekApiKey} />
      )}
    </div>
  );
}

function DeepSeekModelSelection({ apiKey, settings }) {
  // 存储可用模型列表
  const [models, setModels] = useState([]);
  // 控制加载状态
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取自定义模型列表
    async function findCustomModels() {
      if (!apiKey) {
        setModels([]);
        setLoading(true);
        return;
      }

      setLoading(true);
      const { models } = await System.customModels(
        "deepseek",
        typeof apiKey === "boolean" ? null : apiKey
      );
      setModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          聊天模型选择
        </label>
        <select
          name="DeepSeekModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5 cursor-not-allowed opacity-80"
        >
          <option disabled={true} selected={true}>
            -- 正在加载可用模型 --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        聊天模型选择
      </label>
      <select
        name="DeepSeekModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5 cursor-pointer transition-colors duration-200 hover:bg-theme-settings-input-active"
      >
        {models.map((model) => (
          <option
            key={model.id}
            value={model.id}
            selected={settings?.DeepSeekModelPref === model.id}
          >
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}
