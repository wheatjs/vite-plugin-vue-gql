<script setup lang="ts">
import { isDark, toggleDark } from '~/logic'
</script>

<template>
  <div class="fixed top-0 z-20 left-0 right-0 h-18 backdrop-filter dark:(bg-gray-900 bg-opacity-50) backdrop-blur">
    <div class="border-b dark:(border-gray-800) h-full px-4">
      <div class="max-w-screen-lg w-full flex flex-row items-center mx-auto h-full">
        <div class="flex flex-1">
          <router-link to="/">
            <Logo class="h-12" />
          </router-link>
        </div>
        <button class="focus:outline-none text-xl w-10 h-10 grid place-items-center border-b-2 border-r-2 border-cyan-700 bg-gradient-to-br from-cyan-400 to-cyan-600 text-cyan-900 rounded-xl" @click="toggleDark">
          <carbon-moon v-if="isDark" />
          <carbon-sun v-else />
        </button>
      </div>
    </div>
  </div>
</template>