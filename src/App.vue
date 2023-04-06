<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAppStore } from "~/stores/app";
import { useTaskStore } from "~/stores/task";

const $q = useQuasar();

$q.dark.set("auto");

const appStore = useAppStore();

appStore.loadSystemSettings();
onBeforeUnmount(appStore.saveSystemSettings);

watch(
  () => appStore.systemSettings.bffAddr,
  async () => {
    try {
      appStore.setGrpcClient();
      await appStore.grpc!.queryService({ ids: [] });
    } catch (e) {
      $q.notify({
        type: "negative",
        message: "连接BFF服务失败，请检查地址是否正确",
      });
      console.error(e);
    }
  },
  { immediate: true }
);
watch(
  () => appStore.systemSettings.webAddr,
  async () => {
    try {
      appStore.setRestClient();
      await appStore.rest!.meta();
    } catch (e) {
      $q.notify({
        type: "negative",
        message: "连接WEB服务失败，请检查地址是否正确",
      });
      console.error(e);
    }
  },
  { immediate: true }
);

const taskStore = useTaskStore();

taskStore.loadRecentTasks();
onBeforeUnmount(taskStore.saveRecentTasks);

watch(
  () => taskStore.task,
  () => {
    taskStore.saved = false;
  },
  { deep: true }
);
</script>

<style lang="scss">
html,
body {
  font-family: "Microsoft YaHei" !important;
  font-size: 16px !important;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 1px;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
