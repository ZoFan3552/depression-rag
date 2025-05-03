import React, { useEffect, useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

export default function MenuOption({
  btnText,
  icon,
  href,
  childOptions = [],
  flex = false,
  user = null,
  roles = [],
  hidden = false,
  isChild = false,
}) {
  const storageKey = generateStorageKey({ key: btnText });
  const location = useLocation();
  const hasChildren = childOptions.length > 0;
  const hasVisibleChildren = hasVisibleOptions(user, childOptions);
  const { isExpanded, setIsExpanded } = useIsExpanded({
    storageKey,
    hasVisibleChildren,
    childOptions,
    location: location.pathname,
  });

  if (hidden) return null;

  // 如果这是父级选项
  if (!isChild) {
    // 且没有子选项，则直接使用其flex和roles属性
    if (!hasChildren) {
      if (!flex && !roles.includes(user?.role)) return null;
      if (flex && !!user && !roles.includes(user?.role)) return null;
    }

    // 如果有子选项但没有可见的子选项 - 移除它
    if (hasChildren && !hasVisibleChildren) return null;
  } else {
    // 是子选项，所以我们使用它自己的权限设置
    if (!flex && !roles.includes(user?.role)) return null;
    if (flex && !!user && !roles.includes(user?.role)) return null;
  }

  const isActive = hasChildren
    ? (!isExpanded &&
        childOptions.some((child) => child.href === location.pathname)) ||
      location.pathname === href
    : location.pathname === href;

  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      const newExpandedState = !isExpanded;
      setIsExpanded(newExpandedState);
      localStorage.setItem(storageKey, JSON.stringify(newExpandedState));
    }
  };

  return (
    <div>
      <div
        className={`
          flex items-center justify-between w-full
          transition-all duration-300
          rounded-[8px]
          ${
            isActive
              ? "bg-theme-sidebar-subitem-selected font-medium border-outline shadow-sm"
              : "hover:bg-theme-sidebar-subitem-hover hover:shadow-sm"
          }
        `}
      >
        <Link
          to={href}
          className={`flex flex-grow items-center px-[12px] h-[34px] font-medium ${
            isChild ? "hover:text-white" : "text-white light:text-black"
          } transition-colors duration-200`}
          onClick={hasChildren ? handleClick : undefined}
          aria-current={isActive ? "page" : undefined}
        >
          {icon && <span className="flex items-center justify-center">{icon}</span>}
          <p
            className={`${
              isChild ? "text-xs" : "text-sm"
            } leading-loose whitespace-nowrap overflow-hidden ml-2 ${
              isActive
                ? "text-white font-semibold"
                : "text-white light:text-black"
            } ${!icon && "pl-5"}`}
          >
            {translateText(btnText)}
          </p>
        </Link>
        {hasChildren && (
          <button 
            onClick={handleClick} 
            className="p-2 text-white hover:bg-theme-sidebar-subitem-hover rounded-full transition-colors duration-200"
            aria-label={isExpanded ? "收起" : "展开"}
            aria-expanded={isExpanded}
          >
            <CaretRight
              size={16}
              weight="bold"
              className={`transition-transform text-white light:text-black duration-300 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </button>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className="mt-1 rounded-r-lg w-full pl-2">
          {childOptions.map((childOption, index) => (
            <MenuOption
              key={index}
              {...childOption} // flex和roles属性在这里传递
              user={user}
              isChild={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function useIsExpanded({
  storageKey = "",
  hasVisibleChildren = false,
  childOptions = [],
  location = null,
}) {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (hasVisibleChildren) {
      const storedValue = localStorage.getItem(storageKey);
      if (storedValue !== null) {
        return JSON.parse(storedValue);
      }
      return childOptions.some((child) => child.href === location);
    }
    return false;
  });

  useEffect(() => {
    if (hasVisibleChildren) {
      const shouldExpand = childOptions.some(
        (child) => child.href === location
      );
      if (shouldExpand && !isExpanded) {
        setIsExpanded(true);
        localStorage.setItem(storageKey, JSON.stringify(true));
      }
    }
  }, [location]);

  return { isExpanded, setIsExpanded };
}

/**
 * 检查子选项对用户是否可见。
 * 如果子选项由于用户权限不可见或子选项的hidden属性被其他方式设置为true，则隐藏顶级选项。
 * 如果所有子选项的`isVisible`都返回false，则父选项也不可见。
 * @param {object} user - 用户对象
 * @param {array} childOptions - 子选项数组
 * @returns {boolean} - 如果子选项可见则返回true，否则返回false
 */
function hasVisibleOptions(user = null, childOptions = []) {
  if (!Array.isArray(childOptions) || childOptions?.length === 0) return false;

  function isVisible({
    roles = [],
    user = null,
    flex = false,
    hidden = false,
  }) {
    if (hidden) return false;
    if (!flex && !roles.includes(user?.role)) return false;
    if (flex && !!user && !roles.includes(user?.role)) return false;
    return true;
  }

  return childOptions.some((opt) =>
    isVisible({ roles: opt.roles, user, flex: opt.flex, hidden: opt.hidden })
  );
}

function generateStorageKey({ key = "" }) {
  const _key = key.replace(/\s+/g, "_").toLowerCase();
  return `anything_llm_menu_${_key}_expanded`;
}

// 翻译函数
function translateText(text) {
  const translations = {
    "AI Providers": "AI 提供商",
    "LLM": "大语言模型",
    "Vector Database": "向量数据库",
    "Embedder": "嵌入模型",
    "Text Splitting": "文本分割",
    "Voice & Speech": "语音与朗读",
    "Admin": "管理员",
    "Users": "用户",
    "Workspaces": "工作区",
    "Workspace Chats": "工作区聊天",
    "Invites": "邀请",
    "Agent Skills": "抑郁症专家智能助手技能",
    "Customization": "自定义",
    "Interface": "界面",
    "Chat": "聊天",
    "Tools": "工具",
    "Event Logs": "事件日志",
    "System Prompt Variables": "系统提示变量",
    "Settings": "设置"
  };
  
  return translations[text] || text;
}
