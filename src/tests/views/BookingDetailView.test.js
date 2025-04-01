import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useBookingStore } from '~/stores/bookingStore'
import { useCalendarStore } from '~/stores/calendarStore'
import BookingDetailView from '~/views/BookingDetailView.vue'

const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('BookingDetailView', () => {
  let wrapper
  let bookingStore
  let calendarStore

  beforeEach(() => {
    wrapper = mount(BookingDetailView, {
      props: {
        stationId: '1',
        bookingId: '123'
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })

    bookingStore = useBookingStore()
    calendarStore = useCalendarStore()
  })

  it('shows loading state', async () => {
    bookingStore.loading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Loading booking details...')
  })

  it('shows error state', async () => {
    bookingStore.error = 'Error message'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Error message')
  })

  it('displays booking details correctly', async () => {
    const mockBooking = {
      customerName: 'John Doe',
      startDate: '2021-01-01',
      endDate: '2021-01-05'
    }

    bookingStore.currentBooking = mockBooking
    calendarStore.stations = [{ id: '1', name: 'Berlin Station' }]

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Jan 1, 2021')
    expect(wrapper.text()).toContain('Jan 5, 2021')
    expect(wrapper.text()).toContain('4 days')
    expect(wrapper.text()).toContain('Berlin Station')
  })

  it('handles return to calendar', async () => {
    // Set up a current booking so the button is rendered
    bookingStore.currentBooking = {
      customerName: 'John Doe',
      startDate: '2021-01-01',
      endDate: '2021-01-05'
    }

    await wrapper.vm.$nextTick()
    await wrapper.find('button').trigger('click')

    expect(bookingStore.clearBooking).toHaveBeenCalled()
    expect(calendarStore.clearStation).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })

  it('fetches data on mount', () => {
    expect(bookingStore.fetchBooking).toHaveBeenCalledWith('1', '123')
    expect(calendarStore.fetchStations).toHaveBeenCalled()
  })

  it('shows unknown station when station not found', async () => {
    bookingStore.currentBooking = {
      customerName: 'John Doe',
      startDate: '2021-01-01',
      endDate: '2021-01-05'
    }
    calendarStore.stations = []

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Unknown Station')
  })
})
