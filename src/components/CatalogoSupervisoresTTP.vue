<template>
  <div
    class="flex h-full w-full flex-col rounded-md bg-[#F8FAFB] py-16 px-14 shadow-md mb-12"
  >
    <Suspense><SupervisoresTTP /></Suspense>
  </div>
</template>

<script setup>
import {} from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import Conceptos from "./Conceptos.vue";
import SupervisoresTTP from "./SupervisoresTTP.vue";

const props = defineProps(["control"]);
</script>
