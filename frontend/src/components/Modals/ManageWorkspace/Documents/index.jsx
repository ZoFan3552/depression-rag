import { ArrowsDownUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";
import showToast from "../../../../utils/toast";
import Directory from "./Directory";
import WorkspaceDirectory from "./WorkspaceDirectory";

// OpenAI每个token的成本
// 参考: https://openai.com/pricing#:~:text=%C2%A0/%201K%20tokens-,Embedding%20models,-Build%20advanced%20search

const MODEL_COSTS = {
  "text-embedding-ada-002": 0.0000001, // $0.0001 / 1K tokens
  "text-embedding-3-small": 0.00000002, // $0.00002 / 1K tokens
  "text-embedding-3-large": 0.00000013, // $0.00013 / 1K tokens
};

export default function DocumentSettings({ workspace, systemSettings }) {
  const [highlightWorkspace, setHighlightWorkspace] = useState(false);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspaceDocs, setWorkspaceDocs] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [movedItems, setMovedItems] = useState([]);
  const [embeddingsCost, setEmbeddingsCost] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  // 获取文件列表和工作区文档
  async function fetchKeys(refetchWorkspace = false) {
    setLoading(true);
    const localFiles = await System.localFiles();
    const currentWorkspace = refetchWorkspace
      ? await Workspace.bySlug(workspace.slug)
      : workspace;

    const documentsInWorkspace =
      currentWorkspace.documents.map((doc) => doc.docpath) || [];

    // 不在工作区中的文档
    const availableDocs = {
      ...localFiles,
      items: localFiles.items.map((folder) => {
        if (folder.items && folder.type === "folder") {
          return {
            ...folder,
            items: folder.items.filter(
              (file) =>
                file.type === "file" &&
                !documentsInWorkspace.includes(`${folder.name}/${file.name}`)
            ),
          };
        } else {
          return folder;
        }
      }),
    };

    // 已经在工作区中的文档
    const workspaceDocs = {
      ...localFiles,
      items: localFiles.items.map((folder) => {
        if (folder.items && folder.type === "folder") {
          return {
            ...folder,
            items: folder.items.filter(
              (file) =>
                file.type === "file" &&
                documentsInWorkspace.includes(`${folder.name}/${file.name}`)
            ),
          };
        } else {
          return folder;
        }
      }),
    };

    setAvailableDocs(availableDocs);
    setWorkspaceDocs(workspaceDocs);
    setLoading(false);
  }

  // 组件加载时获取文件
  useEffect(() => {
    fetchKeys(true);
  }, []);

  // 更新工作区
  const updateWorkspace = async (e) => {
    e.preventDefault();
    setLoading(true);
    showToast("正在更新工作区...", "info", { autoClose: false });
    setLoadingMessage("大型文档可能需要一些时间");

    const changesToSend = {
      adds: movedItems.map((item) => `${item.folderName}/${item.name}`),
    };

    setSelectedItems({});
    setHasChanges(false);
    setHighlightWorkspace(false);
    await Workspace.modifyEmbeddings(workspace.slug, changesToSend)
      .then((res) => {
        if (!!res.message) {
          showToast(`错误: ${res.message}`, "error", { clear: true });
          return;
        }
        showToast("工作区更新成功。", "success", {
          clear: true,
        });
      })
      .catch((error) => {
        showToast(`工作区更新失败: ${error}`, "error", {
          clear: true,
        });
      });

    setMovedItems([]);
    await fetchKeys(true);
    setLoading(false);
    setLoadingMessage("");
  };

  // 将选中的项目移动到工作区
  const moveSelectedItemsToWorkspace = () => {
    setHighlightWorkspace(false);
    setHasChanges(true);

    const newMovedItems = [];

    for (const itemId of Object.keys(selectedItems)) {
      for (const folder of availableDocs.items) {
        const foundItem = folder.items.find((file) => file.id === itemId);
        if (foundItem) {
          newMovedItems.push({ ...foundItem, folderName: folder.name });
          break;
        }
      }
    }

    let totalTokenCount = 0;
    newMovedItems.forEach((item) => {
      const { cached, token_count_estimate } = item;
      if (!cached) {
        totalTokenCount += token_count_estimate;
      }
    });

    // 仅当嵌入引擎为OpenAI时进行成本估算
    if (systemSettings?.EmbeddingEngine === "openai") {
      const COST_PER_TOKEN =
        MODEL_COSTS[
          systemSettings?.EmbeddingModelPref || "text-embedding-ada-002"
        ];

      const dollarAmount = (totalTokenCount / 1000) * COST_PER_TOKEN;
      setEmbeddingsCost(dollarAmount);
    }

    setMovedItems([...movedItems, ...newMovedItems]);

    let newAvailableDocs = JSON.parse(JSON.stringify(availableDocs));
    let newWorkspaceDocs = JSON.parse(JSON.stringify(workspaceDocs));

    for (const itemId of Object.keys(selectedItems)) {
      let foundItem = null;
      let foundFolderIndex = null;

      newAvailableDocs.items = newAvailableDocs.items.map(
        (folder, folderIndex) => {
          const remainingItems = folder.items.filter((file) => {
            const match = file.id === itemId;
            if (match) {
              foundItem = { ...file };
              foundFolderIndex = folderIndex;
            }
            return !match;
          });

          return {
            ...folder,
            items: remainingItems,
          };
        }
      );

      if (foundItem) {
        newWorkspaceDocs.items[foundFolderIndex].items.push(foundItem);
      }
    }

    setAvailableDocs(newAvailableDocs);
    setWorkspaceDocs(newWorkspaceDocs);
    setSelectedItems({});
  };

  return (
    <div className="flex upload-modal -mt-6 z-10 relative">
      <Directory
        files={availableDocs}
        setFiles={setAvailableDocs}
        loading={loading}
        loadingMessage={loadingMessage}
        setLoading={setLoading}
        workspace={workspace}
        fetchKeys={fetchKeys}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        updateWorkspace={updateWorkspace}
        highlightWorkspace={highlightWorkspace}
        setHighlightWorkspace={setHighlightWorkspace}
        moveToWorkspace={moveSelectedItemsToWorkspace}
        setLoadingMessage={setLoadingMessage}
      />
      <div className="upload-modal-arrow flex items-center justify-center mx-2">
        <ArrowsDownUp className="text-white text-base font-bold rotate-90 w-11 h-11 transition-transform hover:scale-110" />
      </div>
      <WorkspaceDirectory
        workspace={workspace}
        files={workspaceDocs}
        highlightWorkspace={highlightWorkspace}
        loading={loading}
        loadingMessage={loadingMessage}
        setLoadingMessage={setLoadingMessage}
        setLoading={setLoading}
        fetchKeys={fetchKeys}
        hasChanges={hasChanges}
        saveChanges={updateWorkspace}
        embeddingCosts={embeddingsCost}
        movedItems={movedItems}
      />
    </div>
  );
}
