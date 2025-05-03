import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import { useTranslation } from "react-i18next";

export default function NewWorkspaceModal({ closeModal }) {
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  
  // 处理创建工作区
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Admin.newWorkspace(form.get("name"));
    if (!!workspace) window.location.reload();
    setError(error);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow-lg border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              创建新工作区
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  {t("common.workspaces-name")}
                </label>
                <input
                  name="name"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  placeholder="我的工作区"
                  minLength={4}
                  required={true}
                  autoComplete="off"
                />
              </div>
              {error && <p className="text-red-400 text-sm">错误: {error}</p>}
              <p className="text-white text-opacity-60 text-xs md:text-sm">
                创建此工作区后，只有管理员能够看到它。您可以在创建后添加用户。
              </p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm hover:scale-105"
              >
                取消
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-80 px-4 py-2 rounded-lg text-sm hover:scale-105 shadow-md"
              >
                创建工作区
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
