<script setup lang="ts">
import { defineProps, defineEmit } from 'vue'
import { useVModel } from '@vueuse/core'

const emit = defineEmit(['update:modelValue'])
const props = defineProps<{ placeholder: string; type: string; modelValue: string | number }>()

const value = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="flex flex-row items-center h-10 rounded dark:(border-gray-700 bg-gray-800) border-1">
    <div v-if="$slots.default" class="pl-4">
      <slot />
    </div>
    <input
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      class="h-full px-4 flex-1 text-current bg-transparent focus:outline-none"
    >
  </div>
</template>
