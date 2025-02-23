import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Userslist from '../views/UsersListView.vue'
import GestionarUsuarios from '../views/GestionarUsuarioView.vue'
import Login from '../views/LoginView.vue'
import ContactForm from '@/components/ContactForm.vue'
import Dashboard from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: Userslist,
    },
    {
      path: '/gestionUsuario',
      name: 'gestionUsuario',
      component: GestionarUsuarios,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactForm,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
  ],
})

export default router
