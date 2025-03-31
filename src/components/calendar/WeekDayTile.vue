<template>
  <div class="min-h-auto lg:min-h-[600px] h-full bg-white rounded-lg shadow-md p-4 flex flex-col transition-all duration-200 hover:shadow-lg">
    <div class="text-center pb-3 border-b border-gray-100">
      <div class="text-sm font-medium text-gray-600 mb-1">
        {{ format(date, 'EEEE') }}
      </div>
      <div class="text-2xl font-bold text-gray-700">
        {{ format(date, 'd') }}
      </div>
    </div>
    
    <div class="flex-grow space-y-2 mt-3">
      <div 
        v-for="booking in bookings" 
        :key="booking.id"
        @click="$emit('booking-click', booking)"
        class="bg-teal-500 p-3 rounded-lg cursor-pointer transform transition-all duration-200 hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="text-lg font-bold text-white mb-1">{{ booking.customerName }}</div>
        
        <div class="text-sm font-bold text-white">
          {{ getStationName(booking) }}
        </div>

        <div class="text-sm text-teal-100 mt-1 flex items-center">
          <span class="inline-block w-2 h-2 rounded-full bg-teal-200 mr-2"></span>
          {{ isStartDate(date, booking.startDate) ? 'Start' : 'End' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns';

const props = defineProps({
  date: {
    type: Date,
    required: true
  },
  bookings: {
    type: Array,
    default: () => []
  },
  stations: {
    type: Array,
    default: () => []
  },
  selectedStation: {
    type: Object,
    default: null
  }
});

defineEmits(['booking-click']);

const getStationName = (booking) => {
  if (props.selectedStation) {
    return props.selectedStation.name;
  }
  
  // Find the station that contains this booking
  const station = props.stations.find(station => 
    station.bookings.some(b => b.id === booking.id)
  );
  return station?.name || 'Unknown Station';
};

const isStartDate = (date, startDate) => {
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  const bookingStart = new Date(startDate);
  bookingStart.setHours(0, 0, 0, 0);
  
  return compareDate.getTime() === bookingStart.getTime();
};
</script>