<template>
  <form ref="form" @change.capture="submit">
    <q-card flat class="full-width transparent">
      <q-card-section>
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>控制服务地址</td>
              <td>
                <q-input
                  v-model="args.ctrl_addr"
                  dense
                  filled
                  required
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>资源服务地址</td>
              <td>
                <q-input
                  v-model="args.res_addr"
                  dense
                  filled
                  required
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>资源服务令牌</td>
              <td>
                <q-input
                  v-model="args.x_token"
                  dense
                  filled
                  required
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>代理模型标识</td>
              <td>
                <q-input
                  v-model="args.proxy_id"
                  dense
                  filled
                  required
                  minlength="36"
                  maxlength="36"
                  mask="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  class="ui-input"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-section>
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>
                <q-btn-toggle
                  v-model="inScenario"
                  :options="[
                    { label: '仿真想定', value: true },
                    { label: '实验设计', value: false },
                  ]"
                  toggle-color="secondary"
                  toggle-text-color="accent"
                  @update:model-value="reset"
                />
              </td>
              <td>
                <q-select
                  v-if="inScenario"
                  v-model.number="args.scenario_id"
                  :options="scenarios"
                  :disable="!args.res_addr || !args.x_token"
                  dense
                  filled
                  required
                  emit-value
                  map-options
                  options-dense
                  option-value="id"
                  option-label="name"
                  :display-value="args.scenario_id"
                  popup-content-class="bg-secondary"
                  class="ui-input"
                  @update:model-value="parseModels"
                />
                <q-select
                  v-else
                  v-model.number="args.exp_design_id"
                  :options="expdesigns"
                  :disable="!args.res_addr || !args.x_token"
                  dense
                  filled
                  required
                  emit-value
                  map-options
                  options-dense
                  option-value="id"
                  option-label="name"
                  :display-value="args.exp_design_id"
                  popup-content-class="bg-secondary"
                  class="ui-input"
                  @update:model-value="parseModels"
                />
              </td>
            </tr>
            <tr>
              <td>{{ inScenario ? "仿真想定" : "实验设计" }}重复次数</td>
              <td>
                <q-input
                  v-model.number="args.repeat_times"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>仿真开始时间（时间戳/毫秒）</td>
              <td>
                <q-input
                  :model-value="getTimestampString(args.sim_start_time, false)"
                  dense
                  filled
                  required
                  mask="####-##-## ##:##:##"
                  class="ui-input"
                  @blur="
                    args.sim_start_time = getTimestampNumber(
                      ($event.target as HTMLInputElement).value,
                      false
                    )
                  "
                />
              </td>
            </tr>
            <tr>
              <td>仿真持续时长（时:分:秒）</td>
              <td>
                <q-input
                  :model-value="getDurationString(args.sim_duration * 1000)"
                  dense
                  filled
                  required
                  mask="##:##:##"
                  class="ui-input"
                  @blur="
                    args.sim_duration =
                      getDurationNumber(
                        ($event.target as HTMLInputElement).value
                      ) / 1000
                  "
                />
              </td>
            </tr>
            <tr>
              <td>仿真步长（毫秒）</td>
              <td>
                <q-input
                  v-model.number="args.time_step"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>仿真倍速</td>
              <td>
                <q-input
                  v-model.number="args.speed_ratio"
                  dense
                  filled
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  class="ui-input"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-section v-if="!isEmpty(models)">
        <p class="text-center">仿真数据配置</p>
        <q-btn
          flat
          dense
          icon="bi-plus-circle"
          class="full-width bg-secondary ui-clickable"
          @click="
            args.data.unshift({
              name: '',
              modelid: '',
              inputs: [],
              outputs: [],
            })
          "
        />
        <q-markup-table
          v-for="(item, index) in args.data"
          :key="index"
          flat
          separator="horizontal"
          class="q-mt-sm ui-table"
        >
          <tbody>
            <tr>
              <td>模型名称</td>
              <td>
                <q-select
                  v-model="item.name"
                  :options="modelOptions"
                  dense
                  filled
                  required
                  emit-value
                  map-options
                  options-dense
                  option-value="name"
                  option-label="name"
                  popup-content-class="bg-secondary"
                  class="ui-input"
                  @update:model-value="item.modelid = models[item.name].modelid"
                />
              </td>
            </tr>
            <tr>
              <td>模型标识</td>
              <td>
                <q-input
                  v-model="item.modelid"
                  dense
                  filled
                  disable
                  required
                  class="ui-input"
                />
              </td>
            </tr>
            <tr v-if="item.name">
              <td>模型输出</td>
              <td>
                <q-select
                  v-model="item.outputs"
                  :options="models[item.name].outputs"
                  dense
                  filled
                  multiple
                  options-dense
                  popup-content-class="bg-secondary"
                  :display-value="`已选择 ${item.outputs.length} 项`"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr v-if="item.name">
              <td>模型输入</td>
              <td>
                <q-select
                  v-model="item.inputs"
                  :options="models[item.name].inputs"
                  dense
                  filled
                  multiple
                  options-dense
                  popup-content-class="bg-secondary"
                  :display-value="`已选择 ${item.inputs.length} 项`"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>删除配置</td>
              <td>
                <q-btn
                  flat
                  dense
                  icon="bi-x-circle"
                  class="bg-secondary ui-input ui-clickable"
                  @click="args.data.splice(index, 1)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-section v-if="args.data.length > 0">
        <p class="text-center">仿真路由配置</p>
        <q-btn
          flat
          dense
          icon="bi-plus-circle"
          class="full-width bg-secondary ui-clickable"
          @click="args.routes.unshift({ addr: '', models: [] })"
        />
        <q-markup-table
          v-for="(item, index) in args.routes"
          :key="index"
          flat
          separator="horizontal"
          class="q-mt-sm ui-table"
        >
          <tbody>
            <tr>
              <td>路由地址</td>
              <td>
                <q-input
                  v-model="item.addr"
                  dense
                  filled
                  required
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>绑定模型列表</td>
              <td>
                <q-select
                  v-model="item.models"
                  :options="args.data"
                  dense
                  filled
                  required
                  multiple
                  emit-value
                  map-options
                  options-dense
                  option-value="name"
                  option-label="name"
                  popup-content-class="bg-secondary"
                  :display-value="`已选择 ${item.models.length} 项`"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>删除配置</td>
              <td>
                <q-btn
                  flat
                  dense
                  icon="bi-x-circle"
                  class="bg-secondary ui-input ui-clickable"
                  @click="args.routes.splice(index, 1)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-section>
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>仿真服务地址</td>
              <td>
                <q-input
                  v-model="args.simenv_addr"
                  dense
                  filled
                  required
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>仿真决策比</td>
              <td>
                <q-input
                  v-model.number="args.sim_step_ratio"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>仿真结束判断函数</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="full-width ui-editor">
                  <monaco-editor
                    v-model="args.sim_term_func"
                    language="cpp"
                    @update:model-value="submit"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </form>
</template>

<script setup lang="ts">
import {
  offset,
  getDurationString,
  getDurationNumber,
  getTimestampString,
  getTimestampNumber,
  isEmpty,
} from "~/utils";
import {
  getScenarioList,
  getExpDesignList,
  getScenarioFile,
  scenarioXml2Obj,
  getModels,
} from "./api";

type Entity = {
  name: string;
  modelid: string;
  inputs: string[];
  outputs: string[];
};
type Route = {
  addr: string;
  models: string[];
};
type CQSIMArgs = {
  ctrl_addr: string;
  res_addr: string;
  x_token: string;
  proxy_id: string;
  scenario_id: number;
  exp_design_id: number;
  repeat_times: number;
  sim_start_time: number;
  sim_duration: number;
  time_step: number;
  speed_ratio: number;
  data: Entity[];
  routes: Route[];
  simenv_addr: string;
  sim_step_ratio: number;
  sim_term_func: string;
};

const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (event: "update:modelValue", modelValue: string): void;
}>();

const args = ref<CQSIMArgs>({
  ctrl_addr: "localhost:50041",
  res_addr: "localhost:8001",
  x_token:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhc2NvcGUiOiIiLCJleHAiOjQ4MTAxOTcxNTQsImlkZW50aXR5IjoxLCJuaWNlIjoiYWRtaW4iLCJvcmlnX2lhdCI6MTY1NjU2MTE1NCwicm9sZWlkIjoxLCJyb2xla2V5IjoiYWRtaW4iLCJyb2xlbmFtZSI6Iuezu-e7n-euoeeQhuWRmCJ9.BvjGw26L1vbWHwl0n8Y1_yTF-fiFNZNmIw20iYe7ToU",
  proxy_id: "",
  scenario_id: 0,
  exp_design_id: 0,
  repeat_times: 1,
  sim_start_time: Date.now() - offset,
  sim_duration: 60,
  time_step: 50,
  speed_ratio: 1,
  data: [],
  routes: [],
  simenv_addr: "localhost:10001",
  sim_step_ratio: 1,
  sim_term_func:
    "#include <any>\r\n#include <cmath>\r\n#include <string>\r\n#include <unordered_map>\r\n#include <vector>\r\n\r\n/*\r\n * This function is called in every simulation step with a map of states, where the key is the name of the model and the value is a vector of entities.\r\n * Each entity in the vector represents a sets of output params, and the key is the name of the param and the value is wrapped in std::any.\r\n * The function should return `true` if the simulation should be terminated.\r\n */\r\nbool func(std::unordered_map<std::string, std::vector<std::unordered_map<std::string, std::any>>> &states)\r\n{\r\n  // write your code here\r\n  return false;\r\n}\r\n",
});

const $q = useQuasar();

const inScenario = ref(true);

const scenarios = ref([] as Awaited<ReturnType<typeof getScenarioList>>);
const expdesigns = ref([] as Awaited<ReturnType<typeof getExpDesignList>>);

const models = ref({} as Record<string, Entity>);
const modelOptions = computed(() => Object.values(models.value));

function reset(value: boolean) {
  if (value) {
    args.value.exp_design_id = 0;
  } else {
    args.value.scenario_id = 0;
  }
  models.value = {};
  args.value.data = [];
  args.value.routes = [];
}

async function parseModels(id: number) {
  try {
    models.value = {};

    if (!inScenario.value) {
      const expdesign = expdesigns.value.find((item) => item.id === id);
      id = expdesign!.scenarioId;
    }
    const scenario = await getScenarioFile(
      args.value.res_addr,
      args.value.x_token,
      id
    );
    const obj = scenarioXml2Obj(scenario);

    const record = {} as Record<string, Entity>;
    for (const item of obj.entities) {
      if (item.modelID in record || item.modelID === args.value.proxy_id) {
        continue;
      }
      const model = {
        name: item.name,
        modelid: item.modelID,
        inputs: item.parameters
          .filter((item) => item.usage.includes("input"))
          .map((item) => item.name),
        outputs: item.parameters
          .filter((item) => item.usage.includes("output"))
          .map((item) => item.name),
      };
      record[item.modelID] = model;
    }

    const tmpModels = await getModels(
      args.value.res_addr,
      args.value.x_token,
      Object.keys(record)
    );
    for (const item of tmpModels) {
      record[item.id].name = item.name;
      models.value[item.name] = record[item.id];
    }
  } catch (e) {
    if (e instanceof Error) {
      $q.notify({
        type: "negative",
        message: e.message,
      });
    }
    console.log(e);
  }
}

const form = ref<Nullable<HTMLFormElement>>(null);
function submit() {
  if (!form.value!.reportValidity()) {
    return;
  }
  update();
}
function update() {
  emits("update:modelValue", JSON.stringify(args.value));
}

(async () => {
  try {
    scenarios.value = await getScenarioList(
      args.value.res_addr,
      args.value.x_token
    );
    expdesigns.value = await getExpDesignList(
      args.value.res_addr,
      args.value.x_token
    );
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "获取仿真想定和实验设计失败，请检查CQSIM引擎是否正常运行",
    });
    console.log(e);
  }

  if (props.modelValue && props.modelValue !== "{}") {
    args.value = JSON.parse(props.modelValue);
    if (args.value.scenario_id > 0) {
      inScenario.value = true;
      await parseModels(args.value.scenario_id);
    } else if (args.value.exp_design_id > 0) {
      inScenario.value = false;
      await parseModels(args.value.exp_design_id);
    }
  } else {
    update();
  }
})();
</script>

<style scoped lang="scss"></style>
