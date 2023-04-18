<template>
  <q-input
    v-model="hypersStr"
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
import hypersSchema from "./schema.json";
import { AgentTable } from "~/api";
import { isEmpty, deepCopy } from "~/utils";

const $q = useQuasar();
const ajv = new Ajv();
const validate = ajv.compile(hypersSchema);

const props = defineProps<{
  configs: AgentTable["hypers"];
}>();
const emits = defineEmits<{
  (event: "update:configs", configs: AgentTable["hypers"]): void;
}>();

let hypers = {} as AgentTable["hypers"];
if (isEmpty(props.configs)) {
  hypers = {
    obs_dim: 4,
    act_num: 2,
    hidden_layers: [64, 64],
    lr: 0.001,
    gamma: 0.95,
    replay_size: 10000,
    batch_size: 32,
    epsilon_max: 1.0,
    epsilon_min: 0.01,
    epsilon_decay: 0.9999,
    start_steps: 0,
    update_after: 200,
    update_online_every: 1,
    update_target_every: 200,
    seed: null,
  };
} else {
  hypers = deepCopy(props.configs);
}

const hypersStr = ref("");

hypersStr.value = JSON.stringify(hypers, null, 4);

function onBlur() {
  try {
    hypers = JSON.parse(hypersStr.value);
    const valid = validate(hypers);
    if (valid) {
      emits("update:configs", hypers);
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
