import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Userslist from '../views/UsersListView.vue'
import GestionarUsuarios from '../views/GestionarUsuarioView.vue'
import Login from '../views/LoginView.vue'
import ContactForm from '@/components/ContactForm.vue'
import Dashboard from '@/views/DashboardView.vue'
import Catalog from '@/views/CatalogView.vue'
import DetalleVideojuego from '@/views/DetalleVideojuegoView.vue'
import GameManagement from "@/views/GameManagementView.vue";

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
    {
      path: '/catalog',
      name: 'catalog',
      component: Catalog,
    },
    {
      path: '/detalleVideojuego',
      name: 'detalleVideojuego',
      component: DetalleVideojuego,
    },
    {
      path: '/GameManagement',
      name: 'GameManagement',
      component: GameManagement,
    },
  ],
})

export default router
