import { describe, it, expect, beforeEach, vi } from 'vitest';
import { bookingService } from '~/services/bookingService';

describe('bookingService', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should fetch a booking by station and booking IDs', async () => {
    const mockBooking = {
      id: '123',
      customerName: 'John Doe',
      startDate: '2021-01-01',
      endDate: '2021-01-05'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooking,
    });

    const result = await bookingService.getBooking('1', '123');
    
    expect(global.fetch).toHaveBeenCalledWith(
      'https://605c94c36d85de00170da8b4.mockapi.io/stations/1/bookings/123'
    );
    expect(result).toEqual(mockBooking);
  });

  it('should handle API errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    await expect(bookingService.getBooking('1', '123')).rejects.toThrow('HTTP error! status: 404');
  });
});