<template>
  <router-view />
</template>

<script setup lang="ts">
const $q = useQuasar();

$q.dark.set("auto");
</script>

<style lang="scss">
html,
body,
button,
label,
input,
textarea,
select,
option {
  font-family: "Microsoft YaHei" !important;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 1px;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: var(--q-primary);
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background-color: var(--q-secondary);
}
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: var(--q-info);
}
</style>
