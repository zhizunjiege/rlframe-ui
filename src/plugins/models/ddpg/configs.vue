<template>
  <form ref="form" @change.capture="submit">
    <q-card flat class="full-width transparent">
      <q-card-section>
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>状态维度</td>
              <td>
                <q-input
                  v-model.number="hypers.obs_dim"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>动作维度</td>
              <td>
                <q-input
                  v-model.number="hypers.act_dim"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>Actor网络隐藏层</td>
              <td>
                <q-input
                  v-for="(layer, index) in hypers.hidden_layers_actor"
                  :key="index"
                  v-model.number="hypers.hidden_layers_actor[index]"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="q-mb-xs ui-input"
                >
                  <template #append>
                    <q-icon
                      name="bi-x-circle"
                      class="ui-clickable"
                      @click="hypers.hidden_layers_actor.splice(index, 1)"
                    />
                  </template>
                </q-input>
                <q-btn
                  flat
                  dense
                  square
                  icon="bi-plus-circle"
                  class="bg-secondary ui-input ui-clickable"
                  @click="hypers.hidden_layers_actor.push(64)"
                />
              </td>
            </tr>
            <tr>
              <td>Critic网络隐藏层</td>
              <td>
                <q-input
                  v-for="(layer, index) in hypers.hidden_layers_critic"
                  :key="index"
                  v-model.number="hypers.hidden_layers_critic[index]"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="q-mb-xs ui-input"
                >
                  <template #append>
                    <q-icon
                      name="bi-x-circle"
                      class="ui-clickable"
                      @click="hypers.hidden_layers_critic.splice(index, 1)"
                    />
                  </template>
                </q-input>
                <q-btn
                  flat
                  dense
                  square
                  icon="bi-plus-circle"
                  class="bg-secondary ui-input ui-clickable"
                  @click="hypers.hidden_layers_critic.push(64)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-section>
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>Actor学习率</td>
              <td>
                <q-input
                  v-model.number="hypers.lr_actor"
                  dense
                  filled
                  type="number"
                  required
                  min="0"
                  step="1e-8"
                  max="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>Critic学习率</td>
              <td>
                <q-input
                  v-model.number="hypers.lr_critic"
                  dense
                  filled
                  type="number"
                  required
                  min="0"
                  step="1e-8"
                  max="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>奖励折扣因子</td>
              <td>
                <q-input
                  v-model.number="hypers.gamma"
                  dense
                  filled
                  type="number"
                  required
                  min="0"
                  step="1e-8"
                  max="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>软更新率</td>
              <td>
                <q-input
                  v-model.number="hypers.tau"
                  dense
                  filled
                  type="number"
                  required
                  min="0"
                  step="1e-8"
                  max="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>经验回放池大小</td>
              <td>
                <q-input
                  v-model.number="hypers.replay_size"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>训练批次大小</td>
              <td>
                <q-input
                  v-model.number="hypers.batch_size"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>噪声类型</td>
              <td>
                <q-select
                  v-model="hypers.noise_type"
                  :options="['normal', 'ou']"
                  dense
                  filled
                  options-dense
                  popup-content-class="bg-secondary"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>噪声方差</td>
              <td>
                <q-input
                  v-model.number="hypers.noise_sigma"
                  dense
                  filled
                  type="number"
                  required
                  min="0"
                  step="1e-8"
                  max="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <template v-if="hypers.noise_type === 'ou'">
              <tr>
                <td>噪声递减率</td>
                <td>
                  <q-input
                    v-model.number="hypers.noise_theta"
                    dense
                    filled
                    type="number"
                    required
                    min="0"
                    step="1e-8"
                    max="1"
                    class="ui-input"
                  />
                </td>
              </tr>
              <tr>
                <td>噪声步长</td>
                <td>
                  <q-input
                    v-model.number="hypers.noise_dt"
                    dense
                    filled
                    type="number"
                    required
                    min="0"
                    step="1e-8"
                    max="1"
                    class="ui-input"
                  />
                </td></tr
            ></template>
            <tr>
              <td>最大噪声水平</td>
              <td>
                <q-input
                  v-model.number="hypers.noise_max"
                  dense
                  filled
                  type="number"
                  required
                  min="0"
                  step="1e-8"
                  max="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>最小噪声水平</td>
              <td>
                <q-input
                  v-model.number="hypers.noise_min"
                  dense
                  filled
                  type="number"
                  required
                  min="0"
                  step="1e-8"
                  max="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>噪声水平衰减因子</td>
              <td>
                <q-input
                  v-model.number="hypers.noise_decay"
                  dense
                  filled
                  type="number"
                  required
                  min="0"
                  step="1e-8"
                  max="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>开始更新步数</td>
              <td>
                <q-input
                  v-model.number="hypers.update_after"
                  dense
                  filled
                  type="number"
                  required
                  min="0"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>在线网络更新间隔</td>
              <td>
                <q-input
                  v-model.number="hypers.update_online_every"
                  dense
                  filled
                  type="number"
                  required
                  min="1"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>数据类型</td>
              <td>
                <q-select
                  v-model="hypers.dtype"
                  :options="['float32', 'float64']"
                  dense
                  filled
                  options-dense
                  popup-content-class="bg-secondary"
                  class="ui-input"
                />
              </td>
            </tr>
            <tr>
              <td>随机种子</td>
              <td>
                <q-input
                  v-model.number="hypers.seed"
                  dense
                  filled
                  type="number"
                  min="0"
                  class="ui-input"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </form>
</template>

<script setup lang="ts">
type DDPGHypers = {
  obs_dim: number;
  act_dim: number;
  hidden_layers_actor: number[];
  hidden_layers_critic: number[];
  lr_actor: number;
  lr_critic: number;
  gamma: number;
  tau: number;
  replay_size: number;
  batch_size: number;
  noise_type: "normal" | "ou";
  noise_sigma: number;
  noise_theta: number;
  noise_dt: number;
  noise_max: number;
  noise_min: number;
  noise_decay: number;
  update_after: number;
  update_online_every: number;
  dtype: "float32" | "float64";
  seed: Nullable<number | string>;
};

const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (event: "update:modelValue", modelValue: string): void;
}>();

const hypers = ref<DDPGHypers>({
  obs_dim: 4,
  act_dim: 2,
  hidden_layers_actor: [64, 64],
  hidden_layers_critic: [64, 64],
  lr_actor: 0.0001,
  lr_critic: 0.001,
  gamma: 0.99,
  tau: 0.001,
  replay_size: 1000000,
  batch_size: 64,
  noise_type: "ou",
  noise_sigma: 0.2,
  noise_theta: 0.15,
  noise_dt: 0.01,
  noise_max: 1.0,
  noise_min: 1.0,
  noise_decay: 1.0,
  update_after: 64,
  update_online_every: 1,
  dtype: "float32",
  seed: null,
});

const form = ref<Nullable<HTMLFormElement>>(null);
function submit() {
  if (!form.value!.reportValidity()) {
    return;
  }
  update();
}
function update() {
  if (hypers.value.seed === "") {
    hypers.value.seed = null;
  }
  emits("update:modelValue", JSON.stringify(hypers.value));
}

if (props.modelValue && props.modelValue !== "{}") {
  hypers.value = JSON.parse(props.modelValue);
} else {
  update();
}
</script>

<style scoped lang="scss"></style>
