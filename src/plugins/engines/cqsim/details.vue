<template>
  <q-scroll-area v-if="valid" class="fit">
    <q-markup-table flat separator="horizontal" class="overflow-auto ui-table">
      <tbody>
        <tr>
          <td>当前仿真时间</td>
          <td>
            {{ getTimeString(props.details.data.sim_current_time * 1000) }}
          </td>
          <td>仿真运行时长</td>
          <td>{{ getDurationString(props.details.data.sim_duration) }}</td>
        </tr>
        <tr>
          <td>仿真步长（ms）</td>
          <td>{{ props.details.data.sim_time_step }}</td>
          <td>仿真倍速</td>
          <td>{{ props.details.data.speed_ratio }}</td>
        </tr>
        <tr>
          <td>实验设计样本ID</td>
          <td>{{ props.details.data.current_sample_id }}</td>
          <td>仿真重复次数</td>
          <td>{{ props.details.data.current_repeat_time }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-scroll-area>
  <div v-else class="fit flex flex-center">
    <h4 class="text-secondary text-weight-bold">暂无数据</h4>
  </div>
</template>

<script setup lang="ts">
import { isEmpty, getTimeString, getDurationString } from "~/utils";

const props = defineProps<{
  details: {
    state: string;
    data: {
      sim_current_time: number;
      sim_duration: number;
      real_duration: number;
      sim_time_step: number;
      speed_ratio: number;
      real_speed_ratio: number;
      current_sample_id: number;
      current_repeat_time: number;
    };
    logs: string[];
  };
}>();

const valid = computed(
  () => !isEmpty(props.details) && !isEmpty(props.details.data)
);
</script>

<style scoped lang="scss"></style>
