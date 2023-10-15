<template>
  <form ref="form">
    <q-card flat class="full-width transparent">
      <q-card-section>
        <q-markup-table flat separator="horizontal" class="ui-table">
          <tbody>
            <tr>
              <td>策略类型</td>
              <td>
                <q-select
                  v-model="hypers.policy"
                  :options="[
                    'discrete',
                    'continuous',
                    'multi-discrete',
                    'hybrid',
                  ]"
                  dense
                  filled
                  required
                  options-dense
                  popup-content-class="bg-secondary"
                  class="ui-input"
                  @update:model-value="policyChanged"
                />
              </td>
            </tr>
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
              <td v-if="hypers.policy === 'hybrid'">
                <div class="row no-wrap justify-end items-center ui-input">
                  <q-input
                    v-model.number="m"
                    dense
                    filled
                    type="number"
                    required
                    min="2"
                    placeholder="离散维度，至少为2"
                    @update:model-value="hybrid = false"
                  />
                  <q-icon name="bi-x" size="sm" />
                  <q-input
                    v-model.number="n"
                    dense
                    filled
                    type="number"
                    required
                    min="1"
                    placeholder="连续维度，至少为1"
                    @update:model-value="hybrid = false"
                  />
                </div>
                <q-btn
                  :icon="hybrid ? 'bi-chevron-up' : 'bi-chevron-down'"
                  flat
                  dense
                  square
                  class="bg-secondary q-mt-xs ui-input ui-clickable"
                  @click="configHybrid"
                />
              </td>
              <td v-else-if="hypers.policy === 'multi-discrete'">
                <q-input
                  v-for="(dim, index) in hypers.act_dim as number[]"
                  :key="index"
                  v-model.number="(hypers.act_dim as number[])[index]"
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
                      @click="
                        (hypers.act_dim as number[]).length > 2 &&
                          (hypers.act_dim as number[]).splice(index, 1)
                      "
                    />
                  </template>
                </q-input>
                <q-btn
                  flat
                  dense
                  square
                  icon="bi-plus-circle"
                  class="bg-secondary ui-input ui-clickable"
                  @click="(hypers.act_dim as number[]).push(2)"
                />
              </td>
              <td v-else>
                <q-input
                  v-if="typeof hypers.act_dim === 'number'"
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
            <tr v-show="hybrid">
              <td colspan="2">
                <q-markup-table flat separator="none" class="hybrid-table">
                  <tbody>
                    <tr
                      v-for="(action1, index1) in hypers.act_dim as number[][]"
                      :key="index1"
                    >
                      <td v-for="(action2, index2) in action1" :key="index2">
                        <q-checkbox
                          v-model="action1[index2]"
                          :true-value="1"
                          :false-value="0"
                        />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </td>
            </tr>
            <tr>
              <td>策略网络隐藏层</td>
              <td>
                <q-input
                  v-for="(layer, index) in hypers.hidden_layers_pi"
                  :key="index"
                  v-model.number="hypers.hidden_layers_pi[index]"
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
                      @click="
                        hypers.hidden_layers_pi.length > 1 &&
                          hypers.hidden_layers_pi.splice(index, 1)
                      "
                    />
                  </template>
                </q-input>
                <q-btn
                  flat
                  dense
                  square
                  icon="bi-plus-circle"
                  class="bg-secondary ui-input ui-clickable"
                  @click="hypers.hidden_layers_pi.push(64)"
                />
              </td>
            </tr>
            <tr>
              <td>价值网络隐藏层</td>
              <td>
                <q-input
                  v-for="(layer, index) in hypers.hidden_layers_vf"
                  :key="index"
                  v-model.number="hypers.hidden_layers_vf[index]"
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
                      @click="
                        hypers.hidden_layers_vf.length > 1 &&
                          hypers.hidden_layers_vf.splice(index, 1)
                      "
                    />
                  </template>
                </q-input>
                <q-btn
                  flat
                  dense
                  square
                  icon="bi-plus-circle"
                  class="bg-secondary ui-input ui-clickable"
                  @click="hypers.hidden_layers_vf.push(64)"
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
              <td>策略网络学习率</td>
              <td>
                <q-input
                  v-model.number="hypers.lr_pi"
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
              <td>价值网络学习率</td>
              <td>
                <q-input
                  v-model.number="hypers.lr_vf"
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
              <td>GAE折扣因子</td>
              <td>
                <q-input
                  v-model.number="hypers.lam"
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
              <td>优势裁剪因子</td>
              <td>
                <q-input
                  v-model.number="hypers.epsilon"
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
                  v-model.number="hypers.buffer_size"
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
              <td>策略网络迭代次数</td>
              <td>
                <q-input
                  v-model.number="hypers.update_pi_iter"
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
              <td>价值网络迭代次数</td>
              <td>
                <q-input
                  v-model.number="hypers.update_vf_iter"
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
              <td>最大KL散度</td>
              <td>
                <q-input
                  v-model.number="hypers.max_kl"
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
type PPOHypers = {
  policy: "discrete" | "continuous" | "multi-discrete" | "hybrid";
  obs_dim: number;
  act_dim: number | number[] | number[][];
  hidden_layers_pi: number[];
  hidden_layers_vf: number[];
  lr_pi: number;
  lr_vf: number;
  gamma: number;
  lam: number;
  epsilon: number;
  buffer_size: number;
  update_pi_iter: number;
  update_vf_iter: number;
  max_kl: number;
  seed: Nullable<number | string>;
};

const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (event: "update:modelValue", modelValue: string): void;
}>();

const hypers = ref<PPOHypers>({
  policy: "discrete",
  obs_dim: 4,
  act_dim: 2,
  hidden_layers_pi: [64, 64],
  hidden_layers_vf: [64, 64],
  lr_pi: 0.0003,
  lr_vf: 0.001,
  gamma: 0.99,
  lam: 0.97,
  epsilon: 0.2,
  buffer_size: 4000,
  update_pi_iter: 80,
  update_vf_iter: 80,
  max_kl: 0.01,
  seed: null,
});

const m = ref(2);
const n = ref(1);
const hybrid = ref(false);
function configHybrid() {
  if (m.value < 2 || n.value < 1) {
    return;
  }
  const act_dim = hypers.value.act_dim as number[][];
  if (act_dim.length !== m.value || act_dim[0].length !== n.value) {
    hypers.value.act_dim = new Array(m.value);
    for (let i = 0; i < m.value; i++) {
      hypers.value.act_dim[i] = new Array(n.value).fill(0);
    }
  }
  hybrid.value = !hybrid.value;
}
function policyChanged(policy: string) {
  hybrid.value = false;
  if (policy === "hybrid") {
    m.value = 2;
    n.value = 1;
    hypers.value.act_dim = [[1], [0]];
  } else if (policy === "multi-discrete") {
    hypers.value.act_dim = [2, 2];
  } else {
    hypers.value.act_dim = 2;
  }
}

function update() {
  if (hypers.value.seed === "") {
    hypers.value.seed = null;
  }
  emits("update:modelValue", JSON.stringify(hypers.value));
}

const form = ref<Nullable<HTMLFormElement>>(null);
watch(
  () => hypers.value,
  () => {
    if (form.value && !form.value.reportValidity()) {
      return;
    }
    update();
  },
  { deep: true },
);

(() => {
  if (props.modelValue && props.modelValue !== "{}") {
    hypers.value = JSON.parse(props.modelValue);
  } else {
    update();
  }
})();
</script>

<style scoped lang="scss">
.hybrid-table {
  max-width: 100%;
  max-height: 25rem;
  overflow: auto;
  > table {
    tbody {
      td {
        text-align: center;
        padding: 0 !important;
      }
    }
  }
}
</style>
