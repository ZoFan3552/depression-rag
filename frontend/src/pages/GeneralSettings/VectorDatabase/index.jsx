import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import ChromaLogo from "@/media/vectordbs/chroma.png";
import LanceDbLogo from "@/media/vectordbs/lancedb.png";
import QDrantLogo from "@/media/vectordbs/qdrant.png";
import PreLoader from "@/components/Preloader";
import ChangeWarningModal from "@/components/ChangeWarning";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import LanceDBOptions from "@/components/VectorDBSelection/LanceDBOptions";
import ChromaDBOptions from "@/components/VectorDBSelection/ChromaDBOptions";
import QDrantDBOptions from "@/components/VectorDBSelection/QDrantDBOptions";
import VectorDBItem from "@/components/VectorDBSelection/VectorDBItem";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";
import { useTranslation } from "react-i18next";

export default function GeneralVectorDatabase() {
  // 状态管理
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasEmbeddings, setHasEmbeddings] = useState(false);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVDBs, setFilteredVDBs] = useState([]);
  const [selectedVDB, setSelectedVDB] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();

  // 表单提交处理
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedVDB !== settings?.VectorDB && hasChanges && hasEmbeddings) {
      openModal();
    } else {
      await handleSaveSettings();
    }
  };

  // 保存设置
  const handleSaveSettings = async () => {
    setSaving(true);
    const form = document.getElementById("vectordb-form");
    const settingsData = {};
    const formData = new FormData(form);
    settingsData.VectorDB = selectedVDB;
    for (var [key, value] of formData.entries()) settingsData[key] = value;

    const { error } = await System.updateSystem(settingsData);
    if (error) {
      showToast(`向量数据库设置保存失败: ${error}`, "error");
      setHasChanges(true);
    } else {
      showToast("向量数据库偏好设置保存成功。", "success");
      setHasChanges(false);
    }
    setSaving(false);
    closeModal();
  };

  // 更新向量数据库选择
  const updateVectorChoice = (selection) => {
    setSearchQuery("");
    setSelectedVDB(selection);
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

  // 初始化加载设置
  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedVDB(_settings?.VectorDB || "lancedb");
      setHasEmbeddings(_settings?.HasExistingEmbeddings || false);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  // 根据搜索查询过滤向量数据库
  useEffect(() => {
    const filtered = VECTOR_DBS.filter((vdb) =>
      vdb.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVDBs(filtered);
  }, [searchQuery, selectedVDB]);

  // 向量数据库列表
  const VECTOR_DBS = [
    {
      name: "LanceDB",
      value: "lancedb",
      logo: LanceDbLogo,
      options: <LanceDBOptions />,
      description:
        "100%本地向量数据库，与抑郁症专家知识库系统在同一实例上运行。",
    },
    {
      name: "Chroma",
      value: "chroma",
      logo: ChromaLogo,
      options: <ChromaDBOptions settings={settings} />,
      description:
        "开源向量数据库，可以自行托管或部署在云端。",
    },
    {
      name: "QDrant",
      value: "qdrant",
      logo: QDrantLogo,
      options: <QDrantDBOptions settings={settings} />,
      description: "开源本地和分布式云向量数据库。",
    },
  ];

  const selectedVDBObject = VECTOR_DBS.find((vdb) => vdb.value === selectedVDB);

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <form
            id="vectordb-form"
            onSubmit={handleSubmit}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] py-16 md:py-6">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-xl leading-6 font-bold text-white">
                    {t("vector.title", "抑郁症专家知识库系统 - 向量数据库设置")}
                  </p>
                </div>
                <p className="text-sm leading-[18px] font-medium text-white text-opacity-70">
                  {t("vector.description", "在这里您可以配置用于存储和检索抑郁症知识嵌入向量的数据库，这对知识检索和智能问答至关重要。")}
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton
                    onClick={() => handleSubmit()}
                    className="mt-3 mr-0 -mb-14 z-10 hover:shadow-lg transition-all duration-300"
                  >
                    {saving ? t("common.saving", "正在保存...") : t("common.save", "保存更改")}
                  </CTAButton>
                )}
              </div>
              <div className="text-base font-bold text-white mt-6 mb-4">
                {t("vector.provider.title", "向量数据库提供商")}
              </div>
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
                          name="vdb-search"
                          autoComplete="off"
                          placeholder="搜索所有向量数据库提供商"
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
                        {filteredVDBs.map((vdb) => (
                          <VectorDBItem
                            key={vdb.name}
                            name={vdb.name}
                            value={vdb.value}
                            image={vdb.logo}
                            description={vdb.description}
                            checked={selectedVDB === vdb.value}
                            onClick={() => updateVectorChoice(vdb.value)}
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
                        src={selectedVDBObject.logo}
                        alt={`${selectedVDBObject.name} 标志`}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-white">
                          {selectedVDBObject.name}
                        </div>
                        <div className="mt-1 text-xs text-description">
                          {selectedVDBObject.description}
                        </div>
                      </div>
                    </div>
                    <CaretUpDown
                      size={24}
                      weight="bold"
                      className="text-white"
                    />
                  </button>
                )}
              </div>
              <div
                onChange={() => setHasChanges(true)}
                className="mt-4 flex flex-col gap-y-1"
              >
                {selectedVDB &&
                  VECTOR_DBS.find((vdb) => vdb.value === selectedVDB)?.options}
              </div>
            </div>
          </form>
        </div>
      )}
      <ModalWrapper isOpen={isOpen}>
        <ChangeWarningModal
          warningText="切换向量数据库将重置所有工作区中以前嵌入的文档。\n\n确认后将清除向量数据库中的所有嵌入，并从您的工作区中删除所有文档。您上传的文档不会被删除，它们将可用于重新嵌入。"
          onClose={closeModal}
          onConfirm={handleSaveSettings}
        />
      </ModalWrapper>
    </div>
  );
}
