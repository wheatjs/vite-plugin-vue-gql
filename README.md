# vite-plugin-vue-gql

### **⚠️ This Plugin is still in Development and currently only works with the `<script setup>` format**

This plugin allows you to use `gql` blocks in your Vue SFC with Vitejs

## Install

Install the pacakge
```bash
npm install -D vite-plugin-vue-gql
```

Install peer dependencies
```
npm install --save @urql/vue graphql
```

Add to your `vite.config.js`

```js
import Vue from '@vitejs/plugin-vue';
import Vql from 'vite-plugin-vue-gql';

export default {
  plugins: [Vue(), Vql()],
};
```

## Usage
```ts
// main.js

import { createApp } from 'vue'
import urql from '@urql/vue'
import App from './App.vue'

const app = createApp(App)

app.use(urql, { url: 'http://localhost:3000/graphql' })
app.mount('#app')
```

```html
<!-- ExampleComponent.vue -->

<script setup>
import { useQuery } from 'vite-gql'

const { fetching, error, data } = useQuery({ name: 'Evan' })
</script>

<template>
  <div v-if="fetching">
    Loading...
  </div>
  <div v-else-if="error.message">
    Error {{ error.message }}
  </div>
  <div v-else>
    <img :src="data.user.avatar">
    <span>{{ data.user.username }}</span>
  </div>
</template>

<gql>
query($name: String!) {
  user(name: $name) {
    username
    avatar
    bio {
      description
    }
  }
}
</gql>
```

Multiple GQL Tags

```html
<!-- ExampleComponent.vue -->

<script setup>
import { useQuery } from 'vite-gql'

const { fetching, error, data } = useQuery()
const { fetching: userFetching, error: userError, data: userData } = useQuery('user', { name: 'Evan' })
</script>

<template>
  ...
</template>

<gql>
query($name: String!) {
  info {
    date
    time
  }
}
</gql>

<gql name="user">
query($name: String!) {
  user(name: $name) {
    username
    avatar
    bio {
      description
    }
  }
}
</gql>
```

**Mutations**

```html
<!-- ExampleComponent.vue -->

<script setup >
import { useMutation } from 'vite-gql'

const { executeMutation } = mutation()

const createUser = (name) => {
  executeMutation({ name })
}
</script>

<template>
  ...
</template>

<gql mutation>
mutation($name: String!) {
  createUser(name: $name) {
    username
    created
  }
}
</gql>
```
For more examples visit the `/examples/spa` directory in the repo

## How it Works
When you create a `<gql>` tag, this plugin will pick that up and automatically inject it into your `useFetch` statement, allowing you to keep your query and your code seperate.

## Roadmap
- [x] Support `useMutation` and `useSubscription`
- [x] Support multiple named gql tags(or allow them to be tagged as mutations or subscriptions)
- [ ] Look into auto detecting used properties and auto-generating a GQL request 