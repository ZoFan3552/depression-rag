import UploadFile from "../UploadFile";
import PreLoader from "@/components/Preloader";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FolderRow from "./FolderRow";
import System from "@/models/system";
import { MagnifyingGlass, Plus, Trash } from "@phosphor-icons/react";
import Document from "@/models/document";
import showToast from "@/utils/toast";
import FolderSelectionPopup from "./FolderSelectionPopup";
import MoveToFolderIcon from "./MoveToFolderIcon";
import { useModal } from "@/hooks/useModal";
import NewFolderModal from "./NewFolderModal";
import debounce from "lodash.debounce";
import { filterFileSearchResults } from "./utils";
import ContextMenu from "./ContextMenu";
import { Tooltip } from "react-tooltip";
import { safeJsonParse } from "@/utils/request";

// 文件目录组件
function Directory({
  files,
  setFiles,
  loading,
  setLoading,
  workspace,
  fetchKeys,
  selectedItems,
  setSelectedItems,
  setHighlightWorkspace,
  moveToWorkspace,
  setLoadingMessage,
  loadingMessage,
}) {
  const { t } = useTranslation();
  const [amountSelected, setAmountSelected] = useState(0); // 已选择的项目数量
  const [showFolderSelection, setShowFolderSelection] = useState(false); // 是否显示文件夹选择弹窗
  const [searchTerm, setSearchTerm] = useState(""); // 搜索关键词
  const {
    isOpen: isFolderModalOpen,
    openModal: openFolderModal,
    closeModal: closeFolderModal,
  } = useModal();
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  }); // 右键菜单状态

  // 监听选中项目变化，更新选中数量
  useEffect(() => {
    setAmountSelected(Object.keys(selectedItems).length);
  }, [selectedItems]);

  // 删除文件处理函数
  const deleteFiles = async (event) => {
    event.stopPropagation();
    if (!window.confirm(t("connectors.directory.delete-confirmation"))) {
      return false;
    }

    try {
      const toRemove = [];
      const foldersToRemove = [];

      for (const itemId of Object.keys(selectedItems)) {
        for (const folder of files.items) {
          const foundItem = folder.items.find((file) => file.id === itemId);
          if (foundItem) {
            toRemove.push(`${folder.name}/${foundItem.name}`);
            break;
          }
        }
      }
      for (const folder of files.items) {
        if (folder.name === "custom-documents") {
          continue;
        }

        if (isSelected(folder.id, folder)) {
          foldersToRemove.push(folder.name);
        }
      }

      setLoading(true);
      setLoadingMessage(
        t("connectors.directory.removing-message", {
          count: toRemove.length,
          folderCount: foldersToRemove.length,
        })
      );
      await System.deleteDocuments(toRemove);
      for (const folderName of foldersToRemove) {
        await System.deleteFolder(folderName);
      }

      await fetchKeys(true);
      setSelectedItems({});
    } catch (error) {
      console.error("删除文件和文件夹失败:", error);
    } finally {
      setLoading(false);
      setSelectedItems({});
    }
  };

  // 切换选择状态的函数
  const toggleSelection = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = { ...prevSelectedItems };
      if (item.type === "folder") {
        // 选择文件夹中的所有文件
        if (newSelectedItems[item.name]) {
          delete newSelectedItems[item.name];
          item.items.forEach((file) => delete newSelectedItems[file.id]);
        } else {
          newSelectedItems[item.name] = true;
          item.items.forEach((file) => (newSelectedItems[file.id] = true));
        }
      } else {
        // 单个文件选择
        if (newSelectedItems[item.id]) {
          delete newSelectedItems[item.id];
        } else {
          newSelectedItems[item.id] = true;
        }
      }

      return newSelectedItems;
    });
  };

  // 根据selectedItems状态检查项目是否被选择
  const isSelected = (id, item) => {
    if (item && item.type === "folder") {
      if (!selectedItems[item.name]) {
        return false;
      }
      return item.items.every((file) => selectedItems[file.id]);
    }

    return !!selectedItems[id];
  };

  // 移动文件到指定文件夹
  const moveToFolder = async (folder) => {
    const toMove = [];
    for (const itemId of Object.keys(selectedItems)) {
      for (const currentFolder of files.items) {
        const foundItem = currentFolder.items.find(
          (file) => file.id === itemId
        );
        if (foundItem) {
          toMove.push({ ...foundItem, folderName: currentFolder.name });
          break;
        }
      }
    }
    setLoading(true);
    setLoadingMessage(`正在移动 ${toMove.length} 个文档，请稍候。`);
    const { success, message } = await Document.moveToFolder(
      toMove,
      folder.name
    );
    if (!success) {
      showToast(`移动文件出错: ${message}`, "error");
      setLoading(false);
      return;
    }

    if (success && message) {
      // 显示一些文件因为已嵌入而未被移动的信息
      showToast(message, "info");
    } else {
      showToast(
        t("connectors.directory.move-success", { count: toMove.length }),
        "success"
      );
    }
    await fetchKeys(true);
    setSelectedItems({});
    setLoading(false);
  };

  // 搜索处理函数（使用防抖）
  const handleSearch = debounce((e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
  }, 500);

  // 根据搜索词过滤文件
  const filteredFiles = filterFileSearchResults(files, searchTerm);

  // 处理右键菜单
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY });
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  return (
    <>
      <div className="px-8 pb-8" onContextMenu={handleContextMenu}>
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between w-[560px] px-5 relative">
            <h3 className="text-white text-base font-bold">
              我的文档
            </h3>
            <div className="relative">
              <input
                type="search"
                placeholder="搜索文档..."
                onChange={handleSearch}
                className="border-none search-input bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder focus:outline-primary-button active:outline-primary-button focus:ring-2 focus:ring-blue-400 outline-none text-sm rounded-lg pl-9 pr-3 py-2.5 w-[250px] h-[36px] light:border-theme-modal-border light:border transition-all duration-200"
              />
              <MagnifyingGlass
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                weight="bold"
              />
            </div>
            <button
              className="border-none flex items-center gap-x-2 cursor-pointer px-4 py-2 -mr-3 rounded-lg hover:bg-theme-sidebar-subitem-hover transition-colors duration-200 z-20 relative"
              onClick={openFolderModal}
            >
              <Plus
                size={18}
                weight="bold"
                className="text-theme-text-primary light:text-[#0ba5ec]"
              />
              <div className="text-theme-text-primary light:text-[#0ba5ec] text-xs font-bold leading-[18px]">
                新建文件夹
              </div>
            </button>
          </div>

          <div className="relative w-[560px] h-[310px] bg-theme-settings-input-bg rounded-2xl overflow-hidden border border-theme-modal-border shadow-md">
            <div className="absolute top-0 left-0 right-0 z-10 rounded-t-2xl text-theme-text-primary text-xs grid grid-cols-12 py-2.5 px-8 border-b border-white/20 shadow-md bg-theme-settings-input-bg">
              <p className="col-span-6">名称</p>
            </div>

            <div className="overflow-y-auto h-full pt-10 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center flex-col gap-y-5">
                  <PreLoader />
                  <p className="text-white text-sm font-semibold animate-pulse text-center w-1/3">
                    {loadingMessage}
                  </p>
                </div>
              ) : filteredFiles.length > 0 ? (
                filteredFiles.map(
                  (item, index) =>
                    item.type === "folder" && (
                      <FolderRow
                        key={index}
                        item={item}
                        selected={isSelected(
                          item.id,
                          item.type === "folder" ? item : null
                        )}
                        onRowClick={() => toggleSelection(item)}
                        toggleSelection={toggleSelection}
                        isSelected={isSelected}
                        autoExpanded={index === 0}
                      />
                    )
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white text-opacity-40 text-sm font-medium">
                    没有找到文档
                  </p>
                </div>
              )}
            </div>
            {amountSelected !== 0 && (
              <div className="absolute bottom-[12px] left-0 right-0 flex justify-center pointer-events-none">
                <div className="mx-auto bg-white/40 light:bg-white rounded-lg py-1.5 px-3 pointer-events-auto light:shadow-lg transition-all duration-200 hover:bg-white/50">
                  <div className="flex flex-row items-center gap-x-3">
                    <button
                      onClick={moveToWorkspace}
                      onMouseEnter={() => setHighlightWorkspace(true)}
                      onMouseLeave={() => setHighlightWorkspace(false)}
                      className="border-none text-sm font-semibold bg-white light:bg-[#E0F2FE] h-[32px] px-3 rounded-lg hover:bg-neutral-800/80 hover:text-white transition-colors duration-200 light:text-[#026AA2] light:hover:bg-[#026AA2] light:hover:text-white"
                    >
                      移动到工作区
                    </button>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowFolderSelection(!showFolderSelection)
                        }
                        className="border-none text-sm font-semibold bg-white light:bg-[#E0F2FE] h-[32px] w-[32px] rounded-lg text-dark-text hover:bg-neutral-800/80 hover:text-white transition-colors duration-200 light:text-[#026AA2] light:hover:bg-[#026AA2] light:hover:text-white flex justify-center items-center group"
                      >
                        <MoveToFolderIcon className="text-dark-text light:text-[#026AA2] group-hover:text-white" />
                      </button>
                      {showFolderSelection && (
                        <FolderSelectionPopup
                          folders={files.items.filter(
                            (item) => item.type === "folder"
                          )}
                          onSelect={moveToFolder}
                          onClose={() => setShowFolderSelection(false)}
                        />
                      )}
                    </div>
                    <button
                      onClick={deleteFiles}
                      className="border-none text-sm font-semibold bg-white light:bg-[#E0F2FE] h-[32px] w-[32px] rounded-lg text-dark-text hover:bg-neutral-800/80 hover:text-white transition-colors duration-200 light:text-[#026AA2] light:hover:bg-[#026AA2] light:hover:text-white flex justify-center items-center group"
                    >
                      <Trash size={18} weight="bold" className="group-hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <UploadFile
            workspace={workspace}
            fetchKeys={fetchKeys}
            setLoading={setLoading}
            setLoadingMessage={setLoadingMessage}
          />
        </div>
        {isFolderModalOpen && (
          <div className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center z-30">
            <NewFolderModal
              closeModal={closeFolderModal}
              files={files}
              setFiles={setFiles}
            />
          </div>
        )}
        <ContextMenu
          contextMenu={contextMenu}
          closeContextMenu={closeContextMenu}
          files={files}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
      <DirectoryTooltips />
    </>
  );
}

/**
 * 目录组件的工具提示。当目录显示或更新时渲染，
 * 以便工具提示能够随着项目的变化而附加上去。
 */
function DirectoryTooltips() {
  return (
    <Tooltip
      id="directory-item"
      place="bottom"
      delayShow={800}
      className="tooltip invert light:invert-0 z-99 max-w-[200px]"
      render={({ content }) => {
        const data = safeJsonParse(content, null);
        if (!data) return null;
        return (
          <div className="text-xs">
            <p className="text-white light:invert font-medium">{data.title}</p>
            <div className="flex mt-1 gap-x-2">
              <p className="">
                日期: <b>{data.date}</b>
              </p>
              <p className="">
                类型: <b>{data.extension}</b>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}

export default memo(Directory);
