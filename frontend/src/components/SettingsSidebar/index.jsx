import React, { useEffect, useRef, useState } from "react";
import paths from "@/utils/paths";
import useLogo from "@/hooks/useLogo";
import {
  House,
  List,
  Robot,
  Flask,
  Gear,
  UserCircleGear,
  PencilSimpleLine,
  Nut,
  Toolbox,
  Globe,
} from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";
import { isMobile } from "react-device-detect";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import showToast from "@/utils/toast";
import System from "@/models/system";
import Option from "./MenuOption";
import { CanViewChatHistoryProvider } from "../CanViewChatHistory";

export default function SettingsSidebar() {
  const { t } = useTranslation();
  const { logo } = useLogo();
  const { user } = useUser();
  const sidebarRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBgOverlay, setShowBgOverlay] = useState(false);

  useEffect(() => {
    function handleBg() {
      if (showSidebar) {
        setTimeout(() => {
          setShowBgOverlay(true);
        }, 300);
      } else {
        setShowBgOverlay(false);
      }
    }
    handleBg();
  }, [showSidebar]);

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-4 py-2 bg-theme-bg-sidebar light:bg-white text-theme-text-secondary shadow-lg h-16">
          <button
            onClick={() => setShowSidebar(true)}
            className="rounded-md p-2 flex items-center justify-center text-theme-text-secondary hover:bg-theme-bg-secondary/20 transition-colors duration-200"
            aria-label="显示侧边栏"
          >
            <List className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-center flex-grow">
            <img
              src={logo}
              alt="标志"
              className="block mx-auto h-6 w-auto"
              style={{ maxHeight: "40px", objectFit: "contain" }}
            />
          </div>
          <div className="w-12"></div>
        </div>
        <div
          style={{
            transform: showSidebar ? `translateX(0vw)` : `translateX(-100vw)`,
          }}
          className={`z-99 fixed top-0 left-0 transition-all duration-500 w-[100vw] h-[100vh]`}
        >
          <div
            className={`${
              showBgOverlay
                ? "transition-all opacity-1"
                : "transition-none opacity-0"
            }  duration-500 fixed top-0 left-0 bg-theme-bg-secondary bg-opacity-75 w-screen h-screen`}
            onClick={() => setShowSidebar(false)}
          />
          <div
            ref={sidebarRef}
            className="h-[100vh] fixed top-0 left-0 rounded-r-[26px] bg-theme-bg-sidebar w-[80%] p-[18px] shadow-xl"
          >
            <div className="w-full h-full flex flex-col overflow-x-hidden items-between">
              {/* 头部信息 */}
              <div className="flex w-full items-center justify-between gap-x-4">
                <div className="flex shrink-1 w-fit items-center justify-start">
                  <img
                    src={logo}
                    alt="标志"
                    className="rounded w-full max-h-[40px]"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="flex gap-x-2 items-center text-slate-500 shrink-0">
                  <a
                    href={paths.home()}
                    className="transition-all duration-300 p-2 rounded-full text-white bg-theme-action-menu-bg hover:bg-theme-action-menu-item-hover hover:border-slate-100 hover:border-opacity-50 border-transparent border hover:shadow-md"
                    aria-label="回到首页"
                  >
                    <House className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* 主体内容 */}
              <div className="h-full flex flex-col w-full justify-between pt-4 overflow-y-scroll no-scroll">
                <div className="h-auto md:sidebar-items">
                  <div className="flex flex-col gap-y-4 pb-[60px] overflow-y-scroll no-scroll">
                    <SidebarOptions user={user} t={t} />
                    <div className="h-[1.5px] bg-[#3D4147] mx-3 mt-[14px]" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 pt-2 bg-theme-bg-sidebar bg-opacity-80 backdrop-filter backdrop-blur-md">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <Link
          to={paths.home()}
          className="flex shrink-0 max-w-[55%] items-center justify-start mx-[38px] my-[18px]"
          aria-label="回到首页"
        >
          <img
            src={logo}
            alt="标志"
            className="rounded max-h-[52px]"
            style={{ objectFit: "contain" }}
          />
        </Link>
        <div
          ref={sidebarRef}
          className="transition-all duration-500 relative m-[16px] rounded-[16px] bg-theme-bg-sidebar border-[2px] border-theme-sidebar-border light:border-none min-w-[250px] p-[10px] h-[calc(100%-76px)] shadow-sm"
        >
          <div className="w-full h-full flex flex-col overflow-x-hidden items-between min-w-[235px]">
            <div className="text-theme-text-secondary text-sm font-medium uppercase mt-[4px] mb-0 ml-2">
              {t("settings.title").replace("Settings", "设置")}
            </div>
            <div className="relative h-[calc(100%-60px)] flex flex-col w-full justify-between pt-[10px] overflow-y-scroll no-scroll">
              <div className="h-auto sidebar-items">
                <div className="flex flex-col gap-y-2 pb-[60px] overflow-y-scroll no-scroll">
                  <SidebarOptions user={user} t={t} />
                  <div className="h-[1.5px] bg-[#3D4147] mx-3 mt-[14px]" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 pt-4 pb-3 rounded-b-[16px] bg-theme-bg-sidebar bg-opacity-80 backdrop-filter backdrop-blur-md z-10">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const SidebarOptions = ({ user = null, t }) => (
  <CanViewChatHistoryProvider>
    {({ viewable: canViewChatHistory }) => (
      <>
        <Option
          btnText={t("settings.ai-providers").replace("AI Providers", "AI 提供商")}
          icon={<Gear className="h-5 w-5 flex-shrink-0" />}
          user={user}
          childOptions={[
            {
              btnText: t("settings.llm").replace("LLM", "大语言模型"),
              href: paths.settings.llmPreference(),
              flex: true,
              roles: ["admin"],
            },
            {
              btnText: t("settings.vector-database").replace("Vector Database", "向量数据库"),
              href: paths.settings.vectorDatabase(),
              flex: true,
              roles: ["admin"],
            },
            {
              btnText: t("settings.embedder").replace("Embedder", "嵌入模型"),
              href: paths.settings.embedder.modelPreference(),
              flex: true,
              roles: ["admin"],
            },
            {
              btnText: t("settings.text-splitting").replace("Text Splitting", "文本分割"),
              href: paths.settings.embedder.chunkingPreference(),
              flex: true,
              roles: ["admin"],
            },
            {
              btnText: t("settings.voice-speech").replace("Voice & Speech", "语音与朗读"),
              href: paths.settings.audioPreference(),
              flex: true,
              roles: ["admin"],
            },
          ]}
        />
        <Option
          btnText={t("settings.admin").replace("Admin", "管理员")}
          icon={<UserCircleGear className="h-5 w-5 flex-shrink-0" />}
          user={user}
          childOptions={[
            {
              btnText: t("settings.users").replace("Users", "用户"),
              href: paths.settings.users(),
              roles: ["admin", "manager"],
            },
            {
              btnText: t("settings.workspaces").replace("Workspaces", "工作区"),
              href: paths.settings.workspaces(),
              roles: ["admin", "manager"],
            },
            {
              hidden: !canViewChatHistory,
              btnText: t("settings.workspace-chats").replace("Workspace Chats", "工作区聊天"),
              href: paths.settings.chats(),
              flex: true,
              roles: ["admin", "manager"],
            },
            {
              btnText: t("settings.invites").replace("Invites", "邀请"),
              href: paths.settings.invites(),
              roles: ["admin", "manager"],
            },
          ]}
        />
        <Option
          btnText={t("settings.agent-skills").replace("Agent Skills", "抑郁症专家智能助手技能")}
          icon={<Robot className="h-5 w-5 flex-shrink-0" />}
          href={paths.settings.agentSkills()}
          user={user}
          flex={true}
          roles={["admin"]}
        />
        <Option
          btnText={t("settings.customization").replace("Customization", "自定义")}
          icon={<PencilSimpleLine className="h-5 w-5 flex-shrink-0" />}
          user={user}
          childOptions={[
            {
              btnText: t("settings.interface").replace("Interface", "界面"),
              href: paths.settings.interface(),
              flex: true,
              roles: ["admin", "manager"],
            },
            {
              btnText: t("settings.chat").replace("Chat", "聊天"),
              href: paths.settings.chat(),
              flex: true,
              roles: ["admin", "manager"],
            },
          ]}
        />
        <Option
          btnText={t("settings.tools").replace("Tools", "工具")}
          icon={<Toolbox className="h-5 w-5 flex-shrink-0" />}
          user={user}
          childOptions={[
            {
              btnText: t("settings.event-logs").replace("Event Logs", "事件日志"),
              href: paths.settings.logs(),
              flex: true,
              roles: ["admin"],
            },
            {
              btnText: t("settings.system-prompt-variables").replace("System Prompt Variables", "系统提示变量"),
              href: paths.settings.systemPromptVariables(),
              flex: true,
              roles: ["admin"],
            },
          ]}
        />
      </>
    )}
  </CanViewChatHistoryProvider>
);
