<template>
  <q-layout view="hHh lpR fFf" class="fullscreen">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-img :src="Logo" width="2rem" alt="Logo" class="q-mr-md" />
        <q-img :src="Brand" width="12rem" alt="Brand" class="q-mr-xl" />
        <q-toolbar-title class="q-px-lg row items-center ui-menu">
          <q-btn flat label="首页" to="/home" class="ui-menu-item" />
          <q-btn flat label="任务" class="ui-menu-item">
            <q-menu
              fit
              max-width="10rem"
              anchor="bottom left"
              self="top left"
              class="text-center bg-secondary text-subtitle2"
            >
              <q-list dense>
                <q-item v-ripple v-close-popup clickable @click="newTask">
                  <q-item-section>
                    <q-item-label>新建任务</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  to="/home/manage?openonly=true"
                  active-class=""
                >
                  <q-item-section>打开任务</q-item-section>
                </q-item>
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  :disable="!taskStore.task || taskStore.saved"
                  @click="taskStore.saveTask"
                >
                  <q-item-section>保存任务</q-item-section>
                </q-item>
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  :disable="!taskStore.task"
                  @click="clsTask"
                >
                  <q-item-section>关闭任务</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  to="/home/manage?openonly=false"
                  active-class=""
                >
                  <q-item-section class="q-px-sm">任务管理</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn flat label="监控" to="/home/monitor" class="ui-menu-item" />
          <q-btn flat label="设置" to="/home/settings" class="ui-menu-item" />
          <q-btn flat label="帮助" to="/home/helper" class="ui-menu-item" />
        </q-toolbar-title>
        <q-space />
        <q-toolbar-title shrink class="text-subtitle2">
          {{
            taskStore.task
              ? taskStore.task.infos.name + (taskStore.saved ? "" : "*")
              : ""
          }}
        </q-toolbar-title>
        <q-space />
        <q-icon
          :name="$q.dark.isActive ? 'bi-moon' : 'bi-sun'"
          size="1rem"
          class="ui-clickable"
          @click="$q.dark.toggle"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page :style-fn="pageStyle">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
        <q-page-sticky
          v-if="taskStore.task"
          position="bottom-right"
          :offset="[48, 48]"
        >
          <q-btn fab icon="bi-list-ul" to="/home/task" class="bg-secondary">
            <q-tooltip>任务配置</q-tooltip>
          </q-btn>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Brand from "~/assets/brand.png";
import Logo from "~/assets/logo.png";
import { saveDialog } from "~/configs/dialog";
import { useAppStore, useTaskStore } from "~/stores";

const $q = useQuasar();
const router = useRouter();

const appStore = useAppStore();
const taskStore = useTaskStore();

// load system settings and set callback for saving
appStore.loadSystemSettings();
onBeforeUnmount(appStore.saveSystemSettings);

// init grpc and rest client
(async () => {
  try {
    await appStore.setGrpcClient(appStore.systemSettings.bffAddr);
    await appStore.setRestClient(appStore.systemSettings.webAddr);
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "连接BFF或WEB服务失败，请检查地址是否正确",
    });
    router.push("/home/settings");
    console.error(e);
  }
})();

// load recent tasks and set callback for saving
taskStore.loadRecentTasks();
onBeforeUnmount(taskStore.saveRecentTasks);

// page style
function pageStyle(offset: number, height: number) {
  const h = `${height - offset}px`;
  return {
    minHeight: h,
    height: h,
    overflow: "auto",
  };
}

// new task
function newTask() {
  if (!taskStore.saved) {
    $q.dialog(saveDialog).onOk(async (save: string) => {
      if (save === "yes") {
        await taskStore.saveTask();
      }
      taskStore.newTask();
      router.push("/home/task");
    });
  } else {
    taskStore.newTask();
    router.push("/home/task");
  }
}
// close task
function clsTask() {
  if (!taskStore.saved) {
    $q.dialog(saveDialog).onOk(async (save: string) => {
      if (save === "yes") {
        await taskStore.saveTask();
      }
      taskStore.clsTask();
      router.push("/home");
    });
  } else {
    taskStore.clsTask();
    router.push("/home");
  }
}
</script>

<style scoped lang="scss">
.ui-menu {
  min-width: 40rem;
  border-radius: 1.5rem;
}
.ui-menu-item {
  min-width: 4.5rem;
}
</style>

<style lang="scss">
.ui-card {
  width: 50%;
}
.ui-table {
  table {
    table-layout: fixed;
  }
  td {
    font-size: 0.875rem !important;
    padding: 0.5rem 1.5rem !important;
    border-color: var(--ui-secondary) !important;
  }
}
.ui-input {
  float: right;
  width: 75%;
}
.ui-editor {
  height: 50vh;
}
.ui-clickable:not([disabled]) {
  cursor: pointer;
  &:hover {
    color: var(--ui-accent);
  }
}
</style>
