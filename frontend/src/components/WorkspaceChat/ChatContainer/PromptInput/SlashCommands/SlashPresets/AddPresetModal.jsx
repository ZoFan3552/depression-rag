import { useState } from "react";
import { X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { CMD_REGEX } from ".";

export default function AddPresetModal({ isOpen, onClose, onSave }) {
  const [command, setCommand] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const sanitizedCommand = command.replace(CMD_REGEX, "");
    const saved = await onSave({
      command: `/${sanitizedCommand}`,
      prompt: form.get("prompt"),
      description: form.get("description"),
    });
    if (saved) setCommand("");
  };

  const handleCommandChange = (e) => {
    const value = e.target.value.replace(CMD_REGEX, "");
    setCommand(value);
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="w-full max-w-2xl bg-blue-50 rounded-lg shadow border-2 border-blue-200 overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-blue-200">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-blue-800 overflow-hidden overflow-ellipsis whitespace-nowrap">
              添加新预设
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-blue-200 hover:border-blue-300 hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-blue-700" />
          </button>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="py-7 px-9 space-y-2 flex-col">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <label
                    htmlFor="command"
                    className="block mb-2 text-sm font-medium text-blue-800"
                  >
                    命令
                  </label>
                  <div className="flex items-center">
                    <span className="text-blue-800 text-sm mr-2 font-bold">/</span>
                    <input
                      name="command"
                      type="text"
                      id="command"
                      placeholder="您的命令"
                      value={command}
                      onChange={handleCommandChange}
                      maxLength={25}
                      autoComplete="off"
                      required={true}
                      className="border border-blue-200 bg-white w-full text-blue-800 placeholder:text-blue-400 text-sm rounded-lg focus:outline-blue-500 active:outline-blue-500 outline-none block w-full p-2.5"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="prompt"
                    className="block mb-2 text-sm font-medium text-blue-800"
                  >
                    提示语
                  </label>
                  <textarea
                    name="prompt"
                    id="prompt"
                    autoComplete="off"
                    placeholder="这是将会添加到您的提问前面的内容。"
                    required={true}
                    className="border border-blue-200 bg-white w-full text-blue-800 placeholder:text-blue-400 text-sm rounded-lg focus:outline-blue-500 active:outline-blue-500 outline-none block w-full p-2.5"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-blue-800"
                  >
                    描述
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="回复一篇关于抑郁症的信息。"
                    maxLength={80}
                    autoComplete="off"
                    required={true}
                    className="border border-blue-200 bg-white w-full text-blue-800 placeholder:text-blue-400 text-sm rounded-lg focus:outline-blue-500 active:outline-blue-500 outline-none block w-full p-2.5"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-blue-200 rounded-b">
              <button
                onClick={onClose}
                type="button"
                className="transition-all duration-300 bg-transparent text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm"
              >
                取消
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}
