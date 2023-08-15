<template>
  <q-card flat class="q-pt-xl transparent t-card">
    <q-card-section
      v-if="taskStore.task!.simenvs.length > 0"
      class="flex justify-between q-py-none"
    >
      <q-btn
        flat
        size="sm"
        round
        :icon="deling ? 'bi-check-circle' : 'bi-trash'"
        class="ui-clickable"
        @click="delService(-1)"
      >
        <q-tooltip anchor="top middle" self="bottom middle">
          {{ deling ? "确认" : "删除" }}
        </q-tooltip>
      </q-btn>
      <q-btn
        :disable="deling"
        flat
        size="sm"
        round
        icon="bi-plus-circle"
        class="ui-clickable"
        @click="addService"
      >
        <q-tooltip anchor="top middle" self="bottom middle"> 添加 </q-tooltip>
      </q-btn>
    </q-card-section>
    <q-card-section v-else>
      <q-btn
        flat
        class="full-width bg-secondary ui-clickable"
        @click="addService"
      >
        <q-icon size="xs" name="bi-plus-circle" class="q-mr-sm" />
        添加
      </q-btn>
    </q-card-section>

    <draggable
      v-model="taskStore.task!.simenvs"
      group="simenvs"
      :item-key="itemKeyFunc"
    >
      <template #item="{ element, index }">
        <q-card-section
          :class="{ 's-todel': deling }"
          @click="delService(index)"
        >
          <q-markup-table flat separator="horizontal" class="ui-table">
            <tbody>
              <tr>
                <td>服务标识</td>
                <td>
                  <q-select
                    v-model="element.service.server_id"
                    :options="simenvServices"
                    dense
                    options-dense
                    standout="bg-ignore"
                    input-class="text-foreground"
                    popup-content-class="shadow-0 bg-secondary"
                    options-selected-class="text-accent"
                    class="s-input"
                  />
                </td>
                <td>服务配置</td>
                <td>
                  <q-btn
                    flat
                    square
                    label="配置界面"
                    size="1rem"
                    :to="`/home/task/simenvs/${index}`"
                    class="full-width bg-secondary text-accent"
                  />
                </td>
              </tr>
              <tr>
                <td>创建时间</td>
                <td>
                  <q-input
                    v-model="element.configs.create_time"
                    disable
                    dense
                    standout="bg-ignore"
                    input-class="text-foreground"
                    class="s-input"
                  />
                </td>
                <td>更新时间</td>
                <td>
                  <q-input
                    v-model="element.configs.update_time"
                    disable
                    dense
                    standout="bg-ignore"
                    input-class="text-foreground"
                    class="s-input"
                  />
                </td>
              </tr>
              <tr>
                <td>服务描述</td>
                <td colspan="3">
                  <q-input
                    v-model="element.configs.desc"
                    dense
                    autogrow
                    clearable
                    type="textarea"
                    standout="bg-ignore"
                    input-class="text-foreground"
                    class="s-input"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </template>
    </draggable>
  </q-card>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import { Task, useAppStore, useTaskStore } from "~/stores";

const appStore = useAppStore();
const taskStore = useTaskStore();

const itemKeyFunc = (item: Task["agents"][number]) => item.service.server_id;

const simenvServices = computed(() =>
  appStore.registeredServices.filter((v) => v.type === "simenv")
);

// add or del service
function addService() {
  taskStore.addService("simenv");
}

const deling = ref(false);
function delService(index: number) {
  if (index >= 0) {
    if (deling.value) {
      taskStore.delService("simenv", index);
      if (taskStore.task!.simenvs.length === 0) {
        deling.value = false;
      }
    }
  } else {
    deling.value = !deling.value;
  }
}
</script>

<style scoped lang="scss">
.s-input {
  float: right;
  width: 100%;
}
.s-todel {
  :hover {
    background-color: var(--ui-disable) !important;
  }
}
</style>
