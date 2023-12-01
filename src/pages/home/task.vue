<template>
  <q-splitter
    :model-value="20"
    :limits="[20, 20]"
    separator-class="transparent"
    class="fit q-pa-md"
  >
    <template #before>
      <q-card flat class="q-mx-auto transparent q-pa-xl t-card">
        <q-card-section
          v-for="(item, index) in steps"
          :key="index"
          horizontal
          class="flex justify-center q-py-md q-mb-xl"
        >
          <q-separator
            :color="step === item.name ? 'accent' : 'transparent'"
            vertical
            size="4px"
          />
          <q-btn
            :to="`/home/task/${item.name}`"
            :text-color="step === item.name ? 'accent' : 'foreground'"
            flat
            square
            size="1rem"
            class="full-width bg-secondary"
            @click="step = item.name"
          >
            {{ item.title }}
          </q-btn>
        </q-card-section>
      </q-card>
    </template>
    <template #after>
      <router-view />
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores";

const $q = useQuasar();
const router = useRouter();

const taskStore = useTaskStore();

const step = ref("");

const steps = [
  { name: "", title: "任务信息" },
  { name: "agents", title: "智能服务" },
  { name: "simenvs", title: "仿真服务" },
];

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
  {
    immediate: true,
    deep: true,
  },
);

onActivated(() => {
  if (!taskStore.task) {
    $q.notify({
      type: "warning",
      message: "暂无任务",
    });
    router.push("/home");
  }
});
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.t-card {
  width: 75%;
}
</style>
