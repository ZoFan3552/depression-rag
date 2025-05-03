import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function EditVariableModal({ variable, closeModal, onRefresh }) {
  const [error, setError] = useState(null);

  // 处理变量更新
  const handleUpdate = async (e) => {
    if (!variable.id) return;
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.target);
    const updatedVariable = {};
    for (const [key, value] of formData.entries())
      updatedVariable[key] = value.trim();

    if (!updatedVariable.key || !updatedVariable.value) {
      setError("键名和值为必填项");
      return;
    }

    try {
      await System.promptVariables.update(variable.id, updatedVariable);
      showToast("变量更新成功", "success", { clear: true });
      if (onRefresh) onRefresh();
      closeModal();
    } catch (error) {
      console.error("更新变量时出错:", error);
      setError("更新变量失败");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-xl shadow-lg border-2 border-theme-modal-border transition-all duration-300">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              编辑 {variable.key}
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
          <form onSubmit={handleUpdate}>
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
                  minLength={3}
                  maxLength={255}
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-3 transition-all duration-200 focus:ring-2 focus:ring-primary-button/50"
                  placeholder="例如：company_name"
                  defaultValue={variable.key}
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
                  placeholder="例如：心理健康中心"
                  defaultValue={variable.value}
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
                  defaultValue={variable.description}
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
                更新变量
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
