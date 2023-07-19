import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LoginView
    },
    {
      path: '/:uid',
      name: 'Chats',
      component: HomeView,
    },
    {
     path:'/chat/:id',
     name:'chat',
     component:ChatView
    },
    {
      path:'/login',
      name:'login',
      component:LoginView
    },
    {
      path:'/signup',
      name:'signup',
      component:SignUpView
    }
  ]
})

export default router
