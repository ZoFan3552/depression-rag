import { useEffect, useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function useProviderEndpointAutoDiscovery({
  provider = null,
  initialBasePath = "",
  initialAuthToken = null,
  ENDPOINTS = [],
}) {
  // 状态管理hooks
  const [loading, setLoading] = useState(false);
  const [basePath, setBasePath] = useState(initialBasePath);
  const [basePathValue, setBasePathValue] = useState(initialBasePath);

  const [authToken, setAuthToken] = useState(initialAuthToken);
  const [authTokenValue, setAuthTokenValue] = useState(initialAuthToken);
  const [autoDetectAttempted, setAutoDetectAttempted] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(true);

  // 自动检测端点的函数
  async function autoDetect(isInitialAttempt = false) {
    setLoading(true);
    setAutoDetectAttempted(true);
    const possibleEndpoints = [];
    ENDPOINTS.forEach((endpoint) => {
      possibleEndpoints.push(
        new Promise((resolve, reject) => {
          System.customModels(provider, authTokenValue, endpoint, 2_000)
            .then((results) => {
              if (!results?.models || results.models.length === 0)
                throw new Error("没有找到模型");
              resolve({ endpoint, models: results.models });
            })
            .catch(() => {
              reject(`${provider} @ ${endpoint} 无法解析。`);
            });
        })
      );
    });

    const { endpoint, models } = await Promise.any(possibleEndpoints)
      .then((resolved) => resolved)
      .catch(() => {
        console.error("所有端点均无法解析。");
        return { endpoint: null, models: null };
      });

    if (models !== null) {
      setBasePath(endpoint);
      setBasePathValue(endpoint);
      setLoading(false);
      showToast("提供商端点已自动发现。", "success", {
        clear: true,
      });
      setShowAdvancedControls(false);
      return;
    }

    setLoading(false);
    setShowAdvancedControls(true);
    showToast(
      "暂未检测到该提供商的 URL，请自行输入",
      "info",
      { clear: true }
    );
  }

  // 处理自动检测按钮点击事件
  function handleAutoDetectClick(e) {
    e.preventDefault();
    autoDetect();
  }

  // 处理基础路径变更
  function handleBasePathChange(e) {
    const value = e.target.value;
    setBasePathValue(value);
  }

  // 处理基础路径失焦事件
  function handleBasePathBlur() {
    setBasePath(basePathValue);
  }

  // 处理认证令牌变更
  function handleAuthTokenChange(e) {
    const value = e.target.value;
    setAuthTokenValue(value);
  }

  // 处理认证令牌失焦事件
  function handleAuthTokenBlur() {
    setAuthToken(authTokenValue);
  }

  // 初始化时执行自动检测
  useEffect(() => {
    if (!initialBasePath && !autoDetectAttempted) autoDetect(true);
  }, [initialBasePath, initialAuthToken, autoDetectAttempted]);

  // 返回钩子状态和方法
  return {
    autoDetecting: loading,
    autoDetectAttempted,
    showAdvancedControls,
    setShowAdvancedControls,
    basePath: {
      value: basePath,
      set: setBasePathValue,
      onChange: handleBasePathChange,
      onBlur: handleBasePathBlur,
    },
    basePathValue: {
      value: basePathValue,
      set: setBasePathValue,
    },
    authToken: {
      value: authToken,
      set: setAuthTokenValue,
      onChange: handleAuthTokenChange,
      onBlur: handleAuthTokenBlur,
    },
    authTokenValue: {
      value: authTokenValue,
      set: setAuthTokenValue,
    },
    handleAutoDetectClick,
    runAutoDetect: autoDetect,
  };
}
