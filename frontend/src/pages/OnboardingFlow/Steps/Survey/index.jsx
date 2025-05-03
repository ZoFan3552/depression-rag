import {
  COMPLETE_QUESTIONNAIRE,
  ONBOARDING_SURVEY_URL,
} from "@/utils/constants";
import paths from "@/utils/paths";
import { CheckCircle } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * 发送问卷调查数据到服务器
 * @param {Object} param0 问卷数据
 * @param {string} param0.email 用户邮箱
 * @param {string} param0.useCase 使用场景
 * @param {string} param0.comment 用户反馈
 */
async function sendQuestionnaire({ email, useCase, comment }) {
  if (import.meta.env.DEV) {
    console.log("发送问卷数据", { email, useCase, comment });
    return;
  }

  const data = JSON.stringify({
    email,
    useCase,
    comment,
    sourceId: "0VRjqHh6Vukqi0x0Vd0n/m8JuT7k8nOz",
  });

  if (!navigator.sendBeacon) {
    console.log("浏览器不支持sendBeacon API，将使用fetch发送数据");
    return fetch(ONBOARDING_SURVEY_URL, {
      method: "POST",
      body: data,
    })
      .then(() => {
        window.localStorage.setItem(COMPLETE_QUESTIONNAIRE, true);
        console.log(`✅ 问卷回答已发送。`);
      })
      .catch((error) => {
        console.error(`发送问卷失败`, error.message);
      });
  }

  navigator.sendBeacon(ONBOARDING_SURVEY_URL, data);
  window.localStorage.setItem(COMPLETE_QUESTIONNAIRE, true);
  console.log(`✅ 问卷回答已成功发送。`);
}

export default function Survey({ setHeader, setForwardBtn, setBackBtn }) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const submitRef = useRef(null);

  const TITLE = t("onboarding.survey.title");
  const DESCRIPTION = t("onboarding.survey.description");

  // 处理前进按钮点击
  function handleForward() {
    if (!!window?.localStorage?.getItem(COMPLETE_QUESTIONNAIRE)) {
      navigate(paths.onboarding.createWorkspace());
      return;
    }

    if (!formRef.current) {
      skipSurvey();
      return;
    }

    // 检查表单是否有填写内容，如果有则触发表单提交
    const formData = new FormData(formRef.current);
    if (
      !!formData.get("email") ||
      !!formData.get("use_case") ||
      !!formData.get("comment")
    ) {
      formRef.current.requestSubmit();
      return;
    }

    skipSurvey();
  }

  // 跳过问卷调查
  function skipSurvey() {
    navigate(paths.onboarding.createWorkspace());
  }

  // 处理返回按钮点击
  function handleBack() {
    navigate(paths.onboarding.dataHandling());
  }

  // 设置页面标题和按钮
  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    await sendQuestionnaire({
      email: formData.get("email"),
      useCase: formData.get("use_case") || "other",
      comment: formData.get("comment") || null,
    });

    navigate(paths.onboarding.createWorkspace());
  };

  // 如果已完成问卷，显示感谢页面
  if (!!window?.localStorage?.getItem(COMPLETE_QUESTIONNAIRE)) {
    return (
      <div className="w-full flex justify-center items-center py-40">
        <div className="w-full flex items-center justify-center px-1 md:px-8 py-4">
          <div className="w-auto flex flex-col gap-y-1 items-center">
            <CheckCircle size={60} className="text-green-500" />
            <p className="text-white text-lg">
              {t("onboarding.survey.thankYou")}
            </p>
            <a
              href={paths.mailToMintplex()}
              className="text-sky-400 underline text-xs hover:text-sky-300 transition-colors"
            >
              zjf103552@outlook.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSubmit} ref={formRef} className="max-w-[500px]">
        <div className="md:min-w-[400px]">
          <label
            htmlFor="email"
            className="text-theme-text-primary text-base font-medium"
          >
            {t("onboarding.survey.email")}{" "}
          </label>
          <input
            name="email"
            type="email"
            placeholder="您的邮箱地址"
            required={true}
            className="mt-2 bg-theme-settings-input-bg text-white focus:outline-primary-button active:outline-primary-button placeholder:text-theme-settings-input-placeholder outline-none text-sm font-medium font-['Plus Jakarta Sans'] leading-tight w-full h-11 p-2.5 bg-theme-settings-input-bg rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
          />
        </div>

        <div className="mt-8">
          <label
            className="text-theme-text-primary text-base font-medium"
            htmlFor="use_case"
          >
            {t("onboarding.survey.useCase")}{" "}
          </label>
          <div className="mt-2 gap-y-3 flex flex-col">
            <label
              className={`border-solid transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border ${
                selectedOption === "job"
                  ? "border-theme-sidebar-item-workspace-active bg-theme-bg-secondary"
                  : "border-theme-sidebar-border"
              } hover:border-theme-sidebar-border hover:bg-theme-bg-secondary`}
            >
              <input
                type="radio"
                name="use_case"
                value={"job"}
                checked={selectedOption === "job"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-theme-sidebar-border mr-2 ${
                  selectedOption === "job"
                    ? "bg-[var(--theme-sidebar-item-workspace-active)]"
                    : ""
                }`}
              ></div>
              <div className="text-theme-text-primary text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                {t("onboarding.survey.useCaseWork")}
              </div>
            </label>
            <label
              className={`border-solid transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border-[1px] ${
                selectedOption === "personal"
                  ? "border-theme-sidebar-item-workspace-active bg-theme-bg-secondary"
                  : "border-theme-sidebar-border"
              } hover:border-theme-sidebar-border hover:bg-theme-bg-secondary`}
            >
              <input
                type="radio"
                name="use_case"
                value={"personal"}
                checked={selectedOption === "personal"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-theme-sidebar-border mr-2 ${
                  selectedOption === "personal"
                    ? "bg-[var(--theme-sidebar-item-workspace-active)]"
                    : ""
                }`}
              ></div>
              <div className="text-theme-text-primary text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                {t("onboarding.survey.useCasePersonal")}
              </div>
            </label>
            <label
              className={`border-solid transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border-[1px] ${
                selectedOption === "other"
                  ? "border-theme-sidebar-item-workspace-active bg-theme-bg-secondary"
                  : "border-theme-sidebar-border"
              } hover:border-theme-sidebar-border hover:bg-theme-bg-secondary`}
            >
              <input
                type="radio"
                name="use_case"
                value={"other"}
                checked={selectedOption === "other"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-theme-sidebar-border mr-2 ${
                  selectedOption === "other"
                    ? "bg-[var(--theme-sidebar-item-workspace-active)]"
                    : ""
                }`}
              ></div>
              <div className="text-theme-text-primary text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                {t("onboarding.survey.useCaseOther")}
              </div>
            </label>
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="comment" className="text-white text-base font-medium">
            {t("onboarding.survey.comment")}{" "}
            <span className="text-neutral-400 text-base font-light">
              ({t("common.optional")})
            </span>
          </label>
          <textarea
            name="comment"
            rows={5}
            className="mt-2 bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button placeholder:text-theme-settings-input-placeholder outline-none block w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
            placeholder="请分享您的想法或建议，帮助我们改进抑郁症专家知识库系统..."
            wrap="soft"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          ref={submitRef}
          hidden
          aria-hidden="true"
        ></button>

        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            onClick={skipSurvey}
            className="text-white text-base font-medium text-opacity-30 hover:text-opacity-100 hover:text-teal mt-8 transition-all duration-300"
          >
            {t("onboarding.survey.skip")}
          </button>
        </div>
      </form>
    </div>
  );
}
