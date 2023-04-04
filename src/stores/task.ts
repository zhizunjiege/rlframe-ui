import { AgentTable, SimenvTable, TaskTable } from "api";

type CurrentTask = Modified<
  TaskTable,
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
    task: null as Nullable<CurrentTask>, // current task
    recent: [] as RecentTask[], // recent tasks
  }),
  actions: {},
});
