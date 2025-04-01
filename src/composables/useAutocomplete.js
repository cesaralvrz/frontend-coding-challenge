import { ref } from 'vue'
import { stationsService } from '~/services/stationsService'

export function useAutocomplete() {
  const query = ref('')
  const suggestions = ref([])
  const isLoading = ref(false)
  const showSuggestions = ref(false)
  const selectedItem = ref(null)

  const searchStations = async (searchQuery) => {
    if (!searchQuery.trim()) {
      suggestions.value = []
      return
    }

    try {
      isLoading.value = true
      const results = await stationsService.getStations(searchQuery)
      suggestions.value = results
    } catch (error) {
      console.error('Failed to fetch stations:', error)
      suggestions.value = []
    } finally {
      isLoading.value = false
    }
  }

  const handleSelect = (station) => {
    selectedItem.value = station
    query.value = station.name
    showSuggestions.value = false
  }

  const clearSelection = () => {
    selectedItem.value = null
    query.value = ''
    suggestions.value = []
  }

  return {
    query,
    suggestions,
    isLoading,
    showSuggestions,
    selectedItem,
    searchStations,
    handleSelect,
    clearSelection
  }
}
