import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Vql from 'vite-plugin-vue-gql'
import WindiCSS from 'vite-plugin-windicss'

const config = defineConfig({
  plugins: [
    Vue(),
    Vql(),
    WindiCSS(),
  ],
})

export default config
