import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import App from '../App.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import SightingDetail from '../views/SightingDetail.vue'
import SightingForm from '../views/SightingForm.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: App,
    name: 'home'
  },
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/post',
    component: SightingForm,
    name: 'post'
  },
  {
    path: '/register',
    component: Register,
    name: 'register'
  },
  {
    path: '/sighting/:id',
    component: SightingDetail,
    name: 'sighting'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'is-active',
  routes
})

export default router
