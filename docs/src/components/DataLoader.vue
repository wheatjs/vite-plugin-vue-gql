<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ fetching: boolean; error: any, data: any }>()
</script>

<template>
  <div v-if="fetching && !data" class="pt-8">
    <Spinner class="mx-auto" />
  </div>
  <div v-else-if="error?.message">
    Oops, an error ocurred
  </div>
  <template v-else>
    <slot />
  </template>
</template>
