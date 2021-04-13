<script setup lang="ts">
import TestComponent from './components/TestComponent.vue'
</script>

<template>
  <div>
    <Suspense>
      <template #default>
        <TestComponent />
      </template>
      <template #fallback>
        <div>
          Loading...
        </div>
      </template>
    </Suspense>
  </div>
</template>
