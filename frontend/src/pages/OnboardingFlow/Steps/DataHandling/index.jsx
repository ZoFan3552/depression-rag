import PreLoader from "@/components/Preloader";
import System from "@/models/system";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import GenericOpenAiLogo from "@/media/llmprovider/generic-openai.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import DeepSeekLogo from "@/media/llmprovider/deepseek.png";
import ChromaLogo from "@/media/vectordbs/chroma.png";
import LanceDbLogo from "@/media/vectordbs/lancedb.png";
import QDrantLogo from "@/media/vectordbs/qdrant.png";

import React, { useState, useEffect } from "react";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LLM_SELECTION_PRIVACY = {
  openai: {
    name: "OpenAI",
    description: [
      "您的聊天内容不会被用于训练",
      "您的提示和用于创建回复的文档文本对OpenAI可见",
    ],
    logo: OpenAiLogo,
  },
  ollama: {
    name: "Ollama",
    description: [
      "您的模型和聊天内容只能在运行Ollama模型的机器上访问",
    ],
    logo: OllamaLogo,
  },
  "generic-openai": {
    name: "通用OpenAI兼容服务",
    description: [
      "数据共享根据您的通用端点提供商适用的服务条款进行。",
    ],
    logo: GenericOpenAiLogo,
  },
  deepseek: {
    name: "DeepSeek",
    description: ["您的模型和聊天内容对DeepSeek可见"],
    logo: DeepSeekLogo,
  },
};

export const VECTOR_DB_PRIVACY = {
  chroma: {
    name: "Chroma",
    description: [
      "您的向量和文档文本存储在您的Chroma实例上",
      "访问您的实例由您管理",
    ],
    logo: ChromaLogo,
  },
  qdrant: {
    name: "Qdrant",
    description: [
      "您的向量和文档文本存储在您的Qdrant实例上（云端或自托管）",
    ],
    logo: QDrantLogo,
  },
  lancedb: {
    name: "LanceDB",
    description: [
      "您的向量和文档文本私密存储在此抑郁症专家知识库系统实例上",
    ],
    logo: LanceDbLogo,
  },
};

export const EMBEDDING_ENGINE_PRIVACY = {
  native: {
    name: "抑郁症专家知识库嵌入器",
    description: [
      "您的文档文本在此抑郁症专家知识库系统实例上私密嵌入",
    ],
    logo: AnythingLLMIcon,
  },
  openai: {
    name: "OpenAI",
    description: [
      "您的文档文本会发送到OpenAI服务器",
      "您的文档不会被用于训练",
    ],
    logo: OpenAiLogo,
  },
  ollama: {
    name: "Ollama",
    description: [
      "您的文档文本在运行Ollama的服务器上私密嵌入",
    ],
    logo: OllamaLogo,
  },
  "generic-openai": {
    name: "通用OpenAI兼容服务",
    description: [
      "数据共享根据您的通用端点提供商适用的服务条款进行。",
    ],
    logo: GenericOpenAiLogo,
  },
};

export const FALLBACKS = {
  LLM: (provider) => ({
    name: "未知",
    description: [
      `"${provider}" 在抑郁症专家知识库系统中没有定义已知的数据处理政策`,
    ],
    logo: AnythingLLMIcon,
  }),
  EMBEDDING: (provider) => ({
    name: "未知",
    description: [
      `"${provider}" 在抑郁症专家知识库系统中没有定义已知的数据处理政策`,
    ],
    logo: AnythingLLMIcon,
  }),
  VECTOR: (provider) => ({
    name: "未知",
    description: [
      `"${provider}" 在抑郁症专家知识库系统中没有定义已知的数据处理政策`,
    ],
    logo: AnythingLLMIcon,
  }),
};

export default function DataHandling({ setHeader, setForwardBtn, setBackBtn }) {
  const { t } = useTranslation();
  const [llmChoice, setLLMChoice] = useState("openai");
  const [loading, setLoading] = useState(true);
  const [vectorDb, setVectorDb] = useState("pinecone");
  const [embeddingEngine, setEmbeddingEngine] = useState("openai");
  const navigate = useNavigate();

  const TITLE = t("onboarding.data.title");
  const DESCRIPTION = t("onboarding.data.description");

  // 获取系统设置
  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: false, disabled: false, onClick: handleBack });
    async function fetchKeys() {
      const _settings = await System.keys();
      setLLMChoice(_settings?.LLMProvider || "openai");
      setVectorDb(_settings?.VectorDB || "lancedb");
      setEmbeddingEngine(_settings?.EmbeddingEngine || "openai");

      setLoading(false);
    }
    fetchKeys();
  }, []);

  function handleForward() {
    navigate(paths.onboarding.survey());
  }

  function handleBack() {
    navigate(paths.onboarding.userSetup());
  }

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-20">
        <PreLoader />
      </div>
    );

  const LLMSelection =
    LLM_SELECTION_PRIVACY?.[llmChoice] || FALLBACKS.LLM(llmChoice);
  const EmbeddingEngine =
    EMBEDDING_ENGINE_PRIVACY?.[embeddingEngine] ||
    FALLBACKS.EMBEDDING(embeddingEngine);
  const VectorDb = VECTOR_DB_PRIVACY?.[vectorDb] || FALLBACKS.VECTOR(vectorDb);

  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-y-2 border-b border-theme-sidebar-border pb-4 hover:bg-white/5 transition-colors duration-200 p-3 rounded-lg">
          <div className="text-theme-text-primary text-base font-bold">
            语言模型选择
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={LLMSelection.logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded shadow-sm"
            />
            <p className="text-theme-text-primary text-sm font-bold">
              {LLMSelection.name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {LLMSelection.description.map((desc, index) => (
              <li key={index} className="text-theme-text-primary text-sm">
                {desc}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-2 border-b border-theme-sidebar-border pb-4 hover:bg-white/5 transition-colors duration-200 p-3 rounded-lg">
          <div className="text-theme-text-primary text-base font-bold">
            嵌入偏好
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={EmbeddingEngine.logo}
              alt="嵌入引擎 Logo"
              className="w-8 h-8 rounded shadow-sm"
            />
            <p className="text-theme-text-primary text-sm font-bold">
              {EmbeddingEngine.name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {EmbeddingEngine.description.map((desc, index) => (
              <li key={index} className="text-theme-text-primary text-sm">
                {desc}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-y-2 pb-4 hover:bg-white/5 transition-colors duration-200 p-3 rounded-lg">
          <div className="text-theme-text-primary text-base font-bold">
            向量数据库
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={VectorDb.logo}
              alt="向量数据库 Logo"
              className="w-8 h-8 rounded shadow-sm"
            />
            <p className="text-theme-text-primary text-sm font-bold">
              {VectorDb.name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {VectorDb.description.map((desc, index) => (
              <li key={index} className="text-theme-text-primary text-sm">
                {desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-theme-text-secondary text-sm font-medium py-1">
        {t("onboarding.data.settingsHint")}
      </p>
    </div>
  );
}
