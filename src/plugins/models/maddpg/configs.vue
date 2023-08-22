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
  import { AgentTable } from "~/api";
  import { isEmpty, deepCopy } from "~/utils";
  import hypersSchema from "./schema.json";
  
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
        "agent_num": 4,
        "obs_dim": 8,
        "act_dim": 1,
        "hidden_layers_actor": [
            64,
            64
        ],
        "hidden_layers_critic": [
            64,
            64
        ],
        "lr_actor": 0.0001,
        "lr_critic": 0.001,
        "gamma": 0.98,
        "tau": 0.001,
        "replay_size": 200000,
        "batch_size": 64,
        "noise_type": "normal",
        "noise_sigma": 0.2,
        "noise_max": 1.0,
        "noise_min": 0.1,
        "noise_decay": 0.99999,
        "update_after": 200,
        "update_online_every": 1,
        "seed": 624,
        "dtype": "float32"
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
  