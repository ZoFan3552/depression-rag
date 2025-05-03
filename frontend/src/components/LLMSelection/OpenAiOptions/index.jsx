import { useState, useEffect } from "react";
import System from "@/models/system";

export default function OpenAiOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.OpenAiKey);
  const [openAIKey, setOpenAIKey] = useState(settings?.OpenAiKey);

  return (
    <div className="flex gap-[36px] mt-2">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API 密钥
        </label>
        <input
          type="password"
          name="OpenAiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
          placeholder="OpenAI API 密钥"
          defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setOpenAIKey(inputValue)}
        />
      </div>
      {!settings?.credentialsOnly && (
        <OpenAIModelSelection settings={settings} apiKey={openAIKey} />
      )}
    </div>
  );
}

function OpenAIModelSelection({ apiKey, settings }) {
  // 按组织分组的模型列表
  const [groupedModels, setGroupedModels] = useState({});
  // 控制加载状态
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取自定义模型列表
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels(
        "openai",
        typeof apiKey === "boolean" ? null : apiKey
      );

      if (models?.length > 0) {
        // 按组织对模型进行分组
        const modelsByOrganization = models.reduce((acc, model) => {
          acc[model.organization] = acc[model.organization] || [];
          acc[model.organization].push(model);
          return acc;
        }, {});
        setGroupedModels(modelsByOrganization);
      }

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
          name="OpenAiModelPref"
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
        name="OpenAiModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5 cursor-pointer transition-colors duration-200 hover:bg-theme-settings-input-active"
      >
        {Object.keys(groupedModels)
          .sort()
          .map((organization) => (
            <optgroup key={organization} label={organization}>
              {groupedModels[organization].map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings?.OpenAiModelPref === model.id}
                >
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
    </div>
  );
}
