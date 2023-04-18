<template>
  <q-card
    v-if="taskStore.task"
    flat
    class="q-mx-auto q-pt-xl transparent ui-card"
  >
    <q-card-section class="flex justify-between">
      <q-btn
        label="添加服务"
        icon="bi-plus"
        class="q-px-md bg-secondary text-subtitle1 ui-services-btn"
        @click="addService()"
      />
      <q-btn
        :disable="selectedService.length === 0"
        label="删除服务"
        icon="bi-x"
        class="q-px-md bg-secondary text-subtitle1 ui-services-btn"
        @click="delService()"
      />
    </q-card-section>
    <q-card-section v-for="(value, key) in taskStore.task.services" :key="key">
      <q-expansion-item
        expand-separator
        :label="key as string"
        group="services"
        header-class="bg-secondary"
      >
        <template #header>
          <q-item-section avatar>
            <q-checkbox v-model="selectedService" :val="key" size="md" />
          </q-item-section>
          <q-item-section> {{ key }} </q-item-section>
        </template>
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>服务类型</td>
              <td>
                <q-select
                  v-model="value.infos.type"
                  :options="serviceTypes"
                  dense
                  emit-value
                  map-options
                  standout="bg-ignore"
                  input-class="text-foreground"
                  popup-content-class="shadow-0 bg-secondary"
                  options-selected-class="text-accent"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>服务名称</td>
              <td>
                <q-input
                  v-model.lazy="value.infos.name"
                  dense
                  standout="bg-ignore"
                  input-class="text-foreground"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>服务主机</td>
              <td>
                <q-input
                  v-model.lazy="value.infos.host"
                  dense
                  standout="bg-ignore"
                  input-class="text-foreground"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>服务端口</td>
              <td>
                <q-input
                  v-model.lazy="value.infos.port"
                  dense
                  type="number"
                  standout="bg-ignore"
                  input-class="text-foreground"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>服务描述</td>
              <td>
                <q-input
                  v-model="value.infos.desc"
                  dense
                  autogrow
                  clearable
                  type="textarea"
                  standout="bg-ignore"
                  input-class="text-foreground"
                  class="ui-input"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-item-section class="q-my-sm" />
        <template v-if="value.infos.type === 'simenv'">
          <q-markup-table flat separator="horizontal" class="ui-table">
            <tbody>
              <tr>
                <td>引擎类型</td>
                <td>
                  <q-select
                    v-model="value.configs.type"
                    :disable="!value.infos.type"
                    :options="simEngines"
                    dense
                    standout="bg-ignore"
                    input-class="text-foreground"
                    popup-content-class="shadow-0 bg-secondary"
                    options-selected-class="text-accent"
                    class="ui-input"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
          <q-item-section class="q-my-sm" />
          <q-expansion-item
            :group="key as string"
            label="引擎参数"
            header-class="q-px-lg bg-secondary text-subtitle2"
          >
            <component
              :is="getAsyncComp(value.infos.type, value.configs.type)"
              v-model:configs="(value.configs as SimenvTable).args"
            />
          </q-expansion-item>
        </template>
        <template v-else-if="value.infos.type === 'agent'">
          <q-markup-table flat separator="horizontal" class="ui-table">
            <tbody>
              <tr>
                <td>算法类型</td>
                <td>
                  <q-select
                    v-model="value.configs.type"
                    :disable="!value.infos.type"
                    :options="rlModels"
                    dense
                    standout="bg-ignore"
                    input-class="text-foreground"
                    popup-content-class="shadow-0 bg-secondary"
                    options-selected-class="text-accent"
                    class="ui-input"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
          <q-item-section class="q-my-sm" />
          <q-expansion-item
            :group="key as string"
            label="算法参数"
            header-class="q-px-lg bg-secondary text-subtitle2"
          >
            <component
              :is="getAsyncComp(value.infos.type, value.configs.type)"
              v-model:configs="(value.configs as AgentTable).hypers"
            />
          </q-expansion-item>
          <q-item-section class="q-my-sm" />
          <q-expansion-item
            :group="key as string"
            label="状态-输入预处理函数"
            header-class="q-px-lg bg-secondary text-subtitle2"
          >
            <q-input
              v-model="(value.configs as AgentTable).sifunc"
              dense
              autogrow
              type="textarea"
              standout="bg-ignore"
              input-class="text-foreground q-px-md"
              class="full-width"
            />
          </q-expansion-item>
          <q-item-section class="q-my-sm" />
          <q-expansion-item
            :group="key as string"
            label="输出-动作后处理函数"
            header-class="q-px-lg bg-secondary text-subtitle2"
          >
            <q-input
              v-model="(value.configs as AgentTable).oafunc"
              dense
              autogrow
              type="textarea"
              standout="bg-ignore"
              input-class="text-foreground q-px-md"
              class="full-width"
            />
          </q-expansion-item>
          <q-item-section class="q-my-sm" />
          <q-expansion-item
            :group="key as string"
            label="奖励函数"
            header-class="q-px-lg bg-secondary text-subtitle2"
          >
            <q-input
              v-model="(value.configs as AgentTable).rewfunc"
              dense
              autogrow
              type="textarea"
              standout="bg-ignore"
              input-class="text-foreground q-px-md"
              class="full-width"
            />
          </q-expansion-item>
        </template>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { AgentTable, SimenvTable } from "~/api";
import { useTaskStore } from "~/stores";
import { randomString } from "~/utils";

const $q = useQuasar();
const router = useRouter();
const taskStore = useTaskStore();

if (!taskStore.task) {
  $q.notify({
    type: "warning",
    message: "暂无任务",
  });
  router.push("/home");
}

// service types
const serviceTypes = ref([
  { label: "仿真服务", value: "simenv" },
  { label: "智能服务", value: "agent" },
]);

// sim engines
const simEngines = ref(["CQSIM"]);

// rl models
const rlModels = ref([
  "DQN",
  "DoubleDQN",
  "PPO",
  "DDPG",
  "QMIX",
  "MADDPG",
  "IPPO",
]);

function getAsyncComp(type1: string, type2: string) {
  return defineAsyncComponent(
    () =>
      import(`../../../plugins/${type1}s/${type2.toLowerCase()}/configs.vue`)
  );
}
// add a service
function addService(type = "") {
  let service: NonNullable<typeof taskStore.task>["services"][string];
  if (type === "simenv") {
    service = {
      infos: {
        type: "simenv",
        name: "仿真服务",
        host: "localhost",
        port: 10001,
        desc: "仿真服务",
      },
      configs: {
        id: -1,
        name: "仿真服务配置",
        description: "",
        create_time: "",
        update_time: "",
        type: simEngines.value[0],
        args: {},
        params: {},
      },
    };
  } else if (type === "agent") {
    service = {
      infos: {
        type: "agent",
        name: "智能服务",
        host: "localhost",
        port: 10002,
        desc: "智能服务",
      },
      configs: {
        id: -1,
        name: "智能服务配置",
        description: "",
        create_time: "",
        update_time: "",
        training: true,
        type: rlModels.value[0],
        hypers: {},
        sifunc:
          'import math\nfrom typing import Any, Dict, List\n\nimport numpy as np\n\n\ndef func(states: Dict[str, List[Dict[str, Any]]]) -> np.ndarray | Dict[str | int, np.ndarray]:\n    """Convert `states` to `inputs` for model inferecing."""\n    global caches\n    example = states[\'model\'][0]\n    return np.array([example[\'param\']])\n',
        oafunc:
          'from typing import Any, Dict, List\n\nimport numpy as np\n\n\ndef func(outputs: np.ndarray | Dict[str | int, np.ndarray]) -> Dict[str, List[Dict[str, Any]]]:\n    """Convert `outputs` to `actions` for model simulation."""\n    global caches\n    return {\n        \'model\': [{\n            \'param\': 0,\n        }],\n    }\n',
        rewfunc:
          'from typing import Any, Dict, List\n\nimport numpy as np\n\n\ndef func(\n    states: Dict[str, List[Dict[str, Any]]],\n    inputs: np.ndarray | Dict[str | int, np.ndarray],\n    actions: Dict[str, List[Dict[str, Any]]],\n    outputs: np.ndarray | Dict[str | int, np.ndarray],\n    next_states: Dict[str, List[Dict[str, Any]]],\n    next_inputs: np.ndarray | Dict[str | int, np.ndarray],\n    terminated: bool,\n    truncated: bool,\n) -> float | Dict[str | int, float]:\n    """Calculate the reward for the current step."""\n    if terminated:\n        return 1.0\n    else:\n        return 0.0\n',
      },
    };
  } else {
    service = {
      infos: {
        type: "",
        name: "",
        host: "",
        port: -1,
        desc: "",
      },
      configs: {} as SimenvTable | AgentTable,
    };
  }
  const id = randomString(8);
  taskStore.task!.services[`service-${id}`] = service;
}

// selected service
const selectedService = ref([] as string[]);

// del services
function delService() {
  $q.dialog({
    title: "提示",
    message: "确认删除选择的服务？",
    cancel: true,
    persistent: true,
    class: "bg-secondary",
  }).onOk(async () => {
    selectedService.value.forEach((key) => {
      delete taskStore.task!.services[key];
    });
    selectedService.value = [];
  });
}

if (taskStore.task) {
  if (Object.keys(taskStore.task.services).length === 0) {
    addService("simenv");
    addService("agent");
  }
}
</script>

<style scoped lang="scss">
.ui-services-btn {
  width: 25%;
}
</style>
