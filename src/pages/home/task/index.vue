<template>
  <q-circular-progress indeterminate rounded size="4rem" color="accent" />
</template>

<script setup lang="ts">
const router = useRouter();
router.push("/home/task/infos");
</script>

<style scoped lang="scss"></style>

<route lang="yaml">
meta:
  layout: center
</route>
