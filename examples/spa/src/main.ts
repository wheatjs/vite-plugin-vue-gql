import { createApp } from 'vue'
import urql from '@urql/vue'
import App from './App.vue'
import 'windi.css'
import './index.css'

const app = createApp(App)

app.use(urql, { url: 'https://spotify-graphql-server.herokuapp.com/graphql', })
app.mount('#app')
