<template>
  <div>Helloworld!</div>
</template>

<script setup lang="ts">
import { AnyDict } from "~/api";
import { isEmpty, deepCopy } from "~/utils";

const $q = useQuasar();

const props = defineProps<{
  status: AnyDict;
}>();

console.log(props.status);
</script>

<style scoped lang="scss"></style>
