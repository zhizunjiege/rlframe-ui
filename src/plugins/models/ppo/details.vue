<template>
  <q-scroll-area v-if="!isEmpty(props.details)" class="fit">
    <q-markup-table flat separator="horizontal" class="overflow-auto ui-table">
      <tbody>
        <tr>
          <td>是否训练</td>
          <td class="ellipsis">{{ props.details.training }}</td>
        </tr>
        <tr>
          <td>推理次数</td>
          <td class="ellipsis">{{ props.details.react_steps }}</td>
        </tr>
        <tr>
          <td>策略网络训练次数</td>
          <td class="ellipsis">{{ props.details.train_pi_steps }}</td>
        </tr>
        <tr>
          <td>价值网络训练次数</td>
          <td class="ellipsis">{{ props.details.train_vf_steps }}</td>
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
    training: boolean;
    react_steps: number;
    train_pi_steps: number;
    train_vf_steps: number;
  };
}>();
</script>

<style scoped lang="scss"></style>
