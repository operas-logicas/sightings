/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import App from '../App.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import SightingDetail from '../views/SightingDetail.vue'
import SightingForm from '../views/SightingForm.vue'
import { isLoggedIn } from '../shared/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: App
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: (to, from) => {
      if (isLoggedIn()) return { name: 'home' }
    }
  },
  {
    path: '/post',
    name: 'post',
    component: SightingForm,
    beforeEnter: (to, from) => {
      if (!isLoggedIn()) return { name: 'login' }
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter: (to, from) => {
      if (isLoggedIn()) return { name: 'home' }
    }
  },
  {
    path: '/sighting/:id',
    name: 'sighting',
    component: SightingDetail
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'is-active',
  routes
})

export default router
