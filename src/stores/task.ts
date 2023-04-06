import { AgentTable, SimenvTable, TaskTable } from "api";
import { useAppStore } from "./app";

type CurrentTask = Modified<
  Required<TaskTable>,
  {
    services: Modified<
      TaskTable["services"],
      {
        [key: string]: Modified<
          TaskTable["services"][string],
          {
            configs: AgentTable | SimenvTable;
          }
        >;
      }
    >;
  }
>;

type RecentTask = Required<
  Pick<TaskTable, "id" | "name" | "description" | "create_time" | "update_time">
>;

export const useTaskStore = defineStore("task", {
  state: () => ({
    saved: true, // task is saved
    task: null as Nullable<CurrentTask>, // current task
    recent: [] as RecentTask[], // recent tasks
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
    addRecentTask() {
      if (this.task) {
        for (let i = 0; i < this.recent.length; i++) {
          if (this.recent[i].id === this.task.id) {
            this.delRecentTask(i);
            break;
          }
        }
        this.recent.unshift({
          id: this.task.id,
          name: this.task.name,
          description: this.task.description,
          create_time: this.task.create_time,
          update_time: this.task.update_time,
        });
      }
    },
    delRecentTask(index: number) {
      return this.recent.splice(index, 1);
    },

    setSaved(saved = true) {
      nextTick(() => {
        this.saved = saved;
      });
    },

    newTask() {
      this.task = {
        id: -1,
        name: "未命名任务",
        description: "",
        create_time: "",
        update_time: "",
        services: {},
        routes: {},
      };
    },

    closeTask() {
      this.task = null;
      this.setSaved();
    },

    async openTask(id: number) {
      const appStore = useAppStore();
      const tasks = await appStore.rest!.select("task", [], { id });
      if (tasks.length > 0) {
        this.task = tasks[0] as unknown as CurrentTask;
        for (const [key, value] of Object.entries(tasks[0].services)) {
          const type = value.infos.type;
          const service = this.task.services[key];
          if (type === "agent") {
            service.configs = await this.getAgentConfigs(value.configs);
          } else if (type === "simenv") {
            service.configs = await this.getSimenvConfigs(value.configs);
          }
        }
        this.addRecentTask();
        this.setSaved();
      } else {
        throw new Error(`Task ${id} not found`);
      }
    },
    async getAgentConfigs(id: number) {
      const appStore = useAppStore();
      const agents = await appStore.rest!.select(
        "agent",
        [
          "id",
          "name",
          "description",
          "create_time",
          "update_time",
          "type",
          "hypers",
          "sifunc",
          "oafunc",
          "rewfunc",
        ],
        {
          id,
        }
      );
      if (agents.length > 0) {
        return agents[0];
      } else {
        throw new Error(`Agent ${id} not found`);
      }
    },
    async getSimenvConfigs(id: number) {
      const appStore = useAppStore();
      const simenvs = await appStore.rest!.select(
        "simenv",
        [
          "id",
          "name",
          "description",
          "create_time",
          "update_time",
          "type",
          "args",
          "params",
        ],
        {
          id,
        }
      );
      if (simenvs.length > 0) {
        return simenvs[0];
      } else {
        throw new Error(`Simenv ${id} not found`);
      }
    },

    async saveTask() {
      const appStore = useAppStore();
      if (this.task && !this.saved) {
        for (const service of Object.values(this.task.services)) {
          const { lastrowid } = await appStore.rest!.replace(
            service.infos.type as "agent" | "simenv",
            service.configs
          );
          service.configs.id = lastrowid;
        }
        const data = {
          id: this.task.id,
          name: this.task.name,
          description: this.task.description,
          services: Object.fromEntries(
            Object.entries(this.task.services).map(([k, v]) => [
              k,
              {
                infos: v.infos,
                configs: v.configs.id,
              },
            ])
          ),
          routes: this.task.routes,
        };
        const { lastrowid } = await appStore.rest!.replace("task", data);
        this.task.id = lastrowid;
        this.addRecentTask();
        this.setSaved();
      } else {
        throw new Error(`Task not found`);
      }
    },
  },
});
