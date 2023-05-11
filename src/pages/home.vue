<template>
  <q-layout view="hHh lpR fFf" class="fullscreen">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-img :src="Logo" width="2rem" alt="Logo" class="q-mr-md" />
        <q-img :src="Brand" width="12rem" alt="Brand" class="q-mr-xl" />
        <q-toolbar-title class="q-px-lg row items-center bg-secondary ui-menu">
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
                  to="/home/task/manage?openonly=true"
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
                  @click="closeTask"
                >
                  <q-item-section>关闭任务</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  to="/home/task/manage?openonly=false"
                  active-class=""
                >
                  <q-item-section class="q-px-sm">任务管理</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn flat label="监控" to="/home/monitor" class="ui-menu-item" />
          <q-btn flat label="设置" to="/home/settings" class="ui-menu-item" />
          <q-btn flat label="关于" to="/home/about" class="ui-menu-item" />
        </q-toolbar-title>
        <q-space />
        <q-toolbar-title shrink class="text-subtitle2">
          {{
            taskStore.task
              ? taskStore.task!.name + (taskStore.saved ? "" : "*")
              : ""
          }}
        </q-toolbar-title>
        <q-space />
        <q-icon
          :name="$q.dark.isActive ? 'bi-moon' : 'bi-sun'"
          size="1rem"
          class="ui-icon"
          @click="$q.dark.toggle"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      :model-value="taskStore.task !== null"
      :show-if-above="false"
      :mini="mini"
      :width="200"
      side="left"
      @mouseover="mini = false"
      @mouseout="mini = true"
    >
      <q-list class="full-height column">
        <q-item
          v-ripple
          clickable
          :disable="!taskStore.task"
          to="/home/task/basic"
          active-class="bg-secondary text-accent"
        >
          <q-item-section avatar>
            <q-icon name="bi-info-circle" />
          </q-item-section>
          <q-item-section class="text-subtitle1"> 基本信息 </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          :disable="!taskStore.task"
          to="/home/task/services"
          active-class="bg-secondary text-accent"
        >
          <q-item-section avatar>
            <q-icon name="bi-cpu" />
          </q-item-section>
          <q-item-section class="text-subtitle1"> 服务配置 </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          :disable="!taskStore.task"
          to="/home/task/routes"
          active-class="bg-secondary text-accent"
        >
          <q-item-section avatar>
            <q-icon name="bi-router" />
          </q-item-section>
          <q-item-section class="text-subtitle1"> 路由配置 </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page :style-fn="pageStyle">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { QDialogOptions } from "quasar";
import Brand from "~/assets/brand.png";
import Logo from "~/assets/logo.png";
import { useTaskStore } from "~/stores";

const $q = useQuasar();
const router = useRouter();
const taskStore = useTaskStore();

taskStore.loadRecentTasks();
onBeforeUnmount(taskStore.saveRecentTasks);

// watch for task change
watch(
  () => taskStore.task,
  () => {
    if (taskStore.direct) {
      taskStore.direct = false;
    } else {
      taskStore.saved = false;
    }
  },
  { deep: true }
);

// mini drawer
const mini = ref(false);

// page style
function pageStyle(offset: number, height: number) {
  const h = `${height - offset}px`;
  return {
    minHeight: h,
    height: h,
    overflow: "auto",
  };
}

const saveDialog: QDialogOptions = {
  title: "提示",
  message: "是否保存当前任务？",
  cancel: true,
  persistent: true,
  class: "bg-secondary",
  options: {
    type: "radio",
    model: "save",
    inline: true,
    items: [
      { label: "保存", value: "save" },
      { label: "不保存", value: "dont" },
    ],
  },
};

// new task
function newTask() {
  if (!taskStore.saved) {
    $q.dialog(saveDialog).onOk(async (data: string) => {
      if (data === "save") {
        await taskStore.saveTask();
      }
      taskStore.newTask();
      router.push("/home/task/basic");
    });
  } else {
    taskStore.newTask();
    router.push("/home/task/basic");
  }
}
// close task
function closeTask() {
  if (!taskStore.saved) {
    $q.dialog(saveDialog).onOk(async (data: string) => {
      if (data === "save") {
        await taskStore.saveTask();
      }
      taskStore.closeTask();
      router.push("/home");
    });
  } else {
    taskStore.closeTask();
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
.ui-icon {
  cursor: pointer;
  &:hover {
    color: var(--ui-accent);
  }
}
</style>
