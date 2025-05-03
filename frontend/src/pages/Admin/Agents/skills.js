import AgentWebSearchSelection from "./WebSearchSelection";
import GenericSkillPanel from "./GenericSkillPanel";
import DefaultSkillPanel from "./DefaultSkillPanel";
import {
  Brain,
  File,
  Browser,
  ChartBar,
  FileMagnifyingGlass,
} from "@phosphor-icons/react";
import RAGImage from "@/media/agents/rag-memory.png";
import SummarizeImage from "@/media/agents/view-summarize.png";
import ScrapeWebsitesImage from "@/media/agents/scrape-websites.png";
import GenerateChartsImage from "@/media/agents/generate-charts.png";

/**
 * 默认技能配置
 * 这些技能是系统内置的基础能力
 */
export const defaultSkills = {
  "rag-memory": {
    title: "抑郁症知识检索与长期记忆",
    description:
      "允许抑郁症专家利用本地文档回答查询，或要求专家“记住”内容片段以便进行长期记忆检索。",
    component: DefaultSkillPanel,
    icon: Brain,
    image: RAGImage,
    skill: "rag-memory",
  },
  "document-summarizer": {
    title: "查看与总结文档",
    description:
      "允许抑郁症专家列出并总结当前嵌入的工作区文件内容，提取关键的抑郁症治疗信息。",
    component: DefaultSkillPanel,
    icon: File,
    image: SummarizeImage,
    skill: "document-summarizer",
  },
  "web-scraping": {
    title: "网站内容抓取",
    description: "允许抑郁症专家访问并抓取网站内容，获取最新的心理健康研究资料。",
    component: DefaultSkillPanel,
    icon: Browser,
    image: ScrapeWebsitesImage,
    skill: "web-scraping",
  },
};

/**
 * 可配置技能
 * 这些技能需要额外配置才能启用
 */
export const configurableSkills = {
  "create-chart": {
    title: "生成数据图表",
    description:
      "使抑郁症专家能够从提供的数据或聊天中给出的信息生成各种类型的图表，直观展示抑郁症相关统计数据。",
    component: GenericSkillPanel,
    skill: "create-chart",
    icon: ChartBar,
    image: GenerateChartsImage,
  },
  "web-browsing": {
    title: "网络搜索",
    description:
      "允许抑郁症专家在网络上搜索最新的心理健康信息，提供循证治疗建议。",
    component: AgentWebSearchSelection,
    skill: "web-browsing",
    icon: FileMagnifyingGlass,
    image: ScrapeWebsitesImage,
  },
};
