import System from "@/models/system";
import showToast from "@/utils/toast";
import React, { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import { useTranslation } from "react-i18next";

export default function UserSetup({ setHeader, setForwardBtn, setBackBtn }) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("");
  const [singleUserPasswordValid, setSingleUserPasswordValid] = useState(false);
  const [multiUserLoginValid, setMultiUserLoginValid] = useState(false);
  const [enablePassword, setEnablePassword] = useState(false);
  const myTeamSubmitRef = useRef(null);
  const justMeSubmitRef = useRef(null);
  const navigate = useNavigate();

  const TITLE = t("onboarding.userSetup.title");
  const DESCRIPTION = t("onboarding.userSetup.description");

  // 处理前进按钮点击
  function handleForward() {
    if (selectedOption === "just_me" && enablePassword) {
      justMeSubmitRef.current?.click();
    } else if (selectedOption === "just_me" && !enablePassword) {
      navigate(paths.onboarding.dataHandling());
    } else if (selectedOption === "my_team") {
      myTeamSubmitRef.current?.click();
    }
  }

  // 处理返回按钮点击
  function handleBack() {
    navigate(paths.onboarding.llmPreference());
  }

  // 根据选项状态控制前进按钮
  useEffect(() => {
    let isDisabled = true;
    if (selectedOption === "just_me") {
      isDisabled = !singleUserPasswordValid;
    } else if (selectedOption === "my_team") {
      isDisabled = !multiUserLoginValid;
    }

    setForwardBtn({
      showing: true,
      disabled: isDisabled,
      onClick: handleForward,
    });
  }, [selectedOption, singleUserPasswordValid, multiUserLoginValid]);

  // 设置页面标题和返回按钮
  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="flex flex-col border rounded-lg border-white/20 light:border-theme-sidebar-border p-8 items-center gap-y-4 w-full max-w-[600px] shadow-md">
        <div className="text-white text-sm font-semibold md:-ml-44">
          {t("onboarding.userSetup.howManyUsers")}
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <button
            onClick={() => setSelectedOption("just_me")}
            className={`${
              selectedOption === "just_me"
                ? "text-sky-400 border-sky-400/70"
                : "text-theme-text-primary border-theme-sidebar-border"
            } min-w-[230px] h-11 p-4 rounded-[10px] border-2 justify-center items-center gap-[100px] inline-flex hover:border-sky-400/70 hover:text-sky-400 transition-all duration-300 hover:shadow-md`}
          >
            <div className="text-center text-sm font-bold">
              {t("onboarding.userSetup.justMe")}
            </div>
          </button>
          <button
            onClick={() => setSelectedOption("my_team")}
            className={`${
              selectedOption === "my_team"
                ? "text-sky-400 border-sky-400/70"
                : "text-theme-text-primary border-theme-sidebar-border"
            } min-w-[230px] h-11 p-4 rounded-[10px] border-2 justify-center items-center gap-[100px] inline-flex hover:border-sky-400/70 hover:text-sky-400 transition-all duration-300 hover:shadow-md`}
          >
            <div className="text-center text-sm font-bold">
              {t("onboarding.userSetup.myTeam")}
            </div>
          </button>
        </div>
      </div>
      {selectedOption === "just_me" && (
        <JustMe
          setSingleUserPasswordValid={setSingleUserPasswordValid}
          enablePassword={enablePassword}
          setEnablePassword={setEnablePassword}
          justMeSubmitRef={justMeSubmitRef}
          navigate={navigate}
        />
      )}
      {selectedOption === "my_team" && (
        <MyTeam
          setMultiUserLoginValid={setMultiUserLoginValid}
          myTeamSubmitRef={myTeamSubmitRef}
          navigate={navigate}
        />
      )}
    </div>
  );
}

const JustMe = ({
  setSingleUserPasswordValid,
  enablePassword,
  setEnablePassword,
  justMeSubmitRef,
  navigate,
}) => {
  const { t } = useTranslation();
  const [itemSelected, setItemSelected] = useState(false);
  const [password, setPassword] = useState("");
  
  // 处理密码表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { error } = await System.updateSystemPassword({
      usePassword: true,
      newPassword: formData.get("password"),
    });

    if (error) {
      showToast(`设置密码失败: ${error}`, "error");
      return;
    }

    // 自动请求令牌，设置密码后不会重定向到登录页面
    const { token } = await System.requestToken({
      password: formData.get("password"),
    });
    window.localStorage.removeItem(AUTH_USER);
    window.localStorage.removeItem(AUTH_TIMESTAMP);
    window.localStorage.setItem(AUTH_TOKEN, token);

    navigate(paths.onboarding.dataHandling());
  };

  const setNewPassword = (e) => setPassword(e.target.value);
  const handlePasswordChange = debounce(setNewPassword, 500);

  function handleYes() {
    setItemSelected(true);
    setEnablePassword(true);
  }

  function handleNo() {
    setItemSelected(true);
    setEnablePassword(false);
  }

  // 检验密码有效性
  useEffect(() => {
    if (enablePassword && itemSelected && password.length >= 8) {
      setSingleUserPasswordValid(true);
    } else if (!enablePassword && itemSelected) {
      setSingleUserPasswordValid(true);
    } else {
      setSingleUserPasswordValid(false);
    }
  });
  
  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="flex flex-col border rounded-lg border-white/20 light:border-theme-sidebar-border p-8 items-center gap-y-4 w-full max-w-[600px] shadow-md">
        <div className="text-white text-sm font-semibold md:-ml-56">
          {t("onboarding.userSetup.setPassword")}
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <button
            onClick={handleYes}
            className={`${
              enablePassword && itemSelected
                ? "text-sky-400 border-sky-400/70"
                : "text-theme-text-primary border-theme-sidebar-border"
            } min-w-[230px] h-11 p-4 rounded-[10px] border-2 justify-center items-center gap-[100px] inline-flex hover:border-sky-400/70 hover:text-sky-400 transition-all duration-300 hover:shadow-md`}
          >
            <div className="text-center text-sm font-bold">
              {t("common.yes")}
            </div>
          </button>
          <button
            onClick={handleNo}
            className={`${
              !enablePassword && itemSelected
                ? "text-sky-400 border-sky-400/70"
                : "text-theme-text-primary border-theme-sidebar-border"
            } min-w-[230px] h-11 p-4 rounded-[10px] border-2 justify-center items-center gap-[100px] inline-flex hover:border-sky-400/70 hover:text-sky-400 transition-all duration-300 hover:shadow-md`}
          >
            <div className="text-center text-sm font-bold">
              {t("common.no")}
            </div>
          </button>
        </div>
        {enablePassword && (
          <form className="w-full mt-4" onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              className="block mb-3 text-sm font-medium text-white"
            >
              {t("onboarding.userSetup.instancePassword")}
            </label>
            <input
              name="password"
              type="password"
              className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg block w-full p-2.5 focus:outline-primary-button active:outline-primary-button outline-none placeholder:text-theme-text-secondary focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
              placeholder="您的管理员密码"
              minLength={6}
              required={true}
              autoComplete="off"
              onChange={handlePasswordChange}
            />
            <div className="mt-4 text-white text-opacity-80 text-xs font-base -mb-2">
              {t("onboarding.userSetup.passwordReq")}
              <br />
              <i>{t("onboarding.userSetup.passwordWarn")}</i>{" "}
            </div>
            <button
              type="submit"
              ref={justMeSubmitRef}
              hidden
              aria-hidden="true"
            ></button>
          </form>
        )}
      </div>
    </div>
  );
};

const MyTeam = ({ setMultiUserLoginValid, myTeamSubmitRef, navigate }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 处理团队设置表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };
    const { success, error } = await System.setupMultiUser(data);
    if (!success) {
      showToast(`错误: ${error}`, "error");
      return;
    }

    navigate(paths.onboarding.dataHandling());
    // 自动请求令牌，设置凭据后不会重定向到登录页面
    const { user, token } = await System.requestToken(data);
    window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
    window.localStorage.setItem(AUTH_TOKEN, token);
    window.localStorage.removeItem(AUTH_TIMESTAMP);
  };

  const setNewUsername = (e) => setUsername(e.target.value);
  const setNewPassword = (e) => setPassword(e.target.value);
  const handleUsernameChange = debounce(setNewUsername, 500);
  const handlePasswordChange = debounce(setNewPassword, 500);

  // 验证用户名和密码
  useEffect(() => {
    if (username.length >= 6 && password.length >= 8) {
      setMultiUserLoginValid(true);
    } else {
      setMultiUserLoginValid(false);
    }
  }, [username, password]);
  
  return (
    <div className="w-full flex items-center justify-center border max-w-[600px] rounded-lg border-white/20 light:border-theme-sidebar-border shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full md:px-8 px-2 py-4">
          <div className="space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-3 text-sm font-medium text-white"
                >
                  {t("common.adminUsername")}
                </label>
                <input
                  name="username"
                  type="text"
                  className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg block w-full p-2.5 focus:outline-primary-button active:outline-primary-button placeholder:text-theme-text-secondary outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  placeholder="您的管理员用户名"
                  minLength={6}
                  required={true}
                  autoComplete="off"
                  onChange={handleUsernameChange}
                />
              </div>
              <p className="text-white text-opacity-80 text-xs font-base">
                {t("onboarding.userSetup.adminUsernameReq")}
              </p>
              <div className="mt-4">
                <label
                  htmlFor="name"
                  className="block mb-3 text-sm font-medium text-white"
                >
                  {t("onboarding.userSetup.adminPassword")}
                </label>
                <input
                  name="password"
                  type="password"
                  className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg block w-full p-2.5 focus:outline-primary-button active:outline-primary-button placeholder:text-theme-text-secondary outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  placeholder="您的管理员密码"
                  minLength={8}
                  required={true}
                  autoComplete="off"
                  onChange={handlePasswordChange}
                />
              </div>
              <p className="text-white text-opacity-80 text-xs font-base">
                {t("onboarding.userSetup.adminPasswordReq")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between items-center px-6 py-4 space-x-6 border-t rounded-b border-theme-sidebar-border">
          <div className="text-theme-text-secondary text-opacity-80 text-xs font-base">
            {t("onboarding.userSetup.teamHint")}
          </div>
        </div>
        <button
          type="submit"
          ref={myTeamSubmitRef}
          hidden
          aria-hidden="true"
        ></button>
      </form>
    </div>
  );
};
