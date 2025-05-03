import { useState } from "react";
import FileRow from "../FileRow";
import { CaretDown, FolderNotch } from "@phosphor-icons/react";
import { middleTruncate } from "@/utils/directories";

export default function FolderRow({
  item,
  selected,
  onRowClick,
  toggleSelection,
  isSelected,
  autoExpanded = false,
}) {
  // 控制文件夹展开/折叠状态
  const [expanded, setExpanded] = useState(autoExpanded);

  // 处理展开/折叠按钮点击事件
  const handleExpandClick = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <>
      <tr
        onClick={onRowClick}
        className={`text-theme-text-primary text-xs grid grid-cols-12 py-2.5 pl-3.5 pr-8 hover:bg-theme-file-picker-hover cursor-pointer file-row transition-colors duration-150 ${
          selected ? "selected light:text-white !text-white" : ""
        }`}
      >
        <div
          className={`col-span-6 flex gap-x-[6px] items-center ${
            selected ? "!text-white" : "text-theme-text-primary"
          }`}
        >
          <div
            className={`shrink-0 w-3.5 h-3.5 rounded border-[1px] border-solid border-white ${
              selected ? "text-white" : "text-theme-text-primary light:invert"
            } flex justify-center items-center cursor-pointer transition-colors duration-150`}
            role="checkbox"
            aria-checked={selected}
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              toggleSelection(item);
            }}
          >
            {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
          </div>
          <div
            onClick={handleExpandClick}
            className={`transform transition-transform duration-200 ${
              expanded ? "rotate-360" : " rotate-270"
            }`}
          >
            <CaretDown className="text-base font-bold w-4 h-4" />
          </div>
          <FolderNotch
            className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
            weight="fill"
          />
          <p className="whitespace-nowrap overflow-show max-w-[400px] font-medium">
            {middleTruncate(item.name, 35)}
          </p>
        </div>
        <p className="col-span-2 pl-3.5" />
        <p className="col-span-2 pl-2" />
      </tr>
      {expanded && (
        <>
          {item.items.map((fileItem) => (
            <FileRow
              key={fileItem.id}
              item={fileItem}
              selected={isSelected(fileItem.id)}
              toggleSelection={toggleSelection}
            />
          ))}
        </>
      )}
    </>
  );
}
