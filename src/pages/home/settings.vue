<template>
  <q-card flat class="q-mx-auto q-pt-xl transparent ui-task-card">
    <q-card-section class="text-center text-h6">系统设置</q-card-section>
    <q-card-section>
      <p class="text-subtitle1">服务地址</p>
      <q-markup-table flat separator="horizontal" class="ui-task-table">
        <tbody>
          <tr>
            <td>BFF服务地址(主机:端口)</td>
            <td>
              <q-input
                v-model.lazy="bffAddr"
                dense
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-task-input"
                @blur="appStore.systemSettings.bffAddr = bffAddr"
              />
            </td>
          </tr>
          <tr>
            <td>WEB服务地址(主机:端口)</td>
            <td>
              <q-input
                v-model.lazy="webAddr"
                dense
                disable
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-task-input"
                @blur="appStore.systemSettings.webAddr = webAddr"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-section>
      <p class="text-subtitle1">其他设置</p>
      <q-markup-table flat separator="horizontal" class="ui-task-table">
        <tbody>
          <tr>
            <td>
              控制台消息数目最大值
              <q-tooltip anchor="top right" self="top right">
                控制台显示的消息数目的最大值
              </q-tooltip>
            </td>
            <td>
              <q-input
                v-model.number="appStore.systemSettings.maxTerminalMsgs"
                dense
                type="number"
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-task-input"
              />
            </td>
          </tr>
          <tr>
            <td>
              本地数据有效期限(天)
              <q-tooltip anchor="top right" self="top right">
                浏览器缓存数据的有效期限，单位为天
              </q-tooltip>
            </td>
            <td>
              <q-input
                v-model.number="appStore.systemSettings.localDataExpire"
                dense
                type="number"
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-task-input"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useAppStore } from "~/stores";

const appStore = useAppStore();

// local system settings
const bffAddr = ref(appStore.systemSettings.bffAddr);
const webAddr = ref(appStore.systemSettings.webAddr);
</script>

<style scoped lang="scss"></style>
