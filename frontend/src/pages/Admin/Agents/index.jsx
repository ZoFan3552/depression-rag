import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import {
  CaretLeft,
  CaretRight,
  Robot,
} from "@phosphor-icons/react";
import ContextualSaveBar from "@/components/ContextualSaveBar";
import { castToType } from "@/utils/types";
import { FullScreenLoader } from "@/components/Preloader";
import { defaultSkills, configurableSkills } from "./skills";
import { DefaultBadge } from "./Badges/default";
import ImportedSkillConfig from "./Imported/ImportedSkillConfig";
import { Tooltip } from "react-tooltip";
import FlowPanel from "./AgentFlows/FlowPanel";
import ServerPanel from "./MCPServers/ServerPanel";
import AgentFlows from "@/models/agentFlows";

export default function AdminAgents() {
  const formEl = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({});
  const [selectedSkill, setSelectedSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSkillModal, setShowSkillModal] = useState(false);

  const [agentSkills, setAgentSkills] = useState([]);
  const [importedSkills, setImportedSkills] = useState([]);
  const [disabledAgentSkills, setDisabledAgentSkills] = useState([]);

  const [agentFlows, setAgentFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [activeFlowIds, setActiveFlowIds] = useState([]);

  // MCP服务器懒加载，避免阻塞UI线程
  const [mcpServers, setMcpServers] = useState([]);
  const [selectedMcpServer, setSelectedMcpServer] = useState(null);

  // 如果用户尝试在有未保存的更改时离开页面，提醒用户
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      const _preferences = await Admin.systemPreferencesByFields([
        "disabled_agent_skills",
        "default_agent_skills",
        "imported_agent_skills",
        "active_agent_flows",
      ]);
      const { flows = [] } = await AgentFlows.listFlows();

      setSettings({ ..._settings, preferences: _preferences.settings } ?? {});
      setAgentSkills(_preferences.settings?.default_agent_skills ?? []);
      setDisabledAgentSkills(
        _preferences.settings?.disabled_agent_skills ?? []
      );
      setImportedSkills(_preferences.settings?.imported_agent_skills ?? []);
      setActiveFlowIds(_preferences.settings?.active_agent_flows ?? []);
      setAgentFlows(flows);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  // 切换默认技能状态
  const toggleDefaultSkill = (skillName) => {
    setDisabledAgentSkills((prev) => {
      const updatedSkills = prev.includes(skillName)
        ? prev.filter((name) => name !== skillName)
        : [...prev, skillName];
      setHasChanges(true);
      return updatedSkills;
    });
  };

  // 切换抑郁症专家智能助手技能状态
  const toggleAgentSkill = (skillName) => {
    setAgentSkills((prev) => {
      const updatedSkills = prev.includes(skillName)
        ? prev.filter((name) => name !== skillName)
        : [...prev, skillName];
      setHasChanges(true);
      return updatedSkills;
    });
  };

  // 切换流程状态
  const toggleFlow = (flowId) => {
    setActiveFlowIds((prev) => {
      const updatedFlows = prev.includes(flowId)
        ? prev.filter((id) => id !== flowId)
        : [...prev, flowId];
      return updatedFlows;
    });
  };

  // 切换MCP服务器状态
  const toggleMCP = (serverName) => {
    setMcpServers((prev) => {
      return prev.map((server) => {
        if (server.name !== serverName) return server;
        return { ...server, running: !server.running };
      });
    });
  };

  // 提交表单处理
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      workspace: {},
      system: {},
      env: {},
    };

    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) {
      if (key.startsWith("system::")) {
        const [_, label] = key.split("system::");
        data.system[label] = String(value);
        continue;
      }

      if (key.startsWith("env::")) {
        const [_, label] = key.split("env::");
        data.env[label] = String(value);
        continue;
      }
      data.workspace[key] = castToType(key, value);
    }

    const { success } = await Admin.updateSystemPreferences(data.system);
    await System.updateSystem(data.env);

    if (success) {
      const _settings = await System.keys();
      const _preferences = await Admin.systemPreferencesByFields([
        "disabled_agent_skills",
        "default_agent_skills",
        "imported_agent_skills",
      ]);
      setSettings({ ..._settings, preferences: _preferences.settings } ?? {});
      setAgentSkills(_preferences.settings?.default_agent_skills ?? []);
      setDisabledAgentSkills(
        _preferences.settings?.disabled_agent_skills ?? []
      );
      setImportedSkills(_preferences.settings?.imported_agent_skills ?? []);
      showToast(`代理偏好设置保存成功。`, "success", {
        clear: true,
      });
    } else {
      showToast(`代理偏好设置保存失败。`, "error", { clear: true });
    }

    setHasChanges(false);
  };

  let SelectedSkillComponent = null;
  if (selectedFlow) {
    SelectedSkillComponent = FlowPanel;
  } else if (selectedMcpServer) {
    SelectedSkillComponent = ServerPanel;
  } else if (selectedSkill?.imported) {
    SelectedSkillComponent = ImportedSkillConfig;
  } else if (configurableSkills[selectedSkill]) {
    SelectedSkillComponent = configurableSkills[selectedSkill]?.component;
  } else {
    SelectedSkillComponent = defaultSkills[selectedSkill]?.component;
  }

  // 更新点击处理程序以清除其他选择
  const handleDefaultSkillClick = (skill) => {
    setSelectedFlow(null);
    setSelectedMcpServer(null);
    setSelectedSkill(skill);
    if (isMobile) setShowSkillModal(true);
  };

  const handleSkillClick = (skill) => {
    setSelectedFlow(null);
    setSelectedMcpServer(null);
    setSelectedSkill(skill);
    if (isMobile) setShowSkillModal(true);
  };

  const handleFlowClick = (flow) => {
    setSelectedSkill(null);
    setSelectedMcpServer(null);
    setSelectedFlow(flow);
    if (isMobile) setShowSkillModal(true);
  };

  const handleMCPClick = (server) => {
    setSelectedSkill(null);
    setSelectedFlow(null);
    setSelectedMcpServer(server);
    if (isMobile) setShowSkillModal(true);
  };

  // 处理流程删除
  const handleFlowDelete = (flowId) => {
    setSelectedFlow(null);
    setActiveFlowIds((prev) => prev.filter((id) => id !== flowId));
    setAgentFlows((prev) => prev.filter((flow) => flow.uuid !== flowId));
  };

  // 处理MCP服务器删除
  const handleMCPServerDelete = (serverName) => {
    setSelectedMcpServer(null);
    setMcpServers((prev) =>
      prev.filter((server) => server.name !== serverName)
    );
  };

  if (loading) {
    return (
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[24px] w-full h-full flex justify-center items-center bg-theme-bg-secondary shadow-lg"
      >
        <FullScreenLoader />
      </div>
    );
  }

  if (isMobile) {
    return (
      <SkillLayout
        hasChanges={hasChanges}
        handleCancel={() => setHasChanges(false)}
        handleSubmit={handleSubmit}
      >
        <form
          onSubmit={handleSubmit}
          onChange={() => !selectedFlow && setHasChanges(true)}
          ref={formEl}
          className="flex flex-col w-full p-4 mt-10"
        >
          <input
            name="system::default_agent_skills"
            type="hidden"
            value={agentSkills.join(",")}
          />
          <input
            name="system::disabled_agent_skills"
            type="hidden"
            value={disabledAgentSkills.join(",")}
          />

          {/* 技能设置导航 */}
          <div
            hidden={showSkillModal}
            className="flex flex-col gap-y-[18px] overflow-y-scroll no-scroll"
          >
            <div className="text-theme-text-primary flex items-center gap-x-2">
              <Robot size={24} />
              <p className="text-lg font-medium">抑郁症专家智能助手技能</p>
            </div>
            {/* 默认技能 */}
            <SkillList
              skills={defaultSkills}
              selectedSkill={selectedSkill}
              handleClick={handleDefaultSkillClick}
              activeSkills={Object.keys(defaultSkills).filter(
                (skill) => !disabledAgentSkills.includes(skill)
              )}
            />
            {/* 可配置技能 */}
            <SkillList
              skills={configurableSkills}
              selectedSkill={selectedSkill}
              handleClick={handleDefaultSkillClick}
              activeSkills={agentSkills}
            />
          </div>

          {/* 选中的抑郁症专家智能助手技能模态框 */}
          {showSkillModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-sidebar z-30">
              <div className="flex flex-col h-full">
                <div className="flex items-center p-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSkillModal(false);
                      setSelectedSkill("");
                    }}
                    className="text-white/60 hover:text-white transition-colors duration-200"
                  >
                    <div className="flex items-center text-sky-400">
                      <CaretLeft size={24} />
                      <div>返回</div>
                    </div>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="bg-theme-bg-secondary text-white rounded-xl p-5 overflow-y-scroll no-scroll shadow-md">
                    {SelectedSkillComponent ? (
                      <>
                        {selectedMcpServer ? (
                          <ServerPanel
                            server={selectedMcpServer}
                            toggleServer={toggleMCP}
                            onDelete={handleMCPServerDelete}
                          />
                        ) : selectedFlow ? (
                          <FlowPanel
                            flow={selectedFlow}
                            toggleFlow={toggleFlow}
                            enabled={activeFlowIds.includes(selectedFlow.uuid)}
                            onDelete={handleFlowDelete}
                          />
                        ) : selectedSkill.imported ? (
                          <ImportedSkillConfig
                            key={selectedSkill.hubId}
                            selectedSkill={selectedSkill}
                            setImportedSkills={setImportedSkills}
                          />
                        ) : (
                          <>
                            {defaultSkills?.[selectedSkill] ? (
                              // 选中的是默认技能 - 显示默认技能面板
                              <SelectedSkillComponent
                                skill={defaultSkills[selectedSkill]?.skill}
                                settings={settings}
                                toggleSkill={toggleDefaultSkill}
                                enabled={
                                  !disabledAgentSkills.includes(
                                    defaultSkills[selectedSkill]?.skill
                                  )
                                }
                                setHasChanges={setHasChanges}
                                {...defaultSkills[selectedSkill]}
                              />
                            ) : (
                              // 选中的是可配置技能 - 显示可配置技能面板
                              <SelectedSkillComponent
                                skill={configurableSkills[selectedSkill]?.skill}
                                settings={settings}
                                toggleSkill={toggleAgentSkill}
                                enabled={agentSkills.includes(
                                  configurableSkills[selectedSkill]?.skill
                                )}
                                setHasChanges={setHasChanges}
                                {...configurableSkills[selectedSkill]}
                              />
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-theme-text-secondary">
                        <Robot size={40} className="mb-2" />
                        <p className="font-medium">
                          请选择一个抑郁症专家智能助手技能
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </SkillLayout>
    );
  }

  return (
    <SkillLayout
      hasChanges={hasChanges}
      handleCancel={() => setHasChanges(false)}
      handleSubmit={handleSubmit}
    >
      <form
        onSubmit={handleSubmit}
        onChange={() =>
          !selectedSkill?.imported && !selectedFlow && setHasChanges(true)
        }
        ref={formEl}
        className="flex-1 flex gap-x-8 p-6 mt-10"
      >
        <input
          name="system::default_agent_skills"
          type="hidden"
          value={agentSkills.join(",")}
        />
        <input
          name="system::disabled_agent_skills"
          type="hidden"
          value={disabledAgentSkills.join(",")}
        />
        <input
          type="hidden"
          name="system::active_agent_flows"
          id="active_agent_flows"
          value={activeFlowIds.join(",")}
        />

        {/* 技能设置导航 - 使此部分可滚动 */}
        <div className="flex flex-col min-w-[360px] h-[calc(100vh-90px)]">
          <div className="flex-none mb-5">
            <div className="text-theme-text-primary flex items-center gap-x-3">
              <Robot size={24} />
              <p className="text-xl font-medium">抑郁症专家智能助手技能</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-3 pb-4 custom-scrollbar">
            <div className="space-y-5">
              {/* 默认技能列表 */}
              <SkillList
                skills={defaultSkills}
                selectedSkill={selectedSkill}
                handleClick={handleSkillClick}
                activeSkills={Object.keys(defaultSkills).filter(
                  (skill) => !disabledAgentSkills.includes(skill)
                )}
              />
              {/* 可配置技能 */}
              <SkillList
                skills={configurableSkills}
                selectedSkill={selectedSkill}
                handleClick={handleSkillClick}
                activeSkills={agentSkills}
              />
            </div>
          </div>
        </div>

        {/* 选中的抑郁症专家智能助手技能设置面板 */}
        <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
          <div className="bg-theme-bg-secondary text-white rounded-xl flex-1 p-6 overflow-y-scroll custom-scrollbar shadow-lg transition-all duration-300">
            {SelectedSkillComponent ? (
              <>
                {selectedMcpServer ? (
                  <ServerPanel
                    server={selectedMcpServer}
                    toggleServer={toggleMCP}
                    onDelete={handleMCPServerDelete}
                  />
                ) : selectedFlow ? (
                  <FlowPanel
                    flow={selectedFlow}
                    toggleFlow={toggleFlow}
                    enabled={activeFlowIds.includes(selectedFlow.uuid)}
                    onDelete={handleFlowDelete}
                  />
                ) : selectedSkill.imported ? (
                  <ImportedSkillConfig
                    key={selectedSkill.hubId}
                    selectedSkill={selectedSkill}
                    setImportedSkills={setImportedSkills}
                  />
                ) : (
                  <>
                    {defaultSkills?.[selectedSkill] ? (
                      // 选中的是默认技能 - 显示默认技能面板
                      <SelectedSkillComponent
                        skill={defaultSkills[selectedSkill]?.skill}
                        settings={settings}
                        toggleSkill={toggleDefaultSkill}
                        enabled={
                          !disabledAgentSkills.includes(
                            defaultSkills[selectedSkill]?.skill
                          )
                        }
                        setHasChanges={setHasChanges}
                        {...defaultSkills[selectedSkill]}
                      />
                    ) : (
                      // 选中的是可配置技能 - 显示可配置技能面板
                      <SelectedSkillComponent
                        skill={configurableSkills[selectedSkill]?.skill}
                        settings={settings}
                        toggleSkill={toggleAgentSkill}
                        enabled={agentSkills.includes(
                          configurableSkills[selectedSkill]?.skill
                        )}
                        setHasChanges={setHasChanges}
                        {...configurableSkills[selectedSkill]}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-theme-text-secondary">
                <Robot size={48} className="mb-3" />
                <p className="font-medium text-lg">
                  请选择一个抑郁症专家智能助手技能
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </SkillLayout>
  );
}

function SkillLayout({ children, hasChanges, handleSubmit, handleCancel }) {
  return (
    <div
      id="workspace-agent-settings-container"
      className="w-screen h-screen overflow-hidden bg-theme-bg-container flex md:mt-0 mt-6"
    >
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[24px] w-full h-full flex"
      >
        {children}
        <ContextualSaveBar
          showing={hasChanges}
          onSave={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

function SkillList({
  isDefault = false,
  skills = [],
  selectedSkill = null,
  handleClick = null,
  activeSkills = [],
}) {
  if (skills.length === 0) return null;

  return (
    <>
      <div
        className={`bg-theme-bg-secondary text-white rounded-xl ${
          isMobile ? "w-full" : "min-w-[360px] w-fit"
        } shadow-md hover:shadow-lg transition-all duration-300`}
      >
        {Object.entries(skills).map(([skill, settings], index) => (
          <div
            key={skill}
            className={`py-3.5 px-5 flex items-center justify-between ${
              index === 0 ? "rounded-t-xl" : ""
            } ${
              index === Object.keys(skills).length - 1
                ? "rounded-b-xl"
                : "border-b border-white/10"
            } cursor-pointer transition-all duration-300 hover:bg-theme-bg-primary ${
              selectedSkill === skill
                ? "bg-white/10 light:bg-theme-bg-sidebar"
                : ""
            }`}
            onClick={() => handleClick?.(skill)}
          >
            <div className="text-sm font-medium">{settings.title}</div>
            <div className="flex items-center gap-x-2">
              {isDefault ? (
                <DefaultBadge title={skill} />
              ) : (
                <div className="text-sm text-theme-text-secondary font-medium">
                  {activeSkills.includes(skill) ? "开启" : "关闭"}
                </div>
              )}
              <CaretRight
                size={14}
                weight="bold"
                className="text-theme-text-secondary"
              />
            </div>
          </div>
        ))}
      </div>
      {/* 默认技能的工具提示 - 仅当技能列表传递isDefault时才渲染 */}
      {isDefault && (
        <Tooltip
          id="default-skill"
          place="bottom"
          delayShow={300}
          className="tooltip light:invert-0 !text-xs"
        />
      )}
    </>
  );
}
