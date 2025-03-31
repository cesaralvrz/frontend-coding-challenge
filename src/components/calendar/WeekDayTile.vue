<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="text-center mb-2">
      <div class="text-sm text-gray-500">
        {{ format(date, 'EEEE') }}
      </div>
      <div class="text-xl font-bold text-gray-400">
        {{ format(date, 'd') }}
      </div>
    </div>
    
    <div class="space-y-2">
      <div 
        v-for="booking in bookings" 
        :key="booking.id"
        @click="$emit('booking-click', booking)"
        class="bg-green-100 p-2 rounded cursor-pointer hover:bg-green-200"
      >
        <div class="text-sm font-semibold">{{ booking.customerName }}</div>
        <div class="text-xs text-gray-600">
          {{ booking.startDate === format(date, 'yyyy-MM-dd') ? 'Start' : 'End' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns';

defineProps({
  date: {
    type: Date,
    required: true
  },
  bookings: {
    type: Array,
    default: () => []
  }
});

defineEmits(['booking-click']);
</script>