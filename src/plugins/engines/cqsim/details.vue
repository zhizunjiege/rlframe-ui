<template>
  <q-scroll-area v-if="!isEmpty(props.details)" class="fit">
    <q-markup-table flat separator="horizontal" class="overflow-auto ui-table">
      <tbody>
        <tr>
          <td>当前仿真时间</td>
          <td class="ellipsis">
            {{ getTimestampString(props.details.sim_current_time * 1000) }}
          </td>
        </tr>
        <tr>
          <td>仿真运行时长</td>
          <td class="ellipsis">
            {{ getDurationString(props.details.sim_duration * 1000) }}
          </td>
        </tr>
        <tr>
          <td>墙钟运行时长</td>
          <td class="ellipsis">
            {{ getDurationString(props.details.real_duration * 1000) }}
          </td>
        </tr>
        <tr>
          <td>仿真步长（ms）</td>
          <td class="ellipsis">{{ props.details.sim_time_step }}</td>
        </tr>
        <tr>
          <td>仿真倍速</td>
          <td class="ellipsis">{{ props.details.real_speed_ratio }}</td>
        </tr>
        <tr>
          <td>当前样本ID</td>
          <td class="ellipsis">{{ props.details.current_sample_id }}</td>
        </tr>
        <tr>
          <td>仿真重复次数</td>
          <td class="ellipsis">{{ props.details.current_repeat_time }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-scroll-area>
  <div v-else class="fit flex flex-center">
    <h4 class="text-secondary text-weight-bold">暂无数据</h4>
  </div>
</template>

<script setup lang="ts">
import { isEmpty, getTimestampString, getDurationString } from "~/utils";

const props = defineProps<{
  details: {
    sim_current_time: number;
    sim_duration: number;
    real_duration: number;
    sim_time_step: number;
    speed_ratio: number;
    real_speed_ratio: number;
    current_sample_id: number;
    current_repeat_time: number;
  };
}>();
</script>

<style scoped lang="scss"></style>
