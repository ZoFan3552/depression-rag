import React, { useEffect, useRef, useState } from "react";
import Admin from "@/models/admin";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import GoogleSearchIcon from "./icons/google.png";
import BingSearchIcon from "./icons/bing.png";
import DuckDuckGoIcon from "./icons/duckduckgo.png";
import {
  CaretUpDown,
  MagnifyingGlass,
  X,
  ListMagnifyingGlass,
} from "@phosphor-icons/react";
import SearchProviderItem from "./SearchProviderItem";
import WebSearchImage from "@/media/agents/scrape-websites.png";
import {
  GoogleSearchOptions,
  BingSearchOptions,
  DuckDuckGoOptions,
} from "./SearchProviderOptions";

// 搜索提供商列表配置
const SEARCH_PROVIDERS = [
  {
    name: "请选择搜索提供商",
    value: "none",
    logo: AnythingLLMIcon,
    options: () => <React.Fragment />,
    description:
      "在提供搜索引擎和密钥之前，网络搜索功能将被禁用。",
  },
  {
    name: "DuckDuckGo",
    value: "duckduckgo-engine",
    logo: DuckDuckGoIcon,
    options: () => <DuckDuckGoOptions />,
    description:
      "使用DuckDuckGo的HTML界面进行免费且注重隐私的网络搜索。",
  },
  {
    name: "谷歌搜索引擎",
    value: "google-search-engine",
    logo: GoogleSearchIcon,
    options: (settings) => <GoogleSearchOptions settings={settings} />,
    description:
      "由自定义谷歌搜索引擎提供的网络搜索。每天免费100次查询。",
  },
  {
    name: "必应搜索",
    value: "bing-search",
    logo: BingSearchIcon,
    options: (settings) => <BingSearchOptions settings={settings} />,
    description: "由必应搜索API提供的网络搜索（付费服务）。",
  },
];

export default function AgentWebSearchSelection({
  skill,
  settings,
  toggleSkill,
  enabled = false,
  setHasChanges,
}) {
  const searchInputRef = useRef(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);

  // 更新选择的搜索提供商
  function updateChoice(selection) {
    setSearchQuery("");
    setSelectedProvider(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  }

  // 处理X按钮点击
  function handleXButton() {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  }

  // 根据搜索查询过滤搜索提供商
  useEffect(() => {
    const filtered = SEARCH_PROVIDERS.filter((provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchQuery, selectedProvider]);

  // 初始化加载已保存的搜索提供商设置
  useEffect(() => {
    Admin.systemPreferencesByFields(["agent_search_provider"])
      .then((res) =>
        setSelectedProvider(res?.settings?.agent_search_provider ?? "none")
      )
      .catch(() => setSelectedProvider("none"));
  }, []);

  // 获取当前选中的搜索提供商对象
  const selectedSearchProviderObject = SEARCH_PROVIDERS.find(
    (provider) => provider.value === selectedProvider
  );

  return (
    <div className="p-3">
      <div className="flex flex-col gap-y-[20px] max-w-[520px]">
        <div className="flex items-center gap-x-3">
          <ListMagnifyingGlass
            size={26}
            color="var(--theme-text-primary)"
            weight="bold"
            className="text-primary-button"
          />
          <label
            htmlFor="name"
            className="text-theme-text-primary text-md font-bold"
          >
            网络实时搜索与浏览
          </label>
          <label className="border-none relative inline-flex items-center ml-auto cursor-pointer">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={enabled}
              onChange={() => toggleSkill(skill)}
            />
            <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
            <span className="ml-3 text-sm font-medium"></span>
          </label>
        </div>
        <img
          src={WebSearchImage}
          alt="网络搜索"
          className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        />
        <p className="text-theme-text-secondary text-opacity-80 text-sm font-medium py-2 leading-relaxed">
          通过连接网络搜索(SERP)提供商，使抑郁症专家智能体能够搜索网络以回答您的问题。在未设置此功能之前，智能体会话期间的网络搜索将无法工作。
        </p>
        <div hidden={!enabled}>
          <div className="relative">
            <input
              type="hidden"
              name="system::agent_search_provider"
              value={selectedProvider}
            />
            {searchMenuOpen && (
              <div
                className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
                onClick={() => setSearchMenuOpen(false)}
              />
            )}
            {searchMenuOpen ? (
              <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[320px] overflow-auto custom-scrollbar min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20 shadow-xl">
                <div className="w-full flex flex-col gap-y-1">
                  <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
                    <MagnifyingGlass
                      size={20}
                      weight="bold"
                      className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2"
                    />
                    <input
                      type="text"
                      name="web-provider-search"
                      autoComplete="off"
                      placeholder="搜索可用的网络搜索提供商"
                      className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-theme-text-primary placeholder:text-theme-text-primary placeholder:font-medium focus:ring-2 focus:ring-primary-button/30 rounded-md transition-all duration-200"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      ref={searchInputRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                      }}
                    />
                    <X
                      size={20}
                      weight="bold"
                      className="cursor-pointer text-white hover:text-red-400 transition-colors duration-200"
                      onClick={handleXButton}
                    />
                  </div>
                  <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto custom-scrollbar pb-4">
                    {filteredResults.map((provider) => {
                      return (
                        <SearchProviderItem
                          provider={provider}
                          key={provider.name}
                          checked={selectedProvider === provider.value}
                          onClick={() => updateChoice(provider.value)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="w-full max-w-[640px] h-[68px] bg-theme-settings-input-bg rounded-lg flex items-center p-[16px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300 shadow-md hover:shadow-lg"
                type="button"
                onClick={() => setSearchMenuOpen(true)}
              >
                <div className="flex gap-x-4 items-center">
                  <img
                    src={selectedSearchProviderObject.logo}
                    alt={`${selectedSearchProviderObject.name} 图标`}
                    className="w-10 h-10 rounded-md"
                  />
                  <div className="flex flex-col text-left">
                    <div className="text-sm font-semibold text-white">
                      {selectedSearchProviderObject.name}
                    </div>
                    <div className="mt-1 text-xs text-description">
                      {selectedSearchProviderObject.description}
                    </div>
                  </div>
                </div>
                <CaretUpDown size={24} weight="bold" className="text-white text-opacity-80 group-hover:text-opacity-100" />
              </button>
            )}
          </div>
          {selectedProvider !== "none" && (
            <div className="mt-5 flex flex-col gap-y-2 bg-theme-bg-secondary p-4 rounded-lg shadow-md transition-all duration-300">
              {selectedSearchProviderObject.options(settings)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
