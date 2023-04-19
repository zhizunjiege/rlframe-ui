import { TaskTable, SimenvTable, AgentTable } from "~/api";
import { getTimeString } from "~/utils";
import { useAppStore } from "./app";

export type Recent = Required<
  Pick<Task, "id" | "name" | "description" | "create_time" | "update_time">
>;

export const useTaskStore = defineStore("task", {
  state: () => ({
    saved: true, // task is saved
    direct: false, // saved is directly edited
    task: null as Nullable<Task>, // current task
    recent: [] as Recent[], // recent tasks
  }),
  actions: {
    loadRecentTasks() {
      const jsonStr = localStorage.getItem("recentTasks");
      if (jsonStr) {
        this.recent = JSON.parse(jsonStr);
      }
    },
    saveRecentTasks() {
      localStorage.setItem("recentTasks", JSON.stringify(this.recent));
    },

    addRecentTask(task: Task | Recent) {
      this.delRecentTask(task);
      this.recent.unshift({
        id: task.id,
        name: task.name,
        description: task.description,
        create_time: task.create_time,
        update_time: task.update_time,
      });
    },
    delRecentTask(task: Task | Recent) {
      for (let i = 0; i < this.recent.length; i++) {
        if (this.recent[i].id === task.id) {
          this.recent.splice(i, 1);
          break;
        }
      }
    },

    setSaved(saved: boolean) {
      this.saved = saved;
      this.direct = true;
    },

    newTask() {
      this.task = {
        id: -1,
        name: "未命名任务",
        description: "未命名任务",
        create_time: getTimeString(),
        update_time: getTimeString(),
        services: {},
        routes: {},
      };
      this.setSaved(false);
    },
    closeTask() {
      this.task = null;
      this.setSaved(true);
    },
    async openTask(id: number) {
      const cacheStore = useCacheStore();
      this.task = await cacheStore.getTask(id);
      this.addRecentTask(this.task);
      this.setSaved(true);
    },
    async saveTask() {
      const cacheStore = useCacheStore();
      this.task = await cacheStore.setTask(this.task!);
      this.addRecentTask(this.task);
      this.setSaved(true);
    },
    async copyTask(id: number) {
      const cacheStore = useCacheStore();
      const task = await cacheStore.getTask(id);
      task.id = -1;
      task.name = `${task.name}-副本`;
      for (const k of Object.keys(task.services)) {
        task.services[k].configs.id = -1;
      }
      return await cacheStore.setTask(task);
    },
    async deleteTask(id: number) {
      const cacheStore = useCacheStore();
      const tasks = await cacheStore.select("task", [], { id });
      const task = tasks[0];
      for (const id of Object.keys(task.services)) {
        if (task.services[id].infos.type === "simenv") {
          await cacheStore.delete("simenv", [task.services[id].configs]);
        } else if (task.services[id].infos.type === "agent") {
          await cacheStore.delete("agent", [task.services[id].configs]);
        }
      }
      await cacheStore.delete("task", [id]);
      this.delRecentTask(task as Recent);
    },
  },
});
