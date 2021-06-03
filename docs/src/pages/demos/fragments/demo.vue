<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from 'vql'
import { useDebounce } from '@vueuse/core'
import type { Artist } from '~/types'

const name = ref('Fear, and Loathing in Las Vegas')
const throttledName = useDebounce(name, 100)

const { fetching, error, data } = useQuery<{ queryArtists: Artist[] }>({
  variables: {
    name: throttledName,
  },
})
</script>

<template>
  <div class="pt-4">
    <Textfield v-model="name">
      <carbon-search />
    </Textfield>
    <DataLoader :fetching="fetching" :error="error" :data="data">
      <template v-if="data">
        <div v-for="artist in data.queryArtists" :key="artist.id" class="mt-8">
          <div class="flex items-center flex-col text-center lg:text-left lg:flex-row space-x-4">
            <img :src="artist.image" class="rounded-xl bg-black w-48 h-48 content-cover shadow-lg" />
            <div class="flex-col items-center">
              <h2 class="lg:text-5xl mt-4 lg:mt-0 text-3xl">
                {{ artist.name }}
              </h2>
              <span class="text-lg text-gray-400 font-bold mt-2 block">
                {{ artist.albums.length }} Albums
              </span>
            </div>
          </div>
          <div class="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div v-for="album in artist.albums" :key="album.id">
              <img :src="album.image" class="rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      </template>
    </DataLoader>
  </div>
</template>

<gql>
query($name: String!) {
  queryArtists(byName: $name) {
    id
    name
    image
    albums {
      ...albumFields
    }
  }
}
</gql>
