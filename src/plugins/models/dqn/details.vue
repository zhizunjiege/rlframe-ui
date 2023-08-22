<template>
  <q-scroll-area v-if="valid" class="fit">
    <q-markup-table flat separator="horizontal" class="overflow-auto ui-table">
      <tbody>
        <tr>
          <td>训练局数</td>
          <td>{{ props.details.status.episode }}</td>
          <td>单局奖励</td>
          <td>{{ props.details.status.episode_rewards }}</td>
        </tr>
        <tr>
          <td>推理次数</td>
          <td>{{ props.details.status.react_steps }}</td>
          <td>训练次数</td>
          <td>{{ props.details.status.train_steps }}</td>
        </tr>
        <tr>
          <td>随机概率</td>
          <td>{{ props.details.status.epsilon }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-scroll-area>
  <div v-else class="fit flex flex-center">
    <h4 class="text-secondary text-weight-bold">暂无数据</h4>
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from "~/utils";

const props = defineProps<{
  details: {
    status: {
      training: boolean;
      episode: number;
      episode_rewards: number;
      epsilon: number;
      react_steps: number;
      train_steps: number;
      graph_exported: boolean;
    };
  };
}>();

const valid = computed(
  () => !isEmpty(props.details) && props.details.status.training
);
</script>

<style scoped lang="scss"></style>
