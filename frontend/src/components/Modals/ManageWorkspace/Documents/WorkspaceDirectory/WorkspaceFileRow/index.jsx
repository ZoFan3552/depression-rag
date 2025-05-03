import { memo, useState } from "react";
import {
  formatDate,
  getFileExtension,
  middleTruncate,
} from "@/utils/directories";
import { ArrowUUpLeft, Eye, File, PushPin } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import System from "@/models/system";

// 工作区文件行组件
export default function WorkspaceFileRow({
  item,
  folderName,
  workspace,
  setLoading,
  setLoadingMessage,
  fetchKeys,
  hasChanges,
  movedItems,
  selected,
  toggleSelection,
  disableSelection,
  setSelectedItems,
}) {
  // 移除文件的处理函数
  const onRemoveClick = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      setLoadingMessage(`正在从工作区移除文件`);
      await Workspace.modifyEmbeddings(workspace.slug, {
        adds: [],
        deletes: [`${folderName}/${item.name}`],
      });
      await fetchKeys(true);
    } catch (error) {
      console.error("移除文档失败:", error);
    }
    setSelectedItems({});
    setLoadingMessage("");
    setLoading(false);
  };

  // 切换行选择状态
  function toggleRowSelection(e) {
    if (disableSelection) return;
    e.stopPropagation();
    toggleSelection();
  }

  // 处理行内复选框的点击
  function handleRowSelection(e) {
    e.stopPropagation();
    toggleSelection();
  }

  const isMovedItem = movedItems?.some((movedItem) => movedItem.id === item.id);
  return (
    <div
      className={`text-theme-text-primary text-xs grid grid-cols-12 py-2.5 pl-4 pr-8 h-[36px] items-center transition-colors duration-150 ${
        !disableSelection
          ? "hover:bg-theme-file-picker-hover cursor-pointer"
          : ""
      } ${isMovedItem ? "bg-green-800/40" : "file-row"} ${
        selected ? "selected light:text-white" : ""
      }`}
      onClick={toggleRowSelection}
    >
      <div
        className="col-span-10 w-fit flex gap-x-[3px] items-center relative"
        data-tooltip-id="ws-directory-item"
        data-tooltip-content={JSON.stringify({
          title: item.title,
          date: formatDate(item?.published),
          extension: getFileExtension(item.url).toUpperCase(),
        })}
      >
        <div className="shrink-0 w-3 h-3">
          {!disableSelection ? (
            <div
              className={`shrink-0 w-3 h-3 rounded border-[1px] border-solid border-white ${
                selected ? "text-white" : "text-theme-text-primary light:invert"
              } flex justify-center items-center cursor-pointer transition-all duration-150 hover:bg-white/10`}
              role="checkbox"
              aria-checked={selected}
              tabIndex={0}
              onClick={handleRowSelection}
            >
              {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
            </div>
          ) : null}
        </div>
        <File
          className="shrink-0 text-base font-bold w-4 h-4 mr-[4px] ml-1.5"
          weight="fill"
        />
        <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[400px]">
          {middleTruncate(item.title, 50)}
        </p>
      </div>
      <div className="col-span-2 flex justify-end items-center">
        {hasChanges ? (
          <div className="w-4 h-4 ml-2 flex-shrink-0" />
        ) : (
          <div className="flex gap-x-2 items-center">
            <WatchForChanges
              workspace={workspace}
              docPath={`${folderName}/${item.name}`}
              item={item}
            />
            <PinItemToWorkspace
              workspace={workspace}
              docPath={`${folderName}/${item.name}`}
              item={item}
            />
            <RemoveItemFromWorkspace item={item} onClick={onRemoveClick} />
          </div>
        )}
      </div>
    </div>
  );
}

// 将文件固定到工作区的组件
const PinItemToWorkspace = memo(({ workspace, docPath, item }) => {
  const [pinned, setPinned] = useState(
    item?.pinnedWorkspaces?.includes(workspace.id) || false
  );
  const [hover, setHover] = useState(false);
  const pinEvent = new CustomEvent("pinned_document");

  // 更新固定状态
  const updatePinStatus = async (e) => {
    try {
      e.stopPropagation();
      if (!pinned) window.dispatchEvent(pinEvent);
      const success = await Workspace.setPinForDocument(
        workspace.slug,
        docPath,
        !pinned
      );

      if (!success) {
        showToast(`${!pinned ? "固定" : "取消固定"}文档失败。`, "error", {
          clear: true,
        });
        return;
      }

      showToast(
        `文档已${!pinned ? "固定到" : "从"}工作区${!pinned ? "" : "取消固定"}`,
        "success",
        { clear: true }
      );
      setPinned(!pinned);
    } catch (error) {
      showToast(`固定文档失败。${error.message}`, "error", {
        clear: true,
      });
      return;
    }
  };

  if (!item) return <div className="w-[16px] p-[2px] ml-2" />;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={updatePinStatus}
      className="flex items-center ml-2 cursor-pointer transition-all duration-200"
      data-tooltip-id="pin-document"
      data-tooltip-content={
        pinned ? "取消固定" : "固定到工作区"
      }
    >
      {pinned ? (
        <div
          className={`bg-theme-settings-input-active rounded-3xl whitespace-nowrap transition-colors duration-200 ${hover ? "bg-red-500/20" : ""}`}
        >
          <p className={`text-xs px-2.5 py-0.5 ${hover ? "text-red-500" : ""}`}>
            {hover ? "取消固定" : "已固定"}
          </p>
        </div>
      ) : (
        <PushPin
          size={16}
          weight="regular"
          className="outline-none text-base font-bold flex-shrink-0 hover:scale-110 transition-transform duration-150"
        />
      )}
    </div>
  );
});

// 监控文件变化的组件
const WatchForChanges = memo(({ workspace, docPath, item }) => {
  const [watched, setWatched] = useState(item?.watched || false);
  const [hover, setHover] = useState(false);
  const watchEvent = new CustomEvent("watch_document_for_changes");

  // 更新监控状态
  const updateWatchStatus = async () => {
    try {
      if (!watched) window.dispatchEvent(watchEvent);
      const success =
        await System.experimentalFeatures.liveSync.setWatchStatusForDocument(
          workspace.slug,
          docPath,
          !watched
        );

      if (!success) {
        showToast(
          `${!watched ? "监控" : "取消监控"}文档失败。`,
          "error",
          {
            clear: true,
          }
        );
        return;
      }

      showToast(
        `文档${
          !watched
            ? "将被监控变化"
            : "不再被监控变化"
        }。`,
        "success",
        { clear: true }
      );
      setWatched(!watched);
    } catch (error) {
      showToast(`监控文档失败。${error.message}`, "error", {
        clear: true,
      });
      return;
    }
  };

  if (!item || !item.canWatch) return <div className="w-[16px] p-[2px] ml-2" />;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex gap-x-2 items-center hover:bg-theme-file-picker-hover p-[3px] rounded-md ml-2 transition-colors duration-150"
    >
      <Eye
        data-tooltip-id="watch-changes"
        data-tooltip-content={
          watched ? "停止监控变化" : "监控文档变化"
        }
        size={16}
        onClick={updateWatchStatus}
        weight={hover || watched ? "fill" : "regular"}
        className="outline-none text-base font-bold flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-150"
      />
    </div>
  );
});

// 从工作区移除项目的组件
const RemoveItemFromWorkspace = ({ item, onClick }) => {
  return (
    <div>
      <ArrowUUpLeft
        data-tooltip-id="remove-document"
        data-tooltip-content="从工作区移除文档"
        onClick={onClick}
        className="text-base font-bold w-4 h-4 ml-2 flex-shrink-0 cursor-pointer hover:text-red-400 transition-colors duration-200 hover:scale-110 transition-transform"
      />
    </div>
  );
};
