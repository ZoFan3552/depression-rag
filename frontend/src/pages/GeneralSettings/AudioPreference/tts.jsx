import React, { useEffect, useState, useRef } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import LLMItem from "@/components/LLMSelection/LLMItem";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import ElevenLabsIcon from "@/media/ttsproviders/elevenlabs.png";
import PiperTTSIcon from "@/media/ttsproviders/piper.png";
import GenericOpenAiLogo from "@/media/ttsproviders/generic-openai.png";

import BrowserNative from "@/components/TextToSpeech/BrowserNative";
import OpenAiTTSOptions from "@/components/TextToSpeech/OpenAiOptions";
import ElevenLabsTTSOptions from "@/components/TextToSpeech/ElevenLabsOptions";
import PiperTTSOptions from "@/components/TextToSpeech/PiperTTSOptions";
import OpenAiGenericTTSOptions from "@/components/TextToSpeech/OpenAiGenericOptions";

// 文本转语音提供商列表
const PROVIDERS = [
  {
    name: "浏览器内置",
    value: "native",
    logo: AnythingLLMIcon,
    options: (settings) => <BrowserNative settings={settings} />,
    description: "使用浏览器内置的文本转语音服务（如果支持）。",
  },
  {
    name: "OpenAI",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiTTSOptions settings={settings} />,
    description: "使用OpenAI的文本转语音声音。",
  },
  {
    name: "OpenAI兼容服务",
    value: "generic-openai",
    logo: GenericOpenAiLogo,
    options: (settings) => <OpenAiGenericTTSOptions settings={settings} />,
    description:
      "连接到本地或远程运行的OpenAI兼容文本转语音服务。",
  },
];

export default function TextToSpeechProvider({ settings }) {
  // 状态变量
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(
    settings?.TextToSpeechProvider || "native"
  );
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  // 提交表单处理函数
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const form = e.target;
    const data = { TextToSpeechProvider: selectedProvider };
    const formData = new FormData(form);

    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    setSaving(true);

    if (error) {
      showToast(`保存偏好设置失败: ${error}`, "error");
    } else {
      showToast("文本转语音偏好设置保存成功。", "success");
    }
    setSaving(false);
    setHasChanges(!!error);
  };

  // 更新提供商选择
  const updateProviderChoice = (selection) => {
    setSearchQuery("");
    setSelectedProvider(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  };

  // 处理X按钮点击
  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  };

  // 过滤提供商列表
  useEffect(() => {
    const filtered = PROVIDERS.filter((provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProviders(filtered);
  }, [searchQuery, selectedProvider]);

  const selectedProviderObject = PROVIDERS.find(
    (provider) => provider.value === selectedProvider
  );

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
        <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
          <div className="flex gap-x-4 items-center">
            <p className="text-xl leading-6 font-bold text-white">
              文本转语音偏好设置
            </p>
          </div>
          <p className="text-sm leading-[18px] font-medium text-white text-opacity-70">
            在这里，您可以指定在抑郁症专家知识库系统体验中想要使用的文本转语音提供商。默认情况下，我们使用浏览器内置的服务支持，但您可能希望使用其他服务。
          </p>
        </div>
        <div className="w-full justify-end flex">
          {hasChanges && (
            <CTAButton className="mt-3 mr-0 -mb-14 z-10 hover:shadow-lg transition-all duration-300">
              {saving ? "正在保存..." : "保存更改"}
            </CTAButton>
          )}
        </div>
        <div className="text-base font-bold text-white mt-6 mb-4">提供商</div>
        <div className="relative">
          {searchMenuOpen && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
              onClick={() => setSearchMenuOpen(false)}
            />
          )}
          {searchMenuOpen ? (
            <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button shadow-lg z-20">
              <div className="w-full flex flex-col gap-y-1">
                <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
                  <MagnifyingGlass
                    size={20}
                    weight="bold"
                    className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2"
                  />
                  <input
                    type="text"
                    name="tts-provider-search"
                    autoComplete="off"
                    placeholder="搜索文本转语音提供商"
                    className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-theme-text-primary placeholder:text-theme-text-primary placeholder:font-medium"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    ref={searchInputRef}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                  <X
                    size={20}
                    weight="bold"
                    className="cursor-pointer text-white hover:text-x-button transition-colors duration-200"
                    onClick={handleXButton}
                  />
                </div>
                <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
                  {filteredProviders.map((provider) => (
                    <LLMItem
                      key={provider.name}
                      name={provider.name}
                      value={provider.value}
                      image={provider.logo}
                      description={provider.description}
                      checked={selectedProvider === provider.value}
                      onClick={() => updateProviderChoice(provider.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <button
              className="w-full max-w-[640px] h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300 hover:shadow-md"
              type="button"
              onClick={() => setSearchMenuOpen(true)}
            >
              <div className="flex gap-x-4 items-center">
                <img
                  src={selectedProviderObject.logo}
                  alt={`${selectedProviderObject.name} 标志`}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div className="flex flex-col text-left">
                  <div className="text-sm font-semibold text-white">
                    {selectedProviderObject.name}
                  </div>
                  <div className="mt-1 text-xs text-description">
                    {selectedProviderObject.description}
                  </div>
                </div>
              </div>
              <CaretUpDown size={24} weight="bold" className="text-white" />
            </button>
          )}
        </div>
        <div
          onChange={() => setHasChanges(true)}
          className="mt-4 flex flex-col gap-y-1"
        >
          {selectedProvider &&
            PROVIDERS.find(
              (provider) => provider.value === selectedProvider
            )?.options(settings)}
        </div>
      </div>
    </form>
  );
}
