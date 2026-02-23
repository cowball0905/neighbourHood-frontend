<template>
  <NuxtPage />
</template>

<script setup>
import { useSocket } from "./composables/socket"
import { useI18n } from "vue-i18n";
import { Storage } from "./utils/storage"
import { onMounted, watch } from "vue";

const { connect } = useSocket();
const { locale } = useI18n();

onMounted(async () => {
  await connect();
})

</script>

<style>
html {
  height: 100%;
  min-height: 100vh;
}
</style>
