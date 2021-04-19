<script setup lang="ts">
import { generated } from 'virtual:gql-generation'
</script>

<template>
  <div class="h-screen grid place-content-center place-items-center">
    <div class="prose bg-black bg-opacity-50 rounded-lg p-8 w-100">
      <span class="block mb-4 text-gray-500 text-sm font-bold">Generated GraphQL Query</span>
      <code>
        <pre v-for="code in generated" :key="code">{{ code }}</pre>
      </code>
    </div>
  </div>
</template>
