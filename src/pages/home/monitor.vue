<template>
  <div class="fit row items-center q-py-lg">
    <div class="full-width">
      <div class="row q-mx-auto q-px-md bg-secondary ui-monitor-bar">
        <q-btn
          flat
          dense
          round
          size="md"
          icon="bi-arrow-up-circle"
          @click="push"
        >
          <q-tooltip anchor="top middle" self="center middle"> 推送 </q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          round
          size="md"
          icon="bi-arrow-down-circle"
          @click="pull"
        >
          <q-tooltip anchor="top middle" self="center middle"> 拉取 </q-tooltip>
        </q-btn>
        <q-space />
        <q-btn
          :disable="!inited || state !== 'stopped'"
          flat
          dense
          round
          size="md"
          icon="bi-play-circle"
          @click="start"
        >
          <q-tooltip anchor="top middle" self="center middle"> 开始 </q-tooltip>
        </q-btn>
        <q-btn
          :disable="!inited || state !== 'running'"
          flat
          dense
          round
          size="md"
          icon="bi-pause-circle"
          @click="pause"
        >
          <q-tooltip anchor="top middle" self="center middle"> 暂停 </q-tooltip>
        </q-btn>
        <q-btn
          :disable="!inited || state !== 'suspended'"
          flat
          dense
          round
          size="md"
          icon="bi-skip-start-circle flip-horizontal"
          @click="step"
        >
          <q-tooltip anchor="top middle" self="center middle"> 步进 </q-tooltip>
        </q-btn>
        <q-btn
          :disable="!inited || state !== 'suspended'"
          flat
          dense
          round
          size="md"
          icon="bi-fast-forward-circle"
          @click="resume"
        >
          <q-tooltip anchor="top middle" self="center middle"> 继续 </q-tooltip>
        </q-btn>
        <q-btn
          :disable="!inited || state === 'stopped'"
          flat
          dense
          round
          size="md"
          icon="bi-stop-circle"
          @click="stop"
        >
          <q-tooltip anchor="top middle" self="center middle"> 停止 </q-tooltip>
        </q-btn>
        <q-space />
        <q-btn
          flat
          dense
          round
          size="md"
          icon="bi-arrow-repeat"
          @click="refresh"
        >
          <q-tooltip anchor="top middle" self="center middle"> 刷新 </q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          round
          size="md"
          icon="bi-arrow-clockwise"
          @click="reset"
        >
          <q-tooltip anchor="top middle" self="center middle"> 重置 </q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-card flat class="column q-mx-auto q-my-lg ui-monitor-card">
      <q-card-section horizontal class="col-shrink text-accent">
        <q-card-section>服务</q-card-section>
        <q-space />
        <q-card-section class="q-py-none flex items-center">
          <q-select
            v-model="serviceOption"
            :options="serviceOptions"
            :disable="!inited"
            dense
            emit-value
            map-options
            standout="bg-ignore"
            input-class="text-foreground"
            popup-content-class="shadow-0 bg-secondary"
            options-selected-class="text-accent"
            class="ui-monitor-select"
          />
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="serviceOption" horizontal class="col-grow row">
        <q-card-section class="col">
          <component
            :is="
              getAsyncComp(
                services[serviceOption].infos.type,
                services[serviceOption].configs.type
              )
            "
            :status="details[serviceOption]"
          />
        </q-card-section>
        <q-card-section
          v-if="services[serviceOption].infos.type === 'simenv'"
          class="col"
        >
        </q-card-section>
        <q-card-section
          v-else-if="services[serviceOption].infos.type === 'agent'"
          class="col column justify-around"
        >
          <q-btn-toggle
            v-model="srctgtOption"
            :options="srctgtOptions"
            spread
            toggle-color="secondary"
            toggle-text-color="accent"
          />
          <q-btn-group spread>
            <q-btn color="primary" label="加载权重" @click="loadWeights" />
            <q-btn color="primary" label="保存权重" @click="saveWeights" />
          </q-btn-group>
          <q-btn-group spread>
            <q-btn color="primary" label="加载经验" @click="loadBuffer" />
            <q-btn color="primary" label="保存经验" @click="saveBuffer" />
          </q-btn-group>
          <q-btn-group spread>
            <q-btn color="primary" label="加载状态" @click="loadStatus" />
            <q-btn color="primary" label="保存状态" @click="saveStatus" />
          </q-btn-group>
        </q-card-section>
      </q-card-section>
      <q-card-section v-else class="col-grow row flex-center">
        <h4 class="text-secondary text-weight-bold">暂无服务</h4>
      </q-card-section>
    </q-card>
    <q-card flat class="column q-mx-auto ui-monitor-card">
      <q-card-section horizontal class="col-shrink text-accent">
        <q-card-section>日志</q-card-section>
        <q-space />
        <q-card-section class="q-py-none flex items-center">
          <q-select
            v-model="messageOption"
            :options="messageOptions"
            dense
            emit-value
            map-options
            standout="bg-ignore"
            input-class="text-foreground"
            popup-content-class="shadow-0 bg-secondary"
            options-selected-class="text-accent"
            class="ui-monitor-select"
          >
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-chip :text-color="scope.opt.value">
                    {{ messageLength(scope.opt.value) }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-section class="col-grow">
        <q-scroll-area class="full-height">
          <div v-for="msg in messages" :key="msg.time" class="q-mb-xs">
            <template v-if="messageOption.includes(msg.type)">
              <span :class="`text-${msg.type}`">
                [{{ msg.time }}] >> {{ msg.text }}
              </span>
            </template>
          </div>
          <div class="q-mb-xl">
            <span class="text-foreground">
              [{{ getTimeString(timer) }}] >>
            </span>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { AnyDict, ServiceInfo, SimenvConfig, AgentConfig } from "~/api";
import { useAppStore, useTaskStore } from "~/stores";
import { isEmpty, getTimeString } from "~/utils";

const $q = useQuasar();
const appStore = useAppStore();
const taskStore = useTaskStore();

type Services = {
  [key: string]: {
    infos: ServiceInfo;
    configs: SimenvConfig | AgentConfig;
  };
};
const services = ref({} as Services);
const inited = computed(() => !isEmpty(services.value));

async function push() {
  const success = "任务推送成功";
  const failure = "任务推送失败";
  if (!taskStore.task) {
    $q.notify({ type: "warning", message: "请先打开一个任务" });
  } else {
    try {
      const { response } = await appStore.grpc!.queryService({ ids: [] });
      let inited = false;
      for (const { state } of Object.values(response.states)) {
        if (state) {
          inited = true;
          break;
        }
      }
      if (inited) {
        $q.notify({
          type: "negative",
          message: failure + "，云端已有任务运行",
        });
      } else {
        services.value = taskStore.task.services as unknown as Services;
        await appStore.grpc!.resetService({ ids: [] });
        await appStore.grpc!.resetServer({});
        await appStore.grpc!.registerService({
          services: Object.fromEntries(
            Object.entries(services.value).map(([id, srv]) => [id, srv.infos])
          ),
        });
        await appStore.grpc!.setSimenvConfig({
          configs: Object.fromEntries(
            Object.entries(services.value)
              .filter(([, srv]) => srv.infos.type === "simenv")
              .map(([id, srv]) => {
                const configs = srv.configs as SimenvConfig;
                return [
                  id,
                  { type: configs.type, args: JSON.stringify(configs.args) },
                ];
              })
          ),
        });
        await appStore.grpc!.setAgentConfig({
          configs: Object.fromEntries(
            Object.entries(services.value)
              .filter(([, srv]) => srv.infos.type === "simenv")
              .map(([id, srv]) => {
                const configs = srv.configs as AgentConfig;
                return [
                  id,
                  {
                    training: configs.training,
                    type: configs.type,
                    hypers: JSON.stringify(configs.hypers),
                    sifunc: configs.sifunc,
                    oafunc: configs.oafunc,
                    rewfunc: configs.rewfunc,
                  },
                ];
              })
          ),
        });
        $q.notify({ type: "positive", message: success });
        addMsg(success);
      }
    } catch (e) {
      $q.notify({ type: "negative", message: failure });
      addMsg(failure + "：" + e, "negative");
    }
  }
}
async function pull() {
  const success = "任务拉取成功";
  const failure = "任务拉取失败";
  if (taskStore.task) {
    $q.notify({ type: "warning", message: "请先关闭当前任务" });
  } else {
    try {
      const { response } = await appStore.grpc!.queryService({ ids: [] });
      let inited = Object.keys(response.states).length > 0;
      for (const { state } of Object.values(response.states)) {
        if (!state) {
          inited = false;
          break;
        }
      }
      if (!inited) {
        $q.notify({
          type: "negative",
          message: failure + "，云端尚无任务运行",
        });
      } else {
        services.value = {};
        const simenvs = await appStore.grpc!.getSimenvConfig({ ids: [] });
        const agents = await appStore.grpc!.getAgentConfig({ ids: [] });
        const infos = await appStore.grpc!.getServiceInfo({ ids: [] });
        for (const [id, info] of Object.entries(infos)) {
          if (info.type === "simenv") {
            services.value[id] = {
              infos: info,
              configs: simenvs.response.configs[id],
            };
          } else if (info.type === "agent") {
            services.value[id] = {
              infos: info,
              configs: agents.response.configs[id],
            };
          }
        }
        $q.notify({ type: "positive", message: success });
        addMsg(success);
      }
    } catch (e) {
      $q.notify({ type: "negative", message: failure });
      addMsg(failure + "：" + e, "negative");
    }
  }
}

const state = ref("stopped");
async function control(type: string, params: AnyDict = {}) {
  return appStore.grpc!.simControl({
    cmds: Object.fromEntries(
      Object.keys(services.value).map((id) => [
        id,
        {
          type: type,
          params: JSON.stringify(params),
        },
      ])
    ),
  });
}
async function start() {
  try {
    await control("init");
    await control("start");
    state.value = "running";
    addMsg("任务开始运行");
  } catch (e) {
    addMsg("开始任务失败：" + e, "negative");
  }
}
async function pause() {
  try {
    await control("pause");
    state.value = "suspended";
    addMsg("任务暂停运行");
  } catch (e) {
    addMsg("暂停任务失败：" + e, "negative");
  }
}
async function step() {
  try {
    await control("step");
    addMsg("任务单步运行");
  } catch (e) {
    addMsg("步进任务失败：" + e, "negative");
  }
}
async function resume() {
  try {
    await control("resume");
    state.value = "running";
    addMsg("任务继续运行");
  } catch (e) {
    addMsg("继续任务失败：" + e, "negative");
  }
}
async function stop() {
  try {
    await control("stop");
    state.value = "stopped";
    addMsg("任务停止运行");
  } catch (e) {
    addMsg("停止任务失败：" + e, "negative");
  }
}

const details = ref(
  {} as {
    [key: string]: AnyDict;
  }
);
async function refresh() {
  try {
    const infos = await appStore.grpc!.simMonitor({
      ids: Object.keys(services.value).filter(
        (id) => services.value[id].infos.type === "simenv"
      ),
    });
    for (const [k, v] of Object.entries(infos.response.infos)) {
      details.value[k] = v;
    }
    const status = await appStore.grpc!.getModelStatus({
      ids: Object.keys(services.value).filter(
        (id) => services.value[id].infos.type === "agent"
      ),
    });
    for (const [k, v] of Object.entries(status.response.status)) {
      details.value[k] = v;
    }
    addMsg("刷新状态成功");
  } catch (e) {
    addMsg("刷新状态失败：" + e, "negative");
  }
}
async function reset() {
  $q.dialog({
    title: "提示",
    message: "确定要重置服务吗？",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await appStore.grpc!.resetService({ ids: [] });
      await appStore.grpc!.resetServer({});
      addMsg("服务重置成功");
    } catch (e) {
      addMsg("重置服务失败：" + e, "negative");
    }
  });
}

const serviceOptions = computed(() =>
  Object.entries(services.value).map(([id, srv]) => ({
    value: id,
    label: srv.infos.name,
  }))
);
const serviceOption = ref("");
function getAsyncComp(type1: string, type2: string) {
  return defineAsyncComponent(
    () => import(`../../plugins/${type1}s/${type2.toLowerCase()}/status.vue`)
  );
}

const srctgtOptions = ref([
  { label: "云端", value: "cloud", icon: "bi-cloud" },
  { label: "本地", value: "local", icon: "bi-laptop" },
]);
const srctgtOption = ref(srctgtOptions.value[0].value);

async function loadWeights() {
  switch (srctgtOption.value) {
    case "cloud":
      try {
        const weights = await appStore.grpc!.getModelWeights({
          ids: Object.keys(services.value).filter(
            (id) => services.value[id].infos.type === "agent"
          ),
        });
        for (const [k, v] of Object.entries(weights.response.weights)) {
          details.value[k] = v;
        }
        addMsg("加载权重成功");
      } catch (e) {
        addMsg("加载权重失败：" + e, "negative");
      }
      break;
    case "local":
      try {
        const weights = await appStore.grpc!.getLocalWeights({
          ids: Object.keys(services.value).filter(
            (id) => services.value[id].infos.type === "agent"
          ),
        });
        for (const [k, v] of Object.entries(weights.response.weights)) {
          details.value[k] = v;
        }
        addMsg("加载权重成功");
      } catch (e) {
        addMsg("加载权重失败：" + e, "negative");
      }
      break;
  }
}
async function saveWeights() {}

type Message = {
  time: string;
  type: "info" | "warning" | "negative";
  text: string;
};
const messages = ref([] as Message[]);
function addMsg(text: string, type: Message["type"] = "info") {
  if (messages.value.length > appStore.systemSettings.maxTerminalMessages) {
    messages.value.shift();
  }
  messages.value.push({
    time: getTimeString(),
    type,
    text,
  });
}
const messageOptions = ref([
  { label: "全部", value: "info|warning|negative" },
  { label: "信息", value: "info" },
  { label: "警告", value: "warning" },
  { label: "错误", value: "negative" },
]);
const messageOption = ref(messageOptions.value[0].value);
const messageLength = computed(() => {
  return (type: string) =>
    messages.value.filter((item) => type.includes(item.type)).length;
});
let timer = ref(Date.now());
const interval = setInterval(() => {
  timer.value = Date.now();
}, 1000);
onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped lang="scss">
.ui-monitor-bar {
  max-width: 36%;
  border-radius: 1.5rem;
}
.ui-monitor-card {
  width: 64%;
  height: 45%;
}
.ui-monitor-select {
  width: 15rem;
}
</style>
