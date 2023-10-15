<template>
  <q-card flat class="q-mx-auto q-pt-xl transparent t-card">
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
                :options="currentModels"
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
        v-if="agent.name"
        group="agent"
        label="算法参数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <div v-if="predefined && !editable" class="full-width">
          <component
            :is="getModelAsyncComp(agent.name)"
            v-model="agent.hypers"
            v-memo="[memoKey]"
          />
        </div>
        <div v-else class="full-width">
          <div class="full-width ui-editor">
            <monaco-editor v-model="agent.hypers" language="json" />
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
    <q-card-section>
      <q-expansion-item
        group="agent"
        label="状态-输入预处理函数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <div class="full-width ui-editor">
          <monaco-editor v-model="agent.sifunc" language="python" />
        </div>
      </q-expansion-item>
    </q-card-section>
    <q-card-section>
      <q-expansion-item
        group="agent"
        label="输出-动作后处理函数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <div class="full-width ui-editor">
          <monaco-editor v-model="agent.oafunc" language="python" />
        </div>
      </q-expansion-item>
    </q-card-section>
    <q-card-section>
      <q-expansion-item
        group="agent"
        label="奖励函数"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <div class="full-width ui-editor">
          <monaco-editor v-model="agent.rewfunc" language="python" />
        </div>
      </q-expansion-item>
    </q-card-section>
    <q-card-section>
      <q-expansion-item
        group="agent"
        label="钩子模块"
        header-class="q-px-lg bg-secondary text-subtitle2"
      >
        <q-card flat class="full-width transparent">
          <q-card-section>
            <q-markup-table
              v-for="(element, order) in hooks"
              :key="order"
              flat
              separator="horizontal"
              class="q-mb-md ui-table"
            >
              <tbody>
                <tr>
                  <td>钩子名称</td>
                  <td>
                    <q-select
                      v-model="element.name"
                      :options="agentHooks"
                      dense
                      filled
                      required
                      options-dense
                      popup-content-class="bg-secondary"
                      class="ui-input"
                    />
                  </td>
                </tr>
                <template v-if="element.name">
                  <component
                    :is="getHookAsyncComp(element.name)"
                    v-model="element.args"
                  />
                </template>
                <tr>
                  <td>删除钩子</td>
                  <td>
                    <q-btn
                      flat
                      dense
                      icon="bi-x-circle"
                      class="bg-secondary ui-input ui-clickable"
                      @click="hooks.splice(order, 1)"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <q-btn
              flat
              dense
              icon="bi-plus-circle"
              class="full-width bg-secondary ui-clickable"
              @click="hooks.push({ name: '', args: {} })"
            >
              <q-tooltip anchor="top middle" self="bottom middle">
                添加
              </q-tooltip>
            </q-btn>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores";
import rlModels from "~/plugins/models/index.json";
import agentHooks from "~/plugins/hooks/index.json";
import { deepCopy } from "~/utils";

const taskStore = useTaskStore();

const props = defineProps<{
  idx: string;
}>();
const index = computed(() => Number(props.idx));
const agent = taskStore.task!.agents[index.value];

const currentModels = ref(deepCopy(rlModels));
async function newvalFunc(
  val: string,
  done?: (v?: string, m?: "toggle" | "add" | "add-unique") => void,
) {
  if (val?.length > 0) {
    if (!currentModels.value.includes(val)) {
      currentModels.value.push(val);
    }
    done?.(val, "add-unique");
  }
}
newvalFunc(agent.name);

function getModelAsyncComp(name: string) {
  return defineAsyncComponent(
    () =>
      import(`../../../../plugins/models/${name.toLowerCase()}/configs.vue`),
  );
}

const predefined = computed(() => rlModels.includes(agent.name));
const editable = ref(false);
const memoKey = ref(0);
function updateFunc() {
  agent.hypers = "{}";
  memoKey.value++;
}
function modeFunc() {
  editable.value = !editable.value;
  memoKey.value++;
}

type Hooks = {
  name: string;
  args: object;
};

const hooks = reactive<Hooks[]>(JSON.parse(agent.hooks));

function getHookAsyncComp(name: string) {
  return defineAsyncComponent(
    () => import(`../../../../plugins/hooks/${name.toLowerCase()}.vue`),
  );
}

watch(hooks, () => {
  agent.hooks = JSON.stringify(hooks);
});
</script>

<style scoped lang="scss"></style>
