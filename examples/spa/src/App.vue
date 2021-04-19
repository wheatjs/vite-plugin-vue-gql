<script setup lang="ts">
import TestComponent2 from './components/TestComponent2.vue'
import GenerationPreview from './components/GenerationPreview.vue'
</script>

<template>
  <div>
    <GenerationPreview></GenerationPreview>
    <TestComponent2 />
    <!-- <Suspense>
      <template #default>
        <TestComponent />
      </template>
      <template #fallback>
        <div>
          Loading...
        </div>
      </template>
    </Suspense> -->
  </div>
</template>
