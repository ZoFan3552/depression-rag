import React from "react";
import {
  formatDate,
  getFileExtension,
  middleTruncate,
} from "@/utils/directories";
import { File } from "@phosphor-icons/react";

export default function FileRow({ item, selected, toggleSelection }) {
  return (
    <tr
      onClick={() => toggleSelection(item)}
      className={`text-theme-text-primary text-xs grid grid-cols-12 py-2.5 pl-3.5 pr-8 hover:bg-theme-file-picker-hover cursor-pointer file-row transition-colors duration-150 ${
        selected ? "selected light:text-white" : ""
      }`}
    >
      <div
        data-tooltip-id={`directory-item`}
        className="col-span-10 w-fit flex gap-x-[6px] items-center relative"
        data-tooltip-content={JSON.stringify({
          title: item.title,
          date: formatDate(item?.published),
          extension: getFileExtension(item.url).toUpperCase(),
        })}
      >
        <div
          className={`shrink-0 w-3.5 h-3.5 rounded border-[1px] border-solid border-white ${
            selected ? "text-white" : "text-theme-text-primary light:invert"
          } flex justify-center items-center cursor-pointer transition-colors duration-150`}
          role="checkbox"
          aria-checked={selected}
          tabIndex={0}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
        </div>
        <File
          className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
          weight="fill"
        />
        <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[400px] font-medium">
          {middleTruncate(item.title, 55)}
        </p>
      </div>
      <div className="col-span-2 flex justify-end items-center">
        {item?.cached && (
          <div className="bg-theme-settings-input-active rounded-3xl shadow-sm transition-shadow duration-200">
            <p className="text-xs px-2.5 py-0.5 font-medium">已缓存</p>
          </div>
        )}
      </div>
    </tr>
  );
}
