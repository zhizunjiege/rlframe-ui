import { Task } from "~/api";
import { getTimestampString } from "~/utils";
import { useAppStore } from "./app";

export const useTaskStore = defineStore("task", {
  state: () => ({
    saved: true, // task is saved
    direct: false, // saved is directly edited
    task: null as Nullable<Task>, // current task
    recent: [] as Task["task"][], // recent tasks
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

    addRecentTask(task: Task["task"]) {
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
        task: {
          id: -1,
          name: "未命名任务",
          desc: "未命名任务",
          create_time: timestamp,
          update_time: timestamp,
        },
        agents: [],
        simenvs: [],
      };
      this.setSaved(false);
    },
    clsTask() {
      this.task = null;
      this.setSaved(true);
    },

    async openTask(id: number) {
      const appStore = useAppStore();
      this.task = await appStore.rest!.getTask(id);
      this.addRecentTask(this.task.task);
      this.setSaved(true);
    },
    async saveTask() {
      if (this.task) {
        const appStore = useAppStore();
        const ids = await appStore.rest!.setTask(this.task);
        const timestamp = getTimestampString();

        if (this.task.task.id < 0) {
          this.task.task.id = ids.task;
          this.task.task.create_time = timestamp;
        }
        this.task.task.update_time = timestamp;

        for (let i = 0; i < this.task.agents.length; i++) {
          const agent = this.task.agents[i];
          if (agent.id < 0) {
            agent.id = ids.agents[i];
            agent.create_time = timestamp;
            agent.task = this.task.task.id;
          }
          agent.update_time = timestamp;
        }

        for (let i = 0; i < this.task.simenvs.length; i++) {
          const simenv = this.task.simenvs[i];
          if (simenv.id < 0) {
            simenv.id = ids.simenvs[i];
            simenv.create_time = timestamp;
            simenv.task = this.task.task.id;
          }
          simenv.update_time = timestamp;
        }

        this.addRecentTask(this.task.task);
        this.setSaved(true);
      }
    },

    addService(type: "agent" | "simenv") {
      const timestamp = getTimestampString();
      if (type === "agent") {
        this.task!.agents.unshift({
          id: -1,
          desc: "",
          create_time: timestamp,
          update_time: timestamp,
          task: this.task!.task.id,
          server: "",
          training: 1,
          name: "",
          hypers: "{}",
          sifunc:
            '# Python 3.8.10\r\nimport math\r\nfrom typing import Any, Dict, List, Union\r\n\r\nimport numpy as np\r\n\r\n\r\ndef func(states: Dict[str, List[Dict[str, Any]]]) -> Union[np.ndarray, Dict[Union[str, int], np.ndarray]]:\r\n    """Convert `states` to `inputs` for model inferecing."""\r\n    global caches\r\n    # write your code here\r\n    return np.array([0])',
          oafunc:
            "# Python 3.8.10\r\nfrom typing import Any, Dict, List, Union\r\n\r\nimport numpy as np\r\n\r\n\r\ndef func(outputs: Union[np.ndarray, Dict[Union[str, int], np.ndarray]]) -> Dict[str, List[Dict[str, Any]]]:\r\n    \"\"\"Convert `outputs` to `actions` for model simulation.\"\"\"\r\n    global caches\r\n    # write your code here\r\n    return {\r\n        'model1': [{\r\n            'param1': int(0),\r\n            'param2': float(1.0),\r\n        }],\r\n        'model2': [{\r\n            'param3': str('Helloworld'),\r\n        }],\r\n    }\r\n",
          rewfunc:
            '# Python 3.8.10\r\nfrom typing import Any, Dict, List, Union\r\n\r\nimport numpy as np\r\n\r\n\r\ndef func(\r\n    states: Dict[str, List[Dict[str, Any]]],\r\n    inputs: Union[np.ndarray, Dict[Union[str, int], np.ndarray]],\r\n    actions: Dict[str, List[Dict[str, Any]]],\r\n    outputs: Union[np.ndarray, Dict[Union[str, int], np.ndarray]],\r\n    next_states: Dict[str, List[Dict[str, Any]]],\r\n    next_inputs: Union[np.ndarray, Dict[Union[str, int], np.ndarray]],\r\n    terminated: bool,\r\n    truncated: bool,\r\n    reward: Union[float, Dict[Union[str, int], float]],\r\n) -> Union[float, Dict[Union[str, int], float]]:\r\n    """Calculate the reward for the current step."""\r\n    global caches\r\n    # write your code here\r\n    if terminated:\r\n        return reward + 1\r\n    else:\r\n        return reward + 0\r\n',
          hooks: "[]",
        });
      } else if (type === "simenv") {
        this.task!.simenvs.unshift({
          id: -1,
          desc: "",
          create_time: timestamp,
          update_time: timestamp,
          task: this.task!.task.id,
          server: "",
          name: "",
          args: "{}",
        });
      } else {
        throw new Error(`Unknown service type ${type}`);
      }
      this.setSaved(false);
    },
    delService(type: "agent" | "simenv", index: number) {
      if (type === "agent") {
        this.task!.agents.splice(index, 1);
      } else if (type === "simenv") {
        this.task!.simenvs.splice(index, 1);
      } else {
        throw new Error(`Unknown service type ${type}`);
      }
      this.setSaved(false);
    },
  },
});
