<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error: any = ref(null)
onErrorCaptured((err) => {
  error.value = err
})
</script>

<template>
  <div v-if="error">
    {{ error }}
  </div>
  <div v-else class="mt-8">
    <Tabs>
      <Tab name="Demo" active>
        <div class="p-8">
          <slot />
        </div>
      </Tab>
      <Tab name="Source">
        <div class="overflow-hidden">
          <slot name="source" />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>
