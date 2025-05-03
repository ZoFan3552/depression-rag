import { middleTruncate } from "@/utils/directories";

export default function FolderSelectionPopup({ folders, onSelect, onClose }) {
  // 处理文件夹选择事件
  const handleFolderSelect = (folder) => {
    onSelect(folder);
    onClose();
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto no-scroll border border-gray-100 transition-shadow duration-200">
      <ul className="py-1">
        {folders.map((folder) => (
          <li
            key={folder.name}
            onClick={() => handleFolderSelect(folder)}
            className="px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer whitespace-nowrap mx-1 my-0.5 transition-colors duration-150 font-medium"
          >
            {middleTruncate(folder.name, 25)}
          </li>
        ))}
      </ul>
    </div>
  );
}
