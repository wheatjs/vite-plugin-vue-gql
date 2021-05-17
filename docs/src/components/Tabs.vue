<script setup lang="ts">
import { provide, ref } from 'vue'

const tabs = ref([])
const activeTab = ref('')
provide('tabs', tabs)
provide('activeTab', activeTab)

</script>

<template>
  <div class="flex flex-col">
    <div class="grid z-10 px-4 w-full h-0 place-content-center">
      <div class="grid h-12 grid-flow-col p-2 text-sm max-w-screen overflow-auto font-semibold transform rounded-lg shadow-md bg-white dark:bg-gray-800 border-deployr-900">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="{ 'bg-cyan-400 text-cyan-900': activeTab === tab }"
          class="px-4 rounded focus:outline-none font-bold"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
    </div>
    <div class="dark:(bg-black bg-opacity-25 border-gray-800) border-1 rounded-lg">
      <slot />
    </div>
  </div>
</template>
