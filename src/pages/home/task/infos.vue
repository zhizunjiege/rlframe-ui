<template>
  <q-card flat class="q-pt-xl transparent t-card">
    <q-card-section>
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>任务名称</td>
            <td>
              <q-input
                v-model="taskStore.task!.infos.name"
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
                v-model="taskStore.task!.infos.desc"
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
                v-model="taskStore.task!.infos.create_time"
                dense
                disable
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
              />
            </td>
          </tr>
          <tr>
            <td>更新时间</td>
            <td>
              <q-input
                v-model.lazy="taskStore.task!.infos.update_time"
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

const taskStore = useTaskStore();
</script>

<style scoped lang="scss"></style>
