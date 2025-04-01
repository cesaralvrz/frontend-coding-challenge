import { createRouter, createWebHashHistory } from 'vue-router'
import CalendarView from '~/views/CalendarView.vue'
import BookingDetailView from '~/views/BookingDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'calendar',
    component: CalendarView
  },
  {
    path: '/booking/:stationId/:bookingId',
    name: 'BookingDetail',
    component: BookingDetailView,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory('/frontend-coding-challenge/'),
  routes
})

export default router
