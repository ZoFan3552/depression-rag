import { Warning } from "@phosphor-icons/react";

export default function ContextualSaveBar({
  showing = false,
  onSave,
  onCancel,
}) {
  // 如果不显示，则返回 null
  if (!showing) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-dark-input flex items-center justify-end px-5 z-[999] shadow-md">
      {/* 警告信息区域 */}
      <div className="absolute ml-4 left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center gap-x-3">
        <Warning size={20} className="text-[#FFFFFF] opacity-90" />
        <p className="text-[#FFFFFF] font-medium text-sm">未保存的更改</p>
      </div>
      
      {/* 按钮区域 */}
      <div className="flex items-center gap-x-3">
        <button
          className="border-none text-theme-text-primary font-medium text-sm px-[12px] py-[7px] rounded-md bg-theme-bg-secondary hover:bg-theme-bg-primary transition-colors duration-200"
          onClick={onCancel}
        >
          取消
        </button>
        <button
          className="border-none text-theme-text-primary font-medium text-sm px-[12px] py-[7px] rounded-md bg-primary-button hover:bg-primary-button-hover transition-colors duration-200"
          onClick={onSave}
        >
          保存
        </button>
      </div>
    </div>
  );
}
