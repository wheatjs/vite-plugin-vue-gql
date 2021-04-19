<script setup lang="ts">
import { useQuery } from 'vql-gen'
import Album from './Album.vue'

const { data, fetching, error } = useQuery()
</script>

<template>
  <div v-if="fetching">
    Loading...
  </div>
  <div v-else-if="error?.message">
    Oops, there was an error
  </div>
  <div v-else-if="data">
    <!-- Use Query Data Here -->
    
    <!-- {{ data.status }} -->
    <!-- <template v-for="user in data.users">
      {{ user.username }}
      <Album :data="data" />
      <template v-if="user.hasProfile">
        {{ user.profile.profilePicture }}
      </template>
    </template> -->
  </div>
</template>
