<template>
  <q-layout view="hHh lpR fFf" class="fullscreen">
    <q-header>
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
                <q-item v-ripple v-close-popup clickable @click="openTask">
                  <q-item-section>打开任务</q-item-section>
                </q-item>
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  :disable="!isTaskOpen"
                  @click="saveTask"
                >
                  <q-item-section>保存任务</q-item-section>
                </q-item>
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  :disable="!isTaskOpen"
                  @click="closeTask"
                >
                  <q-item-section>关闭任务</q-item-section>
                </q-item>
                <q-separator />
                <q-item v-ripple v-close-popup clickable to="/home/task/manage">
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
          {{ isTaskOpen ? taskStore.task!.name : "" }}
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
      :model-value="isTaskOpen"
      :show-if-above="false"
      :mini="mini"
      :width="200"
      side="left"
      class="ui-drawer"
      @mouseover="mini = false"
      @mouseout="mini = true"
    >
      <q-list class="full-height column">
        <q-item
          v-ripple
          clickable
          :disable="!isTaskOpen"
          to="/home/task/basic"
          active-class="ui-tab-active"
        >
          <q-item-section avatar>
            <q-icon name="bi-info-circle" />
          </q-item-section>
          <q-item-section class="text-subtitle1"> 基本信息 </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          :disable="!isTaskOpen"
          to="/home/task/services"
          active-class="ui-tab-active"
        >
          <q-item-section avatar>
            <q-icon name="bi-cpu" />
          </q-item-section>
          <q-item-section class="text-subtitle1"> 服务配置 </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          :disable="!isTaskOpen"
          to="homr/task/routes"
          active-class="ui-tab-active"
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
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Brand from "~/assets/brand.png";
import Logo from "~/assets/logo.png";

import { useTaskStore } from "~/stores/task";

const router = useRouter();
const taskStore = useTaskStore();

// current task
const isTaskOpen = computed(() => {
  return taskStore.task !== null;
});

// mini drawer
const mini = ref(false);

// page style
function pageStyle(offset: number, height: number) {
  const h = `${height - offset}px`;
  return {
    minHeight: h,
    height: h,
  };
}

// new task
function newTask() {
  router.push("/home/task");
}

// open task
function openTask() {
  router.push("/home/task/manage");
}

// save task
function saveTask() {
  router.push("/home/task?id=-1");
}

// close task
function closeTask() {
  router.push("/home");
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
.ui-tab-active {
  background-color: var(--q-negative);
  color: var(--q-accent);
}
</style>
