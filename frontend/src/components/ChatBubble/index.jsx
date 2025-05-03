import React from "react";
import UserIcon from "../UserIcon";
import { userFromStorage } from "@/utils/request";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";

export default function ChatBubble({ message, type, popMsg }) {
  // 判断消息是否来自用户
  const isUser = type === "user";

  return (
    <div
      className={`flex justify-center items-end w-full bg-theme-bg-secondary`}
    >
      {/* 聊天气泡容器 */}
      <div className={`py-6 px-5 w-full flex gap-x-5 md:max-w-[80%] flex-col`}>
        <div className="flex gap-x-5">
          {/* 用户头像 */}
          <UserIcon
            user={{ uid: isUser ? userFromStorage()?.username : "system" }}
            role={type}
          />

          {/* 消息内容区域 */}
          <div
            className={`markdown whitespace-pre-line text-white/90 font-normal text-sm md:text-[15px] flex flex-col gap-y-1.5 mt-2 leading-relaxed`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(renderMarkdown(message)),
            }}
          />
        </div>
      </div>
    </div>
  );
}
