import { createRouter, createWebHistory } from 'vue-router';
import CalendarView from '~/views/CalendarView.vue';

const routes = [
  {
    path: '/',
    name: 'calendar',
    component: CalendarView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;