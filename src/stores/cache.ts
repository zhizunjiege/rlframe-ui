import { DBTables, SelectOptions } from "~/api";
import { deepCopy, getTimeString } from "~/utils";
import { useAppStore } from "./app";

type Cache = {
  [table in keyof DBTables as `${table}s`]: {
    [id: number]: DBTables[table];
  };
};

export type Task = Modified<
  Required<DBTables["task"]>,
  {
    services: Modified<
      DBTables["task"]["services"],
      {
        [key: string]: Modified<
          DBTables["task"]["services"][string],
          {
            configs: DBTables["simenv"] | DBTables["agent"];
          }
        >;
      }
    >;
  }
>;

export const useCacheStore = defineStore("cache", {
  state: () => ({
    caches: {
      tasks: {},
      simenvs: {},
      agents: {},
    } as Cache,
  }),

  actions: {
    async select<T extends keyof DBTables>(
      table: T,
      columns: (keyof DBTables[T])[] = [],
      options: SelectOptions = {}
    ): Promise<DBTables[T][]> {
      const appStore = useAppStore();
      const obj = this.caches[`${table}s`];

      const id = options.id ?? -1;
      if (id >= 0 && obj[id] !== undefined) {
        return [obj[id]] as DBTables[T][];
      } else {
        const response = await appStore.rest!.select(table, columns, options);
        response.forEach((item) => {
          obj[item.id] = item;
        });
        return response;
      }
    },
    async insert<T extends keyof DBTables>(
      table: T,
      data: DBTables[T]
    ): Promise<{ lastrowid: number }> {
      const appStore = useAppStore();
      const obj = this.caches[`${table}s`];

      const response = await appStore.rest!.insert(table, data);
      data.id = response.lastrowid;
      data.create_time = getTimeString();
      data.update_time = getTimeString();
      obj[response.lastrowid] = data;
      return response;
    },
    async update<T extends keyof DBTables>(
      table: T,
      data: Partial<DBTables[T]>
    ): Promise<{ rowcount: number }> {
      const appStore = useAppStore();
      const obj = this.caches[`${table}s`];

      const response = await appStore.rest!.update(table, data);
      data.update_time = getTimeString();
      const id = data.id!;
      obj[id] = { ...obj[id], ...data };
      return response;
    },
    async replace<T extends keyof DBTables>(
      table: T,
      data: Partial<DBTables[T]>
    ): Promise<{ lastrowid: number; rowcount: number }> {
      const id = data.id ?? -1;
      if (id < 0) {
        const response = await this.insert(table, data as DBTables[T]);
        return {
          lastrowid: response.lastrowid,
          rowcount: 1,
        };
      } else {
        const response = await this.update(table, data);
        return {
          lastrowid: id,
          rowcount: response.rowcount,
        };
      }
    },
    async delete<T extends keyof DBTables>(
      table: T,
      ids: number[]
    ): Promise<{ rowcount: number }> {
      const appStore = useAppStore();
      const obj = this.caches[`${table}s`];

      const response = await appStore.rest!.delete(table, ids);
      ids.forEach((id) => {
        delete obj[id];
      });
      return response;
    },

    async getTask(id: number) {
      const tasks = await this.select("task", [], { id });
      if (tasks.length > 0) {
        const task = deepCopy(tasks[0]) as unknown as Task;
        for (const [k, v] of Object.entries(tasks[0].services)) {
          const type = v.infos.type as "agent" | "simenv";
          let res: DBTables["simenv"][] | DBTables["agent"][] = [];
          if (type === "simenv") {
            res = await this.select(
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
                id: v.configs,
              }
            );
          } else if (type === "agent") {
            res = await this.select(
              "agent",
              [
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
              ],
              {
                id: v.configs,
              }
            );
          }
          task.services[k].configs = deepCopy(res[0]);
        }
        return task;
      } else {
        throw new Error(`Task ${id} not found`);
      }
    },
    async setTask(task: Task) {
      if (task.id >= 0) {
        const prev = (
          await this.select("task", [], {
            id: task.id,
          })
        )[0].services;
        for (const id of Object.keys(prev)) {
          if (task.services[id] === undefined) {
            if (prev[id].infos.type === "simenv") {
              await this.delete("simenv", [prev[id].configs]);
            } else if (prev[id].infos.type === "agent") {
              await this.delete("agent", [prev[id].configs]);
            }
          }
        }
      }
      for (const [k, v] of Object.entries(task.services)) {
        await this.replace(v.infos.type as "agent" | "simenv", v.configs);
        task.services[k] = deepCopy(v);
      }
      const data = {
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
      };
      await this.replace("task", data);
      task = {
        ...data,
        services: task.services,
      };
      return task;
    },
  },
});
