import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../features/user/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../features/user/RegisterView.vue')
    }
  ]
})

export default router
