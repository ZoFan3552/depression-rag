import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { Plus, CircleNotch, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ThreadItem from "./ThreadItem";
import { useParams } from "react-router-dom";
export const THREAD_RENAME_EVENT = "renameThread";

export default function ThreadContainer({ workspace }) {
  const { threadSlug = null } = useParams();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ctrlPressed, setCtrlPressed] = useState(false);

  useEffect(() => {
    const chatHandler = (event) => {
      const { threadSlug, newName } = event.detail;
      setThreads((prevThreads) =>
        prevThreads.map((thread) => {
          if (thread.slug === threadSlug) {
            return { ...thread, name: newName };
          }
          return thread;
        })
      );
    };

    window.addEventListener(THREAD_RENAME_EVENT, chatHandler);

    return () => {
      window.removeEventListener(THREAD_RENAME_EVENT, chatHandler);
    };
  }, []);

  useEffect(() => {
    async function fetchThreads() {
      if (!workspace.slug) return;
      const { threads } = await Workspace.threads.all(workspace.slug);
      setLoading(false);
      setThreads(threads);
    }
    fetchThreads();
  }, [workspace.slug]);

  // 通过按住元键(Windows上的Ctrl或其他系统上的cmd/fn)启用批量删除功能
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (["Control", "Meta"].includes(event.key)) {
        setCtrlPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (["Control", "Meta"].includes(event.key)) {
        setCtrlPressed(false);
        // 切换时，重置批量操作进度，
        // 使之前标记但未删除的会话恢复原状
        setThreads((prev) =>
          prev.map((t) => {
            return { ...t, deleted: false };
          })
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const toggleForDeletion = (id) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return { ...t, deleted: !t.deleted };
      })
    );
  };

  const handleDeleteAll = async () => {
    const slugs = threads.filter((t) => t.deleted === true).map((t) => t.slug);
    await Workspace.threads.deleteBulk(workspace.slug, slugs);
    setThreads((prev) => prev.filter((t) => !t.deleted));

    // 仅在当前会话被删除时重定向
    if (slugs.includes(threadSlug)) {
      window.location.href = paths.workspace.chat(workspace.slug);
    }
  };

  function removeThread(threadId) {
    setThreads((prev) =>
      prev.map((_t) => {
        if (_t.id !== threadId) return _t;
        return { ..._t, deleted: true };
      })
    );

    // 显示会话已删除，然后从会话列表中完全移除，
    // 以便它不会出现在批量选择中
    setTimeout(() => {
      setThreads((prev) => prev.filter((t) => !t.deleted));
    }, 500);
  }

  if (loading) {
    return (
      <div className="flex flex-col bg-pulse w-full h-10 items-center justify-center">
        <p className="text-xs text-white animate-pulse">正在加载会话...</p>
      </div>
    );
  }

  const activeThreadIdx = !!threads.find(
    (thread) => thread?.slug === threadSlug
  )
    ? threads.findIndex((thread) => thread?.slug === threadSlug) + 1
    : 0;

  return (
    <div className="flex flex-col" role="list" aria-label="会话列表">
      <ThreadItem
        idx={0}
        activeIdx={activeThreadIdx}
        isActive={activeThreadIdx === 0}
        thread={{ slug: null, name: "默认" }}
        hasNext={threads.length > 0}
      />
      {threads.map((thread, i) => (
        <ThreadItem
          key={thread.slug}
          idx={i + 1}
          ctrlPressed={ctrlPressed}
          toggleMarkForDeletion={toggleForDeletion}
          activeIdx={activeThreadIdx}
          isActive={activeThreadIdx === i + 1}
          workspace={workspace}
          onRemove={removeThread}
          thread={thread}
          hasNext={i !== threads.length - 1}
        />
      ))}
      <DeleteAllThreadButton
        ctrlPressed={ctrlPressed}
        threads={threads}
        onDelete={handleDeleteAll}
      />
      <NewThreadButton workspace={workspace} />
    </div>
  );
}

function NewThreadButton({ workspace }) {
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(true);
    const { thread, error } = await Workspace.threads.new(workspace.slug);
    if (!!error) {
      showToast(`无法创建会话 - ${error}`, "error", { clear: true });
      setLoading(false);
      return;
    }
    window.location.replace(
      paths.workspace.thread(workspace.slug, thread.slug)
    );
  };

  return (
    <button
      onClick={onClick}
      className="w-full relative flex h-[40px] items-center border-none hover:bg-[var(--theme-sidebar-thread-selected)] hover:light:bg-theme-sidebar-subitem-hover rounded-lg transition-colors duration-200 hover:shadow-sm"
    >
      <div className="flex w-full gap-x-2 items-center pl-4">
        <div className="bg-white/20 p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
          {loading ? (
            <CircleNotch
              weight="bold"
              size={14}
              className="shrink-0 animate-spin text-white light:text-theme-text-primary"
            />
          ) : (
            <Plus
              weight="bold"
              size={14}
              className="shrink-0 text-white light:text-theme-text-primary"
            />
          )}
        </div>

        {loading ? (
          <p className="text-left text-white light:text-theme-text-primary text-sm">
            正在创建会话...
          </p>
        ) : (
          <p className="text-left text-white light:text-theme-text-primary text-sm font-medium">
            新建会话
          </p>
        )}
      </div>
    </button>
  );
}

function DeleteAllThreadButton({ ctrlPressed, threads, onDelete }) {
  if (!ctrlPressed || threads.filter((t) => t.deleted).length === 0)
    return null;
  return (
    <button
      type="button"
      onClick={onDelete}
      className="w-full relative flex h-[40px] items-center border-none hover:bg-red-400/20 rounded-lg group transition-colors duration-200"
    >
      <div className="flex w-full gap-x-2 items-center pl-4">
        <div className="bg-transparent p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
          <Trash
            weight="bold"
            size={14}
            className="shrink-0 text-white light:text-red-500/50 group-hover:text-red-400 transition-colors duration-200"
          />
        </div>
        <p className="text-white light:text-theme-text-secondary text-left text-sm group-hover:text-red-400 transition-colors duration-200">
          删除选中项
        </p>
      </div>
    </button>
  );
}
