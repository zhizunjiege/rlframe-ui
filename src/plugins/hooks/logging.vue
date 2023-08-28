<template>
  <tr>
    <td>日志等级</td>
    <td>
      <q-select
        v-model="args.loglvl"
        :options="['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']"
        dense
        filled
        required
        options-dense
        popup-content-class="bg-secondary"
        class="ui-input"
        @blur="update"
      />
    </td>
  </tr>
  <tr>
    <td>输出到终端和文件</td>
    <td>
      <q-checkbox v-model="args.terminal" class="float-right" @blur="update" />
    </td>
  </tr>
  <tr>
    <td>输出到Tensorboard</td>
    <td>
      <q-checkbox
        v-model="args.tensorboard"
        class="float-right"
        @blur="update"
      />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { deepCopy, isEmpty } from "~/utils";

type LoggingArgs = {
  loglvl: string;
  terminal: boolean;
  tensorboard: boolean;
};

const props = defineProps<{
  modelValue: LoggingArgs;
}>();
const emits = defineEmits<{
  (event: "update:modelValue", modelValue: LoggingArgs): void;
}>();

const args = ref<LoggingArgs>({
  loglvl: "INFO",
  terminal: true,
  tensorboard: true,
});

function update() {
  emits("update:modelValue", args.value);
}

if (props.modelValue && !isEmpty(props.modelValue)) {
  args.value = deepCopy(props.modelValue);
} else {
  update();
}
</script>

<style scoped lang="scss"></style>
