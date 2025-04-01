import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bookingService } from '~/services/bookingService'

export const useBookingStore = defineStore('booking', () => {
  const currentBooking = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchBooking = async (stationId, bookingId) => {
    loading.value = true
    error.value = null
    try {
      currentBooking.value = await bookingService.getBooking(stationId, bookingId)
    } catch (err) {
      error.value = 'Failed to fetch booking details'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const clearBooking = () => {
    currentBooking.value = null
    error.value = null
  }

  const rescheduleBooking = async (stationId, bookingId, newDates, updateCalendarFn) => {
    loading.value = true
    error.value = null
    try {
      const updatedBooking = await bookingService.updateBooking(stationId, bookingId, {
        startDate: newDates.startDate,
        endDate: newDates.endDate
      })
      currentBooking.value = updatedBooking

      // Update the calendar store using the passed function
      if (updateCalendarFn) {
        updateCalendarFn(stationId, bookingId, newDates)
      }

      return updatedBooking
    } catch (err) {
      error.value = 'Failed to reschedule booking'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    currentBooking,
    loading,
    error,
    fetchBooking,
    clearBooking,
    rescheduleBooking
  }
})
