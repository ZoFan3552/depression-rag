import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function AddVariableModal({ closeModal, onRefresh }) {
  const [error, setError] = useState(null);

  // 处理创建新变量
  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.target);
    const newVariable = {};
    for (const [key, value] of formData.entries())
      newVariable[key] = value.trim();

    if (!newVariable.key || !newVariable.value) {
      setError("键名和值为必填项");
      return;
    }

    try {
      await System.promptVariables.create(newVariable);
      showToast("变量创建成功", "success", { clear: true });
      if (onRefresh) onRefresh();
      closeModal();
    } catch (error) {
      console.error("创建变量时出错:", error);
      setError("创建变量失败");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-xl shadow-lg border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              添加新变量
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1.5 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreate}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="key"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  键名
                </label>
                <input
                  name="key"
                  type="text"
                  minLength={3}
                  maxLength={255}
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-3 transition-all duration-200 focus:ring-2 focus:ring-primary-button/50"
                  placeholder="例如：treatment_method"
                  required={true}
                  autoComplete="off"
                  pattern="^[a-zA-Z0-9_]+$"
                />
                <p className="mt-2 text-xs text-white/60">
                  键名必须唯一，并将在抑郁症专家知识库系统的提示中用作 {"{键名}"}。仅允许使用字母、数字和下划线。
                </p>
              </div>
              <div>
                <label
                  htmlFor="value"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  值
                </label>
                <input
                  name="value"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-3 transition-all duration-200 focus:ring-2 focus:ring-primary-button/50"
                  placeholder="例如：认知行为疗法"
                  required={true}
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  描述
                </label>
                <input
                  name="description"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-3 transition-all duration-200 focus:ring-2 focus:ring-primary-button/50"
                  placeholder="可选描述"
                  autoComplete="off"
                />
              </div>
              {error && <p className="text-red-400 text-sm">错误: {error}</p>}
            </div>
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-80 px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md"
              >
                创建变量
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
