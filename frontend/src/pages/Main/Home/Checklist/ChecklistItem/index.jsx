import { useState } from "react";
import { CHECKLIST_STORAGE_KEY, CHECKLIST_UPDATED_EVENT } from "../constants";
import { Check } from "@phosphor-icons/react";
import { safeJsonParse } from "@/utils/request";

export function ChecklistItem({ id, title, action, onAction, icon: Icon }) {
  // 初始化完成状态，从本地存储中获取已完成的项目
  const [isCompleted, setIsCompleted] = useState(() => {
    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!stored) return false;
    const completedItems = safeJsonParse(stored, {});
    return completedItems[id] || false;
  });

  // 处理点击事件，完成或执行清单项目
  const handleClick = async (e) => {
    e.preventDefault();
    if (!isCompleted) {
      const shouldComplete = await onAction();
      if (shouldComplete) {
        // 更新本地存储中的完成状态
        const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
        const completedItems = stored ? JSON.parse(stored) : {};
        completedItems[id] = true;
        window.localStorage.setItem(
          CHECKLIST_STORAGE_KEY,
          JSON.stringify(completedItems)
        );
        setIsCompleted(true);
        // 触发清单更新事件
        window.dispatchEvent(new CustomEvent(CHECKLIST_UPDATED_EVENT));
      }
    } else {
      await onAction();
    }
  };

  return (
    <div
      className={`flex items-center gap-x-4 transition-colors cursor-pointer rounded-lg p-3 group hover:bg-blue-50 ${
        isCompleted
          ? "bg-blue-100"
          : "bg-white"
      }`}
      onClick={handleClick}
    >
      {Icon && (
        <div className="flex-shrink-0">
          <Icon
            size={18}
            className={
              isCompleted
                ? "text-blue-700"
                : "text-blue-600"
            }
          />
        </div>
      )}
      <div className="flex-1">
        <h3
          className={`text-sm font-medium transition-colors duration-200 ${
            isCompleted
              ? "text-blue-700 line-through"
              : "text-blue-800"
          }`}
        >
          {title}
        </h3>
      </div>
      {isCompleted ? (
        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
          <Check
            size={14}
            weight="bold"
            className="text-white"
          />
        </div>
      ) : (
        <button className="w-[64px] h-[24px] rounded-md bg-blue-500 text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center hover:bg-blue-600">
          {action === "Try" ? "尝试" : 
           action === "Go" ? "前往" : 
           action === "Create" ? "创建" : 
           action === "View" ? "查看" : 
           action === "Open" ? "打开" : action}
        </button>
      )}
    </div>
  );
}
