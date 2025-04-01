import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalendarStore } from '~/stores/calendarStore'
import { stationsService } from '~/services/stationsService'

vi.mock('~/services/stationsService', () => ({
  stationsService: {
    getStations: vi.fn()
  }
}))

describe('calendarStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const store = useCalendarStore()
    expect(store.currentDate).toBeInstanceOf(Date)
    expect(store.selectedStation).toBeNull()
    expect(store.stations).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should compute currentWeekDays correctly', () => {
    const store = useCalendarStore()
    const weekDays = store.currentWeekDays

    expect(weekDays).toHaveLength(7)
    expect(weekDays[0].getDay()).toBe(1) // Should start on Monday
    expect(weekDays[6].getDay()).toBe(0) // Should end on Sunday
  })

  it('should fetch and filter stations', async () => {
    const mockStations = [
      { id: 1, name: 'Berlin' },
      { id: 2, name: 'station-name{{i}}' }, // Should be filtered out
      { id: 3, name: 'Munich' }
    ]
    stationsService.getStations.mockResolvedValueOnce(mockStations)

    const store = useCalendarStore()
    await store.fetchStations()

    expect(stationsService.getStations).toHaveBeenCalled()
    expect(store.stations).toHaveLength(2)
    expect(store.stations).toEqual([
      { id: 1, name: 'Berlin' },
      { id: 3, name: 'Munich' }
    ])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle fetch stations error', async () => {
    stationsService.getStations.mockRejectedValueOnce(new Error('API Error'))

    const store = useCalendarStore()
    await store.fetchStations()

    expect(store.error).toBe('Failed to fetch stations')
    expect(store.isLoading).toBe(false)
    expect(store.stations).toEqual([])
  })

  it('should set selected station', () => {
    const store = useCalendarStore()
    const station = { id: 1, name: 'Berlin' }

    store.setSelectedStation(station)
    expect(store.selectedStation).toEqual(station)
  })

  it('should clear selected station', () => {
    const store = useCalendarStore()
    store.setSelectedStation({ id: 1, name: 'Berlin' })

    store.clearStation()
    expect(store.selectedStation).toBeNull()
  })

  describe('updateBookingDates', () => {
    it('should update booking dates in station', () => {
      const store = useCalendarStore()
      const mockStations = [
        {
          id: 'station1',
          bookings: [
            {
              id: 'booking1',
              customerName: 'John Doe',
              startDate: '2024-03-20',
              endDate: '2024-03-22'
            }
          ]
        }
      ]

      store.stations = mockStations

      store.updateBookingDates('station1', 'booking1', {
        startDate: '2024-03-21',
        endDate: '2024-03-23'
      })

      expect(store.stations[0].bookings[0]).toEqual({
        id: 'booking1',
        customerName: 'John Doe',
        startDate: '2024-03-21',
        endDate: '2024-03-23'
      })
    })

    it('should not modify state if station not found', () => {
      const store = useCalendarStore()
      const mockStations = [
        {
          id: 'station1',
          bookings: [{ id: 'booking1' }]
        }
      ]

      store.stations = mockStations
      const originalState = JSON.parse(JSON.stringify(mockStations))

      store.updateBookingDates('nonexistent', 'booking1', {
        startDate: '2024-03-21',
        endDate: '2024-03-23'
      })

      expect(store.stations).toEqual(originalState)
    })

    it('should not modify state if booking not found', () => {
      const store = useCalendarStore()
      const mockStations = [
        {
          id: 'station1',
          bookings: [{ id: 'booking1' }]
        }
      ]

      store.stations = mockStations
      const originalState = JSON.parse(JSON.stringify(mockStations))

      store.updateBookingDates('station1', 'nonexistent', {
        startDate: '2024-03-21',
        endDate: '2024-03-23'
      })

      expect(store.stations).toEqual(originalState)
    })
  })
})
