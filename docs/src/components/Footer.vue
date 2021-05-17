<script setup lang="ts">
import { isDark, toggleDark } from '~/logic'
</script>

<template>
  <nav class="text-xl mt-6">
    <router-link class="icon-btn mx-2" to="/">
      <carbon-campsite />
    </router-link>

    <a class="icon-btn mx-2" @click="toggleDark">
      <carbon-moon v-if="isDark" />
      <carbon-sun v-else />
    </a>

    <router-link class="icon-btn mx-2" to="/about">
      <carbon-dicom-overlay />
    </router-link>

    <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank" title="GitHub">
      <carbon-logo-github />
    </a>
  </nav>
</template>
