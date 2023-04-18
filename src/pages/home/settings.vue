<template>
  <q-card flat class="q-mx-auto q-pt-xl transparent ui-card">
    <q-card-section class="text-center text-h6">系统设置</q-card-section>
    <q-card-section>
      <p class="text-subtitle1">服务地址</p>
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>BFF服务地址(主机:端口)</td>
            <td>
              <q-input
                v-model.lazy="bffAddr"
                dense
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
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
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
                @blur="appStore.systemSettings.webAddr = webAddr"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-section>
      <p class="text-subtitle1">其他设置</p>
      <q-markup-table flat separator="horizontal" class="ui-table">
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
import { useAppStore } from "~/stores";

const appStore = useAppStore();

// local system settings
const bffAddr = ref(appStore.systemSettings.bffAddr);
const webAddr = ref(appStore.systemSettings.webAddr);
</script>

<style scoped lang="scss"></style>
