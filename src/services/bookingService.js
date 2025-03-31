import { api } from './api';

export const bookingService = {
  async getBooking(stationId, bookingId) {
    return api.get(`/stations/${stationId}/bookings/${bookingId}`);
  }
};