import { CloudArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import showToast from "../../../../../utils/toast";
import System from "../../../../../models/system";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import FileUploadProgress from "./FileUploadProgress";
import Workspace from "../../../../../models/workspace";
import debounce from "lodash.debounce";

// 文件上传组件
export default function UploadFile({
  workspace,
  fetchKeys,
  setLoading,
  setLoadingMessage,
}) {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false); // 服务处理器是否在线
  const [files, setFiles] = useState([]); // 待上传的文件列表
  const [fetchingUrl, setFetchingUrl] = useState(false); // 是否正在获取链接内容

  // 处理链接提交
  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("正在抓取链接内容...");
    setFetchingUrl(true);
    const formEl = e.target;
    const form = new FormData(formEl);
    const { response, data } = await Workspace.uploadLink(
      workspace.slug,
      form.get("link")
    );
    if (!response.ok) {
      showToast(`链接上传错误: ${data.error}`, "error");
    } else {
      fetchKeys(true);
      showToast("链接上传成功", "success");
      formEl.reset();
    }
    setLoading(false);
    setFetchingUrl(false);
  };

  // 使用防抖处理所有fetchKeys调用，防止频繁请求服务器
  // 成功或失败都会触发fetchKeys调用，以确保UI不会一直处于加载状态
  const debouncedFetchKeys = debounce(() => fetchKeys(true), 1000);
  const handleUploadSuccess = () => debouncedFetchKeys();
  const handleUploadError = () => debouncedFetchKeys();

  // 处理文件拖放
  const onDrop = async (acceptedFiles, rejections) => {
    const newAccepted = acceptedFiles.map((file) => {
      return {
        uid: v4(),
        file,
      };
    });
    const newRejected = rejections.map((file) => {
      return {
        uid: v4(),
        file: file.file,
        rejected: true,
        reason: file.errors[0].code,
      };
    });
    setFiles([...newAccepted, ...newRejected]);
  };

  // 组件加载时检查文档处理器是否在线
  useEffect(() => {
    async function checkProcessorOnline() {
      const online = await System.checkDocumentProcessorOnline();
      setReady(online);
    }
    checkProcessorOnline();
  }, []);

  // 拖放区域配置
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: !ready,
  });

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-[560px] border-dashed border-[2px] border-theme-modal-border light:border-[#686C6F] rounded-2xl bg-theme-bg-primary transition-all duration-300 p-4 ${
          ready
            ? "light:bg-[#E0F2FE] cursor-pointer hover:bg-theme-bg-secondary light:hover:bg-transparent hover:border-blue-400 shadow-sm hover:shadow-md"
            : "cursor-not-allowed opacity-80"
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {ready === false ? (
          <div className="flex flex-col items-center justify-center h-full py-4">
            <CloudArrowUp className="w-10 h-10 text-white/80 light:invert mb-2" />
            <div className="text-white text-opacity-80 text-sm font-semibold py-1.5">
              {t("connectors.upload.processor-offline")}
            </div>
            <div className="text-white text-opacity-60 text-xs font-medium py-1.5 px-20 text-center">
              {t("connectors.upload.processor-offline-desc")}
            </div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4">
            <CloudArrowUp className="w-10 h-10 text-white/80 light:invert mb-2 animate-pulse" />
            <div className="text-white text-opacity-80 text-sm font-semibold py-1.5">
              点击或拖拽文件到此处上传
            </div>
            <div className="text-white text-opacity-60 text-xs font-medium py-1.5">
              支持的文件类型：PDF、DOCX、TXT、MD
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 overflow-auto max-h-[200px] p-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {files.map((file) => (
              <FileUploadProgress
                key={file.uid}
                file={file.file}
                uuid={file.uid}
                setFiles={setFiles}
                slug={workspace.slug}
                rejected={file?.rejected}
                reason={file?.reason}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                setLoading={setLoading}
                setLoadingMessage={setLoadingMessage}
              />
            ))}
          </div>
        )}
      </div>
      <div className="text-center text-white text-opacity-50 text-xs font-medium w-[560px] py-3">
        或者提交网页链接
      </div>
      <form onSubmit={handleSendLink} className="flex gap-x-3 w-[560px]">
        <input
          disabled={fetchingUrl}
          name="link"
          type="url"
          className="border-none disabled:bg-theme-settings-input-bg disabled:text-theme-settings-input-placeholder bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button focus:ring-2 focus:ring-blue-400 outline-none block w-3/4 p-3 transition-all duration-200"
          placeholder="输入网页链接 (例如: https://example.com)"
          autoComplete="off"
        />
        <button
          disabled={fetchingUrl}
          type="submit"
          className="disabled:bg-white/20 disabled:text-slate-300 disabled:border-slate-400 disabled:cursor-wait bg-transparent hover:bg-slate-200 hover:text-slate-800 w-auto border border-white light:border-theme-modal-border text-sm text-white p-3 rounded-lg transition-colors duration-300 hover:shadow-md active:scale-95"
        >
          {fetchingUrl
            ? "获取中..."
            : "获取网页内容"}
        </button>
      </form>
      <div className="mt-6 text-center text-white text-opacity-80 text-xs font-medium w-[560px]">
        隐私提示：所有文件和链接内容仅存储在您的本地设备上
      </div>
    </div>
  );
}
