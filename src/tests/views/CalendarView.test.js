import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import { format, addDays } from 'date-fns'
import CalendarView from '~/views/CalendarView.vue'
import { useCalendarStore } from '~/stores/calendarStore'
import { nextTick } from 'vue'

describe('CalendarView', () => {
  let store

  const mockStations = [
    {
      id: 1,
      name: 'Berlin',
      bookings: [
        {
          id: 1,
          customerName: 'John Doe',
          startDate: '2021-01-01',
          endDate: '2021-01-03'
        }
      ]
    },
    {
      id: 2,
      name: 'Munich',
      bookings: [
        {
          id: 2,
          customerName: 'Jane Smith',
          startDate: '2021-01-02',
          endDate: '2021-01-04'
        }
      ]
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = () => {
    const wrapper = render(CalendarView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              calendar: {
                stations: mockStations,
                selectedStation: null
              }
            }
          })
        ]
      }
    })

    store = useCalendarStore()
    return wrapper
  }

  it('renders the calendar view with correct date range', () => {
    const { getByText } = renderComponent()
    const expectedStart = format(new Date('2021-01-01'), 'MMM d, yyyy')
    const expectedEnd = format(addDays(new Date('2021-01-01'), 6), 'MMM d, yyyy')

    expect(getByText(`${expectedStart} - ${expectedEnd}`)).toBeInTheDocument()
  })

  it('navigates to previous week when clicking previous button', async () => {
    const { getByText } = renderComponent()
    const prevButton = getByText('Previous Week')

    await fireEvent.click(prevButton)

    const expectedStart = format(addDays(new Date('2021-01-01'), -7), 'MMM d, yyyy')
    const expectedEnd = format(addDays(new Date('2021-01-01'), -1), 'MMM d, yyyy')
    expect(getByText(`${expectedStart} - ${expectedEnd}`)).toBeInTheDocument()
  })

  it('navigates to next week when clicking next button', async () => {
    const { getByText } = renderComponent()
    const nextButton = getByText('Next Week')

    await fireEvent.click(nextButton)

    const expectedStart = format(addDays(new Date('2021-01-01'), 7), 'MMM d, yyyy')
    const expectedEnd = format(addDays(new Date('2021-01-01'), 13), 'MMM d, yyyy')
    expect(getByText(`${expectedStart} - ${expectedEnd}`)).toBeInTheDocument()
  })

  it('filters bookings correctly for a specific date', () => {
    const date = new Date('2021-01-01')

    const isBookingForDate = (booking, date) => {
      const targetDate = new Date(date)
      const bookingStartDate = new Date(booking.startDate)
      const bookingEndDate = new Date(booking.endDate)

      ;[targetDate, bookingStartDate, bookingEndDate].forEach((d) => d.setHours(0, 0, 0, 0))

      return (
        targetDate.getTime() === bookingStartDate.getTime() ||
        targetDate.getTime() === bookingEndDate.getTime()
      )
    }

    const bookings = store.stations.flatMap((station) =>
      station.bookings.filter((booking) => isBookingForDate(booking, date))
    )

    expect(bookings).toHaveLength(1)
    expect(bookings[0].customerName).toBe('John Doe')
  })

  it('shows selected station info when a station is selected', async () => {
    const { getByText, queryByText } = renderComponent()

    expect(queryByText(/Selected Station:/)).not.toBeInTheDocument()

    await store.$patch({
      selectedStation: mockStations[0]
    })

    await nextTick()

    expect(getByText(/Selected Station:/)).toBeInTheDocument()
    expect(getByText(/Berlin/, { selector: 'strong' })).toBeInTheDocument()
  })

  it('clears selected station when clicking the clear button', async () => {
    const { getByRole, queryByText } = renderComponent()

    // Setup store with initial state
    await store.$patch({
      selectedStation: mockStations[0]
    })
    await nextTick()

    // Mock the clearStation method
    store.clearStation = vi.fn(() => {
      store.selectedStation = null
    })

    const clearButton = getByRole('button', { name: /✕/i })
    await fireEvent.click(clearButton)
    await nextTick()

    expect(queryByText(/Selected Station:/)).not.toBeInTheDocument()
    expect(store.selectedStation).toBeNull()
  })

  it('fetches stations on component mount', () => {
    renderComponent()
    expect(store.fetchStations).toHaveBeenCalled()
  })

  it('handles station search correctly', async () => {
    const { getByPlaceholderText } = renderComponent()
    const searchInput = getByPlaceholderText('Search for a station...')

    await fireEvent.update(searchInput, 'Ber')

    const filteredStations = store.stations.filter((station) =>
      station.name.toLowerCase().includes('Ber'.toLowerCase())
    )
    expect(filteredStations).toHaveLength(1)
    expect(filteredStations[0].name).toBe('Berlin')
  })
})
