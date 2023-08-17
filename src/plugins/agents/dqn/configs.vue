<template>
  <q-form @submit="update">
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
              <td>动作数目</td>
              <td>
                <q-input
                  v-model.number="hypers.act_num"
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
              <td>网络隐藏层</td>
              <td>
                <q-input
                  v-for="(layer, index) in hypers.hidden_layers"
                  :key="index"
                  v-model.number="hypers.hidden_layers[index]"
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
                      @click="hypers.hidden_layers.splice(index, 1)"
                    />
                  </template>
                </q-input>
                <q-btn
                  flat
                  dense
                  square
                  icon="bi-plus-circle"
                  class="bg-secondary ui-input ui-clickable"
                  @click="hypers.hidden_layers.push(64)"
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
              <td>学习率</td>
              <td>
                <q-input
                  v-model.number="hypers.lr"
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
              <td>最大探索率</td>
              <td>
                <q-input
                  v-model.number="hypers.epsilon_max"
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
              <td>最小探索率</td>
              <td>
                <q-input
                  v-model.number="hypers.epsilon_min"
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
              <td>探索率衰减因子</td>
              <td>
                <q-input
                  v-model.number="hypers.epsilon_decay"
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
              <td>开始训练步数</td>
              <td>
                <q-input
                  v-model.number="hypers.start_steps"
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
              <td>目标网络更新间隔</td>
              <td>
                <q-input
                  v-model.number="hypers.update_target_every"
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
      <q-card-section>
        <q-btn
          flat
          type="submit"
          label="保存"
          class="full-width bg-secondary ui-clickable"
        />
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
type DQNHypers = {
  obs_dim: number;
  act_num: number;
  hidden_layers: number[];
  lr: number;
  gamma: number;
  replay_size: number;
  batch_size: number;
  epsilon_max: number;
  epsilon_min: number;
  epsilon_decay: number;
  start_steps: number;
  update_after: number;
  update_online_every: number;
  update_target_every: number;
  dtype: "float32" | "float64";
  seed: Nullable<number | string>;
};

const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (event: "update:modelValue", modelValue: string): void;
}>();

const hypers = ref<DQNHypers>({
  obs_dim: 4,
  act_num: 2,
  hidden_layers: [64, 64],
  lr: 0.001,
  gamma: 0.95,
  replay_size: 10000,
  batch_size: 32,
  epsilon_max: 1.0,
  epsilon_min: 0.01,
  epsilon_decay: 0.9999,
  start_steps: 0,
  update_after: 200,
  update_online_every: 1,
  update_target_every: 200,
  dtype: "float32",
  seed: null,
});

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
