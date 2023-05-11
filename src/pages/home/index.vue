<template>
  <div class="fit row flex-center">
    <q-card flat class="col-8 q-pa-md ui-index-card">
      <q-card-section class="flex items-center text-accent">
        <q-separator vertical spaced="lg" size="0.15rem" />最近任务
      </q-card-section>
      <q-markup-table
        v-if="taskStore.recent.length > 0"
        separator="none"
        class="full-width scroll overflow-auto q-px-xl text-center transparent ui-index-table"
      >
        <thead>
          <tr>
            <th>任务ID</th>
            <th>任务名称</th>
            <th>创建时间</th>
            <th>修改时间</th>
            <th>任务描述</th>
            <th>任务操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in taskStore.recent"
            :key="task.id"
            class="cursor-pointer ui-index-row"
            @click="openTask(task.id)"
          >
            <td>{{ task.id }}</td>
            <td class="ellipsis">
              {{ task.name }}
              <q-tooltip anchor="top right" self="top middle">
                {{ task.name }}
              </q-tooltip>
            </td>
            <td>{{ task.create_time }}</td>
            <td>{{ task.update_time }}</td>
            <td class="ellipsis">
              {{ task.description }}
              <q-tooltip anchor="top right" self="top middle">
                {{ task.description }}
              </q-tooltip>
            </td>
            <td>
              <q-icon
                name="bi-x-circle"
                size="xs"
                class="ui-icon"
                @click.stop="taskStore.delRecentTask(task)"
              >
                <q-tooltip anchor="top right" self="top left">
                  清除记录
                </q-tooltip>
              </q-icon>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-card-section
        v-else
        class="absolute-center text-secondary text-h3 text-weight-bold"
      >
        空 空 如 也
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores";

const $q = useQuasar();
const router = useRouter();
const taskStore = useTaskStore();

// open task
async function openTask(id: number) {
  try {
    if (!taskStore.saved) {
      $q.dialog({
        title: "提示",
        message: "是否保存当前任务？",
        cancel: true,
        persistent: true,
        class: "bg-secondary",
        options: {
          type: "radio",
          model: "save",
          inline: true,
          items: [
            { label: "保存", value: "save" },
            { label: "不保存", value: "dont" },
          ],
        },
      }).onOk(async (data: string) => {
        if (data === "save") {
          await taskStore.saveTask();
        }
        await taskStore.openTask(id);
        router.push("/home/task/basic");
      });
    } else {
      await taskStore.openTask(id);
      router.push("/home/task/basic");
    }
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "打开任务失败，该任务可能已失效",
    });
    console.error(e);
  }
}
</script>

<style scoped lang="scss">
.ui-index-card {
  height: 64%;
  border-radius: 0.5rem;
}
.ui-index-table {
  height: 88%;
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: var(--ui-secondary);
    th {
      font-size: 1rem !important;
    }
  }
  tbody {
    td {
      max-width: 20rem;
      font-size: 0.875rem !important;
    }
  }
}
.ui-index-row {
  &:hover {
    background-color: var(--ui-primary);
  }
}
</style>
