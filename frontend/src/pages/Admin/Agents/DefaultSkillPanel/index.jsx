import React from "react";
import { DefaultBadge } from "../Badges/default";

/**
 * 默认技能面板组件
 * 显示抑郁症专家的基础技能，包括技能说明、图片和开关
 * 
 * @param {string} title - 技能标题
 * @param {string} description - 技能描述
 * @param {string} image - 技能图片URL
 * @param {Component} icon - 技能图标组件
 * @param {boolean} enabled - 技能启用状态
 * @param {Function} toggleSkill - 切换技能状态的函数
 * @param {string} skill - 技能标识符
 */
export default function DefaultSkillPanel({
  title,
  description,
  image,
  icon,
  enabled = true,
  toggleSkill,
  skill,
}) {
  return (
    <div className="p-3">
      <div className="flex flex-col gap-y-[20px] max-w-[520px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-3">
            {icon &&
              React.createElement(icon, {
                size: 26,
                color: "var(--theme-text-primary)",
                weight: "bold",
                className: "text-primary-button",
              })}
            <label
              htmlFor="name"
              className="text-theme-text-primary text-lg font-bold"
            >
              {title}
            </label>
            <DefaultBadge title={title} />
          </div>
          <label
            className="border-none relative inline-flex items-center ml-auto cursor-pointer transition-opacity duration-200 hover:opacity-90"
          >
            <input
              type="checkbox"
              className="peer sr-only"
              checked={enabled}
              onChange={() => toggleSkill(skill)}
            />
            <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
            <span className="ml-3 text-sm font-medium"></span>
          </label>
        </div>
        <img 
          src={image} 
          alt={title} 
          className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" 
        />
        <p className="text-theme-text-secondary text-opacity-80 text-sm font-medium py-2 leading-relaxed">
          {description}
          <br />
          <br />
          默认情况下，此技能已启用，但如果您不希望抑郁症专家使用此功能，可以将其禁用。
        </p>
      </div>
    </div>
  );
}
