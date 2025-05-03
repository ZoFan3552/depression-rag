import { Pencil } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";

// 编辑消息的事件名称
const EDIT_EVENT = "toggle-message-edit";

export function useEditMessage({ chatId, role }) {
  // 控制消息是否处于编辑状态的钩子
  const [isEditing, setIsEditing] = useState(false);

  // 处理编辑事件的函数
  function onEditEvent(e) {
    if (e.detail.chatId !== chatId || e.detail.role !== role) {
      setIsEditing(false);
      return false;
    }
    setIsEditing((prev) => !prev);
  }

  useEffect(() => {
    // 监听编辑事件
    function listenForEdits() {
      if (!chatId || !role) return;
      window.addEventListener(EDIT_EVENT, onEditEvent);
    }
    listenForEdits();
    return () => {
      window.removeEventListener(EDIT_EVENT, onEditEvent);
    };
  }, [chatId, role]);

  return { isEditing, setIsEditing };
}

export function EditMessageAction({ chatId = null, role, isEditing }) {
  // 处理编辑按钮点击事件
  function handleEditClick() {
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role } })
    );
  }

  if (!chatId || isEditing) return null;
  return (
    <div
      className={`mt-3 relative transition-opacity ${
        role === "user" && !isEditing ? "" : "!opacity-100"
      }`}
    >
      <button
        onClick={handleEditClick}
        data-tooltip-id="edit-input-text"
        data-tooltip-content={`编辑${
          role === "user" ? "问题" : "回答"
        }`}
        className="border-none text-zinc-300 hover:text-zinc-100 transition-colors duration-200"
        aria-label={`编辑${role === "user" ? "问题" : "回答"}`}
      >
        <Pencil
          color="var(--theme-sidebar-footer-icon-fill)"
          size={21}
          className="mb-1"
        />
      </button>
    </div>
  );
}

export function EditMessageForm({
  role,
  chatId,
  message,
  attachments = [],
  adjustTextArea,
  saveChanges,
}) {
  const formRef = useRef(null);
  
  // 保存编辑后消息的函数
  function handleSaveMessage(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const editedMessage = form.get("editedMessage");
    saveChanges({ editedMessage, chatId, role, attachments });
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role, attachments } })
    );
  }

  // 取消编辑的函数
  function cancelEdits() {
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role, attachments } })
    );
    return false;
  }

  useEffect(() => {
    // 自动聚焦并调整文本区域大小
    if (!formRef || !formRef.current) return;
    formRef.current.focus();
    adjustTextArea({ target: formRef.current });
  }, [formRef]);

  return (
    <form onSubmit={handleSaveMessage} className="flex flex-col w-full">
      <textarea
        ref={formRef}
        name="editedMessage"
        className="text-white w-full rounded-lg bg-theme-bg-secondary border border-white/20 active:outline-none focus:outline-none focus:ring-0 pr-16 pl-3 py-2.5 resize-y transition-all duration-200 shadow-sm"
        defaultValue={message}
        onChange={adjustTextArea}
      />
      <div className="mt-4 flex justify-center space-x-3">
        <button
          type="submit"
          className="border-none px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
        >
          保存并提交
        </button>
        <button
          type="button"
          className="border-none px-4 py-2 bg-historical-msg-system text-white font-medium rounded-md hover:bg-historical-msg-user/90 light:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
          onClick={cancelEdits}
        >
          取消
        </button>
      </div>
    </form>
  );
}
