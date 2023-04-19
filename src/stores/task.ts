import { TaskTable, SimenvTable, AgentTable } from "~/api";
import { getTimeString } from "~/utils";
import { useAppStore } from "./app";

export type Task = Modified<
  Required<TaskTable>,
  {
    services: Modified<
      TaskTable["services"],
      {
        [key: string]: Modified<
          TaskTable["services"][string],
          {
            configs: SimenvTable | AgentTable;
          }
        >;
      }
    >;
  }
>;

export type Recent = Required<
  Pick<Task, "id" | "name" | "description" | "create_time" | "update_time">
>;

const simenvColumns = [] as (keyof SimenvTable)[];
const agentColumns = [
  "id",
  "name",
  "description",
  "create_time",
  "update_time",
  "training",
  "type",
  "hypers",
  "sifunc",
  "oafunc",
  "rewfunc",
] as (keyof AgentTable)[];

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
      this.task = await this.getTask(id);
      this.addRecentTask(this.task);
      this.setSaved(true);
    },
    async saveTask() {
      await this.setTask(this.task!);
      this.addRecentTask(this.task!);
      this.setSaved(true);
    },

    async getTask(id: number) {
      const appStore = useAppStore();
      const tasks = await appStore.rest!.select("task", [], { id });
      if (tasks.length > 0) {
        const task = tasks[0] as unknown as Task;
        for (const [k, v] of Object.entries(tasks[0].services)) {
          const type = v.infos.type as "simenv" | "agent";
          let res: SimenvTable[] | AgentTable[] = [];
          if (type === "simenv") {
            res = await appStore.rest!.select("simenv", simenvColumns, {
              id: v.configs,
            });
          } else if (type === "agent") {
            res = await appStore.rest!.select("agent", agentColumns, {
              id: v.configs,
            });
          }
          task.services[k].configs = res[0];
        }
        return task;
      } else {
        throw new Error(`Task ${id} not found`);
      }
    },
    async setTask(task: Task) {
      const appStore = useAppStore();
      for (const srv of Object.values(task.services)) {
        const type = srv.infos.type as "simenv" | "agent";
        const { lastrowid } = await appStore.rest!.replace(type, srv.configs);
        if (srv.configs.id < 0) {
          srv.configs.create_time = getTimeString();
        }
        srv.configs.update_time = getTimeString();
        srv.configs.id = lastrowid;
      }
      const { lastrowid } = await appStore.rest!.replace("task", {
        ...task,
        services: Object.fromEntries(
          Object.entries(task.services).map(([k, v]) => [
            k,
            {
              infos: v.infos,
              configs: v.configs.id,
            },
          ])
        ),
      });
      if (task.id < 0) {
        task.create_time = getTimeString();
      }
      task.update_time = getTimeString();
      task.id = lastrowid;
      return lastrowid;
    },
  },
});
