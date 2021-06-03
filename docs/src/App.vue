<script setup lang="ts">
import { useHead } from '@vueuse/head'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
  ],
})
</script>

<template>
  <Titlebar class="dark:text-gray-300 text-gray-700" />
  <main class="dark:text-gray-300 pt-22 max-w-screen-lg mx-auto h-screen text-gray-700">
    <router-view />
  </main>
</template>
