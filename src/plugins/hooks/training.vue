<template>
  <tr>
    <td>切换频率</td>
    <td>
      <q-input
        v-model.number="args.test_policy_every"
        dense
        filled
        type="number"
        required
        min="1"
        class="ui-input"
        @blur="update"
      />
    </td>
  </tr>
  <tr>
    <td>测试局数</td>
    <td>
      <q-input
        v-model.number="args.test_policy_total"
        dense
        filled
        type="number"
        required
        min="1"
        class="ui-input"
        @blur="update"
      />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { deepCopy, isEmpty } from "~/utils";

type TrainingArgs = {
  test_policy_every: number;
  test_policy_total: number;
};

const props = defineProps<{
  modelValue: TrainingArgs;
}>();
const emits = defineEmits<{
  (event: "update:modelValue", modelValue: TrainingArgs): void;
}>();

const args = ref<TrainingArgs>({
  test_policy_every: 10,
  test_policy_total: 2,
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
