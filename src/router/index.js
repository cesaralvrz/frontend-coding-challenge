import { createRouter, createWebHistory } from 'vue-router';
import CalendarView from '~/views/CalendarView.vue';
import BookingDetailView from '~/views/BookingDetailView.vue';

const routes = [
  {
    path: '/',
    name: 'calendar',
    component: CalendarView,
  },
  {
    path: '/booking/:stationId/:bookingId',
    name: 'BookingDetail',
    component: BookingDetailView,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;