import { TaskTable, AgentTable, SimenvTable, ServiceTable } from "~/api";
import { getTimestampString } from "~/utils";
import { useAppStore } from "./app";

export type Task = {
  infos: TaskTable;
  agents: {
    service: ServiceTable;
    configs: AgentTable;
  }[];
  toDelAgentIds: number[];
  simenvs: {
    service: ServiceTable;
    configs: SimenvTable;
  }[];
  toDelSimenvIds: number[];
};

export const useTaskStore = defineStore("task", {
  state: () => ({
    saved: true, // task is saved
    direct: false, // saved is directly edited
    task: null as Nullable<Task>, // current task
    recent: [] as TaskTable[], // recent tasks
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

    addRecentTask(task: TaskTable) {
      const index = this.recent.findIndex((t) => t.id === task.id);
      if (index >= 0) {
        this.delRecentTask(index);
      }
      this.recent.unshift(task);
    },
    delRecentTask(index: number) {
      this.recent.splice(index, 1);
    },

    setSaved(saved: boolean) {
      this.saved = saved;
      this.direct = true;
    },

    newTask() {
      const timestamp = getTimestampString();
      this.task = {
        infos: {
          id: -1,
          name: "未命名任务",
          desc: "未命名任务",
          create_time: timestamp,
          update_time: timestamp,
        },
        agents: [],
        toDelAgentIds: [],
        simenvs: [],
        toDelSimenvIds: [],
      };
      this.setSaved(false);
    },
    clsTask() {
      this.task = null;
      this.setSaved(true);
    },

    async openTask(id: number) {
      this.task = await this.getTask(id);
      this.addRecentTask(this.task.infos);
      this.setSaved(true);
    },
    async saveTask() {
      this.task = await this.setTask(this.task!);
      this.addRecentTask(this.task.infos);
      this.setSaved(true);
    },

    async getTask(id: number) {
      const appStore = useAppStore();
      const tasks = await appStore.rest!.select("task", [], { id });
      if (tasks.length == 0) {
        throw new Error(`Task ${id} not found`);
      }
      const task = { infos: tasks[0] } as Task;
      const services = await appStore.rest!.select("service", [], {
        task_id: id,
      });
      for (const service of services) {
        if (service.agent_id && service.agent_id >= 0) {
          const res = await appStore.rest!.select("agent", [], {
            id: service.agent_id,
          });
          task.agents.push({ service, configs: res[0] });
        } else if (service.simenv_id && service.simenv_id >= 0) {
          const res = await appStore.rest!.select("simenv", [], {
            id: service.simenv_id,
          });
          task.simenvs.push({ service, configs: res[0] });
        } else {
          throw new Error(`Service ${service.id} has no bound agent or simenv`);
        }
      }
      return task;
    },
    async setTask(task: Task) {
      const appStore = useAppStore();
      const timestamp = getTimestampString();
      const { lastrowid } = await appStore.rest!.replace("task", task.infos);
      if (task.infos.id < 0) {
        task.infos.create_time = timestamp;
      }
      task.infos.update_time = timestamp;
      task.infos.id = lastrowid;
      for (const agent of task.agents) {
        const { lastrowid } = await appStore.rest!.replace(
          "agent",
          agent.configs
        );
        if (agent.configs.id < 0) {
          agent.configs.create_time = timestamp;
        }
        agent.configs.update_time = timestamp;
        agent.configs.id = lastrowid;
        agent.service.task_id = task.infos.id;
        agent.service.agent_id = agent.configs.id;
        await appStore.rest!.replace("service", agent.service);
      }
      await appStore.rest!.delete("agent", task.toDelAgentIds);
      for (const simenv of task.simenvs) {
        const { lastrowid } = await appStore.rest!.replace(
          "simenv",
          simenv.configs
        );
        if (simenv.configs.id < 0) {
          simenv.configs.create_time = timestamp;
        }
        simenv.configs.update_time = timestamp;
        simenv.configs.id = lastrowid;
        simenv.service.task_id = task.infos.id;
        simenv.service.agent_id = simenv.configs.id;
        await appStore.rest!.replace("service", simenv.service);
      }
      await appStore.rest!.delete("simenv", task.toDelSimenvIds);
      return task;
    },

    addService(type: "agent" | "simenv") {
      const timestamp = getTimestampString();
      const service = {
        id: -1,
        create_time: timestamp,
        update_time: timestamp,
        task_id: this.task!.infos.id,
        server_id: "",
      } as ServiceTable;
      if (type === "agent") {
        service.agent_id = -1;
        this.task!.agents.unshift({
          service,
          configs: {
            id: -1,
            desc: "",
            create_time: timestamp,
            update_time: timestamp,
            training: 1,
            name: "",
            hypers: "{}",
            sifunc: "",
            oafunc: "",
            rewfunc: "",
            hooks: "{}",
          },
        });
      } else if (type === "simenv") {
        service.simenv_id = -1;
        this.task!.simenvs.unshift({
          service,
          configs: {
            id: -1,
            desc: "",
            create_time: timestamp,
            update_time: timestamp,
            name: "",
            args: "{}",
          },
        });
      } else {
        throw new Error(`Unknown service type ${type}`);
      }
      this.setSaved(false);
    },
    delService(type: "agent" | "simenv", index: number) {
      if (type === "agent") {
        const id = this.task!.agents[index].configs.id;
        if (id >= 0) {
          this.task!.toDelAgentIds.push(id);
        }
        this.task!.agents.splice(index, 1);
      } else if (type === "simenv") {
        const id = this.task!.simenvs[index].configs.id;
        if (id >= 0) {
          this.task!.toDelSimenvIds.push(id);
        }
        this.task!.simenvs.splice(index, 1);
      } else {
        throw new Error(`Unknown service type ${type}`);
      }
      this.setSaved(false);
    },
  },
});
