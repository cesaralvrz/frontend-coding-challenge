<template>
  <div 
    class="min-h-auto lg:min-h-[600px] h-full bg-white rounded-lg shadow-md p-4 flex flex-col transition-all duration-200 hover:shadow-lg"
    @dragover.prevent
    @drop="handleDrop"
  >
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
        class="group bg-teal-500 p-3 rounded-lg transform transition-all duration-200 hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between">
          <div 
            class="flex-grow cursor-pointer"
            @click="$emit('booking-click', booking)"
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
          
          <div 
            class="cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            draggable="true"
            @dragstart="handleDragStart($event, booking)"
            @dragend="handleDragEnd"
          >
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h8m-8 4h8m-8 4h8" />
            </svg>
          </div>
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

const emit = defineEmits(['booking-click', 'handle-reschedule']);

const handleDragStart = (event, booking) => {
  event.dataTransfer.setData('bookingId', booking.id);
  event.dataTransfer.setData('startDate', booking.startDate);
  event.dataTransfer.setData('endDate', booking.endDate);
};

const handleDragEnd = () => {
  // Clean up if needed
};

const handleDrop = (event) => {
  const bookingId = event.dataTransfer.getData('bookingId');
  const startDate = event.dataTransfer.getData('startDate');
  const endDate = event.dataTransfer.getData('endDate');
  
  emit('handle-reschedule', {
    bookingId,
    oldStartDate: startDate,
    oldEndDate: endDate,
    newDate: props.date
  });
};

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