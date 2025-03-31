import { defineStore } from 'pinia';
import { ref } from 'vue';
import { bookingService } from '~/services/bookingService';

export const useBookingStore = defineStore('booking', () => {
  const currentBooking = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchBooking = async (stationId, bookingId) => {
    loading.value = true;
    error.value = null;
    try {
        currentBooking.value = await bookingService.getBooking(stationId, bookingId);
    } catch (err) {
      error.value = 'Failed to fetch booking details';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const clearBooking = () => {
    currentBooking.value = null;
    error.value = null;
  };

  return {
    currentBooking,
    loading,
    error,
    fetchBooking,
    clearBooking
  };
});