<template>
  <q-input
    v-model="argsStr"
    dense
    autogrow
    type="textarea"
    standout="bg-ignore"
    input-class="text-foreground q-px-md"
    class="full-width"
    @blur="onBlur"
  />
  <q-input
    v-model="simTermFunc"
    dense
    autogrow
    type="textarea"
    standout="bg-ignore"
    input-class="text-foreground q-px-md"
    class="full-width"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
import Ajv from "ajv";
import argsSchema from "./schema.json";
import { SimenvTable } from "~/api";
import { isEmpty, deepCopy } from "~/utils";

const $q = useQuasar();
const ajv = new Ajv();
const validate = ajv.compile(argsSchema);

const props = defineProps<{
  configs: SimenvTable["args"];
}>();
const emits = defineEmits<{
  (event: "update:configs", configs: SimenvTable["args"]): void;
}>();

let args = {} as SimenvTable["args"];
if (isEmpty(props.configs)) {
  args = {
    platform: {
      ctrl_addr: "127.0.0.1:50041",
      res_addr: "127.0.0.1:8001",
      x_token:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhc2NvcGUiOiIiLCJleHAiOjQ4MTAxOTcxNTQsImlkZW50aXR5IjoxLCJuaWNlIjoiYWRtaW4iLCJvcmlnX2lhdCI6MTY1NjU2MTE1NCwicm9sZWlkIjoxLCJyb2xla2V5IjoiYWRtaW4iLCJyb2xlbmFtZSI6Iuezu-e7n-euoeeQhuWRmCJ9.BvjGw26L1vbWHwl0n8Y1_yTF-fiFNZNmIw20iYe7ToU",
      proxy_id: "b0547a7a-472b-4773-89d3-d1bf50199d9d",
    },
    task: {
      scenario_id: 0,
      repeat_times: 1,
      sim_start_time: 0,
      sim_duration: 1,
      time_step: 50,
      speed_ratio: 1,
    },
    proxy: {
      data: {
        model: {
          id: "",
          inputs: ["param"],
          outputs: ["param"],
        },
      },
      routes: {
        "127.0.0.1:10002": ["model"],
      },
      simenv_addr: "127.0.0.1:10001",
      sim_step_ratio: 1,
      sim_term_func:
        '#include <any>\n#include <cmath>\n#include <string>\n#include <unordered_map>\n#include <vector>\n\n/*\n * This function is called in every simulation step with a map of states, where the key is the name of the model and the value is a vector of entities.\n * Each entity in the vector represents a sets of output params, and the key is the name of the param and the value is wrapped in std::any.\n * The function should return `true` if the simulation should be terminated.\n */\nbool func(std::unordered_map<std::string, std::vector<std::unordered_map<std::string, std::any>>> &states)\n{\n  auto &uav = states["example_uav"][0];\n  auto &sub = states["example_sub"][0];\n  auto uav_lon = std::any_cast<double>(uav["longitude"]);\n  auto uav_lat = std::any_cast<double>(uav["latitude"]);\n  auto sub_lon = std::any_cast<double>(sub["longitude"]);\n  auto sub_lat = std::any_cast<double>(sub["latitude"]);\n  auto dist = std::sqrt(std::pow(uav_lon - sub_lon, 2) + std::pow(uav_lat - sub_lat, 2));\n  return dist <= 0.1;\n}\n',
    },
  };
} else {
  args = deepCopy(props.configs);
}

const argsStr = ref("");
const simTermFunc = ref("");

simTermFunc.value = args.proxy.sim_term_func;
args.proxy.sim_term_func = "";
argsStr.value = JSON.stringify(args, null, 4);

function onBlur() {
  try {
    args = JSON.parse(argsStr.value);
    args.proxy.sim_term_func = simTermFunc.value;
    const valid = validate(args);
    if (valid) {
      emits("update:configs", args);
    } else {
      const err = validate.errors
        ?.map((e) => `${e.instancePath} ${e.message}`)
        .join("\n");
      $q.notify({
        type: "negative",
        message: "配置参数验证失败：" + err,
      });
      console.error(err);
    }
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "配置参数不是正确的json格式",
    });
    console.error(e);
  }
}
</script>

<style scoped lang="scss"></style>
