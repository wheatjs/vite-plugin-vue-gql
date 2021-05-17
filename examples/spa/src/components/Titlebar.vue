<script setup lang="ts">
import Logo from './Logo.vue'
</script>

<template>
  <div class="fixed top-0 z-10 text-white left-0 right-0 h-18 backdrop-filter bg-gray-900 bg-opacity-50 backdrop-blur">
    <div class="border-b border-gray-800 h-full px-4">
      <div class="max-w-screen-lg w-full flex flex-row items-center mx-auto h-full">
        <div class="flex flex-1">
          <Logo class="h-12" />
        </div>
        
      </div>
    </div>
  </div>
</template>
