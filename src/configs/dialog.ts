import { QDialogOptions } from "quasar";

export const saveDialog = {
  title: "提示",
  message: "是否保存当前任务？",
  cancel: true,
  persistent: true,
  class: "bg-secondary",
  options: {
    type: "radio",
    model: "yes",
    inline: true,
    items: [
      { label: "保存", value: "yes" },
      { label: "不保存", value: "no" },
    ],
  },
} as QDialogOptions;
