<template>
  <q-splitter
    :model-value="20"
    :limits="[20, 20]"
    separator-class="transparent"
    class="fit q-pa-md"
  >
    <template #before>
      <q-card flat class="q-mx-auto transparent q-pa-xl t-card">
        <q-card-section horizontal class="flex justify-center q-py-md">
          <q-separator
            vertical
            size="4px"
            :color="step === 'infos' ? 'accent' : 'transparent'"
          />
          <q-btn
            flat
            square
            :text-color="step === 'infos' ? 'accent' : 'foreground'"
            size="1rem"
            to="/home/task/infos"
            class="full-width bg-secondary"
            @click="step = 'infos'"
          >
            任务信息
          </q-btn>
        </q-card-section>
        <q-separator color="transparent" class="q-my-lg" />
        <q-card-section horizontal class="flex justify-center q-py-md">
          <q-separator
            vertical
            size="4px"
            :color="step === 'agents' ? 'accent' : 'transparent'"
          />
          <q-btn
            flat
            square
            :text-color="step === 'agents' ? 'accent' : 'foreground'"
            size="1rem"
            to="/home/task/agents"
            class="full-width bg-secondary"
            @click="step = 'agents'"
          >
            智能服务
          </q-btn>
        </q-card-section>
        <q-separator color="transparent" class="q-my-lg" />
        <q-card-section horizontal class="flex justify-center q-py-md">
          <q-separator
            vertical
            size="4px"
            :color="step === 'simenvs' ? 'accent' : 'transparent'"
          />
          <q-btn
            flat
            square
            :text-color="step === 'simenvs' ? 'accent' : 'foreground'"
            size="1rem"
            to="/home/task/simenvs"
            class="full-width bg-secondary"
            @click="step = 'simenvs'"
          >
            仿真服务
          </q-btn>
        </q-card-section>
      </q-card>
    </template>
    <template #after>
      <div class="flex flex-center">
        <router-view />
      </div>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores";

const $q = useQuasar();
const router = useRouter();

const taskStore = useTaskStore();

if (!taskStore.task) {
  $q.notify({
    type: "warning",
    message: "暂无任务",
  });
  router.push("/home");
}

const step = ref("infos");

// watch for task change
watch(
  () => taskStore.task,
  () => {
    if (taskStore.direct) {
      taskStore.direct = false;
    } else {
      taskStore.saved = false;
    }
  }
);
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.t-card {
  width: 75%;
}
</style>
