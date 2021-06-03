<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ to: string; label: string }>()
</script>

<template>
  <router-link :to="to" class="dark:(bg-black bg-opacity-25 border-gray-800) border-1  rounded-xl">
    <div class="text-5xl p-8 flex justify-center">
      <slot />
    </div>
    <div class="text-center font-semibold text-lg dark:(text-gray-300) text-gray-600">
      {{ label }}
    </div>
    <div class="text-center dark:text-gray-400 text-gary-500 max-w-56 mx-auto pb-8">
      <slot name="description" />
    </div>
  </router-link>
</template>
