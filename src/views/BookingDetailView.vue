<template>
  <div class="container mx-auto p-6 text-gray-800 min-h-screen flex items-center justify-center w-full">
    <div v-if="bookingStore.loading" class="w-full">
      <div class="animate-pulse text-center">
        <div class="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Loading booking details...</p>
      </div>
    </div>

    <div v-else-if="bookingStore.error" class="w-full">
      <div class="text-center bg-red-50 p-6 rounded-lg shadow-sm">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 text-lg">{{ bookingStore.error }}</p>
      </div>
    </div>

    <div v-else-if="bookingStore.currentBooking" 
         class="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Booking Details</h1>
      
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100">
            <h2 class="text-sm font-medium text-gray-600 mb-2">Customer Name</h2>
            <p class="text-xl text-gray-800">{{ bookingStore.currentBooking.customerName }}</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100">
            <h2 class="text-sm font-medium text-gray-600 mb-2">Station</h2>
            <p class="text-xl text-gray-800">{{ stationName }}</p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100">
          <h2 class="text-sm font-medium text-gray-600 mb-2">Booking Period</h2>
          <p class="text-xl text-gray-800">
            {{ formatDate(bookingStore.currentBooking.startDate) }} - 
            {{ formatDate(bookingStore.currentBooking.endDate) }}
          </p>
          <p class="text-sm text-teal-600 mt-2">{{ calculateDuration }} days</p>
        </div>
      </div>

      <div class="mt-10 flex justify-center">
        <button
          @click="handleReturn"
          class="bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 
                 transition-all duration-200 transform hover:scale-105 hover:shadow-md
                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 cursor-pointer"
        >
          <span class="flex items-center font-bold">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Calendar
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { format, differenceInDays } from 'date-fns';
import { useBookingStore } from '~/stores/bookingStore';
import { useCalendarStore } from '~/stores/calendarStore';

const props = defineProps({
  stationId: {
    type: String,
    required: true
  },
  bookingId: {
    type: String,
    required: true
  }
});

const router = useRouter();

const bookingStore = useBookingStore();
const calendarStore = useCalendarStore();

const stationName = computed(() => {
  const station = calendarStore.stations.find(s => s.id === props.stationId);
  return station?.name || 'Unknown Station';
});

const calculateDuration = computed(() => {
  if (!bookingStore.currentBooking) return 0;
  return differenceInDays(
    new Date(bookingStore.currentBooking.endDate),
    new Date(bookingStore.currentBooking.startDate)
  );
});

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy');
};

const handleReturn = () => {
  bookingStore.clearBooking();
  calendarStore.clearStation();
  router.push('/');
};

onMounted(async () => {
  await bookingStore.fetchBooking(props.stationId, props.bookingId);
  await calendarStore.fetchStations();
});
</script>