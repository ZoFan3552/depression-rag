import { useState } from "react";

// 由于各提供商返回信息的复杂性，我们尚未支持所有向量数据库的重排序。
// 我们需要标准化响应数据，以便可以对每个提供商使用重排序器。
const supportedVectorDBs = ["lancedb"];
const hint = {
  default: {
    title: "默认",
    description:
      "这是性能最快的选项，但可能无法返回最相关的结果，导致模型产生幻觉。",
  },
  rerank: {
    title: "优化准确性",
    description:
      "大语言模型响应可能需要更长时间生成，但您的回答将更加准确和相关。",
  },
};

export default function VectorSearchMode({ workspace, setHasChanges }) {
  const [selection, setSelection] = useState(
    workspace?.vectorSearchMode ?? "default"
  );
  if (!workspace?.vectorDB || !supportedVectorDBs.includes(workspace?.vectorDB))
    return null;

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          搜索偏好
        </label>
      </div>
      <select
        name="vectorSearchMode"
        value={selection}
        className="border-none bg-theme-settings-input-bg text-white text-sm mt-2 rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 transition duration-200 cursor-pointer hover:bg-opacity-90"
        onChange={(e) => {
          setSelection(e.target.value);
          setHasChanges(true);
        }}
        required={true}
      >
        <option value="default">默认</option>
        <option value="rerank">优化准确性</option>
      </select>
      <p className="text-white text-opacity-60 text-xs font-medium py-1.5 mt-1">
        {hint[selection]?.description}
      </p>
    </div>
  );
}
