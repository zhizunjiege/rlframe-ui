<template>
  <q-card flat class="q-mx-auto q-pt-lg transparent ui-card">
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
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
                @blur="setGrpc"
              />
            </td>
          </tr>
          <tr>
            <td>WEB服务地址(主机:端口)</td>
            <td>
              <q-input
                v-model.lazy="webAddr"
                dense
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
                @blur="setRest"
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
            <td>控制台消息数目最大值</td>
            <td>
              <q-input
                v-model.number="appStore.systemSettings.maxTerminalMessages"
                dense
                type="number"
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
              />
            </td>
          </tr>
          <tr>
            <td>服务细节更新间隔（ms）</td>
            <td>
              <q-input
                v-model.number="appStore.systemSettings.detailsRefreshInterval"
                dense
                type="number"
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>

  <q-card flat class="q-mx-auto q-pt-lg transparent ui-card">
    <q-card-section class="text-center text-h6">服务集群</q-card-section>
    <q-card-section
      v-if="appStore.registeredServices.length > 0"
      class="flex justify-between q-py-none"
    >
      <q-btn
        flat
        size="sm"
        round
        :icon="deling ? 'bi-check-circle' : adding ? 'bi-x-circle' : 'bi-trash'"
        class="ui-clickable"
        @click="delService(-1)"
      >
        <q-tooltip anchor="top middle" self="bottom middle">
          {{ deling ? "确认" : adding ? "取消" : "删除" }}
        </q-tooltip>
      </q-btn>
      <q-btn
        :disable="deling"
        flat
        size="sm"
        round
        :icon="adding ? 'bi-check-circle' : 'bi-plus-circle'"
        class="ui-clickable"
        @click="addService"
      >
        <q-tooltip anchor="top middle" self="bottom middle">
          {{ adding ? "确认" : "添加" }}
        </q-tooltip>
      </q-btn>
    </q-card-section>
    <q-card-section v-else>
      <q-btn
        flat
        class="full-width bg-secondary ui-clickable"
        @click="addService"
      >
        <q-icon
          size="xs"
          :name="adding ? 'bi-check-circle' : 'bi-plus-circle'"
          class="q-mr-sm"
        />
        {{ adding ? "确认" : "添加" }}
      </q-btn>
    </q-card-section>

    <q-card-section v-if="adding">
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>服务标识</td>
            <td>
              <q-input
                v-model="service.name"
                dense
                standout="bg-ignore"
                input-class="text-foreground"
                class="s-input"
              />
            </td>
            <td>服务类型</td>
            <td>
              <q-select
                v-model="service.type"
                :options="['agent', 'simenv']"
                dense
                options-dense
                standout="bg-ignore"
                input-class="text-foreground"
                popup-content-class="shadow-0 bg-secondary"
                options-selected-class="text-accent"
                class="s-input"
              />
            </td>
          </tr>
          <tr>
            <td>服务主机</td>
            <td>
              <q-input
                v-model="service.host"
                dense
                standout="bg-ignore"
                input-class="text-foreground"
                class="s-input"
              />
            </td>
            <td>服务端口</td>
            <td>
              <q-input
                v-model="service.port"
                dense
                standout="bg-ignore"
                input-class="text-foreground"
                class="s-input"
              />
            </td>
          </tr>
          <tr>
            <td>服务描述</td>
            <td colspan="3">
              <q-input
                v-model="service.desc"
                dense
                autogrow
                clearable
                type="textarea"
                standout="bg-ignore"
                input-class="text-foreground"
                class="s-input"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>

    <draggable
      v-model="appStore.registeredServices"
      item-key="name"
      group="services"
    >
      <template #item="{ element, index }">
        <q-card-section
          :class="{ 's-todel': deling }"
          @click="delService(index)"
        >
          <q-markup-table flat separator="horizontal" class="ui-table">
            <tbody>
              <tr>
                <td>服务标识</td>
                <td>
                  <q-input
                    :model-value="element.name"
                    disable
                    dense
                    standout="bg-ignore"
                    input-class="text-foreground"
                    class="s-input"
                  />
                </td>
                <td>服务类型</td>
                <td>
                  <q-input
                    :model-value="element.type"
                    disable
                    dense
                    standout="bg-ignore"
                    input-class="text-foreground"
                    class="s-input"
                  />
                </td>
              </tr>
              <tr>
                <td>服务主机</td>
                <td>
                  <q-input
                    :model-value="element.host"
                    disable
                    dense
                    standout="bg-ignore"
                    input-class="text-foreground"
                    class="s-input"
                  />
                </td>
                <td>服务端口</td>
                <td>
                  <q-input
                    :model-value="element.port"
                    disable
                    dense
                    standout="bg-ignore"
                    input-class="text-foreground"
                    class="s-input"
                  />
                </td>
              </tr>
              <tr>
                <td>服务描述</td>
                <td colspan="3">
                  <q-input
                    :model-value="element.desc"
                    disable
                    dense
                    autogrow
                    type="textarea"
                    standout="bg-ignore"
                    input-class="text-foreground"
                    class="s-input"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </template>
    </draggable>
  </q-card>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import { ServiceInfo } from "~/api";

import { useAppStore } from "~/stores";
import { deepCopy } from "~/utils";

const $q = useQuasar();

const appStore = useAppStore();

// local system settings for debounce
const bffAddr = ref(appStore.systemSettings.bffAddr);
const webAddr = ref(appStore.systemSettings.webAddr);

async function setGrpc() {
  try {
    await appStore.setGrpcClient(bffAddr.value);
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "连接BFF服务失败，请检查地址是否正确",
    });
    console.error(e);
  }
}

async function setRest() {
  try {
    await appStore.setRestClient(webAddr.value);
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "连接WEB服务失败，请检查地址是否正确",
    });
    console.error(e);
  }
}

// add or del service
const service = ref<ServiceInfo>({
  type: "agent",
  name: "agent",
  host: "localhost",
  port: 10002,
  desc: "",
});
const adding = ref(false);
async function addService() {
  if (adding.value) {
    await appStore.addService(deepCopy(service.value));
  }
  adding.value = !adding.value;
}

const deling = ref(false);
async function delService(index: number) {
  if (index >= 0) {
    if (deling.value) {
      await appStore.delService(index);
      if (appStore.registeredServices.length === 0) {
        deling.value = false;
      }
    }
  } else {
    if (adding.value) {
      adding.value = false;
    } else {
      deling.value = !deling.value;
    }
  }
}
</script>

<style scoped lang="scss">
.s-input {
  float: right;
  width: 100%;
}
.s-todel {
  :hover {
    background-color: var(--ui-disable) !important;
  }
}
</style>
