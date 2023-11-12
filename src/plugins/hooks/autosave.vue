<template>
  <tr>
    <td>每N步</td>
    <td>
      <q-input
        v-model.number="args.per_steps"
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
    <td>每M局</td>
    <td>
      <q-input
        v-model.number="args.per_episodes"
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
    <td>保存权重</td>
    <td>
      <q-checkbox
        v-model="args.save_weights"
        class="float-right"
        @blur="update"
      />
    </td>
  </tr>
  <tr>
    <td>保存经验</td>
    <td>
      <q-checkbox
        v-model="args.save_buffer"
        class="float-right"
        @blur="update"
      />
    </td>
  </tr>
  <tr>
    <td>保存状态</td>
    <td>
      <q-checkbox
        v-model="args.save_status"
        class="float-right"
        @blur="update"
      />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { deepCopy, isEmpty } from "~/utils";

type AutoSaveArgs = {
  per_steps: number;
  per_episodes: number;
  save_weights: boolean;
  save_buffer: boolean;
  save_status: boolean;
};

const props = defineProps<{
  modelValue: AutoSaveArgs;
}>();
const emits = defineEmits<{
  (event: "update:modelValue", modelValue: AutoSaveArgs): void;
}>();

const args = ref<AutoSaveArgs>({
  per_steps: 10000,
  per_episodes: 100,
  save_weights: true,
  save_buffer: false,
  save_status: false,
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
