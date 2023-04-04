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
                standout="bg-negative"
                input-class="text-positive"
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
                standout="bg-negative"
                input-class="text-positive"
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
              默认仿真平台
              <q-tooltip anchor="top right" self="top right">
                训练任务默认使用的仿真平台
              </q-tooltip>
            </td>
            <td>
              <q-select
                v-model="appStore.systemSettings.defaultEngine"
                :options="simEngines"
                dense
                standout="bg-negative"
                input-class="text-positive"
                popup-content-class="bg-secondary"
                options-selected-class="text-accent"
                class="ui-input"
              />
            </td>
          </tr>
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
                standout="bg-negative"
                input-class="text-positive"
                class="ui-input"
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
                standout="bg-negative"
                input-class="text-positive"
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
import { useAppStore } from "~/stores/app";

const appStore = useAppStore();

// local system settings
const bffAddr = ref(appStore.systemSettings.bffAddr);
const webAddr = ref(appStore.systemSettings.webAddr);

// simulation engines
const simEngines = ref(["CQSim"]);
</script>

<style scoped lang="scss">
.ui-card {
  width: 50%;
}
.ui-table {
  :deep(table) {
    table-layout: fixed;
  }
  td {
    font-size: 0.875rem;
    padding: 0.5rem 1.5rem;
    border-color: var(--q-negative);
  }
}

.ui-input {
  float: right;
  width: 75%;
}
</style>
