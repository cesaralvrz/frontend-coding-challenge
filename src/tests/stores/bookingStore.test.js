import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBookingStore } from '~/stores/bookingStore'
import { bookingService } from '~/services/bookingService'

vi.mock('~/services/bookingService', () => ({
  bookingService: {
    getBooking: vi.fn(),
    updateBooking: vi.fn()
  }
}))

describe('bookingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should have initial state', () => {
    const store = useBookingStore()
    expect(store.currentBooking).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  describe('fetchBooking', () => {
    it('should fetch and set booking successfully', async () => {
      const mockBooking = {
        id: '123',
        customerName: 'John Doe',
        startDate: '2021-01-01',
        endDate: '2021-01-05',
        stationName: 'Berlin Station' // Add stationName to mock data
      }

      bookingService.getBooking.mockResolvedValueOnce(mockBooking)

      const store = useBookingStore()
      await store.fetchBooking('1', '123')

      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.currentBooking).toEqual(mockBooking) // Remove the spread and stationName override
    })

    it('should handle errors when fetching booking', async () => {
      bookingService.getBooking.mockRejectedValueOnce(new Error('API Error'))

      const store = useBookingStore()
      await store.fetchBooking('1', '123')

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Failed to fetch booking details')
      expect(store.currentBooking).toBeNull()
    })
  })

  describe('clearBooking', () => {
    it('should reset store state', () => {
      const store = useBookingStore()
      store.currentBooking = { id: '123' }
      store.error = 'Some error'

      store.clearBooking()

      expect(store.currentBooking).toBeNull()
      expect(store.error).toBeNull()
    })
  })

  describe('rescheduleBooking', () => {
    it('should reschedule booking successfully', async () => {
      const mockBooking = {
        id: '123',
        startDate: '2024-03-21',
        endDate: '2024-03-23'
      }

      const updateCalendarFn = vi.fn()
      bookingService.updateBooking.mockResolvedValueOnce(mockBooking)

      const store = useBookingStore()
      await store.rescheduleBooking(
        'station1',
        '123',
        {
          startDate: '2024-03-21',
          endDate: '2024-03-23'
        },
        updateCalendarFn
      )

      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.currentBooking).toEqual(mockBooking)
      expect(updateCalendarFn).toHaveBeenCalledWith('station1', '123', {
        startDate: '2024-03-21',
        endDate: '2024-03-23'
      })
    })

    it('should handle reschedule error', async () => {
      bookingService.updateBooking.mockRejectedValueOnce(new Error('API Error'))
      const updateCalendarFn = vi.fn()

      const store = useBookingStore()

      await expect(
        store.rescheduleBooking(
          'station1',
          '123',
          {
            startDate: '2024-03-21',
            endDate: '2024-03-23'
          },
          updateCalendarFn
        )
      ).rejects.toThrow()

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Failed to reschedule booking')
      expect(updateCalendarFn).not.toHaveBeenCalled()
    })
  })
})
