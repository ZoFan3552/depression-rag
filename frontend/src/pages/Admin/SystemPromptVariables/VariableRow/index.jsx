import { useRef } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import EditVariableModal from "./EditVariableModal";
import { titleCase } from "text-case";
import truncate from "truncate";
import { Trash } from "@phosphor-icons/react";

/**
 * 用于显示系统提示变量的行组件
 * @param {{id: number|null, key: string, value: string, description: string, type: string}} variable - 要显示的系统提示变量
 * @param {Function} onRefresh - 变量刷新时调用的函数
 * @returns {JSX.Element} 用于显示变量的JSX元素
 */
export default function VariableRow({ variable, onRefresh }) {
  const rowRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();

  // 处理删除变量
  const handleDelete = async () => {
    if (!variable.id) return;
    if (
      !window.confirm(
        `您确定要删除变量"${variable.key}"吗？\n此操作不可逆。`
      )
    )
      return false;

    try {
      await System.promptVariables.delete(variable.id);
      rowRef?.current?.remove();
      showToast("变量删除成功", "success", { clear: true });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("删除变量时出错:", error);
      showToast("删除变量失败", "error", { clear: true });
    }
  };

  // 获取变量类型的颜色主题
  const getTypeColorTheme = (type) => {
    switch (type) {
      case "system":
        return {
          bg: "bg-blue-600/20",
          text: "text-blue-400 light:text-blue-800",
        };
      case "dynamic":
        return {
          bg: "bg-green-600/20",
          text: "text-green-400 light:text-green-800",
        };
      default:
        return {
          bg: "bg-yellow-600/20",
          text: "text-yellow-400 light:text-yellow-800",
        };
    }
  };

  const colorTheme = getTypeColorTheme(variable.type);

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-12 hover:bg-white/5 transition-colors duration-200"
      >
        <th scope="row" className="px-6 py-3 whitespace-nowrap font-semibold">
          {variable.key}
        </th>
        <td className="px-6 py-3">
          {typeof variable.value === "function"
            ? variable.value()
            : truncate(variable.value, 50)}
        </td>
        <td className="px-6 py-3">
          {truncate(variable.description || "-", 50)}
        </td>
        <td className="px-6 py-3">
          <span
            className={`rounded-full ${colorTheme.bg} px-3 py-1 text-xs leading-5 font-semibold ${colorTheme.text} shadow-sm`}
          >
            {titleCase(variable.type)}
          </span>
        </td>
        <td className="px-6 py-3 flex items-center justify-end gap-x-4">
          {variable.type === "static" && (
            <>
              <button
                onClick={openModal}
                className="text-xs font-medium text-white/80 light:text-black/80 rounded-lg hover:text-white hover:light:text-gray-500 px-3 py-1.5 hover:bg-white hover:bg-opacity-10 transition-all duration-200"
              >
                编辑
              </button>
              <button
                onClick={handleDelete}
                className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-3 py-1.5 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10 transition-all duration-200"
              >
                <Trash className="h-4 w-4" />
              </button>
            </>
          )}
        </td>
      </tr>
      <ModalWrapper isOpen={isOpen}>
        <EditVariableModal
          variable={variable}
          closeModal={closeModal}
          onRefresh={onRefresh}
        />
      </ModalWrapper>
    </>
  );
}
