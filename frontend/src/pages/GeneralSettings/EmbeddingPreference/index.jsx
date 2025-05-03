import React, { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import GenericOpenAiLogo from "@/media/llmprovider/generic-openai.png";

import PreLoader from "@/components/Preloader";
import ChangeWarningModal from "@/components/ChangeWarning";
import OpenAiOptions from "@/components/EmbeddingSelection/OpenAiOptions";
import NativeEmbeddingOptions from "@/components/EmbeddingSelection/NativeEmbeddingOptions";
import OllamaEmbeddingOptions from "@/components/EmbeddingSelection/OllamaOptions";
import GenericOpenAiEmbeddingOptions from "@/components/EmbeddingSelection/GenericOpenAiOptions";

import EmbedderItem from "@/components/EmbeddingSelection/EmbedderItem";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";
import { useTranslation } from "react-i18next";

/**
 * 可用的向量嵌入提供商配置
 * 用于将抑郁症相关文档转换为向量表示以便检索
 */
const EMBEDDERS = [
  {
    name: "内置向量嵌入器",
    value: "native",
    logo: AnythingLLMIcon,
    options: (settings) => <NativeEmbeddingOptions settings={settings} />,
    description:
      "使用系统内置的向量嵌入服务，零配置即可处理抑郁症文档。快速上手！",
  },
  {
    name: "OpenAI嵌入服务",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiOptions settings={settings} />,
    description: "适用于大多数非商业用途的标准选项，提供高质量的抑郁症文档理解能力。",
  },
  {
    name: "Ollama本地嵌入",
    value: "ollama",
    logo: OllamaLogo,
    options: (settings) => <OllamaEmbeddingOptions settings={settings} />,
    description: "在您自己的机器上本地运行嵌入模型，确保抑郁症敏感数据的隐私安全。",
  },
  {
    name: "通用OpenAI接口",
    value: "generic-openai",
    logo: GenericOpenAiLogo,
    options: (settings) => (
      <GenericOpenAiEmbeddingOptions settings={settings} />
    ),
    description: "通过任何兼容OpenAI的API服务运行嵌入模型，适用于专业医疗环境。",
  },
];

/**
 * 向量嵌入偏好设置页面组件
 * 用于配置抑郁症知识库文档的向量化方式
 */
export default function GeneralEmbeddingPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasEmbeddings, setHasEmbeddings] = useState(false);
  const [hasCachedEmbeddings, setHasCachedEmbeddings] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmbedders, setFilteredEmbedders] = useState([]);
  const [selectedEmbedder, setSelectedEmbedder] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();

  /**
   * 检查嵌入模型是否发生变化
   * @param {HTMLFormElement} formEl - 表单元素
   * @returns {boolean} 模型是否已更改
   */
  function embedderModelChanged(formEl) {
    try {
      const newModel = new FormData(formEl).get("EmbeddingModelPref") ?? null;
      if (newModel === null) return false;
      return settings?.EmbeddingModelPref !== newModel;
    } catch (error) {
      console.error("检查模型变化时出错:", error);
    }
    return false;
  }

  /**
   * 处理表单提交
   * 如果有现有嵌入且模型已更改，则显示警告
   * @param {Event} e - 表单提交事件
   */
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (
      (selectedEmbedder !== settings?.EmbeddingEngine ||
        embedderModelChanged(e?.target)) &&
      hasChanges &&
      (hasEmbeddings || hasCachedEmbeddings)
    ) {
      openModal();
    } else {
      await handleSaveSettings();
    }
  };

  /**
   * 保存嵌入设置
   */
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const form = document.getElementById("embedding-form");
      const settingsData = {};
      const formData = new FormData(form);
      settingsData.EmbeddingEngine = selectedEmbedder;
      for (var [key, value] of formData.entries()) settingsData[key] = value;

      const { error } = await System.updateSystem(settingsData);
      if (error) {
        showToast(`保存向量嵌入设置失败: ${error}`, "error");
        setHasChanges(true);
      } else {
        showToast("向量嵌入偏好设置保存成功。", "success");
        setHasChanges(false);
      }
    } catch (error) {
      console.error("保存设置时出错:", error);
      showToast("保存向量嵌入设置时发生错误", "error");
    } finally {
      setSaving(false);
      closeModal();
    }
  };

  /**
   * 更新选中的嵌入提供商
   * @param {string} selection - 所选嵌入器的值
   */
  const updateChoice = (selection) => {
    setSearchQuery("");
    setSelectedEmbedder(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  };

  /**
   * 处理搜索框X按钮点击
   */
  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  };

  // 初始加载系统设置
  useEffect(() => {
    async function fetchKeys() {
      try {
        const _settings = await System.keys();
        setSettings(_settings);
        setSelectedEmbedder(_settings?.EmbeddingEngine || "native");
        setHasEmbeddings(_settings?.HasExistingEmbeddings || false);
        setHasCachedEmbeddings(_settings?.HasCachedEmbeddings || false);
      } catch (error) {
        console.error("加载嵌入设置失败:", error);
        showToast("加载向量嵌入设置失败", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchKeys();
  }, []);

  // 根据搜索查询筛选嵌入提供商
  useEffect(() => {
    const filtered = EMBEDDERS.filter((embedder) =>
      embedder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmbedders(filtered);
  }, [searchQuery, selectedEmbedder]);

  // 获取选中的嵌入提供商对象
  const selectedEmbedderObject = EMBEDDERS.find(
    (embedder) => embedder.value === selectedEmbedder
  ) || EMBEDDERS[0]; // 默认使用第一个

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[3px] md:mr-[18px] md:my-[16px] md:rounded-[18px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-5 md:p-0 shadow-lg"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[3px] md:mr-[18px] md:my-[16px] md:rounded-[18px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-5 md:p-0 shadow-lg"
        >
          <form
            id="embedding-form"
            onSubmit={handleSubmit}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-2 md:pl-7 md:pr-[55px] py-16 md:py-7">
              <div className="w-full flex flex-col gap-y-2 pb-7 border-white light:border-theme-sidebar-border border-b-2 border-opacity-15">
                <div className="flex gap-x-4 items-center">
                  <p className="text-xl leading-7 font-bold text-white">
                    {t("embedding.title", "抑郁症文档向量嵌入设置")}
                  </p>
                </div>
                <p className="text-sm leading-[20px] font-base text-white text-opacity-70">
                  {t("embedding.desc-start", "抑郁症知识库需要将文档转换为向量以便AI理解和检索相关内容。")}
                  <br />
                  {t("embedding.desc-end", "更换嵌入模型将重置所有工作区中的嵌入文档，请谨慎操作。")}
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton
                    onClick={() => handleSubmit()}
                    className="mt-4 mr-0 -mb-14 z-10 hover:shadow-md transition-shadow duration-300"
                  >
                    {saving ? t("common.saving", "保存中...") : t("common.save", "保存更改")}
                  </CTAButton>
                )}
              </div>
              <div className="text-lg font-bold text-white mt-7 mb-4">
                {t("embedding.provider.title", "向量嵌入提供商")}
              </div>
              <div className="relative">
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
                          name="embedder-search"
                          autoComplete="off"
                          placeholder="搜索所有向量嵌入提供商"
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
                        {filteredEmbedders.map((embedder) => (
                          <EmbedderItem
                            key={embedder.name}
                            name={embedder.name}
                            value={embedder.value}
                            image={embedder.logo}
                            description={embedder.description}
                            checked={selectedEmbedder === embedder.value}
                            onClick={() => updateChoice(embedder.value)}
                          />
                        ))}
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
                        src={selectedEmbedderObject.logo}
                        alt={`${selectedEmbedderObject.name}图标`}
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-white">
                          {selectedEmbedderObject.name}
                        </div>
                        <div className="mt-1 text-xs text-description">
                          {selectedEmbedderObject.description}
                        </div>
                      </div>
                    </div>
                    <CaretUpDown
                      size={24}
                      weight="bold"
                      className="text-white text-opacity-80 group-hover:text-opacity-100"
                    />
                  </button>
                )}
              </div>
              <div
                onChange={() => setHasChanges(true)}
                className="mt-5 flex flex-col gap-y-2 bg-theme-bg-secondary p-4 rounded-lg shadow-md transition-all duration-300"
              >
                {selectedEmbedder &&
                  EMBEDDERS.find(
                    (embedder) => embedder.value === selectedEmbedder
                  )?.options(settings)}
              </div>
            </div>
          </form>
        </div>
      )}
      <ModalWrapper isOpen={isOpen}>
        <ChangeWarningModal
          warningText="更换向量嵌入模型将重置所有工作区中的已嵌入文档。

确认后将清除向量数据库中的所有嵌入内容，并从工作区中移除所有文档。您上传的原始文档不会被删除，可以重新进行向量嵌入处理。"
          onClose={closeModal}
          onConfirm={handleSaveSettings}
        />
      </ModalWrapper>
    </div>
  );
}
