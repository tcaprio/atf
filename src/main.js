import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import App from './App.vue'
import Week from './views/Week.vue'
import Activities from './views/Activities.vue'
import History from './views/History.vue'

const routes = [
  { path: '/week', component: Week },
  { path: '/activities', component: Activities },
  { path: '/history', component: History },
  { path: '/', redirect: '/week' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#f44336', // Red
          secondary: '#ff5252',
          accent: '#ff1744',
          error: '#f44336',
          warning: '#ff9800',
          info: '#2196f3',
          success: '#4caf50'
        }
      }
    }
  }
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
