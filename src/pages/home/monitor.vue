<template>
  <div class="fit row items-center q-py-lg">
    <div class="full-width">
      <div
        class="row justify-around q-mx-auto q-px-md bg-secondary ui-monitor-bar1"
      >
        <q-btn
          :disable="running"
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
          :disable="running || notask"
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
          :disable="running || notask"
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
          :disable="running || notask || uninited"
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
            :disable="running || notask || uninited"
            dense
            filled
            clearable
            options-dense
            option-label="server"
            popup-content-class="bg-secondary"
            class="ui-monitor-select"
          />
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="service" horizontal class="col-grow row">
        <template v-if="agents.includes(service as AgentTable)">
          <q-card-section class="col-8">
            <div v-if="rlModels.includes(service.name)" class="fit">
              <component
                :is="getAsyncComp('models', service.name)"
                :details="details[service.server].status"
              />
            </div>
            <div v-else class="fit flex flex-center">
              <h4 class="text-secondary text-weight-bold">暂无数据</h4>
            </div>
          </q-card-section>
          <q-card-section class="col-grow column justify-around">
            <q-btn-group spread>
              <q-btn :disable="running" label="加载权重" @click="loadWeights" />
              <q-btn :disable="running" label="保存权重" @click="saveWeights" />
            </q-btn-group>
            <q-btn-group spread>
              <q-btn :disable="running" label="加载经验" @click="loadBuffer" />
              <q-btn :disable="running" label="保存经验" @click="saveBuffer" />
            </q-btn-group>
            <q-btn-group spread>
              <q-btn :disable="running" label="加载状态" @click="loadStatus" />
              <q-btn :disable="running" label="保存状态" @click="saveStatus" />
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
        </template>
        <template v-if="simenvs.includes(service as SimenvTable)">
          <q-card-section class="col-8">
            <div v-if="simEngines.includes(service.name)" class="fit">
              <component
                :is="getAsyncComp('engines', service.name)"
                :details="details[service.server].data"
              />
            </div>
            <div v-else class="fit flex flex-center">
              <h4 class="text-secondary text-weight-bold">暂无数据</h4>
            </div>
          </q-card-section>
          <q-card-section class="col-grow full-height column flex-center">
            <div
              class="row justify-around q-px-md bg-secondary ui-monitor-bar2"
            >
              <q-btn
                :disable="
                  running ||
                  details[service.server].state === 'RUNNING' ||
                  details[service.server].state === 'SUSPENDED'
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
                :disable="
                  running || details[service.server].state !== 'RUNNING'
                "
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
                :disable="
                  running || details[service.server].state !== 'SUSPENDED'
                "
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
                :disable="
                  running || details[service.server].state !== 'SUSPENDED'
                "
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
                  running ||
                  details[service.server].state === 'UNINITED' ||
                  details[service.server].state === 'STOPPED'
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
        </template>
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
            filled
            emit-value
            map-options
            options-dense
            popup-content-class="bg-secondary"
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
              [{{ getTimestampString(logTimer) }}] >>
            </span>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { fileOpen, fileSave } from "browser-fs-access";
import { AgentTable, SimenvTable, ServiceState_State } from "~/api";
import { useAppStore, useTaskStore } from "~/stores";
import { getTimestampString } from "~/utils";
import rlModels from "~/plugins/models/index.json";
import simEngines from "~/plugins/engines/index.json";

const $q = useQuasar();

const appStore = useAppStore();
const taskStore = useTaskStore();

// -----------------------------------------------

type Service = AgentTable | SimenvTable;

const notask = computed(() => taskStore.task === null);
const agents = computed(() => taskStore.task?.agents ?? []);
const simenvs = computed(() => taskStore.task?.simenvs ?? []);
const services = computed(() => [...agents.value, ...simenvs.value]);
const agentIds = computed(() => agents.value.map((item) => item.server));
const simenvIds = computed(() => simenvs.value.map((item) => item.server));
const serviceIds = computed(() => [...agentIds.value, ...simenvIds.value]);

const running = ref(false);
const uninited = ref(true);
const service = ref<Nullable<Service>>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const details = ref<Record<string, any>>({});

function getAsyncComp(type: string, name: string) {
  return defineAsyncComponent(
    () => import(`../../plugins/${type}/${name.toLowerCase()}/details.vue`),
  );
}

async function reset() {
  $q.dialog({
    title: "提示",
    message: "确定要重置服务吗？",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    running.value = true;
    try {
      await appStore.grpc!.resetService({ ids: serviceIds.value });
      uninited.value = true;
      service.value = null;
      details.value = {};
      clrRefreshInterval();
      addMsg("服务重置完成");
    } catch (e) {
      addMsg("重置服务失败：" + e, "negative");
    }
    running.value = false;
  });
}
async function push() {
  running.value = true;
  const success = "任务推送成功";
  const failure = "任务推送失败";
  try {
    const {
      response: { states },
    } = await appStore.grpc!.queryService({ ids: serviceIds.value });
    for (const { state } of Object.values(states)) {
      if (state === ServiceState_State.INITED) {
        throw new Error("云端已有任务运行");
      }
    }
    await appStore.grpc!.setAgentConfig({
      configs: Object.fromEntries(
        taskStore.task!.agents.map((agent) => {
          const hooks = JSON.parse(agent.hooks) as {
            name: string;
            args: object;
          }[];
          return [
            agent.server,
            {
              training: Boolean(agent.training),
              name: agent.name,
              hypers: agent.hypers,
              sifunc: agent.sifunc,
              oafunc: agent.oafunc,
              rewfunc: agent.rewfunc,
              hooks: hooks.map((hook) => ({
                name: hook.name,
                args: JSON.stringify(hook.args),
              })),
            },
          ];
        }),
      ),
    });
    await appStore.grpc!.setSimenvConfig({
      configs: Object.fromEntries(
        taskStore.task!.simenvs.map((simenv) => [
          simenv.server,
          { name: simenv.name, args: simenv.args },
        ]),
      ),
    });
    uninited.value = false;
    clrRefreshInterval();
    setRefreshInterval();
    addMsg(success);
  } catch (e) {
    addMsg(failure + "：" + e, "negative");
  }
  running.value = false;
}
async function pull() {
  running.value = true;
  const success = "任务拉取成功";
  const failure = "任务拉取失败";
  try {
    const {
      response: { states },
    } = await appStore.grpc!.queryService({ ids: serviceIds.value });
    for (const { state } of Object.values(states)) {
      if (state === ServiceState_State.UNINITED) {
        throw new Error("云端尚无任务运行");
      }
    }
    const {
      response: { configs: agents },
    } = await appStore.grpc!.getAgentConfig({
      ids: agentIds.value,
    });
    for (const [server, agent] of Object.entries(agents)) {
      const item = taskStore.task!.agents.find(
        (item) => item.server === server,
      );
      if (
        !item ||
        item.name !== agent.name ||
        Boolean(item.training) !== agent.training ||
        item.hypers !== agent.hypers ||
        item.sifunc !== agent.sifunc ||
        item.oafunc !== agent.oafunc ||
        item.rewfunc !== agent.rewfunc
      ) {
        throw new Error("云端任务与本地任务不匹配");
      }
    }
    const {
      response: { configs: simenvs },
    } = await appStore.grpc!.getSimenvConfig({
      ids: simenvIds.value,
    });
    for (const [server, simenv] of Object.entries(simenvs)) {
      const item = taskStore.task!.simenvs.find(
        (item) => item.server === server,
      );
      if (!item || item.name !== simenv.name || item.args !== simenv.args) {
        throw new Error("云端任务与本地任务不匹配");
      }
    }
    uninited.value = false;
    clrRefreshInterval();
    setRefreshInterval();
    addMsg(success);
  } catch (e) {
    addMsg(failure + "：" + e, "negative");
  }
  running.value = false;
}
async function refresh() {
  try {
    const {
      response: { status },
    } = await appStore.grpc!.getModelStatus({
      ids: agentIds.value,
    });
    for (const [k, v] of Object.entries(status)) {
      if (!details.value[k]) {
        details.value[k] = { status: {} };
      }
      Object.assign(details.value[k].status, JSON.parse(v.status));
    }
    const {
      response: { infos },
    } = await appStore.grpc!.simMonitor({
      ids: simenvIds.value,
    });
    for (const [k, v] of Object.entries(infos)) {
      if (!details.value[k]) {
        details.value[k] = { state: "", data: {}, logs: [] };
      }
      details.value[k].state = v.state;
      Object.assign(details.value[k].data, JSON.parse(v.data));
      details.value[k].logs.splice(0, ...JSON.parse(v.logs));
    }
    // addMsg("刷新状态成功");
  } catch (e) {
    addMsg("刷新状态失败：" + e, "negative");
  }
}

let refreshInterval = 0;
function setRefreshInterval() {
  if (appStore.systemSettings.detailsRefreshInterval > 0) {
    refreshInterval = window.setInterval(
      refresh,
      appStore.systemSettings.detailsRefreshInterval,
    );
  }
}
function clrRefreshInterval() {
  if (refreshInterval) {
    window.clearInterval(refreshInterval);
    refreshInterval = 0;
  }
}

// -----------------------------------------------

async function control(type: string) {
  return appStore.grpc!.simControl({
    cmds: {
      [service.value!.server]: {
        type: type,
        params: "{}",
      },
    },
  });
}
async function start() {
  running.value = true;
  try {
    await control("init");
    await control("start");
    details.value[service.value!.server].state = "RUNNING";
    addMsg("任务开始运行");
  } catch (e) {
    addMsg("开始任务失败：" + e, "negative");
  }
  running.value = false;
}
async function pause() {
  running.value = true;
  try {
    await control("pause");
    details.value[service.value!.server].state = "SUSPENDED";
    addMsg("任务暂停运行");
  } catch (e) {
    addMsg("暂停任务失败：" + e, "negative");
  }
  running.value = false;
}
async function step() {
  running.value = true;
  try {
    await control("step");
    addMsg("任务单步运行");
  } catch (e) {
    addMsg("步进任务失败：" + e, "negative");
  }
  running.value = false;
}
async function resume() {
  running.value = true;
  try {
    await control("resume");
    details.value[service.value!.server].state = "RUNNING";
    addMsg("任务继续运行");
  } catch (e) {
    addMsg("继续任务失败：" + e, "negative");
  }
  running.value = false;
}
async function stop() {
  running.value = true;
  try {
    await control("stop");
    details.value[service.value!.server].state = "stopped";
    addMsg("任务停止运行");
  } catch (e) {
    addMsg("停止任务失败：" + e, "negative");
  }
  running.value = false;
}

// -----------------------------------------------

async function loadWeights() {
  running.value = true;
  try {
    const blob = await fileOpen({
      description: "weights.pkl",
      extensions: [".pkl"],
      mimeTypes: ["application/octet-stream"],
      multiple: false,
    });
    if (blob.size === 0) {
      throw new Error("本地权重为空");
    } else {
      const weights = new Uint8Array(await blob.arrayBuffer());
      await appStore.grpc!.setModelWeights({
        weights: {
          [service.value!.server]: { weights },
        },
      });
    }
    addMsg("加载权重成功");
  } catch (e) {
    if (e instanceof DOMException) {
      addMsg("取消加载权重", "warning");
    } else {
      addMsg("加载权重失败：" + e, "negative");
    }
  }
  running.value = false;
}
async function saveWeights() {
  running.value = true;
  try {
    const weights = await appStore.grpc!.getModelWeights({
      ids: [service.value!.server],
    });
    const blob = new Blob([
      weights.response.weights[service.value!.server].weights,
    ]);
    await fileSave(blob, {
      fileName: "weights.pkl",
      extensions: [".pkl"],
    });
    addMsg("保存权重成功");
  } catch (e) {
    if (e instanceof DOMException) {
      addMsg("取消保存权重", "warning");
    } else {
      addMsg("保存权重失败：" + e, "negative");
    }
  }
  running.value = false;
}
async function loadBuffer() {
  running.value = true;
  try {
    const blob = await fileOpen({
      description: "buffer.pkl",
      extensions: [".pkl"],
      mimeTypes: ["application/octet-stream"],
      multiple: false,
    });
    if (blob.size === 0) {
      throw new Error("本地经验为空");
    } else {
      const buffer = new Uint8Array(await blob.arrayBuffer());
      await appStore.grpc!.setModelBuffer({
        buffers: {
          [service.value!.server]: { buffer },
        },
      });
    }
    addMsg("加载经验成功");
  } catch (e) {
    if (e instanceof DOMException) {
      addMsg("取消加载经验", "warning");
    } else {
      addMsg("加载经验失败：" + e, "negative");
    }
  }
  running.value = false;
}
async function saveBuffer() {
  running.value = true;
  try {
    const buffer = await appStore.grpc!.getModelBuffer({
      ids: [service.value!.server],
    });
    const blob = new Blob([
      buffer.response.buffers[service.value!.server].buffer,
    ]);
    await fileSave(blob, {
      fileName: "buffer.pkl",
      extensions: [".pkl"],
    });
    addMsg("保存经验成功");
  } catch (e) {
    if (e instanceof DOMException) {
      addMsg("取消保存经验", "warning");
    } else {
      addMsg("保存经验失败：" + e, "negative");
    }
  }
  running.value = false;
}
async function loadStatus() {
  running.value = true;
  try {
    const blob = await fileOpen({
      description: "status.json",
      extensions: [".json"],
      mimeTypes: ["application/json"],
      multiple: false,
    });
    if (blob.size === 0) {
      throw new Error("本地状态为空");
    } else {
      const status = await blob.text();
      await appStore.grpc!.setModelStatus({
        status: {
          [service.value!.server]: { status },
        },
      });
    }
    addMsg("加载状态成功");
  } catch (e) {
    if (e instanceof DOMException) {
      addMsg("取消加载状态", "warning");
    } else {
      addMsg("加载状态失败：" + e, "negative");
    }
  }
  running.value = false;
}
async function saveStatus() {
  running.value = true;
  try {
    const status = await appStore.grpc!.getModelStatus({
      ids: [service.value!.server],
    });
    const blob = new Blob([
      status.response.status[service.value!.server].status,
    ]);
    await fileSave(blob, {
      fileName: "status.json",
      extensions: [".json"],
    });
    addMsg("保存状态成功");
  } catch (e) {
    if (e instanceof DOMException) {
      addMsg("取消保存状态", "warning");
    } else {
      addMsg("保存状态失败：" + e, "negative");
    }
  }
  running.value = false;
}

const tensorboardPort = ref(6006);
function openTensorboard() {
  const agent = appStore.services.find(
    (item) => item.name === service.value!.server,
  );
  const url = `http://${agent!.host}:${tensorboardPort.value}`;
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
    time: getTimestampString(),
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
    (item) => !messageOption.value.includes(item.type),
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
  width: 12rem;
}
</style>
