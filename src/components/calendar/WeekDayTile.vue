<template>
  <div class="h-full bg-white rounded-lg shadow-md p-4 flex flex-col transition-all duration-200 hover:shadow-lg">
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
        <div class="text-md font-bold text-white mb-1">{{ booking.customerName }}</div>
        <div class="text-sm text-teal-100">{{ location }}</div>
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

// In the script setup section:
defineProps({
  date: {
    type: Date,
    required: true
  },
  bookings: {
    type: Array,
    default: () => []
  },
  location: {
    type: String,
    required: true
  }
});

defineEmits(['booking-click']);

const isStartDate = (date, startDate) => {
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  const bookingStart = new Date(startDate);
  bookingStart.setHours(0, 0, 0, 0);
  
  return compareDate.getTime() === bookingStart.getTime();
};
</script>