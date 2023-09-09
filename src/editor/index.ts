import { App } from "vue";

import * as monaco from "monaco-editor";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

import MonacoEditor from "./comps/monaco-editor.vue";
import ThemeLight from "./themes/light";
import ThemeDark from "./themes/dark";

self.MonacoEnvironment = {
  getWorker(id, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    return new editorWorker();
  },
};

monaco.editor.defineTheme("light", ThemeLight);
monaco.editor.defineTheme("dark", ThemeDark);

// editor plugin
export function createEditor() {
  return markRaw({
    install(app: App) {
      app.component("MonacoEditor", MonacoEditor);
    },
  });
}
