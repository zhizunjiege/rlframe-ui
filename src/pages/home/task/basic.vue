<template>
  <q-card
    v-if="taskStore.task"
    flat
    class="q-mx-auto q-pt-xl transparent ui-card"
  >
    <q-card-section>
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>任务名称</td>
            <td>
              <q-input
                v-model="taskStore.task.name"
                dense
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
              />
            </td>
          </tr>
          <tr>
            <td>任务描述</td>
            <td>
              <q-input
                v-model="taskStore.task.description"
                dense
                autogrow
                clearable
                type="textarea"
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
              />
            </td>
          </tr>
          <tr>
            <td>创建时间</td>
            <td>
              <q-input
                v-model="taskStore.task.create_time"
                dense
                disable
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
              />
            </td>
          </tr>
          <tr>
            <td>修改时间</td>
            <td>
              <q-input
                v-model.lazy="taskStore.task.update_time"
                dense
                disable
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores";

const $q = useQuasar();
const router = useRouter();
const taskStore = useTaskStore();

if (!taskStore.task) {
  $q.notify({
    type: "warning",
    message: "暂无任务",
  });
  router.push("/home");
}
</script>

<style scoped lang="scss"></style>
