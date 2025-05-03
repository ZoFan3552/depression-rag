import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Document from "@/models/document";

// 新建文件夹模态框组件
export default function NewFolderModal({ closeModal, files, setFiles }) {
  const [error, setError] = useState(null); // 错误信息
  const [folderName, setFolderName] = useState(""); // 文件夹名称

  // 创建文件夹处理函数
  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    if (folderName.trim() !== "") {
      const newFolder = {
        name: folderName,
        type: "folder",
        items: [],
      };
      const { success } = await Document.createFolder(folderName);
      if (success) {
        setFiles({
          ...files,
          items: [...files.items, newFolder],
        });
        closeModal();
      } else {
        setError("创建文件夹失败");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow-lg border-2 border-theme-modal-border transform transition-transform duration-300 ease-in-out">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              创建新文件夹
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1.5 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border hover:rotate-90"
            aria-label="关闭"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreate}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="folderName"
                  className="block mb-2.5 text-sm font-medium text-white"
                >
                  文件夹名称
                </label>
                <input
                  name="folderName"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button focus:ring-2 focus:ring-blue-400 outline-none block w-full p-3 transition-all duration-200"
                  placeholder="输入文件夹名称"
                  required={true}
                  autoComplete="off"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  错误: {error}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center mt-8 pt-5 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:shadow-md active:scale-95"
              >
                取消
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:bg-slate-200 px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
              >
                创建文件夹
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
