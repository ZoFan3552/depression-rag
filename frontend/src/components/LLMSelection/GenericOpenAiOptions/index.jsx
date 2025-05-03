export default function GenericOpenAiOptions({ settings }) {
  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-2 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            基础 URL
          </label>
          <input
            type="url"
            name="GenericOpenAiBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="例如: https://proxy.openai.com"
            defaultValue={settings?.GenericOpenAiBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API 密钥
          </label>
          <input
            type="password"
            name="GenericOpenAiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="通用服务 API 密钥"
            defaultValue={settings?.GenericOpenAiKey ? "*".repeat(20) : ""}
            required={false}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            聊天模型名称
          </label>
          <input
            type="text"
            name="GenericOpenAiModelPref"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="用于聊天请求的模型 ID"
            defaultValue={settings?.GenericOpenAiModelPref}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="flex gap-[36px] flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            令牌上下文窗口
          </label>
          <input
            type="number"
            name="GenericOpenAiTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="内容窗口限制（例如: 4096）"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.GenericOpenAiTokenLimit}
            required={true}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            最大令牌数
          </label>
          <input
            type="number"
            name="GenericOpenAiMaxTokens"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition-all duration-200"
            placeholder="每个请求的最大令牌数（例如: 1024）"
            min={1}
            defaultValue={settings?.GenericOpenAiMaxTokens || 1024}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
