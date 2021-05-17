<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ fetching: boolean; error: any }>()
</script>

<template>
  <div v-if="fetching" class="pt-8">
    <Spinner class="mx-auto" />
  </div>
  <div v-else-if="error?.message">
    Oops and error ocurred
  </div>
  <template v-else>
    <slot />
  </template>
</template>
