import { useEffect, useState, useRef } from "react";
import { chatPrompt } from "@/utils/chat";
import { useTranslation } from "react-i18next";
import SystemPromptVariable from "@/models/systemPromptVariable";
import Highlighter from "react-highlight-words";
import { Link, useSearchParams } from "react-router-dom";
import paths from "@/utils/paths";

export default function ChatPromptSettings({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  const [availableVariables, setAvailableVariables] = useState([]);
  const [prompt, setPrompt] = useState(chatPrompt(workspace));
  const [isEditing, setIsEditing] = useState(false);
  const promptRef = useRef(null);
  const [searchParams] = useSearchParams();

  // ... existing code ...

  useEffect(() => {
    async function setupVariableHighlighting() {
      const { variables } = await SystemPromptVariable.getAll();
      setAvailableVariables(variables);
    }
    setupVariableHighlighting();
  }, []);

  // ... existing code ...

  useEffect(() => {
    if (searchParams.get("action") === "focus-system-prompt")
      setIsEditing(true);
  }, [searchParams]);

  useEffect(() => {
    if (isEditing && promptRef.current) {
      promptRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("chat.prompt.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("chat.prompt.description")}
        </p>
        <p className="text-white text-opacity-60 text-xs font-medium mb-2">
          您可以插入{" "}
          <Link
            to={paths.settings.systemPromptVariables()}
            className="text-primary-button hover:underline"
          >
            提示变量
          </Link>{" "}
          例如：{" "}
          {availableVariables.slice(0, 3).map((v, i) => (
            <>
              <span
                key={v.key}
                className="bg-theme-settings-input-bg px-1.5 py-0.5 rounded font-mono text-xs"
              >
                {`{${v.key}}`}
              </span>
              {i < availableVariables.length - 1 && "、 "}
            </>
          ))}
          {availableVariables.length > 3 && (
            <Link
              to={paths.settings.systemPromptVariables()}
              className="text-primary-button hover:underline"
            >
              +还有{availableVariables.length - 3}个变量...
            </Link>
          )}
        </p>
      </div>

      <input type="hidden" name="openAiPrompt" defaultValue={prompt} />

      <div className="relative">
        <span
          className={`${!!prompt ? "hidden" : "block"} text-sm pointer-events-none absolute top-0 left-0 p-2.5 w-full h-full !text-theme-settings-input-placeholder opacity-60`}
        >
          根据以下对话、相关上下文和后续问题，回答用户当前提出的问题。根据上述信息按照用户的指示，仅返回您对问题的回答。
        </span>
        {isEditing ? (
          <textarea
            ref={promptRef}
            autoFocus={true}
            rows={5}
            onFocus={(e) => {
              const length = e.target.value.length;
              e.target.setSelectionRange(length, length);
            }}
            onBlur={(e) => {
              setIsEditing(false);
              setPrompt(e.target.value);
            }}
            onChange={(e) => {
              setPrompt(e.target.value);
              setHasChanges(true);
            }}
            onPaste={(e) => {
              setPrompt(e.target.value);
              setHasChanges(true);
            }}
            style={{
              resize: "vertical",
              overflowY: "scroll",
              minHeight: "150px",
            }}
            defaultValue={prompt}
            className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 mt-2 transition duration-200"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            style={{
              resize: "vertical",
              overflowY: "scroll",
              minHeight: "150px",
            }}
            className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 mt-2 cursor-pointer hover:bg-opacity-90 transition duration-200"
          >
            <Highlighter
              className="whitespace-pre-wrap"
              highlightClassName="bg-cta-button p-0.5 rounded-md"
              searchWords={availableVariables.map((v) => `{${v.key}}`)}
              autoEscape={true}
              caseSensitive={true}
              textToHighlight={prompt}
            />
          </div>
        )}
      </div>
    </div>
  );
}
