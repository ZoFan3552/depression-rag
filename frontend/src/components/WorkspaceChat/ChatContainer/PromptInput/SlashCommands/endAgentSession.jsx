import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function EndAgentSession({ setShowing, sendCommand }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  // 如果没有活跃的代理会话，则不显示此按钮
  if (!isActiveAgentSession) return null;

  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand("/exit", true);
      }}
      className="border-none w-full hover:cursor-pointer hover:bg-theme-action-menu-item-hover px-2 py-2 rounded-xl flex flex-col justify-start transition-colors duration-200 hover:shadow-md"
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold">/exit</div>
        <div className="text-white text-opacity-60 text-sm">
          终止当前代理会话
        </div>
      </div>
    </button>
  );
}
