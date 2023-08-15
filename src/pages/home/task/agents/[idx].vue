<template>
  <q-card flat class="q-pt-xl transparent t-card">
    <q-card-section>
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>是否训练</td>
            <td>
              <q-checkbox
                v-model="agent.training"
                :true-value="1"
                :false-value="0"
                class="float-right"
              />
            </td>
          </tr>
          <tr>
            <td>算法类型</td>
            <td>
              <q-select
                v-model="agent.name"
                :options="rlModels"
                dense
                standout="bg-ignore"
                input-class="text-foreground"
                popup-content-class="shadow-0 bg-secondary"
                options-selected-class="text-accent"
                class="ui-input"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-item-section class="q-my-sm" />
      <q-expansion-item
        v-if="agent.name"
        group="agent"
        label="算法参数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <component
          :is="getAsyncComp(agent.name)"
          v-model:configs="agent.hypers"
        />
      </q-expansion-item>
      <q-item-section class="q-my-sm" />
      <q-expansion-item
        group="agent"
        label="状态-输入预处理函数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <div class="full-width a-container">
          <monaco-editor v-model="agent.sifunc" language="python" />
        </div>
      </q-expansion-item>
      <q-item-section class="q-my-sm" />
      <q-expansion-item
        group="agent"
        label="输出-动作后处理函数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <div class="full-width a-container">
          <monaco-editor v-model="agent.oafunc" language="python" />
        </div>
      </q-expansion-item>
      <q-item-section class="q-my-sm" />
      <q-expansion-item
        group="agent"
        label="奖励函数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <div class="full-width a-container">
          <monaco-editor v-model="agent.rewfunc" language="python" />
        </div>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores";
import rlModels from "~/plugins/agents/index.json";

const taskStore = useTaskStore();

const props = defineProps<{
  idx: string;
}>();
const index = computed(() => Number(props.idx));

const agent = taskStore.task!.agents[index.value].configs;

function getAsyncComp(name: string) {
  return defineAsyncComponent(
    () => import(`../../../../plugins/agnets/${name.toLowerCase()}/configs.vue`)
  );
}
</script>

<style scoped lang="scss">
.a-container {
  height: 50vh;
}
</style>
