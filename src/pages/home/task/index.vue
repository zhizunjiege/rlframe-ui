<template>
  <form ref="form" @change.capture="submit">
    <q-card flat class="q-mx-auto q-pt-xl transparent t-card">
      <q-card-section>
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>任务名称</td>
              <td>
                <q-input
                  v-model="taskStore.task!.task.name"
                  dense
                  filled
                  required
                  maxlength="32"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>任务描述</td>
              <td>
                <q-input
                  v-model="taskStore.task!.task.desc"
                  dense
                  filled
                  autogrow
                  clearable
                  maxlength="256"
                  type="textarea"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>
                <q-input
                  v-model="taskStore.task!.task.create_time"
                  dense
                  filled
                  disable
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>更新时间</td>
              <td>
                <q-input
                  v-model.lazy="taskStore.task!.task.update_time"
                  dense
                  filled
                  disable
                  class="ui-input"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </form>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores";

const taskStore = useTaskStore();

const form = ref<Nullable<HTMLFormElement>>(null);
function submit() {
  return form.value!.reportValidity();
}
</script>

<style scoped lang="scss"></style>
