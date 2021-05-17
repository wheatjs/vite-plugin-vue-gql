<script setup lang="ts">
import Logo from './components/Logo.vue'
import Titlebar from './components/Titlebar.vue'

import TestComponent from './components/TestComponent.vue'
// import TestComponent2 from './components/TestComponent2.vue'
// import GenerationPreview from './components/GenerationPreview.vue'
</script>

<template>
  <!-- <div class="fixed top-0 left-0 right-0 px-4">
    <div class="flex flex-row items-center h-22 mx-auto max-w-screen-lg">
      <Logo class="h-16" />
    </div>
  </div> -->
  <Titlebar />
  <div class="max-w-screen-lg mx-auto">
    <TestComponent />
  </div>
</template>
