import React, { useState, useEffect } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Plus } from "@phosphor-icons/react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import CTAButton from "@/components/lib/CTAButton";
import VariableRow from "./VariableRow";
import ModalWrapper from "@/components/ModalWrapper";
import AddVariableModal from "./AddVariableModal";
import { useModal } from "@/hooks/useModal";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SystemPromptVariables() {
  // ... existing code ...
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchVariables();
  }, []);

  // 获取变量数据
  const fetchVariables = async () => {
    setLoading(true);
    try {
      const { variables } = await System.promptVariables.getAll();
      setVariables(variables || []);
    } catch (error) {
      console.error("获取变量时出错:", error);
      showToast("未找到变量", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[24px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0 shadow-lg"
      >
        <div className="flex flex-col w-full px-1 md:pl-8 md:pr-[50px] md:py-8 py-16">
          <div className="w-full flex flex-col gap-y-2 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-xl leading-7 font-bold text-theme-text-primary">
                系统提示变量
              </p>
            </div>
            <p className="text-sm leading-[22px] font-medium text-theme-text-secondary">
              系统提示变量用于存储配置值，这些值可以在系统提示中引用，以便在抑郁症专家知识库系统的提示中启用动态内容。
            </p>
          </div>

          <div className="w-full justify-end flex">
            <CTAButton
              onClick={openModal}
              className="mt-4 mr-0 mb-5 md:-mb-6 z-10 hover:shadow-md transition-all duration-300"
            >
              <Plus className="h-4 w-4" weight="bold" /> 添加变量
            </CTAButton>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <Skeleton.default
                height="80vh"
                width="100%"
                highlightColor="var(--theme-bg-primary)"
                baseColor="var(--theme-bg-secondary)"
                count={1}
                className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-8"
                containerClassName="flex w-full"
              />
            ) : variables.length === 0 ? (
              <div className="text-center py-8 text-theme-text-secondary font-medium text-base">
                未找到变量
              </div>
            ) : (
              <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0 border-collapse">
                <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-4 rounded-tl-lg">
                      键名
                    </th>
                    <th scope="col" className="px-6 py-4">
                      值
                    </th>
                    <th scope="col" className="px-6 py-4">
                      描述
                    </th>
                    <th scope="col" className="px-6 py-4">
                      类型
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variables.map((variable) => (
                    <VariableRow
                      key={variable.id}
                      variable={variable}
                      onRefresh={fetchVariables}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ModalWrapper isOpen={isOpen}>
        <AddVariableModal closeModal={closeModal} onRefresh={fetchVariables} />
      </ModalWrapper>
    </div>
  );
}
