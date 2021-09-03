<p align="center">
  <img src='./assets/VQL-Logo.svg' alt="VQL" width="500">
</p>

<p align="center">
  Clean up your Vue SFC Scripts by moving your graphql queries to their own block
</p>

<p align="center">
<a href="https://www.npmjs.com/package/vite-plugin-vue-gql" target="__blank"><img src="https://img.shields.io/npm/v/vite-plugin-vue-gql?color=a356fe&label=Version" alt="NPM version"></a>
</p>

## Why?
When writing Vue clients for GraphQL APIs, I've noticed scripts in Vue SFC files have become over-filled with GraphQL queries and had a need to organize the code better without taking away from what makes SFCs great: Having all the code for a single component organized and in one place.

Moving queries to their own files would then create multiple files for a single component, cluttering the project more and reducing productivity in having to write components spanning multiple files.

Enter Vue GQL! I wrote this Vite plugin to allow placing GraphQL queries related to a component directly within the component file without cluttering scripts, by placing them within their own specialized \<gql\> tags.

> ⚠️ This Plugin is still in Development and currently only works with the `<script setup>` format 

## Install
```bash
# Install Plugin
npm i -D vite-plugin-vue-gql

# Install Peer Dependicies
npm i @urql/vue graphql
```

```ts
// vite.config.ts

import Vue from '@vitejs/plugin-vue'
import Vql from 'vite-plugin-vue-gql'

export default {
  plugins: [
    Vue(), 
    Vql()
  ],
}
```

If you are using typescript, make sure you include the following in your `tsconfig.json`
```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-vue-gql/client"
    ]
  }
}
```

## Usage
Instead of import your functions from `@urql/vue` you should now import them from the `vql` package.

```ts
import { useQuery, useMutation, useSubscription } from 'vql'
```

`<gql>` tags can have the following attributes, `query`(not required), `mutation`, `subscription`, and `name`. The first three attributes indicates what type of query it is while the `name` attribute allows you to have multiple queries in the same Vue SFC. 
```html
<!-- Query-->
<gql></gql>

<!-- Mutation -->
<gql mutation></gql>

<!-- Subscription -->
<gql subscription></gql>

<!-- Named GQL Block -->
<gql name="users"></gql>
```

## Examples

**Basic Usage**
```html
<script setup lang="ts">
import { useQuery } from 'vql'

const { data } = useQuery()
</script>

<template>
  <h1>{{ data.hello }}</h1>
</template>

<gql>
{
  hello
}
</gql>
```


**Query with Variables**
```html
<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from 'vql'

const name = ref('Evan')
const { data } = useQuery({ variables: { name } })
</script>

<template>...</template>

<gql>
query($name: String!) {
  user(name: $name) {
    username
  }
}
</gql>
```

**Named Query**
```html
<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from 'vql'

const name = ref('Evan')
const { data } = useQuery('users', { variables: { name } })
</script>

<template>...</template>

<gql name="users">
query($name: String!) {
  user(name: $name) {
    username
  }
}
</gql>
```

**Mutations**
```html
<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from 'vql'

const { executeMutation } = useMutation()
</script>

<template>...</template>

<gql mutation>
mutation($name: String!) {
  createUser(name: $name) {
    username
  }
}
</gql>
```

**Subscriptions**
```html
<script setup lang="ts">
import { ref } from 'vue'
import { useSubscription } from 'vql'

const isPaused = ref(false)
const handleSubscription = (messages = [], response) => {
  return [response.newMessages, ...messages]
}

const { data } = useSubscription({ from: 'Eren' }, { pause: isPaused }, handleSubscription)
</script>

<template>...</template>

<gql mutation>
subscription MessageSub($from: String!) {
  newMessages(from: $from) {
    id
    from
    text
  }
}
</gql>
```

## Fragments
You can use fargments in your graphql queries, mutations, and subscriptions by specifying your `.gql` files that contain your fragments in the config. 

```ts
// vite.config.ts

import Vue from '@vitejs/plugin-vue'
import Vql from 'vite-plugin-vue-gql'

export default {
  plugins: [
    Vue(), 
    Vql({
      fragments: './src/fragments/**/*.gql'
    })
  ],
}
```

Here is a general idea of what your fragments should look like
```gql
# src/fragments/albums.gql

fragment albumFields on Album {
  id
  name
  image
}
```

Finally you can use these fragments in your Vue SFC

```html
<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from 'vql'

const name = ref('RADWIMPS')
const { data } = useQuery({ variables: { name } })
</script>

<template>...</template>

<gql>
query($name: String!) {
  queryArtists(byName: $name) {
    name
    image
    albums {
      ...albumFields
    }
  }
}
</gql>
```

## Roadmap
- [x] Add support for fragments
- [ ] Investigate automatically generating queries from SFC templates

## License

[MIT License](https://github.com/jacobclevenger/vite-plugin-vue-gql/blob/main/LICENSE) © 2021-PRESENT [Jacob Clevenger](https://github.com/jacobclevenger)
