/**
 * 谷歌搜索选项配置组件
 * 处理谷歌搜索引擎ID和API密钥的输入
 */
export function GoogleSearchOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-gray-500 my-3 leading-relaxed">
        您可以{" "}
        <a
          href="https://programmablesearchengine.google.com/controlpanel/create"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
        >
          从谷歌获取免费的搜索引擎和API密钥
        </a>
        ，用于获取抑郁症相关研究信息。
      </p>
      <div className="flex gap-x-5 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            搜索引擎ID
          </label>
          <input
            type="text"
            name="env::AgentGoogleSearchEngineId"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:ring-2 focus:ring-primary-button/50 active:outline-primary-button outline-none block w-full p-3 transition-all duration-200"
            placeholder="谷歌搜索引擎ID"
            defaultValue={settings?.AgentGoogleSearchEngineId}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            程序化访问API密钥
          </label>
          <input
            type="password"
            name="env::AgentGoogleSearchEngineKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:ring-2 focus:ring-primary-button/50 active:outline-primary-button outline-none block w-full p-3 transition-all duration-200"
            placeholder="谷歌搜索引擎API密钥"
            defaultValue={
              settings?.AgentGoogleSearchEngineKey ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

/**
 * SearchApi支持的搜索引擎列表
 */
const SearchApiEngines = [
  { name: "谷歌搜索", value: "google" },
  { name: "谷歌地图", value: "google_maps" },
  { name: "谷歌购物", value: "google_shopping" },
  { name: "谷歌新闻", value: "google_news" },
  { name: "谷歌招聘", value: "google_jobs" },
  { name: "谷歌学术", value: "google_scholar" },
  { name: "谷歌财经", value: "google_finance" },
  { name: "谷歌专利", value: "google_patents" },
  { name: "YouTube", value: "youtube" },
  { name: "必应", value: "bing" },
  { name: "必应新闻", value: "bing_news" },
  { name: "亚马逊商品搜索", value: "amazon_search" },
  { name: "百度", value: "baidu" },
];

/**
 * SearchApi选项配置组件
 * 支持多种搜索引擎
 */
export function SearchApiOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-gray-500 my-3 leading-relaxed">
        您可以{" "}
        <a
          href="https://www.searchapi.io/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
        >
          从SearchApi获取免费API密钥
        </a>
        ，用于心理健康信息检索。
      </p>
      <div className="flex gap-x-5 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API密钥
          </label>
          <input
            type="password"
            name="env::AgentSearchApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:ring-2 focus:ring-primary-button/50 active:outline-primary-button outline-none block w-full p-3 transition-all duration-200"
            placeholder="SearchApi API密钥"
            defaultValue={settings?.AgentSearchApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            搜索引擎
          </label>
          <select
            name="env::AgentSearchApiEngine"
            required={true}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:ring-2 focus:ring-primary-button/50 active:outline-primary-button outline-none block w-full p-3 transition-all duration-200"
            defaultValue={settings?.AgentSearchApiEngine || "google"}
          >
            {SearchApiEngines.map(({ name, value }) => (
              <option key={name} value={value}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

/**
 * Serper.dev选项配置组件
 */
export function SerperDotDevOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-gray-500 my-3 leading-relaxed">
        您可以{" "}
        <a
          href="https://serper.dev"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
        >
          从Serper.dev获取免费API密钥
        </a>
        ，用于精准搜索抑郁症相关内容。
      </p>
      <div className="flex gap-x-5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API密钥
          </label>
          <input
            type="password"
            name="env::AgentSerperApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:ring-2 focus:ring-primary-button/50 active:outline-primary-button outline-none block w-full p-3 transition-all duration-200"
            placeholder="Serper.dev API密钥"
            defaultValue={settings?.AgentSerperApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

/**
 * 必应搜索选项配置组件
 */
export function BingSearchOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-gray-500 my-3 leading-relaxed">
        您可以{" "}
        <a
          href="https://portal.azure.com/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
        >
          从Azure门户获取必应网页搜索API订阅密钥
        </a>
        ，用于综合抑郁症信息检索。
      </p>
      <div className="flex gap-x-5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API密钥
          </label>
          <input
            type="password"
            name="env::AgentBingSearchApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:ring-2 focus:ring-primary-button/50 active:outline-primary-button outline-none block w-full p-3 transition-all duration-200"
            placeholder="必应网页搜索API密钥"
            defaultValue={settings?.AgentBingSearchApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
      <p className="text-sm text-gray-500 my-3 leading-relaxed">
        设置必应网页搜索API订阅的步骤：
      </p>
      <ol className="list-decimal text-sm text-gray-500 ml-6 space-y-1.5">
        <li>
          前往Azure门户：{" "}
          <a
            href="https://portal.azure.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
          >
            https://portal.azure.com/
          </a>
        </li>
        <li>创建新的Azure账户或使用现有账户登录。</li>
        <li>
          导航至"创建资源"部分，搜索"Grounding with Bing Search"。
        </li>
        <li>
          选择"Grounding with Bing Search"资源并创建新订阅。
        </li>
        <li>选择适合您需求的定价层级。</li>
        <li>
          获取您的Grounding with Bing Search订阅的API密钥。
        </li>
      </ol>
    </>
  );
}

/**
 * Serply搜索选项配置组件
 */
export function SerplySearchOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-gray-500 my-3 leading-relaxed">
        您可以{" "}
        <a
          href="https://serply.io"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
        >
          从Serply.io获取免费API密钥
        </a>
        ，用于搜索抑郁症治疗最新研究。
      </p>
      <div className="flex gap-x-5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API密钥
          </label>
          <input
            type="password"
            name="env::AgentSerplyApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:ring-2 focus:ring-primary-button/50 active:outline-primary-button outline-none block w-full p-3 transition-all duration-200"
            placeholder="Serply API密钥"
            defaultValue={settings?.AgentSerplyApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

/**
 * SearXNG选项配置组件
 * 开源元搜索引擎
 */
export function SearXNGOptions({ settings }) {
  return (
    <div className="flex gap-x-5">
      <div className="flex flex-col w-full max-w-md">
        <label className="text-white text-sm font-semibold block mb-3">
          SearXNG API基础URL
        </label>
        <input
          type="url"
          name="env::AgentSearXNGApiUrl"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:ring-2 focus:ring-primary-button/50 active:outline-primary-button outline-none block w-full p-3 transition-all duration-200"
          placeholder="SearXNG API基础URL"
          defaultValue={settings?.AgentSearXNGApiUrl}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

/**
 * Tavily搜索选项配置组件
 */
export function TavilySearchOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-gray-500 my-3 leading-relaxed">
        您可以{" "}
        <a
          href="https://tavily.com/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
        >
          从Tavily获取API密钥
        </a>
        ，用于高质量的心理健康信息检索。
      </p>
      <div className="flex gap-x-5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API密钥
          </label>
          <input
            type="password"
            name="env::AgentTavilyApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:ring-2 focus:ring-primary-button/50 active:outline-primary-button outline-none block w-full p-3 transition-all duration-200"
            placeholder="Tavily API密钥"
            defaultValue={settings?.AgentTavilyApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

/**
 * DuckDuckGo选项配置组件
 * 无需额外配置
 */
export function DuckDuckGoOptions() {
  return (
    <>
      <p className="text-sm text-gray-400 my-3 leading-relaxed">
        DuckDuckGo搜索已准备就绪，无需任何额外配置，可立即用于搜索抑郁症相关研究和治疗方法。
      </p>
    </>
  );
}
