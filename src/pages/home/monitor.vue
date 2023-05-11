<template>
  <div class="fit row items-center q-py-lg">
    <div class="full-width">
      <div
        class="row justify-around q-mx-auto q-px-md bg-secondary ui-monitor-bar1"
      >
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
        <q-btn
          :disable="notask"
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
          :disable="notask"
          flat
          dense
          round
          size="md"
          icon="bi-arrow-down-circle"
          @click="pull"
        >
          <q-tooltip anchor="top middle" self="center middle"> 拉取 </q-tooltip>
        </q-btn>
        <q-btn
          :disable="notask || uninited"
          flat
          dense
          round
          size="md"
          icon="bi-arrow-repeat"
          @click="refresh"
        >
          <q-tooltip anchor="top middle" self="center middle"> 刷新 </q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-card flat class="column q-mx-auto q-my-lg ui-monitor-card">
      <q-card-section horizontal class="col-shrink text-accent">
        <q-card-section>服务</q-card-section>
        <q-space />
        <q-card-section class="q-py-none flex items-center">
          <q-select
            v-model="service"
            :options="services"
            :disable="notask || uninited"
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
      <q-card-section v-if="service" horizontal class="col-grow row">
        <q-card-section class="col-8">
          <component
            :is="
              getAsyncComp(
                taskStore.task!.services[service].infos.type,
                taskStore.task!.services[service].configs.type
              )
            "
            :details="details[service]"
          />
        </q-card-section>
        <q-card-section
          v-if="taskStore.task!.services[service].infos.type === 'simenv'"
          class="col-grow full-height column flex-center"
        >
          <div class="row justify-around q-px-md bg-secondary ui-monitor-bar2">
            <q-btn
              :disable="
                details[service].state === 'running' ||
                details[service].state === 'suspended'
              "
              flat
              dense
              round
              size="md"
              icon="bi-play-circle"
              @click="start"
            >
              <q-tooltip anchor="top middle" self="center middle">
                开始
              </q-tooltip>
            </q-btn>
            <q-btn
              :disable="details[service].state !== 'running'"
              flat
              dense
              round
              size="md"
              icon="bi-pause-circle"
              @click="pause"
            >
              <q-tooltip anchor="top middle" self="center middle">
                暂停
              </q-tooltip>
            </q-btn>
            <q-btn
              :disable="details[service].state !== 'suspended'"
              flat
              dense
              round
              size="md"
              icon="bi-skip-start-circle flip-horizontal"
              @click="step"
            >
              <q-tooltip anchor="top middle" self="center middle">
                步进
              </q-tooltip>
            </q-btn>
            <q-btn
              :disable="details[service].state !== 'suspended'"
              flat
              dense
              round
              size="md"
              icon="bi-fast-forward-circle"
              @click="resume"
            >
              <q-tooltip anchor="top middle" self="center middle">
                继续
              </q-tooltip>
            </q-btn>
            <q-btn
              :disable="
                details[service].state === 'uninited' ||
                details[service].state === 'stopped'
              "
              flat
              dense
              round
              size="md"
              icon="bi-stop-circle"
              @click="stop"
            >
              <q-tooltip anchor="top middle" self="center middle">
                停止
              </q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
        <q-card-section
          v-else-if="taskStore.task!.services[service].infos.type === 'agent'"
          class="col-grow column justify-around"
        >
          <q-btn-toggle
            v-model="srcdesOption"
            :options="srcdesOptions"
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
          <q-input
            v-model="tensorboardPort"
            dense
            standout="bg-ignore"
            input-class="text-foreground"
            class="full-width"
          >
            <template #after>
              <q-btn
                round
                icon="bi-fonts"
                color="secondary"
                text-color="accent"
                @click="openTensorboard"
              >
                <q-tooltip anchor="top middle" self="center middle">
                  打开Tensorboard窗口
                </q-tooltip>
              </q-btn>
            </template>
          </q-input>
        </q-card-section>
      </q-card-section>
      <q-card-section v-else class="col-grow row flex-center">
        <h4 class="text-secondary text-weight-bold">暂无内容</h4>
      </q-card-section>
    </q-card>
    <q-card flat class="column q-mx-auto ui-monitor-card">
      <q-card-section horizontal class="col-shrink text-accent">
        <q-card-section>日志</q-card-section>
        <q-space />
        <q-card-section class="q-py-none flex items-center">
          <q-btn
            flat
            dense
            round
            size="md"
            icon="bi-x-circle"
            class="q-mr-lg"
            @click="clearMessages"
          >
            <q-tooltip anchor="top middle" self="center middle">
              清空日志
            </q-tooltip>
          </q-btn>
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
              [{{ getTimeString(logTimer) }}] >>
            </span>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { fileOpen, fileSave } from "browser-fs-access";
import { AnyDict, SimenvTable, AgentTable } from "~/api";
import { useAppStore, useTaskStore } from "~/stores";
import { getTimeString } from "~/utils";

const $q = useQuasar();
const appStore = useAppStore();
const taskStore = useTaskStore();

// -----------------------------------------------

const notask = computed(() => taskStore.task === null);
const uninited = ref(true);

const services = computed(() =>
  Object.entries(taskStore.task?.services ?? {}).map(([id, srv]) => ({
    value: id,
    label: srv.infos.name,
  }))
);
const details = ref(
  {} as {
    [key: string]: AnyDict;
  }
);
const service = ref("");

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
      details.value = {};
      service.value = "";
      uninited.value = true;
      addMsg("服务重置完成");
    } catch (e) {
      addMsg("重置服务失败：" + e, "negative");
    }
  });
}
async function push() {
  const success = "任务推送成功";
  const failure = "任务推送失败";
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
      addMsg(failure + "，云端已有任务运行", "negative");
    } else {
      const services = taskStore.task!.services;
      await appStore.grpc!.resetService({ ids: [] });
      await appStore.grpc!.resetServer({});
      await appStore.grpc!.registerService({
        services: Object.fromEntries(
          Object.entries(services).map(([id, srv]) => [id, srv.infos])
        ),
      });
      await appStore.grpc!.setSimenvConfig({
        configs: Object.fromEntries(
          Object.entries(services)
            .filter(([, srv]) => srv.infos.type === "simenv")
            .map(([id, srv]) => {
              const configs = srv.configs as SimenvTable;
              return [
                id,
                { type: configs.type, args: JSON.stringify(configs.args) },
              ];
            })
        ),
      });
      await appStore.grpc!.setAgentConfig({
        configs: Object.fromEntries(
          Object.entries(services)
            .filter(([, srv]) => srv.infos.type === "agent")
            .map(([id, srv]) => {
              const configs = srv.configs as AgentTable;
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
      // setRefreshInterval();
      await refresh();
      uninited.value = false;
      addMsg(success);
    }
  } catch (e) {
    addMsg(failure + "：" + e, "negative");
  }
}
async function pull() {
  const success = "任务拉取成功";
  const failure = "任务拉取失败";
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
      addMsg(failure + "，云端尚无任务运行", "negative");
    } else {
      const services = taskStore.task!.services;
      const simenvs = await appStore.grpc!.getSimenvConfig({ ids: [] });
      const agents = await appStore.grpc!.getAgentConfig({ ids: [] });
      const infos = await appStore.grpc!.getServiceInfo({ ids: [] });
      for (const [id, info] of Object.entries(infos)) {
        if (info.type === "simenv") {
          const simenv = simenvs.response.configs[id];
          taskStore.task!.services[id] = {
            infos: info,
            configs: {
              ...services[id].configs,
              type: simenv.type,
              args: JSON.parse(simenv.args),
            },
          };
        } else if (info.type === "agent") {
          const agent = agents.response.configs[id];
          taskStore.task!.services[id] = {
            infos: info,
            configs: {
              ...services[id].configs,
              training: agent.training,
              type: agent.type,
              hypers: JSON.parse(agent.hypers),
              sifunc: agent.sifunc,
              oafunc: agent.oafunc,
              rewfunc: agent.rewfunc,
            },
          };
        }
      }
      // setRefreshInterval();
      await refresh();
      uninited.value = false;
      addMsg(success);
    }
  } catch (e) {
    addMsg(failure + "：" + e, "negative");
  }
}
async function refresh() {
  try {
    const infos = await appStore.grpc!.simMonitor({ ids: [] });
    for (const [k, v] of Object.entries(infos.response.infos)) {
      details.value[k] = v;
      details.value[k].data = JSON.parse(v.data);
      details.value[k].logs = JSON.parse(v.logs);
    }
    const status = await appStore.grpc!.getModelStatus({ ids: [] });
    for (const [k, v] of Object.entries(status.response.status)) {
      details.value[k] = v;
      details.value[k].status = JSON.parse(v.status);
    }
    addMsg("刷新状态成功");
  } catch (e) {
    addMsg("刷新状态失败：" + e, "negative");
  }
}

function getAsyncComp(type1: string, type2: string) {
  return defineAsyncComponent(
    () => import(`../../plugins/${type1}s/${type2.toLowerCase()}/details.vue`)
  );
}

// let refreshInterval = 0;
// function setRefreshInterval() {
//   if (refreshInterval) {
//     window.clearInterval(refreshInterval);
//     refreshInterval = 0;
//   }
//   if (appStore.systemSettings.detailsRefreshInterval > 0) {
//     refreshInterval = window.setInterval(() => {
//       refresh();
//     }, appStore.systemSettings.detailsRefreshInterval);
//   }
// }
// onBeforeUnmount(() => {
//   if (refreshInterval) {
//     window.clearInterval(refreshInterval);
//   }
// });

// -----------------------------------------------

async function control(type: string, params: AnyDict = {}) {
  return appStore.grpc!.simControl({
    cmds: {
      [service.value]: {
        type: type,
        params: JSON.stringify(params),
      },
    },
  });
}
async function start() {
  try {
    await control("init");
    await control("start");
    details.value[service.value].state = "running";
    addMsg("任务开始运行");
  } catch (e) {
    addMsg("开始任务失败：" + e, "negative");
  }
}
async function pause() {
  try {
    await control("pause");
    details.value[service.value].state = "suspended";
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
    details.value[service.value].state = "running";
    addMsg("任务继续运行");
  } catch (e) {
    addMsg("继续任务失败：" + e, "negative");
  }
}
async function stop() {
  try {
    await control("stop");
    details.value[service.value].state = "stopped";
    addMsg("任务停止运行");
  } catch (e) {
    addMsg("停止任务失败：" + e, "negative");
  }
}

// -----------------------------------------------

const srcdesOptions = ref([
  { label: "云端", value: "cloud", icon: "bi-cloud" },
  { label: "本地", value: "local", icon: "bi-laptop" },
]);
const srcdesOption = ref(srcdesOptions.value[0].value);

async function loadWeights() {
  try {
    let weights: Uint8Array = new Uint8Array();
    if (srcdesOption.value === "cloud") {
      const response = await appStore.rest!.select("agent", ["weights"], {
        id: taskStore.task!.services[service.value].configs.id,
      });
      if (response.length === 0 || !response[0].weights) {
        throw new Error("云端权重为空");
      } else {
        weights = response[0].weights;
      }
    } else if (srcdesOption.value === "local") {
      const blob = await fileOpen({
        description: "weights.pkl",
        extensions: [".pkl"],
        mimeTypes: ["application/octet-stream"],
        multiple: false,
      });
      if (blob.length === 0) {
        throw new Error("本地权重为空");
      } else {
        weights = new Uint8Array(await blob.arrayBuffer());
      }
    }
    await appStore.grpc!.setModelWeights({
      weights: {
        [service.value]: { weights },
      },
    });
    addMsg("加载权重成功");
  } catch (e) {
    addMsg("加载权重失败：" + e, "negative");
  }
}
async function saveWeights() {
  try {
    const weights = await appStore.grpc!.getModelWeights({
      ids: [service.value],
    });
    if (srcdesOption.value === "cloud") {
      await appStore.rest!.update("agent", {
        id: taskStore.task!.services[service.value].configs.id,
        weights: weights.response.weights[service.value].weights,
      });
    } else if (srcdesOption.value === "local") {
      const blob = new Blob([weights.response.weights[service.value].weights]);
      await fileSave(blob, {
        fileName: "weights.pkl",
        extensions: [".pkl"],
      });
    }
    addMsg("保存权重成功");
  } catch (e) {
    addMsg("保存权重失败：" + e, "negative");
  }
}
async function loadBuffer() {
  try {
    let buffer: Uint8Array = new Uint8Array();
    if (srcdesOption.value === "cloud") {
      const response = await appStore.rest!.select("agent", ["buffer"], {
        id: taskStore.task!.services[service.value].configs.id,
      });
      if (response.length === 0 || !response[0].buffer) {
        throw new Error("云端经验为空");
      } else {
        buffer = response[0].buffer;
      }
    } else if (srcdesOption.value === "local") {
      const blob = await fileOpen({
        description: "buffer.pkl",
        extensions: [".pkl"],
        mimeTypes: ["application/octet-stream"],
        multiple: false,
      });
      if (blob.length === 0) {
        throw new Error("本地经验为空");
      } else {
        buffer = new Uint8Array(await blob.arrayBuffer());
      }
    }
    await appStore.grpc!.setModelBuffer({
      buffers: {
        [service.value]: { buffer },
      },
    });
    addMsg("加载经验成功");
  } catch (e) {
    addMsg("加载经验失败：" + e, "negative");
  }
}
async function saveBuffer() {
  try {
    const buffer = await appStore.grpc!.getModelBuffer({
      ids: [service.value],
    });
    if (srcdesOption.value === "cloud") {
      await appStore.rest!.update("agent", {
        id: taskStore.task!.services[service.value].configs.id,
        buffer: buffer.response.buffers[service.value].buffer,
      });
    } else if (srcdesOption.value === "local") {
      const blob = new Blob([buffer.response.buffers[service.value].buffer]);
      await fileSave(blob, {
        fileName: "buffer.pkl",
        extensions: [".pkl"],
      });
    }
    addMsg("保存经验成功");
  } catch (e) {
    addMsg("保存经验失败：" + e, "negative");
  }
}
async function loadStatus() {
  try {
    let status = "{}";
    if (srcdesOption.value === "cloud") {
      const response = await appStore.rest!.select("agent", ["status"], {
        id: taskStore.task!.services[service.value].configs.id,
      });
      if (response.length === 0 || !response[0].status) {
        throw new Error("云端状态为空");
      } else {
        status = JSON.stringify(response[0].status);
      }
    } else if (srcdesOption.value === "local") {
      const blob = await fileOpen({
        description: "status.json",
        extensions: [".json"],
        mimeTypes: ["application/json"],
        multiple: false,
      });
      if (blob.length === 0) {
        throw new Error("本地状态为空");
      } else {
        status = await blob.text();
      }
    }
    await appStore.grpc!.setModelStatus({
      status: {
        [service.value]: { status },
      },
    });
    addMsg("加载状态成功");
  } catch (e) {
    addMsg("加载状态失败：" + e, "negative");
  }
}
async function saveStatus() {
  try {
    const status = await appStore.grpc!.getModelStatus({
      ids: [service.value],
    });
    if (srcdesOption.value === "cloud") {
      await appStore.rest!.update("agent", {
        id: taskStore.task!.services[service.value].configs.id,
        status: JSON.parse(status.response.status[service.value].status),
      });
    } else if (srcdesOption.value === "local") {
      const blob = new Blob([status.response.status[service.value].status]);
      await fileSave(blob, {
        fileName: "status.json",
        extensions: [".json"],
      });
    }
    addMsg("保存状态成功");
  } catch (e) {
    addMsg("保存状态失败：" + e, "negative");
  }
}

const tensorboardPort = ref(6006);
function openTensorboard() {
  const srv = taskStore.task!.services[service.value].infos;
  const url = `http://${srv.host}:${tensorboardPort.value}`;
  window.open(url, "_blank");
}

// -----------------------------------------------

type Message = {
  time: string;
  type: "info" | "warning" | "negative";
  text: string;
};
const messages = ref([] as Message[]);

function addMsg(text: string, type: Message["type"] = "info") {
  if (messages.value.length >= appStore.systemSettings.maxTerminalMessages) {
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
function clearMessages() {
  messages.value = messages.value.filter(
    (item) => !messageOption.value.includes(item.type)
  );
}

let logTimer = ref(Date.now());
let logTimerInterval = window.setInterval(() => {
  logTimer.value = Date.now();
}, 1000);
onBeforeUnmount(() => {
  window.clearInterval(logTimerInterval);
});
</script>

<style scoped lang="scss">
.ui-monitor-bar1 {
  max-width: 25%;
  border-radius: 1.5rem;
}
.ui-monitor-bar2 {
  width: 100%;
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
