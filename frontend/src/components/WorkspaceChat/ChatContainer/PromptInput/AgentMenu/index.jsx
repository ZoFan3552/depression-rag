import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { At } from "@phosphor-icons/react";
import { useIsAgentSessionActive } from "@/utils/chat/agent";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function AvailableAgentsButton({ showing, setShowAgents }) {
  const { t } = useTranslation();
  const agentSessionActive = useIsAgentSessionActive();
  // 如果代理会话处于活动状态，则不显示按钮
  if (agentSessionActive) return null;
  return (
    <div
      id="agent-list-btn"
      data-tooltip-id="tooltip-agent-list-btn"
      data-tooltip-content={t("chat_window.agents") || "智能助手"}
      aria-label={t("chat_window.agents") || "智能助手"}
      onClick={() => setShowAgents(!showing)}
      className={`flex justify-center items-center cursor-pointer transition-opacity duration-200 rounded-full p-1.5 hover:bg-theme-bg-hover ${
        showing ? "!opacity-100 bg-theme-bg-active" : ""
      }`}
    >
      <At
        color="var(--theme-sidebar-footer-icon-fill)"
        className={`w-[22px] h-[22px] pointer-events-none text-theme-text-primary opacity-60 hover:opacity-100 light:opacity-100 light:hover:opacity-60`}
      />
      <Tooltip
        id="tooltip-agent-list-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}

// 能力标签组件，显示代理的能力
function AbilityTag({ text }) {
  return (
    <div className="px-2 bg-theme-action-menu-item-hover text-theme-text-secondary text-xs w-fit rounded-sm hover:bg-opacity-80 transition-colors duration-200">
      <p>{text}</p>
    </div>
  );
}

export function AvailableAgents({
  showing,
  setShowing,
  sendCommand,
  promptRef,
}) {
  const formRef = useRef(null);
  const agentSessionActive = useIsAgentSessionActive();
  const [searchParams] = useSearchParams();

  /*
   * @检查项
   * 如果URL有agent参数，当组件挂载时自动为用户打开代理菜单
   */
  useEffect(() => {
    if (searchParams.get("action") === "set-agent-chat" && !showing)
      handleAgentClick();
  }, [promptRef.current]);

  useEffect(() => {
    function listenForOutsideClick() {
      if (!showing || !formRef.current) return false;
      document.addEventListener("click", closeIfOutside);
    }
    listenForOutsideClick();
  }, [showing, formRef.current]);

  // 如果点击在菜单外部，则关闭菜单
  const closeIfOutside = ({ target }) => {
    if (target.id === "agent-list-btn") return;
    const isOutside = !formRef?.current?.contains(target);
    if (!isOutside) return;
    setShowing(false);
  };

  // 处理代理点击事件
  const handleAgentClick = () => {
    setShowing(false);
    sendCommand("@agent ", false);
    promptRef?.current?.focus();
  };

  if (agentSessionActive) return null;
  return (
    <>
      <div hidden={!showing}>
        <div className="w-full flex justify-center absolute bottom-[130px] md:bottom-[150px] left-0 z-10 px-4">
          <div
            ref={formRef}
            className="w-[600px] p-2 bg-theme-action-menu-bg rounded-2xl shadow-lg flex-col justify-center items-start gap-2.5 inline-flex transition-all duration-300 hover:shadow-xl"
          >
            <button
              onClick={handleAgentClick}
              className="border-none w-full hover:cursor-pointer hover:bg-theme-action-menu-item-hover px-2 py-2 rounded-xl flex flex-col justify-start group transition-colors duration-200"
            >
              <div className="w-full flex-col text-left flex pointer-events-none">
                <div className="text-theme-text-primary text-sm">
                  <b>@agent</b> - 此工作区的默认智能助手
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <AbilityTag text="知识检索" />
                  <AbilityTag text="网页抓取" />
                  <AbilityTag text="网络搜索" />
                  <AbilityTag text="列出文档" />
                  <AbilityTag text="文档摘要" />
                  <AbilityTag text="图表生成" />
                </div>
              </div>
            </button>
            <button
              type="button"
              disabled={true}
              className="w-full rounded-xl flex flex-col justify-start group"
            >
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// 自定义Hook，用于管理代理菜单的显示状态
export function useAvailableAgents() {
  const [showAgents, setShowAgents] = useState(false);
  return { showAgents, setShowAgents };
}
