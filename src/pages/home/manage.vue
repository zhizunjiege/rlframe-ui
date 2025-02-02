<template>
  <div class="fit flex flex-center">
    <q-card flat class="column overflow-auto ui-manage-card">
      <q-card-section horizontal class="col-shrink flex items-center">
        <q-card-section class="text-accent">任务管理</q-card-section>
        <q-card-section class="q-py-none ui-manage-search">
          <q-input
            v-model="filter"
            dense
            rounded
            outlined
            debounce="500"
            placeholder="搜索"
          >
            <template #prepend>
              <q-icon name="bi-search" size="xs" class="text-foreground" />
            </template>
          </q-input>
        </q-card-section>
        <q-space />
        <q-card-section class="q-py-none">
          <q-btn
            :disable="running || selected.length === 0"
            flat
            round
            size="sm"
            icon="bi-trash"
            @click="deleteTasks"
          >
            <q-tooltip anchor="top left" self="top right"> 删除任务 </q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-section class="col-grow">
        <q-table
          v-model:selected="selected"
          v-model:pagination="pagination"
          :rows="rows"
          :columns="columns"
          :filter="filter"
          flat
          hide-bottom
          row-key="id"
          separator="none"
          selection="multiple"
          table-class="ui-manage-table"
          table-header-class="bg-secondary"
          class="full-height transparent"
        >
          <template #header-selection="scope">
            <q-checkbox v-model="scope.selected" size="md" />
          </template>
          <template #body-selection="scope">
            <q-checkbox v-model="scope.selected" size="md" />
          </template>
          <template #body-cell="scope">
            <q-td :props="scope" class="ellipsis">
              {{ scope.value }}
              <q-tooltip anchor="top right" self="top middle">
                {{ scope.value }}
              </q-tooltip>
            </q-td>
          </template>
          <template #body-cell-actions="scope">
            <q-td :props="scope">
              <q-btn
                :disable="running"
                flat
                round
                size="sm"
                icon="bi-folder"
                class="q-mx-sm"
                @click="openTask(scope.row.id)"
              >
                <q-tooltip anchor="top left" self="top right">
                  打开任务
                </q-tooltip>
              </q-btn>
              <q-btn
                :disable="running"
                flat
                round
                size="sm"
                icon="bi-files"
                class="q-mx-sm"
                @click="copyTask(scope.row.id)"
              >
                <q-tooltip anchor="top left" self="top right">
                  复制任务
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
          <template #no-data="scope">
            <q-td class="flex flex-center full-width text-h6">
              <q-icon :name="scope.icon" size="md" class="q-mr-md" />
              {{ scope.message }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-separator />
      <q-card-section horizontal class="col-shrink flex items-center">
        <q-card-section class="text-accent">
          已选 {{ selected.length }} 项
        </q-card-section>
        <q-space />
        <q-card-section class="q-py-none">
          <q-pagination
            v-model="pagination.page"
            input
            flat
            round
            ellipses
            boundary-links
            direction-links
            :max="Math.ceil(rows.length / pagination.rowsPerPage)"
            :max-pages="5"
            color="foreground"
            active-color="accent"
          />
        </q-card-section>
        <q-space />
        <q-card-section class="text-accent">
          总计 {{ rows.length }} 项
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { QTableProps } from "quasar";
import { TaskTable } from "~/api";
import { saveDialog } from "~/configs/dialog";
import { useAppStore, useTaskStore } from "~/stores";
import { getTimestampString } from "~/utils";

const $q = useQuasar();
const router = useRouter();

const appStore = useAppStore();
const taskStore = useTaskStore();

// q-table selected
const selected = ref([] as TaskTable[]);

// q-table rows
const rows = ref([] as TaskTable[]);

// q-table columns
const columns = [
  {
    name: "id",
    label: "任务ID",
    field: "id",
    align: "center",
    sortable: true,
  },
  {
    name: "name",
    label: "任务名称",
    field: "name",
    align: "center",
    sortable: true,
  },
  {
    name: "createTime",
    label: "创建时间",
    field: "create_time",
    align: "center",
    sortable: true,
  },
  {
    name: "updateTime",
    label: "更新时间",
    field: "update_time",
    align: "center",
    sortable: true,
  },
  {
    name: "description",
    label: "任务描述",
    field: "desc",
    align: "center",
  },
  {
    name: "actions",
    label: "任务操作",
    field: "",
    align: "center",
  },
] as QTableProps["columns"];

// q-table filter
const filter = ref("");

// q-table pagination
const pagination = ref({
  sortBy: "id",
  descending: true,
  page: 1,
  rowsPerPage: 12,
});

const running = ref(false);

// open task
async function openTask(id: number) {
  running.value = true;
  if (!taskStore.saved) {
    $q.dialog(saveDialog).onOk(async (save: string) => {
      if (save === "yes") {
        await taskStore.saveTask();
      }
      await taskStore.openTask(id);
      router.push("/home/task");
    });
  } else {
    await taskStore.openTask(id);
    router.push("/home/task");
  }
  running.value = false;
}
// copy task
async function copyTask(id: number) {
  running.value = true;
  const task = await appStore.rest!.getTask(id);
  task.task.id = -1;
  task.task.name = `${task.task.name} - 副本`;
  for (const agent of task.agents) {
    agent.id = -1;
    agent.task = -1;
  }
  for (const simenv of task.simenvs) {
    simenv.id = -1;
    simenv.task = -1;
  }
  const ids = await appStore.rest!.setTask(task);
  const timestamp = getTimestampString();
  rows.value.push({
    id: ids.task,
    name: task.task.name,
    desc: task.task.desc,
    create_time: timestamp,
    update_time: timestamp,
  });
  running.value = false;
}
// delete selected tasks
async function deleteTasks() {
  running.value = true;
  if (
    taskStore.task &&
    selected.value.find((item) => item.id === taskStore.task!.task.id)
  ) {
    $q.notify({
      type: "warning",
      message: "无法删除当前打开的任务",
    });
  } else {
    $q.dialog({
      title: "提示",
      message: "确认删除选择的任务？",
      cancel: true,
      persistent: true,
      class: "bg-secondary",
    }).onOk(async () => {
      const tasks = selected.value.map((item) => item.id);
      await appStore.rest!.delTask(tasks);
      rows.value = rows.value.filter(
        (item) => !tasks.find((id) => id === item.id),
      );
      selected.value = [];
    });
  }
  running.value = false;
}

// initialize
watch(
  () => appStore.rest,
  async (value) => {
    if (value) {
      rows.value = await appStore.rest!.select("task", [], {});
    }
  },
  {
    immediate: true,
  },
);
</script>

<style scoped lang="scss">
.ui-manage-card {
  width: 84%;
  height: 92%;
}
.ui-manage-search {
  width: 30%;
}
:deep(.ui-manage-table) {
  th {
    font-size: 1rem !important;
  }
  td {
    max-width: 20rem;
    font-size: 0.875rem !important;
  }
}
</style>
