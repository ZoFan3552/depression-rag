import { useRef, useEffect } from "react";

export default function ContextMenu({
  contextMenu,
  closeContextMenu,
  files,
  selectedItems,
  setSelectedItems,
}) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    // 处理点击菜单外部区域的事件
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        closeContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeContextMenu]);

  // 检查是否所有项目都已被选中
  const isAllSelected = () => {
    const allItems = files.items.flatMap((folder) => [
      folder.name,
      ...folder.items.map((file) => file.id),
    ]);
    return allItems.every((item) => selectedItems[item]);
  };

  // 切换全选/取消全选状态
  const toggleSelectAll = () => {
    if (isAllSelected()) {
      setSelectedItems({});
    } else {
      const newSelectedItems = {};
      files.items.forEach((folder) => {
        newSelectedItems[folder.name] = true;
        folder.items.forEach((file) => {
          newSelectedItems[file.id] = true;
        });
      });
      setSelectedItems(newSelectedItems);
    }
    closeContextMenu();
  };

  if (!contextMenu.visible) return null;

  return (
    <div
      ref={contextMenuRef}
      style={{
        position: "fixed",
        top: `${contextMenu.y}px`,
        left: `${contextMenu.x}px`,
        zIndex: 1000,
      }}
      className="bg-theme-bg-secondary border border-theme-modal-border rounded-md shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <button
        onClick={toggleSelectAll}
        className="block w-full text-left px-4 py-2.5 text-sm text-theme-text-primary hover:bg-theme-file-picker-hover transition-colors duration-150 font-medium"
      >
        {isAllSelected() ? "取消全选" : "全选"}
      </button>
      <button
        onClick={closeContextMenu}
        className="block w-full text-left px-4 py-2.5 text-sm text-theme-text-primary hover:bg-theme-file-picker-hover transition-colors duration-150 font-medium"
      >
        取消
      </button>
    </div>
  );
}
