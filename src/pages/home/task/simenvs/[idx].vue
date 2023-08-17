<template>
  <q-card flat class="q-pt-xl transparent t-card">
    <q-card-section>
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>引擎类型</td>
            <td>
              <q-select
                v-model="simenv.name"
                :options="simEngines"
                dense
                filled
                options-dense
                popup-content-class="bg-secondary"
                class="ui-input"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-item-section class="q-my-sm" />
      <q-expansion-item
        v-if="simenv.name"
        group="simenv"
        label="引擎参数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <component :is="getAsyncComp(simenv.name)" v-model="simenv.args" />
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores";
import simEngines from "~/plugins/simenvs/index.json";

const taskStore = useTaskStore();

const props = defineProps<{
  idx: string;
}>();
const index = computed(() => Number(props.idx));

const simenv = taskStore.task!.simenvs[index.value].configs;

function getAsyncComp(name: string) {
  return defineAsyncComponent(
    () =>
      import(`../../../../plugins/simenvs/${name.toLowerCase()}/configs.vue`)
  );
}
</script>

<style scoped lang="scss"></style>
