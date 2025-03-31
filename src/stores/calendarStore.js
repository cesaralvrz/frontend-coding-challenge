import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';
import { stationsService } from '~/services/stationsService';

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const currentDate = ref(new Date());
  const selectedStation = ref(null);
  const stations = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Computed
  const currentWeekDays = computed(() => {
    const start = startOfWeek(currentDate.value, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(start, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  });

  // Actions
  const fetchStations = async (query = '') => {
    try {
      isLoading.value = true;
      error.value = null;
      const allStations = await stationsService.getStations(query);
      stations.value = allStations.filter(station => 
        station.name !== 'station-name{{i}}'
      );
    } catch (err) {
      error.value = 'Failed to fetch stations';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const setSelectedStation = (station) => {
    selectedStation.value = station;
  };

  const clearStation = () => {
    selectedStation.value = null;
  };

  return {
    // State
    currentDate,
    selectedStation,
    stations,
    isLoading,
    error,
    // Computed
    currentWeekDays,
    // Actions
    fetchStations,
    setSelectedStation,
    clearStation,
  };
});