<script setup lang="ts">

</script>

<template>
  <div class="h-full">
    <div class="text-3xl font-bold text-gray-400 mb-8">Demos</div>
    <div class="gap-8 grid lg:grid-cols-2">
      <DemoLink to="/demos/block" label="Blocks">
        <fa-code />
        <template #description>
          Define your graphql queries within their own block in your Vue SFC
        </template>
      </DemoLink>
      <DemoLink to="/demos/generation" label="Generation">
        <fa-magic />
        <template #description>
          Automatically generate graphql queries based on their usage within a Vue SFC
        </template>
      </DemoLink>
    </div>
  </div>
</template>
