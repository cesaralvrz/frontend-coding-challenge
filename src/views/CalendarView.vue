<template>
  <div class="container mx-auto p-6">
    <div class="mb-8">
      <Autocomplete
        v-model="query"
        :search-function="searchStations"
        @select="handleStationSelect"
        placeholder="Search for a station..."
      />
    </div>

    <div class="flex justify-between items-center mb-6">
      <button 
        @click="previousWeek"
        class="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-sm cursor-pointer"
      >
        Previous Week
      </button>

      <h2 class="text-2xl font-semibold text-gray-800">
        {{ formatDateRange }}
      </h2>

      <button 
        @click="nextWeek"
        class="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-sm cursor-pointer"
      >
        Next Week
      </button>
    </div>

    <div 
      v-if="calendarStore.selectedStation" 
      class="mb-6"
    >
      <div class="flex items-center gap-3 bg-amber-100 p-3 rounded-lg border border-amber-200">
        <span class="text-gray-800">Selected Station: <strong>{{ calendarStore.selectedStation.name }}</strong></span>
        <button 
          @click="clearStation" 
          class="text-amber-400 hover:text-amber-500 transition-colors duration-200 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <WeekDayTile 
        v-for="date in weekDates" 
        :key="date"
        :date="date"
        :bookings="getBookingsForDate(date)"
        :stations="calendarStore.stations"
        :selected-station="calendarStore.selectedStation"
        @booking-click="handleBookingClick"
        class="bg-white h-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { format, startOfWeek, addDays } from 'date-fns';
import { useCalendarStore } from '~/stores/calendarStore';
import Autocomplete from '~/components/common/Autocomplete.vue';
import WeekDayTile from '~/components/calendar/WeekDayTile.vue';

const router = useRouter();
const calendarStore = useCalendarStore();
const selectedBooking = ref(null);
const query = ref('');
const baseDate = ref(new Date('2021-01-01')); // Date to correspond to the bookings

const weekDates = computed(() => {
  const weekStart = startOfWeek(baseDate.value);
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
});

const formatDateRange = computed(() => {
  const start = format(baseDate.value, 'MMM d, yyyy');
  const end = format(addDays(baseDate.value, 6), 'MMM d, yyyy');
  return `${start} - ${end}`;
});

const previousWeek = () => {
  baseDate.value = addDays(baseDate.value, -7);
};

const nextWeek = () => {
  baseDate.value = addDays(baseDate.value, 7);
};

const searchStations = async (searchQuery) => {
  if (!searchQuery.trim()) return [];
  return calendarStore.stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const handleStationSelect = async (station) => {
  calendarStore.setSelectedStation(station);
  query.value = '';
};

const clearStation = () => {
  calendarStore.clearStation();
  query.value = '';
};

const isBookingForDate = (booking, date) => {
  try {
    const targetDate = new Date(date);
    const bookingStartDate = new Date(booking.startDate);
    const bookingEndDate = new Date(booking.endDate);
    
    // Normalize all dates to start of day
    [targetDate, bookingStartDate, bookingEndDate].forEach(date => 
      date.setHours(0, 0, 0, 0)
    );
    
    return targetDate.getTime() === bookingStartDate.getTime() || 
           targetDate.getTime() === bookingEndDate.getTime();
  } catch (error) {
    console.error('Error processing booking:', booking, error);
    return false;
  }
};

const getBookingsForDate = (date) => {
  const stations = calendarStore.selectedStation 
    ? [calendarStore.selectedStation] 
    : calendarStore.stations;

  return stations.flatMap(station => 
    station.bookings.filter(booking => isBookingForDate(booking, date))
  );
};

const handleBookingClick = async (booking) => {
  selectedBooking.value = booking;
  // Find the station that contains this booking
  const station = calendarStore.stations.find(station => 
    station.bookings.some(b => b.id === booking.id)
  );
  
  if (station) {
    calendarStore.setSelectedStation(station);
    router.push(`/booking/${station.id}/${booking.id}`);
  } else {
    console.error('Could not find station for booking:', booking);
  }
};

onMounted(async () => {
  await calendarStore.fetchStations();
});
</script>