<template>
  <div class="container mx-auto p-6 text-gray-800">
    <div v-if="bookingStore.loading" class="text-center">
      <p class="text-gray-600">Loading booking details...</p>
    </div>

    <div v-else-if="bookingStore.error" class="text-center">
      <p class="text-red-600">{{ bookingStore.error }}</p>
    </div>

    <div v-else-if="bookingStore.currentBooking" class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Booking Details</h1>
      
      <div class="space-y-4">
        <div class="border-b pb-3">
          <h2 class="text-sm text-gray-600">Customer Name</h2>
          <p class="text-lg">{{ bookingStore.currentBooking.customerName }}</p>
        </div>

        <div class="border-b pb-3">
          <h2 class="text-sm text-gray-600">Booking Period</h2>
          <p class="text-lg">
            {{ formatDate(bookingStore.currentBooking.startDate) }} - 
            {{ formatDate(bookingStore.currentBooking.endDate) }}
          </p>
        </div>

        <div class="border-b pb-3">
          <h2 class="text-sm text-gray-600">Duration</h2>
          <p class="text-lg">{{ calculateDuration }} days</p>
        </div>

        <div class="border-b pb-3">
          <h2 class="text-sm text-gray-600">Station</h2>
          <p class="text-lg">{{ stationName }}</p>
        </div>
      </div>

      <div class="mt-8">
        <button
          @click="handleReturn"
          class="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 cursor-pointer"
        >
          Return to Calendar
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