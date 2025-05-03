import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import { MessageLimitInput, RoleHintDisplay } from "../..";
import { AUTH_USER } from "@/utils/constants";

export default function EditUserModal({ currentUser, user, closeModal }) {
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState(null);
  const [messageLimit, setMessageLimit] = useState({
    enabled: user.dailyMessageLimit !== null,
    limit: user.dailyMessageLimit || 10,
  });

  // 处理用户更新
  const handleUpdate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) {
      if (!value || value === null) continue;
      data[key] = value;
    }
    if (messageLimit.enabled) {
      data.dailyMessageLimit = messageLimit.limit;
    } else {
      data.dailyMessageLimit = null;
    }

    const { success, error } = await Admin.updateUser(user.id, data);
    if (success) {
      // 如果正在编辑自己的用户信息，更新本地存储
      if (currentUser && currentUser.id === user.id) {
        currentUser.username = data.username;
        currentUser.bio = data.bio;
        currentUser.role = data.role;
        localStorage.setItem(AUTH_USER, JSON.stringify(currentUser));
      }

      window.location.reload();
    }
    setError(error);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow-lg border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              编辑 {user.username}
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  用户名
                </label>
                <input
                  name="username"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  placeholder="用户的用户名"
                  defaultValue={user.username}
                  minLength={2}
                  required={true}
                  autoComplete="off"
                />
                <p className="mt-2 text-xs text-white/60">
                  用户名只能包含小写字母、句点、数字、下划线和连字符，不能包含空格
                </p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  新密码
                </label>
                <input
                  name="password"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  placeholder={`${user.username} 的新密码`}
                  autoComplete="off"
                  minLength={8}
                />
                <p className="mt-2 text-xs text-white/60">
                  密码长度必须至少为8个字符
                </p>
              </div>
              <div>
                <label
                  htmlFor="bio"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  个人简介
                </label>
                <textarea
                  name="bio"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  placeholder="用户的个人简介"
                  defaultValue={user.bio}
                  autoComplete="off"
                  rows={3}
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  角色
                </label>
                <select
                  name="role"
                  required={true}
                  defaultValue={user.role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                >
                  <option value="default">普通用户</option>
                  <option value="manager">管理人员</option>
                  {currentUser?.role === "admin" && (
                    <option value="admin">系统管理员</option>
                  )}
                </select>
                <RoleHintDisplay role={role} />
              </div>
              <MessageLimitInput
                role={role}
                enabled={messageLimit.enabled}
                limit={messageLimit.limit}
                updateState={setMessageLimit}
              />
              {error && <p className="text-red-400 text-sm">错误: {error}</p>}
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm hover:scale-105"
              >
                取消
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-80 px-4 py-2 rounded-lg text-sm hover:scale-105 shadow-md"
              >
                更新用户
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
