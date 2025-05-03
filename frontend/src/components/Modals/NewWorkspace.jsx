import React, { useRef, useState } from "react";
import { X } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import { useTranslation } from "react-i18next";
import ModalWrapper from "@/components/ModalWrapper";

// 空操作函数
const noop = () => false;
export default function NewWorkspaceModal({ hideModal = noop }) {
  const formEl = useRef(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  // 处理创建工作区的函数
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = value;
    const { workspace, message } = await Workspace.new(data);
    if (!!workspace) {
      window.location.href = paths.workspace.chat(workspace.slug);
    }
    setError(message);
  };

  return (
    <ModalWrapper isOpen={true}>
      <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow-md border-2 border-theme-modal-border overflow-hidden transition duration-200">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("new-workspace.title")}
            </h3>
          </div>
          <button
            onClick={hideModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1.5 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form ref={formEl} onSubmit={handleCreate}>
            <div className="py-8 px-10 space-y-3 flex-col">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2.5 text-sm font-medium text-white"
                  >
                    {t("common.workspaces-name")}
                  </label>
                  <input
                    name="name"
                    type="text"
                    id="name"
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button focus:ring-2 focus:ring-primary-button/30 active:outline-primary-button outline-none block w-full p-3 transition-all"
                    placeholder={t("new-workspace.placeholder")}
                    required={true}
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm font-medium">错误: {error}</p>
                )}
              </div>
            </div>
            <div className="flex w-full justify-end items-center p-6 space-x-3 border-t border-theme-modal-border rounded-b">
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-80 active:opacity-70 px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}

// 用于控制新工作区模态框显示的钩子函数
export function useNewWorkspaceModal() {
  const [showing, setShowing] = useState(false);
  // 显示模态框
  const showModal = () => {
    setShowing(true);
  };
  // 隐藏模态框
  const hideModal = () => {
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
