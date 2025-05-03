import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BookOpen } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import WorkspaceRow from "./WorkspaceRow";
import NewWorkspaceModal from "./NewWorkspaceModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";

/**
 * 管理员工作区页面组件
 * 用于显示和管理系统中的所有抑郁症知识库工作区
 */
export default function AdminWorkspaces() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[3px] md:mr-[18px] md:my-[16px] md:rounded-[18px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-5 md:p-0 shadow-lg"
      >
        <div className="flex flex-col w-full px-2 md:pl-7 md:pr-[55px] md:py-7 py-16">
          <div className="w-full flex flex-col gap-y-2 pb-6 border-white/15 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-xl leading-6 font-bold text-theme-text-primary">
                抑郁症知识库工作区列表
              </p>
            </div>
            <p className="text-sm leading-[20px] font-base text-theme-text-secondary">
              这里列出了系统中所有的抑郁症知识库工作区。删除工作区将会删除其关联的所有聊天记录和设置。
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={openModal}
              className="mt-4 mr-0 mb-5 md:-mb-14 z-10 hover:shadow-md transition-shadow duration-300"
            >
              <BookOpen className="h-5 w-5" weight="bold" /> 新建工作区
            </CTAButton>
          </div>
          <div className="overflow-x-auto">
            <WorkspacesContainer />
          </div>
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewWorkspaceModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

/**
 * 工作区容器组件
 * 负责获取和显示所有工作区的数据
 */
function WorkspacesContainer() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  // 获取用户和工作区数据
  useEffect(() => {
    async function fetchData() {
      try {
        const _users = await Admin.users();
        const _workspaces = await Admin.workspaces();
        setUsers(_users);
        setWorkspaces(_workspaces);
      } catch (error) {
        console.error("获取工作区数据失败:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 加载状态显示骨架屏
  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="var(--theme-bg-primary)"
        baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-5 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6 animate-pulse"
        containerClassName="flex w-full"
      />
    );
  }

  // 工作区列表表格
  return (
    <table className="w-full text-sm text-left rounded-lg mt-6 min-w-[640px] border-spacing-0 shadow-sm">
      <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/15 border-b">
        <tr>
          <th scope="col" className="px-6 py-4 rounded-tl-lg">
            名称
          </th>
          <th scope="col" className="px-6 py-4">
            链接
          </th>
          <th scope="col" className="px-6 py-4">
            用户
          </th>
          <th scope="col" className="px-6 py-4">
            创建时间
          </th>
          <th scope="col" className="px-6 py-4 rounded-tr-lg">
            操作
          </th>
        </tr>
      </thead>
      <tbody>
        {workspaces.length === 0 ? (
          <tr className="bg-theme-bg-secondary hover:bg-theme-bg-primary/50 transition-colors duration-200">
            <td colSpan="5" className="px-6 py-8 text-center text-theme-text-secondary">
              暂无抑郁症知识库工作区，请点击"新建工作区"按钮创建
            </td>
          </tr>
        ) : (
          workspaces.map((workspace) => (
            <WorkspaceRow
              key={workspace.id}
              workspace={workspace}
              users={users}
            />
          ))
        )}
      </tbody>
    </table>
  );
}
