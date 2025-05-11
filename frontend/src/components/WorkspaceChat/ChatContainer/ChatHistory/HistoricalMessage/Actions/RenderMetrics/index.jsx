import { numberWithCommas } from "@/utils/numbers";
import React, { useEffect, useState, useContext } from "react";
const MetricsContext = React.createContext();
const SHOW_METRICS_KEY = "anythingllm_show_chat_metrics";
const SHOW_METRICS_EVENT = "anythingllm_show_metrics_change";

/**
 * 格式化持续时间
 * @param {number} duration - 以毫秒为单位的持续时间
 * @returns {string}
 */
function formatDuration(duration) {
  try {
    return duration < 1
      ? `${(duration * 1000).toFixed(0)}毫秒`
      : `${duration.toFixed(3)}秒`;
  } catch {
    return "";
  }
}

/**
 * 将输出TPS格式化为字符串
 * @param {number} outputTps - 输出TPS
 * @returns {string}
 */
function formatTps(outputTps) {
  try {
    return outputTps < 1000
      ? outputTps.toFixed(2)
      : numberWithCommas(outputTps.toFixed(0));
  } catch {
    return "";
  }
}

/**
 * 从localStorage的`anythingllm_show_chat_metrics`键获取显示指标设置
 * @returns {boolean}
 */
function getAutoShowMetrics() {
  return window?.localStorage?.getItem(SHOW_METRICS_KEY) === "true";
}

/**
 * 在localStorage的`anythingllm_show_chat_metrics`键中切换显示指标设置
 * @returns {void}
 */
function toggleAutoShowMetrics() {
  const currentValue = getAutoShowMetrics() || false;
  window?.localStorage?.setItem(SHOW_METRICS_KEY, !currentValue);
  window.dispatchEvent(
    new CustomEvent(SHOW_METRICS_EVENT, {
      detail: { showMetricsAutomatically: !currentValue },
    })
  );
  return !currentValue;
}

/**
 * 指标上下文的提供者，根据用户的偏好控制每个聊天的指标可见性
 * @param {React.ReactNode} children
 * @returns {React.ReactNode}
 */
export function MetricsProvider({ children }) {
  const [showMetricsAutomatically, setShowMetricsAutomatically] =
    useState(getAutoShowMetrics());

  useEffect(() => {
    function handleShowingMetricsEvent(e) {
      if (!e?.detail?.hasOwnProperty("showMetricsAutomatically")) return;
      setShowMetricsAutomatically(e.detail.showMetricsAutomatically);
    }
    console.log("为指标可见性添加事件监听器");
    window.addEventListener(SHOW_METRICS_EVENT, handleShowingMetricsEvent);
    return () =>
      window.removeEventListener(SHOW_METRICS_EVENT, handleShowingMetricsEvent);
  }, []);

  return (
    <MetricsContext.Provider
      value={{ showMetricsAutomatically, setShowMetricsAutomatically }}
    >
      {children}
    </MetricsContext.Provider>
  );
}

/**
 * 渲染给定聊天的指标（如果可用）
 * @param {metrics: {duration:number, outputTps: number}} props
 * @returns
 */
export default function RenderMetrics({ metrics = {} }) {
  // 从MetricsProvider继承showMetricsAutomatically状态，使状态在所有聊天中共享
  const { showMetricsAutomatically, setShowMetricsAutomatically } =
    useContext(MetricsContext);
  if (!metrics?.duration || !metrics?.outputTps) return null;

  return (
    <button
      type="button"
      onClick={() => setShowMetricsAutomatically(toggleAutoShowMetrics())}
      data-tooltip-id="metrics-visibility"
      data-tooltip-content={
        showMetricsAutomatically
          ? "点击仅在悬停时显示指标"
          : "点击在指标可用时立即显示"
      }
      className={`border-none flex justify-end items-center gap-x-[8px] ${
        showMetricsAutomatically ? "opacity-100" : "opacity-0"
      } md:group-hover:opacity-100 transition-all duration-300 hover:bg-theme-bg-hover rounded-md px-2 py-1`}
    >
      <p className="cursor-pointer text-xs font-mono text-theme-text-secondary opacity-50 hover:opacity-80 transition-opacity duration-200">
        {formatDuration(metrics.duration)} ({formatTps(metrics.outputTps)}{" "}
        词/秒)
      </p>
    </button>
  );
}
