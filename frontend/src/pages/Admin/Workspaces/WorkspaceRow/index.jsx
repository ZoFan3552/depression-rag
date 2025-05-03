import { useRef } from "react";
import Admin from "@/models/admin";
import paths from "@/utils/paths";
import { LinkSimple, Trash } from "@phosphor-icons/react";

export default function WorkspaceRow({ workspace, users }) {
  const rowRef = useRef(null);
  
  // 处理删除工作区
  const handleDelete = async () => {
    if (
      !window.confirm(
        `您确定要删除 ${workspace.name} 吗？\n删除后，它将在抑郁症专家知识库系统中不可用。\n\n此操作不可逆。`
      )
    )
      return false;
    rowRef?.current?.remove();
    await Admin.deleteWorkspace(workspace.id);
  };

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10 hover:bg-white/5 transition-colors duration-200"
      >
        <th scope="row" className="px-6 whitespace-nowrap">
          {workspace.name}
        </th>
        <td className="px-6 flex items-center">
          <a
            href={paths.workspace.chat(workspace.slug)}
            target="_blank"
            rel="noreferrer"
            className="text-white flex items-center hover:underline hover:text-blue-300 transition-colors duration-200"
          >
            <LinkSimple className="mr-2 w-4 h-4" /> {workspace.slug}
          </a>
        </td>
        <td className="px-6">
          <a
            href={paths.workspace.settings.members(workspace.slug)}
            className="text-white flex items-center underline hover:text-blue-300 transition-colors duration-200"
          >
            {workspace.userIds?.length}
          </a>
        </td>
        <td className="px-6">{workspace.createdAt}</td>
        <td className="px-6 flex items-center gap-x-6 h-full mt-1">
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10 transition-all duration-200"
            title="删除工作区"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
    </>
  );
}
