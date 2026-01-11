<template>
  <div>
    
    <v-card class="mb-4">
      <v-card-text>
        <div class="d-flex align-center ga-2">
          <v-btn
            icon
            variant="text"
            @click="previousDay"
            size="small"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          
          <v-text-field
            v-model="selectedDate"
            label="Date"
            type="date"
            variant="outlined"
            density="comfortable"
            hide-details
            class="flex-grow-1"
          ></v-text-field>
          
          <v-btn
            icon
            variant="text"
            @click="nextDay"
            size="small"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="text-h6">Activities</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="activity in activities"
            :key="activity.id"
            class="px-0"
          >
            <template v-slot:prepend>
              <v-checkbox
                v-model="completedActivities[activity.id]"
                @update:model-value="updateActivity(activity.id)"
                density="comfortable"
                hide-details
              ></v-checkbox>
            </template>
            
            <v-list-item-title class="text-body-1">
              {{ activity.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2 mt-1">
              {{ activity.points }} point{{ activity.points !== 1 ? 's' : '' }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
      
      <v-card-text v-if="totalPoints > 0" class="pt-0">
        <v-divider class="mb-3"></v-divider>
        <div class="text-h6 text-primary">
          Total Points: {{ totalPoints }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { parseISO, format, addDays } from 'date-fns'
import { useActivities } from '../composables/useActivities'

const { activities, getActivitiesForDate, setActivitiesForDate } = useActivities()

const getTodayDate = () => {
  const today = new Date()
  return format(today, 'yyyy-MM-dd')
}

const selectedDate = ref(getTodayDate())

const previousDay = () => {
  const currentDate = parseISO(selectedDate.value)
  const prevDate = addDays(currentDate, -1)
  selectedDate.value = format(prevDate, 'yyyy-MM-dd')
}

const nextDay = () => {
  const currentDate = parseISO(selectedDate.value)
  const nextDate = addDays(currentDate, 1)
  selectedDate.value = format(nextDate, 'yyyy-MM-dd')
}
const completedActivities = ref({
  p360: false,
  blacklist: false,
  'atf-pr': false,
  'club-forged': false
})

const totalPoints = computed(() => {
  return activities
    .filter(activity => completedActivities.value[activity.id])
    .reduce((sum, activity) => sum + activity.points, 0)
})

const updateActivity = () => {
  setActivitiesForDate(selectedDate.value, completedActivities.value)
}

watch(selectedDate, (newDate) => {
  completedActivities.value = getActivitiesForDate(newDate)
})

onMounted(() => {
  completedActivities.value = getActivitiesForDate(selectedDate.value)
})
</script>
