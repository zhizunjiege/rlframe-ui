<template>
  <q-card
    v-if="taskStore.task"
    flat
    class="q-mx-auto q-pt-xl transparent ui-task-card"
  >
    <q-card-section class="flex justify-between">
      <q-btn
        label="添加服务"
        icon="bi-plus"
        class="q-px-xl bg-secondary text-subtitle1 ui-btn"
        @click="addService()"
      />
      <q-btn
        :disable="selectedService.length === 0"
        label="删除服务"
        icon="bi-x"
        class="q-px-xl bg-secondary text-subtitle1 ui-btn"
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
        <q-markup-table flat separator="horizontal" class="ui-task-table">
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
                  class="ui-task-input"
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
                  class="ui-task-input"
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
                  class="ui-task-input"
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
                  class="ui-task-input"
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
                  class="ui-task-input"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-item-section class="q-my-sm" />
        <q-markup-table flat separator="horizontal" class="ui-task-table">
          <tbody>
            <tr>
              <td>配置方式</td>
              <td>
                <q-btn-toggle
                  v-model="modeRecords[key]"
                  spread
                  :options="configModes"
                  toggle-color="secondary"
                  toggle-text-color="accent"
                  class="ui-task-input"
                />
              </td>
            </tr>
            <tr v-if="modeRecords[key] === 'manual'">
              <td>智能生成</td>
              <td>
                <q-select
                  v-model="value.configs.type"
                  :disable="!value.infos.type"
                  :options="
                    value.infos.type === 'simenv'
                      ? simEngines
                      : value.infos.type === 'agent'
                      ? rlModels
                      : []
                  "
                  dense
                  standout="bg-ignore"
                  input-class="text-foreground"
                  popup-content-class="shadow-0 bg-secondary"
                  options-selected-class="text-accent"
                  class="ui-task-input"
                >
                  <template #after>
                    <q-btn
                      :disable="!value.infos.type"
                      round
                      dense
                      flat
                      icon="bi-send"
                      class="ui-icon"
                      @click="generateConfigs(key)"
                    >
                      <q-tooltip anchor="top right" self="top left">
                        确认
                      </q-tooltip>
                    </q-btn>
                  </template>
                </q-select>
              </td>
            </tr>
            <tr v-else-if="modeRecords[key] === 'reuse'">
              <td>配置选择</td>
              <td>
                <!-- TODO: use database rows to init -->
                <q-select
                  v-model="value.configs.type"
                  :disable="!value.infos.type"
                  :options="
                    value.infos.type === 'simenv'
                      ? simEngines
                      : value.infos.type === 'agent'
                      ? rlModels
                      : []
                  "
                  dense
                  standout="bg-ignore"
                  input-class="text-foreground"
                  popup-content-class="shadow-0 bg-secondary"
                  options-selected-class="text-accent"
                  class="ui-task-input"
                >
                  <template #after>
                    <q-btn
                      :disable="!value.infos.type"
                      round
                      dense
                      flat
                      icon="bi-send"
                      class="ui-icon"
                      @click="generateConfigs(key)"
                    >
                      <q-tooltip anchor="top right" self="top left">
                        确认
                      </q-tooltip>
                    </q-btn>
                  </template>
                </q-select>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-item-section class="q-my-sm" />
        <!-- <component :is="import(`~/plugins/${value.infos.type}s/${}.vue`)" /> -->
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

// service config mode
const configModes = ref([
  { label: "手动配置", value: "manual" },
  { label: "重用配置", value: "reuse" },
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

// config mode records
const modeRecords = reactive({} as Record<string, Nullable<string>>);

// generate service configs
function generateConfigs(id: string | number) {
  console.log(id);
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
      configs: {} as SimenvTable,
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
      configs: {} as AgentTable,
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
  modeRecords[`service-${id}`] = null;
}

// selected service
const selectedService = ref([] as string[]);

// del services
function delService() {
  selectedService.value.forEach((key) => {
    delete taskStore.task!.services[key];
    delete modeRecords[key];
  });
  selectedService.value = [];
}

// async components
// const comp = import(`~/plugins/${}s/${}.vue`);

if (taskStore.task) {
  if (Object.keys(taskStore.task.services).length === 0) {
    addService("simenv");
    addService("agent");
  }
}
</script>

<style scoped lang="scss">
.ui-btn {
  width: 25%;
}
</style>
