<p align="center">
  <img src='./assets/VQL-Logo.svg' alt="VQL" width="500">
</p>

<p align="center">
  Clean up your Vue SFC Scripts by moving your graphql quieres to their own block
</p>


## Why?
In the process of writing Vue applications that connect to GraphQL servers, I've started to notice that my graphql quieres are overcrowding my Vue SFC scripts. One solution would have been to move my queries to a seperate js file and just import them when I need to, but you then lose the ability to quickly see what your data looks like without having to go to a seperate file. The nice thing about Vue SFC is everything you need is in the same file, so I thought I would do the same thing for my graphql queries.

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
const { data } = useQuery({ name })
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
const { data } = useQuery('users', { name })
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

## Roadmap
- [ ] Add support for fragments
- [ ] Investigate automatically generating queries from SFC templates

## License

[MIT License](https://github.com/jacobclevenger/vite-plugin-vue-gql/blob/main/LICENSE) © 2021-PRESENT [Jacob Clevenger](https://github.com/jacobclevenger)