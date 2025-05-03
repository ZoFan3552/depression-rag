import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";

export default function EditingChatBubble({
  message,
  index,
  type,
  handleMessageChange,
  removeMessage,
}) {
  // ... existing code ...
  const [isEditing, setIsEditing] = useState(false);
  const [tempMessage, setTempMessage] = useState(message[type]);
  const isUser = type === "user";
  const { t } = useTranslation();

  return (
    <div>
      {/* 消息发送者标签 */}
      <p
        className={`text-xs font-medium text-white/90 light:text-black/80 mb-1 ${
          isUser ? "text-right" : ""
        }`}
      >
        {isUser ? t("common.user") : t("customization.items.welcome-messages.assistant")}
      </p>
      <div
        className={`relative flex w-full mt-1.5 items-start gap-2 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        {/* 删除消息按钮 */}
        <button
          className={`transition-all duration-300 absolute z-10 text-white/90 rounded-full hover:bg-neutral-700/80 light:hover:invert hover:border-white/80 border-transparent border shadow-lg ${
            isUser ? "right-0 mr-2" : "ml-2"
          }`}
          style={{ top: "6px", [isUser ? "right" : "left"]: "290px" }}
          onClick={() => removeMessage(index)}
          aria-label="删除消息"
        >
          <X className="m-0.5" size={20} />
        </button>
        {/* 消息气泡 */}
        <div
          className={`p-3 max-w-full md:w-[290px] text-black rounded-[10px] shadow-sm ${
            isUser
              ? "bg-[#41444C] text-white"
              : "bg-[#2E3036] text-white"
          }`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            // 编辑模式输入框
            <input
              value={tempMessage}
              onChange={(e) => setTempMessage(e.target.value)}
              onBlur={() => {
                handleMessageChange(index, type, tempMessage);
                setIsEditing(false);
              }}
              autoFocus
              className={`w-full py-1 px-2 rounded-md focus:outline-none focus:ring-1 focus:ring-white/30 ${
                isUser ? "bg-[#41444C] text-white" : "bg-[#2E3036] text-white"
              }`}
              placeholder="输入消息内容..."
            />
          ) : (
            // 显示消息内容
            tempMessage && (
              <div
                className="markdown font-[500] md:font-semibold text-sm md:text-base break-words light:invert"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(renderMarkdown(tempMessage)),
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
