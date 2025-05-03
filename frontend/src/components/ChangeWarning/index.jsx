import { Warning, X } from "@phosphor-icons/react";

export default function ChangeWarningModal({
  warningText = "",
  onClose,
  onConfirm,
}) {
  return (
    <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow-lg border-2 border-theme-modal-border overflow-hidden z-9999">
      {/* 模态框标题区域 */}
      <div className="relative px-7 py-5 border-b rounded-t border-theme-modal-border">
        <div className="w-full flex gap-x-3 items-center">
          <Warning className="text-red-500 w-7 h-7" weight="fill" />
          <h3 className="text-xl font-semibold text-red-500 overflow-hidden overflow-ellipsis whitespace-nowrap">
            警告 - 此操作不可逆
          </h3>
        </div>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1.5 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          aria-label="关闭"
        >
          <X size={24} weight="bold" className="text-white" />
        </button>
      </div>
      {/* 警告内容区域 */}
      <div
        className="h-full w-full overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <div className="py-8 px-9 space-y-3 flex-col">
          <p className="text-white/90 leading-relaxed">
            {warningText.split("\\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
            <br />
            <br />
            您确定要继续吗？
          </p>
        </div>
      </div>
      {/* 按钮操作区域 */}
      <div className="flex w-full justify-end items-center p-6 space-x-3 border-t border-theme-modal-border rounded-b">
        <button
          onClick={onClose}
          type="button"
          className="transition-all duration-300 bg-transparent text-white hover:bg-theme-modal-border/30 px-5 py-2.5 rounded-lg text-sm border-none font-medium"
        >
          取消
        </button>
        <button
          onClick={onConfirm}
          type="submit"
          className="transition-all duration-300 bg-red-500 light:text-white text-white hover:bg-red-600 px-5 py-2.5 rounded-lg text-sm border-none font-medium shadow-sm"
        >
          确认
        </button>
      </div>
    </div>
  );
}
