<template>
  <q-card flat class="q-mx-auto q-pt-xl transparent t-card">
    <q-card-section>
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>引擎类型</td>
            <td>
              <q-select
                v-model="simenv.name"
                :options="currentEngines"
                dense
                filled
                required
                use-input
                options-dense
                popup-content-class="bg-secondary"
                class="ui-input"
                @new-value="newvalFunc"
                @update:model-value="updateFunc"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-section>
      <q-expansion-item
        v-if="simenv.name"
        group="simenv"
        label="引擎参数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <div v-if="predefined && !editable" class="full-width">
          <component
            :is="getAsyncComp(simenv.name)"
            v-model="simenv.args"
            v-memo="[memoKey]"
          />
        </div>
        <div v-else class="full-width">
          <div class="full-width ui-editor">
            <monaco-editor v-model="simenv.args" language="json" />
          </div>
        </div>
        <div v-show="predefined" class="full-width q-pa-md">
          <q-btn
            :icon="'bi-toggle-' + (editable ? 'on' : 'off')"
            flat
            dense
            square
            class="full-width bg-secondary ui-clickable"
            @click="modeFunc"
          >
            <q-tooltip anchor="top middle" self="bottom middle">
              切换编辑模式
            </q-tooltip>
          </q-btn>
        </div>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores";
import simEngines from "~/plugins/engines/index.json";
import { deepCopy } from "~/utils";

const taskStore = useTaskStore();

const props = defineProps<{
  idx: string;
}>();
const index = computed(() => Number(props.idx));
const simenv = taskStore.task!.simenvs[index.value];

const currentEngines = ref(deepCopy(simEngines));
async function newvalFunc(
  val: string,
  done?: (v?: string, m?: "toggle" | "add" | "add-unique") => void,
) {
  if (val?.length > 0) {
    if (!currentEngines.value.includes(val)) {
      currentEngines.value.push(val);
    }
    done?.(val, "add-unique");
  }
}
newvalFunc(simenv.name);

function getAsyncComp(name: string) {
  return defineAsyncComponent(
    () =>
      import(`../../../../plugins/engines/${name.toLowerCase()}/configs.vue`),
  );
}

const predefined = computed(() => simEngines.includes(simenv.name));
const editable = ref(false);
const memoKey = ref(0);
function updateFunc() {
  simenv.args = "{}";
  memoKey.value++;
}
function modeFunc() {
  editable.value = !editable.value;
  memoKey.value++;
}
</script>

<style scoped lang="scss"></style>
