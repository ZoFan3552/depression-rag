import { useEffect, useCallback } from "react";
import { Microphone } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import _regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { PROMPT_INPUT_EVENT } from "../../PromptInput";
import { useTranslation } from "react-i18next";
import Appearance from "@/models/appearance";

let timeout;
const SILENCE_INTERVAL = 3_200; // 沉默几秒后关闭的等待时间

/**
 * 聊天窗口的语音转文字输入组件
 * @param {Object} props - 组件属性
 * @param {(textToAppend: string, autoSubmit: boolean) => void} props.sendCommand - 发送指令的函数
 * @returns {React.ReactElement} SpeechToText组件
 */
export default function SpeechToText({ sendCommand }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
    isMicrophoneAvailable,
  } = useSpeechRecognition({
    clearTranscriptOnListen: true,
  });
  const { t } = useTranslation();
  function startSTTSession() {
    if (!isMicrophoneAvailable) {
      alert(
        "抑郁症专家知识库系统无法访问麦克风。请为此网站启用麦克风权限以使用此功能。"
      );
      return;
    }

    resetTranscript();
    SpeechRecognition.startListening({
      continuous: browserSupportsContinuousListening,
      language: window?.navigator?.language ?? "zh-CN",
    });
  }

  function endSTTSession() {
    SpeechRecognition.stopListening();
    if (transcript.length > 0) {
      sendCommand(transcript, Appearance.get("autoSubmitSttInput"));
    }

    resetTranscript();
    clearTimeout(timeout);
  }

  const handleKeyPress = useCallback(
    (event) => {
      // Mac和Windows上的CTRL + m切换STT监听
      if (event.ctrlKey && event.keyCode === 77) {
        if (listening) {
          endSTTSession();
        } else {
          startSTTSession();
        }
      }
    },
    [listening, endSTTSession, startSTTSession]
  );

  function handlePromptUpdate(e) {
    if (!e?.detail && timeout) {
      endSTTSession();
      clearTimeout(timeout);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (!!window)
      window.addEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
    return () =>
      window?.removeEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
  }, []);

  useEffect(() => {
    if (transcript?.length > 0 && listening) {
      sendCommand(transcript, false);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        endSTTSession();
      }, SILENCE_INTERVAL);
    }
  }, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) return null;
  return (
    <div
      id="text-size-btn"
      data-tooltip-id="tooltip-text-size-btn"
      data-tooltip-content={`${t("chat_window.microphone") || "麦克风"} (CTRL + M)`}
      aria-label={t("chat_window.microphone") || "麦克风"}
      onClick={listening ? endSTTSession : startSTTSession}
      className={`border-none relative flex justify-center items-center opacity-60 hover:opacity-100 light:opacity-100 light:hover:opacity-60 cursor-pointer transition-opacity duration-200 rounded-full p-1.5 hover:bg-theme-bg-hover ${
        !!listening ? "!opacity-100 bg-theme-bg-active" : ""
      }`}
    >
      <Microphone
        weight="fill"
        color="var(--theme-sidebar-footer-icon-fill)"
        className={`w-[22px] h-[22px] pointer-events-none text-theme-text-primary ${
          listening ? "animate-pulse-glow" : ""
        }`}
      />
      <Tooltip
        id="tooltip-text-size-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}
