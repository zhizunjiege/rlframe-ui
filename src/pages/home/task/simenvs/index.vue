<template>
  <q-card flat class="q-pt-xl transparent t-card">
    <q-card-section>
      <q-btn
        flat
        dense
        icon="bi-plus-circle"
        class="full-width bg-secondary ui-clickable"
        @click="addService"
      >
        <q-tooltip anchor="top middle" self="bottom middle"> 添加 </q-tooltip>
      </q-btn>
    </q-card-section>

    <q-card-section
      v-for="(item, index) in taskStore.task!.simenvs"
      :key="index"
    >
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>服务标识</td>
            <td>
              <q-select
                v-model="item.service.server_id"
                :options="simenvServices"
                dense
                filled
                options-dense
                popup-content-class="bg-secondary"
                class="full-width"
              />
            </td>
            <td>服务描述</td>
            <td>
              <q-input
                v-model="item.service.desc"
                dense
                filled
                autogrow
                clearable
                type="textarea"
                class="full-width"
              />
            </td>
          </tr>
          <tr>
            <td>创建时间</td>
            <td>
              <q-input
                v-model="item.service.create_time"
                dense
                filled
                disable
                class="full-width"
              />
            </td>
            <td>更新时间</td>
            <td>
              <q-input
                v-model="item.service.update_time"
                dense
                filled
                disable
                class="full-width"
              />
            </td>
          </tr>
          <tr>
            <td>
              <q-btn
                flat
                dense
                class="full-width bg-secondary ui-clickable"
                @click="delService(index)"
              >
                <q-icon name="bi-trash" size="xs" />
                <q-tooltip anchor="top middle" self="bottom middle">
                  删除
                </q-tooltip>
              </q-btn>
            </td>
            <td>
              <q-btn
                flat
                dense
                class="full-width bg-secondary ui-clickable"
                @click="copyService(index)"
              >
                <q-icon name="bi-clipboard" size="xs" />
                <q-tooltip anchor="top middle" self="bottom middle">
                  复制
                </q-tooltip>
              </q-btn>
            </td>
            <td>
              <q-btn
                flat
                dense
                class="full-width bg-secondary ui-clickable"
                @click="pasteService(index)"
              >
                <q-icon name="bi-clipboard-plus" size="xs" />
                <q-tooltip anchor="top middle" self="bottom middle">
                  粘贴
                </q-tooltip>
              </q-btn>
            </td>
            <td>
              <q-btn
                flat
                dense
                class="full-width bg-secondary ui-clickable"
                @click="editService(index)"
              >
                <q-icon name="bi-pencil" size="xs" />
                <q-tooltip anchor="top middle" self="bottom middle">
                  配置
                </q-tooltip>
              </q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useAppStore, useTaskStore } from "~/stores";

const router = useRouter();

const appStore = useAppStore();
const taskStore = useTaskStore();

const simenvServices = computed(() =>
  appStore.registeredServices
    .filter((v) => v.type === "simenv")
    .map((v) => v.name)
);

function addService() {
  taskStore.addService("simenv");
}
function delService(index: number) {
  taskStore.delService("simenv", index);
}
async function copyService(index: number) {
  await navigator.clipboard.writeText(
    JSON.stringify(taskStore.task!.simenvs[index].configs)
  );
}
async function pasteService(index: number) {
  const configs = JSON.parse(await navigator.clipboard.readText());
  const id = taskStore.task!.simenvs[index].configs.id;
  taskStore.task!.simenvs[index].configs = configs;
  taskStore.task!.simenvs[index].configs.id = id;
}
function editService(index: number) {
  router.push(`/home/task/simenvs/${index}`);
}
</script>

<style scoped lang="scss"></style>
