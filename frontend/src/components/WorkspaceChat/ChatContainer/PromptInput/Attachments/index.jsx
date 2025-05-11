import {
  CircleNotch,
  FileCode,
  FileCsv,
  FileDoc,
  FileHtml,
  FileText,
  FileImage,
  FilePdf,
  WarningOctagon,
  X,
} from "@phosphor-icons/react";
import { humanFileSize } from "@/utils/numbers";
import { REMOVE_ATTACHMENT_EVENT } from "../../DnDWrapper";
import { Tooltip } from "react-tooltip";

/**
 * 附件管理器组件，显示上传的文件
 * @param {{attachments: import("../../DnDWrapper").Attachment[]}}
 * @returns
 */
export default function AttachmentManager({ attachments }) {
  if (attachments.length === 0) return null;
  return (
    <div className="flex flex-wrap mt-4 mb-2 gap-y-2 gap-x-[0.5px]">
      {attachments.map((attachment) => (
        <AttachmentItem key={attachment.uid} attachment={attachment} />
      ))}
    </div>
  );
}

/**
 * 单个附件项组件
 * @param {{attachment: import("../../DnDWrapper").Attachment}}
 */
function AttachmentItem({ attachment }) {
  const { uid, file, status, error, document, type, contentString } =
    attachment;
  const { iconBgColor, Icon } = displayFromFile(file);

  function removeFileFromQueue() {
    window.dispatchEvent(
      new CustomEvent(REMOVE_ATTACHMENT_EVENT, { detail: { uid, document } })
    );
  }

  if (status === "in_progress") {
    return (
      <div
        className={`h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-zinc-800 light:bg-theme-bg-sidebar border border-white/20 w-[200px] transition-all duration-300`}
      >
        <div
          className={`${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
        >
          <CircleNotch
            size={30}
            className="text-white light:text-white animate-spin"
          />
        </div>
        <div className="flex flex-col w-[130px]">
          <p className="text-white text-xs font-medium truncate">{file.name}</p>
          <p className="text-white/60 text-xs font-medium">
            {humanFileSize(file.size)}
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <>
        <div
          data-tooltip-id={`attachment-uid-${uid}-error`}
          data-tooltip-content={error}
          className={`relative h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-error/40 light:bg-error/30 border border-transparent w-[200px] group transition-all duration-300 hover:bg-error/50`}
        >
          <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
            <button
              onClick={removeFileFromQueue}
              type="button"
              className="light:bg-white bg-zinc-700 hover:light:text-white hover:light:bg-red-400 hover:bg-red-400 rounded-full p-1 flex items-center justify-center hover:border-transparent border border-white/40 transition-colors duration-200"
            >
              <X size={10} className="flex-shrink-0" />
            </button>
          </div>
          <div
            className={`bg-error rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
          >
            <WarningOctagon size={30} className="text-white light:text-white" />
          </div>
          <div className="flex flex-col w-[130px]">
            <p className="text-white light:text-red-600 text-xs font-medium truncate">
              {file.name}
            </p>
            <p className="text-red-100 light:text-red-600 text-xs truncate">
              {error ?? "此文件上传失败"}。它将不会在工作区中可用。
            </p>
          </div>
        </div>
        <Tooltip
          id={`attachment-uid-${uid}-error`}
          place="top"
          delayShow={300}
          className="allm-tooltip !allm-text-xs"
        />
      </>
    );
  }

  if (type === "attachment") {
    return (
      <>
        <div
          data-tooltip-id={`attachment-uid-${uid}-success`}
          data-tooltip-content={`${file.name} 将作为附件添加到此提示中。它不会被永久嵌入到工作区中。`}
          className={`relative h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-zinc-800 light:bg-theme-bg-sidebar border border-white/20 w-[200px] group transition-all duration-300 hover:border-white/40`}
        >
          <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
            <button
              onClick={removeFileFromQueue}
              type="button"
              className="bg-zinc-700 light:bg-white hover:light:text-white hover:light:bg-red-400 hover:bg-red-400 rounded-full p-1 flex items-center justify-center hover:border-transparent border border-white/40 transition-colors duration-200"
            >
              <X size={10} className="flex-shrink-0" />
            </button>
          </div>
          {contentString ? (
            <img
              src={contentString}
              className={`${iconBgColor} w-[30px] h-[30px] rounded-lg flex items-center justify-center object-cover`}
            />
          ) : (
            <div
              className={`${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
            >
              <Icon size={30} className="text-white light:text-white" />
            </div>
          )}
          <div className="flex flex-col w-[130px]">
            <p className="text-white text-xs font-medium truncate">
              {file.name}
            </p>
            <p className="text-white/80 light:text-black/80 text-xs font-medium">
              图片已附加！
            </p>
          </div>
        </div>
        <Tooltip
          id={`attachment-uid-${uid}-success`}
          place="top"
          delayShow={300}
          className="allm-tooltip !allm-text-xs"
        />
      </>
    );
  }

  return (
    <>
      <div
        data-tooltip-id={`attachment-uid-${uid}-success`}
        data-tooltip-content={`${file.name} 已上传并嵌入到此工作区中。现在可以用于RAG聊天。`}
        className={`relative h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-zinc-800 light:bg-theme-bg-sidebar border border-white/20 w-[200px] group transition-all duration-300 hover:border-white/40`}
      >
        <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
          <button
            onClick={removeFileFromQueue}
            type="button"
            className="bg-zinc-700 light:bg-white hover:light:text-white hover:light:bg-red-400 hover:bg-red-400 rounded-full p-1 flex items-center justify-center hover:border-transparent border border-white/40 transition-colors duration-200"
          >
            <X size={10} className="flex-shrink-0" />
          </button>
        </div>
        <div
          className={`${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
        >
          <Icon size={30} className="text-white light:text-white" />
        </div>
        <div className="flex flex-col w-[130px]">
          <p className="text-white text-xs font-medium truncate">{file.name}</p>
          <p className="text-white/80 light:text-black/80 text-xs font-medium">
            文件已嵌入！
          </p>
        </div>
      </div>
      <Tooltip
        id={`attachment-uid-${uid}-success`}
        place="top"
        delayShow={300}
        className="allm-tooltip !allm-text-xs"
      />
    </>
  );
}

/**
 * 根据文件类型返回相应的图标和背景颜色
 * @param {File} file
 * @returns {{iconBgColor:string, Icon: React.Component}}
 */
function displayFromFile(file) {
  const extension = file?.name?.split(".")?.pop()?.toLowerCase() ?? "txt";
  switch (extension) {
    case "pdf":
      return { iconBgColor: "bg-magenta", Icon: FilePdf };
    case "doc":
    case "docx":
      return { iconBgColor: "bg-royalblue", Icon: FileDoc };
    case "html":
      return { iconBgColor: "bg-purple", Icon: FileHtml };
    case "csv":
    case "xlsx":
      return { iconBgColor: "bg-success", Icon: FileCsv };
    case "json":
    case "sql":
    case "js":
    case "jsx":
    case "cpp":
    case "c":
      return { iconBgColor: "bg-warn", Icon: FileCode };
    case "png":
    case "jpg":
    case "jpeg":
      return { iconBgColor: "bg-royalblue", Icon: FileImage };
    default:
      return { iconBgColor: "bg-royalblue", Icon: FileText };
  }
}
