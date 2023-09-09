<template>
  <form ref="form" @change.capture="submit">
    <q-card flat class="q-mx-auto q-my-lg transparent ui-card">
      <q-card-section class="text-center text-h6">系统设置</q-card-section>
      <q-card-section>
        <p class="text-subtitle1">服务地址</p>
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>BFF服务地址(主机:端口)</td>
              <td>
                <q-input
                  v-model.lazy="appStore.systemSettings.bffAddr"
                  dense
                  filled
                  required
                  class="ui-input"
                  @change="setGrpc"
                />
              </td>
            </tr>
            <tr>
              <td>WEB服务地址(主机:端口)</td>
              <td>
                <q-input
                  v-model.lazy="appStore.systemSettings.webAddr"
                  dense
                  filled
                  required
                  class="ui-input"
                  @change="setRest"
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
                  required
                  type="number"
                  min="1"
                  max="1000"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>服务细节更新间隔（ms）</td>
              <td>
                <q-input
                  v-model.number="
                    appStore.systemSettings.detailsRefreshInterval
                  "
                  dense
                  filled
                  required
                  type="number"
                  min="100"
                  class="ui-input"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-separator class="q-my-sm transparent" />
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>上传自定义模型</td>
              <td>
                <q-btn
                  flat
                  dense
                  class="bg-secondary ui-input ui-clickable"
                  @click="uploadModel"
                >
                  <q-icon name="bi-cloud-arrow-up" size="xs" />
                  <q-tooltip anchor="top middle" self="bottom middle">
                    选择文件
                  </q-tooltip>
                </q-btn>
              </td>
            </tr>
            <tr>
              <td>上传自定义引擎</td>
              <td>
                <q-btn
                  flat
                  dense
                  class="bg-secondary ui-input ui-clickable"
                  @click="uploadEngine"
                >
                  <q-icon name="bi-cloud-arrow-up" size="xs" />
                  <q-tooltip anchor="top middle" self="bottom middle">
                    选择文件
                  </q-tooltip>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-section class="text-center text-h6">服务集群</q-card-section>
      <q-card-section>
        <q-btn
          flat
          dense
          icon="bi-plus-circle"
          class="full-width bg-secondary ui-clickable"
          @click="
            appStore.services.unshift({
              name: randomString(8),
              type: 'agent',
              host: 'localhost',
              port: 0,
              desc: '',
              registered: false,
            })
          "
        >
          <q-tooltip anchor="top middle" self="bottom middle"> 添加 </q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section v-for="(item, index) in appStore.services" :key="index">
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>服务标识</td>
              <td>
                <q-input
                  v-model="item.name"
                  :disable="item.registered"
                  dense
                  filled
                  required
                  maxlength="32"
                  class="full-width"
                />
              </td>
              <td>服务类型</td>
              <td>
                <q-select
                  v-model="item.type"
                  :options="['agent', 'simenv']"
                  :disable="item.registered"
                  dense
                  filled
                  required
                  options-dense
                  popup-content-class="bg-secondary"
                  class="full-width"
                />
              </td>
            </tr>
            <tr>
              <td>服务主机</td>
              <td>
                <q-input
                  v-model="item.host"
                  :disable="item.registered"
                  dense
                  filled
                  required
                  class="full-width"
                />
              </td>
              <td>服务端口</td>
              <td>
                <q-input
                  v-model.number="item.port"
                  :disable="item.registered"
                  dense
                  filled
                  required
                  type="number"
                  min="0"
                  max="65535"
                  class="full-width"
                />
              </td>
            </tr>
            <tr>
              <td>服务描述</td>
              <td colspan="3">
                <q-input
                  v-model="item.desc"
                  :disable="item.registered"
                  dense
                  filled
                  autogrow
                  maxlength="256"
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
                  :disable="item.registered"
                  flat
                  dense
                  class="full-width bg-secondary ui-clickable"
                  @click="pasteService(index)"
                >
                  <q-icon name="bi-clipboard-plus" size="xs" />
                  <q-tooltip
                    v-if="!item.registered"
                    anchor="top middle"
                    self="bottom middle"
                  >
                    粘贴
                  </q-tooltip>
                </q-btn>
              </td>
              <td>
                <q-btn
                  :disable="item.registered"
                  flat
                  dense
                  class="full-width bg-secondary ui-clickable"
                  @click="addService(index)"
                >
                  <q-icon name="bi-play-circle" size="xs" />
                  <q-tooltip
                    v-if="!item.registered"
                    anchor="top middle"
                    self="bottom middle"
                  >
                    {{ item.registered ? "已" : "" }}注册
                  </q-tooltip>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </form>
</template>

<script setup lang="ts">
import { fileOpen } from "browser-fs-access";
import JSZip from "jszip";
import { useAppStore } from "~/stores";
import { randomString } from "~/utils";

const $q = useQuasar();

const appStore = useAppStore();

const form = ref<Nullable<HTMLFormElement>>(null);
function submit() {
  return form.value!.reportValidity();
}

async function setGrpc() {
  try {
    submit() && (await appStore.setGrpcClient());
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
    submit() && (await appStore.setRestClient());
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "连接WEB服务失败，请检查地址是否正确",
    });
    console.error(e);
  }
}

async function uploadModel() {
  try {
    const blob = await fileOpen({
      description: "",
      extensions: [".py"],
      mimeTypes: ["text/plain"],
      multiple: false,
    });
    if (blob.length === 0) {
      throw new Error("模型文件为空");
    } else {
      const zip = new JSZip();
      zip.file(blob.name, await blob.text());
      const data = {
        name: "@custom",
        dstr: "",
        dbin: await zip.generateAsync({ type: "uint8array" }),
      };
      await appStore.grpc!.call({
        data: Object.fromEntries(
          appStore.services
            .filter((srv) => srv.type === "agent")
            .map((srv) => [srv.name, data])
        ),
      });
    }
    $q.notify({
      type: "positive",
      message: "上传模型成功",
    });
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "上传模型失败",
    });
    console.error(e);
  }
}
async function uploadEngine() {
  try {
    const blob = await fileOpen({
      description: "",
      extensions: [".py"],
      mimeTypes: ["text/plain"],
      multiple: false,
    });
    if (blob.length === 0) {
      throw new Error("引擎文件为空");
    } else {
      const zip = new JSZip();
      zip.file(blob.name, await blob.text());
      const data = {
        name: "@custom",
        dstr: "",
        dbin: await zip.generateAsync({ type: "uint8array" }),
      };
      await appStore.grpc!.call({
        data: Object.fromEntries(
          appStore.services
            .filter((srv) => srv.type === "simenv")
            .map((srv) => [srv.name, data])
        ),
      });
    }
    $q.notify({
      type: "positive",
      message: "上传引擎成功",
    });
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "上传引擎失败",
    });
    console.error(e);
  }
}

async function addService(index: number) {
  if (submit()) {
    if (!appStore.services[index].registered) {
      await appStore.registerService(index);
    }
  }
}
async function delService(index: number) {
  if (submit()) {
    if (appStore.services[index].registered) {
      await appStore.unregisterService(index);
    }
    appStore.services.splice(index, 1);
  }
}
async function copyService(index: number) {
  if (submit()) {
    await navigator.clipboard.writeText(
      JSON.stringify(appStore.services[index])
    );
    $q.notify({
      type: "positive",
      message: "已复制到剪贴板",
    });
  }
}
async function pasteService(index: number) {
  if (submit()) {
    Object.assign(
      appStore.services[index],
      JSON.parse(await navigator.clipboard.readText())
    );
    appStore.services[index].registered = false;
    $q.notify({
      type: "positive",
      message: "已从剪贴板粘贴",
    });
  }
}
</script>

<style scoped lang="scss"></style>
