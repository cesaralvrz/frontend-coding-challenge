import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { startOfWeek, addWeeks, eachDayOfInterval, endOfWeek } from 'date-fns';
import { stationsService } from '~/services/stationsService';

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const currentDate = ref(new Date());
  const selectedStation = ref(null);
  const stations = ref([]);
  const bookings = ref([]);
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
      stations.value = await stationsService.getStations(query);
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

  const nextWeek = () => {
    currentDate.value = addWeeks(currentDate.value, 1);
  };

  const previousWeek = () => {
    currentDate.value = addWeeks(currentDate.value, -1);
  };

  return {
    // State
    currentDate,
    selectedStation,
    stations,
    bookings,
    isLoading,
    error,
    // Computed
    currentWeekDays,
    // Actions
    fetchStations,
    setSelectedStation,
    nextWeek,
    previousWeek,
  };
});