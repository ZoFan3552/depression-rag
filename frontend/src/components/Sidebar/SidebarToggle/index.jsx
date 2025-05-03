import React, { useEffect, useState } from "react";
import { SidebarSimple } from "@phosphor-icons/react";
import paths from "@/utils/paths";
import { Tooltip } from "react-tooltip";
const SIDEBAR_TOGGLE_STORAGE_KEY = "anythingllm_sidebar_toggle";

/**
 * 从 localStorage 返回侧边栏的先前状态。
 * 如果侧边栏是关闭的，返回 false。
 * 如果侧边栏是打开的，返回 true。
 * 如果侧边栏状态未设置，返回 true。
 * @returns {boolean}
 */
function previousSidebarState() {
  const previousState = window.localStorage.getItem(SIDEBAR_TOGGLE_STORAGE_KEY);
  if (previousState === "closed") return false;
  return true;
}

export function useSidebarToggle() {
  const [showSidebar, setShowSidebar] = useState(previousSidebarState());
  const [canToggleSidebar, setCanToggleSidebar] = useState(true);

  useEffect(() => {
    function checkPath() {
      const currentPath = window.location.pathname;
      const isVisible =
        currentPath === paths.home() ||
        /^\/workspace\/[^\/]+$/.test(currentPath) ||
        /^\/workspace\/[^\/]+\/t\/[^\/]+$/.test(currentPath);
      setCanToggleSidebar(isVisible);
    }
    checkPath();
  }, [window.location.pathname]);

  useEffect(() => {
    function toggleSidebar(e) {
      if (!canToggleSidebar) return;
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "s"
      ) {
        setShowSidebar((prev) => {
          const newState = !prev;
          window.localStorage.setItem(
            SIDEBAR_TOGGLE_STORAGE_KEY,
            newState ? "open" : "closed"
          );
          return newState;
        });
      }
    }
    window.addEventListener("keydown", toggleSidebar);
    return () => {
      window.removeEventListener("keydown", toggleSidebar);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      SIDEBAR_TOGGLE_STORAGE_KEY,
      showSidebar ? "open" : "closed"
    );
  }, [showSidebar]);

  return { showSidebar, setShowSidebar, canToggleSidebar };
}

export function ToggleSidebarButton({ showSidebar, setShowSidebar }) {
  const isMac = navigator.userAgent.includes("Mac");
  const shortcut = isMac ? "⌘ + Shift + S" : "Ctrl + Shift + S";

  return (
    <>
      <button
        type="button"
        className={`hidden md:block border-none bg-transparent outline-none ring-0 transition-left duration-500 ${showSidebar ? "left-[247px]" : "absolute top-[20px] left-[30px] z-10"}`}
        onClick={() => setShowSidebar((prev) => !prev)}
        data-tooltip-id="sidebar-toggle"
        data-tooltip-content={
          showSidebar
            ? `隐藏侧边栏 (${shortcut})`
            : `显示侧边栏 (${shortcut})`
        }
        aria-label={
          showSidebar
            ? `隐藏侧边栏 (${shortcut})`
            : `显示侧边栏 (${shortcut})`
        }
      >
        <SidebarSimple
          className="text-theme-text-secondary hover:text-theme-text-primary transition-colors duration-200"
          size={24}
        />
      </button>
      <Tooltip
        id="sidebar-toggle"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99 bg-gray-800/90 backdrop-blur-sm shadow-md"
      />
    </>
  );
}
