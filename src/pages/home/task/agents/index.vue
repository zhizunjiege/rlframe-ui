<template>
  <q-card flat class="q-mx-auto q-pt-xl transparent t-card">
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
      v-for="(item, index) in taskStore.task!.agents"
      :key="index"
    >
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>服务标识</td>
            <td>
              <q-select
                v-model="item.server"
                :options="agentServices"
                dense
                filled
                required
                options-dense
                popup-content-class="bg-secondary"
                class="full-width"
              />
            </td>
            <td>服务描述</td>
            <td>
              <q-input
                v-model="item.desc"
                dense
                filled
                autogrow
                clearable
                maxlength="256"
                type="textarea"
                class="full-width"
              />
            </td>
          </tr>
          <tr>
            <td>创建时间</td>
            <td>
              <q-input
                v-model="item.create_time"
                dense
                filled
                disable
                class="full-width"
              />
            </td>
            <td>更新时间</td>
            <td>
              <q-input
                v-model="item.update_time"
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

const $q = useQuasar();
const router = useRouter();

const appStore = useAppStore();
const taskStore = useTaskStore();

const agentServices = computed(() =>
  appStore.services.filter((v) => v.type === "agent").map((v) => v.name)
);

function addService() {
  taskStore.addService("agent");
}
function delService(index: number) {
  taskStore.delService("agent", index);
}
async function copyService(index: number) {
  await navigator.clipboard.writeText(
    JSON.stringify(taskStore.task!.agents[index])
  );
  $q.notify({
    type: "positive",
    message: "已复制到剪贴板",
  });
}
async function pasteService(index: number) {
  const configs = JSON.parse(await navigator.clipboard.readText());
  configs.id = taskStore.task!.agents[index].id;
  configs.server = taskStore.task!.agents[index].server;
  taskStore.task!.agents.splice(index, 1, configs);
  $q.notify({
    type: "positive",
    message: "已从剪贴板粘贴",
  });
}
function editService(index: number) {
  router.push(`/home/task/agents/${index}`);
}
</script>

<style scoped lang="scss"></style>
