import { api } from './api'

export const bookingService = {
  async getBooking(stationId, bookingId) {
    return api.get(`/stations/${stationId}/bookings/${bookingId}`)
  },

  async updateBooking(stationId, bookingId, updateData) {
    // Emulate API call
    console.log(`API Call: PUT /stations/${stationId}/bookings/${bookingId}`, updateData)

    // Return mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: bookingId,
          ...updateData
        })
      }, 500)
    })
  }
}
