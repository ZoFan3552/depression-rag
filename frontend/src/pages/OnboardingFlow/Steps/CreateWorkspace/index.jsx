import React, { useEffect, useRef, useState } from "react";
import illustration from "@/media/illustrations/create-workspace.png";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import Workspace from "@/models/workspace";
import { useTranslation } from "react-i18next";

export default function CreateWorkspace({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const { t } = useTranslation();
  const [workspaceName, setWorkspaceName] = useState("");
  const navigate = useNavigate();
  const createWorkspaceRef = useRef();
  const TITLE = t("onboarding.workspace.title");
  const DESCRIPTION = t("onboarding.workspace.description");

  // 设置页面标题和返回按钮
  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setBackBtn({ showing: false, disabled: false, onClick: handleBack });
  }, []);

  // 根据工作区名称状态更新前进按钮
  useEffect(() => {
    if (workspaceName.length > 0) {
      setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    } else {
      setForwardBtn({ showing: true, disabled: true, onClick: handleForward });
    }
  }, [workspaceName]);

  // 处理创建工作区
  const handleCreate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Workspace.new({
      name: form.get("name"),
      onboardingComplete: true,
    });
    if (!!workspace) {
      showToast(
        "工作区创建成功！正在跳转到首页...",
        "success"
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(paths.home());
    } else {
      showToast(`创建工作区失败: ${error}`, "error");
    }
  };

  function handleForward() {
    createWorkspaceRef.current.click();
  }

  function handleBack() {
    navigate(paths.onboarding.survey());
  }

  return (
    <form
      onSubmit={handleCreate}
      className="w-full flex items-center justify-center flex-col gap-y-2"
    >
      <img 
        src={illustration} 
        alt="创建工作区" 
        className="w-auto h-auto max-w-[400px] mb-4 transition-all duration-300 hover:scale-105"
      />
      <div className="flex flex-col gap-y-4 w-full max-w-[600px]">
        <div className="w-full mt-4">
          <label
            htmlFor="name"
            className="block mb-3 text-sm font-medium text-white"
          >
            {t("common.workspaces-name")}
          </label>
          <input
            name="name"
            type="text"
            className="border-none bg-theme-settings-input-bg text-white focus:outline-primary-button active:outline-primary-button placeholder:text-theme-settings-input-placeholder outline-none text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
            placeholder="我的工作区"
            required={true}
            autoComplete="off"
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>
        <p className="text-white/60 text-sm mt-2">
          创建工作区后，您可以添加文档和开始与文档进行对话。工作区可以与其他用户共享。
        </p>
      </div>
      <button
        type="submit"
        ref={createWorkspaceRef}
        hidden
        aria-hidden="true"
      ></button>
    </form>
  );
}
