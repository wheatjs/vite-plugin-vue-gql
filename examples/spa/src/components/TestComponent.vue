<script setup lang="ts">
import { ref } from 'vue'
import { useThrottle } from '@vueuse/core'
import { useQuery } from 'vql'

const name = ref('RADWIMPS')
const throttled = useThrottle(name, 2000)

const { fetching, error, data } = useQuery<any, any>({ name: throttled })

</script>

<template>
  <div class="max-w-screen-md px-4 py-8 mx-auto flex flex-col">
    <input v-model="name" class="rounded flex py-2 px-4 bg-transparent border-1 border-green-500 text-white" type="text">
    <div v-if="fetching" class="p-8 text-center">
      Loading...
    </div>
    <div v-else-if="error?.message">
      {{ error?.message }}
    </div>
    <div v-else class="py-8">
      <div v-for="artist in data.queryArtists" :key="artist.name">
        <div class="flex flex-row">
          <img class="rounded max-w-72" :src="artist.image">
          <div class="text-5xl ml-4">
            {{ artist.name }}
          </div>
        </div>
        <div class="mt-8">
          <span class="font-bold text-sm block">Albums</span>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="album in artist.albums" :key="album.name" class="bg-gray-800">
              <img :src="album.image">
              <span class="block text-xs py-4 px-4">{{ album.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<gql>
query($name: String!) {
  queryArtists(byName: $name) {
    name
    image
    albums {
      name
      image
    }
  }
}
</gql>
