<template>
  <div>
    <v-card class="mb-4" variant="tonal" color="primary">
      <v-card-text class="text-center py-6">
        <div class="text-h6 text-medium-emphasis mb-2">Challenge Total</div>
        <div class="text-h4 text-primary font-weight-bold">{{ totalCumulativePoints }}</div>
      </v-card-text>
    </v-card>
    
    <v-card v-for="(week, index) in weeks" :key="index" class="mb-4">
      <v-card-title @click="toggleWeek(index)" class="cursor-pointer">
        <v-icon class="mr-2">{{ expandedWeeks[index] ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
        <span>Week {{ index + 1 }}</span>
        <span class="text-body-2 text-medium-emphasis ml-3">
          {{ formatDateRange(week.startDate, week.endDate) }}
        </span>
        <v-spacer></v-spacer>
        <span class="text-h6 text-primary">{{ week.totalPoints }} points</span>
      </v-card-title>

      <v-expand-transition>
        <div v-show="expandedWeeks[index]">
          <v-divider></v-divider>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="activity in activities"
                :key="activity.id"
                class="px-0"
              >
                <v-list-item-title class="text-body-2">
                  {{ activity.name }}
                </v-list-item-title>
                <template v-slot:append>
                  <div class="text-body-2">
                    {{ week.activityCounts[activity.id] || 0 }} × {{ activity.points }} = 
                    <strong>{{ (week.activityCounts[activity.id] || 0) * activity.points }} pts</strong>
                  </div>
                </template>
              </v-list-item>
              
              <v-list-item v-if="week.bonusPoints > 0" class="px-0">
                <v-list-item-title class="text-body-2 text-success">
                  P360 Bonus (4+ sessions)
                </v-list-item-title>
                <template v-slot:append>
                  <div class="text-body-2 text-success">
                    <strong>+{{ week.bonusPoints }} pts</strong>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>

    <v-card v-if="weeks.length === 0" class="mb-4">
      <v-card-text class="text-center text-medium-emphasis py-8">
        No challenge weeks configured. Please set up challenge settings.
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { parseISO, format, addDays, addWeeks } from 'date-fns'
import { useActivities } from '../composables/useActivities'

const { activities, activitiesData, settings } = useActivities()
const expandedWeeks = ref({})

const weeks = computed(() => {
  if (!settings.value.startDate || !settings.value.durationWeeks) {
    return []
  }

  const startDate = parseISO(settings.value.startDate)
  const duration = settings.value.durationWeeks || 4
  const weeksList = []

  for (let i = 0; i < duration; i++) {
    const weekStart = addWeeks(startDate, i)
    
    const weekDates = []
    for (let j = 0; j < 7; j++) {
      const date = addDays(weekStart, j)
      weekDates.push(format(date, 'yyyy-MM-dd'))
    }
    
    const activityCounts = {}
    let weekTotal = 0
    
    activities.forEach(activity => {
      activityCounts[activity.id] = 0
    })
    
    weekDates.forEach(date => {
      const dayActivities = activitiesData.value[date] || {}
      activities.forEach(activity => {
        if (dayActivities[activity.id]) {
          activityCounts[activity.id]++
          weekTotal += activity.points
        }
      })
    })
    
    // Calculate bonus points (5 points if 4+ P360 sessions)
    let bonusPoints = 0
    if (activityCounts.p360 >= 4) {
      bonusPoints = 5
      weekTotal += bonusPoints
    }
    
    const weekEnd = new Date(weekDates[weekDates.length - 1])
    
    weeksList.push({
      startDate: weekDates[0],
      endDate: weekDates[weekDates.length - 1],
      activityCounts,
      bonusPoints,
      totalPoints: weekTotal
    })
  }
  
  return weeksList
})

const totalCumulativePoints = computed(() => {
  return weeks.value.reduce((sum, week) => sum + week.totalPoints, 0)
})

const formatDateRange = (start, end) => {
  const startDate = parseISO(start)
  const endDate = parseISO(end)
  return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
}

const toggleWeek = (index) => {
  expandedWeeks.value[index] = !expandedWeeks.value[index]
}

onMounted(() => {
  // Initialize all weeks as collapsed
  weeks.value.forEach((_, index) => {
    if (expandedWeeks.value[index] === undefined) {
      expandedWeeks.value[index] = false
    }
  })
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
