<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>ATF</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="settingsDialog = true">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.path"
          @click="drawer = false"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-bottom-navigation grow color="primary">
      <v-btn
        v-for="item in navItems"
        :key="item.title"
        :to="item.path"
        :prepend-icon="item.icon"
      >
        {{ item.title }}
      </v-btn>
    </v-bottom-navigation>

    <v-dialog v-model="settingsDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Challenge Settings</v-card-title>
        
        <v-card-text>
          <v-text-field
            v-model="settings.startDate"
            label="Start Date"
            type="date"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model.number="settings.durationWeeks"
            label="Duration (weeks)"
            type="number"
            variant="outlined"
            density="comfortable"
            min="1"
            class="mb-4"
          ></v-text-field>

          <v-select
            v-model="settings.weekStart"
            :items="weekStartOptions"
            label="Week Start"
            variant="outlined"
            density="comfortable"
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="settingsDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveSettings"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useActivities } from './composables/useActivities'

const { settings, saveSettings: saveSettingsToStore } = useActivities()

const drawer = ref(false)
const settingsDialog = ref(false)

const weekStartOptions = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const saveSettings = () => {
  saveSettingsToStore()
  settingsDialog.value = false
}

const navItems = [
  { title: 'Activity Log', path: '/activities', icon: 'mdi-format-list-bulleted' },
  { title: 'Summary', path: '/week', icon: 'mdi-calendar-week' }
]
</script>
