<template>
  <div class="fullscreen flex flex-center">
    <q-dialog v-model="state" :persistent="persistent">
      <router-view />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const state = ref(false);

const persistent = computed(() => (route.meta.persistent as boolean) ?? false);
</script>

<style lang="scss"></style>
