import { ref, computed } from 'vue'

const activitiesData = ref({}) // { '2024-01-01': { p360: true, blacklist: false, ... } }
const settings = ref({
  startDate: '2026-01-12',
  durationWeeks: 6,
  weekStart: 'Monday'
})

const activities = [
  { id: 'p360', name: 'P360 Training Session attended', points: 1 },
  { id: 'blacklist', name: 'Blacklist achievement', points: 10 },
  { id: 'atf-pr', name: 'ATF benchmark PR', points: 25 },
  { id: 'club-forged', name: 'Club Forged level achievement', points: 50 }
]

// Load from localStorage
const loadData = () => {
  const savedActivities = localStorage.getItem('atf-activities')
  const savedSettings = localStorage.getItem('atf-settings')
  
  if (savedActivities) {
    activitiesData.value = JSON.parse(savedActivities)
  }
  
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
  }
}

// Save to localStorage
const saveActivities = () => {
  localStorage.setItem('atf-activities', JSON.stringify(activitiesData.value))
}

const saveSettings = (newSettings) => {
  if (newSettings) {
    settings.value = { ...settings.value, ...newSettings }
  }
  localStorage.setItem('atf-settings', JSON.stringify(settings.value))
}

const getActivitiesForDate = (date) => {
  return activitiesData.value[date] || {
    p360: false,
    blacklist: false,
    'atf-pr': false,
    'club-forged': false
  }
}

const setActivitiesForDate = (date, activities) => {
  activitiesData.value[date] = { ...activities }
  saveActivities()
}

// Initialize
loadData()

export function useActivities() {
  return {
    activities,
    activitiesData,
    settings,
    getActivitiesForDate,
    setActivitiesForDate,
    saveSettings,
    loadData
  }
}
