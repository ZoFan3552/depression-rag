import { useState, useEffect, createContext, useContext } from "react";
import { v4 } from "uuid";
import System from "@/models/system";
import { useDropzone } from "react-dropzone";
import DndIcon from "./dnd-icon.png";
import Workspace from "@/models/workspace";
import useUser from "@/hooks/useUser";

export const DndUploaderContext = createContext();
export const REMOVE_ATTACHMENT_EVENT = "ATTACHMENT_REMOVE";
export const CLEAR_ATTACHMENTS_EVENT = "ATTACHMENT_CLEAR";
export const PASTE_ATTACHMENT_EVENT = "ATTACHMENT_PASTED";

/**
 * 聊天容器页面上自动上传的文件附件
 * @typedef Attachment
 * @property {string} uid - 唯一文件ID
 * @property {File} file - 原生File对象
 * @property {string|null} contentString - 文件的base64编码字符串
 * @property {('in_progress'|'failed'|'success')} status - 自动上传状态
 * @property {string|null} error - 错误信息
 * @property {{id:string, location:string}|null} document - 上传文档详情
 * @property {('attachment'|'upload')} type - 上传类型。附件是聊天特定的，上传会存储到工作区
 */

export function DnDFileUploaderProvider({ workspace, children }) {
  const [files, setFiles] = useState([]);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    System.checkDocumentProcessorOnline().then((status) => setReady(status));
  }, [user]);

  useEffect(() => {
    window.addEventListener(REMOVE_ATTACHMENT_EVENT, handleRemove);
    window.addEventListener(CLEAR_ATTACHMENTS_EVENT, resetAttachments);
    window.addEventListener(PASTE_ATTACHMENT_EVENT, handlePastedAttachment);

    return () => {
      window.removeEventListener(REMOVE_ATTACHMENT_EVENT, handleRemove);
      window.removeEventListener(CLEAR_ATTACHMENTS_EVENT, resetAttachments);
      window.removeEventListener(
        PASTE_ATTACHMENT_EVENT,
        handlePastedAttachment
      );
    };
  }, []);

  /**
   * 从上传队列中移除文件
   * @param {CustomEvent<{uid: string}>} event
   */
  async function handleRemove(event) {
    /** @type {{uid: Attachment['uid'], document: Attachment['document']}} */
    const { uid, document } = event.detail;
    setFiles((prev) => prev.filter((prevFile) => prevFile.uid !== uid));
    if (!document?.location) return;
    await Workspace.deleteAndUnembedFile(workspace.slug, document.location);
  }

  /**
   * 清除当前在提示框中的已附加文件队列
   */
  function resetAttachments() {
    setFiles([]);
  }

  /**
   * 将文件转换为我们可以作为请求体发送到后端的附件
   * @returns {{name:string,mime:string,contentString:string}[]}
   */
  function parseAttachments() {
    return (
      files
        ?.filter((file) => file.type === "attachment")
        ?.map(
          (
            /** @type {Attachment} */
            attachment
          ) => {
            return {
              name: attachment.file.name,
              mime: attachment.file.type,
              contentString: attachment.contentString,
            };
          }
        ) || []
    );
  }

  /**
   * 处理粘贴的附件
   * @param {CustomEvent<{files: File[]}>} event
   */
  async function handlePastedAttachment(event) {
    const { files = [] } = event.detail;
    if (!files.length) return;
    const newAccepted = [];
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        newAccepted.push({
          uid: v4(),
          file,
          contentString: await toBase64(file),
          status: "success",
          error: null,
          type: "attachment",
        });
      } else {
        // 如果用户是默认用户，我们不允许他们上传文件
        if (!!user && user.role === "default") continue;
        newAccepted.push({
          uid: v4(),
          file,
          contentString: null,
          status: "in_progress",
          error: null,
          type: "upload",
        });
      }
    }
    setFiles((prev) => [...prev, ...newAccepted]);
    embedEligibleAttachments(newAccepted);
  }

  /**
   * 处理拖放的文件
   * @param {Attachment[]} acceptedFiles
   * @param {any[]} _rejections
   */
  async function onDrop(acceptedFiles, _rejections) {
    setDragging(false);

    /** @type {Attachment[]} */
    const newAccepted = [];
    for (const file of acceptedFiles) {
      if (file.type.startsWith("image/")) {
        newAccepted.push({
          uid: v4(),
          file,
          contentString: await toBase64(file),
          status: "success",
          error: null,
          type: "attachment",
        });
      } else {
        // 如果用户是默认用户，我们不允许他们上传文件
        if (!!user && user.role === "default") continue;
        newAccepted.push({
          uid: v4(),
          file,
          contentString: null,
          status: "in_progress",
          error: null,
          type: "upload",
        });
      }
    }

    setFiles((prev) => [...prev, ...newAccepted]);
    embedEligibleAttachments(newAccepted);
  }

  /**
   * 嵌入符合条件的附件 - 基本上是非图像的文件
   * @param {Attachment[]} newAttachments
   */
  function embedEligibleAttachments(newAttachments = []) {
    for (const attachment of newAttachments) {
      // 图像/附件是聊天特定的
      if (attachment.type === "attachment") continue;

      const formData = new FormData();
      formData.append("file", attachment.file, attachment.file.name);
      Workspace.uploadAndEmbedFile(workspace.slug, formData).then(
        ({ response, data }) => {
          const updates = {
            status: response.ok ? "success" : "failed",
            error: data?.error ?? null,
            document: data?.document,
          };

          setFiles((prev) => {
            return prev.map(
              (
                /** @type {Attachment} */
                prevFile
              ) => {
                if (prevFile.uid !== attachment.uid) return prevFile;
                return { ...prevFile, ...updates };
              }
            );
          });
        }
      );
    }
  }

  return (
    <DndUploaderContext.Provider
      value={{ files, ready, dragging, setDragging, onDrop, parseAttachments }}
    >
      {children}
    </DndUploaderContext.Provider>
  );
}

export default function DnDFileUploaderWrapper({ children }) {
  const { onDrop, ready, dragging, setDragging } =
    useContext(DndUploaderContext);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: !ready,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setDragging(true),
    onDragLeave: () => setDragging(false),
  });
  const { user } = useUser();
  const canUploadAll = !user || user?.role !== "default";

  return (
    <div
      className={`relative flex flex-col h-full w-full md:mt-0 mt-[40px] p-[1px]`}
      {...getRootProps()}
    >
      <div
        hidden={!dragging}
        className="absolute top-0 w-full h-full bg-dark-text/90 light:bg-[#C2E7FE]/90 rounded-2xl border-[4px] border-white z-[9999] transition-opacity duration-300"
      >
        <div className="w-full h-full flex justify-center items-center rounded-xl">
          <div className="flex flex-col gap-y-[14px] justify-center items-center">
            <img 
              src={DndIcon} 
              width={69} 
              height={69} 
              alt="拖放图标"
              className="animate-pulse" 
            />
            <p className="text-white text-[24px] font-semibold">
              添加{canUploadAll ? "任何文件" : "图片"}
            </p>
            <p className="text-white text-[16px] text-center">
              {canUploadAll ? (
                <>
                  将您的文件拖放到这里，自动<br />
                  嵌入到您的工作区中
                </>
              ) : (
                <>
                  将您的图片拖放到这里，<br />
                  即可立即开始聊天
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <input id="dnd-chat-file-uploader" {...getInputProps()} />
      {children}
    </div>
  );
}

/**
 * 将图像类型转换为Base64字符串用于请求
 * @param {File} file
 * @returns {Promise<string>}
 */
async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(`data:${file.type};base64,${base64String}`);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
