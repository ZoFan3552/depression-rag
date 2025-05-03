import React, { useState, useEffect, memo } from "react";
import truncate from "truncate";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import Workspace from "../../../../../../models/workspace";
import { humanFileSize, milliToHms } from "../../../../../../utils/numbers";
import PreLoader from "../../../../../Preloader";

// 文件上传进度组件
function FileUploadProgressComponent({
  slug,
  uuid,
  file,
  setFiles,
  rejected = false,
  reason = null,
  onUploadSuccess,
  onUploadError,
  setLoading,
  setLoadingMessage,
}) {
  const [timerMs, setTimerMs] = useState(10); // 计时器毫秒数
  const [status, setStatus] = useState("pending"); // 上传状态：pending、complete、failed
  const [error, setError] = useState(""); // 错误信息
  const [isFadingOut, setIsFadingOut] = useState(false); // 是否正在淡出

  // 淡出处理函数
  const fadeOut = (cb) => {
    setIsFadingOut(true);
    cb?.();
  };

  // 开始淡出并移除此文件项
  const beginFadeOut = () => {
    setIsFadingOut(false);
    setFiles((prev) => {
      return prev.filter((item) => item.uid !== uuid);
    });
  };

  // 上传文件逻辑
  useEffect(() => {
    async function uploadFile() {
      setLoading(true);
      setLoadingMessage("正在上传文件...");
      const start = Number(new Date());
      const formData = new FormData();
      formData.append("file", file, file.name);
      const timer = setInterval(() => {
        setTimerMs(Number(new Date()) - start);
      }, 100);

      // 生产环境不支持分块流，所以我们只能等待
      const { response, data } = await Workspace.uploadFile(slug, formData);
      if (!response.ok) {
        setStatus("failed");
        clearInterval(timer);
        onUploadError(data.error);
        setError(data.error);
      } else {
        setLoading(false);
        setLoadingMessage("");
        setStatus("complete");
        clearInterval(timer);
        onUploadSuccess();
      }

      // 开始淡出计时器，清理上传队列
      setTimeout(() => {
        fadeOut(() => setTimeout(() => beginFadeOut(), 300));
      }, 5000);
    }
    !!file && !rejected && uploadFile();
  }, []);

  // 渲染被拒绝的文件项
  if (rejected) {
    return (
      <div
        className={`${
          isFadingOut ? "file-upload-fadeout" : "file-upload"
        } h-16 px-3 py-2.5 flex items-center gap-x-4 rounded-lg bg-error/40 light:bg-error/30 light:border-solid light:border-error/40 border border-transparent shadow-sm transition-all duration-300`}
      >
        <div className="w-7 h-7 flex-shrink-0">
          <XCircle
            color="var(--theme-bg-primary)"
            className="w-7 h-7 stroke-white bg-error rounded-full p-1 w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-white light:text-red-600 text-xs font-semibold">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-100 light:text-red-600 text-xs font-medium">
            {reason || "此文件上传失败"}
          </p>
        </div>
      </div>
    );
  }

  // 渲染上传失败的文件项
  if (status === "failed") {
    return (
      <div
        className={`${
          isFadingOut ? "file-upload-fadeout" : "file-upload"
        } h-16 px-3 py-2.5 flex items-center gap-x-4 rounded-lg bg-error/40 light:bg-error/30 light:border-solid light:border-error/40 border border-transparent shadow-sm transition-all duration-300`}
      >
        <div className="w-7 h-7 flex-shrink-0">
          <XCircle
            color="var(--theme-bg-primary)"
            className="h-7 stroke-white bg-error rounded-full p-1 w-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-white light:text-red-600 text-xs font-semibold">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-100 light:text-red-600 text-xs font-medium">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // 渲染正在上传或上传完成的文件项
  return (
    <div
      className={`${
        isFadingOut ? "file-upload-fadeout" : "file-upload"
      } h-16 px-3 py-2.5 flex items-center gap-x-4 rounded-lg bg-zinc-800 light:border-solid light:border-theme-modal-border light:bg-theme-bg-sidebar border border-white/20 shadow-md hover:shadow-lg transition-all duration-300`}
    >
      <div className="w-7 h-7 flex-shrink-0">
        {status !== "complete" ? (
          <div className="flex items-center justify-center">
            <PreLoader size="7" />
          </div>
        ) : (
          <CheckCircle
            color="var(--theme-bg-primary)"
            className="w-7 h-7 stroke-white bg-green-500 rounded-full p-1 w-full h-full animate-pulse"
          />
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-white light:text-theme-text-primary text-xs font-medium">
          {truncate(file.name, 30)}
        </p>
        <p className="text-white/80 light:text-theme-text-secondary text-xs font-medium">
          {humanFileSize(file.size)} | {status === "complete" ? "上传完成" : milliToHms(timerMs)}
        </p>
      </div>
    </div>
  );
}

export default memo(FileUploadProgressComponent);
