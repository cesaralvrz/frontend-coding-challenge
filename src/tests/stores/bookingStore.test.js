import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBookingStore } from '~/stores/bookingStore';
import { bookingService } from '~/services/bookingService';

vi.mock('~/services/bookingService', () => ({
  bookingService: {
    getBooking: vi.fn()
  }
}));

describe('bookingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const store = useBookingStore();
    expect(store.currentBooking).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  describe('fetchBooking', () => {
    it('should fetch and set booking successfully', async () => {
      const mockBooking = {
        id: '123',
        customerName: 'John Doe',
        startDate: '2021-01-01',
        endDate: '2021-01-05',
        stationName: 'Berlin Station'  // Add stationName to mock data
      };

      bookingService.getBooking.mockResolvedValueOnce(mockBooking);

      const store = useBookingStore();
      await store.fetchBooking('1', '123');

      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.currentBooking).toEqual(mockBooking); // Remove the spread and stationName override
    });

    it('should handle errors when fetching booking', async () => {
      bookingService.getBooking.mockRejectedValueOnce(new Error('API Error'));

      const store = useBookingStore();
      await store.fetchBooking('1', '123');

      expect(store.loading).toBe(false);
      expect(store.error).toBe('Failed to fetch booking details');
      expect(store.currentBooking).toBeNull();
    });
  });

  describe('clearBooking', () => {
    it('should reset store state', () => {
      const store = useBookingStore();
      store.currentBooking = { id: '123' };
      store.error = 'Some error';

      store.clearBooking();

      expect(store.currentBooking).toBeNull();
      expect(store.error).toBeNull();
    });
  });
});