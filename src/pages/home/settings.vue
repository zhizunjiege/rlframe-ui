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
                filled
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
                filled
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
                filled
                type="number"
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
                filled
                type="number"
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
    <q-card-section>
      <q-btn
        flat
        dense
        icon="bi-plus-circle"
        class="full-width bg-secondary ui-clickable"
        @click="
          appStore.registeredServices.unshift({
            name: '',
            type: 'agent',
            host: 'localhost',
            port: 0,
            desc: '',
          })
        "
      >
        <q-tooltip anchor="top middle" self="bottom middle"> 添加 </q-tooltip>
      </q-btn>
    </q-card-section>
    <q-card-section
      v-for="(item, index) in appStore.registeredServices"
      :key="index"
    >
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>服务标识</td>
            <td>
              <q-input v-model="item.name" dense filled class="full-width" />
            </td>
            <td>服务类型</td>
            <td>
              <q-select
                v-model="item.type"
                :options="['agent', 'simenv']"
                dense
                filled
                options-dense
                popup-content-class="bg-secondary"
                class="full-width"
              />
            </td>
          </tr>
          <tr>
            <td>服务主机</td>
            <td>
              <q-input v-model="item.host" dense filled class="full-width" />
            </td>
            <td>服务端口</td>
            <td>
              <q-input v-model="item.port" dense filled class="full-width" />
            </td>
          </tr>
          <tr>
            <td>服务描述</td>
            <td colspan="3">
              <q-input
                v-model="item.desc"
                dense
                filled
                autogrow
                type="textarea"
                class="full-width"
              />
            </td>
          </tr>
          <tr>
            <td>
              <q-btn
                flat
                dense
                class="full-width bg-secondary ui-clickable"
                @click="delService(index)"
              >
                <q-icon name="bi-trash" size="xs" />
                <q-tooltip anchor="top middle" self="bottom middle">
                  注销
                </q-tooltip>
              </q-btn>
            </td>
            <td>
              <q-btn
                flat
                dense
                class="full-width bg-secondary ui-clickable"
                @click="copyService(index)"
              >
                <q-icon name="bi-clipboard" size="xs" />
                <q-tooltip anchor="top middle" self="bottom middle">
                  复制
                </q-tooltip>
              </q-btn>
            </td>
            <td>
              <q-btn
                flat
                dense
                class="full-width bg-secondary ui-clickable"
                @click="pasteService(index)"
              >
                <q-icon name="bi-clipboard-plus" size="xs" />
                <q-tooltip anchor="top middle" self="bottom middle">
                  粘贴
                </q-tooltip>
              </q-btn>
            </td>
            <td>
              <q-btn
                flat
                dense
                class="full-width bg-secondary ui-clickable"
                @click="addService(index)"
              >
                <q-icon name="bi-play-circle" size="xs" />
                <q-tooltip anchor="top middle" self="bottom middle">
                  注册
                </q-tooltip>
              </q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useAppStore } from "~/stores";

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

async function addService(index: number) {
  await appStore.addService(index);
}
async function delService(index: number) {
  await appStore.delService(index);
  appStore.registeredServices.splice(index, 1);
}
async function copyService(index: number) {
  await navigator.clipboard.writeText(
    JSON.stringify(appStore.registeredServices[index])
  );
}
async function pasteService(index: number) {
  appStore.registeredServices.splice(
    index,
    1,
    JSON.parse(await navigator.clipboard.readText())
  );
}
</script>

<style scoped lang="scss"></style>
