import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Userslist from '../views/UsersListView.vue'
import GestionarUsuarios from '../views/GestionarUsuarioView.vue'

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
  ],
})

export default router
