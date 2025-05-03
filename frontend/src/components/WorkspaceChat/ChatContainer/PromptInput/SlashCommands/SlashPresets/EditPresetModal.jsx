import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { CMD_REGEX } from ".";

export default function EditPresetModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  preset,
}) {
  const [command, setCommand] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (preset && isOpen) {
      setCommand(preset.command?.slice(1) || "");
    }
  }, [preset, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const sanitizedCommand = command.replace(CMD_REGEX, "");
    onSave({
      id: preset.id,
      command: `/${sanitizedCommand}`,
      prompt: form.get("prompt"),
      description: form.get("description"),
    });
  };

  const handleCommandChange = (e) => {
    const value = e.target.value.replace(CMD_REGEX, "");
    setCommand(value);
  };

  const handleDelete = async () => {
    if (!window.confirm("您确定要删除此预设吗？")) return;

    setDeleting(true);
    await onDelete(preset.id);
    setDeleting(false);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="w-full max-w-2xl bg-blue-50 rounded-lg shadow border-2 border-blue-200 overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-blue-200">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-blue-800 overflow-hidden overflow-ellipsis whitespace-nowrap">
              编辑预设
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
                      type="text"
                      name="command"
                      placeholder="您的命令"
                      value={command}
                      onChange={handleCommandChange}
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
                    placeholder="这是一个测试提示。请回复一首关于抑郁症的诗。"
                    defaultValue={preset.prompt}
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
                    defaultValue={preset.description}
                    placeholder="回复一首关于抑郁症的诗。"
                    required={true}
                    className="border border-blue-200 bg-white w-full text-blue-800 placeholder:text-blue-400 text-sm rounded-lg focus:outline-blue-500 active:outline-blue-500 outline-none block w-full p-2.5"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-between items-center p-6 space-x-2 border-t border-blue-200 rounded-b">
              <button
                disabled={deleting}
                onClick={handleDelete}
                type="button"
                className="transition-all duration-300 bg-transparent text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {deleting ? "正在删除..." : "删除预设"}
              </button>
              <div className="flex space-x-2">
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
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}
