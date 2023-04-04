<template>
  <div class="fit row flex-center">
    <q-card flat class="col-8 q-pa-md ui-card">
      <q-card-section class="flex items-center">
        <q-separator vertical spaced="lg" size="0.15rem" />最近任务
      </q-card-section>
      <q-markup-table
        v-if="taskStore.recent.length > 0"
        separator="none"
        class="full-width scroll overflow-auto q-px-xl text-center transparent ui-table"
      >
        <thead class="ui-thead">
          <tr>
            <th>任务ID</th>
            <th>任务名称</th>
            <th>创建时间</th>
            <th>修改时间</th>
            <th>任务描述</th>
            <th>任务操作</th>
          </tr>
        </thead>
        <tbody class="ui-tbody">
          <tr
            v-for="(task, index) in taskStore.recent"
            :key="task.id"
            class="cursor-pointer ui-row"
            @click="openTask(index)"
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
                @click.stop="deleteTask(index)"
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
import { useTaskStore } from "~/stores/task";

const taskStore = useTaskStore();

// open task
function openTask(index: number) {
  console.log(index);
}

// delete recent task
function deleteTask(index: number) {
  console.log(index);
}
</script>

<style scoped lang="scss">
.ui-card {
  height: 64%;
  border-radius: 0.5rem;
}
.ui-table {
  height: 88%;
}
.ui-row {
  &:hover {
    background-color: var(--q-primary);
  }
}
.ui-thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--q-secondary);
  th {
    font-size: 1rem !important;
  }
}
.ui-tbody {
  td {
    max-width: 20rem;
    font-size: 0.875rem !important;
  }
}
</style>
