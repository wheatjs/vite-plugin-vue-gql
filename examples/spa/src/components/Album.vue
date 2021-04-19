<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ data: any }>()
</script>

<template>
  <div>
    {{ data.name }}
  </div>
</template>
